using System.Globalization;
using System.Net;
using System.Text.Json;
using Microsoft.Azure.Cosmos;

namespace ApiFunctionApp.Whoop;

/// <summary>What storing one record actually did.</summary>
public enum WhoopWriteOutcome
{
    /// <summary>The record was new, or had changed since it was last stored.</summary>
    Written,

    /// <summary>
    /// The stored copy already carried the same <c>updated_at</c>, so the
    /// write was skipped and only the point read that established it was paid
    /// for.
    /// </summary>
    Unchanged,
}

/// <summary>
/// Everything that puts WHOOP data into Cosmos: the document envelope, the
/// upsert, and the per-collection sync cursor.
///
/// A stored record is WHOOP's own, passed through field for field, with only
/// the properties Cosmos and this app need layered on top. Nothing is reshaped
/// on the way in — a record that changes shape upstream still lands, and what
/// is stored can be read back against WHOOP's own documentation.
///
/// Writes are upserts. A WHOOP record is not final when it first appears:
/// score_state starts as PENDING and the score object arrives later, and an
/// in-progress workout's end keeps moving. Re-syncing is meant to bring the
/// stored copy up to date, not to fail on a conflict.
/// </summary>
public sealed class WhoopStore(Container container)
{
    /// <summary>
    /// Where the cursors live. The container is partitioned on /type, so
    /// giving the cursors a type of their own keeps them out of the partitions
    /// holding the records they track.
    /// </summary>
    public const string SyncStateType = "whoop_sync_state";

    private static readonly PartitionKey SyncStatePartition = new(SyncStateType);

    /// <summary>
    /// Stores one record, replacing any earlier copy of it — unless the copy
    /// already there is the same record.
    ///
    /// <paramref name="checkStored"/> is what buys that. An incremental sync
    /// re-reads a week of WHOOP on every run, and almost everything it finds
    /// is a record it already has: a workout goes SCORED and never changes
    /// again, so four runs a day spend most of their writes rewriting
    /// documents byte for byte. A point read costs a fraction of the write it
    /// avoids, so checking first is cheaper than not for any window where most
    /// records are settled.
    ///
    /// It is not cheaper during a backfill, where every record is new and the
    /// read is a wasted round trip against a deadline — which is why the caller
    /// decides rather than this method.
    /// </summary>
    public async Task<WhoopWriteOutcome> UpsertRecordAsync(
        WhoopCollection collection,
        string id,
        JsonElement record,
        bool checkStored,
        CancellationToken cancellationToken)
    {
        if (checkStored && await IsUnchangedAsync(collection, id, record, cancellationToken))
        {
            return WhoopWriteOutcome.Unchanged;
        }

        using var payload = new MemoryStream();

        using (var writer = new Utf8JsonWriter(payload))
        {
            writer.WriteStartObject();

            writer.WriteString("id", id);

            // The container's partition key path, and what the document says
            // it is. One field doing both jobs: Cosmos routes on it, and a
            // reader can tell what they are holding without consulting
            // anything else.
            writer.WriteString("type", collection.Type);

            // When this copy was taken, as distinct from WHOOP's own
            // updated_at. The two differ whenever a record was rescored
            // between syncs.
            writer.WriteString("ingested_at", DateTimeOffset.UtcNow);

            foreach (var property in record.EnumerateObject())
            {
                // Written above, so a WHOOP field of the same name must not
                // overwrite them.
                if (property.NameEquals("id")
                    || property.NameEquals("type")
                    || property.NameEquals("ingested_at"))
                {
                    continue;
                }

                property.WriteTo(writer);
            }

            writer.WriteEndObject();
        }

        payload.Position = 0;

        // Stream overload: the bytes written are the bytes stored, with no
        // POCO or serializer settings in between — which also
        // sidesteps the CosmosClient's default Newtonsoft serializer, whose
        // defaults would reshape a System.Text.Json payload on the way through.
        using var response = await container.UpsertItemStreamAsync(
            payload,
            new PartitionKey(collection.Type),
            cancellationToken: cancellationToken);

        EnsureSuccess(response, $"Upsert of {collection.Type} {id}");

        return WhoopWriteOutcome.Written;
    }

