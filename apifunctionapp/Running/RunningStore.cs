using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Azure.Cosmos;

namespace ApiFunctionApp.Running;

/// <summary>
/// The Cosmos half of the dashboard: reading the stored runs, and writing the
/// document built from them.
/// </summary>
public sealed class RunningStore(Container container)
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

    private static readonly PartitionKey DashboardPartition = new(RunningDashboardDocument.DocumentType);

    /// <summary>
    /// camelCase, matching what the HTTP endpoints already return, so the
    /// stored document and the API response are the same shape. Nulls are kept
    /// rather than dropped: a null rolling average or ratio is a gap the chart
    /// is meant to see, and a missing property would read as zero.
    /// </summary>
    private static readonly JsonSerializerOptions DocumentJson = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.Never,
    };

    /// <summary>
    /// Every scored run in the container, parsed, with a count of what could
    /// not be used and why.
    ///
    /// This is a scan, and knowingly so. The container is created with
    /// indexing_mode "none" to keep the free tier's writes cheap, which leaves
    /// no index for a WHERE clause to seek on — hence EnableScanInQuery, which
    /// Cosmos otherwise refuses the query without. The cost is bounded by the
    /// partition rather than the container: /type is the partition key, so this
    /// reads the workouts and never touches the cycles, sleep or recovery
    /// stored beside them. That, plus running once a day, is what makes a scan
    /// the cheaper answer than turning indexing on for every write to earn it.
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
            EnableScanInQuery = true,
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

    /// <summary>
    /// Stores the dashboard, replacing the previous build. An upsert on a fixed
    /// id, so there is exactly one of these and a reader never has to work out
    /// which is current.
    /// </summary>
    public async Task WriteAsync(RunningDashboardDocument document, CancellationToken cancellationToken)
    {
        using var payload = new MemoryStream();
        await JsonSerializer.SerializeAsync(payload, document, DocumentJson, cancellationToken);
        payload.Position = 0;

        using var response = await container.UpsertItemStreamAsync(
            payload,
            DashboardPartition,
            cancellationToken: cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new CosmosException(
                response.ErrorMessage ?? "Writing the dashboard document failed.",
                response.StatusCode,
                subStatusCode: 0,
                activityId: response.Headers.ActivityId,
                requestCharge: response.Headers.RequestCharge);
        }
    }
}
