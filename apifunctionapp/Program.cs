using ApiFunctionApp.Gym;
using Azure.Core;
using Azure.Identity;
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Azure.Functions.Worker.OpenTelemetry;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

// Telemetry leaves the worker as OpenTelemetry. host.json puts the Functions
// host in the same mode, so the host's request per invocation and this
// process's logs and spans arrive as one correlated operation instead of two
// SDKs' worth of separate telemetry.
//
// UseFunctionsWorkerDefaults subscribes the pipeline to the worker's own
// invocation ActivitySource and to the trace context the host propagates,
// which is what parents a function's spans under that request.
//
// The Azure Monitor exporter rather than the Azure.Monitor.OpenTelemetry.
// AspNetCore distro: the distro switches on ASP.NET Core instrumentation, and
// because the host already emits a request for every invocation, each call
// would be reported twice. Its connection string is read from
// APPLICATIONINSIGHTS_CONNECTION_STRING, the same app setting the retired
// Application Insights SDK used, which terraform leaves to the platform.
var telemetry = builder.Services.AddOpenTelemetry()
    .UseFunctionsWorkerDefaults();

// Only when there is somewhere to send it. UseAzureMonitorExporter throws
// "A connection string was not found" if the setting is missing, and it throws
// while the host is still being built — the worker exits with no functions
// indexed and the host reports only a dotnet.exe crash code, which is the
// whole app gone rather than telemetry lost. The setting is always present on
// Azure, where the platform manages it; it is a local checkout that has none,
// and there a run should just come up without an exporter.
if (!string.IsNullOrWhiteSpace(
        Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING")))
{
    telemetry.UseAzureMonitorExporter();
}

// Off by default in the worker, unlike the Application Insights SDK this
// replaces. The scopes are where the invocation id and the function name sit,
// so without this a log line arrives with no way back to the call that wrote
// it.
builder.Logging.AddOpenTelemetry(options => options.IncludeScopes = true);

// One credential for every Azure client in the app. It caches tokens per
// scope, so sharing it means Cosmos and Key Vault each authenticate once per
// token lifetime rather than once per client.
//
// The app runs on a user-assigned identity, which has to be named: an app can
// carry several, so the platform won't pick one. Terraform supplies the client
// id. Left unset locally, where the value is null and DefaultAzureCredential
// falls through to a developer sign-in instead.
builder.Services.AddSingleton<TokenCredential>(_ =>
    new DefaultAzureCredential(new DefaultAzureCredentialOptions
    {
        ManagedIdentityClientId = Environment.GetEnvironmentVariable("MANAGED_IDENTITY_CLIENT_ID"),
    }));

// One CosmosClient for the lifetime of the host — it owns the connection pool
// and the Entra token cache, so a per-request client would re-authenticate on
// every call. The account has local_authentication_disabled, so the app's
// managed identity is the only way in.
builder.Services.AddSingleton(provider =>
{
    var endpoint = Environment.GetEnvironmentVariable("COSMOS_ENDPOINT")
        ?? throw new InvalidOperationException(
            "COSMOS_ENDPOINT is not configured; terraform sets it on the function app.");

    var options = new CosmosClientOptions
    {
        // Serverless/Flex outbound: gateway mode keeps the app to HTTPS/443
        // rather than the direct-mode TCP port range.
        ConnectionMode = ConnectionMode.Gateway,

        // Every write this app makes is an upsert whose response body is
        // thrown away. Off, Cosmos acknowledges with headers alone instead of
        // echoing the document back — which on a backfill is the whole synced
        // payload travelling a second time, for nothing.
        EnableContentResponseOnWrite = false,
    };

    return new CosmosClient(endpoint, provider.GetRequiredService<TokenCredential>(), options);
});

// ---------------------------------------------------------------------------
// Gym logger — the whole of this app, since WHOOP, the GPS spool and the
// running dashboard moved to func-nygdev-integrations.
//
// db/gym holds one user's training block, sessions and sets, partitioned on
// /objectId — the caller's Entra object id off the token Easy Auth validated.
//
// Handed its container explicitly rather than through an unkeyed Container
// registration. There is only one store left to serve, so a registration would
// work, but naming the container at the one place that uses it is what keeps
// db/primary and db/gps — still in this account, no longer this app's — from
// being one resolution-order mistake away.
//
// Nothing to configure and nothing to defer. Both the container and the
// data-plane role assignment that reaches it are terraform's, in
// terraform/db.tf and terraform/consumption.tf — and that grant names this
// container, so the identity cannot reach db/primary or db/gps even by
// mistake.
// ---------------------------------------------------------------------------
builder.Services.AddSingleton(provider => new GymStore(
    provider.GetRequiredService<CosmosClient>().GetContainer("db", "gym")));

builder.Build().Run();
