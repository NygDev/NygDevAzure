using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.Resource;
using Newtonsoft.Json;

namespace NygDev.logtest;

public class GetExercises
{
    private const string RequiredScope = "user_impersonation";
    private const string DocumentId = "lifts_exercises";

    private static readonly string[] DefaultExercises =
    [
        "Bench Press", "Row", "Curl", "Pulldown",
        "Overhead Press", "Squat", "Leg Extension", "Leg Curl"
    ];

    private readonly ILogger<GetExercises> _logger;
    private readonly CosmosClient _cosmosClient;

    public GetExercises(ILogger<GetExercises> logger, CosmosClient cosmosClient)
    {
        _logger = logger;
        _cosmosClient = cosmosClient;
    }

    [Function("GetExercises")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetExercises")] HttpRequest req)
    {
        req.HttpContext.VerifyUserHasAnyAcceptedScope(RequiredScope);

        var partition = req.HttpContext.User.GetObjectId()
            ?? throw new InvalidOperationException("Token has no 'oid' claim.");

        var container = _cosmosClient.GetContainer("db", "primary");

        try
        {
            var response = await container.ReadItemAsync<ExerciseList>(
                DocumentId, new PartitionKey(partition));
            return new OkObjectResult(response.Resource);
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            _logger.LogInformation("Seeding default exercises for {Oid}.", partition);
            var doc = new ExerciseList(DocumentId, partition, DefaultExercises);
            await container.UpsertItemAsync(doc, new PartitionKey(partition));
            return new OkObjectResult(doc);
        }
    }
}

public record ExerciseList(
    [property: JsonProperty("id")]        string   Id,
    [property: JsonProperty("partition")] string   Partition,
    [property: JsonProperty("exercises")] string[] Exercises);
