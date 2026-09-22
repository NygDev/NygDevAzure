using System.Text.Json.Serialization;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// How far the sync has got with one collection, stored as a Cosmos document
/// so it survives the instance that wrote it.
///
/// The backfill and the incremental pass are the same loop over the same
/// endpoint; this is what tells them apart. Until <see cref="BackfillComplete"/>
/// the sync is walking history backwards from now, saving
/// <see cref="NextToken"/> after every page so an interrupted run resumes
/// where it stopped rather than starting over. After that it re-reads a short
/// recent window on each run, because WHOOP filters a collection by start
/// time and a record rescored days later keeps its original start — so
/// "everything since last time" would silently miss it.
/// </summary>
public sealed record WhoopSyncState
{
    /// <summary>The collection's type, which is also the document id.</summary>
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    /// <summary>Also the partition key: every cursor shares one partition.</summary>
    [JsonPropertyName("type")]
    public string Type { get; init; } = WhoopStore.SyncStateType;

    [JsonPropertyName("backfill_complete")]
    public bool BackfillComplete { get; init; }

    /// <summary>Where to resume the backfill; null once it has finished.</summary>
    [JsonPropertyName("next_token")]
    public string? NextToken { get; init; }

    /// <summary>
    /// The start time of the oldest record stored so far — the readable half
    /// of the cursor, since next_token is opaque.
    /// </summary>
    [JsonPropertyName("oldest_start")]
    public DateTimeOffset? OldestStart { get; init; }

    [JsonPropertyName("last_run_at")]
    public DateTimeOffset? LastRunAt { get; init; }

    [JsonPropertyName("records_written")]
    public long RecordsWritten { get; init; }

    public static WhoopSyncState NotStarted(string type) => new() { Id = type };
}
