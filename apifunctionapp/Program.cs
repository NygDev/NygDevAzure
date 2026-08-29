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
// system-assigned managed identity is the only way in; DefaultAzureCredential
// picks it up in Azure and falls back to a developer login locally.
builder.Services.AddSingleton(_ =>
{
    var endpoint = Environment.GetEnvironmentVariable("COSMOS_ENDPOINT")
        ?? throw new InvalidOperationException(
            "COSMOS_ENDPOINT is not configured; terraform sets it on the function app.");

    var options = new CosmosClientOptions
    {
        // Serverless/Flex outbound: gateway mode keeps the app to HTTPS/443
        // rather than the direct-mode TCP port range.
        ConnectionMode = ConnectionMode.Gateway,
    };

    return new CosmosClient(endpoint, new DefaultAzureCredential(), options);
});

builder.Build().Run();
