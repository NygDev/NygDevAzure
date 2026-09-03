using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// Step two of the bootstrap: WHOOP redirects the browser back here with an
/// authorization code, which is traded for the first token pair and the
/// refresh token written to Key Vault.
/// </summary>
public class WhoopCallback(Lazy<WhoopClient> whoop, ILogger<WhoopCallback> logger)
{
    // Anonymous because it has to be: WHOOP redirects a browser here, and a
    // function key in a registered redirect URL would be sitting in the
    // developer dashboard and in every browser history that passes through.
    // The gate is the state parameter instead — it is an HMAC keyed on the
    // WHOOP client secret, so only something that can read the vault could
    // have minted one, and it expires after ten minutes. A caller without a
    // valid state never reaches the token exchange.
    [Function("WhoopCallback")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "whoop/callback")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        return await WhoopEndpoint.RunAsync(whoop, logger, async client =>
        {
            // WHOOP reports a declined or failed consent by redirecting here with
            // an error instead of a code.
            if (request.Query["error"].FirstOrDefault() is { Length: > 0 } error)
            {
                var description = request.Query["error_description"].FirstOrDefault();

                // WHOOP puts the useful part here — error_description is generic
                // boilerplate, while the hint names the scope actually at fault.
                var upstreamHint = request.Query["error_hint"].FirstOrDefault();

                logger.LogWarning(
                    "WHOOP authorization failed: {Error} {Description} {Hint}",
                    error,
                    description,
                    upstreamHint);

                // The one failure worth explaining rather than relaying. A scope
                // the app registration does not hold sinks the whole request, so
                // it reads as a broken integration rather than a missing checkbox.
                var ourHint = error == "invalid_scope"
                    ? "\n\nThis is the app registration, not the request. WHOOP only lets a "
                        + "client ask for scopes it was registered with, and refuses the entire "
                        + "authorization when one of them is missing rather than dropping it. "
                        + "Enable the named scope on the app in the WHOOP developer dashboard — "
                        + "all of them in one pass, since only the first disallowed scope is "
                        + "reported. Failing that, drop it from var.whoop_scopes in terraform."
                    : string.Empty;

                return WhoopEndpoint.Text(
                    HttpStatusCode.BadRequest,
                    $"WHOOP authorization failed: {error}. {description} {upstreamHint}{ourHint}");
            }

            var state = request.Query["state"].FirstOrDefault();
            if (!await client.ValidateStateAsync(state, cancellationToken))
            {
                logger.LogWarning("Rejected a WHOOP callback with a missing, forged or expired state.");
                return WhoopEndpoint.Text(
                    HttpStatusCode.BadRequest,
                    "Invalid or expired state. Start again at /api/whoop/authorize.");
            }

            if (request.Query["code"].FirstOrDefault() is not { Length: > 0 } code)
            {
                return WhoopEndpoint.Text(HttpStatusCode.BadRequest, "No authorization code on the callback.");
            }

            try
            {
                var result = await client.CompleteAuthorizationAsync(code, cancellationToken);

                if (!result.RefreshTokenStored)
                {
                    // Without a refresh token there is nothing to renew with, and
                    // the access token just issued dies in an hour. Say so rather
                    // than reporting a success that quietly expires.
                    logger.LogError("WHOOP returned no refresh token; was the offline scope granted?");
                    return WhoopEndpoint.Text(
                        HttpStatusCode.BadGateway,
                        "WHOOP returned no refresh token. The 'offline' scope has to be granted — "
                        + "check the scopes on the app in the WHOOP developer dashboard and try again.");
                }

                logger.LogInformation(
                    "WHOOP authorization complete; refresh token stored in '{SecretName}'.",
                    WhoopSecretStore.RefreshTokenName);

                return WhoopEndpoint.Text(
                    HttpStatusCode.OK,
                    $"""
                    WHOOP authorization complete.

                    Refresh token stored in Key Vault secret '{WhoopSecretStore.RefreshTokenName}'.
                    Scopes granted: {string.Join(' ', result.Scopes)}
                    Access token valid until: {result.ExpiresAt:u}

                    Confirm with GET /api/whoop/status.
                    """);
            }
            catch (WhoopAuthException ex)
            {
                logger.LogError(ex, "Exchanging the WHOOP authorization code failed.");
                return WhoopEndpoint.Text(
                    HttpStatusCode.BadGateway,
                    $"Exchanging the authorization code failed: {ex.Message} {ex.ResponseBody}");
            }
        });
    }
}
