namespace ApiFunctionApp.Whoop;

/// <summary>
/// The non-secret half of the WHOOP configuration, read from app settings.
/// The two secrets (client secret, refresh token) never appear here — they
/// live in Key Vault and are fetched through <see cref="WhoopSecretStore"/>.
/// </summary>
public sealed class WhoopOptions
{
    /// <summary>
    /// Every read scope the app will ever want, plus <c>offline</c>.
    ///
    /// <c>offline</c> is what makes WHOOP return a refresh token at all —
    /// without it the grant yields a one-hour access token and nothing to
    /// renew it with. The read scopes are requested up front because scopes
    /// are fixed at consent: adding one later means sending the user back
    /// through the authorization screen, so the cheap move is to ask once.
    ///
    /// Asking for one the app registration does not hold is not a soft failure —
    /// WHOOP refuses the whole authorization request with invalid_scope rather
    /// than dropping the scope it will not grant. Terraform sets WHOOP_SCOPES
    /// from var.whoop_scopes, which is where to narrow the list if the
    /// registration cannot be widened to match; this constant is the fallback
    /// for when nothing sets it.
    /// </summary>
    public const string DefaultScopes =
        "offline read:profile read:body_measurement read:cycles read:recovery read:sleep read:workout";

    public required string ClientId { get; init; }

    /// <summary>
    /// Must match a redirect URL registered on the app in the WHOOP developer
    /// dashboard, character for character — WHOOP compares it on both legs of
    /// the authorization code grant and rejects a mismatch outright.
    /// </summary>
    public required string RedirectUri { get; init; }

    /// <summary>The route <c>WhoopCallback</c> is bound to.</summary>
    public const string CallbackPath = "/api/whoop/callback";

    public required Uri KeyVaultUri { get; init; }

    public required string Scopes { get; init; }

    /// <summary>
    /// Built lazily, on the first WHOOP call rather than at host start, so a
    /// missing setting fails that one endpoint instead of taking the whole
    /// worker down with it.
    /// </summary>
    public static WhoopOptions FromEnvironment() => new()
    {
        ClientId = Required("WHOOP_CLIENT_ID"),
        RedirectUri = ResolveRedirectUri(),
        KeyVaultUri = new Uri(Required("KEY_VAULT_URI")),
        Scopes = Environment.GetEnvironmentVariable("WHOOP_SCOPES") is { Length: > 0 } scopes
            ? scopes
            : DefaultScopes,
    };

    /// <summary>
    /// The callback URL, off the app's own hostname unless something overrides
    /// it.
    ///
    /// Terraform cannot set this: the value contains the function app's
    /// hostname, and an app setting on that same app referring to its own
    /// default_hostname is a dependency cycle. The platform already publishes
    /// the hostname as WEBSITE_HOSTNAME, so the app builds the URL itself and
    /// terraform only exports it — as the whoop_redirect_uri output — for
    /// registering in the WHOOP developer dashboard. WHOOP_REDIRECT_URI stays
    /// available for the case where the two ever diverge, or for running the
    /// flow against a tunnel locally.
    /// </summary>
    private static string ResolveRedirectUri()
    {
        if (Environment.GetEnvironmentVariable("WHOOP_REDIRECT_URI") is { Length: > 0 } configured)
        {
            return configured;
        }

        var hostname = Environment.GetEnvironmentVariable("WEBSITE_HOSTNAME")
            ?? throw new InvalidOperationException(
                "Neither WHOOP_REDIRECT_URI nor WEBSITE_HOSTNAME is set, so the OAuth "
                + "redirect URL cannot be determined. On Azure the platform sets "
                + "WEBSITE_HOSTNAME; running locally, set WHOOP_REDIRECT_URI by hand.");

        return $"https://{hostname}{CallbackPath}";
    }

    private static string Required(string name) =>
        Environment.GetEnvironmentVariable(name) is { Length: > 0 } value
            ? value
            : throw new InvalidOperationException(
                $"{name} is not configured; terraform sets it on the function app.");
}
