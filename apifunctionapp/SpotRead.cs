using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// HTTP-callable point read ("spot read") of a single Cosmos document.
///
/// A point read — id plus partition key — is the cheapest way to fetch a
/// document (1 RU for a small one) and the only read that works against the
/// primary container, which is provisioned with indexing_mode = "none" and so
/// cannot serve a filtered query.
/// </summary>
public class SpotRead(CosmosClient cosmosClient, ILogger<SpotRead> logger)
{
    private const string DatabaseName = "db";
    private const string ContainerName = "primary";
    private const string DocumentId = "1";

    // The container's partition key path is /partition.
    private const string PartitionValue = "run_marathon";

    // Anonymous, not Function: the caller is a static page with no server side,
    // so any function key it sent would be sitting in public JavaScript — an
    // access control in name only, and one that can't be rotated without
    // redeploying the site. The endpoint takes no input and returns a single
    // hardcoded public document, so there is nothing here to gate.
    [Function("SpotRead")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "spotread")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        var container = cosmosClient.GetContainer(DatabaseName, ContainerName);

        try
        {
            // Stream overload: the document goes back exactly as stored, with
            // no POCO to keep in step with the container's shape.
            using var response = await container.ReadItemStreamAsync(
                DocumentId,
                new PartitionKey(PartitionValue),
                cancellationToken: cancellationToken);

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                logger.LogWarning(
                    "No document {DocumentId} in partition {PartitionValue}.",
                    DocumentId,
                    PartitionValue);

                return new NotFoundObjectResult(
                    $"No document with id '{DocumentId}' in partition '{PartitionValue}'.");
            }

            if (!response.IsSuccessStatusCode)
            {
                logger.LogError(
                    "Point read failed: {StatusCode} {ErrorMessage}",
                    response.StatusCode,
                    response.ErrorMessage);

                return new StatusCodeResult((int)response.StatusCode);
            }

            using var reader = new StreamReader(response.Content);
            var document = await reader.ReadToEndAsync(cancellationToken);

            logger.LogInformation(
                "Point read of {DocumentId}/{PartitionValue} cost {RequestCharge} RU.",
                DocumentId,
                PartitionValue,
                response.Headers.RequestCharge);

            return new ContentResult
            {
                Content = document,
                ContentType = "application/json",
                StatusCode = (int)HttpStatusCode.OK,
            };
        }
        catch (CosmosException ex)
        {
            logger.LogError(ex, "Cosmos point read of {DocumentId} failed.", DocumentId);
            return new StatusCodeResult((int)ex.StatusCode);
        }
    }
}
