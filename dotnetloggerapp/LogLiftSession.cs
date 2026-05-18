using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;
using Newtonsoft.Json.Linq;

namespace NygDev.logtest;

public class LogLiftSession
{
    private const string RequiredScope = "user_impersonation";

    private readonly ILogger<LogLiftSession> _logger;
    private readonly CosmosClient _cosmosClient;

    public LogLiftSession(ILogger<LogLiftSession> logger, CosmosClient cosmosClient)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
    }

    [Function("LogLiftSession")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "LogLiftSession")] HttpRequest req)
    {
        req.HttpContext.VerifyUserHasAnyAcceptedScope(RequiredScope);

        var user = req.HttpContext.User;
        var partition = user.GetObjectId()
            ?? throw new InvalidOperationException("Token has no 'oid' claim.");

        JObject doc;
        try
        {
            using var reader = new StreamReader(req.Body);
            doc = JObject.Parse(await reader.ReadToEndAsync());
        }
        catch (Newtonsoft.Json.JsonException)
        {
            return new BadRequestObjectResult(new { error = "Request body must be valid JSON." });
        }

        var id = $"lift_{Guid.CreateVersion7()}";
        doc["id"] = id;
        doc["type"] = "lift";
        doc["partition"] = partition;
        doc["receivedAt"] = DateTimeOffset.UtcNow;

        _logger.LogInformation("Writing lift session {Id} for {Oid}.", id, partition);

        var container = _cosmosClient.GetContainer("db", "primary");
        await container.UpsertItemAsync(doc, new PartitionKey(partition));

        return new OkObjectResult(new { id, partition });
    }
}
