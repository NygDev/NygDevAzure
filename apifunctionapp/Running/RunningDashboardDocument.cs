namespace ApiFunctionApp.Running;

/// <summary>
/// The <c>dashboard</c> document: everything the running dashboard draws, in
/// the order the charts appear on it.
///
/// One document rather than five. The container is partitioned on /type with
/// indexing off, so a reader's only cheap operation is a point read — and a
/// point read of this id returns every chart at once, already computed, for a
/// single-digit RU charge. That is the whole reason the arithmetic happens
/// here on a schedule rather than in the browser on every page load.
///
/// Every series is rebuilt from the full workout history on each run, so this
/// document is a projection and never a source: it can be deleted and
/// regenerated, and a changed threshold reshapes the whole of it rather than
/// only its recent end.
/// </summary>
public sealed record RunningDashboardDocument
{
    public const string DocumentId = "dashboard";

    /// <summary>Its own partition, separate from the WHOOP records it is built from.</summary>
    public const string DocumentType = "dashboard";

    public string Id { get; init; } = DocumentId;

    public string Type { get; init; } = DocumentType;

    /// <summary>When this build ran, as distinct from the day it describes.</summary>
    public required DateTimeOffset GeneratedAt { get; init; }

    /// <summary>
    /// The last day covered by the daily and weekly series — today, in the time
    /// zone of the most recent run. The series run up to it rather than
    /// stopping at the last run, because a week without running is a real data
    /// point on all of these charts: volume falls, and so does the chronic load
    /// underneath the ACWR.
    /// </summary>
    public required DateOnly AsOf { get; init; }

    public required RunningSource Source { get; init; }

    public required PaceChart Pace { get; init; }

    public required EfficiencyChart EfficiencyFactor { get; init; }

    public required WeeklyVolumeChart WeeklyVolume { get; init; }

    public required AcwrChart Acwr { get; init; }

    public required WeeklyZoneChart WeeklyZones { get; init; }
}

/// <summary>What the build read, so a surprising chart can be traced to its input.</summary>
public sealed record RunningSource
{
    public required int Runs { get; init; }

    /// <summary>
    /// Workouts read from the container that could not be used, by reason —
    /// "no_distance", "no_score" and the rest. Normally small and steady; a
    /// jump in it is the first sign that something upstream changed shape.
    /// </summary>
    public required IReadOnlyDictionary<string, int> Skipped { get; init; }

    public DateOnly? FirstRun { get; init; }

    public DateOnly? LastRun { get; init; }

    public required double TotalKm { get; init; }
}

/// <summary>Chart 1 — pace over time, one series per run type.</summary>
public sealed record PaceChart
{
    public string Unit { get; init; } = "min/km";

    /// <summary>
    /// Every run type, in a fixed order, whether or not it has points this
    /// time. A series that empties out should leave a gap in the legend rather
    /// than silently renumbering the colours of the ones beside it.
    /// </summary>
    public required IReadOnlyList<PaceSeries> Series { get; init; }
}

public sealed record PaceSeries
{
    public required string RunType { get; init; }

    public required IReadOnlyList<PacePoint> Points { get; init; }
}

public sealed record PacePoint
{
    public required string WorkoutId { get; init; }

    public required DateOnly Date { get; init; }

    public required DateTimeOffset Start { get; init; }

    /// <summary>
    /// Decimal minutes per kilometre — 5.798, not 5:48. Left as a number
    /// because an axis has to do arithmetic on it; formatting it as minutes and
    /// seconds is the chart's job.
    /// </summary>
    public required double PaceMinPerKm { get; init; }

    public required double DistanceKm { get; init; }

    public required double DurationMin { get; init; }

    public int? AverageHeartRate { get; init; }
}

/// <summary>Chart 2 — aerobic efficiency over time, easy runs only.</summary>
public sealed record EfficiencyChart
{
    public string Unit { get; init; } = "m/min per bpm";

    /// <summary>
    /// Says in the payload what the series is restricted to, because the
    /// restriction is the point. Efficiency factor compares like with like: a
    /// hard session raises the pace and the heart rate together and tells you
    /// nothing about fitness, so mixing intensities in would turn the trend
    /// into a record of how the week was scheduled.
    /// </summary>
    public string Basis { get; init; } = "easy runs only";

    public string Interpretation { get; init; } = "Rising = fitter.";

    public required IReadOnlyList<EfficiencyPoint> Points { get; init; }
}

public sealed record EfficiencyPoint
{
    public required string WorkoutId { get; init; }

