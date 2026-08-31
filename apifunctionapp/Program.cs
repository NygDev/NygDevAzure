using ApiFunctionApp.Running;
using ApiFunctionApp.Whoop;
using Azure.Core;
using Azure.Identity;
using Azure.Monitor.OpenTelemetry.Exporter;
using Azure.Storage.Blobs;
using Azure.Security.KeyVault.Secrets;
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
// Reads the workouts the sync stored out of Cosmos, and publishes the charts
// built from them as a JSON blob on the CDN account. No WHOOP credentials
// anywhere in it, so nothing here needs the lazy treatment the WHOOP client
// gets — and a factory registration is only run on first resolve anyway, so a
// checkout without DASHBOARD_BLOB_URL fails the dashboard rather than the
// worker.
// ---------------------------------------------------------------------------
builder.Services.AddSingleton(provider =>
{
    var url = Environment.GetEnvironmentVariable("DASHBOARD_BLOB_URL")
        ?? throw new InvalidOperationException(
            "DASHBOARD_BLOB_URL is not configured; terraform sets it on the function app.");

    // The whole blob URI in one setting, so the account, container and file
    // name are terraform's to decide and this knows only where to put the
    // file. Authenticated with the same managed identity as everything else —
    // the app holds no storage key, and its role assignment is scoped to that
    // one container.
    return new BlobClient(new Uri(url), provider.GetRequiredService<TokenCredential>());
});

builder.Services.AddSingleton<RunningWorkoutStore>();
builder.Services.AddSingleton<RunningDashboardStore>();
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
