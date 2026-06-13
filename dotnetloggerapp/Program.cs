using Azure.Identity;
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Azure.Functions.Worker.OpenTelemetry;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using NygDev.logtest;
using OpenTelemetry;
using OpenTelemetry.Resources;

var builder = FunctionsApplication.CreateBuilder(args);
builder.ConfigureFunctionsWebApplication();

// Export host + worker telemetry to Application Insights via OpenTelemetry.
// The host side is enabled by "telemetryMode": "OpenTelemetry" in host.json;
// this wires up the isolated worker. The Azure Monitor exporter reads the
// APPLICATIONINSIGHTS_CONNECTION_STRING app setting automatically.
builder.Services.AddOpenTelemetry()
    .UseFunctionsWorkerDefaults()
    // Emit the worker's outgoing Cosmos DB calls as dependency telemetry. Without an
    // edge to depend on, the Application Map has nothing to draw. (Cosmos tracing also
    // has to be opted in on the CosmosClient itself — see below.)
    .WithTracing(tracing => tracing.AddSource("Azure.Cosmos.Operation"))
    .UseAzureMonitorExporter()
    // Cloud role name is the label under each node on the Application Map. The bare
    // exporter adds no resource detectors, so without this the worker reports as
    // "unknown_service" and its telemetry never merges with the host's request node.
    // Match the function app name so host (requests) and worker (dependencies) collapse
    // into a single node. Set AFTER the exporter so these win over any defaults.
    .ConfigureResource(resource => resource.AddAttributes(new Dictionary<string, object>
    {
        ["service.name"] = Environment.GetEnvironmentVariable("WEBSITE_SITE_NAME") ?? "func-nygdev-logger",
        ["service.instance.id"] = Environment.GetEnvironmentVariable("WEBSITE_INSTANCE_ID") ?? Environment.MachineName,
    }));

builder.UseMiddleware<JwtAuthMiddleware>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// Keep JWT claim names as-is ("oid", "tid", "scp" — not their long URI forms).
// PostConfigure runs after MIW's own setup, so this is the final say.
builder.Services.PostConfigure<JwtBearerOptions>(
    JwtBearerDefaults.AuthenticationScheme,
    options => options.MapInboundClaims = false);

builder.Services.AddSingleton(_ =>
{
    var endpoint = Environment.GetEnvironmentVariable("CosmosDb__AccountEndpoint")
        ?? throw new InvalidOperationException("CosmosDb__AccountEndpoint is not configured");
    return new CosmosClient(endpoint, new DefaultAzureCredential(), new CosmosClientOptions
    {
        // Distributed tracing is off by default; turning it on makes the SDK emit
        // Activities on the "Azure.Cosmos.Operation" source we subscribed to above,
        // which become dependency telemetry and the Cosmos node on the Application Map.
        CosmosClientTelemetryOptions = new CosmosClientTelemetryOptions
        {
            DisableDistributedTracing = false,
        },
    });
});

builder.Build().Run();
