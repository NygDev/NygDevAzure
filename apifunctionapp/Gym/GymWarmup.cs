using System.Diagnostics;
using System.Net;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Gym;

/// <summary>
/// Pays the Cosmos client's first-call costs at worker startup, while nobody is
/// waiting on them.
///
/// The gym front end pings this app without a token on every app open, and
/// Easy Auth answers that 401 before any function runs — no invocation,
/// nothing billed. It still starts an instance, and the host starts this
/// worker with it, because it asks the worker which functions exist. What the
/// ping cannot reach is anything built on first use: the CosmosClient, its
/// managed-identity token and the container's metadata were all still paid
/// for inside the first real request — the one the Today screen is waiting on,
/// billed by the 100 ms past its first second, on a quarter of a core.
///
/// This moves that work into the gap between the worker starting and that
/// request arriving, which is usually MSAL still signing in in the browser. It
/// helps a cold start without the ping too, just less: the host is still
/// indexing functions when this begins.
///
/// Fire-and-forget. Startup does not wait for it, and failing costs only the
/// saving — the first request builds whatever is missing, as it always did.
/// </summary>
internal sealed class GymWarmup(IServiceProvider services, ILogger<GymWarmup> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Off the startup thread before anything is resolved. Building the
        // client and its credential is synchronous, and until the first await
        // it would run on the thread starting the host — in front of the
        // worker's handshake with it, which a request that caused the cold
        // start is waiting on.
        await Task.Yield();

        var started = Stopwatch.GetTimestamp();

        try
        {
            var status = await services.GetRequiredService<GymStore>().WarmUpAsync(stoppingToken);
            var elapsed = Stopwatch.GetElapsedTime(started).TotalMilliseconds;

            if (status == HttpStatusCode.NotFound)
            {
                logger.LogInformation("Warmed the Cosmos client in {Elapsed:0} ms.", elapsed);
            }
            else
            {
                // Anything but the expected 404 is the first request's failure
                // arriving early — a 403 is the role assignment on db/gym —
                // and worth seeing before a user trips over it.
                logger.LogWarning(
                    "Cosmos answered the warm-up read with {Status} after {Elapsed:0} ms.",
                    (int)status,
                    elapsed);
            }
        }
        // Everything but shutdown, including a stray TaskCanceledException from
        // an HTTP timeout underneath. An exception escaping ExecuteAsync stops
        // the host by default, and this is the last thing worth losing the
        // worker over.
        catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
        {
            logger.LogWarning(ex, "Warming the Cosmos client failed; the first request will build what is missing.");
        }
    }
}
