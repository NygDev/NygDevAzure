using System.Globalization;
using System.Net;
using System.Text.Json;
using ApiFunctionApp.Gps;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp;

/// <summary>
/// Receives batches of location fixes from the phone and stores them in
/// Cosmos.
///
/// The phone spools fixes locally and uploads them as one JSON array, then
/// deletes what it uploaded — but only once it has seen a 2xx. So the contract
/// this endpoint is holding up is narrower than it looks:
///
/// <list type="bullet">
/// <item>A 2xx means every fix in the array is durably stored. Nothing else
/// may answer 2xx, because the phone's copy is gone the moment it does.</item>
/// <item>Anything else — a 4xx, a 5xx, a timeout — costs nothing. The whole
/// spool stays on the phone and comes back on the next upload, so failing is
/// always the safe answer when the write is in any doubt.</item>
/// <item>An answer has to arrive within 20 seconds, which is the phone's read
/// timeout. Past that the upload is a failure however it ends here, so the
/// write is given a budget inside that and gives up in time to say so.</item>
/// <item>Duplicates are expected, not exceptional. A batch whose response was
/// lost is resent verbatim, so the store groups the fixes into segment
/// documents keyed on the span of <c>ts</c> they cover and upserts — a
/// verbatim resend rebuilds the same ids and lands on the same documents. See
/// <see cref="GpsFixStore"/>, which also covers what a partially overlapping
/// resend does instead.</item>
/// </list>
///
/// The one cost worth knowing about is what a rejection does: the phone keeps
/// re-uploading a batch it cannot get accepted until the spool hits its 20 000
/// fix cap and starts dropping the oldest. That is the right trade against
/// losing data to a transient failure, but it does mean a payload this
/// endpoint refuses on principle — one that fails validation below — is
/// refused forever. Which is why the 400 says exactly which fix and which
/// field, and why it is logged as an error rather than a warning.
/// </summary>
public class GpsLocations(GpsFixStore store, ILogger<GpsLocations> logger)
{
    /// <summary>
    /// How long the write may take before the endpoint gives up and reports a
    /// failure it can still get out in time.
    ///
    /// The phone reads for 20 seconds. Answering at 19.9 is the same as not
    /// answering, and the eight seconds left over here are not spare: a cold
    /// start on Flex Consumption is spent inside that same window, before this
    /// function runs at all, and the response still has to be written
    /// afterwards. An ordinary batch of six fixes is one round trip and
    /// finishes in milliseconds, so nothing that matters is given up — what
    /// has spent twelve seconds is a backlog or a throttled account, and no
    /// budget makes those succeed. What the headroom buys is that they fail
    /// with the explanation below rather than as a timeout the phone reports
    /// as a bare network error.
    /// </summary>
    private static readonly TimeSpan WriteBudget = TimeSpan.FromSeconds(12);

