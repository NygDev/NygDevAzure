using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Running;

/// <summary>
/// Reads the stored runs, computes the five charts, stores the result.
///
/// The whole build is a rebuild. There is no incremental path and there should
/// not be: WHOOP rescores a workout after the fact, the sync re-reads a week of
/// history on every run to catch exactly that, and a rolling average or an ACWR
/// window that had already been written from the old figures would quietly stay
/// wrong. Recomputing from every stored run costs one query and a few
/// milliseconds of arithmetic, which is less than the bookkeeping an
/// incremental build would need.
/// </summary>
public sealed class RunningDashboardBuilder(
    RunningStore store,
    ILogger<RunningDashboardBuilder> logger)
{
    public async Task<RunningDashboardDocument> BuildAsync(CancellationToken cancellationToken)
    {
        var (runs, skipped) = await store.ReadRunsAsync(cancellationToken);

        var generatedAt = DateTimeOffset.UtcNow;
        var document = RunningAnalytics.Build(runs, skipped, AsOf(runs, generatedAt), generatedAt);

        await store.WriteAsync(document, cancellationToken);

        logger.LogInformation(
            "Built the running dashboard from {Runs} runs up to {AsOf} "
            + "({Weeks} weeks, {AcwrDays} ACWR days, {Skipped} workouts skipped); "
            + "current ACWR {Acwr}.",
            document.Source.Runs,
            document.AsOf,
            document.WeeklyVolume.Weeks.Count,
            document.Acwr.Points.Count,
            skipped.Values.Sum(),
            document.Acwr.Current?.Ratio);

        return document;
    }

    /// <summary>
    /// Today, in the time zone the most recent run was recorded in.
    ///
    /// The series have to reach the present rather than stopping at the last
    /// run — a fortnight off is a fortnight of falling volume and decaying
    /// chronic load, and a chart that ended at the last run would draw that as
    /// nothing having happened. Which "today" that is only matters within a few
    /// hours either side of midnight, so the latest run's own offset is a good
    /// enough stand-in for where the runner is, and avoids the app carrying a
    /// time zone of its own.
    /// </summary>
    private static DateOnly AsOf(IReadOnlyList<RunningWorkout> runs, DateTimeOffset now)
    {
        if (runs.Count == 0)
        {
            return DateOnly.FromDateTime(now.UtcDateTime);
        }

        var latest = runs.MaxBy(r => r.Start)!;
        var today = DateOnly.FromDateTime(now.ToOffset(latest.Start.Offset).DateTime);

        // A run timestamped in the future would otherwise leave asOf behind the
        // history it is supposed to bound, and the daily walk with a negative
        // length.
        return today > latest.LocalDate ? today : latest.LocalDate;
    }
}
