using System.Net;
using System.Text.Json;
using Microsoft.Azure.Cosmos;

namespace ApiFunctionApp.Gym;

/// <summary>
/// Everything the gym logger does to db/gym.
///
/// One container, partitioned on /objectId, so every read and every write here
/// is single-partition — nothing in this app fans out, and a user's documents
/// can be written in one <see cref="TransactionalBatch"/>, which is scoped to a
/// single logical partition. The 20 GB partition ceiling is not a constraint
/// worth thinking about: a session document is around 2 KB, so two hundred
/// sessions a year is 400 KB a year.
///
/// The workload is one write path firing far more often than everything else
/// put together — a set-tap, thirty or forty times a session — and reads that
/// are all scoped to one person's current block. So the shape of this class is
/// decided by the set-tap: it is a single patch, with no read in front of it
/// and no read-modify-write anywhere near it.
///
/// The object id every method takes is the caller's, off the validated
/// principal, and is never accepted from a request. See
/// <see cref="GymPrincipal"/> — it is the whole tenancy boundary.
/// </summary>
public sealed class GymStore(Container container)
{
    /// <summary>
    /// Every session in one block, newest first, with the entries needed to add
    /// them up.
    ///
    /// Both filters are on indexed paths — /type and /mesoId, two of the three
    /// in the container's policy — so this seeks rather than scans, and the
    /// sort is served by the range index on /id. That is what the ISO date key
    /// buys: newest-first is a single-property ORDER BY, so no composite index
    /// has to be declared for it.
    ///
    /// <c>c.entries</c> in the projection is the one expensive thing here, and
    /// it is deliberate. Volume and average RPE are derived rather than stored,
    /// and deriving them means pulling the sets — a block is at most 48
    /// documents of about 2 KB in one partition, so it is tens of RU rather
    /// than one. The day that stops being acceptable is the day a stored
    /// <c>totals</c> field is worth its backfill; until then this is the honest
    /// cost of not keeping a second copy of a derivable number.
    ///
    /// EnableScanInQuery is deliberately not set, as on the running dashboard's
    /// reads: a filter on a path the policy does not cover should be refused
    /// outright rather than quietly scan the partition on every call.
    /// </summary>
    private const string SessionsQuery = """
        SELECT c.id, c.week, c.dayIndex, c.status, c.entries
        FROM c
        WHERE c.type = @type AND c.mesoId = @mesoId
        ORDER BY c.id DESC
        """;

    /// <summary>
    /// Every block this user has planned, newest first.
    ///
    /// The sort is on <c>c.id</c> and that is not incidental: a mesocycle id is
    /// a ULID behind a constant prefix, so lexical order is creation order, and
    /// newest-first costs the range index the system already keeps on id. It is
    /// the same trick the session query plays with ISO dates, and the same
    /// reason the data model leaves <c>createdAt</c> off the document.
    /// </summary>
    private const string MesocyclesQuery = """
        SELECT c.id, c.name, c.weeks, c.days
        FROM c
        WHERE c.type = @type
        ORDER BY c.id DESC
        """;

    /// <summary>
    /// Which block every session belongs to, and whether it is finished.
    ///
    /// Two small fields per session and deliberately not a third: the block
    /// list needs counts, and <c>c.entries</c> — the sets, the bulk of the
    /// document — is what makes reading a block expensive. Projecting it here
    /// would make opening the Plan tab cost more than opening a whole block's
    /// History.
    ///
    /// Unfiltered by mesoId on purpose. One query counts every block at once,
    /// where a per-block query would be one round trip per row on a screen that
    /// exists to show all of them.
    ///
    /// Grouped server-side, so what comes back is at most two rows per block
    /// rather than one per session: a user's session count only grows, and
    /// without the GROUP BY the Plan tab would page through every workout ever
    /// logged to count them.
    /// </summary>
    private const string SessionOwnersQuery = """
        SELECT c.mesoId, c.status, COUNT(1) AS sessions
        FROM c
        WHERE c.type = @type
        GROUP BY c.mesoId, c.status
        """;

    /// <summary>
    /// The newest block other than one, for repointing the user after a
    /// delete. TOP 1 on the same id-ordered index the block list uses, so it
    /// costs one small read rather than the whole list plus a session scan.
    /// </summary>
    private const string NewestOtherMesocycleQuery = """
        SELECT TOP 1 c.id
        FROM c
        WHERE c.type = @type AND c.id != @exceptId
        ORDER BY c.id DESC
        """;

    /// <summary>
    /// The ids of one block's sessions, for the cascade behind a block delete.
    ///
    /// Ids alone: this feeds a list of delete operations, so anything else on
    /// the document would be read and thrown away.
    /// </summary>
    private const string SessionIdsQuery = """
        SELECT c.id
        FROM c
        WHERE c.type = @type AND c.mesoId = @mesoId
        """;

    /// <summary>
    /// How many operations go in one transactional batch.
    ///
    /// Cosmos caps a batch at 100, and the cascade below can exceed that — a
    /// block is 48 cells but a cell holds up to ten sessions, so the ceiling is
    /// 480 documents rather than 48.
    /// </summary>
    private const int MaxBatchOperations = 100;

    /// <summary>
    /// How many sessions one calendar date may hold before the API stops
    /// suffixing and says so.
    ///
    /// A genuine two-a-day is real and gets <c>_2</c>. Ten is not a training
    /// day; it is a client that has lost track of the id it was given, and
    /// answering rather than minting an eleventh document is what keeps that
    /// from filling a partition quietly.
    /// </summary>
    private const int MaxSessionsPerDate = 10;

    /// <summary>
    /// The response body is never read on a write. The client is already
    /// configured this way in Program.cs; saying it again here keeps these
    /// writes from depending on that. It saves bandwidth and latency, not RU.
    /// </summary>
    private static readonly ItemRequestOptions WriteOptions = new()
    {
        EnableContentResponseOnWrite = false,
    };

    // -----------------------------------------------------------------------
    // The pointer document
    // -----------------------------------------------------------------------

    /// <summary>
    /// Which block the user is in, in one point read.
    ///
    /// It is the first thing every screen needs, which is the whole reason the
    /// user document exists — <c>user_{objectId}</c> is constructible from the
    /// principal alone, so this costs one RU and no lookup in front of it.
    /// Null means a first run: nobody has planned a block yet.
    /// </summary>
    public async Task<string?> ReadCurrentMesoIdAsync(string objectId, CancellationToken cancellationToken)
    {
        using var document = await ReadDocumentAsync(objectId, GymIds.User(objectId), cancellationToken);

        if (document is null)
        {
            return null;
        }

        return document.RootElement.TryGetProperty("currentMesoId", out var current)
            && current.ValueKind == JsonValueKind.String
                ? current.GetString()
                : null;
    }

    // -----------------------------------------------------------------------
    // Mesocycles
    // -----------------------------------------------------------------------

