using System.Globalization;
using System.Net;
using ApiFunctionApp.Whoop;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// Syncs WHOOP's collections — cycles, sleep, workouts, recovery — into Cosmos.
///
/// The first runs backfill history, newest first, and each run picks up where
/// the last one stopped. Once a collection's history is exhausted every later
/// run re-reads a short recent window instead, which is what catches records
/// WHOOP rescored after they were first stored.
///
/// Call it repeatedly until the response says complete. The response is the
/// progress report: how many records each collection wrote, whether its
/// backfill has finished, and how far back it has got.
/// </summary>
public class WhoopSync(
    WhoopSyncRunner runner,
    WhoopStore store,
    Lazy<WhoopClient> whoop,
    ILogger<WhoopSync> logger)
{
    /// <summary>
    /// How long a run may spend before saving its cursor and returning.
    ///
    /// An HTTP-triggered function is cut off by Azure's load balancer at 230
    /// seconds with no chance to write anything, so the budget has to leave
    /// room for the final cursor write and the response. 100 seconds is well
    /// inside that and still gets through a few hundred records a call.
    /// </summary>
    private static readonly TimeSpan DefaultBudget = TimeSpan.FromSeconds(100);

    private static readonly TimeSpan MaxBudget = TimeSpan.FromSeconds(200);

    /// <summary>
    /// One sync at a time. Two overlapping runs would read the same cursor,
    /// fetch the same pages and race each other writing it back, so the second
    /// caller is turned away rather than queued — by the time a run finishes,
    /// whatever the second caller wanted is already done. Static because the
    /// worker builds a new instance per invocation, and the app is capped at
    /// maximum_instance_count = 1, so one process is the whole story.
    /// </summary>
    private static readonly SemaphoreSlim SyncGate = new(1, 1);

    [Function("WhoopSync")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "whoop/sync")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        // ?type= limits the run to one collection, by either its stored name or
        // its short one — "whoop_workout" or "workout". Absent, every one runs.
        var collections = WhoopCollection.All;

        if (request.Query["type"].FirstOrDefault() is { Length: > 0 } requested)
        {
            if (WhoopCollection.Find(requested) is not { } only)
            {
                return new BadRequestObjectResult(new
                {
                    ok = false,
                    error = "unknown_type",
                    message = $"No WHOOP collection called '{requested}'.",
                    known = WhoopCollection.All.Select(c => c.Type),
                });
            }

            collections = [only];
        }

        var budget = ResolveBudget(request.Query["seconds"].FirstOrDefault());

        // ?days= widens how far back an incremental run re-reads. The default
        // catches ordinary rescoring; a longer outage needs more.
        var refreshWindow = ResolveRefreshWindow(request.Query["days"].FirstOrDefault());

        // ?reset=true drops the cursors and backfills from scratch. The records
        // themselves are left alone — they are upserted by id, so a fresh
        // backfill rewrites them in place rather than duplicating them.
        var reset = request.Query["reset"].FirstOrDefault() is "true" or "1";

        if (!await SyncGate.WaitAsync(TimeSpan.Zero, cancellationToken))
        {
            logger.LogInformation("A WHOOP sync is already running; declining to start a second.");

            return new ObjectResult(new
            {
                ok = false,
                error = "sync_in_progress",
                message = "A WHOOP sync is already running on this instance. Try again when it finishes.",
            })
            {
                StatusCode = (int)HttpStatusCode.Conflict,
            };
        }

        try
        {
            return await WhoopEndpoint.RunAsync(whoop, logger, async client =>
            {
                var deadline = DateTimeOffset.UtcNow + budget;
                var results = new List<WhoopSyncResult>();

                foreach (var collection in collections)
                {
                    // Each collection is isolated: one that fails should not
                    // cost the others their run. This is what makes an
                    // unattended sync worth scheduling — a WHOOP hiccup on
                    // recovery still leaves cycles, sleep and workouts current.
                    try
                    {
                        if (reset)
                        {
                            await store.DeleteStateAsync(collection, cancellationToken);
                        }

                        results.Add(await runner.SyncAsync(
                            collection, client, deadline, refreshWindow, cancellationToken));
                    }
                    catch (WhoopAuthException ex) when (ex.NeedsReauthorization)
                    {
                        logger.LogError(ex, "WHOOP rejected the stored credentials during a sync.");

                        results.Add(WhoopSyncResult.Failed(
                            collection, "whoop_reauthorization_required", ex.ResponseBody ?? ex.Message));

                        // Every remaining collection would fail the same way on
                        // the same credentials, so there is nothing to gain by
                        // asking WHOOP three more times.
                        break;
                    }
                    catch (WhoopAuthException ex)
                    {
                        logger.LogError(ex, "Syncing {Type} failed upstream.", collection.Type);
                        results.Add(WhoopSyncResult.Failed(
                            collection, "whoop_upstream_error", ex.ResponseBody ?? ex.Message));
                    }
                    catch (CosmosException ex)
                    {
                        logger.LogError(ex, "Cosmos rejected a {Type} write.", collection.Type);
                        results.Add(WhoopSyncResult.Failed(collection, "cosmos_write_failed", ex.Message));
                    }
                    catch (Exception ex) when (ex is not OperationCanceledException)
                    {
                        logger.LogError(ex, "Syncing {Type} failed.", collection.Type);
                        results.Add(WhoopSyncResult.Failed(collection, "unexpected_error", ex.Message));
                    }

                    // The budget is shared across collections, so a backfill
                    // that eats the whole run leaves the rest for the next call
                    // rather than overrunning on their behalf.
                    if (DateTimeOffset.UtcNow >= deadline)
                    {
                        break;
                    }
                }

                var failed = results.Count(r => r.Error is not null);

                // Complete means every collection asked for has exhausted its
                // history and had its recent window re-read. Anything else is a
                // signal to call again.
                var complete = failed == 0
                    && results.Count == collections.Count
                    && results.All(r => r.BackfillComplete && !r.MoreWorkRemaining);

                var payload = new
                {
                    ok = failed == 0,
                    complete,
                    message = failed > 0
                        ? $"{failed} of {results.Count} collections failed; the rest are stored."
                        : complete
                            ? "Every collection is up to date."
                            : "The budget ran out before the backfill finished; call again to continue.",
                    budgetSeconds = (int)budget.TotalSeconds,
                    refreshDays = (int)refreshWindow.TotalDays,
                    written = results.Sum(r => r.Written),
                    collections = results,
                };

                if (failed == 0)
                {
                    return new OkObjectResult(payload);
                }

                // A credentials failure is the one a caller can act on, so it
                // keeps its own status; anything else is reported as upstream.
                return new ObjectResult(payload)
                {
                    StatusCode = results.Any(r => r.Error == "whoop_reauthorization_required")
                        ? (int)HttpStatusCode.Conflict
                        : (int)HttpStatusCode.BadGateway,
                };
            });
        }
        finally
        {
            SyncGate.Release();
        }
    }

    private static TimeSpan ResolveBudget(string? seconds)
    {
        if (!int.TryParse(seconds, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed))
        {
            return DefaultBudget;
        }

        return TimeSpan.FromSeconds(Math.Clamp(parsed, 10, (int)MaxBudget.TotalSeconds));
    }

    private static TimeSpan ResolveRefreshWindow(string? days)
    {
        if (!int.TryParse(days, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed))
        {
            return WhoopSyncRunner.DefaultRefreshWindow;
        }

        return TimeSpan.FromDays(Math.Clamp(parsed, 1, 90));
    }
}