    /// <summary>
    /// Whether the stored copy is already this record.
    ///
    /// Compared on WHOOP's own <c>updated_at</c>, which it moves whenever a
    /// record changes — a rescore, an in-progress workout's end shifting — so
    /// two copies carrying the same one are the same record. That is a
    /// narrower test than comparing the documents field by field, and
    /// deliberately: a full comparison would have to know which of the
    /// properties this app adds are its own, and would answer "changed" for a
    /// record WHOOP reshaped without changing.
    ///
    /// Every uncertainty resolves to false, which means "write it". A record
    /// with no <c>updated_at</c>, a copy that has never been stored, a read
    /// that failed: none of them are grounds for skipping a write, and the
    /// upsert that follows will report anything genuinely wrong. The cost of
    /// being wrong in this direction is one redundant write; in the other it
    /// is a record that silently never updates.
    ///
    /// If WHOOP ever does change a record without moving its
    /// <c>updated_at</c>, the escape hatch is a reset sync: it drops the
    /// cursor, and a backfill rewrites every record without consulting this at
    /// all.
    /// </summary>
    private async Task<bool> IsUnchangedAsync(
        WhoopCollection collection,
        string id,
        JsonElement record,
        CancellationToken cancellationToken)
    {
        if (ReadUpdatedAt(record) is not { } incoming)
        {
            return false;
        }

        using var response = await container.ReadItemStreamAsync(
            id,
            new PartitionKey(collection.Type),
            cancellationToken: cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            // NotFound is the ordinary case for a record being stored for the
            // first time. Anything else is a real failure, and it is the
            // upsert's to report rather than this method's — throwing here
            // would turn a read that could simply be skipped into a failed
            // collection.
            return false;
        }

        using var stored = await JsonDocument.ParseAsync(
            response.Content, cancellationToken: cancellationToken);

        return ReadUpdatedAt(stored.RootElement) == incoming;
    }

    /// <summary>
    /// A record's <c>updated_at</c>, parsed.
    ///
    /// Parsed rather than compared as text, for the reason the sync parses
    /// start times: WHOOP's timestamps are ISO 8601 but nothing guarantees a
    /// fixed number of fractional digits, and ".01Z" differs from ".010Z" as a
    /// string while being the same instant. Comparing the text would report a
    /// change that did not happen and write anyway — safe, but it would give
    /// back exactly the saving this is here for.
    /// </summary>
    private static DateTimeOffset? ReadUpdatedAt(JsonElement record) =>
        record.ValueKind == JsonValueKind.Object
            && record.TryGetProperty("updated_at", out var updated)
            && updated.ValueKind == JsonValueKind.String
            && DateTimeOffset.TryParse(
                updated.GetString(),
                CultureInfo.InvariantCulture,
                DateTimeStyles.RoundtripKind,
                out var parsed)
            ? parsed
            : null;

    /// <summary>
    /// The cursor for a collection, or a fresh one when it has never been
    /// synced. A missing cursor is the normal state on the first run, not an
    /// error.
    /// </summary>
    public async Task<WhoopSyncState> ReadStateAsync(
        WhoopCollection collection,
        CancellationToken cancellationToken)
    {
        using var response = await container.ReadItemStreamAsync(
            collection.Type,
            SyncStatePartition,
            cancellationToken: cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return WhoopSyncState.NotStarted(collection.Type);
        }

        EnsureSuccess(response, $"Reading the {collection.Type} cursor");

        var state = await JsonSerializer.DeserializeAsync<WhoopSyncState>(
            response.Content, cancellationToken: cancellationToken);

        return state ?? WhoopSyncState.NotStarted(collection.Type);
    }

    public async Task WriteStateAsync(WhoopSyncState state, CancellationToken cancellationToken)
    {
        using var payload = new MemoryStream();
        await JsonSerializer.SerializeAsync(payload, state, cancellationToken: cancellationToken);
        payload.Position = 0;

        using var response = await container.UpsertItemStreamAsync(
            payload,
            SyncStatePartition,
            cancellationToken: cancellationToken);

        EnsureSuccess(response, $"Writing the {state.Id} cursor");
    }

    public async Task DeleteStateAsync(WhoopCollection collection, CancellationToken cancellationToken)
    {
        using var response = await container.DeleteItemStreamAsync(
            collection.Type,
            SyncStatePartition,
            cancellationToken: cancellationToken);

        // A cursor that was not there is the state the caller asked for.
        if (response.StatusCode != HttpStatusCode.NotFound)
        {
            EnsureSuccess(response, $"Deleting the {collection.Type} cursor");
        }
    }

    /// <summary>
    /// The stream overloads report failure in the status code rather than by
    /// throwing, so every call has to check. Raised as the CosmosException the
    /// sync endpoint already catches, carrying the activity id and RU charge
    /// that make a failed write diagnosable.
    /// </summary>
    private static void EnsureSuccess(ResponseMessage response, string what)
    {
        if (response.IsSuccessStatusCode)
        {
            return;
        }

        throw new CosmosException(
            response.ErrorMessage ?? $"{what} failed.",
            response.StatusCode,
            subStatusCode: 0,
            activityId: response.Headers.ActivityId,
            requestCharge: response.Headers.RequestCharge);
    }
}