    public async Task<Mesocycle?> ReadMesocycleAsync(
        string objectId,
        string mesoId,
        CancellationToken cancellationToken)
    {
        using var document = await ReadDocumentAsync(
            objectId,
            GymIds.Mesocycle(mesoId),
            cancellationToken);

        return document is null ? null : Mesocycle.Read(document.RootElement);
    }

    /// <summary>
    /// Writes a new block and points the user at it, in one transaction.
    ///
    /// Both documents are in the same logical partition — the user's — which is
    /// what makes a transactional batch legal here. It matters: the pointer and
    /// the thing it points at going in separately is how a user ends up
    /// current on a block that does not exist, or with a block nothing can
    /// reach. Cosmos applies both or neither.
    /// </summary>
    public async Task<Mesocycle> CreateMesocycleAsync(
        string objectId,
        string name,
        int weeks,
        IReadOnlyList<MesoDay> days,
        CancellationToken cancellationToken)
    {
        var mesoId = GymIds.NewMesocycleId();

        using var meso = SerializeMesocycle(objectId, mesoId, name, weeks, days);
        using var user = SerializeUser(objectId, mesoId);

        var batch = container.CreateTransactionalBatch(new PartitionKey(objectId));
        batch.UpsertItemStream(meso);
        batch.UpsertItemStream(user);

        using var response = await batch.ExecuteAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new CosmosException(
                $"Storing the mesocycle '{name}' and pointing the user at it failed. "
                + response.ErrorMessage,
                response.StatusCode,
                subStatusCode: 0,
                activityId: response.ActivityId,
                requestCharge: response.RequestCharge);
        }

