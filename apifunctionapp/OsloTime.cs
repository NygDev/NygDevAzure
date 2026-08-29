namespace ApiFunctionApp;

/// <summary>
/// Local time in Oslo, for the one thing in this app that needs it: deciding
/// whether a timer firing is the 09:00 one.
///
/// The NCRONTAB expression cannot answer that on its own. Functions reads CRON
/// in UTC unless <c>WEBSITE_TIME_ZONE</c> says otherwise, and that setting is
/// not supported on Linux under Flex Consumption — Microsoft's guidance is that
/// setting it there causes TLS errors and stops the app's metrics. So the
/// schedule fires at both UTC hours 09:00 Oslo can fall on, and this is what
/// tells them apart.
/// </summary>
internal static class OsloTime
{
    /// <summary>
    /// The tz database name. .NET has mapped IANA ids to Windows ones since
    /// .NET 6, so this resolves on a developer's Windows machine as well.
    /// </summary>
    private const string ZoneId = "Europe/Oslo";

    private static readonly Lazy<TimeZoneInfo?> Zone = new(() =>
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById(ZoneId);
        }
        catch (Exception ex) when (ex is TimeZoneNotFoundException or InvalidTimeZoneException)
        {
            // A host image built without the tz database. Failing here would
            // mean the hour check never matches and the sync silently never
            // runs, so fall through to the rule below instead.
            return null;
        }
    });

    /// <summary>The same instant, as Oslo reads it off a clock.</summary>
    public static DateTimeOffset From(DateTimeOffset utc) =>
        Zone.Value is { } zone
            ? TimeZoneInfo.ConvertTime(utc, zone)
            : utc.ToOffset(FallbackOffset(utc));

    /// <summary>
    /// Norway's offset under the EU rule that defines it: UTC+01:00, and
    /// UTC+02:00 from 01:00 UTC on the last Sunday in March until 01:00 UTC on
    /// the last Sunday in October. Only reached when the platform has no tz
    /// database to read the same rule out of — the framework's copy is the one
    /// that survives the rule being changed.
    /// </summary>
    private static TimeSpan FallbackOffset(DateTimeOffset utc)
    {
        var instant = utc.UtcDateTime;

        return instant >= LastSundayAtOneUtc(instant.Year, 3)
            && instant < LastSundayAtOneUtc(instant.Year, 10)
                ? TimeSpan.FromHours(2)
                : TimeSpan.FromHours(1);
    }

    private static DateTime LastSundayAtOneUtc(int year, int month)
    {
        var lastDay = new DateTime(
            year, month, DateTime.DaysInMonth(year, month), 1, 0, 0, DateTimeKind.Utc);

        // DayOfWeek counts Sunday as 0, so this walks back to the last one.
        return lastDay.AddDays(-(int)lastDay.DayOfWeek);
    }
}
