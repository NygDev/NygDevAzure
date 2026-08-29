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

    [Function("WhoopSync")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "whoop/sync")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        // ?type= limits the run to one collection, by either its stored name or
        // its short one — "whoop_workout" or "workout".
        var requested = request.Query["type"].FirstOrDefault();

        IReadOnlyList<WhoopCollection> collections;
        if (requested is { Length: > 0 })
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
        else
        {
            collections = WhoopCollection.All;
        }

        var budget = ResolveBudget(request.Query["seconds"].FirstOrDefault());

        // ?reset=true drops the cursors and backfills from scratch. The records
        // themselves are left alone — they are upserted by id, so a fresh
        // backfill rewrites them in place rather than duplicating them.
        var reset = request.Query["reset"].FirstOrDefault() is "true" or "1";

        return await WhoopEndpoint.RunAsync(whoop, logger, async client =>
        {
            var deadline = DateTimeOffset.UtcNow + budget;
            var results = new List<WhoopSyncResult>();

            try
            {
                foreach (var collection in collections)
                {
                    if (reset)
                    {
                        await store.DeleteStateAsync(collection, cancellationToken);
                    }

                    results.Add(await runner.SyncAsync(collection, client, deadline, cancellationToken));

                    // The budget is shared across collections, so a backfill
                    // that eats the whole run leaves the rest for the next
                    // call rather than overrunning on its behalf.
                    if (DateTimeOffset.UtcNow >= deadline)
                    {
                        break;
                    }
                }
            }
            catch (WhoopAuthException ex) when (ex.NeedsReauthorization)
            {
                // WHOOP rejected the credentials rather than failing to answer.
                // A 403 while /api/whoop/status still works means something
                // narrower: the token is good but the grant predates the read
                // scope this collection needs.
                logger.LogError(ex, "WHOOP rejected the stored credentials during a sync.");

                return new ObjectResult(new
                {
                    ok = false,
                    error = "whoop_reauthorization_required",
                    message = "WHOOP rejected the stored credentials. Open /api/whoop/authorize "
                        + $"in a browser to re-authorize; it rewrites '{WhoopSecretStore.RefreshTokenName}'.",
                    status = (int)ex.StatusCode,
                    grantedScopes = client.GrantedScopes,
                    detail = ex.ResponseBody,

                    // Whatever finished before the failure is already stored,
                    // and its cursor with it.
                    completed = results,
                })
                {
                    StatusCode = (int)HttpStatusCode.Conflict,
                };
            }
            catch (WhoopAuthException ex)
            {
                logger.LogError(ex, "A WHOOP sync failed upstream.");

                return new ObjectResult(new
                {
                    ok = false,
                    error = "whoop_upstream_error",
                    message = ex.Message,
                    detail = ex.ResponseBody,
                    completed = results,
                })
                {
                    StatusCode = (int)HttpStatusCode.BadGateway,
                };
            }
            catch (CosmosException ex)
            {
                logger.LogError(ex, "Cosmos rejected a write during a WHOOP sync.");

                return new ObjectResult(new
                {
                    ok = false,
                    error = "cosmos_write_failed",
                    message = ex.Message,
                    completed = results,
                })
                {
                    StatusCode = (int)ex.StatusCode,
                };
            }

            // Complete means every collection asked for has exhausted its
            // history and had its recent window re-read. Anything else is a
            // signal to call again.
            var complete = results.Count == collections.Count
                && results.All(r => r.BackfillComplete && !r.MoreWorkRemaining);

            return new OkObjectResult(new
            {
                ok = true,
                complete,
                message = complete
                    ? "Every collection is up to date."
                    : "The budget ran out before the backfill finished; call again to continue.",
                budgetSeconds = (int)budget.TotalSeconds,
                written = results.Sum(r => r.Written),
                collections = results,
            });
        });
    }

    private static TimeSpan ResolveBudget(string? seconds)
    {
        if (!int.TryParse(seconds, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed))
        {
            return DefaultBudget;
        }

        return TimeSpan.FromSeconds(Math.Clamp(parsed, 10, (int)MaxBudget.TotalSeconds));
    }
}
