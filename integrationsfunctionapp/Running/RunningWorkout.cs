using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Text.Json;

namespace ApiFunctionApp.Running;

/// <summary>
/// How long a workout spent in each of WHOOP's six heart-rate zones.
///
/// Zone zero is everything below 50% of max heart rate — standing at a
/// crossing, walking back to the door. It is kept because it is part of the
/// elapsed time and dropping it silently would make the totals not add up, but
/// it is excluded from every share and from the zone stack: it says nothing
/// about how hard the run was.
/// </summary>
public readonly record struct ZoneDurations(
    TimeSpan Zone0,
    TimeSpan Zone1,
    TimeSpan Zone2,
    TimeSpan Zone3,
    TimeSpan Zone4,
    TimeSpan Zone5)
{
    public static readonly ZoneDurations Empty = new(
        TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero, TimeSpan.Zero);

    /// <summary>Easy aerobic work: 50-70% of max heart rate.</summary>
    public TimeSpan Zone1To2 => Zone1 + Zone2;

    /// <summary>Everything from 70% of max upward — the stacked bar's other half.</summary>
    public TimeSpan Zone3Plus => Zone3 + Zone4 + Zone5;

    /// <summary>80% of max and up, which is what separates hard from merely brisk.</summary>
    public TimeSpan Zone4Plus => Zone4 + Zone5;

    /// <summary>Zones one to five: the denominator every share is taken over.</summary>
    public TimeSpan InZones => Zone1To2 + Zone3Plus;

    /// <summary>Every zone including zero — the whole span the strap recorded.</summary>
    public TimeSpan Recorded => Zone0 + InZones;

    public static ZoneDurations operator +(ZoneDurations a, ZoneDurations b) => new(
        a.Zone0 + b.Zone0,
        a.Zone1 + b.Zone1,
        a.Zone2 + b.Zone2,
        a.Zone3 + b.Zone3,
        a.Zone4 + b.Zone4,
        a.Zone5 + b.Zone5);

    /// <summary>
    /// Reads a WHOOP <c>zone_durations</c> object. A missing zone counts as
    /// zero rather than failing the whole read: a run with partial zone data
    /// still has a distance and a duration worth charting.
    /// </summary>
    public static ZoneDurations Read(JsonElement zones)
    {
        if (zones.ValueKind != JsonValueKind.Object)
        {
            return Empty;
        }

        return new ZoneDurations(
            Milliseconds(zones, "zone_zero_milli"),
            Milliseconds(zones, "zone_one_milli"),
            Milliseconds(zones, "zone_two_milli"),
            Milliseconds(zones, "zone_three_milli"),
            Milliseconds(zones, "zone_four_milli"),
            Milliseconds(zones, "zone_five_milli"));
    }

    private static TimeSpan Milliseconds(JsonElement zones, string name) =>
        zones.TryGetProperty(name, out var value)
            && value.ValueKind == JsonValueKind.Number
            && value.TryGetDouble(out var milli)
            && milli > 0
            ? TimeSpan.FromMilliseconds(milli)
            : TimeSpan.Zero;
}

/// <summary>
/// One stored <c>whoop_workout</c> document, reduced to the fields the running
/// charts are computed from.
///
/// The sync stores WHOOP's records untouched, which is the right shape for
/// storage and the wrong one for arithmetic: distances are metres, zone
/// durations are milliseconds, times are UTC with the local offset carried
/// beside them, and the score object is absent or half-filled while WHOOP is
/// still scoring. All of that is resolved once, here, so that everything
/// downstream works in kilometres, minutes and local dates.
/// </summary>
public sealed record RunningWorkout
{
    /// <summary>
    /// The sport name a workout has to carry to count as a run. WHOOP names
    /// sports as free text, so this is the line to widen if trail or treadmill
    /// runs ever arrive under a name of their own.
    /// </summary>
    public const string SportName = "running";

    /// <summary>
    /// Below this a "run" is a false start or a strap that caught a walk to the
    /// bus — short enough that its pace is noise, and including it would drag
    /// the weekly figures around for no reason.
    /// </summary>
    private const double MinimumDistanceKm = 0.4;

    public required string Id { get; init; }

    /// <summary>When the run started, in the time zone it was run in.</summary>
    public required DateTimeOffset Start { get; init; }

    /// <summary>
    /// The day the run belongs to, locally. Weeks are bucketed on this rather
    /// than on the UTC date, so a 22:30 run in Oslo lands on the evening it was
    /// actually run rather than on the next morning.
    /// </summary>
    public required DateOnly LocalDate { get; init; }

    public required double DistanceKm { get; init; }

    /// <summary>
    /// Wall-clock time from start to end, not the sum of the zone durations.
    /// The two agree on a clean recording, and where they disagree it is
    /// because the strap lost contact — in which case the elapsed time is the
    /// honest denominator for a pace and the zone sum would flatter it.
    /// </summary>
    public required TimeSpan Duration { get; init; }

    public int? AverageHeartRate { get; init; }

    public int? MaxHeartRate { get; init; }

    public required ZoneDurations Zones { get; init; }

