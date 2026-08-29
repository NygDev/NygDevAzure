using Azure.Identity;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

// One CosmosClient for the lifetime of the host — it owns the connection pool
// and the Entra token cache, so a per-request client would re-authenticate on
// every call. The account has local_authentication_disabled, so the app's
// managed identity is the only way in.
builder.Services.AddSingleton(_ =>
{
    var endpoint = Environment.GetEnvironmentVariable("COSMOS_ENDPOINT")
        ?? throw new InvalidOperationException(
            "COSMOS_ENDPOINT is not configured; terraform sets it on the function app.");

    // The app runs on a user-assigned identity, which has to be named: an app
    // can carry several, so the platform won't pick one. Terraform supplies the
    // client id. Left unset locally, where the value is null and
    // DefaultAzureCredential falls through to a developer sign-in instead.
    var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
    {
        ManagedIdentityClientId = Environment.GetEnvironmentVariable("MANAGED_IDENTITY_CLIENT_ID"),
    });

    var options = new CosmosClientOptions
    {
        // Serverless/Flex outbound: gateway mode keeps the app to HTTPS/443
        // rather than the direct-mode TCP port range.
        ConnectionMode = ConnectionMode.Gateway,
    };

    return new CosmosClient(endpoint, credential, options);
});

builder.Build().Run();
