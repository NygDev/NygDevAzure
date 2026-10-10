using System.Net;
using System.Text;
using Microsoft.Azure.Cosmos;
using Xunit;

namespace ApiFunctionApp.Tests;

/// <summary>
/// A fact that only runs when there is a Cosmos endpoint to run it against.
/// Without one it is reported as skipped rather than failed, so a plain
/// <c>dotnet test</c> on a machine with no emulator stays green.
/// </summary>
public sealed class CosmosFactAttribute : FactAttribute
{
    public CosmosFactAttribute()
    {
        if (string.IsNullOrEmpty(CosmosFixture.Endpoint))
        {
            Skip = "Set GYM_TEST_COSMOS_ENDPOINT to a Cosmos endpoint (the emulator) to run this.";
        }
    }
}

/// <summary>
/// One container for the whole run, shaped like db/gym: partitioned on
/// /objectId, with the same opt-in indexing policy terraform/db.tf declares.
/// Every test works in a partition of its own, so they share the container
/// without seeing each other.
/// </summary>
public sealed class CosmosFixture : IAsyncLifetime
{
    /// <summary>
    /// The emulator's published key — the same constant in every copy of it,
    /// and not a secret. A real account's key goes in GYM_TEST_COSMOS_KEY.
    /// </summary>
    private const string EmulatorKey =
        "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

    public static string? Endpoint => Environment.GetEnvironmentVariable("GYM_TEST_COSMOS_ENDPOINT");

    private CosmosClient? client;
    private Database? database;

    public Interceptor Interceptor { get; } = new();

    public Container Container { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        if (string.IsNullOrEmpty(Endpoint))
        {
            return;
        }

        var options = new CosmosClientOptions
        {
            // Gateway, as Program.cs configures the real client, and pinned to
            // the endpoint given — the emulator advertises addresses a
            // container cannot always reach.
            ConnectionMode = ConnectionMode.Gateway,
            LimitToEndpoint = true,
            EnableContentResponseOnWrite = false,
            CustomHandlers = { Interceptor },
        };

        if (new Uri(Endpoint).IsLoopback)
        {
            // The classic emulator serves HTTPS on a self-signed certificate.
            // Only ever for a loopback endpoint.
            options.HttpClientFactory = () => new HttpClient(new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator,
            });
        }

        client = new CosmosClient(
            Endpoint,
            Environment.GetEnvironmentVariable("GYM_TEST_COSMOS_KEY") ?? EmulatorKey,
            options);

        database = (await client.CreateDatabaseIfNotExistsAsync("gymtests")).Database;

        var properties = new ContainerProperties($"gym-{Guid.NewGuid():N}", "/objectId")
        {
            IndexingPolicy = new IndexingPolicy
            {
                IndexingMode = IndexingMode.Consistent,
                IncludedPaths = { new IncludedPath { Path = "/type/?" }, new IncludedPath { Path = "/mesoId/?" } },
                ExcludedPaths = { new ExcludedPath { Path = "/*" } },
            },
        };

        Container = (await database.CreateContainerAsync(properties)).Container;
    }

    public async Task DisposeAsync()
    {
        if (Container is not null)
        {
            await Container.DeleteContainerAsync();
        }

        client?.Dispose();
    }

    /// <summary>
    /// Writes a raw document, for the shapes this app no longer writes — a
    /// block from before the counters, most of all.
    /// </summary>
    public async Task UpsertRawAsync(string objectId, string json)
    {
        using var stream = new MemoryStream(Encoding.UTF8.GetBytes(json));
        using var response = await Container.UpsertItemStreamAsync(stream, new PartitionKey(objectId));

        Assert.True(response.IsSuccessStatusCode, $"Writing a raw document answered {response.StatusCode}.");
    }

    public async Task<string?> ReadRawAsync(string objectId, string id)
    {
        using var response = await Container.ReadItemStreamAsync(id, new PartitionKey(objectId));

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        using var reader = new StreamReader(response.Content);

        return await reader.ReadToEndAsync();
    }
}

/// <summary>
/// A seam in the client's pipeline for the race tests: run something just
/// before the next request that matches, or answer it without sending it.
///
/// Every hook is one-shot and is taken off before it runs, so a hook that
/// writes through the same client cannot trigger itself.
/// </summary>
public sealed class Interceptor : RequestHandler
{
    private readonly object gate = new();
    private readonly List<(Func<RequestMessage, bool> Matches, Func<Task<ResponseMessage?>> Run)> hooks = [];

    public static bool IsBatch(RequestMessage request) =>
        string.Equals(request.Headers["x-ms-cosmos-is-batch-request"], "True", StringComparison.OrdinalIgnoreCase);

    public static bool IsPatch(RequestMessage request) => request.Method == HttpMethod.Patch;

    /// <summary>Runs <paramref name="write"/> before the next matching request goes out.</summary>
    public void Before(Func<RequestMessage, bool> matches, Func<Task> write) =>
        Add(matches, async () =>
        {
            await write();
            return null;
        });

    /// <summary>Answers the next matching request with <paramref name="status"/>, unsent.</summary>
    public void Fail(Func<RequestMessage, bool> matches, HttpStatusCode status) =>
        Add(matches, () => Task.FromResult<ResponseMessage?>(new ResponseMessage(status)));

    public void Clear()
    {
        lock (gate)
        {
            hooks.Clear();
        }
    }

    public override async Task<ResponseMessage> SendAsync(RequestMessage request, CancellationToken cancellationToken)
    {
        Func<Task<ResponseMessage?>>? run = null;

        lock (gate)
        {
            var index = hooks.FindIndex(hook => hook.Matches(request));

            if (index >= 0)
            {
                run = hooks[index].Run;
                hooks.RemoveAt(index);
            }
        }

        if (run is not null && await run() is { } answer)
        {
            return answer;
        }

        return await base.SendAsync(request, cancellationToken);
    }

    private void Add(Func<RequestMessage, bool> matches, Func<Task<ResponseMessage?>> run)
    {
        lock (gate)
        {
            hooks.Add((matches, run));
        }
    }
}
