using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Gym;

/// <summary>
/// Workouts: starting one, reading one, listing them, submitting and deleting.
///
/// The per-tap logging is next door in <see cref="GymSets"/>, which is the hot
/// path and is shaped by that. Everything here happens once or twice a session
/// at most, so these are allowed to make two or three reads where that buys a
/// better answer.
/// </summary>
public class GymWorkouts(GymStore store, ILogger<GymWorkouts> logger)
{
    /// <summary>
    /// Start: opens today's draft, or hands back the one already open.
    ///
    /// The body is <c>{date, week, dayIndex}</c> and the mesocycle is not in it
    /// — the server reads the user's own pointer, which is a point read it
    /// wants anyway to check the week and the day against the block's shape.
    ///
    /// The date is the client's to send and cannot be derived here. This app
    /// runs in UTC, and a 21:00 session in Oslo is already tomorrow in UTC for
    /// half the year; deriving it would file evening workouts under the wrong
    /// day, and the day is the session's identity.
    ///
    /// 200 rather than 201 means the session was already open and is being
    /// resumed, which is the answer to Start tapped twice or to an app coming
    /// back from the background. Both carry the whole session, so a client that
    /// does not care about the difference can ignore it.
    /// </summary>
    [Function("GymWorkoutStart")]
    public Task<IActionResult> Start(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "gym/workouts")] HttpRequest request,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            var (body, rejection) = await GymEndpoint.ReadBodyAsync(request, token);

            if (body is null)
            {
                return rejection!;
            }

            using (body)
            {
                if (!GymRequests.TryReadWorkoutStart(
                        body.RootElement,
                        out var date,
                        out var week,
                        out var dayIndex,
                        out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                var mesoId = await store.ReadCurrentMesoIdAsync(objectId, token);

                if (mesoId is null)
                {
                    return GymEndpoint.Failure(
                        HttpStatusCode.Conflict,
                        "no_current_mesocycle",
                        "There is no block to log this against. Plan one first with "
                        + "POST /api/gym/mesocycles — that call also makes it the current block.");
                }

                var meso = await store.ReadMesocycleAsync(objectId, mesoId, token);

                if (meso is null)
                {
                    return GymEndpoint.Failure(
                        HttpStatusCode.InternalServerError,
                        "dangling_mesocycle",
                        $"The user is current on mesocycle {mesoId}, and there is no such document "
                        + "in db/gym.");
                }

                // The shape check happened in the reader; this is the check
                // against the block the user actually planned, which is the
                // only place that knows how long it is.
                if (week > meso.Weeks)
                {
                    return GymEndpoint.Invalid(
                        $"'week' is {week}, and '{meso.Name}' is {meso.Weeks} weeks long.");
                }

                if (dayIndex >= meso.Days.Count)
                {
                    return GymEndpoint.Invalid(
                        $"'dayIndex' is {dayIndex}, and '{meso.Name}' has {meso.Days.Count} days a week.");
                }

                // The day's plan becomes the session's opening entries, with
                // no sets against them. Seeding here rather than making the
                // client post an entry per planned exercise keeps Start one
                // round trip, and keeps the entry indexes the client logs
                // against consistent with what it was just handed.
                //
                // The targets themselves are not copied onto the session. They
                // live on the block, which the client already holds, so copying
                // them would be a second place for a number to be wrong after
                // the plan is edited.
                var seed = meso.Days[dayIndex].Plan
                    .Select(planned => new SessionEntry(planned.ExerciseName, []))
                    .ToArray();

                var creation = await store.CreateSessionAsync(
                    objectId,
                    date,
                    mesoId,
                    week,
                    dayIndex,
                    seed,
                    token);

                if (creation.Session is not { } session)
                {
                    return GymEndpoint.Failure(
                        HttpStatusCode.Conflict,
                        "date_full",
                        $"There are already as many sessions filed under {date:yyyy-MM-dd} as this API "
                        + "will suffix. A second workout in a day is ordinary and gets its own id; ten "
                        + "is a client that has lost the id it was handed. Read the day back with "
                        + "GET /api/gym/workouts before starting another.");
                }

                logger.LogInformation(
                    "{Verb} session {SessionId} on week {Week} day {DayIndex} of {MesoId}.",
                    creation.Resumed ? "Resumed" : "Started",
                    session.Id,
                    week,
                    dayIndex,
                    mesoId);

                return new ObjectResult(new
                {
                    ok = true,
                    resumed = creation.Resumed,
                    workout = session.ToResponse(),
                })
                {
                    StatusCode = (int)(creation.Resumed ? HttpStatusCode.OK : HttpStatusCode.Created),
                };
            }
        });

    /// <summary>
    /// One workout in full — entries, sets and derived totals.
    ///
    /// The workout detail screen, and the way a client resyncs after a
    /// conflict. It is also how a draft is resumed without going through Start:
    /// the id is <c>session_</c> plus today's date, so a client can build it
    /// and ask for it directly, with no "which block, which cell was I on"
    /// lookup in front of it.
    /// </summary>
    [Function("GymWorkoutRead")]
    public Task<IActionResult> Read(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gym/workouts/{sessionId}")] HttpRequest request,
        string sessionId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsWellFormed(sessionId))
            {
                return GymEndpoint.Invalid(SessionIdHelp(sessionId));
            }

            var session = await store.ReadSessionAsync(objectId, sessionId, token);

            return session is null
                ? NoSuchSession(sessionId)
                : new OkObjectResult(new { ok = true, workout = session.ToResponse() });
        });

    /// <summary>
    /// Every session in a block, newest first — History, and the block map's
    /// per-cell status.
    ///
    /// <c>?mesoId=</c> picks the block; without it the current one is used, so
    /// the common call needs nothing but the route. Sessions come back with
    /// their totals already added up, because volume and average RPE are
    /// derived rather than stored and the entries had to be read to derive
    /// them.
    /// </summary>
    [Function("GymWorkoutList")]
    public Task<IActionResult> List(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gym/workouts")] HttpRequest request,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            var requested = request.Query["mesoId"].FirstOrDefault();

            if (requested is not null && !GymIds.IsWellFormed(requested))
            {
                return GymEndpoint.Invalid($"'{requested}' is not a mesocycle id.");
            }

            var mesoId = requested ?? await store.ReadCurrentMesoIdAsync(objectId, token);

            if (mesoId is null)
            {
                return new OkObjectResult(new
                {
                    ok = true,
                    mesoId = (string?)null,
                    sessions = Array.Empty<object>(),
                });
            }

            var sessions = await store.ListSessionsAsync(objectId, mesoId, token);

            return new OkObjectResult(new
            {
                ok = true,
                mesoId,
                sessions = sessions.Select(session => session.ToResponse()).ToArray(),
            });
        });

    /// <summary>
    /// Finish and submit: one patch setting the status, and nothing else.
    ///
    /// That it is this small is the payoff for keeping the block map a query
    /// rather than a denormalised field on the mesocycle. There is no second
    /// document to keep in step, and a retried submit lands on a value that is
    /// already there rather than counting anything twice.
    /// </summary>
    [Function("GymWorkoutSubmit")]
    public Task<IActionResult> Submit(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "gym/workouts/{sessionId}/submit")] HttpRequest request,
        string sessionId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsWellFormed(sessionId))
            {
                return GymEndpoint.Invalid(SessionIdHelp(sessionId));
            }

            if (!await store.SubmitAsync(objectId, sessionId, token))
            {
                return NoSuchSession(sessionId);
            }

            logger.LogInformation("Submitted session {SessionId}.", sessionId);

            return new OkObjectResult(new { ok = true, id = sessionId, status = GymSession.Submitted });
        });

    /// <summary>
    /// Removes a workout.
    ///
    /// This exists because of a deliberate trade in the data model. Sessions are
    /// keyed on the date rather than on the cell of the block, so a cell can
    /// collect two workouts logged on different days — the rule that re-logging
    /// a day overwrites it was relaxed, on the grounds that silently destroying
    /// a logged workout because the wrong day was tapped is worse than a
    /// duplicate you can see. Seeing it is only half an answer without this.
    /// </summary>
    [Function("GymWorkoutDelete")]
    public Task<IActionResult> Delete(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "gym/workouts/{sessionId}")] HttpRequest request,
        string sessionId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsWellFormed(sessionId))
            {
                return GymEndpoint.Invalid(SessionIdHelp(sessionId));
            }

            if (!await store.DeleteSessionAsync(objectId, sessionId, token))
            {
                return NoSuchSession(sessionId);
            }

            logger.LogInformation("Deleted session {SessionId}.", sessionId);

            return new OkObjectResult(new { ok = true, id = sessionId, deleted = true });
        });

    /// <summary>
    /// The 404 every workout route shares — worth one shape, because the id is
    /// constructible and a client asking for one that is not there is usually a
    /// client that built it slightly wrong.
    /// </summary>
    internal static IActionResult NoSuchSession(string sessionId) => GymEndpoint.Failure(
        HttpStatusCode.NotFound,
        "no_such_workout",
        $"There is no workout {sessionId} in this user's training log. Session ids are "
        + "'session_' and the date it was logged on, so a draft for today can be asked for directly "
        + "— but only after Start has created it.");

    private static string SessionIdHelp(string sessionId) =>
        $"'{sessionId}' is not a workout id. They look like session_2026-09-03, or "
        + "session_2026-09-03_2 for a second workout on the same day.";
}