        return new Mesocycle(mesoId, name, weeks, days);
    }

    /// <summary>
    /// Edits the plan in place: any of the name, the number of weeks, and the
    /// day labels.
    ///
    /// Nothing here can orphan a workout. Sessions are keyed on the date they
    /// were logged rather than on their position in the block, so shrinking a
    /// block hides cells rather than invalidating documents — which is the
    /// design's rule, and it is nearly free rather than something this has to
    /// enforce.
    ///
    /// Null means there is no such mesocycle in this user's partition.
    /// Otherwise the block as it now stands — Cosmos echoes the patched
    /// document back when asked, so the endpoint's answer costs no second
    /// read.
    /// </summary>
    public async Task<Mesocycle?> PatchMesocycleAsync(
        string objectId,
        string mesoId,
        string? name,
        int? weeks,
        IReadOnlyList<MesoDay>? days,
        CancellationToken cancellationToken)
    {
        var operations = new List<PatchOperation>(3);

        if (name is not null)
        {
            operations.Add(PatchOperation.Set("/name", name));
        }

        if (weeks is { } count)
        {
            operations.Add(PatchOperation.Set("/weeks", count));
        }

        if (days is not null)
        {
            operations.Add(PatchOperation.Set("/days", DayValues(days)));
        }

        if (operations.Count == 0)
        {
            // Nothing to change is not a failure, and it is also not worth a
            // write. The caller has already been told which fields it may send.
            return await ReadMesocycleAsync(objectId, mesoId, cancellationToken);
        }

        using var response = await container.PatchItemStreamAsync(
            GymIds.Mesocycle(mesoId),
            new PartitionKey(objectId),
            operations,
            new PatchItemRequestOptions { EnableContentResponseOnWrite = true },
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        if (!response.IsSuccessStatusCode)
        {
            throw Failure(response, $"Editing mesocycle {mesoId} failed.");
        }

        using var document = await JsonDocument.ParseAsync(response.Content, cancellationToken: cancellationToken);

        return Mesocycle.Read(document.RootElement);
    }

    /// <summary>
    /// Writes what a day was first trained as onto the day itself — but only
    /// while it plans nothing.
    ///
    /// A block can be created without planning a single exercise: the Plan tab
    /// asks for a name, a length and some day labels, and a day with an empty
    /// plan is ordinary rather than unfinished. What that costs is every later
    /// week of the same day — the logging screen has no target set count to
    /// show, the session opens empty, and the exercises have to be picked
    /// again from scratch. So the first workout logged against an unplanned day
    /// becomes its plan, and every following week is seeded from it.
    ///
    /// The filter predicate is the whole guard, and it is why this needs no
    /// read of its own to be safe: it applies only while the day still plans
    /// nothing, so a plan typed in the Plan tab while a session was open is
    /// never overwritten by the session finishing. A block written before
    /// planning existed has no <c>plan</c> property at all rather than an empty
    /// one, which is why the predicate tests both.
    ///
    /// False means the day was already planned — by hand or by an earlier
    /// session — or the block is gone. Neither is a failure of the submit this
    /// hangs off, which is why it is a bool rather than an exception.
    /// </summary>
    public async Task<bool> CaptureDayPlanAsync(
        string objectId,
        string mesoId,
        int dayIndex,
        IReadOnlyList<PlannedExercise> plan,
        CancellationToken cancellationToken)
    {
        var value = plan
            .Select(exercise => new Dictionary<string, object?>
            {
                ["exerciseName"] = exercise.ExerciseName,
                ["sets"] = exercise.Sets,
            })
            .ToList();

        var options = new PatchItemRequestOptions
        {
            FilterPredicate =
                $"FROM c WHERE (NOT IS_DEFINED(c.days[{dayIndex}].plan)) "
                + $"OR ARRAY_LENGTH(c.days[{dayIndex}].plan) = 0",
            EnableContentResponseOnWrite = false,
        };

        using var response = await container.PatchItemStreamAsync(
            GymIds.Mesocycle(mesoId),
            new PartitionKey(objectId),
            [PatchOperation.Set($"/days/{dayIndex}/plan", value)],
            options,
            cancellationToken);

        if (response.IsSuccessStatusCode)
        {
            return true;
        }

        if (response.StatusCode is HttpStatusCode.PreconditionFailed or HttpStatusCode.NotFound)
        {
            return false;
        }

        throw Failure(response, $"Planning day {dayIndex} of mesocycle {mesoId} from a session failed.");
    }

    /// <summary>
    /// Every block this user has planned, with what is in each.
    ///
    /// Three reads for the whole screen: the pointer, one query for the blocks
    /// and one for the sessions that belong to them. The second is unfiltered
    /// and counts every block in a pass, because the alternative — a count
    /// query per block — is a round trip per row on the one screen guaranteed
    /// to have several.
    ///
    /// A user with no blocks gets an empty list rather than a failure. That is
    /// the same first run <c>ReadCurrentMesoIdAsync</c> answers null for.
    /// </summary>
    public async Task<IReadOnlyList<MesocycleSummary>> ListMesocyclesAsync(
        string objectId,
        CancellationToken cancellationToken)
    {
        var currentMesoId = await ReadCurrentMesoIdAsync(objectId, cancellationToken);

        var blocks = new List<Mesocycle>();

        await RunQueryAsync(
            objectId,
            new QueryDefinition(MesocyclesQuery).WithParameter("@type", GymIds.MesocycleType),
            "Reading this user's mesocycles failed.",
            document => blocks.Add(Mesocycle.Read(document)),
            cancellationToken);

        var total = new Dictionary<string, int>(blocks.Count, StringComparer.Ordinal);
        var submitted = new Dictionary<string, int>(blocks.Count, StringComparer.Ordinal);

        await RunQueryAsync(
            objectId,
            new QueryDefinition(SessionOwnersQuery).WithParameter("@type", GymIds.SessionType),
            "Counting this user's sessions failed.",
            document =>
            {
                var mesoId = GymDocument.String(document, "mesoId");
                var count = GymDocument.Int32(document, "sessions");

                total[mesoId] = total.GetValueOrDefault(mesoId) + count;

                if (GymDocument.String(document, "status") == GymSession.Submitted)
                {
                    submitted[mesoId] = submitted.GetValueOrDefault(mesoId) + count;
                }
            },
            cancellationToken);

        return blocks
            .Select(block => new MesocycleSummary(
                block,
                block.Id == currentMesoId,
                total.GetValueOrDefault(block.Id),
                submitted.GetValueOrDefault(block.Id)))
            .ToArray();
    }

    /// <summary>
    /// Points the user at an existing block.
    ///
    /// The read in front of the write is the whole point of this method rather
    /// than a bare upsert: a pointer naming a block that is not there is the
    /// one state <c>GET /gym/mesocycles/current</c> cannot answer, and it
    /// reports it as <c>dangling_mesocycle</c> — a 500 — because nothing in
    /// this API is supposed to be able to produce it. Checking here is what
    /// keeps that true.
    ///
    /// Null means there is no such block in this user's partition. Otherwise
    /// the block just switched to — the read that guarded the write is the one
    /// the endpoint answers with, so it is not read a second time.
    /// </summary>
    public async Task<Mesocycle?> SwitchCurrentMesocycleAsync(
        string objectId,
        string mesoId,
        CancellationToken cancellationToken)
    {
        var mesocycle = await ReadMesocycleAsync(objectId, mesoId, cancellationToken);

        if (mesocycle is null)
        {
            return null;
        }

        using var user = SerializeUser(objectId, mesoId);

        using var response = await container.UpsertItemStreamAsync(
            user,
            new PartitionKey(objectId),
            WriteOptions,
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw Failure(response, $"Pointing this user at mesocycle {mesoId} failed.");
        }

        return mesocycle;
    }

    /// <summary>
    /// Deletes a block and every session logged in it.
    ///
    /// A cascade rather than a refusal, and that is a choice with a cost: there
    /// is no undo and no soft delete anywhere in this API, so this is the one
    /// call that can destroy training history. It exists because the
    /// alternative — refusing while the block holds anything — makes clearing a
    /// mis-created block a session-by-session chore. The confirmation that
    /// names the count belongs in the front end, and the count comes back from
    /// here so it can be checked against what was actually removed.
    ///
    /// <b>The order is load-bearing.</b> Sessions go first and the block
    /// document last, so an interrupted cascade leaves a block that still lists
    /// and still opens, holding fewer sessions than it did. Removing the block
    /// first would leave its sessions in the partition with nothing pointing at
    /// them — <c>ListSessionsAsync</c> filters on <c>mesoId</c>, so they would
    /// be unreachable and still paid for. Re-running finishes the job either
    /// way, which is what makes this safe to retry.
    ///
    /// It is not one transaction. Cosmos caps a batch at 100 operations and a
    /// block can hold up to 480 sessions — 48 cells, ten sessions to a date —
    /// so this is batches of 100 applied in order. Each batch is atomic; the
    /// sequence is resumable rather than atomic, which the ordering above is
    /// what makes acceptable.
    /// </summary>
    public async Task<MesocycleDeletion> DeleteMesocycleAsync(
        string objectId,
        string mesoId,
        CancellationToken cancellationToken)
    {
        if (await ReadMesocycleAsync(objectId, mesoId, cancellationToken) is null)
        {
            return MesocycleDeletion.NotFound;
        }

        var sessionIds = new List<string>();

        await RunQueryAsync(
            objectId,
            new QueryDefinition(SessionIdsQuery)
                .WithParameter("@type", GymIds.SessionType)
                .WithParameter("@mesoId", mesoId),
            $"Reading the sessions of mesocycle {mesoId} failed.",
            document => sessionIds.Add(GymDocument.String(document, "id")),
            cancellationToken);

        var partition = new PartitionKey(objectId);

        for (var offset = 0; offset < sessionIds.Count; offset += MaxBatchOperations)
        {
            var chunk = sessionIds.Skip(offset).Take(MaxBatchOperations).ToArray();
            var batch = container.CreateTransactionalBatch(partition);

            foreach (var sessionId in chunk)
            {
                batch.DeleteItem(sessionId);
            }

            using var response = await batch.ExecuteAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new CosmosException(
                    $"Deleting {chunk.Length} sessions of mesocycle {mesoId} failed. The block "
                    + "itself is untouched, so nothing is orphaned and the delete can be retried. "
                    + response.ErrorMessage,
                    response.StatusCode,
                    subStatusCode: 0,
                    activityId: response.ActivityId,
                    requestCharge: response.RequestCharge);
            }
        }

        // Deleting the block you are standing in has to leave the pointer
        // somewhere real. The newest remaining block is the least surprising
        // answer — it is the one the list shows first — and when there is none
        // the property comes off entirely, which is the first-run state every
        // screen already handles.
        var currentMesoId = await ReadCurrentMesoIdAsync(objectId, cancellationToken);
        var repointing = currentMesoId == mesoId;
        string? newCurrent = null;

        if (repointing)
        {
            await RunQueryAsync(
                objectId,
                new QueryDefinition(NewestOtherMesocycleQuery)
                    .WithParameter("@type", GymIds.MesocycleType)
                    .WithParameter("@exceptId", GymIds.Mesocycle(mesoId)),
                "Finding the block to repoint the user at failed.",
                document => newCurrent = GymIds.StripMesocyclePrefix(GymDocument.String(document, "id")),
                cancellationToken);
        }

        var final = container.CreateTransactionalBatch(partition);
        final.DeleteItem(GymIds.Mesocycle(mesoId));

        using var pointer = repointing ? SerializeUser(objectId, newCurrent) : null;

        if (pointer is not null)
        {
            final.UpsertItemStream(pointer);
        }

        using var finalResponse = await final.ExecuteAsync(cancellationToken);

        if (!finalResponse.IsSuccessStatusCode)
        {
            throw new CosmosException(
                $"Removing mesocycle {mesoId} failed after its {sessionIds.Count} sessions were "
                + "deleted. The block is still there and still current; retrying the delete "
                + "finishes it. " + finalResponse.ErrorMessage,
                finalResponse.StatusCode,
                subStatusCode: 0,
                activityId: finalResponse.ActivityId,
                requestCharge: finalResponse.RequestCharge);
        }

        return new MesocycleDeletion(true, sessionIds.Count, newCurrent);
    }

    // -----------------------------------------------------------------------
    // Sessions
    // -----------------------------------------------------------------------

    public async Task<GymSession?> ReadSessionAsync(
        string objectId,
        string sessionId,
        CancellationToken cancellationToken)
    {
        using var document = await ReadDocumentAsync(objectId, sessionId, cancellationToken);

        return document is null ? null : GymSession.Read(document.RootElement);
    }

    /// <summary>
    /// Starts a workout, or hands back the one already open for today.
    ///
    /// Create rather than upsert, and the 409 is the interesting half. An
    /// upsert at <c>session_{today}</c> would silently destroy a session
    /// already logged on this date, which is the worse failure the data model
    /// specifically relaxed a rule to avoid — tapping the wrong cell should
    /// produce a duplicate the UI can show and delete, not an overwrite.
    ///
    /// So a collision is resolved by what the existing document is:
    ///
    /// <list type="bullet">
    /// <item>A draft on the same cell is <em>this</em> session, reopened. The
    /// app was backgrounded, or Start was tapped twice. It comes back as-is
    /// with everything already logged in it, which is what makes Start safe to
    /// retry on a bad connection.</item>
    /// <item>Anything else — a submitted session, or a draft on a different day
    /// of the block — is a second workout on the same date, and gets the next
    /// suffix.</item>
    /// </list>
    ///
    /// A null session in the result means the date is full, which is a client
    /// that has lost the id it was given rather than a real training day.
    /// </summary>
    public async Task<SessionCreation> CreateSessionAsync(
        string objectId,
        DateOnly date,
        string mesoId,
        int week,
        int dayIndex,
        IReadOnlyList<SessionEntry> seed,
        CancellationToken cancellationToken)
    {
        var ordinal = 1;

        // Two counters rather than one: the ordinal is which id is being tried,
        // and the attempt count is the loop's own bound. They come apart when a
        // create conflicts and the read that follows finds nothing — a delete
        // landed in between — where the same id is worth trying again but the
        // loop must still be guaranteed to end.
        for (var attempt = 0; attempt < MaxSessionsPerDate * 2 && ordinal <= MaxSessionsPerDate; attempt++)
        {
            var sessionId = GymIds.SessionOnDate(date, ordinal);
            var session = new GymSession(sessionId, mesoId, week, dayIndex, GymSession.Draft, seed);

            using var payload = SerializeSession(objectId, session);
            using var response = await container.CreateItemStreamAsync(
                payload,
                new PartitionKey(objectId),
                WriteOptions,
                cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                return new SessionCreation(session, Resumed: false);
            }

            if (response.StatusCode != HttpStatusCode.Conflict)
            {
                throw Failure(response, $"Starting session {sessionId} failed.");
            }

            var existing = await ReadSessionAsync(objectId, sessionId, cancellationToken);

            if (existing is null)
            {
                // Conflicted a moment ago and gone now. Try the same id again
                // rather than skipping to a suffix nobody asked for.
                continue;
            }

            if (existing.Status == GymSession.Draft
                && existing.MesoId == mesoId
                && existing.Week == week
                && existing.DayIndex == dayIndex)
            {
                // Returned as it stands, seed ignored. A draft already open has
                // whatever the day's plan gave it when it was created, plus
                // whatever has been logged since — re-seeding it would duplicate
                // the planned exercises every time Start was tapped twice.
                return new SessionCreation(existing, Resumed: true);
            }

            ordinal++;
        }

        return new SessionCreation(null, Resumed: false);
    }

    /// <summary>
    /// Every session in a block, for History and the block map — the same query
    /// rendered two different ways.
    /// </summary>
    public async Task<IReadOnlyList<SessionSummary>> ListSessionsAsync(
        string objectId,
        string mesoId,
        CancellationToken cancellationToken)
    {
        var sessions = new List<SessionSummary>();

        await RunQueryAsync(
            objectId,
            new QueryDefinition(SessionsQuery)
                .WithParameter("@type", GymIds.SessionType)
                .WithParameter("@mesoId", mesoId),
            $"Reading the sessions of mesocycle {mesoId} failed.",
            document => sessions.Add(SessionSummary.Read(document)),
            cancellationToken);

        return sessions;
    }

    /// <summary>
    /// Flips a draft to submitted: one patch, on one document.
    ///
    /// That it is this small is the payoff for not denormalising a block map
    /// onto the mesocycle. There is no second document to keep in step, and no
    /// guard needed against a retried submit counting something twice —
    /// <c>set</c> is idempotent, so a resend lands on a value that is already
    /// there.
    /// </summary>
    public async Task<bool> SubmitAsync(
        string objectId,
        string sessionId,
        CancellationToken cancellationToken)
    {
        using var response = await container.PatchItemStreamAsync(
            sessionId,
            new PartitionKey(objectId),
            [PatchOperation.Set("/status", GymSession.Submitted)],
            new PatchItemRequestOptions { EnableContentResponseOnWrite = false },
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return false;
        }

        if (!response.IsSuccessStatusCode)
        {
            throw Failure(response, $"Submitting session {sessionId} failed.");
        }

        return true;
    }

    /// <summary>
    /// Deletes a session outright.
    ///
    /// The one destructive operation in the app, and it exists because the data
    /// model chose duplicates over overwrites: a cell can collect two sessions
    /// logged on different days, so there has to be a way to remove the one
    /// that was a mistake. Nothing else deletes anything.
    /// </summary>
    public async Task<bool> DeleteSessionAsync(
        string objectId,
        string sessionId,
        CancellationToken cancellationToken)
    {
        using var response = await container.DeleteItemStreamAsync(
            sessionId,
            new PartitionKey(objectId),
            WriteOptions,
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return false;
        }

        if (!response.IsSuccessStatusCode)
        {
            throw Failure(response, $"Deleting session {sessionId} failed.");
        }

        return true;
    }

    /// <summary>
    /// Drags one exercise from one position to another.
    ///
    /// Unlike the hot-path appends below, this reads the session first. That
    /// is deliberate: a drag happens once, not thirty times a session, and the
    /// entry being moved carries its sets with it — replaying a client's own
    /// copy of the array back at Cosmos would silently drop a set logged
    /// against it moments earlier by another device. Reading first and writing
    /// the whole document back under an ETag is the same trade
    /// <see cref="DeleteMesocycleAsync"/> makes for a rarer, heavier operation:
    /// an RU or two, for an answer that cannot be wrong.
    ///
    /// <paramref name="exerciseName"/> is what the caller believes sits at
    /// <paramref name="from"/>, and it is how a retry after a lost response is
    /// told apart from a fresh drag without needing an id on the entry itself:
    ///
    /// <list type="bullet">
    /// <item>If the entry at <c>from</c> is still that exercise, the move has
    /// not happened yet — apply it.</item>
    /// <item>Otherwise, if the entry at <c>to</c> is already that exercise,
    /// this exact move already landed — the lost response case — and nothing
    /// is written a second time.</item>
    /// <item>Otherwise the session changed in some other way since the
    /// client's snapshot — an exercise added or removed — and the client is
    /// told to resync rather than have the wrong entry moved.</item>
    /// </list>
    /// </summary>
    public async Task<ReorderOutcome> ReorderEntryAsync(
        string objectId,
        string sessionId,
        int from,
        int to,
        string exerciseName,
        int expectedEntryCount,
        CancellationToken cancellationToken)
    {
        var (session, etag) = await ReadSessionWithETagAsync(objectId, sessionId, cancellationToken);

        if (session is null)
        {
            return new ReorderOutcome(ReorderResult.SessionNotFound, null);
        }

        var entries = session.Entries;

        if (entries.Count != expectedEntryCount || from >= entries.Count || to >= entries.Count)
        {
            return new ReorderOutcome(ReorderResult.Conflict, session);
        }

        if (entries[from].ExerciseName != exerciseName)
        {
            // Not sitting where the caller expects. Either this is the retry
            // of a move that already landed — in which case the exercise is
            // now at `to` — or the session changed underneath it some other
            // way, which is a real conflict either way the check below falls.
            return entries[to].ExerciseName == exerciseName
                ? new ReorderOutcome(ReorderResult.AlreadyApplied, session)
                : new ReorderOutcome(ReorderResult.Conflict, session);
        }

        if (from == to)
        {
            return new ReorderOutcome(ReorderResult.Applied, session);
        }

        var reordered = Reordered(entries, from, to);
        var updated = session with { Entries = reordered };

        using var payload = SerializeSession(objectId, updated);
        using var response = await container.ReplaceItemStreamAsync(
            payload,
            sessionId,
            new PartitionKey(objectId),
            new ItemRequestOptions { IfMatchEtag = etag, EnableContentResponseOnWrite = false },
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.PreconditionFailed)
        {
            // Something else wrote the session between the read above and this
            // write — a set logged mid-drag, most likely. The client's own
            // retry-on-409 path (already needed for the hot-path writes) is
            // what resolves this: re-read, and either the drag still applies
            // or it does not.
            return new ReorderOutcome(ReorderResult.Conflict, null);
        }

        if (!response.IsSuccessStatusCode)
        {
            throw Failure(response, $"Moving entry {from} to {to} in session {sessionId} failed.");
        }

        return new ReorderOutcome(ReorderResult.Applied, updated);
    }

    /// <summary>
    /// Standard array-move semantics: the entry at <paramref name="from"/> is
    /// removed and reinserted at <paramref name="to"/>, so <paramref
    /// name="to"/> is where it lands rather than an entry it swaps with. The
    /// front end's own reorder hook uses the identical convention, so the pair
    /// a drag produces is the pair this expects.
    /// </summary>
    private static IReadOnlyList<SessionEntry> Reordered(
        IReadOnlyList<SessionEntry> entries,
        int from,
        int to)
    {
        var next = entries.ToList();
        var moved = next[from];

        next.RemoveAt(from);
        next.Insert(to, moved);

        return next;
    }

    /// <summary>
    /// Takes an exercise back out of a session, and only while it holds no
    /// sets.
    ///
    /// The emptiness is the point rather than a convenience for the client.
    /// Everywhere else this API refuses to destroy a logged workout — a
    /// re-logged day files a second session rather than overwriting the first —
    /// and an entry with sets against it is a logged workout. So this removes
    /// the thing that was added by mistake and nothing else: an exercise that
    /// was picked, or seeded from the plan, and never lifted.
    ///
    /// Read-then-replace under an ETag, like <see cref="ReorderEntryAsync"/>
    /// and for the same reasons. It happens once or twice a session rather
    /// than thirty times, so it can afford the read; and a guarded blind patch
    /// could not check <em>which</em> exercise is being removed, because a
    /// filter predicate would have to carry the name as a SQL literal with the
    /// user's own text inside it.
    ///
    /// <paramref name="exerciseName"/> is what the caller believes sits at
    /// <paramref name="entryIndex"/>, and it is what tells a retry after a lost
    /// response apart from a request built on a stale copy: one fewer entry
    /// than the caller counted, with that exercise no longer at that index, is
    /// this delete having already landed.
    /// </summary>
    public async Task<RemoveEntryOutcome> RemoveEntryAsync(
        string objectId,
        string sessionId,
        int entryIndex,
        string exerciseName,
        int expectedEntryCount,
        CancellationToken cancellationToken)
    {
        var (session, etag) = await ReadSessionWithETagAsync(objectId, sessionId, cancellationToken);

        if (session is null)
        {
            return new RemoveEntryOutcome(RemoveEntryResult.SessionNotFound, null);
        }

        var entries = session.Entries;
        var stillThere = entryIndex < entries.Count
            && entries[entryIndex].ExerciseName == exerciseName;

        if (!stillThere && entries.Count == expectedEntryCount - 1)
        {
            // One short of what the caller counted, and the exercise it named
            // is not where it was: this delete landed and only the answer was
            // lost. Success, the same as an alreadyRecorded set.
            return new RemoveEntryOutcome(RemoveEntryResult.AlreadyRemoved, session);
        }

        if (!stillThere || entries.Count != expectedEntryCount)
        {
            return new RemoveEntryOutcome(RemoveEntryResult.Conflict, session);
        }

        if (entries[entryIndex].Sets.Count > 0)
        {
            return new RemoveEntryOutcome(RemoveEntryResult.NotEmpty, session);
        }

        var updated = session with
        {
            Entries = entries.Where((_, index) => index != entryIndex).ToArray(),
        };

        using var payload = SerializeSession(objectId, updated);
        using var response = await container.ReplaceItemStreamAsync(
            payload,
            sessionId,
            new PartitionKey(objectId),
            new ItemRequestOptions { IfMatchEtag = etag, EnableContentResponseOnWrite = false },
            cancellationToken);

        if (response.StatusCode == HttpStatusCode.PreconditionFailed)
        {
            // A set was logged against this session between the read and the
            // write — conceivably against this very entry, which is exactly
            // what the emptiness check is there to protect. The client re-reads
            // and decides again.
            return new RemoveEntryOutcome(RemoveEntryResult.Conflict, null);
        }

        if (!response.IsSuccessStatusCode)
        {
            throw Failure(response, $"Removing entry {entryIndex} from session {sessionId} failed.");
        }

        return new RemoveEntryOutcome(RemoveEntryResult.Applied, updated);
    }

    /// <summary>
    /// A point read that also hands back the ETag, for the one write in this
    /// file that goes through optimistic concurrency instead of a guarded
    /// patch.
    /// </summary>
    private async Task<(GymSession? Session, string? ETag)> ReadSessionWithETagAsync(
        string objectId,
        string sessionId,
        CancellationToken cancellationToken)
    {
        using var response = await container.ReadItemStreamAsync(
            sessionId,
            new PartitionKey(objectId),
            cancellationToken: cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return (null, null);
        }

        if (!response.IsSuccessStatusCode)
        {
            throw Failure(response, $"Reading session {sessionId} failed.");
        }

        using var document = await JsonDocument.ParseAsync(response.Content, cancellationToken: cancellationToken);

        return (GymSession.Read(document.RootElement), response.Headers.ETag);
    }

    // -----------------------------------------------------------------------
    // The hot path
    // -----------------------------------------------------------------------

    /// <summary>
    /// Appends an exercise to a session, guarded on how many it already had.
    ///
    /// Same guard as the set append below and for the same reason: the picker
    /// fires this on a tap, over gym wifi, and a retry after a lost response
    /// must not add the exercise twice.
    /// </summary>
    public Task<PatchOutcome> AppendEntryAsync(
        string objectId,
        string sessionId,
        int expectedEntryCount,
        string exerciseName,
        CancellationToken cancellationToken) =>
        PatchGuardedAsync(
            objectId,
            sessionId,
            PatchOperation.Add(
                "/entries/-",
                new Dictionary<string, object?>
                {
                    ["exerciseName"] = exerciseName,
                    ["sets"] = Array.Empty<object>(),
                }),
            $"FROM c WHERE ARRAY_LENGTH(c.entries) = {expectedEntryCount}",
            $"Adding '{exerciseName}' to session {sessionId} failed.",
            session => session.Entries.Count == expectedEntryCount + 1
                && session.Entries[expectedEntryCount].ExerciseName == exerciseName
                    ? PatchOutcome.AlreadyApplied(session.Entries.Count)
                    : PatchOutcome.Conflict(session.Entries.Count),
            cancellationToken);

    /// <summary>
    /// One tap, one patch, no read — the path everything else here is arranged
    /// around.
    ///
    /// <see cref="PatchOperation.Add"/> on <c>/entries/{i}/sets/-</c> appends
    /// server-side, so there is no read RU, no ETag round trip, and no lost
    /// update if two devices are logging the same session.
    ///
    /// <c>add</c> is not idempotent on its own, and the filter predicate is
    /// what makes it safe. The client knows how many sets that entry had before
    /// the tap; if the first attempt did land, the count no longer matches and
    /// Cosmos answers 412 instead of appending a second copy. That is the whole
    /// answer to a lost response on gym wifi — and to offline drafts, since a
    /// queue of set-taps replayed on reconnect is safe by construction rather
    /// than by reconciliation.
    ///
    /// Nothing inside <c>/entries</c> is indexed, so this write is flat in the
    /// number of sets already logged: the last set of a session costs what the
    /// first one did.
    /// </summary>
    public Task<PatchOutcome> AppendSetAsync(
        string objectId,
        string sessionId,
        int entryIndex,
        int expectedSetCount,
        WorkSet set,
        CancellationToken cancellationToken)
    {
        var value = new Dictionary<string, object?>
        {
            ["weightKg"] = set.WeightKg,
            ["reps"] = set.Reps,
        };

        // Written only when it was rated. An absent key and a null read back
        // the same way, and leaving it out keeps a set that carries no RPE from
        // looking like one rated null on purpose.
        if (set.Rpe is { } rpe)
        {
            value["rpe"] = rpe;
        }

        return PatchGuardedAsync(
            objectId,
            sessionId,
            PatchOperation.Add($"/entries/{entryIndex}/sets/-", value),
            $"FROM c WHERE ARRAY_LENGTH(c.entries[{entryIndex}].sets) = {expectedSetCount}",
            $"Logging a set on entry {entryIndex} of session {sessionId} failed.",
            session => ResolveSet(
                session,
                entryIndex,
                landed: sets => sets.Count == expectedSetCount + 1 && sets[expectedSetCount] == set),
            cancellationToken);
    }

    /// <summary>
    /// Removes one set — a mistyped weight, or a set that was never done.
    ///
    /// Guarded the same way as the append, so a retry after a lost response
    /// cannot remove a second set that has since been logged: if the first
    /// attempt landed, the count is one lower than the caller expects and
    /// Cosmos answers 412 rather than removing again.
    /// </summary>
    public Task<PatchOutcome> RemoveSetAsync(
        string objectId,
        string sessionId,
        int entryIndex,
        int setIndex,
        int expectedSetCount,
        CancellationToken cancellationToken) =>
        PatchGuardedAsync(
            objectId,
            sessionId,
            PatchOperation.Remove($"/entries/{entryIndex}/sets/{setIndex}"),
            $"FROM c WHERE ARRAY_LENGTH(c.entries[{entryIndex}].sets) = {expectedSetCount}",
            $"Removing set {setIndex} from entry {entryIndex} of session {sessionId} failed.",
            session => ResolveSet(
                session,
                entryIndex,
                landed: sets => sets.Count == expectedSetCount - 1),
            cancellationToken);

    /// <summary>
    /// One patch under a filter predicate, and the reading of what a 412 meant.
    ///
    /// The predicate makes the write safe to retry; it does not make the answer
    /// self-explanatory. Cosmos says 412 both when the operation already landed
    /// and when the caller's idea of the session is simply wrong — and, because
    /// a predicate over a path that does not exist evaluates to undefined, it
    /// says 412 for an entry index that is out of range too. Those are three
    /// different answers to a client: retry succeeded, resync, and fix your
    /// request.
    ///
    /// So a 412 buys one point read to tell them apart. It costs about an RU
    /// and only happens on the uncommon path — an ordinary tap is the single
    /// patch and nothing else.
    /// </summary>
    private async Task<PatchOutcome> PatchGuardedAsync(
        string objectId,
        string sessionId,
        PatchOperation operation,
        string filterPredicate,
        string failureMessage,
        Func<GymSession, PatchOutcome> resolveConflict,
        CancellationToken cancellationToken)
    {
        var options = new PatchItemRequestOptions
        {
            FilterPredicate = filterPredicate,
            EnableContentResponseOnWrite = false,
        };

        using var response = await container.PatchItemStreamAsync(
            sessionId,
            new PartitionKey(objectId),
            [operation],
            options,
            cancellationToken);

        if (response.IsSuccessStatusCode)
        {
            return PatchOutcome.Applied;
        }

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return PatchOutcome.SessionNotFound;
        }

        if (response.StatusCode != HttpStatusCode.PreconditionFailed)
        {
            throw Failure(response, failureMessage);
        }

        var session = await ReadSessionAsync(objectId, sessionId, cancellationToken);

        return session is null ? PatchOutcome.SessionNotFound : resolveConflict(session);
    }

    /// <summary>
    /// What a 412 on a guard over one entry's sets turned out to mean — with
    /// the extra case that the entry itself may not be there, which a filter
    /// predicate cannot distinguish on its own: a predicate over a path that
    /// does not exist is undefined, and undefined fails the same way a mismatch
    /// does.
    /// </summary>
    private static PatchOutcome ResolveSet(
        GymSession session,
        int entryIndex,
        Func<IReadOnlyList<WorkSet>, bool> landed)
    {
        if (entryIndex >= session.Entries.Count)
        {
            return PatchOutcome.EntryNotFound(session.Entries.Count);
        }

        var sets = session.Entries[entryIndex].Sets;

        return landed(sets)
            ? PatchOutcome.AlreadyApplied(sets.Count)
            : PatchOutcome.Conflict(sets.Count);
    }

    // -----------------------------------------------------------------------
    // Reading and writing raw documents
    // -----------------------------------------------------------------------

    /// <summary>
    /// A point read, or null when there is nothing there. The caller disposes.
    /// </summary>
    /// <summary>
    /// Runs a single-partition query and hands each document to the caller.
    ///
    /// The stream iterator rather than the typed one, for the reason the rest
    /// of this app uses streams: the CosmosClient still serializes with
    /// Newtonsoft by default, and a document read through it would be reshaped
    /// by that serializer's settings on the way past.
    ///
    /// The callback runs inside the page's <c>using</c>, and that is not a
    /// style choice. A JsonElement is a view onto its JsonDocument, so handing
    /// one back out of here — by collecting them into a list, or by yielding —
    /// would hand back a pointer into a buffer that has already gone back to
    /// the pool. Reading what is wanted while the page is alive is what keeps
    /// that from being possible to get wrong.
    /// </summary>
    private async Task RunQueryAsync(
        string objectId,
        QueryDefinition query,
        string failureMessage,
        Action<JsonElement> onDocument,
        CancellationToken cancellationToken)
    {
        var options = new QueryRequestOptions
        {
            PartitionKey = new PartitionKey(objectId),

            // A block is 48 documents at the outside — eight weeks of six days
            // — so one page is usually the whole answer and the iterator below
            // runs once.
            MaxItemCount = 100,
        };

        using var iterator = container.GetItemQueryStreamIterator(query, requestOptions: options);

        while (iterator.HasMoreResults)
        {
            using var response = await iterator.ReadNextAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw Failure(response, failureMessage);
            }

            using var page = await JsonDocument.ParseAsync(
                response.Content,
                cancellationToken: cancellationToken);

            if (!page.RootElement.TryGetProperty("Documents", out var documents)
                || documents.ValueKind != JsonValueKind.Array)
            {
                continue;
            }

            foreach (var document in documents.EnumerateArray())
            {
                onDocument(document);
            }
        }
    }

    private async Task<JsonDocument?> ReadDocumentAsync(
        string objectId,
        string documentId,
        CancellationToken cancellationToken)
    {
        using var response = await container.ReadItemStreamAsync(
            documentId,
            new PartitionKey(objectId),
            cancellationToken: cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        if (!response.IsSuccessStatusCode)
        {
            throw Failure(response, $"Reading {documentId} from db/gym failed.");
        }

        return await JsonDocument.ParseAsync(response.Content, cancellationToken: cancellationToken);
    }

    /// <summary>
    /// The pointer document. One point read answers "which block am I in",
    /// which is the first thing every screen needs, and that is its whole job.
    ///
    /// A null <paramref name="mesoId"/> writes the document without the
    /// property rather than with a null in it, because that is the shape
    /// <see cref="ReadCurrentMesoIdAsync"/> already reads as a first run. It
    /// happens when the last block is deleted, and it puts the user back on the
    /// same empty state they started from instead of a third case.
    /// </summary>
    private static MemoryStream SerializeUser(string objectId, string? mesoId)
    {
        var payload = new MemoryStream();

        using (var writer = new Utf8JsonWriter(payload))
        {
            writer.WriteStartObject();
            writer.WriteString("id", GymIds.User(objectId));
            writer.WriteString("objectId", objectId);
            writer.WriteString("type", GymIds.UserType);

            if (mesoId is not null)
            {
                writer.WriteString("currentMesoId", mesoId);
            }

            writer.WriteEndObject();
        }

        payload.Position = 0;
        return payload;
    }

    private static MemoryStream SerializeMesocycle(
        string objectId,
        string mesoId,
        string name,
        int weeks,
        IReadOnlyList<MesoDay> days)
    {
        var payload = new MemoryStream();

        using (var writer = new Utf8JsonWriter(payload))
        {
            writer.WriteStartObject();
            writer.WriteString("id", GymIds.Mesocycle(mesoId));

            // The partition key has to be on the document as well as on the
            // request — Cosmos rejects a write whose /objectId is missing
            // rather than inferring it from the PartitionKey passed alongside.
            writer.WriteString("objectId", objectId);
            writer.WriteString("type", GymIds.MesocycleType);
            writer.WriteString("name", name);
            writer.WriteNumber("weeks", weeks);

            writer.WriteStartArray("days");

            foreach (var day in days)
            {
                writer.WriteStartObject();
                writer.WriteNumber("dayIndex", day.DayIndex);
                writer.WriteString("label", day.Label);

                writer.WriteStartArray("plan");

                foreach (var exercise in day.Plan)
                {
                    writer.WriteStartObject();
                    writer.WriteString("exerciseName", exercise.ExerciseName);
                    writer.WriteNumber("sets", exercise.Sets);
                    writer.WriteEndObject();
                }

                writer.WriteEndArray();
                writer.WriteEndObject();
            }

            writer.WriteEndArray();
            writer.WriteEndObject();
        }

        payload.Position = 0;
        return payload;
    }

    /// <summary>
    /// A session at Start: eight keys and an empty entries array, which the
    /// patches above then append into.
    /// </summary>
    private static MemoryStream SerializeSession(string objectId, GymSession session)
    {
        var payload = new MemoryStream();

        using (var writer = new Utf8JsonWriter(payload))
        {
            writer.WriteStartObject();
            writer.WriteString("id", session.Id);
            writer.WriteString("objectId", objectId);
            writer.WriteString("type", GymIds.SessionType);
            writer.WriteString("mesoId", session.MesoId);
            writer.WriteNumber("week", session.Week);
            writer.WriteNumber("dayIndex", session.DayIndex);
            writer.WriteString("status", session.Status);

            writer.WriteStartArray("entries");

            foreach (var entry in session.Entries)
            {
                writer.WriteStartObject();
                writer.WriteString("exerciseName", entry.ExerciseName);

                writer.WriteStartArray("sets");

                foreach (var set in entry.Sets)
                {
                    writer.WriteStartObject();
                    writer.WriteNumber("weightKg", set.WeightKg);
                    writer.WriteNumber("reps", set.Reps);

                    if (set.Rpe is { } rpe)
                    {
                        writer.WriteNumber("rpe", rpe);
                    }

                    writer.WriteEndObject();
                }

                writer.WriteEndArray();
                writer.WriteEndObject();
            }

            writer.WriteEndArray();
            writer.WriteEndObject();
        }

        payload.Position = 0;
        return payload;
    }

    /// <summary>
    /// Day labels as the Cosmos SDK will serialize them.
    ///
    /// Dictionaries rather than a record, and this is not a style choice: the
    /// value of a patch operation goes through the CosmosClient's own
    /// serializer, which is still Newtonsoft, so a record would arrive in the
    /// document with its C# property names — <c>DayIndex</c>, <c>Label</c> —
    /// and stop matching everything that reads it. A dictionary's keys are
    /// written literally, so what is spelled here is what is stored.
    /// </summary>
    /// <summary>
    /// The days of a block as a patch value.
    ///
    /// <c>dayIndex</c> is written from the array position rather than copied
    /// off the MesoDay, so the stored index cannot disagree with where the day
    /// actually sits — the same reason the request reader refuses to accept one
    /// from the client.
    /// </summary>
    private static List<Dictionary<string, object?>> DayValues(IReadOnlyList<MesoDay> days) =>
        days
            .Select((day, index) => new Dictionary<string, object?>
            {
                ["dayIndex"] = index,
                ["label"] = day.Label,
                ["plan"] = day.Plan
                    .Select(exercise => new Dictionary<string, object?>
                    {
                        ["exerciseName"] = exercise.ExerciseName,
                        ["sets"] = exercise.Sets,
                    })
                    .ToList(),
            })
            .ToList();

    /// <summary>
    /// Turns a failed stream response into the exception the endpoints answer
    /// for. <see cref="GymEndpoint"/> is what turns it into words.
    /// </summary>
    private static CosmosException Failure(ResponseMessage response, string what) =>
        new(
            $"{what} {response.ErrorMessage}",
            response.StatusCode,
            subStatusCode: 0,
            activityId: response.Headers.ActivityId,
            requestCharge: response.Headers.RequestCharge);
}

