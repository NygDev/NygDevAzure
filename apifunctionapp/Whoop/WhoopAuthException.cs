using System.Net;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// A WHOOP OAuth or API call that came back with something other than success.
/// Carries the upstream status so the endpoints can tell "the stored refresh
/// token is no longer good — go re-authorize" apart from "WHOOP is down".
/// </summary>
public sealed class WhoopAuthException(string message, HttpStatusCode statusCode, string? responseBody = null)
    : Exception(message)
{
    public HttpStatusCode StatusCode { get; } = statusCode;

    public string? ResponseBody { get; } = responseBody;

    /// <summary>
    /// True when WHOOP rejected the credentials themselves rather than
    /// failing to answer — the stored refresh token is spent, revoked or
    /// still the placeholder, and only a fresh trip through
    /// <c>/api/whoop/authorize</c> fixes it.
    /// </summary>
    public bool NeedsReauthorization =>
        StatusCode is HttpStatusCode.BadRequest or HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden;
}
