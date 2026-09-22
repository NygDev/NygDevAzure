using System.Globalization;

namespace ApiFunctionApp.Running;

/// <summary>
/// Turns a pile of runs into the five charts, and nothing else.
///
/// Pure and static on purpose: no Cosmos, no clock, no logger. Everything that
/// varies — the runs, and the day the series end on — arrives as an argument,
/// so the same input always produces the same document. That is what makes the
/// numbers checkable: a chart that looks wrong can be reproduced from the
/// stored workouts without a database or a deployment.
/// </summary>
public static class RunningAnalytics
{
    /// <summary>The rolling window that stands for recent load.</summary>
    public const int AcuteDays = 7;

    /// <summary>The longer window it is measured against.</summary>
    public const int ChronicDays = 28;

    /// <summary>Above this the acute week has outrun the chronic base.</summary>
    public const double AcwrThreshold = 1.5;

    /// <summary>Weeks averaged into the volume trend line.</summary>
    private const int RollingWeeks = 4;

    public static RunningDashboardDocument Build(
        IReadOnlyList<RunningWorkout> runs,
        IReadOnlyDictionary<string, int> skipped,
        DateOnly asOf,
        DateTimeOffset generatedAt)
    {
        // Sorted once, oldest first, and relied on by everything below: the
        // series are chronological, and the daily and weekly walks assume the
        // first run is the start of the record.
        var ordered = runs.OrderBy(r => r.Start).ToList();

        var source = new RunningSource
        {
            Runs = ordered.Count,
            Skipped = skipped,
            FirstRun = ordered.Count > 0 ? ordered[0].LocalDate : null,
            LastRun = ordered.Count > 0 ? ordered[^1].LocalDate : null,
            TotalKm = Round(ordered.Sum(r => r.DistanceKm), 3),
        };

        // Every series runs from the first run to asOf, so an empty history has
        // no span to walk and each chart is empty rather than absent. A reader
        // gets the same document shape on day zero as on day one thousand.
        var first = source.FirstRun;

        var weeks = first is { } from
            ? WeeksBetween(WeekStart(from), WeekStart(asOf))
            : [];

        var byWeek = ordered
            .GroupBy(r => WeekStart(r.LocalDate))
            .ToDictionary(g => g.Key, g => g.ToList());

        return new RunningDashboardDocument
        {
            GeneratedAt = generatedAt,
            AsOf = asOf,
            Source = source,
            Pace = BuildPace(ordered),
            EfficiencyFactor = BuildEfficiency(ordered),
            WeeklyVolume = BuildWeeklyVolume(weeks, byWeek),
            Acwr = BuildAcwr(ordered, first, asOf),
            WeeklyZones = BuildWeeklyZones(weeks, byWeek),
        };
    }

    /// <summary>
    /// Chart 1. One series per run type, each already sorted, so the chart
    /// draws a line per series without regrouping anything.
    /// </summary>
    private static PaceChart BuildPace(IReadOnlyList<RunningWorkout> runs) => new()
    {
        Series = RunTypes.All
            .Select(type => new PaceSeries
            {
                RunType = type.Label(),
                Points = runs
                    .Where(r => r.Type == type)
                    .Select(r => new PacePoint
                    {
                        WorkoutId = r.Id,
                        Date = r.LocalDate,
                        Start = r.Start,
                        PaceMinPerKm = Round(r.PaceMinutesPerKm, 3),
                        DistanceKm = Round(r.DistanceKm, 3),
                        DurationMin = Round(r.Duration.TotalMinutes, 2),
                        AverageHeartRate = r.AverageHeartRate,
                    })
                    .ToList(),
            })
            .ToList(),
    };

