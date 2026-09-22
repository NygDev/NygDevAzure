using System.Buffers.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace ApiFunctionApp.Gym;

/// <summary>
/// Who is calling, as an Entra object id — and the only place in the gym code
/// that decides it.
///
/// The object id is the partition key on db/gym, so it is not an identifier
/// the API carries around for convenience: it <em>is</em> the tenancy
/// boundary. A caller able to name their own partition key could read anyone's
/// training log. That is why it comes off the principal the platform built
/// from a validated token and never off a route, a query string or a body, and
/// why every gym function refuses a request this class cannot resolve.
///
/// The platform is what validates the token. Easy Auth on func-nygdev-api
/// (terraform/consumption.tf) checks the signature, the issuing tenant, the
/// audience and the client application before the request reaches any function,
/// then serialises the resulting claims into the X-MS-CLIENT-PRINCIPAL header.
/// It also strips that header from anything arriving from outside, which is
/// what makes trusting it safe: with the auth module on, a caller cannot forge
/// one.
///
/// The gate is in code as well as in the platform, and for most of this app's
/// life it was the only one. Easy Auth ran with require_authentication = false
/// because the WHOOP callback, the GPS upload and the dashboard timer shared
/// this app and could present no token: turning the platform gate on would
/// have shut the door on them in the same instant. Under AllowAnonymous an
/// unauthenticated request arrives here with no principal rather than being
/// bounced, and refusing it is this class's job.
///
/// Those callers now live on func-nygdev-integrations, nothing anonymous is
/// left here, and the platform gate is on: require_authentication = true with
/// Return401, in the Easy Auth block in terraform/consumption.tf. So an
/// unauthenticated request no longer reaches this class at all — the platform
/// turns it away first.
///
/// This check is not redundant for that. require_authentication establishes
/// only that a token was valid; what this resolves is *which* user, and that
/// answer is the Cosmos partition key. It is also the only thing standing
/// between the training logs and a forged header if auth_enabled is ever
/// switched off, which is a config change rather than a deploy — and the
/// failure mode of that change is silent, because everything keeps answering
/// 200.
/// </summary>
internal static class GymPrincipal
{
    /// <summary>
    /// The header Easy Auth writes the claims into: base64 of a small JSON
    /// object with an <c>auth_typ</c> and a <c>claims</c> array.
    /// </summary>
    private const string HeaderName = "X-MS-CLIENT-PRINCIPAL";

    /// <summary>
    /// A developer sign-in, for a local checkout only.
    ///
    /// There is no Easy Auth in front of <c>func start</c>, so without this
    /// there is no way to exercise a single gym endpoint outside Azure. It is
    /// consulted only when the header is absent — a real principal always wins
    /// — and terraform never sets it on the function app, which is what keeps
    /// it from becoming a way to name a partition key in production. Setting it
    /// there by hand would hand every anonymous caller one user's training log.
    /// </summary>
    private const string LocalObjectIdSetting = "GYM_LOCAL_OBJECT_ID";

    /// <summary>
    /// The claim type an object id arrives under when the token went through
    /// the WS-Federation claim mapping. Easy Auth passes claims through under
    /// the type the token used, and which one that is depends on how the token
    /// was minted — see <see cref="ObjectIdClaimShort"/> for the other.
    /// </summary>
    private const string ObjectIdClaimUri =
        "http://schemas.microsoft.com/identity/claims/objectidentifier";

    /// <summary>
    /// What a v2.0 token carries instead. It means the same thing as
    /// <see cref="ObjectIdClaimUri"/>, so both are accepted.
    /// </summary>
    private const string ObjectIdClaimShort = "oid";

    /// <summary>
    /// Resolves the caller's object id, or explains in words why it could not.
    ///
    /// The explanation is the response body on a 401, so it is written for
    /// whoever is holding a token that is not working rather than for a log:
    /// the failures here are all configuration, or a sign-in that did not
    /// happen, and none of them are distinguishable from the outside without
    /// being told which.
    /// </summary>
    public static bool TryResolve(HttpRequest request, out string objectId, out string problem)
    {
        objectId = string.Empty;

        var header = request.Headers[HeaderName].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(header))
        {
            var local = Environment.GetEnvironmentVariable(LocalObjectIdSetting);

            if (!string.IsNullOrWhiteSpace(local) && Guid.TryParse(local, out var localOid))
            {
                objectId = localOid.ToString();
                problem = string.Empty;
                return true;
            }

            problem = """
                This request carried no signed-in user.

                The gym endpoints are anonymous at the Functions level on purpose — a browser
                cannot keep a function key secret — and are gated instead on the principal Easy
                Auth builds from a validated bearer token. So a call with no Authorization header,
                or one whose token the platform rejected, arrives here looking exactly like this.

                Send an access token for the GymLog registration. It has to be minted for that
                registration and obtained by it: Easy Auth checks both the aud and the appid
                claims, and a token from a different client is refused with a 403 before it ever
                reaches this code.
                """;
            return false;
        }

