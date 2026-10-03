using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Gym;

/// <summary>
/// Favourite exercises: the ones a user starred, for the top of the picker.
///
/// There is one route and it writes. The lists are read where the pickers
/// already read — <c>GET /gym/mesocycles/current</c> for the logger and
/// <c>GET /gym/mesocycles</c> for the planner both carry <c>favorites</c> and
/// <c>recent</c> — so neither app spends a call to learn them. The recently
/// used half has no route at all: Submit writes it, from what the workout
/// lifted.
///
/// A favourite is a name, built-in or the user's own, as every reference to an
/// exercise is. See <see cref="ExercisePreferences"/>.
/// </summary>
public class GymFavorites(GymStore store, ILogger<GymFavorites> logger)
{
    /// <summary>
    /// Replaces the starred list. The body is the whole list, in the order to
    /// keep it; the answer echoes it back as stored.
    /// </summary>
    [Function("GymFavoritesReplace")]
    public Task<IActionResult> Replace(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "gym/favorites")] HttpRequest request,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, (objectId, token) =>
            GymEndpoint.WithBodyAsync(request, token, async body =>
            {
                if (!GymRequests.TryReadFavorites(body, out var favorites, out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                await store.SetFavoritesAsync(objectId, favorites, token);

                return new OkObjectResult(new { ok = true, favorites });
            }));
}
