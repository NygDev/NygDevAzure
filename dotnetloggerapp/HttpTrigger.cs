using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json.Linq;

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
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
    {
        // Token comes from the caller, e.g.
        //   Authorization: Bearer eyJ0eXAi...
        var authHeader = req.Headers[HeaderNames.Authorization].ToString();
        if (string.IsNullOrWhiteSpace(authHeader) ||
            !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return new BadRequestObjectResult("Missing 'Authorization: Bearer <token>' header.");
        }

        var rawToken = authHeader["Bearer ".Length..].Trim();

        // Decode the JWT (no signature validation - example only).
        JObject? header = null;
        JObject? claims = null;
        var parts = rawToken.Split('.');
        if (parts.Length >= 2)
        {
            header = JObject.Parse(Encoding.UTF8.GetString(Base64UrlDecode(parts[0])));
            claims = JObject.Parse(Encoding.UTF8.GetString(Base64UrlDecode(parts[1])));
        }
        else
        {
            return new BadRequestObjectResult("Authorization header does not contain a JWT.");
        }

        // Partition by the user's object id (oid claim) when present.
        var partition = claims?["oid"]?.ToString()
            ?? "unknown";

        // Use the token's unique identifier as the document id when available.
        //   uti = Entra-issued unique token id (one per issuance)
        //   jti = standard JWT id
        var id = claims?["uti"]?.ToString()
            ?? claims?["jti"]?.ToString()
            ?? Guid.NewGuid().ToString();

        _logger.LogInformation(
            "Storing token id {Id} for partition {Partition}, issuer {Issuer}",
            id, partition, claims?["iss"]);

        var document = new
        {
            id,
            partition,
            receivedAt = DateTimeOffset.UtcNow,
            accessToken = rawToken,
            header,
            claims
        };

        var container = _cosmosClient.GetContainer("db", "primary");
        await container.UpsertItemAsync(document, new PartitionKey(partition));

        return new OkObjectResult(new { id = document.id, partition });
    }

    private static byte[] Base64UrlDecode(string input)
    {
        var padding = (4 - input.Length % 4) % 4;
        var base64 = input.Replace('-', '+').Replace('_', '/')
            + new string('=', padding);
        return Convert.FromBase64String(base64);
    }
}
