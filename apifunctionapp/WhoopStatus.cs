using System.Net;
using ApiFunctionApp.Whoop;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// The confirmation endpoint: proves the whole chain works end to end —
/// managed identity reaches Key Vault, the stored refresh token is still good,
/// WHOOP issues an access token, and that token opens the data API.
///
/// Nothing here consumes WHOOP data beyond the profile; that is deliberate.
/// This is the piece to call after a deploy or a bootstrap to see whether the
/// integration is alive before anything is built on top of it.
/// </summary>
public class WhoopStatus(Lazy<WhoopClient> whoop, ILogger<WhoopStatus> logger)
{
    // Function level: the response carries the account's name and email, and
    // this is a diagnostic, not something the public site calls.
    [Function("WhoopStatus")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "whoop/status")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        return await WhoopEndpoint.RunAsync(whoop, logger, async client =>
        {
            // ?refresh=true spends the stored refresh token on purpose, to prove
            // rotation and the write-back to Key Vault work. Off by default: the
            // cached access token is good for an hour, and rotating on every call
            // would mean a vault write per request for no added confidence.
            var forceRefresh = request.Query["refresh"].FirstOrDefault() is "true" or "1";

            try
            {
                if (forceRefresh)
                {
                    await client.RefreshAsync(cancellationToken);
                }

                var profile = await client.GetProfileAsync(cancellationToken);

                logger.LogInformation("WHOOP status check succeeded for user {UserId}.", profile.UserId);

                return new OkObjectResult(new
                {
                    ok = true,
                    refreshed = forceRefresh,
                    scopes = client.GrantedScopes,
                    profile,
                });
            }
            catch (WhoopAuthException ex) when (ex.NeedsReauthorization)
            {
                // WHOOP rejected the credentials rather than failing to answer:
                // the stored refresh token is spent, revoked, or still the
                // placeholder value. No amount of retrying fixes that.
                logger.LogError(ex, "The stored WHOOP refresh token was rejected.");

                return new ObjectResult(new
                {
                    ok = false,
                    error = "whoop_reauthorization_required",
                    message = "WHOOP rejected the stored refresh token. Open /api/whoop/authorize "
                        + $"in a browser to re-authorize; it rewrites '{WhoopSecretStore.RefreshTokenName}'.",
                    detail = ex.ResponseBody,
                })
                {
                    StatusCode = (int)HttpStatusCode.Conflict,
                };
            }
            catch (WhoopAuthException ex)
            {
                logger.LogError(ex, "The WHOOP status check failed upstream.");

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
        });
    }
}