    /// <summary>
    /// Chart 2. Easy runs only, and only those WHOOP gave an average heart rate
    /// for — without one there is no efficiency factor to plot, and a run
    /// carrying no heart rate is exactly the run whose "easy" label was never
    /// verified in the first place.
    /// </summary>
    private static EfficiencyChart BuildEfficiency(IReadOnlyList<RunningWorkout> runs) => new()
    {
        Points = runs
            .Where(r => r.Type == RunType.Easy)
            .Select(r => (Run: r, Ef: r.EfficiencyFactor))
            .Where(x => x.Ef is not null)
            .Select(x => new EfficiencyPoint
            {
                WorkoutId = x.Run.Id,
                Date = x.Run.LocalDate,
                EfficiencyFactor = Round(x.Ef!.Value, 4),
                MetresPerMinute = Round(x.Run.MetresPerMinute, 2),
                AverageHeartRate = x.Run.AverageHeartRate!.Value,
                DistanceKm = Round(x.Run.DistanceKm, 3),
            })
            .ToList(),
    };

    /// <summary>
    /// Chart 3. Bars of kilometres a week, with the four-week average and the
    /// week's longest run over them.
    ///
    /// Weeks with no running are filled in as zeros rather than skipped. They
    /// have to be: a rolling average taken over "the last four weeks that
    /// happen to be in the list" would step over a fortnight off and report the
    /// month as unbroken.
    /// </summary>
    private static WeeklyVolumeChart BuildWeeklyVolume(
        IReadOnlyList<DateOnly> weeks,
        IReadOnlyDictionary<DateOnly, List<RunningWorkout>> byWeek)
    {
        var kilometres = weeks
            .Select(week => byWeek.TryGetValue(week, out var runs) ? runs.Sum(r => r.DistanceKm) : 0)
            .ToList();

        var points = new List<WeeklyVolumePoint>(weeks.Count);

        for (var i = 0; i < weeks.Count; i++)
        {
            var runs = byWeek.TryGetValue(weeks[i], out var found) ? found : [];

            points.Add(new WeeklyVolumePoint
            {
                WeekStart = weeks[i],
                IsoWeek = IsoWeekLabel(weeks[i]),
                Runs = runs.Count,
                Km = Round(kilometres[i], 3),

                // Null until a full window exists, rather than an average of
                // however many weeks have happened so far.
                Rolling4WeekAvgKm = i + 1 >= RollingWeeks
                    ? Round(kilometres.Skip(i + 1 - RollingWeeks).Take(RollingWeeks).Average(), 3)
                    : null,

                LongestRunKm = runs.Count > 0 ? Round(runs.Max(r => r.DistanceKm), 3) : 0,
            });
        }

        return new WeeklyVolumeChart { Weeks = points };
    }

    /// <summary>
    /// Chart 4. Acute:chronic workload ratio, daily.
    ///
    /// Acute is the kilometres of the last seven days. Chronic is the last
    /// twenty-eight, divided by four so it reads as a week — which is the same
    /// figure as the 28-day daily average multiplied by seven, and is what puts
    /// a steady training block at a ratio near 1 and makes 1.5 the recognisable
    /// bar it is.
    ///
    /// Both windows end on the day being reported and include it. Nothing is
    /// emitted before the chronic window has filled: for the first 27 days of a
    /// record the 28-day total is not a 28-day total, and a ratio built on it
    /// would read as a dangerous spike every time somebody started running.
    /// </summary>
    private static AcwrChart BuildAcwr(
        IReadOnlyList<RunningWorkout> runs,
        DateOnly? first,
        DateOnly asOf)
    {
        if (first is not { } start)
        {
            return new AcwrChart { EverFlagged = false, Points = [] };
        }

        // Kilometres per day, so both windows are a walk over an array rather
        // than a scan of every run per day.
        var days = asOf.DayNumber - start.DayNumber + 1;
        var daily = new double[days];

        foreach (var run in runs)
        {
            var index = run.LocalDate.DayNumber - start.DayNumber;

            // A run dated after asOf would sit outside the array. It should not
            // happen — asOf is derived from the latest run — but a stray future
            // timestamp from WHOOP should cost that run its point, not throw.
            if (index >= 0 && index < days)
            {
                daily[index] += run.DistanceKm;
            }
        }

        var points = new List<AcwrPoint>(Math.Max(0, days - ChronicDays + 1));
        var everFlagged = false;

        for (var day = ChronicDays - 1; day < days; day++)
        {
            var acute = Window(daily, day, AcuteDays);
            var chronicTotal = Window(daily, day, ChronicDays);
            var chronicWeekly = chronicTotal / (ChronicDays / (double)AcuteDays);

            // A month with no running at all leaves nothing to divide by. Null
            // rather than zero or infinity: the ratio is undefined, and saying
            // so is more useful than drawing a spike where training resumes.
            var ratio = chronicWeekly > 0 ? acute / chronicWeekly : (double?)null;
            var flagged = ratio > AcwrThreshold;
            everFlagged |= flagged;

            points.Add(new AcwrPoint
            {
                Date = start.AddDays(day),
                AcuteKm = Round(acute, 3),
                ChronicKm = Round(chronicWeekly, 3),
                ChronicDailyKm = Round(chronicTotal / ChronicDays, 4),
                Ratio = ratio is { } value ? Round(value, 3) : null,
                Flagged = flagged,
            });
        }

        return new AcwrChart
        {
            Current = points.Count > 0 ? points[^1] : null,
            EverFlagged = everFlagged,
            Points = points,
        };
    }

