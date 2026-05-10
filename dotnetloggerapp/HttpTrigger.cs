using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace NygDev.logtest;

public class HttpTrigger
{
    private readonly ILogger<HttpTrigger> _logger;
    private readonly CosmosClient _cosmosClient;

    public HttpTrigger(ILogger<HttpTrigger> logger, CosmosClient cosmosClient)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
    }

    [Function("HttpTrigger")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
    {
        var objectId = req.Headers["X-MS-CLIENT-PRINCIPAL-ID"].FirstOrDefault();
        if (string.IsNullOrEmpty(objectId))
        {
            _logger.LogWarning("Request received with no authenticated principal.");
            return new UnauthorizedResult();
        }

        _logger.LogInformation("Writing TestInvoke for user {ObjectId}", objectId);

        var container = _cosmosClient.GetContainer("db", "primary");

        var document = new { id = "TestInvoke", partition = objectId };
        await container.UpsertItemAsync(document, new PartitionKey(objectId));

        return new OkObjectResult($"Written TestInvoke for {objectId}");
    }
}
