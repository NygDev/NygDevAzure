using System.Net;
using System.Text.Json;
using ApiFunctionApp.Whoop;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// Pulls the latest WHOOP workout and writes it to Cosmos.
///
/// The document is WHOOP's own record, passed through field for field, with
/// only the four properties Cosmos and this app need layered on top: <c>id</c>
/// (WHOOP's workout id, reused so the same workout is the same document),
/// <c>partition</c>, <c>type</c>, and <c>ingested_at</c>. Nothing is reshaped
/// on the way in — a workout that changes shape upstream still lands, and what
/// is stored can be read back against WHOOP's own documentation.
///
/// The write is an upsert rather than a create. A workout is not final when it
/// first appears: <c>score_state</c> starts as PENDING and the <c>score</c>
/// object arrives later, and an in-progress workout's <c>end</c> keeps moving.
/// Re-running this endpoint is meant to bring the stored copy up to date, not
/// to fail on a conflict.
/// </summary>
public class WhoopWorkoutSync(CosmosClient cosmosClient, WhoopClient whoop, ILogger<WhoopWorkoutSync> logger)
{
    private const string DatabaseName = "db";
    private const string ContainerName = "primary";

    // The container's partition key path is /partition. Everything from WHOOP
    // shares one partition for now; that is fine at this volume and is the
    // decision to revisit first if this grows past a single account's history.
    private const string PartitionValue = "whoop";

    private const string DocumentType = "whoop_workout";

    // Written by this function, so a WHOOP field of the same name must not
    // overwrite them — the copy loop below skips these names.
    private static readonly HashSet<string> OwnedProperties =
        new(StringComparer.Ordinal) { "id", "partition", "type", "ingested_at" };

    // Function level, and GET as well as POST. The endpoint writes, which
    // normally rules GET out, but the write is an idempotent upsert of one
    // deterministic document and the function key keeps it off the open web —
    // so a browser is allowed to be the way this gets triggered by hand.
    [Function("WhoopWorkoutSync")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "whoop/workout/latest")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var latest = await whoop.GetLatestWorkoutAsync(cancellationToken);

            if (latest is not { } workout)
            {
                logger.LogInformation("WHOOP returned no workouts; nothing to write.");

                return new NotFoundObjectResult(new
                {
                    ok = false,
                    error = "no_workouts",
                    message = "WHOOP returned no workouts for this account.",
                });
            }

            // Without an id there is no document to write: Cosmos requires one,
            // and inventing a surrogate would break the whole point of reusing
            // WHOOP's, which is that re-running updates the workout instead of
            // duplicating it.
            if (ReadString(workout, "id") is not { Length: > 0 } workoutId)
            {
                logger.LogError("The WHOOP workout record carried no usable id: {Record}", workout.GetRawText());

                return new ObjectResult(new
                {
                    ok = false,
                    error = "whoop_unexpected_shape",
                    message = "The WHOOP workout record carried no usable 'id'.",
                })
                {
                    StatusCode = (int)HttpStatusCode.BadGateway,
                };
            }

