using System.Net;
using ApiFunctionApp.Whoop;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// Pulls the single latest WHOOP workout and writes it to Cosmos.
///
/// WhoopSync supersedes this for keeping the container current — it covers
/// every collection and tracks where it has got to. This one stays because it
/// is the cheapest possible proof that the whole chain works: one WHOOP call,
/// one document, no cursor to reason about.
/// </summary>
public class WhoopWorkoutSync(WhoopStore store, Lazy<WhoopClient> whoop, ILogger<WhoopWorkoutSync> logger)
{
    // Function level, and GET as well as POST. The endpoint writes, which
    // normally rules GET out, but the write is an idempotent upsert of one
    // deterministic document and the function key keeps it off the open web —
    // so a browser is allowed to be the way this gets triggered by hand.
    [Function("WhoopWorkoutSync")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "whoop/workout/latest")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        return await WhoopEndpoint.RunAsync(whoop, logger, async client =>
        {
            var collection = WhoopCollection.Workout;

            try
            {
                var latest = await client.GetLatestWorkoutAsync(cancellationToken);

                if (latest is not { } workout)
                {
                    logger.LogInformation("WHOOP returned no workouts; nothing to write.");

                    return new NotFoundObjectResult(new
                    {
                        ok = false,
                        error = "no_workouts",
                        message = "WHOOP returned no workouts for this account.",
                    });
                }

                // Without an id there is no document to write: Cosmos requires
                // one, and inventing a surrogate would break the whole point of
                // reusing WHOOP's, which is that re-running updates the workout
                // instead of duplicating it.
                if (collection.ReadId(workout) is not { Length: > 0 } workoutId)
                {
                    logger.LogError(
                        "The WHOOP workout record carried no usable id: {Record}", workout.GetRawText());

                    return new ObjectResult(new
                    {
                        ok = false,
                        error = "whoop_unexpected_shape",
                        message = $"The WHOOP workout record carried no usable '{collection.IdProperty}'.",
                    })
                    {
                        StatusCode = (int)HttpStatusCode.BadGateway,
                    };
                }

                var status = await store.UpsertRecordAsync(
                    collection, workoutId, workout, cancellationToken);

                logger.LogInformation("Wrote WHOOP workout {WorkoutId}.", workoutId);

                return new OkObjectResult(new
                {
                    ok = true,
                    id = workoutId,
                    partition = collection.Type,
                    type = collection.Type,

                    // 201 means this workout had not been stored before; 200
                    // means an existing document was replaced.
                    created = status == HttpStatusCode.Created,
                });
            }
            catch (WhoopAuthException ex) when (ex.NeedsReauthorization)
            {
                // WHOOP rejected the credentials rather than failing to answer:
                // the stored refresh token is spent, revoked, or still the
                // placeholder value. No amount of retrying fixes that.
                //
                // A 403 while /api/whoop/status still works means something
                // narrower: the token is good but the grant predates
                // read:workout joining WhoopOptions.DefaultScopes. Same fix, so
                // the granted scopes come back to tell the two apart.
                logger.LogError(ex, "WHOOP rejected the stored credentials for the workout endpoint.");

                return new ObjectResult(new
                {
                    ok = false,
                    error = "whoop_reauthorization_required",
                    message = "WHOOP rejected the stored credentials. Open /api/whoop/authorize "
                        + $"in a browser to re-authorize; it rewrites '{WhoopSecretStore.RefreshTokenName}'.",
                    status = (int)ex.StatusCode,
                    grantedScopes = client.GrantedScopes,
                    detail = ex.ResponseBody,
                })
                {
                    StatusCode = (int)HttpStatusCode.Conflict,
                };
            }
            catch (WhoopAuthException ex)
            {
                logger.LogError(ex, "Fetching the latest WHOOP workout failed upstream.");

                return new ObjectResult(new
                {
                    ok = false,
                    error = "whoop_upstream_error",
                    message = ex.Message,
                    detail = ex.ResponseBody,
                })
                {
                    StatusCode = (int)HttpStatusCode.BadGateway,
                };
            }
            catch (CosmosException ex)
            {
                logger.LogError(ex, "Cosmos rejected the workout upsert.");

                return new ObjectResult(new
                {
                    ok = false,
                    error = "cosmos_write_failed",
                    message = ex.Message,
                })
                {
                    StatusCode = (int)ex.StatusCode,
                };
            }
        });
    }
}
