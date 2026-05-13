using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;

namespace NygDev.logtest;

[Authorize]                         // require a valid Entra token
// [Authorize(Roles = "gym.log")]   // ...and the app role, if you want that gate
public class HttpTrigger
{
    private const string RequiredScope = "user_impersonation";

    private readonly ILogger<HttpTrigger> _logger;
    private readonly CosmosClient _cosmosClient;

    public HttpTrigger(ILogger<HttpTrigger> logger, CosmosClient cosmosClient)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
    }

    [Function("HttpTrigger")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
    {
        // Throws 403 if the token's scp claim doesn't include the required scope.
        req.HttpContext.VerifyUserHasAnyAcceptedScope(RequiredScope);

        var user = req.HttpContext.User;
        var partition = user.FindFirst("oid")?.Value ?? "unknown";
        var tokenId   = user.FindFirst("uti")?.Value
                     ?? user.FindFirst("jti")?.Value
                     ?? Guid.NewGuid().ToString();

        _logger.LogInformation(
            "Authenticated {User} ({Oid}). Storing token id {Id}.",
            user.Identity?.Name, partition, tokenId);

        var document = new
        {
            id           = tokenId,
            partition,
            receivedAt   = DateTimeOffset.UtcNow,
            subject      = user.FindFirst("sub")?.Value,
            preferredName = user.FindFirst("preferred_username")?.Value,
            roles        = user.FindAll("roles").Select(c => c.Value).ToArray(),
            scopes       = user.FindFirst("scp")?.Value?.Split(' '),
            // claims are now trustworthy because the middleware validated the signature
            claims       = user.Claims.ToDictionary(c => c.Type, c => c.Value)
        };

        var container = _cosmosClient.GetContainer("db", "primary");
        await container.UpsertItemAsync(document, new PartitionKey(partition));

        return new OkObjectResult(new { id = tokenId, partition });
    }
}
