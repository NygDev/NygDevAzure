using System.Text.Json;
using Microsoft.Azure.Cosmos;

namespace ApiFunctionApp.Gps;

/// <summary>
/// Writes location fixes into db/gps, the container that holds nothing else.
///
/// A document here is a <em>segment</em>: one upload's worth of fixes, in
/// order, on a single document. That is a storage shape chosen for RU rather
/// than for readability. Cosmos charges a floor of roughly 5 RU for any write
/// regardless of size, so a fix stored on a document of its own costs the same
/// as a fix stored alongside a hundred and forty-nine others — which made the
/// old one-document-per-fix shape roughly a 5 RU tax per reading. Packed into
/// segments the same fixes cost a fraction of that, and a large backlog stops
/// being able to exhaust the account's throughput on its own.
///
/// Every write is still an upsert, because the phone deletes a batch only
/// after it has seen a 2xx and resends the identical batch whenever that
/// response was lost. The segment id is derived from the timestamps it spans,
/// so a verbatim resend rebuilds the same id and lands on the same document —
/// the same idempotency the per-fix documents had, without a read to establish
/// it.
///
/// The one case that shape does not cover is a resend that <em>partially</em>
/// overlaps an upload that already landed: different fixes, different span,
/// different id, so a fix can end up recorded in two segments. Nothing reads
/// these yet, and de-duplicating on <c>ts</c> is cheap whenever something
/// does, which is the trade this shape makes deliberately.
///
/// Nothing written here is kept: the container carries a three day TTL, set in
/// terraform/db.tf, and Cosmos drops each segment three days after it was last
/// written. This is a window on the recent past, not an archive — whatever ends
/// up reading these has to read them inside it, and a resend of a batch older
/// than that writes a new document rather than upserting over the expired one.
/// </summary>
public sealed class GpsFixStore(Container container)
{
    /// <summary>
    /// The partition, and what the documents say they came from.
    ///
    /// db/gps is partitioned on /sender, so every segment carries one — and
    /// the payload carries no device id, so today there is exactly one value it
    /// can be. That is what /sender is there for: a second device would arrive
    /// under a sender of its own and be routed apart from this one, which also
    /// takes the collision out of the segment ids. Two phones can produce a fix
    /// in the same millisecond, and under one sender the later segment would
    /// upsert over the earlier one; under two they are different documents in
    /// different partitions. Both would need the sender to come off the request
    /// rather than out of this constant — see <see cref="SegmentId"/>.
    /// </summary>
    public const string Sender = "phone";

    private static readonly PartitionKey Partition = new(Sender);

    /// <summary>
    /// Fixes per segment document.
    ///
    /// At roughly 90 bytes per fix on the wire this is about 14 KB of payload,
    /// which is nowhere near Cosmos's 2 MB item ceiling and comfortably inside
    /// the range where the per-write floor has been amortised away — past this
    /// point the RU curve is close to linear in size and a larger segment buys
    /// very little. It is also small enough that one failed write costs a
    /// bounded amount of re-sent work.
    ///
    /// An ordinary upload is a handful of fixes and becomes a single segment
    /// well under a kilobyte, which is the cheapest write Cosmos offers.
    /// </summary>
    private const int FixesPerSegment = 150;

    /// <summary>
    /// How many segment writes are in flight at once.
    ///
    /// Kept low on purpose. The database is 1000 RU/s shared across every
    /// container on it, this one included, so throughput rather than round
    /// trips is what bounds a large backlog, and pushing harder buys nothing
    /// but 429s the SDK then has to sit out. Four is enough to hide the latency
    /// of an ordinary write while leaving the RU budget to the retry policy.
    /// </summary>
    private const int ConcurrentWrites = 4;

    /// <summary>
    /// The response body is never read, so Cosmos is asked not to echo the
    /// document back. The client is configured this way already; saying it
    /// again here keeps the write from depending on that. Note this saves
    /// bandwidth and latency, not RU — the charge is the same either way.
    /// </summary>
    private static readonly ItemRequestOptions WriteOptions = new()
    {
        EnableContentResponseOnWrite = false,
    };

    /// <summary>
    /// Stores every fix, or throws.
    ///
    /// There is no partial success to report: the caller answers 2xx only when
    /// all of this landed, because a 2xx is what makes the phone delete its
    /// copy. A segment that fails leaves its own fixes unwritten, and any
    /// segment that already succeeded stays written, which costs nothing: the
    /// resend upserts over it.
    ///
    /// The fixes are expected in ascending <c>ts</c> order and free of
    /// duplicates — <see cref="ApiFunctionApp.GpsLocations"/> guarantees both —
    /// because that is what makes the segmentation deterministic, and with it
    /// the ids a resend rebuilds.
    /// </summary>
    public async Task<GpsWriteReport> WriteAsync(
        IReadOnlyList<GpsFix> fixes,
        CancellationToken cancellationToken)
    {
        var segments = fixes
            .Chunk(FixesPerSegment)
            .ToArray();

        // One slot per segment, written by exactly one worker: distinct array
        // elements are safe to assign concurrently, so the charges add up
        // without a lock between them.
        var charges = new double[segments.Length];

        await Parallel.ForEachAsync(
            Enumerable.Range(0, segments.Length),
            new ParallelOptions
            {
                MaxDegreeOfParallelism = ConcurrentWrites,
                CancellationToken = cancellationToken,
            },
            async (index, token) =>
            {
                charges[index] = await WriteSegmentAsync(segments[index], token);
            });

        return new GpsWriteReport(segments.Length, charges.Sum());
    }

