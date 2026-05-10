using Azure.Identity;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services.AddSingleton(_ =>
{
    var endpoint = Environment.GetEnvironmentVariable("CosmosDb__AccountEndpoint")
        ?? throw new InvalidOperationException("CosmosDb__AccountEndpoint is not configured");
    return new CosmosClient(endpoint, new DefaultAzureCredential());
});

builder.Build().Run();
