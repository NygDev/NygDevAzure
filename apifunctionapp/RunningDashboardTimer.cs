using ApiFunctionApp.Running;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// The rebuild of the marathon dashboard, four times a day: the whole
/// document, from whatever is in Cosmos by the time it runs.
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
/// or a change to the arithmetic that should not wait for the next slot.
///
/// Rebuilding this often is safe because the build is a pure function of the
/// stored runs and the day it is bounded by: a slot that finds no new run
/// republishes byte-for-byte what is already there. The published blob carries
/// a five-minute Cache-Control, so every rebuild is visible to the page well
/// before the next one.
/// </summary>
public class RunningDashboardTimer(
    RunningDashboardBuilder dashboard,
    ILogger<RunningDashboardTimer> logger)
{
    /// <summary>
    /// 00:15, 06:15, 12:15 and 18:15 UTC — fifteen minutes behind each WHOOP
    /// sync, in the same platform clock and with the same standing
    /// indifference to daylight saving that <see cref="WhoopSyncTimer"/>
    /// explains.
    ///
    /// Fifteen rather than five: the sync runs on a ten-minute budget, so by
    /// this point it has either finished or stopped itself and saved its
    /// cursor. Nothing enforces that ordering — these are two independent
    /// timers, not a chain — and nothing needs to. A rebuild that overlapped a
    /// sync still reads a consistent set of documents out of Cosmos; the worst
    /// it could do is miss the last few workouts of a run that overran, which
    /// the next slot picks up six hours later rather than tomorrow.
    ///
    /// The 00:15 slot is the one that does something the others do not. The
    /// series are bounded by today in the time zone of the most recent run, so
    /// that is the rebuild where the day rolls over: the daily walk gains an
    /// empty day, the acute window drops the day that fell off the back of it,
    /// and the current ACWR ratio steps down before the day's running climbs
    /// it again. That is the same partial-day arithmetic the once-daily build
    /// already published — it is now just visible as it happens rather than
    /// once each morning.
    /// </summary>
    private const string Schedule = "0 15 */6 * * *";

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
                + "build. The next slot retries in six hours; /api/running/dashboard retries now, and "
                + "answers with what storage or Cosmos objected to.",
                dashboard.PublishedTo);

            throw;
        }
    }
}
