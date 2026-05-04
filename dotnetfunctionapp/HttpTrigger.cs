using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace NygDev.Logger;

public class HttpTrigger(ILogger<HttpTrigger> logger)
{
    [Function(nameof(HttpTrigger))]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
    {
        logger.LogInformation("HTTP trigger processed a request.");
        return new OkObjectResult("OK");
    }
}
