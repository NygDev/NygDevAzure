using System.Net;
using System.Text.Json;
using ApiFunctionApp.Gym;
using Microsoft.Azure.Cosmos;
using Xunit;

namespace ApiFunctionApp.Tests;

/// <summary>
/// The session counters stored on a mesocycle: that every write which adds,
/// submits or removes a session moves them exactly once, including when it is
/// retried or raced, and that a block from before they existed is counted
/// once and correctly.
/// </summary>
public sealed class SessionCountTests(CosmosFixture cosmos) : IClassFixture<CosmosFixture>, IDisposable
{
    private static readonly DateOnly Day = new(2026, 9, 3);

    // A partition of its own per test, so the tests share the container
    // without seeing each other's blocks.
    private readonly string objectId = Guid.NewGuid().ToString();

    private GymStore Store => new(cosmos.Container);

    public void Dispose() => cosmos.Interceptor.Clear();

    [CosmosFact]
    public async Task A_new_block_starts_verified_at_zero()
    {
        var mesoId = await NewBlockAsync();

        var stored = await StoredCountsAsync(mesoId);

        Assert.Equal(new MesocycleCounts(0, 0, Verified: true), stored);
        Assert.Equal((0, 0), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task Start_retried_after_a_lost_response_counts_once()
    {
        var mesoId = await NewBlockAsync();

        var first = await StartAsync(mesoId, Day);
        var retry = await StartAsync(mesoId, Day);

        Assert.False(first.Resumed);
        Assert.True(retry.Resumed);
        Assert.Equal(first.Session!.Id, retry.Session!.Id);
        Assert.Equal((1, 0), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task A_second_workout_on_the_same_date_counts_as_another_session()
    {
        var mesoId = await NewBlockAsync();

        var first = await StartAsync(mesoId, Day);
        await Store.SubmitAsync(objectId, first.Session!.Id, default);
        var second = await StartAsync(mesoId, Day);

        Assert.NotEqual(first.Session.Id, second.Session!.Id);
        Assert.Equal((2, 1), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task Start_in_a_block_that_has_gone_writes_nothing()
    {
        var mesoId = await NewBlockAsync();
        await cosmos.Container.DeleteItemStreamAsync($"meso_{mesoId}", new PartitionKey(objectId));

        var creation = await StartAsync(mesoId, Day);

        Assert.True(creation.BlockMissing);
        Assert.Null(creation.Session);
        Assert.Null(await cosmos.ReadRawAsync(objectId, GymSessionId(Day)));
    }

    [CosmosFact]
    public async Task Submitting_twice_counts_once()
    {
        var mesoId = await NewBlockAsync();
        var sessionId = (await StartAsync(mesoId, Day)).Session!.Id;

        var first = await Store.SubmitAsync(objectId, sessionId, default);
        var second = await Store.SubmitAsync(objectId, sessionId, default);

        Assert.Equal(GymSession.Submitted, first!.Status);
        Assert.Equal(GymSession.Submitted, second!.Status);
        Assert.Equal((1, 1), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task A_submit_racing_its_own_resend_counts_once()
    {
        var mesoId = await NewBlockAsync();
        var sessionId = (await StartAsync(mesoId, Day)).Session!.Id;

        // The resend lands between this submit's read — which saw a draft —
        // and its batch, so the batch's predicate is what has to refuse it.
        cosmos.Interceptor.Before(Interceptor.IsBatch, () => Store.SubmitAsync(objectId, sessionId, default));

        var session = await Store.SubmitAsync(objectId, sessionId, default);

        Assert.Equal(GymSession.Submitted, session!.Status);
        Assert.Equal((1, 1), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task Submit_answers_with_the_session_as_it_now_stands()
    {
        var mesoId = await NewBlockAsync();
        var sessionId = (await StartAsync(mesoId, Day, "Bench Press")).Session!.Id;
        await LogSetDirectlyAsync(mesoId, Day, "Bench Press");

        var session = await Store.SubmitAsync(objectId, sessionId, default);

        Assert.Equal(GymSession.Submitted, session!.Status);
        Assert.Single(session.Entries[0].Sets);
    }

    [CosmosFact]
    public async Task Deleting_a_draft_takes_it_off_the_session_count()
    {
        var mesoId = await NewBlockAsync();
        var sessionId = (await StartAsync(mesoId, Day)).Session!.Id;

        Assert.True(await Store.DeleteSessionAsync(objectId, sessionId, default));
        Assert.False(await Store.DeleteSessionAsync(objectId, sessionId, default));
        Assert.Equal((0, 0), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task Deleting_a_submitted_session_takes_it_off_both_counts()
    {
        var mesoId = await NewBlockAsync();
        var kept = (await StartAsync(mesoId, Day)).Session!.Id;
        var deleted = (await StartAsync(mesoId, Day.AddDays(1))).Session!.Id;
        await Store.SubmitAsync(objectId, kept, default);
        await Store.SubmitAsync(objectId, deleted, default);

        Assert.True(await Store.DeleteSessionAsync(objectId, deleted, default));
        Assert.Equal((1, 1), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task A_delete_racing_a_set_retries_on_the_new_ETag()
    {
        var mesoId = await NewBlockAsync();
        var sessionId = (await StartAsync(mesoId, Day, "Bench Press")).Session!.Id;

        // The set lands between the delete's read and its batch, so the first
        // batch fails its ETag and the delete has to read and try again.
        var retried = false;
        cosmos.Interceptor.Before(Interceptor.IsBatch, () => LogSetDirectlyAsync(mesoId, Day, "Bench Press"));
        cosmos.Interceptor.Before(Interceptor.IsBatch, () => Task.FromResult(retried = true));

        Assert.True(await Store.DeleteSessionAsync(objectId, sessionId, default));
        Assert.True(retried, "The first delete batch should have failed its ETag and been sent again.");
        Assert.Null(await Store.ReadSessionAsync(objectId, sessionId, default));
        Assert.Equal((0, 0), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task A_delete_racing_a_submit_takes_it_off_both_counts()
    {
        var mesoId = await NewBlockAsync();
        var sessionId = (await StartAsync(mesoId, Day)).Session!.Id;

        // Read as a draft, submitted before the delete lands: the ETag is what
        // makes the retry see it as submitted and take it off both counters.
        cosmos.Interceptor.Before(Interceptor.IsBatch, () => Store.SubmitAsync(objectId, sessionId, default));

        Assert.True(await Store.DeleteSessionAsync(objectId, sessionId, default));
        Assert.Equal((0, 0), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task A_session_whose_block_has_gone_can_still_be_submitted_and_deleted()
    {
        var mesoId = await NewBlockAsync();
        var sessionId = (await StartAsync(mesoId, Day)).Session!.Id;
        await cosmos.Container.DeleteItemStreamAsync($"meso_{mesoId}", new PartitionKey(objectId));

        Assert.Equal(GymSession.Submitted, (await Store.SubmitAsync(objectId, sessionId, default))!.Status);
        Assert.True(await Store.DeleteSessionAsync(objectId, sessionId, default));
        Assert.Null(await Store.ReadSessionAsync(objectId, sessionId, default));
    }

    [CosmosFact]
    public async Task Editing_a_submitted_session_leaves_the_counts_alone()
    {
        var mesoId = await NewBlockAsync();
        var sessionId = (await StartAsync(mesoId, Day, "Bench Press", "Squat")).Session!.Id;
        await LogSetDirectlyAsync(mesoId, Day, "Bench Press", "Squat");
        await Store.SubmitAsync(objectId, sessionId, default);

        await Store.EditSetAsync(objectId, sessionId, 0, 0, "Bench Press", 1, new WorkSet(102.5, 5, 8), default);
        await Store.ReorderEntryAsync(objectId, sessionId, 0, 1, "Bench Press", 2, default);
        await Store.RemoveEntryAsync(objectId, sessionId, 0, "Squat", 2, default);
        await Store.SwapEntryAsync(objectId, sessionId, 0, "Bench Press", 1, 1, "Incline Bench", true, default);

        var session = await Store.ReadSessionAsync(objectId, sessionId, default);

        Assert.Equal(GymSession.Submitted, session!.Status);
        Assert.Equal("Incline Bench", Assert.Single(session.Entries).ExerciseName);
        Assert.Equal((1, 1), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task A_block_from_before_the_counters_is_counted_once_and_stored()
    {
        var mesoId = await LegacyBlockAsync();
        await LegacySessionAsync(mesoId, Day, GymSession.Submitted);
        await LegacySessionAsync(mesoId, Day.AddDays(1), GymSession.Draft);

        // Written after the counters shipped, so it increments a block that has
        // none yet — the partial count the backfill has to overwrite.
        await StartAsync(mesoId, Day.AddDays(2));
        Assert.Equal(new MesocycleCounts(1, 0, Verified: false), await StoredCountsAsync(mesoId));

        Assert.Equal((3, 1), await ListedCountsAsync(mesoId));
        Assert.Equal(new MesocycleCounts(3, 1, Verified: true), await StoredCountsAsync(mesoId));

        // And from then on it is the stored numbers, moved by the writes.
        await Store.DeleteSessionAsync(objectId, GymSessionId(Day), default);
        Assert.Equal((2, 0), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task A_backfill_racing_a_start_recounts()
    {
        var mesoId = await LegacyBlockAsync();
        await LegacySessionAsync(mesoId, Day, GymSession.Submitted);

        // Lands after the count and before the store: the store fails its
        // ETag, and the second count includes it.
        cosmos.Interceptor.Before(Interceptor.IsPatch, () => StartAsync(mesoId, Day.AddDays(1)));

        Assert.Equal((2, 1), await ListedCountsAsync(mesoId));
        Assert.Equal(new MesocycleCounts(2, 1, Verified: true), await StoredCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task Deleting_a_block_of_more_than_a_hundred_sessions_takes_all_of_them()
    {
        var mesoId = await NewBlockAsync();
        await StartManyAsync(mesoId, 150);
        Assert.Equal((150, 0), await ListedCountsAsync(mesoId));

        var deletion = await Store.DeleteMesocycleAsync(objectId, mesoId, default);

        Assert.True(deletion.Found);
        Assert.Equal(150, deletion.SessionsDeleted);
        Assert.Null(await Store.ReadMesocycleAsync(objectId, mesoId, default));
        Assert.Empty(await Store.ListMesocyclesAsync(objectId, default));
        Assert.Empty(await Store.ListSessionsAsync(objectId, mesoId, default));
    }

    [CosmosFact]
    public async Task An_interrupted_block_delete_leaves_the_counts_right()
    {
        var mesoId = await NewBlockAsync();
        await StartManyAsync(mesoId, 150);

        // The first batch of the cascade lands and the second does not.
        var batches = 0;
        cosmos.Interceptor.Fail(request => Interceptor.IsBatch(request) && ++batches == 2, HttpStatusCode.InternalServerError);

        await Assert.ThrowsAsync<CosmosException>(() => Store.DeleteMesocycleAsync(objectId, mesoId, default));

        var remaining = (await Store.ListSessionsAsync(objectId, mesoId, default)).Count;

        Assert.Equal(150 - 99, remaining);
        Assert.Equal((remaining, 0), await ListedCountsAsync(mesoId));
    }

    private async Task<string> NewBlockAsync() =>
        (await Store.CreateMesocycleAsync(
            objectId,
            "Test block",
            8,
            [new MesoDay(0, "Upper", []), new MesoDay(1, "Lower", [])],
            default)).Id;

    private Task<SessionCreation> StartAsync(string mesoId, DateOnly date, params string[] exercises) =>
        Store.CreateSessionAsync(
            objectId,
            date,
            mesoId,
            1,
            0,
            exercises.Select(name => new SessionEntry(name, [])).ToArray(),
            default);

    private async Task StartManyAsync(string mesoId, int count)
    {
        for (var i = 0; i < count; i++)
        {
            Assert.NotNull((await StartAsync(mesoId, Day.AddDays(i))).Session);
        }
    }

    /// <summary>A block as this app wrote one before the counters: no counter properties at all.</summary>
    private async Task<string> LegacyBlockAsync()
    {
        // Shaped like a ULID — hex is a subset of its alphabet.
        var mesoId = $"01{Guid.NewGuid():N}"[..26].ToUpperInvariant();

        await cosmos.UpsertRawAsync(objectId, JsonSerializer.Serialize(new
        {
            id = $"meso_{mesoId}",
            objectId,
            type = "mesocycle",
            name = "Old block",
            weeks = 6,
            days = new[] { new { dayIndex = 0, label = "Full body", plan = Array.Empty<object>() } },
        }));

        return mesoId;
    }

    private Task LegacySessionAsync(string mesoId, DateOnly date, string status) =>
        cosmos.UpsertRawAsync(objectId, JsonSerializer.Serialize(new
        {
            id = GymSessionId(date),
            objectId,
            type = "session",
            mesoId,
            week = 1,
            dayIndex = 0,
            status,
            entries = Array.Empty<object>(),
        }));

    /// <summary>
    /// A draft with one set logged on its first exercise, written whole.
    ///
    /// Stands in for <see cref="GymStore.AppendSetAsync"/>, whose filter
    /// predicate — <c>ARRAY_LENGTH(c.entries[0].sets)</c> — the vNext emulator
    /// refuses with a 400 that real Cosmos does not. What these tests need from
    /// a set-tap is what it does to the document and its ETag, and this does
    /// the same.
    /// </summary>
    private Task LogSetDirectlyAsync(string mesoId, DateOnly date, params string[] exercises) =>
        cosmos.UpsertRawAsync(objectId, JsonSerializer.Serialize(new
        {
            id = GymSessionId(date),
            objectId,
            type = "session",
            mesoId,
            week = 1,
            dayIndex = 0,
            status = GymSession.Draft,
            entries = exercises.Select((name, index) => new
            {
                exerciseName = name,
                sets = index == 0 ? new object[] { new { weightKg = 100, reps = 5 } } : [],
            }),
        }));

    private async Task<(int Sessions, int Submitted)> ListedCountsAsync(string mesoId)
    {
        var block = Assert.Single(
            await Store.ListMesocyclesAsync(objectId, default),
            summary => summary.Block.Id == mesoId);

        return (block.SessionCount, block.SubmittedCount);
    }

    private async Task<MesocycleCounts> StoredCountsAsync(string mesoId)
    {
        var json = await cosmos.ReadRawAsync(objectId, $"meso_{mesoId}");

        Assert.NotNull(json);

        using var document = JsonDocument.Parse(json);

        return MesocycleCounts.Read(document.RootElement);
    }

    private static string GymSessionId(DateOnly date) => $"session_{date:yyyy-MM-dd}";
}
