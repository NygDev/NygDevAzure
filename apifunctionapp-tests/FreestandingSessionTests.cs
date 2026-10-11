using System.Text.Json;
using ApiFunctionApp.Gym;
using Xunit;

namespace ApiFunctionApp.Tests;

/// <summary>
/// Freestanding sessions — workouts logged in no block: that they are stored
/// without a block, week or day, that they touch no block's counters, that
/// Start resumes and suffixes them by the same rule as a block's, and that the
/// date-range list finds them beside sessions that are in a block.
/// </summary>
public sealed class FreestandingSessionTests(CosmosFixture cosmos) : IClassFixture<CosmosFixture>, IDisposable
{
    private static readonly DateOnly Day = new(2026, 9, 3);

    private readonly string objectId = Guid.NewGuid().ToString();

    private GymStore Store => new(cosmos.Container);

    public void Dispose() => cosmos.Interceptor.Clear();

    [CosmosFact]
    public async Task Starting_one_needs_no_block_and_stores_none()
    {
        var creation = await StartFreestandingAsync(Day, "Bench Press", "Barbell Row");

        Assert.False(creation.Resumed);
        Assert.True(creation.Session!.IsFreestanding);
        Assert.Equal(["Bench Press", "Barbell Row"], creation.Session.Entries.Select(entry => entry.ExerciseName));

        var json = await cosmos.ReadRawAsync(objectId, SessionId(Day));
        Assert.NotNull(json);

        using var document = JsonDocument.Parse(json);
        Assert.False(document.RootElement.TryGetProperty("mesoId", out _));
        Assert.False(document.RootElement.TryGetProperty("week", out _));
        Assert.False(document.RootElement.TryGetProperty("dayIndex", out _));

        var read = await Store.ReadSessionAsync(objectId, SessionId(Day), default);
        Assert.True(read!.IsFreestanding);
        Assert.Null(read.Week);
        Assert.Null(read.DayIndex);
    }

    [CosmosFact]
    public async Task Start_retried_resumes_the_draft_without_reseeding_it()
    {
        var first = await StartFreestandingAsync(Day, "Squat");
        var retry = await StartFreestandingAsync(Day, "Squat");

        Assert.True(retry.Resumed);
        Assert.Equal(first.Session!.Id, retry.Session!.Id);
        Assert.Single(retry.Session.Entries);
    }

    [CosmosFact]
    public async Task A_block_draft_and_a_freestanding_draft_on_one_date_are_two_workouts()
    {
        var mesoId = await NewBlockAsync();
        var inBlock = await Store.CreateSessionAsync(objectId, Day, mesoId, 1, 0, [], default);

        var freestanding = await StartFreestandingAsync(Day);

        Assert.False(freestanding.Resumed);
        Assert.NotEqual(inBlock.Session!.Id, freestanding.Session!.Id);
        Assert.Equal((1, 0), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task Submitting_and_deleting_one_touch_no_block()
    {
        var mesoId = await NewBlockAsync();
        var creation = await StartFreestandingAsync(Day, "Deadlift");

        var submitted = await Store.SubmitAsync(objectId, creation.Session!.Id, default);
        Assert.Equal(GymSession.Submitted, submitted!.Status);
        Assert.True(submitted.IsFreestanding);

        Assert.True(await Store.DeleteSessionAsync(objectId, creation.Session.Id, default));
        Assert.Null(await cosmos.ReadRawAsync(objectId, SessionId(Day)));
        Assert.Equal((0, 0), await ListedCountsAsync(mesoId));
    }

    [CosmosFact]
    public async Task A_block_list_does_not_see_them_and_the_date_list_sees_both()
    {
        var mesoId = await NewBlockAsync();
        await Store.CreateSessionAsync(objectId, Day, mesoId, 2, 1, [], default);
        await StartFreestandingAsync(Day);
        await StartFreestandingAsync(Day.AddDays(1), "Squat");

        // Outside the range on both sides, including the boundary just after it.
        await StartFreestandingAsync(Day.AddDays(-1));
        await StartFreestandingAsync(Day.AddDays(2));

        var block = await Store.ListSessionsAsync(objectId, mesoId, default);
        Assert.Equal([SessionId(Day)], block.Select(session => session.Id));

        var between = await Store.ListSessionsBetweenAsync(objectId, Day, Day.AddDays(1), default, withEntries: true);

        Assert.Equal(
            [SessionId(Day.AddDays(1)), $"{SessionId(Day)}_2", SessionId(Day)],
            between.Select(session => session.Id));

        var placed = between.Single(session => session.Id == SessionId(Day));
        Assert.Equal(mesoId, placed.MesoId);
        Assert.Equal(2, placed.Week);
        Assert.Equal(1, placed.DayIndex);

        var loose = between.Single(session => session.Id == SessionId(Day.AddDays(1)));
        Assert.Null(loose.MesoId);
        Assert.Null(loose.Week);
        Assert.Equal("Squat", Assert.Single(loose.Entries!).ExerciseName);
    }

    [CosmosFact]
    public async Task Deleting_a_block_leaves_freestanding_sessions_alone()
    {
        var mesoId = await NewBlockAsync();
        await Store.CreateSessionAsync(objectId, Day, mesoId, 1, 0, [], default);
        await StartFreestandingAsync(Day.AddDays(1));

        await Store.DeleteMesocycleAsync(objectId, mesoId, default);

        Assert.Null(await cosmos.ReadRawAsync(objectId, SessionId(Day)));
        Assert.NotNull(await cosmos.ReadRawAsync(objectId, SessionId(Day.AddDays(1))));
    }

    private Task<SessionCreation> StartFreestandingAsync(DateOnly date, params string[] exercises) =>
        Store.CreateSessionAsync(
            objectId,
            date,
            mesoId: null,
            week: null,
            dayIndex: null,
            exercises.Select(name => new SessionEntry(name, [])).ToArray(),
            default);

    private async Task<string> NewBlockAsync() =>
        (await Store.CreateMesocycleAsync(
            objectId,
            "Test block",
            8,
            [new MesoDay(0, "Upper", []), new MesoDay(1, "Lower", [])],
            default)).Id;

    private async Task<(int Sessions, int Submitted)> ListedCountsAsync(string mesoId)
    {
        var block = Assert.Single(
            await Store.ListMesocyclesAsync(objectId, default),
            summary => summary.Block.Id == mesoId);

        return (block.SessionCount, block.SubmittedCount);
    }

    private static string SessionId(DateOnly date) => $"session_{date:yyyy-MM-dd}";
}