    // Function level: this writes to db/gps, and the phone holds a key. A wrong
    // key answers 401, which the phone reads as a failure and spools through —
    // the payload contract calls that out as the thing to watch for during
    // setup, and it looks the same from here as a network outage does.
    [Function("GpsLocations")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "gps/locations")] HttpRequest request,
        CancellationToken cancellationToken)
    {
        JsonDocument document;

        try
        {
            document = await JsonDocument.ParseAsync(request.Body, cancellationToken: cancellationToken);
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "A GPS upload was not valid JSON.");

            return Rejected($"The body is not valid JSON. {ex.Message}");
        }

        using (document)
        {
            if (!TryReadFixes(document.RootElement, out var fixes, out var rejection))
            {
                logger.LogError("Rejected a GPS upload: {Reason}", rejection);

                return Rejected(rejection);
            }

            return await StoreAsync(fixes, cancellationToken);
        }
    }

    /// <summary>
    /// Parses the array into fixes, or explains why it will not.
    ///
    /// Every fix has to be readable for any of them to be stored. Storing the
    /// good ones and reporting the rest is not an option the protocol has: a
    /// 2xx deletes the whole batch on the phone, including the fixes that were
    /// dropped here, and a non-2xx keeps all of them regardless of what was
    /// written. So the only honest answers are all or none.
    /// </summary>
    private static bool TryReadFixes(
        JsonElement root,
        out IReadOnlyList<GpsFix> fixes,
        out string rejection)
    {
        fixes = [];

        if (root.ValueKind != JsonValueKind.Array)
        {
            rejection = $"The body is {(root.ValueKind == JsonValueKind.Object ? "an object" : "not an array")}. "
                + "Post a JSON array of fixes, even when there is only one.";
            return false;
        }

        var length = root.GetArrayLength();

        if (length == 0)
        {
            // Not an error the phone should ever produce — it skips the upload
            // entirely when the spool is empty — so something is wrong if this
            // is reached. Refusing is also the cheaper mistake: an empty array
            // accepted is an upload that did nothing and reported success.
            rejection = "The array is empty. An upload with nothing to store is skipped, not sent.";
            return false;
        }

        // Keyed by ts, because one array can carry the same fix twice: the
        // phone appends batches in order and resends anything it did not get
        // acknowledged, so a resend can overlap an upload that did land. Left
        // in, the duplicates would be stored twice inside the same segment
        // document — and, because the segment ids are derived from the span
        // they cover, would shift the boundaries of every segment after them
        // so that a resend no longer landed on the documents it wrote first
        // time round.
        var byTimestamp = new Dictionary<long, GpsFix>(length);
        var index = 0;

        foreach (var element in root.EnumerateArray())
        {
            if (!GpsFix.TryRead(element, out var fix, out var error))
            {
                rejection = $"Fix {index} of {length} is unusable: {error}.";
                return false;
            }

            // Last one wins. Two fixes with one ts are the same fix by the only
            // identity this payload has, and the later copy in the array is the
            // later one the phone wrote.
            byTimestamp[fix.TimestampMs] = fix;
            index++;
        }

        // Oldest first, and this one is load-bearing rather than tidiness. The
        // store chunks this list into fixed-size segments and names each
        // document after the span it covers, so the order decides the ids. Two
        // uploads of the same fixes have to sort the same way to rebuild the
        // same documents, which is the whole of the resend contract.
        //
        // It also means a run that fails partway leaves the oldest fixes
        // stored rather than an arbitrary scatter of them, and the logged span
        // below reads as a span rather than as two numbers.
        var ordered = byTimestamp.Values.ToList();
        ordered.Sort((left, right) => left.TimestampMs.CompareTo(right.TimestampMs));

        fixes = ordered;
        rejection = string.Empty;
        return true;
    }

    private async Task<IActionResult> StoreAsync(
        IReadOnlyList<GpsFix> fixes,
        CancellationToken cancellationToken)
    {
        // Linked rather than a bare timer, so the write also stops when the
        // host is shutting down or the phone has already hung up.
        using var budget = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        budget.CancelAfter(WriteBudget);

        GpsWriteReport report;

        try
        {
            report = await store.WriteAsync(fixes, budget.Token);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            // The budget, not the caller. Whatever landed before this stays
            // landed; the phone resends the lot and the upserts absorb it.
            logger.LogError(
                "A GPS upload of {Count} fixes did not finish inside {Budget} seconds and was abandoned.",
                fixes.Count,
                WriteBudget.TotalSeconds);

            return Text(
                HttpStatusCode.ServiceUnavailable,
                $"""
                Storing {fixes.Count} fixes did not finish within {WriteBudget.TotalSeconds:0} seconds.

                Nothing is lost — the spool stays on the phone and the fixes that did land are
                upserted over on the next attempt. A backlog this size is the likely cause:
                db/gps is on a database provisioned at 1000 RU/s shared with every other container
                on it, and while the fixes are stored in segments of 150 rather than one document
                apiece, a large enough spool still cannot be written inside the phone's 20 second
                read timeout.
                """);
        }
        catch (CosmosException ex)
        {
            logger.LogError(
                ex,
                "Cosmos returned {Status} storing {Count} location fixes.",
                ex.StatusCode,
                fixes.Count);

            var hint = ex.StatusCode switch
            {
                HttpStatusCode.Forbidden =>
                    "id-nygdev-api needs data-plane read/write on db/gps; the role assignments are "
                    + "per container rather than per account, so the one covering db/primary does not "
                    + "reach this container. Terraform grants it in terraform/consumption.tf.",
                HttpStatusCode.NotFound =>
                    "db/gps is missing on nygdev-cosmos-db. Terraform holds the container in "
                    + "terraform/db.tf.",
                HttpStatusCode.TooManyRequests =>
                    "The account is throttling and the SDK's retries did not outlast it. The database is "
                    + "provisioned at 1000 RU/s shared across every container on it.",
                HttpStatusCode.RequestEntityTooLarge =>
                    "A segment serialized larger than the 2 MB Cosmos accepts for one document, which "
                    + "150 fixes of six numbers each should come nowhere near — check what was actually "
                    + "posted, and FixesPerSegment in GpsFixStore.",
                _ => "The container is db/gps on nygdev-cosmos-db.",
            };

            return Text(
                HttpStatusCode.BadGateway,
                $"""
                Cosmos returned {(int)ex.StatusCode} storing {fixes.Count} location fixes.

                {hint}

                Nothing is lost — the spool stays on the phone, and every write here is an upsert
                keyed on ts, so the resend rewrites in place rather than duplicating.

                {ex.Message}
                """);
        }

        var oldest = fixes[0].RecordedAt;
        var newest = fixes[^1].RecordedAt;

        // The RU charge is logged rather than discarded because it is the only
        // way to see what an upload actually costs against the account's
        // 1000 RU/s — and the number that says whether the segment size is
        // pulling its weight.
        logger.LogInformation(
            "Stored {Count} location fixes spanning {Oldest} to {Newest} "
            + "in {Segments} segments for {Charge:0.##} RU.",
            fixes.Count,
            oldest,
            newest,
            report.Segments,
            report.RequestCharge);

        // 200 and a short summary. The phone drains the body and ignores it —
        // only the status matters to it — but the same call made by hand
        // during setup is how anyone finds out whether the key, the route and
        // the container are all right, and an empty response answers none of
        // that.
        return new OkObjectResult(new
        {
            ok = true,
            stored = fixes.Count,
            segments = report.Segments,
            oldest = oldest.ToString("O", CultureInfo.InvariantCulture),
            newest = newest.ToString("O", CultureInfo.InvariantCulture),
        });
    }

    /// <summary>
    /// A refused payload, in words.
    ///
    /// 400 rather than a 5xx on purpose, even though the phone treats both the
    /// same way and will keep resending: the difference is for whoever reads
    /// the logs, where a 400 means this payload will never be accepted and a
    /// 5xx means the next attempt might work.
    /// </summary>
    private static ContentResult Rejected(string reason) => Text(
        HttpStatusCode.BadRequest,
        // Two dollars, so the sample payload's own braces are literal and only
        // {{reason}} interpolates.
        $$"""
        {{reason}}

        The body is a non-empty JSON array of fixes, each with all six keys:
        lat and lon as numbers, acc, alt and spd as a number or literal null, and ts as
        epoch milliseconds.

        [{"lat":59.913868,"lon":10.752245,"acc":4.2,"alt":23.7,"spd":1.35,"ts":1756645200000}]

        Nothing was stored. The spool stays on the phone and will be resent, so this will
        repeat until the payload changes.
        """);

    private static ContentResult Text(HttpStatusCode status, string body) => new()
    {
        Content = body,
        ContentType = "text/plain; charset=utf-8",
        StatusCode = (int)status,
    };
}
