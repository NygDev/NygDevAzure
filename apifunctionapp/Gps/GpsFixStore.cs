using System.Text.Json;
using Microsoft.Azure.Cosmos;

namespace ApiFunctionApp.Gps;

/// <summary>
/// Writes location fixes into the same Cosmos container everything else in
/// this app uses, under a partition of their own.
///
/// Every write is an upsert keyed on the fix's <c>ts</c>, because the phone
/// deletes a batch only after it has seen a 2xx and resends the identical
/// batch whenever that response was lost. Storing the same fix twice would be
/// the ordinary case rather than the rare one, so the write is built to land
/// on the same document the second time round.
/// </summary>
public sealed class GpsFixStore(Container container)
{
    /// <summary>
    /// The partition, and what the documents say they are. The container is
    /// partitioned on /type, so a type of its own keeps these off the
    /// partitions holding the WHOOP records — they are routed apart, and the
    /// dashboard's queries never touch them.
    /// </summary>
    public const string PartitionType = "GPS";

    private static readonly PartitionKey Partition = new(PartitionType);

    /// <summary>
    /// Operations per transactional batch. 100 is Cosmos's own ceiling; the
    /// other one, 2 MB of payload, is nowhere near reachable with documents
    /// this size.
    /// </summary>
    private const int OperationsPerBatch = 100;

    /// <summary>
    /// How many of those batches are in flight at once.
    ///
    /// Kept low on purpose. The database is 1000 RU/s shared across
    /// everything on the account, so throughput rather than round trips is
    /// what bounds a large backlog, and pushing harder buys nothing but 429s
    /// the SDK then has to sit out. Four is enough to hide the latency of an
    /// ordinary batch — six fixes, one round trip — while leaving the RU
    /// budget to the retry policy.
    /// </summary>
    private const int ConcurrentBatches = 4;

    /// <summary>
    /// The response body is never read, so Cosmos is asked not to echo the
    /// documents back. The client is configured this way already; saying it
    /// again here keeps the batch from depending on that.
    /// </summary>
    private static readonly TransactionalBatchItemRequestOptions WriteOptions = new()
    {
        EnableContentResponseOnWrite = false,
    };

    /// <summary>
    /// Stores every fix, or throws.
    ///
    /// There is no partial success to report: the caller answers 2xx only when
    /// all of this landed, because a 2xx is what makes the phone delete its
    /// copy. A batch that fails leaves its own hundred fixes unwritten —
    /// transactional batches are atomic — and any batch that already succeeded
    /// stays written, which costs nothing: the resend upserts over it.
    /// </summary>
    public async Task WriteAsync(IReadOnlyList<GpsFix> fixes, CancellationToken cancellationToken)
    {
        var batches = fixes
            .Chunk(OperationsPerBatch)
            .ToList();

        await Parallel.ForEachAsync(
            batches,
            new ParallelOptions
            {
                MaxDegreeOfParallelism = ConcurrentBatches,
                CancellationToken = cancellationToken,
            },
            async (batch, token) => await WriteBatchAsync(batch, token));
    }

    private async Task WriteBatchAsync(GpsFix[] fixes, CancellationToken cancellationToken)
    {
        var batch = container.CreateTransactionalBatch(Partition);

        // The streams have to outlive the call — the SDK reads them while the
        // request is being sent, not when the operation is queued — so they
        // are held here and disposed once the response is back.
        var payloads = new List<MemoryStream>(fixes.Length);

        try
        {
            foreach (var fix in fixes)
            {
                var payload = Serialize(fix);
                payloads.Add(payload);
                batch.UpsertItemStream(payload, WriteOptions);
            }

            using var response = await batch.ExecuteAsync(cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                return;
            }

            throw Failure(response, fixes);
        }
        finally
        {
            foreach (var payload in payloads)
            {
                payload.Dispose();
            }
        }
    }

    /// <summary>
    /// The document, written with Utf8JsonWriter straight to the bytes Cosmos
    /// stores.
    ///
    /// The stream overloads rather than a POCO, for the reason the WHOOP sync
    /// uses them: the CosmosClient still serializes with Newtonsoft by
    /// default, and a document that went through it would be shaped by that
    /// serializer's settings rather than by what is written here.
    /// </summary>
    private static MemoryStream Serialize(GpsFix fix)
    {
        var payload = new MemoryStream();

        using (var writer = new Utf8JsonWriter(payload))
        {
            writer.WriteStartObject();

            // ts as a string: Cosmos ids are strings, and this one is the
            // dedupe key.
            writer.WriteString("id", fix.Id);
            writer.WriteString("type", PartitionType);

            // The five measurements under the names the phone sends, so what
            // is stored can be read against the payload contract without a
            // mapping table in between. The nullable three are written as
            // literal null when absent rather than left out, keeping all six
            // keys on every document exactly as they are on the wire.
            writer.WriteNumber("lat", fix.Latitude);
            writer.WriteNumber("lon", fix.Longitude);
            WriteNullable(writer, "acc", fix.Accuracy);
            WriteNullable(writer, "alt", fix.Altitude);
            WriteNullable(writer, "spd", fix.Speed);

            // The raw epoch milliseconds, and the same instant spelled out.
            // The number is what the phone sent and what the id is derived
            // from; the timestamp is so the container can be read by eye.
            writer.WriteNumber("ts", fix.TimestampMs);
            writer.WriteString("recorded_at", fix.RecordedAt);

            // When this copy was taken, as distinct from when the fix was.
            // The two are a minute apart on a live upload and arbitrarily far
            // apart after an offline stretch, which is what makes a backlog
            // recognisable afterwards.
            writer.WriteString("ingested_at", DateTimeOffset.UtcNow);

            writer.WriteEndObject();
        }

        payload.Position = 0;
        return payload;
    }

    private static void WriteNullable(Utf8JsonWriter writer, string name, double? value)
    {
        if (value is { } number)
        {
            writer.WriteNumber(name, number);
        }
        else
        {
            writer.WriteNull(name);
        }
    }

    /// <summary>
    /// Turns a failed batch into the CosmosException the endpoint answers for.
    ///
    /// A transactional batch reports the operation that actually failed and
    /// marks every other one 424 Failed Dependency, so the batch's own status
    /// is only ever as informative as the first real failure inside it. This
    /// digs that out, along with the fix it belongs to — which is the one
    /// piece of information that is not in the response.
    /// </summary>
    private static CosmosException Failure(TransactionalBatchResponse response, GpsFix[] fixes)
    {
        var status = response.StatusCode;
        var detail = response.ErrorMessage;
        var culprit = string.Empty;

        for (var i = 0; i < response.Count && i < fixes.Length; i++)
        {
            var result = response[i];

            if (result.IsSuccessStatusCode || result.StatusCode == System.Net.HttpStatusCode.FailedDependency)
            {
                continue;
            }

            status = result.StatusCode;
            culprit = $" The first operation to fail was the fix at ts {fixes[i].TimestampMs}.";
            break;
        }

        return new CosmosException(
            $"Storing a batch of {fixes.Length} location fixes failed. {detail}{culprit}",
            status,
            subStatusCode: 0,
            activityId: response.ActivityId,
            requestCharge: response.RequestCharge);
    }
}
