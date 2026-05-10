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
        var partition = req.Headers["X-MS-CLIENT-PRINCIPAL-ID"].FirstOrDefault()
            ?? "anonymous";

        var body = await System.Text.Json.JsonSerializer.DeserializeAsync<IdPayload>(req.Body);
        if (string.IsNullOrEmpty(body?.Id))
            return new BadRequestObjectResult("Request body must contain {\"id\": \"<value>\"}");

        _logger.LogInformation("Writing {Id} for principal {Partition}", body.Id, partition);

        var container = _cosmosClient.GetContainer("db", "primary");

        var document = new { id = body.Id, partition };
        await container.UpsertItemAsync(document, new PartitionKey(partition));

        return new OkObjectResult($"Written {body.Id}");
    }

    private record IdPayload([property: System.Text.Json.Serialization.JsonPropertyName("id")] string Id);
}