    public required DateOnly Date { get; init; }

    public required double EfficiencyFactor { get; init; }

    public required double MetresPerMinute { get; init; }

    public required int AverageHeartRate { get; init; }

    public required double DistanceKm { get; init; }
}

/// <summary>Chart 3 — weekly volume, its four-week trend, and the week's longest run.</summary>
public sealed record WeeklyVolumeChart
{
    public string Unit { get; init; } = "km";

    public int RollingWeeks { get; init; } = 4;

    public required IReadOnlyList<WeeklyVolumePoint> Weeks { get; init; }
}

public sealed record WeeklyVolumePoint
{
    /// <summary>The Monday the week starts on, locally.</summary>
    public required DateOnly WeekStart { get; init; }

    /// <summary>ISO week label, as "2026-W35".</summary>
    public required string IsoWeek { get; init; }

    public required int Runs { get; init; }

    public required double Km { get; init; }

    /// <summary>
    /// This week and the three before it, averaged. Null for the first three
    /// weeks of the record, where there is no fourth week to average with —
    /// counting the missing weeks as zero would draw a climb out of nothing but
    /// the history running out.
    /// </summary>
    public double? Rolling4WeekAvgKm { get; init; }

    /// <summary>The longest single run of the week; zero in a week with none.</summary>
    public required double LongestRunKm { get; init; }
}

/// <summary>Chart 4 — acute:chronic workload ratio, one point per day.</summary>
public sealed record AcwrChart
{
    public string Unit { get; init; } = "ratio";

    /// <summary>
    /// Above this the week has outrun what the month prepared for. 1.5 is the
    /// bar the caller asked for; it is a flag to look at rather than a rule,
    /// and a single big race week will trip it legitimately.
    /// </summary>
    public double Threshold { get; init; } = RunningAnalytics.AcwrThreshold;

    public int AcuteDays { get; init; } = RunningAnalytics.AcuteDays;

    public int ChronicDays { get; init; } = RunningAnalytics.ChronicDays;

    /// <summary>
    /// The most recent day's figures — the one number that describes where
    /// training stands right now, lifted out so a reader does not have to walk
    /// to the end of the series for it. Null until there is enough history.
    /// </summary>
    public AcwrPoint? Current { get; init; }

    /// <summary>
    /// True when any day in the series is over the threshold; false on a clean
    /// history. Not the same as the current day being flagged.
    /// </summary>
    public required bool EverFlagged { get; init; }

    public required IReadOnlyList<AcwrPoint> Points { get; init; }
}

public sealed record AcwrPoint
{
    public required DateOnly Date { get; init; }

    /// <summary>Kilometres run in the seven days ending on this one.</summary>
    public required double AcuteKm { get; init; }

    /// <summary>
    /// The 28-day load scaled to a week — the 28-day daily average times seven.
    /// Expressed weekly so it divides into the acute figure to give a ratio
    /// around 1 when training is steady, which is what makes 1.5 mean
    /// something.
    /// </summary>
    public required double ChronicKm { get; init; }

    /// <summary>The same 28-day load as kilometres per day.</summary>
    public required double ChronicDailyKm { get; init; }

    /// <summary>Null on a day whose preceding 28 carried no running at all.</summary>
    public double? Ratio { get; init; }

    public required bool Flagged { get; init; }
}

/// <summary>Chart 5 — weekly time in zones, stacked easy against hard.</summary>
public sealed record WeeklyZoneChart
{
    public string Unit { get; init; } = "minutes";

    /// <summary>
    /// Zone zero — under half of max heart rate — is reported beside the stack
    /// rather than in it. It is time the strap recorded during a run without it
    /// being running, so counting it as easy aerobic work would inflate the
    /// half of the bar that matters most.
    /// </summary>
    public string Note { get; init; } = "zone0 is excluded from the stack; it is reported alongside it.";

    public required IReadOnlyList<WeeklyZonePoint> Weeks { get; init; }
}

public sealed record WeeklyZonePoint
{
    public required DateOnly WeekStart { get; init; }

    public required string IsoWeek { get; init; }

    public required double Zone12Minutes { get; init; }

    public required double Zone3PlusMinutes { get; init; }

    public required double Zone0Minutes { get; init; }

    /// <summary>Zones one to five: the height of the stack.</summary>
    public required double InZonesMinutes { get; init; }

    /// <summary>
    /// The easy share of the stack, 0 to 1. Null in a week with no running,
    /// where there is nothing to take a share of.
    /// </summary>
    public double? EasyShare { get; init; }
}
