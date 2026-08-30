using ApiFunctionApp.Running;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// The morning rebuild of the marathon dashboard: the whole document, from
/// whatever is in Cosmos by the time it runs.
///
/// It is the second half of the morning, deliberately on its own schedule
/// rather than hanging off the end of <see cref="WhoopSyncTimer"/>. The two
/// jobs fail for unrelated reasons — one talks to WHOOP, the other to Cosmos
/// and blob storage — and separating them means a sync that fell over does not
/// take the rebuild with it, a rebuild that fell over is a failed invocation of
/// its own rather than a line in the sync's log, and either can be re-run
/// without the other.
///
/// The rebuild does not need the sync to have succeeded, only to have finished:
/// it reads the stored runs, not the run's writes, so a morning where WHOOP was
/// unreachable still republishes yesterday's history against today's date.
/// <see cref="RunningDashboard"/> is the same build on demand, for a backfill
/// or a change to the arithmetic that should not wait until tomorrow.
/// </summary>
public class RunningDashboardTimer(
    RunningDashboardBuilder dashboard,
    ILogger<RunningDashboardTimer> logger)
{
    /// <summary>
    /// 07:15 UTC, daily — fifteen minutes behind the WHOOP sync at 07:00, in
    /// the same platform clock and with the same standing indifference to
    /// daylight saving that <see cref="WhoopSyncTimer"/> explains.
    ///
    /// Fifteen rather than five: the sync runs on a ten-minute budget, so by
    /// this point it has either finished or stopped itself and saved its
    /// cursor. Nothing enforces that ordering — these are two independent
    /// timers, not a chain — and nothing needs to. A rebuild that overlapped a
    /// sync still reads a consistent set of documents out of Cosmos; the worst
    /// it could do is miss the last few workouts of a run that overran, which
    /// tomorrow's rebuild picks up.
    /// </summary>
    private const string Schedule = "0 15 7 * * *";

    [Function("RunningDashboardTimer")]
    public async Task Run([TimerTrigger(Schedule)] TimerInfo timer, CancellationToken cancellationToken)
    {
        if (timer.IsPastDue)
        {
            logger.LogWarning("The scheduled dashboard rebuild is running late; the app was likely asleep.");
        }

        try
        {
            // The builder logs what it published, so there is nothing to add on
            // the way out.
            await dashboard.BuildAsync(cancellationToken);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            // Rethrown, unlike the rebuild this replaced: there it was the
            // recoverable half of a sync invocation and failing the run would
            // have misreported the sync. Here it is the whole invocation, and a
            // failed invocation is the signal worth having. The blob still
            // holds the previous build until this succeeds, and
            // /api/running/dashboard answers a retry in words rather than a
            // stack trace.
            logger.LogError(
                ex,
                "The scheduled rebuild of the marathon dashboard failed; {Uri} still holds the previous "
                + "build. Call /api/running/dashboard to retry and to see what storage or Cosmos objected to.",
                dashboard.PublishedTo);

            throw;
        }
    }
}