    public required RunType Type { get; init; }

    public double PaceMinutesPerKm => Duration.TotalMinutes / DistanceKm;

    public double MetresPerMinute => DistanceKm * 1000 / Duration.TotalMinutes;

    /// <summary>
    /// Speed per heartbeat: metres covered per minute for each beat per minute
    /// it cost. The same pace at a lower heart rate — or a faster one at the
    /// same heart rate — raises it, which is why it reads as aerobic fitness
    /// where a raw pace only reads as effort.
    ///
    /// Null when WHOOP recorded no average heart rate, which is the whole
    /// denominator.
    /// </summary>
    public double? EfficiencyFactor =>
        AverageHeartRate is > 0 and var bpm ? MetresPerMinute / bpm : null;

    /// <summary>
    /// Reads one document as projected by <see cref="RunningStore"/>, or
    /// explains why it cannot be used.
    ///
    /// Nothing here throws. A workout that arrived mid-scoring, or that WHOOP
    /// recorded without a distance, is a normal thing to find in the container
    /// and should cost the dashboard that one run rather than the whole build.
    /// </summary>
    public static bool TryRead(
        JsonElement document,
        [NotNullWhen(true)] out RunningWorkout? run,
        [NotNullWhen(false)] out string? reason)
    {
        run = null;

        if (document.ValueKind != JsonValueKind.Object)
        {
            reason = "not_an_object";
            return false;
        }

        if (ReadString(document, "id") is not { Length: > 0 } id)
        {
            reason = "no_id";
            return false;
        }

        if (ReadTime(document, "started_at") is not { } start)
        {
            reason = "no_start";
            return false;
        }

        // WHOOP scores a workout after it ends, so a stored copy taken mid-run
        // can carry a score with no distance in it yet. Absent rather than
        // wrong: the next sync brings the finished figures.
        if (!document.TryGetProperty("score", out var score) || score.ValueKind != JsonValueKind.Object)
        {
            reason = "no_score";
            return false;
        }

        var distanceKm = ReadDouble(score, "distance_meter") / 1000;

        if (!double.IsFinite(distanceKm) || distanceKm < MinimumDistanceKm)
        {
            reason = "no_distance";
            return false;
        }

        var zones = score.TryGetProperty("zone_durations", out var zoneDurations)
            ? ZoneDurations.Read(zoneDurations)
            : ZoneDurations.Empty;

        // The zone sum stands in when the end timestamp is missing or ahead of
        // nothing useful; it is the only other record of how long the run took.
        var duration = ReadTime(document, "ended_at") is { } end && end > start
            ? end - start
            : zones.Recorded;

        if (duration <= TimeSpan.Zero)
        {
            reason = "no_duration";
            return false;
        }

        var offset = ReadOffset(ReadString(document, "timezone_offset")) ?? TimeSpan.Zero;
        var localStart = start.ToOffset(offset);

        run = new RunningWorkout
        {
            Id = id,
            Start = localStart,
            LocalDate = DateOnly.FromDateTime(localStart.DateTime),
            DistanceKm = distanceKm,
            Duration = duration,
            AverageHeartRate = ReadInt(score, "average_heart_rate"),
            MaxHeartRate = ReadInt(score, "max_heart_rate"),
            Zones = zones,
            Type = RunTypes.Classify(duration, distanceKm, zones),
        };

        reason = null;
        return true;
    }

    private static string? ReadString(JsonElement element, string name) =>
        element.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;

    private static double ReadDouble(JsonElement element, string name) =>
        element.TryGetProperty(name, out var value)
            && value.ValueKind == JsonValueKind.Number
            && value.TryGetDouble(out var number)
            ? number
            : 0;

    private static int? ReadInt(JsonElement element, string name) =>
        element.TryGetProperty(name, out var value)
            && value.ValueKind == JsonValueKind.Number
            && value.TryGetInt32(out var number)
            && number > 0
            ? number
            : null;

    /// <summary>
    /// Parsed rather than compared as text, for the same reason the sync parses
    /// its cursor timestamps: WHOOP's ISO 8601 output does not promise a fixed
    /// number of fractional digits.
    /// </summary>
    private static DateTimeOffset? ReadTime(JsonElement element, string name) =>
        ReadString(element, name) is { Length: > 0 } text
            && DateTimeOffset.TryParse(
                text, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var parsed)
            ? parsed
            : null;

    /// <summary>
    /// WHOOP's <c>timezone_offset</c>, as "+02:00" or "-05:00". Parsed by hand
    /// because it is an offset on its own rather than part of a timestamp, and
    /// because the sign has to be read separately: TimeSpan's own parser reads
    /// "-05:00" as minus five hours but "+05:00" not at all.
    /// </summary>
    private static TimeSpan? ReadOffset(string? text)
    {
        if (text is not { Length: > 1 } || text[0] is not ('+' or '-'))
        {
            return null;
        }

        if (!TimeSpan.TryParseExact(
                text[1..], @"hh\:mm", CultureInfo.InvariantCulture, out var magnitude))
        {
            return null;
        }

        return text[0] == '-' ? -magnitude : magnitude;
    }
}
