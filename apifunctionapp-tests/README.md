# GymStore integration tests

These tests run `GymStore` against a real Cosmos endpoint, because what they
check only shows up there: whether a transactional batch is atomic, whether a
filter predicate refuses a retried submit, and whether an ETag refuses a write
that raced a delete. Each test gets its own `/objectId` partition in one
throwaway container. The container uses the same opt-in indexing policy as
`terraform/db.tf`.

If `GYM_TEST_COSMOS_ENDPOINT` is not set, every test reports as skipped, so a
plain `dotnet test` stays green on a machine with no emulator.

## Running them

```sh
docker run -d --name cosmos -p 8081:8081 \
  mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:vnext-preview

GYM_TEST_COSMOS_ENDPOINT=http://localhost:8081 dotnet test apifunctionapp-tests
```

The emulator's well-known key is the default. To use a real account, set
`GYM_TEST_COSMOS_KEY` to its key.

## Racing writes

The race tests (a delete racing a set, a backfill racing a Start) need another
write to land between a read and the batch that follows it. `Interceptor` is a
Cosmos `RequestHandler` in the test client's pipeline. It runs that competing
write just before the next matching request goes out, so the production code
needs no test hooks.