/// <summary>
/// What Start did: the session to log into, and whether it was already open.
/// A null session means the date has as many sessions as it is allowed.
/// </summary>
/// <summary>
/// What a block delete removed, and where it left the user.
///
/// <c>NewCurrentMesoId</c> is null both when nothing was repointed — the
/// deleted block was not the current one — and when there is no block left to
/// point at. The endpoint tells those apart from <c>Found</c> and the request
/// itself; nothing downstream needs to.
/// </summary>
public readonly record struct MesocycleDeletion(
    bool Found,
    int SessionsDeleted,
    string? NewCurrentMesoId)
{
    public static MesocycleDeletion NotFound => new(false, 0, null);
}

public readonly record struct SessionCreation(GymSession? Session, bool Resumed);

/// <summary>How a guarded patch ended.</summary>
public enum PatchResult
{
    /// <summary>The operation was applied. The ordinary answer.</summary>
    Applied,

    /// <summary>
    /// A retry of something that already landed. Success as far as the client
    /// is concerned — it means the first attempt got through and only the
    /// response was lost, which is the normal failure on a gym's wifi.
    /// </summary>
    AlreadyApplied,

    /// <summary>
    /// The session is not in the state the caller thought. Neither side is
    /// wrong exactly; the client's copy is stale and needs re-reading.
    /// </summary>
    Conflict,

