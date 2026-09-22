namespace ApiFunctionApp.Running;

/// <summary>
/// What kind of session a run was.
///
/// WHOOP does not label a workout this way — it gives a sport name and a
/// breakdown of time spent in each heart-rate zone, and nothing else that says
/// what the session was for. So the type is derived here, from the shape of
/// that breakdown, and the names below describe intensity rather than
/// structure. That distinction is deliberate: zone durations are totals for
/// the whole workout, so a set of 400s and a flat-out 5k look identical once
/// the recovery jogs are summed in with the efforts. Calling both
/// <see cref="Hard"/> is honest; calling one of them "intervals" would not be.
/// </summary>
public enum RunType
{
    /// <summary>Aerobic base — most of the run below 70% of max heart rate.</summary>
    Easy,

    /// <summary>Nothing dominant: neither clearly aerobic nor clearly hard.</summary>
    Moderate,

    /// <summary>Sustained hard-aerobic work — tempo and threshold sessions.</summary>
    Threshold,

    /// <summary>Half the run or more above 80% of max — intervals, races, time trials.</summary>
    Hard,

    /// <summary>Long by duration or distance, whatever the intensity was.</summary>
    Long,
}

/// <summary>
/// The classifier, and the thresholds it runs on.
///
/// Every threshold here is a judgement call rather than something WHOOP
/// supplies, so they live together in one place where they can be read as a
/// set and moved as a set. Changing one changes how history is labelled: the
/// dashboard is rebuilt from every stored workout on each run, so a new
/// threshold reclassifies the whole series rather than only the runs that come
/// after it.
/// </summary>
public static class RunTypes
{
    /// <summary>Canonical order, so the chart's legend does not move between builds.</summary>
    public static readonly IReadOnlyList<RunType> All =
        [RunType.Easy, RunType.Moderate, RunType.Threshold, RunType.Hard, RunType.Long];

    /// <summary>At or beyond either of these a run is <see cref="RunType.Long"/>.</summary>
    private static readonly TimeSpan LongDuration = TimeSpan.FromMinutes(75);

    private const double LongDistanceKm = 15;

    /// <summary>
    /// Share of zone 1-5 time that has to sit in a band before it names the
    /// run. Half is the bar in each case: past it, no other band can be
    /// larger.
    /// </summary>
    private const double DominantShare = 0.5;

    /// <summary>
    /// The JSON name for a type. Written out by hand rather than taken from
    /// <see cref="Enum.ToString()"/>, because these strings are the chart's
    /// series keys — renaming a member should not silently rename a series.
    /// </summary>
    public static string Label(this RunType type) => type switch
    {
        RunType.Easy => "easy",
        RunType.Moderate => "moderate",
        RunType.Threshold => "threshold",
        RunType.Hard => "hard",
        RunType.Long => "long",
        _ => "moderate",
    };

    /// <summary>
    /// Classifies one run.
    ///
    /// Length is checked first, on purpose. A long run is a long run whether it
    /// was jogged or raced — it is the session that dominates a week's volume
    /// and the one a training plan schedules by distance — so it keeps its own
    /// label rather than being folded in with the easy runs it otherwise
    /// resembles.
    ///
    /// After that the bands are tried hardest first, and they nest: anything
    /// clearing the zone 4+ bar has already cleared the zone 3+ one. A run
    /// carrying no usable zone data cannot be placed on intensity at all and
    /// falls through to <see cref="RunType.Moderate"/>, which keeps it in the
    /// volume and pace figures without letting it into the efficiency series,
    /// where an unverified "easy" would be a lie.
    /// </summary>
    public static RunType Classify(TimeSpan duration, double distanceKm, ZoneDurations zones)
    {
        if (duration >= LongDuration || distanceKm >= LongDistanceKm)
        {
            return RunType.Long;
        }

        var inZones = zones.InZones.TotalSeconds;

        if (inZones <= 0)
        {
            return RunType.Moderate;
        }

        if (zones.Zone4Plus.TotalSeconds / inZones >= DominantShare)
        {
            return RunType.Hard;
        }

        if (zones.Zone3Plus.TotalSeconds / inZones >= DominantShare)
        {
            return RunType.Threshold;
        }

        if (zones.Zone1To2.TotalSeconds / inZones >= DominantShare)
        {
            return RunType.Easy;
        }

        return RunType.Moderate;
    }
}
