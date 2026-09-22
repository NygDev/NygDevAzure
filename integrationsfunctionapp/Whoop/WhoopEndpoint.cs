using System.Net;
using Azure;
using Azure.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// Shared failure handling for the three WHOOP endpoints.
///
/// Two things can go wrong before a single WHOOP call is made — the app
/// settings are missing, or the vault will not hand over the secrets — and
/// neither is the endpoint being asked to do something unreasonable. Left
/// alone both surface as a 500 with an empty body, which says nothing about
/// which of them it was. So they are caught here and answered in words.
/// </summary>
internal static class WhoopEndpoint
{
    /// <summary>
    /// Runs an endpoint body against the WHOOP client, turning a broken
    /// environment into a response that names what is broken.
    ///
    /// The client arrives as a <see cref="Lazy{T}"/> for exactly this reason:
    /// constructing it reads the app settings, and the worker builds a
    /// function's constructor arguments before it invokes the function, so a
    /// throw there would happen somewhere no catch of ours can reach.
    /// </summary>
    public static async Task<IActionResult> RunAsync(
        Lazy<WhoopClient> whoop,
        ILogger logger,
        Func<WhoopClient, Task<IActionResult>> body)
    {
        WhoopClient client;
        try
        {
            client = whoop.Value;
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "The WHOOP endpoints are not configured on this function app.");

            return Text(
                HttpStatusCode.InternalServerError,
                $"""
                WHOOP is not configured on this function app.

                {ex.Message}

                KEY_VAULT_URI and WHOOP_CLIENT_ID are set by terraform, in
                terraform/consumption.tf. A code deploy does not carry them: if the
                app was published without a matching terraform apply, run the
                Terraform Apply workflow and try again.
                """);
        }

        try
        {
            return await body(client);
        }
        catch (AuthenticationFailedException ex)
        {
            // No token for the vault at all — the identity is missing from the
            // app, or MANAGED_IDENTITY_CLIENT_ID names one the app does not carry.
            logger.LogError(ex, "Could not get a managed identity token for Key Vault.");

            return Text(
                HttpStatusCode.BadGateway,
                $"""
                Could not authenticate to Key Vault as the app's managed identity.

                Check that func-nygdev-api still carries the user-assigned identity
                id-nygdev-api and that MANAGED_IDENTITY_CLIENT_ID matches its client id.

                {ex.Message}
                """);
        }
        catch (RequestFailedException ex)
        {
            // A token, but the vault said no — or the secret is not there.
            logger.LogError(ex, "Key Vault returned {Status} for a WHOOP secret.", ex.Status);

            var hint = ex.Status switch
            {
                403 => "id-nygdev-api needs Key Vault Secrets Officer on the vault — officer "
                    + "rather than a reader role, because the refresh token is written back.",
                404 => $"Both '{WhoopSecretStore.ClientSecretName}' and "
                    + $"'{WhoopSecretStore.RefreshTokenName}' have to exist in the vault.",
                _ => "The vault is reachable but refused the operation.",
            };

            return Text(
                HttpStatusCode.BadGateway,
                $"""
                Key Vault returned {ex.Status} for the WHOOP secrets.

                {hint}

                {ex.Message}
                """);
        }
    }

    public static ContentResult Text(HttpStatusCode status, string body) => new()
    {
        Content = body,
        ContentType = "text/plain; charset=utf-8",
        StatusCode = (int)status,
    };
}