            return await WriteAsync(workoutId, workout, cancellationToken);
        }
        catch (WhoopAuthException ex) when (ex.NeedsReauthorization)
        {
            // WHOOP rejected the credentials rather than failing to answer.
            // Same shape WhoopStatus returns, for the same reason: retrying
            // cannot fix it, only re-authorizing can.
            //
            // A 403 here rather than a 401 usually means something narrower:
            // the token is good but was granted without read:workout, which
            // happens when the account was last authorized before that scope
            // joined WhoopOptions.DefaultScopes. The fix is the same trip
            // through /api/whoop/authorize.
            logger.LogError(ex, "WHOOP rejected the stored credentials for the workout endpoint.");

            return new ObjectResult(new
            {
                ok = false,
                error = "whoop_reauthorization_required",
                message = "WHOOP rejected the stored credentials. Open /api/whoop/authorize in a "
                    + $"browser to re-authorize; it rewrites '{WhoopSecretStore.RefreshTokenName}'. "
                    + "If the status endpoint still works, the grant is most likely missing the "
                    + "read:workout scope.",
                status = (int)ex.StatusCode,
                grantedScopes = whoop.GrantedScopes,
                detail = ex.ResponseBody,
            })
            {
                StatusCode = (int)HttpStatusCode.Conflict,
            };
        }
        catch (WhoopAuthException ex)
        {
            logger.LogError(ex, "Fetching the latest WHOOP workout failed upstream.");

            return new ObjectResult(new
            {
                ok = false,
                error = "whoop_upstream_error",
                message = ex.Message,
                status = (int)ex.StatusCode,
                detail = ex.ResponseBody,
            })
            {
                StatusCode = (int)HttpStatusCode.BadGateway,
            };
        }
        catch (CosmosException ex)
        {
            logger.LogError(ex, "Cosmos rejected the workout upsert.");

            return new ObjectResult(new
            {
                ok = false,
                error = "cosmos_write_failed",
                status = (int)ex.StatusCode,
                message = ex.Message,
            })
            {
                StatusCode = SafeStatusCode(ex.StatusCode),
            };
        }
        catch (OperationCanceledException ex)
        {
            // Normally this is just a client disconnect or a host shutdown and
            // not worth a stack trace. It is reported anyway because it is
            // otherwise indistinguishable from the failures below: an
            // HttpClient whose token is already cancelled throws this
            // instantly, which looks exactly like a fast crash.
            logger.LogWarning(
                ex,
                "The WHOOP workout sync was canceled. Request token cancelled: {Cancelled}.",
                cancellationToken.IsCancellationRequested);

            return new ObjectResult(new
            {
                ok = false,
                error = "canceled",
                type = ex.GetType().FullName,
                message = ex.Message,
                requestTokenCancelled = cancellationToken.IsCancellationRequested,
            })
            {
                // 499, nginx's "client closed request": not a server fault, and
                // distinguishable at a glance from the 500 below.
                StatusCode = 499,
            };
        }
        catch (Exception ex)
        {
            // Everything else the two clients can throw that is not one of
            // their own types: Key Vault and managed-identity failures
            // (RequestFailedException, CredentialUnavailableException), a WHOOP
            // connection that never opened (HttpRequestException), a malformed
            // body (JsonException). Without this the host logs "An exception was
            // thrown by the invocation" and the caller gets a bare 500 — the
            // cause only visible by digging through Application Insights.
            logger.LogError(ex, "The WHOOP workout sync failed.");

            return new ObjectResult(new
            {
                ok = false,
                error = "unexpected_error",
                type = ex.GetType().FullName,
                message = ex.Message,

                // The proximate cause is usually the interesting one: an
                // AuthenticationFailedException says little, its inner
                // exception says which credential was tried and why it failed.
                inner = ex.InnerException?.Message,
            })
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
            };
        }
    }

    private async Task<IActionResult> WriteAsync(
        string workoutId,
        JsonElement workout,
        CancellationToken cancellationToken)
    {
        var container = cosmosClient.GetContainer(DatabaseName, ContainerName);

        using var payload = new MemoryStream();
        WriteDocument(payload, workoutId, workout);
        payload.Position = 0;

        // Stream overload, matching SpotRead: the bytes written are the bytes
        // stored, with no POCO or serializer settings in between — which also
        // sidesteps the CosmosClient's default Newtonsoft serializer, whose
        // defaults would reshape a System.Text.Json payload on the way through.
        using var response = await container.UpsertItemStreamAsync(
            payload,
            new PartitionKey(PartitionValue),
            cancellationToken: cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            logger.LogError(
                "Upsert of workout {WorkoutId} failed: {StatusCode} {ErrorMessage}",
                workoutId,
                response.StatusCode,
                response.ErrorMessage);

            return new ObjectResult(new
            {
                ok = false,
                error = "cosmos_write_failed",
                status = (int)response.StatusCode,
                message = response.ErrorMessage,
            })
            {
                StatusCode = SafeStatusCode(response.StatusCode),
            };
        }

        logger.LogInformation(
            "Wrote WHOOP workout {WorkoutId} ({Sport}, started {Start}) to {Database}/{Container} "
            + "partition {Partition} for {RequestCharge} RU.",
            workoutId,
            ReadString(workout, "sport_name"),
            ReadString(workout, "start"),
            DatabaseName,
            ContainerName,
            PartitionValue,
            response.Headers.RequestCharge);

        return new OkObjectResult(new
        {
            ok = true,
            id = workoutId,
            partition = PartitionValue,
            type = DocumentType,

            // 201 means this workout had not been stored before; 200 means an
            // existing document was replaced.
            created = response.StatusCode == HttpStatusCode.Created,

            start = ReadString(workout, "start"),
            end = ReadString(workout, "end"),
            sport = ReadString(workout, "sport_name"),
            scoreState = ReadString(workout, "score_state"),
            requestCharge = response.Headers.RequestCharge,
        });
    }

    /// <summary>
    /// The stored document: this app's four properties, then every field of
    /// WHOOP's record that does not collide with one of them.
    /// </summary>
    private static void WriteDocument(Stream destination, string workoutId, JsonElement workout)
    {
        using var writer = new Utf8JsonWriter(destination);

        writer.WriteStartObject();

        writer.WriteString("id", workoutId);
        writer.WriteString("partition", PartitionValue);

        // The container is shared, and with indexing_mode = "none" it cannot be
        // queried by shape — so a document has to say what it is in its own
        // body for anything reading it later to tell.
        writer.WriteString("type", DocumentType);

        // When this copy was taken, as distinct from WHOOP's own updated_at.
        // The two differ whenever a workout was rescored between syncs.
        writer.WriteString("ingested_at", DateTimeOffset.UtcNow);

        foreach (var property in workout.EnumerateObject())
        {
            if (OwnedProperties.Contains(property.Name))
            {
                continue;
            }

            property.WriteTo(writer);
        }

        writer.WriteEndObject();
        writer.Flush();
    }

    /// <summary>
    /// A status code that ASP.NET Core will accept on the response.
    ///
    /// ObjectResult writes its StatusCode straight onto the response and the
    /// framework rejects anything outside 100..999 — thrown while the result
    /// executes, which is after Run has returned and therefore outside every
    /// catch in it. A CosmosException raised before any response came back
    /// carries StatusCode 0, so casting it is not safe on its own; the real
    /// status is reported in the body either way.
    /// </summary>
    private static int SafeStatusCode(HttpStatusCode statusCode) =>
        (int)statusCode is >= 100 and <= 999
            ? (int)statusCode
            : (int)HttpStatusCode.InternalServerError;

    private static string? ReadString(JsonElement workout, string propertyName) =>
        workout.ValueKind == JsonValueKind.Object
            && workout.TryGetProperty(propertyName, out var value)
            && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;
}