    /// <summary>Chart 5. Zone 1-2 against zone 3+, a week at a time.</summary>
    private static WeeklyZoneChart BuildWeeklyZones(
        IReadOnlyList<DateOnly> weeks,
        IReadOnlyDictionary<DateOnly, List<RunningWorkout>> byWeek)
    {
        var points = weeks.Select(week =>
        {
            var runs = byWeek.TryGetValue(week, out var found) ? found : [];

            var zones = runs.Aggregate(
                ZoneDurations.Empty, (total, run) => total + run.Zones);

            var inZones = zones.InZones.TotalMinutes;

            return new WeeklyZonePoint
            {
                WeekStart = week,
                IsoWeek = IsoWeekLabel(week),
                Zone12Minutes = Round(zones.Zone1To2.TotalMinutes, 2),
                Zone3PlusMinutes = Round(zones.Zone3Plus.TotalMinutes, 2),
                Zone0Minutes = Round(zones.Zone0.TotalMinutes, 2),
                InZonesMinutes = Round(inZones, 2),
                EasyShare = inZones > 0 ? Round(zones.Zone1To2.TotalMinutes / inZones, 4) : null,
            };
        });

        return new WeeklyZoneChart { Weeks = points.ToList() };
    }

    /// <summary>The kilometres in the <paramref name="length"/> days ending on <paramref name="day"/>.</summary>
    private static double Window(double[] daily, int day, int length)
    {
        var total = 0d;

        for (var i = Math.Max(0, day - length + 1); i <= day; i++)
        {
            total += daily[i];
        }

        return total;
    }

    /// <summary>
    /// The Monday on or before a date. Weeks are ISO weeks — Monday to Sunday —
    /// which is both what Norway counts by and what puts a weekend long run at
    /// the end of the week it trained for rather than the start of the next.
    /// </summary>
    private static DateOnly WeekStart(DateOnly date) =>
        date.AddDays(-(((int)date.DayOfWeek + 6) % 7));

    private static List<DateOnly> WeeksBetween(DateOnly first, DateOnly last)
    {
        var weeks = new List<DateOnly>();

        for (var week = first; week <= last; week = week.AddDays(7))
        {
            weeks.Add(week);
        }

        return weeks;
    }

    /// <summary>
    /// "2026-W35". The year is the ISO week-numbering year rather than the
    /// calendar one, so the days either side of new year land on the week they
    /// belong to instead of splitting it in two.
    /// </summary>
    private static string IsoWeekLabel(DateOnly weekStart)
    {
        var date = weekStart.ToDateTime(TimeOnly.MinValue);

        return string.Create(
            CultureInfo.InvariantCulture,
            $"{ISOWeek.GetYear(date)}-W{ISOWeek.GetWeekOfYear(date):00}");
    }

    /// <summary>
    /// Rounded on the way out, once. These are display figures in a document
    /// that is read far more often than it is written, and full double
    /// precision on a few thousand points is bytes spent on digits no chart
    /// will ever draw.
    /// </summary>
    private static double Round(double value, int digits) =>
        double.IsFinite(value) ? Math.Round(value, digits, MidpointRounding.AwayFromZero) : 0;
}
