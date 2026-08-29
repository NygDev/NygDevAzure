using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Web;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// Everything that talks to WHOOP: the two token grants and the data API.
///
/// Registered as a singleton so the access token it holds outlives a single
/// invocation — an access token is good for an hour, and refreshing per call
/// would burn a refresh-token rotation (and a Key Vault write) every time.
/// </summary>
public sealed class WhoopClient(
    HttpClient http,
    WhoopOptions options,
    WhoopSecretStore secrets,
    ILogger<WhoopClient> logger)
{
    public const string AuthorizeEndpoint = "https://api.prod.whoop.com/oauth/oauth2/auth";

    private const string TokenEndpoint = "https://api.prod.whoop.com/oauth/oauth2/token";
    private const string ApiBaseUrl = "https://api.prod.whoop.com/developer";

    /// <summary>WHOOP's ceiling on a collection page; a larger limit is a 400.</summary>
    public const int MaxPageSize = 25;

    // Renew a little early rather than discovering expiry as a 401 mid-request.
    private static readonly TimeSpan ExpiryMargin = TimeSpan.FromMinutes(2);

    // WHOOP kills the old refresh token the instant it issues a new one, so two
    // refreshes racing would leave one caller holding a token the vault no
    // longer knows about and the vault holding one that caller never saw. One
    // at a time per instance; the app runs at maximum_instance_count = 1, so
    // that is the whole story.
    private readonly SemaphoreSlim gate = new(1, 1);

    private string? accessToken;
    private DateTimeOffset accessTokenExpiresAt;
    private IReadOnlyList<string> grantedScopes = [];

    /// <summary>
    /// The consent URL to send a browser to. The state is signed with the
    /// client secret so <see cref="CompleteAuthorizationAsync"/> can verify on
    /// the way back that this app is what started the flow.
    /// </summary>
    public async Task<string> BuildAuthorizationUrlAsync(CancellationToken cancellationToken)
    {
        var clientSecret = await secrets.GetClientSecretAsync(cancellationToken);
        var state = WhoopOAuthState.Create(clientSecret, DateTimeOffset.UtcNow);

        var query = HttpUtility.ParseQueryString(string.Empty);
        query["client_id"] = options.ClientId;
        query["redirect_uri"] = options.RedirectUri;
        query["response_type"] = "code";
        query["scope"] = options.Scopes;
        query["state"] = state;

        return $"{AuthorizeEndpoint}?{query}";
    }

    public async Task<bool> ValidateStateAsync(string? state, CancellationToken cancellationToken)
    {
        var clientSecret = await secrets.GetClientSecretAsync(cancellationToken);
        return WhoopOAuthState.Validate(state, clientSecret, DateTimeOffset.UtcNow);
    }

    /// <summary>
    /// Trades the authorization code from the callback for the first token
    /// pair, seeding the vault. This is the only way a usable refresh token
    /// gets there — the refresh grant can renew one but cannot create one.
    /// </summary>
    public async Task<WhoopTokenResult> CompleteAuthorizationAsync(string code, CancellationToken cancellationToken)
    {
        var clientSecret = await secrets.GetClientSecretAsync(cancellationToken);

        var form = new Dictionary<string, string>
        {
            ["grant_type"] = "authorization_code",
            ["code"] = code,
            ["client_id"] = options.ClientId,
            ["client_secret"] = clientSecret,
            ["redirect_uri"] = options.RedirectUri,
        };

        await gate.WaitAsync(cancellationToken);
        try
        {
            return await ExchangeAsync(form, "authorization_code", cancellationToken);
        }
        finally
        {
            gate.Release();
        }
    }

    /// <summary>
    /// Spends the stored refresh token for a new token pair and writes the
    /// replacement back to the vault.
    /// </summary>
    public async Task<WhoopTokenResult> RefreshAsync(CancellationToken cancellationToken)
    {
        await gate.WaitAsync(cancellationToken);
        try
        {
            return await RefreshCoreAsync(cancellationToken);
        }
        finally
        {
            gate.Release();
        }
    }

    /// <summary>
    /// A valid access token, refreshing only when the cached one is gone or
    /// about to expire.
    /// </summary>
    public async Task<string> GetAccessTokenAsync(CancellationToken cancellationToken)
    {
        await gate.WaitAsync(cancellationToken);
        try
        {
            if (accessToken is not null && DateTimeOffset.UtcNow < accessTokenExpiresAt - ExpiryMargin)
            {
                return accessToken;
            }

            await RefreshCoreAsync(cancellationToken);
            return accessToken!;
        }
        finally
        {
            gate.Release();
        }
    }

    public IReadOnlyList<string> GrantedScopes => grantedScopes;

    public async Task<WhoopProfile> GetProfileAsync(CancellationToken cancellationToken) =>
        await GetAsync<WhoopProfile>("/v2/user/profile/basic", cancellationToken);

    /// <summary>
    /// The account's most recent workout, or null when there is not one.
    ///
    /// WHOOP returns every collection sorted by start time descending, so a
    /// page of one is the whole query: the first record is the latest workout,
    /// finished or still in progress.
    /// </summary>
    public async Task<JsonElement?> GetLatestWorkoutAsync(CancellationToken cancellationToken)
    {
        var page = await GetPageAsync(WhoopCollection.Workout, 1, null, null, cancellationToken);

        return page.Records.Count > 0 ? page.Records[0] : null;
    }

    /// <summary>
    /// One page of a WHOOP collection, oldest-bounded by <paramref name="start"/>
    /// and continued by <paramref name="nextToken"/>.
    ///
    /// Records come back as raw JSON rather than typed models on purpose. The
    /// members of a score vary by sport and the object is absent altogether
    /// while scoring is pending, the four collections have four different
    /// record shapes, and whatever WHOOP adds later should reach storage
    /// without a change here.
    ///
    /// Paging with no <paramref name="start"/> walks the whole history newest
    /// first, which is what the backfill relies on: the most useful records are
    /// stored first, and an interrupted backfill has still made progress.
    /// </summary>
    public async Task<WhoopPage> GetPageAsync(
        WhoopCollection collection,
        int limit,
        DateTimeOffset? start,
        string? nextToken,
        CancellationToken cancellationToken)
    {
        var query = HttpUtility.ParseQueryString(string.Empty);

        // WHOOP caps limit at 25 and answers a larger one with a 400.
        query["limit"] = Math.Clamp(limit, 1, MaxPageSize).ToString(CultureInfo.InvariantCulture);

        if (start is { } from)
        {
            query["start"] = from.UtcDateTime.ToString("o", CultureInfo.InvariantCulture);
        }

        if (nextToken is { Length: > 0 })
        {
            query["nextToken"] = nextToken;
        }

        using var page = await GetAsync<JsonDocument>($"{collection.Path}?{query}", cancellationToken);

        var root = page.RootElement;

        // Checked rather than assumed: TryGetProperty throws on anything that
        // is not a JSON object, so a body that was not the expected envelope
        // would surface as an unhandled exception rather than an empty page.
        if (root.ValueKind != JsonValueKind.Object)
        {
            return WhoopPage.Empty;
        }

        var records = new List<JsonElement>();
        if (root.TryGetProperty("records", out var array) && array.ValueKind == JsonValueKind.Array)
        {
            foreach (var record in array.EnumerateArray())
            {
                // Clone detaches each record from the document disposed above;
                // without it the caller would be reading freed memory.
                records.Add(record.Clone());
            }
        }

        // An absent or null next_token is WHOOP saying this was the last page.
        var token = root.TryGetProperty("next_token", out var next) && next.ValueKind == JsonValueKind.String
            ? next.GetString()
            : null;

        return new WhoopPage { Records = records, NextToken = token };
    }

    /// <summary>
    /// A GET against the WHOOP data API with the current access token. A 401
    /// buys exactly one retry on a freshly refreshed token: WHOOP can revoke an
    /// access token before its stated expiry, and that is indistinguishable
    /// from an expired one until it is tried.
    /// </summary>
    private async Task<T> GetAsync<T>(string path, CancellationToken cancellationToken)
    {
        var response = await SendAsync(path, await GetAccessTokenAsync(cancellationToken), cancellationToken);

        if (response.StatusCode == HttpStatusCode.Unauthorized)
        {
            response.Dispose();
            logger.LogInformation("WHOOP rejected the access token for {Path}; refreshing and retrying once.", path);
            await RefreshAsync(cancellationToken);
            response = await SendAsync(path, await GetAccessTokenAsync(cancellationToken), cancellationToken);
        }

        using (response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(cancellationToken);
                throw new WhoopAuthException(
                    $"WHOOP GET {path} failed with {(int)response.StatusCode}.",
                    response.StatusCode,
                    Truncate(body));
            }

            return await response.Content.ReadFromJsonAsync<T>(cancellationToken)
                ?? throw new WhoopAuthException(
                    $"WHOOP GET {path} returned an empty body.", response.StatusCode);
        }
    }

    private async Task<HttpResponseMessage> SendAsync(
        string path,
        string token,
        CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiBaseUrl}{path}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return await http.SendAsync(request, cancellationToken);
    }

    /// <summary>Caller holds <see cref="gate"/>.</summary>
    private async Task<WhoopTokenResult> RefreshCoreAsync(CancellationToken cancellationToken)
    {
        var clientSecret = await secrets.GetClientSecretAsync(cancellationToken);
        var refreshToken = await secrets.GetRefreshTokenAsync(cancellationToken);

        var form = new Dictionary<string, string>
        {
            ["grant_type"] = "refresh_token",
            ["refresh_token"] = refreshToken,
            ["client_id"] = options.ClientId,
            ["client_secret"] = clientSecret,

            // WHOOP only returns a replacement refresh token when offline is
            // asked for again; without it this refresh would be the last one.
            ["scope"] = "offline",
        };

        return await ExchangeAsync(form, "refresh_token", cancellationToken);
    }

    /// <summary>Caller holds <see cref="gate"/>.</summary>
    private async Task<WhoopTokenResult> ExchangeAsync(
        Dictionary<string, string> form,
        string grantType,
        CancellationToken cancellationToken)
    {
        using var content = new FormUrlEncodedContent(form);
        using var response = await http.PostAsync(TokenEndpoint, content, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(cancellationToken);

            // The body is WHOOP's error description ("invalid_grant" and such);
            // the request carried the secrets, the response does not.
            logger.LogError(
                "WHOOP {GrantType} grant failed: {StatusCode} {Body}",
                grantType,
                (int)response.StatusCode,
                Truncate(body));

            throw new WhoopAuthException(
                $"WHOOP {grantType} grant failed with {(int)response.StatusCode}.",
                response.StatusCode,
                Truncate(body));
        }

        WhoopTokenResponse token;
        try
        {
            token = await response.Content.ReadFromJsonAsync<WhoopTokenResponse>(cancellationToken)
                ?? throw new WhoopAuthException(
                    "WHOOP token endpoint returned an empty body.", response.StatusCode);
        }
        catch (JsonException ex)
        {
            throw new WhoopAuthException(
                $"WHOOP token endpoint returned an unreadable body: {ex.Message}", response.StatusCode);
        }

        // Persist before anything else can fail. The token that was just spent
        // is already dead at WHOOP's end, so a replacement that does not reach
        // the vault strands the integration until someone re-authorizes.
        var stored = false;
        if (token.RefreshToken is { Length: > 0 } rotated)
        {
            try
            {
                await secrets.SetRefreshTokenAsync(rotated, cancellationToken);
                stored = true;
            }
            catch (Exception ex)
            {
                logger.LogCritical(
                    ex,
                    "WHOOP returned a rotated refresh token but writing Key Vault secret "
                    + "'{SecretName}' failed. The previous refresh token is already invalid; "
                    + "re-run /api/whoop/authorize to recover.",
                    WhoopSecretStore.RefreshTokenName);
                throw;
            }
        }
        else
        {
            logger.LogWarning(
                "WHOOP {GrantType} grant returned no refresh_token; the stored one may no longer be valid.",
                grantType);
        }

        accessToken = token.AccessToken;
        accessTokenExpiresAt = DateTimeOffset.UtcNow.AddSeconds(token.ExpiresIn);
        grantedScopes = token.Scope?.Split(' ', StringSplitOptions.RemoveEmptyEntries) ?? [];

        logger.LogInformation(
            "WHOOP {GrantType} grant succeeded; access token valid until {ExpiresAt:o}, scopes {Scopes}.",
            grantType,
            accessTokenExpiresAt,
            string.Join(' ', grantedScopes));

        return new WhoopTokenResult
        {
            ExpiresAt = accessTokenExpiresAt,
            Scopes = grantedScopes,
            RefreshTokenStored = stored,
        };
    }

    private static string Truncate(string value) =>
        value.Length <= 512 ? value : value[..512];
}
