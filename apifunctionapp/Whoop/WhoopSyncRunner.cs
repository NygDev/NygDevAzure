using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// Walks WHOOP's collections into Cosmos, within a time budget.
///
/// The budget is the point. A full backfill is thousands of records at 25 a
/// page, which is minutes of work, and an HTTP-triggered function is cut off
/// by the load balancer at 230 seconds. So the run stops when the budget is
/// spent, having saved its cursor, and says there is more to do — call it
/// again and it picks up where it left off.
/// </summary>
public sealed class WhoopSyncRunner(WhoopStore store, ILogger<WhoopSyncRunner> logger)
{
    /// <summary>
    /// How far back an incremental run re-reads. WHOOP filters a collection by
    /// start time, so a record rescored after it was first stored keeps its
    /// original start and would never come back in a "since last sync" query.
    /// Re-reading a week catches those; the upsert makes it free of duplicates.
    /// </summary>
    private static readonly TimeSpan RefreshWindow = TimeSpan.FromDays(7);

    public async Task<WhoopSyncResult> SyncAsync(
        WhoopCollection collection,
        WhoopClient client,
        DateTimeOffset deadline,
        CancellationToken cancellationToken)
    {
        var state = await store.ReadStateAsync(collection, cancellationToken);

        var backfilling = !state.BackfillComplete;

        // The backfill walks all of history from now, newest first. An
        // incremental run asks only for the recent window and always starts a
        // fresh page sequence, so it never resumes a stale token.
        var start = backfilling ? (DateTimeOffset?)null : DateTimeOffset.UtcNow - RefreshWindow;
        var token = backfilling ? state.NextToken : null;

        var written = 0;
        var skipped = 0;
        var pages = 0;
        var oldestStart = state.OldestStart;
        var ranOutOfTime = false;

        while (true)
        {
            var page = await client.GetPageAsync(
                collection, WhoopClient.MaxPageSize, start, token, cancellationToken);

            pages++;

            foreach (var record in page.Records)
            {
                if (collection.ReadId(record) is not { Length: > 0 } id)
                {
                    // Nothing to key the document on. Skipped rather than
                    // failed: one malformed record should not stop a backfill
                    // that is otherwise making progress.
                    logger.LogWarning(
                        "A {Type} record carried no usable '{IdProperty}'; skipping it.",
                        collection.Type,
                        collection.IdProperty);

                    skipped++;
                    continue;
                }

                await store.UpsertRecordAsync(collection, id, record, cancellationToken);
                written++;

                if (ReadStart(record) is { } recordStart
                    && (oldestStart is null || recordStart < oldestStart))
                {
                    oldestStart = recordStart;
                }
            }

            token = page.NextToken;

            if (token is null)
            {
                // WHOOP has no more pages. For a backfill that means history is
                // exhausted and every later run can be incremental.
                if (backfilling)
                {
                    backfilling = false;
                }

                break;
            }

            if (DateTimeOffset.UtcNow >= deadline)
            {
                ranOutOfTime = true;
                break;
            }
        }

        var updated = state with
        {
            BackfillComplete = !backfilling,
            // Only a backfill has a cursor worth keeping; an incremental run
            // rebuilds its page sequence from the window every time.
            NextToken = backfilling ? token : null,
            OldestStart = oldestStart,
            LastRunAt = DateTimeOffset.UtcNow,
            RecordsWritten = state.RecordsWritten + written,
        };

        await store.WriteStateAsync(updated, cancellationToken);

        logger.LogInformation(
            "Synced {Written} {Type} records over {Pages} pages (skipped {Skipped}); "
            + "backfill complete: {Complete}, more work: {More}.",
            written,
            collection.Type,
            pages,
            skipped,
            updated.BackfillComplete,
            ranOutOfTime);

        return new WhoopSyncResult
        {
            Type = collection.Type,
            Written = written,
            Skipped = skipped,
            Pages = pages,
            BackfillComplete = updated.BackfillComplete,
            MoreWorkRemaining = ranOutOfTime,
            OldestStart = updated.OldestStart,
            TotalRecordsWritten = updated.RecordsWritten,
        };
    }

    /// <summary>
    /// A record's start time. Recovery has none — it is the one collection
    /// keyed to a cycle rather than to a span of time — so this is null there
    /// and the cursor's readable half stays empty.
    ///
    /// Parsed rather than compared as text: WHOOP's timestamps are ISO 8601
    /// but nothing guarantees a fixed number of fractional digits, and
    /// ".01Z" sorts after ".010Z" as a string while being the same instant.
    /// </summary>
    private static DateTimeOffset? ReadStart(JsonElement record) =>
        record.ValueKind == JsonValueKind.Object
            && record.TryGetProperty("start", out var start)
            && start.ValueKind == JsonValueKind.String
            && DateTimeOffset.TryParse(
                start.GetString(),
                CultureInfo.InvariantCulture,
                DateTimeStyles.RoundtripKind,
                out var parsed)
            ? parsed
            : null;
}

/// <summary>What one collection's run did, for the endpoint's response.</summary>
public sealed record WhoopSyncResult
{
    public required string Type { get; init; }

    public required int Written { get; init; }

    public required int Skipped { get; init; }

    public required int Pages { get; init; }

    public required bool BackfillComplete { get; init; }

    /// <summary>True when the budget ran out mid-backfill: call again.</summary>
    public required bool MoreWorkRemaining { get; init; }

    public DateTimeOffset? OldestStart { get; init; }

    public required long TotalRecordsWritten { get; init; }
}
