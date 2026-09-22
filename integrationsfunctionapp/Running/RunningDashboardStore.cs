using System.Text.Json;
using System.Text.Json.Serialization;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace ApiFunctionApp.Running;

/// <summary>
/// Publishes the dashboard as a JSON blob on the CDN storage account.
///
/// A blob rather than a Cosmos document because of who reads it. The dashboard
/// is one file, rewritten whole on a timer, and read by a browser on
/// run.nygard.dev — which through Cosmos would mean a function call on every
/// page load, a function key to hold or an anonymous endpoint to expose, and
/// RU spent per visitor on a document that did not change between them. As a
/// blob it is a static file on an account that is already public and already
/// fronted by a CDN, and the page fetches it with no key and nothing of ours
/// in the path.
///
/// The write is a full overwrite. There is one dashboard, the build always
/// produces all of it, and a partial update is not a thing this can express —
/// which is the same reason the Cosmos version was an upsert on a fixed id.
/// </summary>
public sealed class RunningDashboardStore(BlobClient blob)
{
    /// <summary>
    /// camelCase, matching what the HTTP endpoints already return, so the
    /// published file and the API's own response are the same shape. Nulls are
    /// kept rather than dropped: a null rolling average or ACWR ratio is a gap
    /// the chart is meant to see, and a missing property would read as zero.
    ///
    /// Not indented. This is machine-read, and the whitespace would be a third
    /// of the bytes over the wire on every page load.
    /// </summary>
    private static readonly JsonSerializerOptions DocumentJson = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.Never,
        WriteIndented = false,
    };

    /// <summary>
    /// How long a browser or the CDN may serve a cached copy. The file is
    /// rewritten every six hours, so this could be far longer — it is kept
    /// short because the other way it changes is somebody rebuilding it by
    /// hand after changing how a chart is computed, and waiting an hour to see
    /// whether that worked is worse than the requests five minutes costs.
    /// </summary>
    private const string CacheControl = "public, max-age=300";

    public Uri Uri => blob.Uri;

    public async Task WriteAsync(RunningDashboardDocument document, CancellationToken cancellationToken)
    {
        using var payload = new MemoryStream();
        await JsonSerializer.SerializeAsync(payload, document, DocumentJson, cancellationToken);
        payload.Position = 0;

        // Headers set on the upload rather than patched afterwards. A blob
        // written without them serves as application/octet-stream, which a
        // browser offers to download instead of handing to the page — and
        // fixing that in a second call is the job func-nygdev-azadmin exists to
        // do for the Foundry media, precisely because nothing sets them at the
        // point of upload.
        await blob.UploadAsync(
            payload,
            new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = "application/json; charset=utf-8",
                    CacheControl = CacheControl,
                },
            },
            cancellationToken);
    }
}