        if (!TryDecode(header, out var principal, out var decodeError))
        {
            problem = $"""
                The signed-in user could not be read.

                {decodeError}

                {HeaderName} is written by the platform, not by the caller, so this is a bug or a
                change in what Easy Auth emits rather than anything a client can fix.
                """;
            return false;
        }

        using (principal)
        {
            if (!TryReadObjectId(principal.RootElement, out var oid))
            {
                problem = """
                    The signed-in user carries no object id.

                    A token from the Microsoft identity platform always has an 'oid' claim, and it is
                    the only thing this API identifies a user by — it is the Cosmos partition key
                    holding the training log, so there is nothing to fall back on. A token without one
                    is not an Entra user token: check that the GymLog registration mints v2.0 tokens
                    (requestedAccessTokenVersion 2 in its manifest) and that the caller is signing in
                    as a user rather than with client credentials.
                    """;
                return false;
            }

            objectId = oid;
            problem = string.Empty;
            return true;
        }
    }

    /// <summary>
    /// Base64 in, claims document out.
    ///
    /// Standard base64 with padding, which is what the platform emits — not the
    /// URL-safe variant, so there is no character substitution to undo first.
    /// </summary>
    private static bool TryDecode(string header, out JsonDocument principal, out string error)
    {
        principal = null!;

        var decoded = new byte[Base64.GetMaxDecodedFromUtf8Length(header.Length)];

        if (!Convert.TryFromBase64String(header, decoded, out var written))
        {
            error = $"The header is {header.Length} characters that are not valid base64.";
            return false;
        }

        JsonDocument parsed;

        try
        {
            parsed = JsonDocument.Parse(decoded.AsMemory(0, written));
        }
        catch (JsonException ex)
        {
            error = $"The header decoded to {written} bytes that are not valid JSON. {ex.Message}";
            return false;
        }

        if (parsed.RootElement.ValueKind != JsonValueKind.Object)
        {
            error = $"The header decoded to {parsed.RootElement.ValueKind}, not an object.";
            parsed.Dispose();
            return false;
        }

        principal = parsed;
        error = string.Empty;
        return true;
    }

    /// <summary>
    /// Finds the object id in the claims array, and insists it is a GUID.
    ///
    /// The GUID check is not ceremony. Whatever comes back is written into a
    /// Cosmos partition key and into document ids, so a value that is not the
    /// shape an object id has is refused here rather than stored — an id that
    /// cannot round-trip is a partition nobody can read back.
    /// </summary>
    private static bool TryReadObjectId(JsonElement principal, out string objectId)
    {
        objectId = string.Empty;

        if (!principal.TryGetProperty("claims", out var claims)
            || claims.ValueKind != JsonValueKind.Array)
        {
            return false;
        }

        foreach (var claim in claims.EnumerateArray())
        {
            if (claim.ValueKind != JsonValueKind.Object
                || !claim.TryGetProperty("typ", out var type)
                || type.ValueKind != JsonValueKind.String
                || !IsObjectIdClaim(type))
            {
                continue;
            }

            if (claim.TryGetProperty("val", out var value)
                && value.ValueKind == JsonValueKind.String
                && Guid.TryParse(value.GetString(), out var parsed))
            {
                objectId = parsed.ToString();
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// Whether a claim's <c>typ</c> is one of the two an object id arrives
    /// under.
    ///
    /// <see cref="JsonElement.ValueEquals(string)"/> compares against the
    /// element's own UTF-8 rather than materialising it, which matters because
    /// this runs against every claim of every gym request: an Easy Auth
    /// principal carries a couple of dozen, and the string built to compare
    /// each one would be thrown away on the same line. The hot path here is a
    /// set-tap, thirty or forty times a session.
    /// </summary>
    private static bool IsObjectIdClaim(JsonElement type) =>
        type.ValueEquals(ObjectIdClaimUri) || type.ValueEquals(ObjectIdClaimShort);
}
