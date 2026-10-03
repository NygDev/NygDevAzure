using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Gym;

/// <summary>
/// The lifter's profile: experience, bodyweight, goal, injuries — what a coach
/// reading the log should know about the person that no session records.
///
/// One route, and it writes. The profile is read where the planner already
/// reads — <c>GET /gym/mesocycles</c> carries <c>profile</c> beside the
/// favourites — so filling in the coaching export's closing section costs no
/// call. The logger does not read it: nothing on the phone shows it.
///
/// See <see cref="LifterProfile"/> for the fields and why they are optional.
/// </summary>
public class GymProfile(GymStore store, ILogger<GymProfile> logger)
{
    /// <summary>
    /// Replaces the profile. The body is all four fields, any of them absent;
    /// the answer echoes the profile as stored, unknown fields left off.
    /// </summary>
    [Function("GymProfileReplace")]
    public Task<IActionResult> Replace(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "gym/profile")] HttpRequest request,
        CancellationToken cancellationToken) =>
        GymEndpoint.RunAsync(request, logger, cancellationToken, (objectId, token) =>
            GymEndpoint.WithBodyAsync(request, token, async body =>
            {
                if (!GymRequests.TryReadProfile(body, out var profile, out var error))
                {
                    return GymEndpoint.Invalid(error);
                }

                await store.SetProfileAsync(objectId, profile, token);

                return new OkObjectResult(new { ok = true, profile = profile.ToResponse() });
            }));
}
