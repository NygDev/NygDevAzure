using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Gym;

/// <summary>
/// The gate and the failure handling every gym endpoint shares.
///
/// Two things are true of all of them and of nothing else in this app: the
/// caller has to be signed in before a line of the body runs, and the client is
/// a browser. The first is why every endpoint goes through
/// <see cref="RunAsync"/> rather than reading the principal itself — one gate
/// in one place, so a new endpoint cannot be written that quietly skips it. The
/// second is why failures here are JSON with a machine-readable code rather
/// than the prose the GPS and WHOOP endpoints answer with: those are read by a
/// person during setup, these by a front end deciding whether to retry, resync
/// or show a message.
/// </summary>
internal static class GymEndpoint
{
    /// <summary>
    /// How long a request may spend in Cosmos before it is abandoned.
    ///
    /// Everything here is a point read, a point write or a single-partition
    /// query over at most 48 small documents, so a call that has spent ten
    /// seconds is not slow — it is a throttled account or a cold connection
    /// that is not coming back inside a phone's patience. Giving up here is
    /// what turns that into an answer the client can act on instead of a
    /// browser-side timeout with nothing in it.
    /// </summary>
    private static readonly TimeSpan Budget = TimeSpan.FromSeconds(10);

    /// <summary>
    /// Resolves the caller, runs the endpoint, and turns anything that goes
    /// wrong underneath into a response that says what.
    /// </summary>
    public static async Task<IActionResult> RunAsync(
        HttpRequest request,
        ILogger logger,
        CancellationToken cancellationToken,
        Func<string, CancellationToken, Task<IActionResult>> body)
    {
        if (!GymPrincipal.TryResolve(request, out var objectId, out var problem))
        {
            // Warning rather than error: an expired token is the ordinary way
            // this happens, and it is the client's to fix by signing in again.
            logger.LogWarning("A gym request arrived without a usable principal.");

            return Failure(HttpStatusCode.Unauthorized, "not_signed_in", problem);
        }

        using var budget = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        budget.CancelAfter(Budget);

        try
        {
            return await body(objectId, budget.Token);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            logger.LogError("A gym request did not finish inside {Budget} seconds.", Budget.TotalSeconds);

            return Failure(
                HttpStatusCode.ServiceUnavailable,
                "timed_out",
                $"The request did not finish within {Budget.TotalSeconds:0} seconds and was abandoned. "
                + "Nothing here takes that long when the account is healthy, so this is throttling or a "
                + "cold start rather than the size of the request. Every write in this API is safe to "
                + "retry — the guarded ones answer 'already recorded' rather than duplicating.");
        }
        catch (CosmosException ex)
        {
            logger.LogError(ex, "Cosmos returned {Status} for a gym request.", ex.StatusCode);

            var hint = ex.StatusCode switch
            {
                HttpStatusCode.Forbidden =>
                    "id-nygdev-api needs data-plane read/write on nygdev-cosmos-db. Terraform grants it "
                    + "across the account in terraform/consumption.tf, so a 403 here means the assignment "
                    + "is missing rather than too narrow.",
                HttpStatusCode.NotFound =>
                    "db/gym is missing on nygdev-cosmos-db. Terraform holds the container in "
                    + "terraform/db.tf.",
                HttpStatusCode.BadRequest =>
                    "Cosmos refused the operation itself. If this is a query, the likely cause is a "
                    + "filter on a path the container's indexing policy does not cover — it is opt-in, "
                    + "and adding a path is a terraform change in terraform/db.tf.",
                HttpStatusCode.TooManyRequests =>
                    "The account is throttling and the SDK's retries did not outlast it. db is "
                    + "provisioned at 1000 RU/s shared across primary, gps and gym.",
                _ => "The container is db/gym on nygdev-cosmos-db.",
            };

            return Failure(
                HttpStatusCode.BadGateway,
                "storage_error",
                $"Cosmos returned {(int)ex.StatusCode}. {hint}",
                ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            // A stored document that does not match the shape this code writes
            // — see GymDocument. Not the caller's fault and not retryable, so
            // it is a 500 that names the field rather than an empty one.
            logger.LogError(ex, "A document in db/gym could not be read.");

            return Failure(HttpStatusCode.InternalServerError, "unreadable_document", ex.Message);
        }
    }

    /// <summary>
    /// Parses the request body, or answers 400 with what is wrong with it.
    ///
    /// Returns the document to the caller to dispose. A null document with a
    /// non-null result is the failure case; the two are never both set.
    /// </summary>
    public static async Task<(JsonDocument? Body, IActionResult? Rejection)> ReadBodyAsync(
        HttpRequest request,
        CancellationToken cancellationToken)
    {
        JsonDocument document;

        try
        {
            document = await JsonDocument.ParseAsync(request.Body, cancellationToken: cancellationToken);
        }
        catch (JsonException ex)
        {
            return (null, Failure(
                HttpStatusCode.BadRequest,
                "invalid_json",
                $"The body is not valid JSON. {ex.Message}"));
        }

        if (document.RootElement.ValueKind != JsonValueKind.Object)
        {
            var kind = document.RootElement.ValueKind;
            document.Dispose();

            return (null, Failure(
                HttpStatusCode.BadRequest,
                "invalid_json",
                $"The body is {kind}, not a JSON object."));
        }

        return (document, null);
    }

    /// <summary>A rejected request, in a shape a front end can branch on.</summary>
    public static IActionResult Failure(
        HttpStatusCode status,
        string error,
        string message,
        string? detail = null) =>
        new ObjectResult(new
        {
            ok = false,
            error,
            message,
            detail,
        })
        {
            StatusCode = (int)status,
        };

    /// <summary>A rejected request body — always a 400, always with the reason
    /// the validator produced.</summary>
    public static IActionResult Invalid(string message) =>
        Failure(HttpStatusCode.BadRequest, "invalid_request", message);
}