    /// <summary>No session with that id in this user's partition.</summary>
    SessionNotFound,

    /// <summary>The session exists; that entry index does not.</summary>
    EntryNotFound,
}

/// <summary>
/// A guarded patch's result, with the count the session actually holds — which
/// is what a client needs to resync after a conflict, and what saves it a read
/// of its own.
/// </summary>
public readonly record struct PatchOutcome(PatchResult Result, int Actual)
{
    /// <summary>
    /// Applied carries no count: the caller told the server what the count was
    /// and the guard is what proved it, so the new one is that plus or minus
    /// the operation. Every other outcome carries the count the document
    /// actually holds, because in those the caller's number is the thing that
    /// was wrong.
    /// </summary>
    public static PatchOutcome Applied => new(PatchResult.Applied, 0);

    public static PatchOutcome SessionNotFound => new(PatchResult.SessionNotFound, 0);

    public static PatchOutcome AlreadyApplied(int actual) => new(PatchResult.AlreadyApplied, actual);

    public static PatchOutcome Conflict(int actual) => new(PatchResult.Conflict, actual);

    public static PatchOutcome EntryNotFound(int entryCount) =>
        new(PatchResult.EntryNotFound, entryCount);
}

/// <summary>How a drag on the entry list ended.</summary>
public enum ReorderResult
{
    /// <summary>The move was written. The ordinary answer.</summary>
    Applied,

