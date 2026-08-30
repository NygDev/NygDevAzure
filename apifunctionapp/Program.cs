using ApiFunctionApp.Running;
using ApiFunctionApp.Whoop;
using Azure.Core;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

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

// The one container the app uses, resolved once. GetContainer builds a fresh
// proxy on every call and a backfill would ask for one per record written, so
// the names live here — the single place that knows them — rather than in each
// store that needs one. Both are fixed by terraform, in terraform/db.tf.
builder.Services.AddSingleton(provider =>
    provider.GetRequiredService<CosmosClient>().GetContainer("db", "primary"));

// ---------------------------------------------------------------------------
// WHOOP
//
// Every registration below is a singleton resolved lazily, on the first WHOOP
// request. That matters: WHOOP_CLIENT_ID and friends are missing in a local
// checkout without them, and eager construction would take the whole worker
// down rather than failing the endpoints that need the configuration.
// ---------------------------------------------------------------------------
builder.Services.AddSingleton(_ => WhoopOptions.FromEnvironment());

builder.Services.AddSingleton(provider => new SecretClient(
    provider.GetRequiredService<WhoopOptions>().KeyVaultUri,
    provider.GetRequiredService<TokenCredential>()));

builder.Services.AddSingleton<WhoopSecretStore>();

// Cosmos-side WHOOP storage and the sync loop over it. Neither reads the WHOOP
// app settings, so unlike the client below they are safe to construct eagerly.
builder.Services.AddSingleton<WhoopStore>();
builder.Services.AddSingleton<WhoopSyncRunner>();

// ---------------------------------------------------------------------------
// Running analytics
//
// Reads the workouts the sync stored and writes the dashboard document built
// from them. Cosmos on both sides and no WHOOP credentials anywhere in it, so
// nothing here needs the lazy treatment the WHOOP client gets.
// ---------------------------------------------------------------------------
builder.Services.AddSingleton<RunningStore>();
builder.Services.AddSingleton<RunningDashboardBuilder>();

// Lazy, and injected as Lazy into the endpoints. Constructing the client reads
// the app settings, and the worker builds a function's constructor arguments
// before it invokes the function — so a configuration error thrown here would
// land where no catch of ours can reach it and go out as a 500 with an empty
// body. Deferring it to the first .Value inside the endpoint is what lets
// WhoopEndpoint answer with the name of the missing setting instead.
builder.Services.AddSingleton(provider => new Lazy<WhoopClient>(() => new WhoopClient(
    // One HttpClient for the app's lifetime, so connections to WHOOP are
    // reused across invocations. PooledConnectionLifetime is what keeps that
    // from pinning a stale DNS answer forever — the connection is retired on a
    // timer and the next one re-resolves.
    new HttpClient(new SocketsHttpHandler
    {
        PooledConnectionLifetime = TimeSpan.FromMinutes(15),
    })
    {
        Timeout = TimeSpan.FromSeconds(30),
    },
    provider.GetRequiredService<WhoopOptions>(),
    provider.GetRequiredService<WhoopSecretStore>(),
    provider.GetRequiredService<ILogger<WhoopClient>>())));

builder.Build().Run();
