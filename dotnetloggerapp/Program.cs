using Azure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;

var builder = FunctionsApplication.CreateBuilder(args);
builder.ConfigureFunctionsWebApplication();

// Validate inbound Entra ID JWTs against this app registration.
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddAuthorization();

builder.Services.AddSingleton(_ =>
{
    var endpoint = Environment.GetEnvironmentVariable("CosmosDb__AccountEndpoint")
        ?? throw new InvalidOperationException("CosmosDb__AccountEndpoint is not configured");
    return new CosmosClient(endpoint, new DefaultAzureCredential());
});

builder.Build().Run();