    /// <summary>
    /// A retry of a move that already landed — the entry named in the request
    /// is already sitting at <c>to</c>. Success, the same as a hot-path
    /// <see cref="PatchResult.AlreadyApplied"/>.
    /// </summary>
    AlreadyApplied,

    /// <summary>
    /// The session does not match what the caller described — a different
    /// entry count, an index out of range, or the named exercise sitting
    /// somewhere the request did not expect. Nothing was written; re-read and
    /// try again.
    /// </summary>
    Conflict,

    /// <summary>No session with that id in this user's partition.</summary>
    SessionNotFound,
}

/// <summary>
/// A reorder's result, with the session as it now stands. <c>Session</c> is
/// null only for <see cref="ReorderResult.SessionNotFound"/> and for a
/// concurrent write the caller must re-read to see past.
/// </summary>
public readonly record struct ReorderOutcome(ReorderResult Result, GymSession? Session);

/// <summary>How taking an exercise out of a session ended.</summary>
public enum RemoveEntryResult
{
    /// <summary>The exercise was removed. The ordinary answer.</summary>
    Applied,

    /// <summary>
    /// A retry of a removal that already landed. Success, the same as a
    /// hot-path <see cref="PatchResult.AlreadyApplied"/>.
    /// </summary>
    AlreadyRemoved,

    /// <summary>
    /// The exercise still has sets logged against it. Not a stale client and
    /// not something a re-read fixes: this API does not delete a logged set as
    /// a side effect of anything, so the sets come off one at a time first.
    /// </summary>
    NotEmpty,

    /// <summary>
    /// The session does not match what the caller described — a different
    /// entry count, or another exercise sitting at that index. Nothing was
    /// written; re-read and decide again.
    /// </summary>
    Conflict,

    /// <summary>No session with that id in this user's partition.</summary>
    SessionNotFound,
}

/// <summary>
/// A removal's result, with the session as it now stands. <c>Session</c> is
/// null for <see cref="RemoveEntryResult.SessionNotFound"/> and for a
/// concurrent write the caller must re-read to see past.
/// </summary>
public readonly record struct RemoveEntryOutcome(RemoveEntryResult Result, GymSession? Session);