    /// <summary>Writes one segment and returns what Cosmos charged for it.</summary>
    private async Task<double> WriteSegmentAsync(GpsFix[] fixes, CancellationToken cancellationToken)
    {
        using var payload = Serialize(fixes);

        using var response = await container.UpsertItemStreamAsync(
            payload,
            Partition,
            WriteOptions,
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw Failure(response, fixes);
        }

        return response.Headers.RequestCharge;
    }

    /// <summary>
    /// The segment's id, and with it the dedupe key.
    ///
    /// The span the segment covers, first and last <c>ts</c>. The endpoint
    /// hands over a sorted, de-duplicated list and the chunking is fixed, so
    /// the same upload always produces the same segments with the same ids —
    /// which is what makes a resend of a batch whose response was lost land on
    /// the documents it landed on the first time rather than beside them.
    ///
    /// A second phone would break this, exactly as it broke the per-fix ids
    /// before it: two devices could share a millisecond, and the payload
    /// carries no device id to separate them by. /sender is where that id
    /// belongs once there is one — a per-sender partition makes two identical
    /// spans two documents rather than one.
    /// </summary>
    private static string SegmentId(GpsFix[] fixes) =>
        $"{fixes[0].TimestampMs}-{fixes[^1].TimestampMs}";

    /// <summary>
    /// The document, written with Utf8JsonWriter straight to the bytes Cosmos
    /// stores.
    ///
    /// The stream overloads rather than a POCO, for the reason the WHOOP sync
    /// uses them: the CosmosClient still serializes with Newtonsoft by
    /// default, and a document that went through it would be shaped by that
    /// serializer's settings rather than by what is written here.
    ///
    /// Every field the per-fix documents carried is still carried, on the fix
    /// it belongs to. Only the two that were the same on all of them — the
    /// sender, and the ingest time — have moved up to the envelope, where they
    /// are stated once instead of a hundred and fifty times.
    /// </summary>
    private static MemoryStream Serialize(GpsFix[] fixes)
    {
        var payload = new MemoryStream();

        using (var writer = new Utf8JsonWriter(payload))
        {
            writer.WriteStartObject();

            writer.WriteString("id", SegmentId(fixes));

            // The partition key. It has to be on the document as well as on the
            // request — Cosmos rejects a write whose /sender is missing rather
            // than inferring it from the PartitionKey passed alongside.
            writer.WriteString("sender", Sender);

            // The span, spelled out on the envelope so a segment can be found
            // and read without opening the array. Raw epoch milliseconds and
            // the same two instants as timestamps, for the same reason the
            // fixes carry both: the numbers are what the phone sent and what
            // the id is derived from, the timestamps are so the container can
            // be read by eye.
            writer.WriteNumber("from", fixes[0].TimestampMs);
            writer.WriteNumber("to", fixes[^1].TimestampMs);
            writer.WriteString("recorded_from", fixes[0].RecordedAt);
            writer.WriteString("recorded_to", fixes[^1].RecordedAt);
            writer.WriteNumber("count", fixes.Length);

            // When this copy was taken, as distinct from when the fixes were.
            // The two are a minute apart on a live upload and arbitrarily far
            // apart after an offline stretch, which is what makes a backlog
            // recognisable afterwards.
            writer.WriteString("ingested_at", DateTimeOffset.UtcNow);

            writer.WriteStartArray("fixes");

            foreach (var fix in fixes)
            {
                writer.WriteStartObject();

                // The five measurements under the names the phone sends, so
                // what is stored can be read against the payload contract
                // without a mapping table in between. The nullable three are
                // written as literal null when absent rather than left out,
                // keeping all six keys on every fix exactly as they are on the
                // wire.
                writer.WriteNumber("lat", fix.Latitude);
                writer.WriteNumber("lon", fix.Longitude);
                WriteNullable(writer, "acc", fix.Accuracy);
                WriteNullable(writer, "alt", fix.Altitude);
                WriteNullable(writer, "spd", fix.Speed);

                writer.WriteNumber("ts", fix.TimestampMs);
                writer.WriteString("recorded_at", fix.RecordedAt);

                writer.WriteEndObject();
            }

            writer.WriteEndArray();

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
    /// Turns a failed segment write into the CosmosException the endpoint
    /// answers for.
    ///
    /// One operation per request now, so the status on the response is the
    /// real failure rather than a batch's summary of a hundred — the span the
    /// segment covers is the only thing worth adding, and it is the one piece
    /// of information the response does not carry.
    /// </summary>
    private static CosmosException Failure(ResponseMessage response, GpsFix[] fixes) =>
        new(
            $"Storing a segment of {fixes.Length} location fixes spanning ts {fixes[0].TimestampMs} "
            + $"to {fixes[^1].TimestampMs} failed. {response.ErrorMessage}",
            response.StatusCode,
            subStatusCode: 0,
            activityId: response.Headers.ActivityId,
            requestCharge: response.Headers.RequestCharge);
}

/// <summary>
/// What one upload cost, for the endpoint's log.
///
/// The RU charge is the whole point of the segment shape, so it is reported
/// rather than discarded: it is the only way to tell from the outside whether
/// a change to <c>FixesPerSegment</c> did anything, and the number that says
/// how close an upload came to the account's 1000 RU/s.
/// </summary>
public readonly record struct GpsWriteReport(int Segments, double RequestCharge);
