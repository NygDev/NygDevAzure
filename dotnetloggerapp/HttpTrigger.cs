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
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
    {
        const string id = "test";
        const string partition = "405c6fb5-46c6-42f9-a9f6-a04e7da13840";

        _logger.LogInformation("Writing {Id} to CosmosDB", id);

        var container = _cosmosClient.GetContainer("db", "primary");

        var document = new { id, partition };
        await container.UpsertItemAsync(document, new PartitionKey(partition));

        return new OkObjectResult($"Written {id}");
    }
}
