using System.Globalization;
using System.Text.Json;
using Microsoft.Azure.Cosmos;
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
    /// One sync at a time, whatever started it. Two overlapping runs would
    /// read the same cursor, fetch the same pages and race each other writing
    /// it back, so the second caller is turned away rather than queued — by
    /// the time a run finishes, whatever the second caller wanted is already
    /// done. Static because the worker builds a new instance per invocation,
    /// and the app is capped at maximum_instance_count = 1, so one process is
    /// the whole story.
    /// </summary>
    private static readonly SemaphoreSlim SyncGate = new(1, 1);

    /// <summary>
    /// How far back an incremental run re-reads by default. WHOOP filters a
    /// collection by start time, so a record rescored after it was first
    /// stored keeps its original start and would never come back in a "since
    /// last sync" query. Re-reading a week catches those; the upsert makes it
    /// free of duplicates.
    ///
    /// It is measured back from the last run that read its window to the end
    /// rather than from now — see <see cref="WhoopSyncState.SyncedThrough"/> —
    /// so an outage widens it by however long nothing was syncing. Measured
    /// from now, a fortnight with a rejected refresh token left a week of
    /// records that no later run would ever ask for, unless someone remembered
    /// to call the sync by hand with a larger <c>?days=</c>.
    /// </summary>
    public static readonly TimeSpan DefaultRefreshWindow = TimeSpan.FromDays(7);

    /// <summary>
    /// Syncs every collection asked for, or returns null when another run
    /// already holds the gate.
    ///
    /// Each collection is isolated: one that fails should not cost the others
    /// their run. That is what makes an unattended sync worth scheduling — a
    /// WHOOP hiccup on recovery still leaves cycles, sleep and workouts
    /// current. The deadline is shared across all of them, so a backfill that
    /// eats the whole budget leaves the rest for the next run rather than
    /// overrunning on their behalf.
    /// </summary>
    public async Task<IReadOnlyList<WhoopSyncResult>?> TrySyncAllAsync(
        IReadOnlyList<WhoopCollection> collections,
        WhoopClient client,
        DateTimeOffset deadline,
        TimeSpan refreshWindow,
        bool reset,
        CancellationToken cancellationToken)
    {
        if (!await SyncGate.WaitAsync(TimeSpan.Zero, cancellationToken))
        {
            return null;
        }

        try
        {
            var results = new List<WhoopSyncResult>(collections.Count);

            foreach (var collection in collections)
            {
                try
                {
                    if (reset)
                    {
                        await store.DeleteStateAsync(collection, cancellationToken);
                    }

                    results.Add(await SyncAsync(
                        collection, client, deadline, refreshWindow, cancellationToken));
                }
                catch (WhoopAuthException ex) when (ex.NeedsReauthorization)
                {
                    logger.LogError(ex, "WHOOP rejected the stored credentials during a sync.");

                    results.Add(WhoopSyncResult.Failed(
                        collection, "whoop_reauthorization_required", ex.ResponseBody ?? ex.Message));

                    // Every remaining collection would fail the same way on the
                    // same credentials, so there is nothing to gain by asking
                    // WHOOP three more times.
                    break;
                }
                catch (WhoopAuthException ex)
                {
                    logger.LogError(ex, "Syncing {Type} failed upstream.", collection.Type);
                    results.Add(WhoopSyncResult.Failed(
                        collection, "whoop_upstream_error", ex.ResponseBody ?? ex.Message));
                }
                catch (CosmosException ex)
                {
                    logger.LogError(ex, "Cosmos rejected a {Type} write.", collection.Type);
                    results.Add(WhoopSyncResult.Failed(collection, "cosmos_write_failed", ex.Message));
                }
                // A cancellation is let through only when it is this run being
                // cancelled. HttpClient reports its own timeout as a
                // TaskCanceledException too, and that one is WHOOP being slow
                // on one collection — not a reason to abandon the others, or
                // to fail the whole invocation.
                catch (Exception ex) when (
                    ex is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
                {
                    logger.LogError(ex, "Syncing {Type} failed.", collection.Type);
                    results.Add(WhoopSyncResult.Failed(collection, "unexpected_error", ex.Message));
                }

                if (DateTimeOffset.UtcNow >= deadline)
                {
                    break;
                }
            }

            return results;
        }
        finally
        {
            SyncGate.Release();
        }
    }

    public async Task<WhoopSyncResult> SyncAsync(
        WhoopCollection collection,
        WhoopClient client,
        DateTimeOffset deadline,
        TimeSpan refreshWindow,
        CancellationToken cancellationToken)
    {
        var state = await store.ReadStateAsync(collection, cancellationToken);

        var runStartedAt = DateTimeOffset.UtcNow;
        var backfilling = !state.BackfillComplete;
        var incremental = !backfilling;

        // The backfill walks all of history from now, newest first. An
        // incremental run asks only for the recent window and always starts a
        // fresh page sequence, so it never resumes a stale token.
        //
        // The window reaches back from the last run that covered its own to
        // the end, not from this one. Every six hours that is the same week
        // give or take; after an outage it is the week plus the outage.
        var coveredThrough = state.SyncedThrough ?? state.LastRunAt ?? runStartedAt;

        if (coveredThrough > runStartedAt)
        {
            coveredThrough = runStartedAt;
        }

        var start = backfilling ? (DateTimeOffset?)null : coveredThrough - refreshWindow;
        var token = backfilling ? state.NextToken : null;

        // A backfill's page sequence is a snapshot taken when it starts, so
        // that — not the run that eventually finishes it — is the instant its
        // coverage runs up to, and where the first incremental window has to
        // reach back from.
        var syncedThrough = backfilling && token is null ? runStartedAt : state.SyncedThrough;

        var written = 0;
        var unchanged = 0;
        var skipped = 0;
        var pages = 0;
        var storedPages = 0;
        var oldestStart = state.OldestStart;
        var ranOutOfTime = false;

        try
        {
            while (true)
            {
                var page = await client.GetPageAsync(
                    collection, WhoopClient.MaxPageSize, start, token, cancellationToken);

                pages++;

                var upserts = new List<Task<WhoopWriteOutcome>>(page.Records.Count);
                var pageOldestStart = oldestStart;

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

                    // The store checks what is already there before writing, except
                    // while backfilling — there every record is one this app has
                    // never seen, so the check would be a round trip per record
                    // spent to discover exactly that, and the budget is the scarce
                    // thing rather than the RU.
                    upserts.Add(store.UpsertRecordAsync(
                        collection, id, record, checkStored: !backfilling, cancellationToken));

                    if (ReadStart(record) is { } recordStart
                        && (pageOldestStart is null || recordStart < pageOldestStart))
                    {
                        pageOldestStart = recordStart;
                    }
                }

                // A page's records go to Cosmos together rather than one after the
                // next. A backfill is thousands of round trips and almost nothing
                // else, so waiting out each one in turn is most of what the budget
                // gets spent on — and an incremental run now makes up to two round
                // trips per record rather than one, which is more reason to
                // overlap them, not less. WHOOP caps a page at 25 records, which is
                // what bounds the work in flight — no throttle needed beyond the
                // page itself. The writes are independent upserts, so the order
                // they land in does not matter.
                var outcomes = await Task.WhenAll(upserts);

                foreach (var outcome in outcomes)
                {
                    if (outcome == WhoopWriteOutcome.Written)
                    {
                        written++;
                    }
                    else
                    {
                        unchanged++;
                    }
                }

                // Only now is the page behind us: its records are stored, so the
                // cursor and the tallies may move past it. Everything above this
                // line can throw, and the checkpoint below saves what these hold.
                token = page.NextToken;
                oldestStart = pageOldestStart;
                storedPages++;

                if (token is null)
                {
                    // WHOOP has no more pages. For a backfill that means history is
                    // exhausted and every later run can be incremental.
                    backfilling = false;
                    break;
                }

                if (DateTimeOffset.UtcNow >= deadline)
                {
                    ranOutOfTime = true;
                    break;
                }
            }
        }
        catch (Exception) when (backfilling && storedPages > 0)
        {
            await CheckpointAsync(
                state with
                {
                    NextToken = token,
                    OldestStart = oldestStart,
                    SyncedThrough = syncedThrough,
                    RecordsWritten = state.RecordsWritten + written,
                },
                storedPages);

            throw;
        }

        // An incremental run that read its window to the end has covered
        // everything up to the moment it began. One that ran out of time has
        // not, and leaves the mark where it was so the next window still
        // reaches back over what this one never got to — written out even
        // when it was only inferred from last_run_at, which this run is about
        // to move.
        if (incremental)
        {
            syncedThrough = ranOutOfTime ? coveredThrough : runStartedAt;
        }

        var updated = state with
        {
            BackfillComplete = !backfilling,
            // Only a backfill has a cursor worth keeping; an incremental run
            // rebuilds its page sequence from the window every time.
            NextToken = backfilling ? token : null,
            OldestStart = oldestStart,
            LastRunAt = DateTimeOffset.UtcNow,
            SyncedThrough = syncedThrough,

            // Writes that actually happened, not records seen. Since the store
            // began skipping records it already had, a run over a week of
            // settled WHOOP data can legitimately add nothing to this.
            RecordsWritten = state.RecordsWritten + written,
        };

        await store.WriteStateAsync(updated, cancellationToken);

        logger.LogInformation(
            "Synced {Written} {Type} records over {Pages} pages "
            + "({Unchanged} already current, {Skipped} unusable); "
            + "backfill complete: {Complete}, more work: {More}.",
            written,
            collection.Type,
            pages,
            unchanged,
            skipped,
            updated.BackfillComplete,
            ranOutOfTime);

        return new WhoopSyncResult
        {
            Type = collection.Type,
            Written = written,
            Unchanged = unchanged,
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
    /// <summary>
    /// Saves how far a backfill got when the run that was making the progress
    /// fails partway.
    ///
    /// The cursor used to be written only by a run that reached its own end,
    /// so a failure on page forty — WHOOP's rate limit, a timeout, a throttled
    /// write — threw away thirty-nine pages of progress, and the next run
    /// fetched and stored every one of them again before reaching the page
    /// that failed. A history long enough to hit the rate limit inside one run
    /// could not finish at all: each run got exactly as far as the last.
    ///
    /// The cursor saved is the one for the page that failed, so nothing is
    /// skipped — that page is simply asked for again. <c>last_run_at</c> is
    /// left alone, because the run did not finish.
    ///
    /// Best effort, and on a token of its own: the run's token may be the
    /// reason for the failure, and whatever goes wrong here must not replace
    /// the exception that is about to be rethrown.
    /// </summary>
    private async Task CheckpointAsync(WhoopSyncState progress, int storedPages)
    {
        try
        {
            using var saving = new CancellationTokenSource(TimeSpan.FromSeconds(5));

            await store.WriteStateAsync(progress, saving.Token);

            logger.LogWarning(
                "The {Type} backfill failed after {Pages} stored pages; its cursor was saved, so the "
                + "next run resumes from the page that failed.",
                progress.Id,
                storedPages);
        }
        catch (Exception ex)
        {
            logger.LogWarning(
                ex,
                "The {Type} backfill failed after {Pages} stored pages and its cursor could not be "
                + "saved either; the next run repeats them.",
                progress.Id,
                storedPages);
        }
    }

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

    /// <summary>
    /// Records WHOOP returned that the container already held unchanged, so
    /// only the point read that established it was paid for. On a settled
    /// incremental run this is most of the window.
    ///
    /// Not required, so <see cref="Failed"/> keeps working without it: a
    /// collection that threw checked nothing.
    /// </summary>
    public int Unchanged { get; init; }

    public required int Skipped { get; init; }

    public required int Pages { get; init; }

    public required bool BackfillComplete { get; init; }

    /// <summary>True when the budget ran out mid-backfill: call again.</summary>
    public required bool MoreWorkRemaining { get; init; }

    public DateTimeOffset? OldestStart { get; init; }

    public required long TotalRecordsWritten { get; init; }

    /// <summary>
    /// Set when this collection failed. The others in the same run are still
    /// attempted and reported, so a partial result is a real result.
    /// </summary>
    public string? Error { get; init; }

    public string? ErrorDetail { get; init; }

    /// <summary>The shape a collection reports when its own run threw.</summary>
    public static WhoopSyncResult Failed(WhoopCollection collection, string error, string? detail) => new()
    {
        Type = collection.Type,
        Written = 0,
        Skipped = 0,
        Pages = 0,
        BackfillComplete = false,

        // Nothing was recorded, so whatever this collection owed is still owed.
        MoreWorkRemaining = true,

        TotalRecordsWritten = 0,
        Error = error,
        ErrorDetail = detail,
    };
}
