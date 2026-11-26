using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;

namespace ApiFunctionApp;

/// <summary>
/// The gym front end's wake-up call: the one route on this app that answers
/// without a token, and the only one Easy Auth lets through unauthenticated
/// (<c>excluded_paths</c> in terraform/consumption.tf).
///
/// The app runs on Flex Consumption and scales to zero, so the front end pings
/// this as soon as the page loads, while MSAL is still producing a token.
/// Before this route existed, that ping went to <c>/gym/mesocycles/current</c>
/// with no token and Easy Auth answered 401. That still woke the instance, but
/// it left one failed request in Application Insights for every app open.
/// Answering 204 here keeps the Failures blade for real failures.
///
/// It reads nothing, touches no Cosmos and knows nothing about the caller, so
/// exempting it from the gate opens no data. Keep it that way: anything that
/// needs to know who is calling belongs behind <c>GymEndpoint.RunAsync</c>, not
/// here. Being anonymous is also why this route is a fixed path and not a
/// prefix, so a new endpoint cannot end up exempt by accident.
/// </summary>
public class Health
{
    [Function("Health")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "health")] HttpRequest request)
    {
        // A cached answer would wake nothing.
        request.HttpContext.Response.Headers.CacheControl = "no-store";

        return new NoContentResult();
    }
}
