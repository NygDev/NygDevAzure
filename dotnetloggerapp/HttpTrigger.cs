using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;

namespace NygDev.logtest;

public class HttpTrigger
{
    // Delegated scope the calling client must have on the user's behalf.
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
        // Auth is enforced by JwtAuthMiddleware before we get here.
        // HttpContext.User is a validated ClaimsPrincipal.

        // Throws 403 if the token's scp claim doesn't include the required scope.
        req.HttpContext.VerifyUserHasAnyAcceptedScope(RequiredScope);

        var user = req.HttpContext.User;

        // Cosmos partition: the user's object id. GetObjectId() checks both the
        // short ("oid") and long URI claim names, so it works regardless of
        // claim-mapping state.
        var partition = user.GetObjectId()
            ?? throw new InvalidOperationException("Token has no 'oid' claim.");

        // Document id: the unique token identifier issued by Entra.
        var tokenId = user.FindFirst("uti")?.Value
            ?? user.FindFirst("jti")?.Value
            ?? Guid.NewGuid().ToString();

        _logger.LogInformation(
            "Authenticated {User} ({Oid}); writing token id {Id}.",
            user.Identity?.Name, partition, tokenId);

        var document = new
        {
            id = tokenId,
            partition,
            receivedAt = DateTimeOffset.UtcNow,
            subject = user.GetNameIdentifierId(),
            preferredName = user.FindFirst("preferred_username")?.Value,
            tenantId = user.GetTenantId(),
            issuer = user.FindFirst("iss")?.Value,
            audience = user.FindAll("aud").Select(c => c.Value).ToArray(),
            roles = user.FindAll("roles").Select(c => c.Value).ToArray(),
            scopes = user.FindFirst("scp")?.Value?.Split(' ',
                StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
            claims = user.Claims
                .GroupBy(c => c.Type)
                .ToDictionary(g => g.Key, g => g.Select(c => c.Value).ToArray())
        };

        var container = _cosmosClient.GetContainer("db", "primary");
        await container.UpsertItemAsync(document, new PartitionKey(partition));

        return new OkObjectResult(new { id = tokenId, partition });
    }
}
