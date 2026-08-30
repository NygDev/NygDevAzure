using ApiFunctionApp.Whoop;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// The morning WHOOP sync: every collection into Cosmos once a day,
/// unattended.
///
/// It does the same work as <see cref="WhoopSync"/> and shares its runner, so
/// the two cannot overlap. Whatever the night produced — last night's sleep,
/// this morning's recovery, yesterday's workouts — is stored by the time
/// anything reads it, and the seven-day refresh window means a day this misses
/// is picked up by the next run rather than lost.
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
    /// 07:00 UTC, daily — the platform's own clock, which is what Functions
    /// reads an NCRONTAB expression in.
    ///
    /// That is 09:00 in Oslo through the summer and 08:00 through the winter;
    /// the hour it lands on matters less than that it lands after the night's
    /// data has settled on WHOOP's side. Nothing here tracks daylight saving,
    /// deliberately: the setting that would move the schedule to a named zone,
    /// WEBSITE_TIME_ZONE, is unsupported on Linux under Flex Consumption, and
    /// converting in code costs more than the drifting hour is worth.
    /// </summary>
    private const string Schedule = "0 0 7 * * *";

    /// <summary>
    /// Long enough to finish a backfill that a manual run left unfinished, and
    /// far enough inside Flex Consumption's 30-minute function timeout that the
    /// run ends by saving its cursor rather than by being killed.
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
