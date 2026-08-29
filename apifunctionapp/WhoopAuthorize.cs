using ApiFunctionApp.Whoop;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// Step one of the one-time WHOOP bootstrap: send a browser to WHOOP's consent
/// screen.
///
/// The refresh grant can keep a token pair alive indefinitely but cannot
/// create one, so a human has to approve the app once. After that this
/// endpoint is only needed again if the refresh token is revoked or lost.
/// </summary>
public class WhoopAuthorize(WhoopClient whoop, ILogger<WhoopAuthorize> logger)
{
    // Function, not Anonymous: this starts an OAuth flow that ends in a write
    // to the vault, and it is opened by hand a couple of times a year — a
    // function key in the URL is the right amount of gate for that. Contrast
    // SpotRead, where a key would only sit in public JavaScript.
    [Function("WhoopAuthorize")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "whoop/authorize")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        var url = await whoop.BuildAuthorizationUrlAsync(cancellationToken);

        logger.LogInformation("Redirecting to the WHOOP consent screen.");

        // Not permanent: the state in the URL is single-use and time-bounded,
        // so a cached redirect would send the next visitor somewhere expired.
        return new RedirectResult(url, permanent: false);
    }
}
