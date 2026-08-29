using ApiFunctionApp.Whoop;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// The morning WHOOP sync: every collection into Cosmos at 09:00 Oslo time,
/// unattended.
///
/// It does the same work as <see cref="WhoopSync"/> and shares its runner, so
/// the two cannot overlap. Whatever the night produced — last night's sleep,
/// this morning's recovery, yesterday's workouts — is stored by the time
/// anything reads it, and the seven-day refresh window means a day this misses
/// is picked up by the next run rather than lost.
/// </summary>
public class WhoopSyncTimer(
    WhoopSyncRunner runner,
    Lazy<WhoopClient> whoop,
    ILogger<WhoopSyncTimer> logger)
{
    /// <summary>
    /// 07:00 and 08:00 UTC — the two hours 09:00 in Oslo falls on, summer and
    /// winter. NCRONTAB is read in UTC, and the setting that would move it to
    /// another zone, WEBSITE_TIME_ZONE, is unsupported on Linux under Flex
    /// Consumption: Microsoft's guidance is that setting it there causes TLS
    /// errors and stops the app's metrics. So the schedule fires twice and the
    /// hour check below drops whichever firing is 08:00 or 10:00 locally.
    /// </summary>
    private const string Schedule = "0 0 7,8 * * *";

    private const int OsloHour = 9;

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
        var local = OsloTime.From(DateTimeOffset.UtcNow);

        if (local.Hour != OsloHour)
        {
            // The other of the two firings. A firing delayed past the hour is
            // dropped here too; that costs a day at most, because the next
            // run's refresh window reaches back a week.
            logger.LogInformation(
                "Skipping the {Local:HH:mm} Oslo firing; the WHOOP sync runs at {Hour:00}:00 local.",
                local,
                OsloHour);

            return;
        }

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

            return;
        }

        logger.LogInformation(
            "The scheduled WHOOP sync wrote {Written} records across {Total} collections; "
            + "more work remaining: {More}.",
            written,
            results.Count,
            results.Any(r => !r.BackfillComplete || r.MoreWorkRemaining));
    }
}
