using System.Text.Json;
using Microsoft.Azure.Cosmos;

namespace ApiFunctionApp.Running;

/// <summary>
/// Reads the runs the WHOOP sync stored, out of Cosmos.
///
/// The read half of the dashboard only. What is built from these goes to a
/// blob on the CDN account rather than back into Cosmos — see
/// <see cref="RunningDashboardStore"/>.
/// </summary>
public sealed class RunningWorkoutStore(Container container)
{
    /// <summary>
    /// Only the fields the charts need, aliased away from Cosmos SQL's reserved
    /// words — <c>end</c> is one, and quoting it in the projection would leave
    /// the result property named after the quoting rather than the field.
    ///
    /// The filter is the same one a reader would apply by hand: running only,
    /// and only once WHOOP has scored it. An unscored workout has no distance
    /// and no zone durations, so there is nothing on it to chart.
    /// </summary>
    private const string RunQuery = """
        SELECT c.id AS id,
               c["start"] AS started_at,
               c["end"] AS ended_at,
               c.timezone_offset AS timezone_offset,
               c.score AS score
        FROM c
        WHERE c.sport_name = @sport AND c.score_state = @scored
        """;

    private const string ScoredState = "SCORED";

    private static readonly PartitionKey WorkoutPartition = new(Whoop.WhoopCollection.Workout.Type);

    /// <summary>
    /// Every scored run in the container, parsed, with a count of what could
    /// not be used and why.
    ///
    /// Both halves of the filter are indexed — /sport_name and /score_state,
    /// the only two paths in the container's policy — so this seeks rather
    /// than scans, and the charge falls to the runs it actually returns
    /// instead of every workout ever stored. The partition key narrows it
    /// again before that: /type is what Cosmos routes on, so the cycles, sleep
    /// and recovery records sitting beside these are never touched.
    ///
    /// EnableScanInQuery is deliberately not set. Without it a filter on a
    /// path the policy does not cover is refused outright, which is the answer
    /// to want: a query that has outgrown terraform/db.tf should fail and say
    /// so on the first run rather than quietly cost a hundred times the RU on
    /// every one after it.
    /// </summary>
    public async Task<(List<RunningWorkout> Runs, Dictionary<string, int> Skipped)> ReadRunsAsync(
        CancellationToken cancellationToken)
    {
        var query = new QueryDefinition(RunQuery)
            .WithParameter("@sport", RunningWorkout.SportName)
            .WithParameter("@scored", ScoredState);

        var options = new QueryRequestOptions
        {
            PartitionKey = WorkoutPartition,

            // A page per round trip, so a few thousand runs come back in a
            // handful rather than in tens. The runs are read in full and held
            // in memory regardless — the whole history is what the charts are
            // computed from — so a larger page costs nothing it does not
            // already cost.
            MaxItemCount = 1000,
        };

        var runs = new List<RunningWorkout>();
        var skipped = new Dictionary<string, int>(StringComparer.Ordinal);

        // The stream iterator rather than the typed one, for the reason the
        // sync writes streams: the CosmosClient's default serializer is
        // Newtonsoft, and going through it would reshape a System.Text.Json
        // payload on the way past.
        using var iterator = container.GetItemQueryStreamIterator(query, requestOptions: options);

        while (iterator.HasMoreResults)
        {
            using var response = await iterator.ReadNextAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new CosmosException(
                    response.ErrorMessage ?? "Reading the stored WHOOP workouts failed.",
                    response.StatusCode,
                    subStatusCode: 0,
                    activityId: response.Headers.ActivityId,
                    requestCharge: response.Headers.RequestCharge);
            }

            using var page = await JsonDocument.ParseAsync(response.Content, cancellationToken: cancellationToken);

            if (!page.RootElement.TryGetProperty("Documents", out var documents)
                || documents.ValueKind != JsonValueKind.Array)
            {
                continue;
            }

            foreach (var document in documents.EnumerateArray())
            {
                if (RunningWorkout.TryRead(document, out var run, out var reason))
                {
                    runs.Add(run);
                }
                else
                {
                    skipped[reason] = skipped.GetValueOrDefault(reason) + 1;
                }
            }
        }

        return (runs, skipped);
    }
}
