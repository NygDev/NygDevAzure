using System.Net;
using System.Text.Json;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Whoop;

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
public sealed class WhoopStore(CosmosClient cosmosClient, ILogger<WhoopStore> logger)
{
    private const string DatabaseName = "db";
    private const string ContainerName = "primary";

    /// <summary>
    /// Where the cursors live. The container is partitioned on /type, so
    /// giving the cursors a type of their own keeps them out of the partitions
    /// holding the records they track.
    /// </summary>
    public const string SyncStateType = "whoop_sync_state";

    // Written by this app, so a WHOOP field of the same name must not overwrite
    // them — the copy loop below skips these names.
    private static readonly HashSet<string> OwnedProperties =
        new(StringComparer.Ordinal) { "id", "type", "ingested_at" };

    private Container Container => cosmosClient.GetContainer(DatabaseName, ContainerName);

    /// <summary>
    /// Stores one record. Returns the status Cosmos gave: 201 for a record not
    /// stored before, 200 for one that replaced an existing document.
    /// </summary>
    public async Task<HttpStatusCode> UpsertRecordAsync(
        WhoopCollection collection,
        string id,
        JsonElement record,
        CancellationToken cancellationToken)
    {
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
                if (OwnedProperties.Contains(property.Name))
                {
                    continue;
                }

                property.WriteTo(writer);
            }

            writer.WriteEndObject();
            writer.Flush();
        }

        payload.Position = 0;

        // Stream overload: the bytes written are the bytes stored, with no
        // POCO or serializer settings in between — which also
        // sidesteps the CosmosClient's default Newtonsoft serializer, whose
        // defaults would reshape a System.Text.Json payload on the way through.
        using var response = await Container.UpsertItemStreamAsync(
            payload,
            new PartitionKey(collection.Type),
            cancellationToken: cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            logger.LogError(
                "Upsert of {Type} {Id} failed: {StatusCode} {ErrorMessage}",
                collection.Type,
                id,
                response.StatusCode,
                response.ErrorMessage);

            throw new CosmosException(
                response.ErrorMessage ?? $"Upsert of {collection.Type} {id} failed.",
                response.StatusCode,
                subStatusCode: 0,
                activityId: response.Headers.ActivityId,
                requestCharge: response.Headers.RequestCharge);
        }

        return response.StatusCode;
    }

    /// <summary>
    /// The cursor for a collection, or a fresh one when it has never been
    /// synced. A missing cursor is the normal state on the first run, not an
    /// error.
    /// </summary>
    public async Task<WhoopSyncState> ReadStateAsync(
        WhoopCollection collection,
        CancellationToken cancellationToken)
    {
        using var response = await Container.ReadItemStreamAsync(
            collection.Type,
            new PartitionKey(SyncStateType),
            cancellationToken: cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return WhoopSyncState.NotStarted(collection.Type);
        }

        if (!response.IsSuccessStatusCode)
        {
            throw new CosmosException(
                response.ErrorMessage ?? $"Reading the {collection.Type} cursor failed.",
                response.StatusCode,
                subStatusCode: 0,
                activityId: response.Headers.ActivityId,
                requestCharge: response.Headers.RequestCharge);
        }

        var state = await JsonSerializer.DeserializeAsync<WhoopSyncState>(
            response.Content, cancellationToken: cancellationToken);

        return state ?? WhoopSyncState.NotStarted(collection.Type);
    }

    public async Task WriteStateAsync(WhoopSyncState state, CancellationToken cancellationToken)
    {
        using var payload = new MemoryStream();
        await JsonSerializer.SerializeAsync(payload, state, cancellationToken: cancellationToken);
        payload.Position = 0;

        using var response = await Container.UpsertItemStreamAsync(
            payload,
            new PartitionKey(SyncStateType),
            cancellationToken: cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new CosmosException(
                response.ErrorMessage ?? $"Writing the {state.Id} cursor failed.",
                response.StatusCode,
                subStatusCode: 0,
                activityId: response.Headers.ActivityId,
                requestCharge: response.Headers.RequestCharge);
        }
    }

    public async Task DeleteStateAsync(WhoopCollection collection, CancellationToken cancellationToken)
    {
        using var response = await Container.DeleteItemStreamAsync(
            collection.Type,
            new PartitionKey(SyncStateType),
            cancellationToken: cancellationToken);

        // A cursor that was not there is the state the caller asked for.
        if (!response.IsSuccessStatusCode && response.StatusCode != HttpStatusCode.NotFound)
        {
            throw new CosmosException(
                response.ErrorMessage ?? $"Deleting the {collection.Type} cursor failed.",
                response.StatusCode,
                subStatusCode: 0,
                activityId: response.Headers.ActivityId,
                requestCharge: response.Headers.RequestCharge);
        }
    }
}
