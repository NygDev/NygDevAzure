using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Gym;

/// <summary>
/// The training block: what it is, creating one, and editing it.
///
/// Every function here is at <see cref="AuthorizationLevel.Anonymous"/>, which
/// is not the same as unprotected. A browser cannot keep a function key secret
/// — it would be in the bundle, readable by anyone who opened the page — so the
/// gate is Easy Auth in front of the app and the principal check inside
/// <see cref="GymEndpoint.RunAsync"/>, which refuses anything without a
/// validated user before a line of these bodies runs.
/// </summary>
public class GymMesocycles(GymStore store, ILogger<GymMesocycles> logger)
{
    /// <summary>
    /// Everything Today and the block map need, in one call: the current block
    /// and every session logged against it.
    ///
    /// Three reads — the pointer document, the mesocycle it names, and one
    /// single-partition query over the block's sessions. It is called on every
    /// app open and every tab switch, which is why the first of those is a
    /// point read on an id built from the principal rather than a query.
    ///
    /// A null mesocycle is a first run rather than an error: nobody has planned
    /// a block yet, and the Plan tab is where they do. Answering 404 for it
    /// would make the app's opening screen an error path.
    /// </summary>
    [Function("GymMesocyclesCurrent")]
    public Task<IActionResult> Current(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "gym/mesocycles/current")] HttpRequest request,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            var mesoId = await store.ReadCurrentMesoIdAsync(objectId, token);

            if (mesoId is null)
            {
                return new OkObjectResult(new { ok = true, mesocycle = (object?)null, sessions = Array.Empty<object>() });
            }

            var meso = await store.ReadMesocycleAsync(objectId, mesoId, token);

            if (meso is null)
            {
                // The pointer names a block that is not there. The two are
                // written in one transaction, so this is not a half-finished
                // create — it is a mesocycle deleted out from under the
                // pointer, which nothing in this API does. Worth an error
                // rather than a quiet empty answer.
                logger.LogError(
                    "The current mesocycle {MesoId} is missing for a user whose pointer names it.",
                    mesoId);

                return GymEndpoint.Failure(
                    HttpStatusCode.InternalServerError,
                    "dangling_mesocycle",
                    $"The user is current on mesocycle {mesoId}, and there is no such document in "
                    + "db/gym. The pointer and the block are written in one transaction, so this means "
                    + "the mesocycle was removed by something other than this API.");
            }

            var sessions = await store.ListSessionsAsync(objectId, mesoId, token);

            return new OkObjectResult(new
            {
                ok = true,
                mesocycle = meso.ToResponse(),
                sessions = sessions.Select(session => session.ToResponse()).ToArray(),
            });
        });

    /// <summary>
    /// Plans a block and makes it the current one.
    ///
    /// Creating is also switching: the user document's pointer is written in
    /// the same transaction, because a block nothing is current on is a block
    /// no screen can reach. There is no separate "activate" call for the same
    /// reason there is no <c>status</c> field on the mesocycle — one fact, one
    /// place.
    /// </summary>
    [Function("GymMesocyclesCreate")]
    public Task<IActionResult> Create(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "gym/mesocycles")] HttpRequest request,
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
                if (!GymRequests.TryReadMesocycle(body.RootElement, out var name, out var weeks, out var days, out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                var meso = await store.CreateMesocycleAsync(objectId, name, weeks, days, token);

                logger.LogInformation(
                    "Planned a {Weeks} week block of {Days} days and made it current.",
                    weeks,
                    days.Count);

                return new ObjectResult(new { ok = true, mesocycle = meso.ToResponse() })
                {
                    StatusCode = (int)HttpStatusCode.Created,
                };
            }
        });

    /// <summary>
    /// Edits the plan: the name, the number of weeks, the day labels, or any
    /// combination.
    ///
    /// Nothing here touches a workout. Sessions are keyed on the date they were
    /// logged rather than on their position in the block, so shortening a block
    /// hides cells and never orphans a document — the design's rule, and free
    /// rather than enforced.
    /// </summary>
    [Function("GymMesocyclesPatch")]
    public Task<IActionResult> Patch(
        [HttpTrigger(AuthorizationLevel.Anonymous, "patch", Route = "gym/mesocycles/{mesoId}")] HttpRequest request,
        string mesoId,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, async (objectId, token) =>
        {
            if (!GymIds.IsWellFormed(mesoId))
            {
                return GymEndpoint.Invalid(
                    $"'{mesoId}' is not a mesocycle id. They are the ids this API hands back from "
                    + "POST /api/gym/mesocycles, not names.");
            }

            var (body, rejection) = await GymEndpoint.ReadBodyAsync(request, token);

            if (body is null)
            {
                return rejection!;
            }

            using (body)
            {
                if (!GymRequests.TryReadMesocyclePatch(
                        body.RootElement,
                        out var name,
                        out var weeks,
                        out var days,
                        out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                if (!await store.PatchMesocycleAsync(objectId, mesoId, name, weeks, days, token))
                {
                    return GymEndpoint.Failure(
                        HttpStatusCode.NotFound,
                        "no_such_mesocycle",
                        $"There is no mesocycle {mesoId} in this user's training log.");
                }

                var updated = await store.ReadMesocycleAsync(objectId, mesoId, token);

                return updated is null
                    ? GymEndpoint.Failure(
                        HttpStatusCode.NotFound,
                        "no_such_mesocycle",
                        $"Mesocycle {mesoId} was edited and then could not be read back.")
                    : new OkObjectResult(new { ok = true, mesocycle = updated.ToResponse() });
            }
        });
}
