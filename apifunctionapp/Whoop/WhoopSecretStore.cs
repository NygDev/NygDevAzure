using Azure.Security.KeyVault.Secrets;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// The two WHOOP secrets in the nygdev Key Vault. The app reaches them as
/// id-nygdev-api, which holds Key Vault Secrets Officer on the vault — the
/// refresh token has to be written back as well as read, so a reader role
/// would not be enough.
/// </summary>
public sealed class WhoopSecretStore(SecretClient secrets)
{
    /// <summary>Static client secret issued with the app registration.</summary>
    public const string ClientSecretName = "whoop-clientsecret";

    /// <summary>
    /// The current refresh token. WHOOP rotates it on every use, so this is
    /// the one piece of mutable state the integration owns; each refresh
    /// writes a new version of this secret.
    /// </summary>
    public const string RefreshTokenName = "whoop-token";

    // The client secret only changes when it is rotated in the developer
    // dashboard, which means a redeploy anyway — so one vault round trip per
    // instance rather than one per token call.
    private string? cachedClientSecret;

    public async Task<string> GetClientSecretAsync(CancellationToken cancellationToken)
    {
        if (cachedClientSecret is not null)
        {
            return cachedClientSecret;
        }

        // Positional arguments, including the null version: SecretClient has
        // two GetSecretAsync overloads and naming the cancellation token lets
        // overload resolution pick the other one.
        var secret = await secrets.GetSecretAsync(ClientSecretName, null, cancellationToken);
        return cachedClientSecret = secret.Value.Value;
    }

    public async Task<string> GetRefreshTokenAsync(CancellationToken cancellationToken)
    {
        var secret = await secrets.GetSecretAsync(RefreshTokenName, null, cancellationToken);
        return secret.Value.Value;
    }

    public async Task SetRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken) =>
        await secrets.SetSecretAsync(RefreshTokenName, refreshToken, cancellationToken);
}
