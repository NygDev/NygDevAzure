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

var builder = FunctionsApplication.CreateBuilder(args);
builder.ConfigureFunctionsWebApplication();

// Export host + worker telemetry to Application Insights via OpenTelemetry.
// The host side is enabled by "telemetryMode": "OpenTelemetry" in host.json;
// this wires up the isolated worker. The Azure Monitor exporter reads the
// APPLICATIONINSIGHTS_CONNECTION_STRING app setting automatically.
builder.Services.AddOpenTelemetry()
    .UseFunctionsWorkerDefaults()
    .UseAzureMonitorExporter();

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
    return new CosmosClient(endpoint, new DefaultAzureCredential());
});

builder.Build().Run();
