using ApiFunctionApp.Whoop;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// The unattended WHOOP sync: every collection into Cosmos, four times a day.
///
/// It does the same work as <see cref="WhoopSync"/> and shares its runner, so
/// the two cannot overlap. Whatever the night produced — last night's sleep,
/// this morning's recovery, yesterday's workouts — is stored by the time
/// anything reads it, and the seven-day refresh window means a day this misses
/// is picked up by the next run rather than lost.
///
/// Repeating it costs nothing and cannot compound: an incremental run re-reads
/// the same seven days from scratch and upserts each record on its own id, so
/// a run that finds nothing new writes the same documents back. What the extra
/// runs buy is WHOOP's own lateness — a sleep scored after you wake, a workout
/// that arrives PENDING_SCORE and is scored a few minutes later — reaching
/// Cosmos in hours rather than waiting for tomorrow.
///
/// Storing is all it does. The marathon dashboard built from these workouts is
/// rebuilt by <see cref="RunningDashboardTimer"/> a quarter of an hour later,
/// on a timer of its own, so that neither job's failure is reported as the
/// other's.
/// </summary>
public class WhoopSyncTimer(
    WhoopSyncRunner runner,
    Lazy<WhoopClient> whoop,
    ILogger<WhoopSyncTimer> logger)
{
    /// <summary>
    /// 00:00, 06:00, 12:00 and 18:00 UTC — the platform's own clock, which is
    /// what Functions reads an NCRONTAB expression in.
    ///
    /// 06:00 is the one that matters: 08:00 in Oslo through the summer and
    /// 07:00 through the winter, which is the first run of the day that can
    /// see the night. It is deliberately not the only chance at it. A night
    /// that has not settled on WHOOP's side by then — a late morning, a
    /// recovery still being scored — is picked up at 12:00 the same day
    /// instead of being a day stale, which is what one daily run could not do.
    ///
    /// Nothing here tracks daylight saving, deliberately: the setting that
    /// would move the schedule to a named zone, WEBSITE_TIME_ZONE, is
    /// unsupported on Linux under Flex Consumption, and converting in code
    /// costs more than the drifting hour is worth — the more so at six-hour
    /// spacing, where an hour either way changes nothing.
    /// </summary>
    private const string Schedule = "0 0 */6 * * *";

    /// <summary>
    /// Long enough to finish a backfill that a manual run left unfinished, and
    /// far enough inside Flex Consumption's 30-minute function timeout that the
    /// run ends by saving its cursor rather than by being killed. Well inside
    /// the six hours to the next run, too, so a long backfill slice is never
    /// still holding the gate when the following one fires.
    ///
    /// A timer has no load balancer over it, so unlike the HTTP endpoint's 100
    /// seconds this is not bounded at 230.
    /// </summary>
    private static readonly TimeSpan Budget = TimeSpan.FromMinutes(10);

    [Function("WhoopSyncTimer")]
    public async Task Run([TimerTrigger(Schedule)] TimerInfo timer, CancellationToken cancellationToken)
    {
        WhoopClient client;
        try
        {
            client = whoop.Value;
        }
        catch (InvalidOperationException ex)
        {
            // Constructing the client reads the app settings. The HTTP
            // endpoints answer this in words through WhoopEndpoint; a timer has
            // nobody to answer, so the log is the whole report.
            logger.LogError(
                ex,
                "The scheduled WHOOP sync cannot run: WHOOP is not configured on this function app. "
                + "KEY_VAULT_URI and WHOOP_CLIENT_ID are set by terraform, in terraform/consumption.tf.");

            return;
        }

        if (timer.IsPastDue)
        {
            logger.LogWarning("The scheduled WHOOP sync is running late; the app was likely asleep.");
        }

        var results = await runner.TrySyncAllAsync(
            WhoopCollection.All,
            client,
            DateTimeOffset.UtcNow + Budget,
            WhoopSyncRunner.DefaultRefreshWindow,
            reset: false,
            cancellationToken);

        if (results is null)
        {
            // Someone called /api/whoop/sync by hand as this fired. Their run
            // covers the same ground, so there is nothing left to do.
            logger.LogInformation("A WHOOP sync was already running; the scheduled run stood down.");

            return;
        }

        var written = results.Sum(r => r.Written);
        var failures = results.Where(r => r.Error is not null).ToList();

        if (failures.Count > 0)
        {
            // Logged as an error rather than thrown. The collections that did
            // sync are stored either way, and the invocation genuinely did what
            // it could; this is the record to alert on.
            logger.LogError(
                "The scheduled WHOOP sync wrote {Written} records but {Failed} of {Total} collections "
                + "failed: {Failures}.",
                written,
                failures.Count,
                results.Count,
                string.Join(", ", failures.Select(f => $"{f.Type} ({f.Error})")));
        }
        else
        {
            logger.LogInformation(
                "The scheduled WHOOP sync wrote {Written} records across {Total} collections; "
                + "more work remaining: {More}.",
                written,
                results.Count,
                results.Any(r => !r.BackfillComplete || r.MoreWorkRemaining));
        }
    }
}
