using System.Globalization;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// Syncs WHOOP's collections — cycles, sleep, workouts, recovery — into Cosmos,
/// on demand.
///
/// The first runs backfill history, newest first, and each run picks up where
/// the last one stopped. Once a collection's history is exhausted every later
/// run re-reads a short recent window instead, which is what catches records
/// WHOOP rescored after they were first stored.
///
/// Call it repeatedly until the response says complete. The response is the
/// progress report: how many records each collection wrote, whether its
/// backfill has finished, and how far back it has got.
///
/// The unattended half of the same job is <see cref="WhoopSyncTimer"/>; both
/// go through <see cref="WhoopSyncRunner.TrySyncAllAsync"/>, which is what
/// keeps a manual call and the morning run from colliding.
/// </summary>
public class WhoopSync(
    WhoopSyncRunner runner,
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

        return await WhoopEndpoint.RunAsync(whoop, logger, async client =>
        {
            var results = await runner.TrySyncAllAsync(
                collections,
                client,
                DateTimeOffset.UtcNow + budget,
                refreshWindow,
                reset,
                cancellationToken);

            if (results is null)
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
