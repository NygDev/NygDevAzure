using System.Net;
using ApiFunctionApp.Running;
using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// Rebuilds the running dashboard on demand, and answers with what it published.
///
/// The scheduled path is <see cref="WhoopSyncTimer"/>, which rebuilds this
/// straight after the morning sync — so on an ordinary day nobody calls this at
/// all. It exists for the two occasions that are not ordinary: a backfill,
/// where the sync runs many times over and rebuilding after each call would be
/// waste, and a change to how a run is classified or a chart computed, which
/// reshapes history and wants to take effect before tomorrow morning.
///
/// It reads WHOOP data out of Cosmos and never talks to WHOOP, so unlike the
/// sync endpoints it needs no access token and cannot fail on an expired one.
/// The two things it does touch are the ones it answers for below: the Cosmos
/// container it reads the runs from, and the blob it publishes them to.
/// </summary>
public class RunningDashboard(
    RunningDashboardBuilder builder,
    ILogger<RunningDashboard> logger)
{
    // Function level, matching WhoopSync: this writes a document, and the
    // dashboard site reads the result out of Cosmos rather than through here.
    [Function("RunningDashboard")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "running/dashboard")]
        HttpRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var document = await builder.BuildAsync(cancellationToken);

            return new OkObjectResult(new
            {
                ok = true,
                message = document.Source.Runs > 0
                    ? $"Built from {document.Source.Runs} runs and published to {builder.PublishedTo}."
                    : "No scored running workouts are stored yet; the dashboard was published empty. "
                        + "Run /api/whoop/sync first.",
                publishedTo = builder.PublishedTo,
                dashboard = document,
            });
        }
        catch (RequestFailedException ex)
        {
            // The publish half. Storage answers in the same shape whichever
            // way it refuses, so the status is what tells them apart.
            logger.LogError(ex, "Storage returned {Status} publishing the running dashboard.", ex.Status);

            var hint = ex.Status switch
            {
                403 => "id-nygdev-api needs Storage Blob Data Contributor on the data container of "
                    + "nygdevcdn; terraform grants it in terraform/consumption.tf.",
                404 => "The container the blob lives in does not exist. Terraform creates it in "
                    + "terraform/cdn.tf.",
                _ => $"The target is {builder.PublishedTo}, set by DASHBOARD_BLOB_URL.",
            };

            return new ObjectResult(new
            {
                ok = false,
                error = "blob_write_failed",
                message = $"Storage returned {ex.Status} publishing the running dashboard. {hint}",
                detail = ex.Message,
            })
            {
                StatusCode = (int)HttpStatusCode.BadGateway,
            };
        }
        catch (CosmosException ex)
        {
            logger.LogError(ex, "Cosmos returned {Status} while building the running dashboard.", ex.StatusCode);

            var hint = ex.StatusCode switch
            {
                // What an unindexed filter comes back as. The query asks for no
                // scan on purpose, so this is the container's indexing policy
                // being older than the code that reads it.
                HttpStatusCode.BadRequest =>
                    "Cosmos would not run the query. If it names an unindexed path, db/primary is still "
                    + "carrying an older indexing policy — /sport_name and /score_state have to be indexed, "
                    + "which terraform sets in terraform/db.tf. A code deploy does not carry that: run the "
                    + "Terraform Apply workflow and try again.",
                HttpStatusCode.Forbidden =>
                    "id-nygdev-api needs data-plane read/write on db/primary; terraform grants it in "
                    + "terraform/consumption.tf.",
                HttpStatusCode.TooManyRequests =>
                    "The account is throttling. The database is provisioned at 1000 RU/s shared across "
                    + "everything on it, and this reads every stored run in one go.",
                _ => "The container is db/primary on nygdev-cosmos-db.",
            };

            return new ObjectResult(new
            {
                ok = false,
                error = "cosmos_request_failed",
                message = $"Cosmos returned {(int)ex.StatusCode} building the running dashboard. {hint}",
                detail = ex.Message,
            })
            {
                StatusCode = (int)HttpStatusCode.BadGateway,
            };
        }
    }
}
