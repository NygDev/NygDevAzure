using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Gym;

/// <summary>
/// Custom exercises: the user's own additions to the exercise library.
///
/// The shipped library is a CDN blob — <c>gym-exercises.json</c> — for the
/// reason that file gives: it is identical for every user and changes when the
/// code ships. An exercise somebody describes for themselves is neither, so it
/// is stored here, per account, beside the saved day templates, and the front
/// ends merge the two lists into the one library they read.
///
/// <b>Nothing here changes what has been logged or planned.</b> Plans and
/// sessions store an exercise by name and always have, and a custom name typed
/// into a picker is still a complete answer without any of this. What a record
/// adds is what the name could not carry: its equipment, the muscle group it
/// counts toward in gymbro's tally, what it trains for the swap sheet's
/// suggestions, and the family it belongs to. Describing a name that is already
/// in a hundred sessions describes all hundred of them at once, because they
/// all hold the name.
///
/// That is also why the name is the identity and cannot change — see
/// <see cref="CustomExercise"/> and <see cref="GymIds.Exercise"/>.
/// </summary>
public class GymExercises(GymStore store, ILogger<GymExercises> logger)
{
    /// <summary>
    /// Every exercise this user has described, sorted by name. An empty list is
    /// the ordinary state: the shipped library is there regardless.
    /// </summary>
    [Function("GymExercisesList")]
    public Task<IActionResult> List(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gym/exercises")] HttpRequest request,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            var exercises = await store.ListExercisesAsync(objectId, token);

            return new OkObjectResult(new
            {
                ok = true,
                exercises = exercises.Select(exercise => exercise.ToResponse()).ToArray(),
            });
        });

    /// <summary>
    /// Describes an exercise under a name nobody on this account has used for
    /// one yet.
    ///
    /// A name already described answers 409 <c>exercise_exists</c> — which is
    /// also what a create retried after a lost response gets, so a client that
    /// sees it should read the list rather than report a failure. Whether the
    /// name collides with the <em>shipped</em> library is the client's to
    /// check: this API has never read that file.
    /// </summary>
    [Function("GymExercisesCreate")]
    public Task<IActionResult> Create(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "gym/exercises")] HttpRequest request,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, (objectId, token) =>
            GymEndpoint.WithBodyAsync(request, token, async body =>
            {
                if (!GymRequests.TryReadExercise(body, out var exercise, out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                return await store.CreateExerciseAsync(objectId, exercise, token) switch
                {
                    ExerciseCreation.Exists => GymEndpoint.Failure(
                        HttpStatusCode.Conflict,
                        "exercise_exists",
                        $"There is already a custom exercise called '{exercise.Name}' — names are "
                        + "compared ignoring case and spacing, because plans and sessions store the "
                        + "exercise by name. Edit that one instead. After a lost response, this is "
                        + "the retry finding the first create finished."),

                    ExerciseCreation.Limit => GymEndpoint.Failure(
                        HttpStatusCode.Conflict,
                        "exercise_limit",
                        $"This account already has {GymLimits.MaxExercisesPerUser} custom exercises, "
                        + "which is the cap. Delete one to describe another — the cap is a guard "
                        + "against a client creating in a loop."),

                    _ => new ObjectResult(new { ok = true, exercise = exercise.ToResponse() })
                    {
                        StatusCode = (int)HttpStatusCode.Created,
                    },
                };
            }));

    /// <summary>
    /// Re-describes an exercise: its equipment, group, muscles and family.
    ///
    /// The body is the whole record, name included, and the name has to be the
    /// one this id was made from. It cannot be changed because sessions hold it
    /// — see <see cref="CustomExercise"/> — and refusing a body that tries is
    /// better than quietly keeping the old name while the client shows the new
    /// one.
    /// </summary>
    [Function("GymExercisesReplace")]
    public Task<IActionResult> Replace(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "gym/exercises/{exerciseId}")] HttpRequest request,
        string exerciseId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsExerciseId(exerciseId))
            {
                return GymEndpoint.Invalid(NotAnExerciseId(exerciseId));
            }

            return await GymEndpoint.WithBodyAsync(request, token, async body =>
            {
                if (!GymRequests.TryReadExercise(body, out var exercise, out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                if (!string.Equals(exercise.Id, exerciseId, StringComparison.Ordinal))
                {
                    return GymEndpoint.Invalid(
                        $"'name' is '{exercise.Name}', which is not the exercise {exerciseId} was "
                        + "created as. A custom exercise's name cannot change: every plan and session "
                        + "that used it holds the name, and they would be left describing nothing. "
                        + "Create the new name as an exercise of its own.");
                }

                var replaced = await store.ReplaceExerciseAsync(objectId, exercise, token);

                return replaced
                    ? new OkObjectResult(new { ok = true, exercise = exercise.ToResponse() })
                    : NoSuchExercise(exerciseId);
            });
        });

    /// <summary>
    /// Removes a description. Nothing cascades and nothing needs confirming the
    /// way a block delete does: the name stays in every plan and session that
    /// used it, and reads as an undescribed custom name again.
    /// </summary>
    [Function("GymExercisesDelete")]
    public Task<IActionResult> Delete(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "gym/exercises/{exerciseId}")] HttpRequest request,
        string exerciseId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsExerciseId(exerciseId))
            {
                return GymEndpoint.Invalid(NotAnExerciseId(exerciseId));
            }

            var deleted = await store.DeleteExerciseAsync(objectId, exerciseId, token);

            return deleted
                ? new OkObjectResult(new { ok = true, id = exerciseId, deleted = true })
                : NoSuchExercise(exerciseId);
        });

    private static string NotAnExerciseId(string exerciseId) =>
        $"'{exerciseId}' is not a custom exercise id. They look like exercise_3f9a… and are the ids "
        + "this API hands back from POST /api/gym/exercises and GET /api/gym/exercises, not names.";

    private static IActionResult NoSuchExercise(string exerciseId) =>
        GymEndpoint.Failure(
            HttpStatusCode.NotFound,
            "no_such_exercise",
            $"There is no custom exercise {exerciseId} on this account. After a lost response on a "
            + "delete, this is the retry finding the first one finished.");
}
