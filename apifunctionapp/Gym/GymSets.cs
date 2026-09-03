using System.Globalization;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Gym;

/// <summary>
/// The logging itself: adding an exercise, logging a set, taking one back.
///
/// This is the hot path — a set-tap fires thirty or forty times a session,
/// far more often than everything else in the app put together — and all three
/// endpoints are one Cosmos patch each, with no read in front and no
/// read-modify-write anywhere.
///
/// They are also the three that have to survive a bad connection, because that
/// is what a gym is. Each one carries the count the client believes the session
/// holds, and the patch applies only while that is still true. A request whose
/// response was lost and was retried therefore cannot apply twice: the count no
/// longer matches, Cosmos refuses, and the answer comes back as
/// <c>alreadyRecorded</c> rather than as an error.
///
/// <strong>A client must treat <c>alreadyRecorded</c> as success.</strong> It
/// means the first attempt landed. That is what makes the one-tap "Log same
/// again" button safe to hammer, and it is also the whole answer to offline
/// drafts: a queue of taps replayed on reconnect is safe by construction, with
/// no reconciliation pass to write.
/// </summary>
public class GymSets(GymStore store, ILogger<GymSets> logger)
{
    /// <summary>
    /// Adds an exercise to the session — the picker, and the one call that
    /// carries a custom exercise name.
    ///
    /// Custom names post inline like this rather than being registered
    /// somewhere first, because they belong to the workout they were typed
    /// into. The shipped library is a static file on the CDN and has nothing to
    /// do with this call.
    /// </summary>
    [Function("GymEntryAdd")]
    public Task<IActionResult> AddEntry(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "gym/workouts/{sessionId}/entries")] HttpRequest request,
        string sessionId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsWellFormed(sessionId))
            {
                return GymEndpoint.Invalid($"'{sessionId}' is not a workout id.");
            }

            var (body, rejection) = await GymEndpoint.ReadBodyAsync(request, token);

            if (body is null)
            {
                return rejection!;
            }

            using (body)
            {
                if (!GymRequests.TryReadEntry(
                        body.RootElement,
                        out var exerciseName,
                        out var expected,
                        out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                var outcome = await store.AppendEntryAsync(
                    objectId,
                    sessionId,
                    expected,
                    exerciseName,
                    token);

                return outcome.Result switch
                {
                    PatchResult.Applied => new OkObjectResult(new
                    {
                        ok = true,
                        alreadyRecorded = false,
                        entryIndex = expected,
                        entryCount = expected + 1,
                        exerciseName,
                    }),

                    PatchResult.AlreadyApplied => new OkObjectResult(new
                    {
                        ok = true,
                        alreadyRecorded = true,
                        entryIndex = expected,
                        entryCount = outcome.Actual,
                        exerciseName,
                    }),

                    PatchResult.SessionNotFound => GymWorkouts.NoSuchSession(sessionId),

                    _ => Mismatch(
                        "entryCount",
                        expected,
                        outcome.Actual,
                        $"The session holds {outcome.Actual} exercises, not the {expected} this "
                        + "request expected."),
                };
            }
        });

    /// <summary>
    /// One tap, one patch: appends a set to an entry, server-side.
    ///
    /// <c>{entryIndex, expectedSetCount, weightKg, reps, rpe}</c>. The append
    /// happens only while the entry still holds <c>expectedSetCount</c> sets,
    /// which is what makes it safe to retry — see the class summary, and
    /// <see cref="GymStore.AppendSetAsync"/> for the mechanism.
    ///
    /// The write is flat in the number of sets already logged: nothing inside
    /// the entries array is indexed, so the fortieth set of a session costs
    /// what the first did.
    /// </summary>
    [Function("GymSetLog")]
    public Task<IActionResult> LogSet(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "gym/workouts/{sessionId}/sets")] HttpRequest request,
        string sessionId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsWellFormed(sessionId))
            {
                return GymEndpoint.Invalid($"'{sessionId}' is not a workout id.");
            }

            var (body, rejection) = await GymEndpoint.ReadBodyAsync(request, token);

            if (body is null)
            {
                return rejection!;
            }

            using (body)
            {
                if (!GymRequests.TryReadSet(
                        body.RootElement,
                        out var entryIndex,
                        out var expected,
                        out var set,
                        out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                var outcome = await store.AppendSetAsync(
                    objectId,
                    sessionId,
                    entryIndex,
                    expected,
                    set,
                    token);

                return outcome.Result switch
                {
                    PatchResult.Applied => new OkObjectResult(new
                    {
                        ok = true,
                        alreadyRecorded = false,
                        entryIndex,
                        setIndex = expected,
                        setCount = expected + 1,
                    }),

                    // The first attempt landed and only the answer was lost.
                    // Success, and the client should treat it as one: the set
                    // is in the session, at the position it asked for.
                    PatchResult.AlreadyApplied => new OkObjectResult(new
                    {
                        ok = true,
                        alreadyRecorded = true,
                        entryIndex,
                        setIndex = expected,
                        setCount = outcome.Actual,
                    }),

                    PatchResult.SessionNotFound => GymWorkouts.NoSuchSession(sessionId),

                    PatchResult.EntryNotFound => GymEndpoint.Failure(
                        HttpStatusCode.Conflict,
                        "no_such_entry",
                        $"Entry {entryIndex.ToString(CultureInfo.InvariantCulture)} is not in "
                        + $"{sessionId}, which holds {outcome.Actual} exercises. Add the exercise "
                        + "first with POST /api/gym/workouts/{id}/entries — that call returns the "
                        + "index to log sets against."),

                    _ => Mismatch(
                        "setCount",
                        expected,
                        outcome.Actual,
                        $"Entry {entryIndex.ToString(CultureInfo.InvariantCulture)} holds "
                        + $"{outcome.Actual} sets, not the {expected} this request expected."),
                };
            }
        });

    /// <summary>
    /// Takes a set back — a mistyped weight, or one that was never done.
    ///
    /// <c>?expectedSetCount=</c> is the same guard the append carries, and it
    /// is required rather than optional: an unguarded remove-by-index is the
    /// one operation here that a retry could turn into the deletion of a set
    /// the user did do.
    /// </summary>
    [Function("GymSetRemove")]
    public Task<IActionResult> RemoveSet(
        [HttpTrigger(
            AuthorizationLevel.Anonymous,
            "delete",
            Route = "gym/workouts/{sessionId}/entries/{entryIndex:int}/sets/{setIndex:int}")] HttpRequest request,
        string sessionId,
        int entryIndex,
        int setIndex,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsWellFormed(sessionId))
            {
                return GymEndpoint.Invalid($"'{sessionId}' is not a workout id.");
            }

            if (entryIndex < 0 || entryIndex >= GymLimits.MaxEntriesPerSession)
            {
                return GymEndpoint.Invalid($"'entryIndex' is {entryIndex}, outside 0 to "
                    + $"{GymLimits.MaxEntriesPerSession - 1}.");
            }

            if (setIndex < 0 || setIndex >= GymLimits.MaxSetsPerEntry)
            {
                return GymEndpoint.Invalid($"'setIndex' is {setIndex}, outside 0 to "
                    + $"{GymLimits.MaxSetsPerEntry - 1}.");
            }

            var raw = request.Query["expectedSetCount"].FirstOrDefault();

            if (!int.TryParse(raw, NumberStyles.Integer, CultureInfo.InvariantCulture, out var expected)
                || expected < 1
                || expected > GymLimits.MaxSetsPerEntry)
            {
                return GymEndpoint.Invalid(
                    "'expectedSetCount' is missing from the query string, or is not a whole number "
                    + $"from 1 to {GymLimits.MaxSetsPerEntry}. It is how many sets the entry held "
                    + "before this delete, and it is what keeps a retried delete from removing a "
                    + "second set that was logged in between.");
            }

            if (setIndex >= expected)
            {
                return GymEndpoint.Invalid(
                    $"'setIndex' is {setIndex} and 'expectedSetCount' is {expected}, so the set "
                    + "being deleted is not one the entry is said to hold.");
            }

            var outcome = await store.RemoveSetAsync(
                objectId,
                sessionId,
                entryIndex,
                setIndex,
                expected,
                token);

            return outcome.Result switch
            {
                PatchResult.Applied => new OkObjectResult(new
                {
                    ok = true,
                    alreadyRemoved = false,
                    entryIndex,
                    setCount = expected - 1,
                }),

                PatchResult.AlreadyApplied => new OkObjectResult(new
                {
                    ok = true,
                    alreadyRemoved = true,
                    entryIndex,
                    setCount = outcome.Actual,
                }),

                PatchResult.SessionNotFound => GymWorkouts.NoSuchSession(sessionId),

                PatchResult.EntryNotFound => GymEndpoint.Failure(
                    HttpStatusCode.Conflict,
                    "no_such_entry",
                    $"Entry {entryIndex.ToString(CultureInfo.InvariantCulture)} is not in {sessionId}, "
                    + $"which holds {outcome.Actual} exercises."),

                _ => Mismatch(
                    "setCount",
                    expected,
                    outcome.Actual,
                    $"Entry {entryIndex.ToString(CultureInfo.InvariantCulture)} holds "
                    + $"{outcome.Actual} sets, not the {expected} this request expected."),
            };
        });

    /// <summary>
    /// The guard refused and the operation had not already landed: the client's
    /// copy of the session is stale.
    ///
    /// 409 with the real count, so the answer is enough to resync on without a
    /// read of its own. Not a 412 — the caller sent no precondition header, and
    /// answering with a status about one would send whoever is debugging this
    /// looking for an ETag that was never involved.
    /// </summary>
    private static IActionResult Mismatch(string field, int expected, int actual, string message) =>
        new ObjectResult(new
        {
            ok = false,
            error = "count_mismatch",
            message = message
                + " Nothing was written. Re-read the workout with GET /api/gym/workouts/{id} and "
                + "log again from what it holds — this is the guard that keeps a retry from "
                + "duplicating a set doing its job, not a failure to write.",
            expected,
            actual,
            field,
        })
        {
            StatusCode = (int)HttpStatusCode.Conflict,
        };
}
