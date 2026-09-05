using System.Text.Json;
using System.Text.Json.Serialization;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// The token endpoint's response, shared by the authorization-code and
/// refresh-token grants — WHOOP answers both with the same shape.
/// </summary>
public sealed record WhoopTokenResponse
{
    [JsonPropertyName("access_token")]
    public required string AccessToken { get; init; }

    /// <summary>
    /// The replacement refresh token. WHOOP rotates on every grant and
    /// invalidates the one that was sent, so whatever comes back here is the
    /// only usable token from this moment on and has to reach the vault.
    /// </summary>
    [JsonPropertyName("refresh_token")]
    public string? RefreshToken { get; init; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; init; }

    [JsonPropertyName("scope")]
    public string? Scope { get; init; }
}

/// <summary>What a completed token exchange leaves behind, minus the tokens.</summary>
public sealed record WhoopTokenResult
{
    public required DateTimeOffset ExpiresAt { get; init; }

    public required IReadOnlyList<string> Scopes { get; init; }

    public required bool RefreshTokenStored { get; init; }
}

/// <summary>
/// GET /v2/user/profile/basic — the cheapest call that proves the token works.
///
/// The user id and nothing else. WHOOP answers with a name and an email
/// alongside it, and neither is bound: this record exists to confirm a token
/// is live, the id is what the check logs, and a field declared here would be
/// somebody's name deserialized into a process that has no use for it.
/// </summary>
public sealed record WhoopProfile
{
    [JsonPropertyName("user_id")]
    public long UserId { get; init; }
}

/// <summary>One page of a WHOOP collection: the records, and where to resume.</summary>
public sealed record WhoopPage
{
    public static readonly WhoopPage Empty = new() { Records = [] };

    public required IReadOnlyList<JsonElement> Records { get; init; }

    /// <summary>Null once WHOOP has no more pages to give.</summary>
    public string? NextToken { get; init; }
}
