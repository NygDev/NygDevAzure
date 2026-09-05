using System.Text.Json;

namespace ApiFunctionApp.Gym;

/// <summary>
/// The four documents db/gym holds, and the shapes derived from them.
///
/// Four types, one discriminator, and deliberately smaller than the design's
/// entity list — every omission is either derivable from what is stored or was
/// read by nothing, and every one of them can be added and backfilled later
/// without a migration. What is written down is what records a decision the
/// user made, because that is the only kind of field that is gone forever if
/// it is not captured at the time.
///
/// Entries and sets are not documents. Cosmos charges a floor of roughly 5 RU
/// for any write regardless of size, so a set on a document of its own would
/// cost about what the whole session costs — the same arithmetic that packs GPS
/// fixes into segments. A set is never read except as part of its session, and
/// the aggregate is bounded: eight exercises of five sets is around 2 KB,
/// three orders of magnitude under the 2 MB item ceiling.
/// </summary>
internal static class GymLimits
{
    /// <summary>A block is 3–8 weeks, as the design's Plan tab allows.</summary>
    public const int MinWeeks = 3;

    public const int MaxWeeks = 8;

    /// <summary>2–6 workout days in a week, likewise.</summary>
    public const int MinDays = 2;

    public const int MaxDays = 6;

    public const int MaxNameLength = 80;

    public const int MaxLabelLength = 40;

    public const int MaxExerciseNameLength = 80;

    /// <summary>
    /// A cap on entries in one session and sets in one entry.
    ///
    /// Not a rule about training — nobody does sixty exercises — but the bound
    /// that keeps a session document from growing without limit, which is the
    /// one assumption embedding sets inside the session rests on. Hitting
    /// either of these means a client in a retry loop, not a long workout.
    /// </summary>
    public const int MaxEntriesPerSession = 40;

    public const int MaxSetsPerEntry = 60;

    /// <summary>
    /// How many exercises a day may have planned against it.
    ///
    /// Lower than a session's cap on purpose. A plan is written by hand and
    /// read before every workout, so twenty is already past useful; the
    /// session's forty is a bound on a document a client could fill by
    /// accident, and this is a bound on something a person types.
    /// </summary>
    public const int MaxPlannedPerDay = 20;

    /// <summary>
    /// How many day templates one user may have saved.
    ///
    /// The same kind of bound as <c>MaxSessionsPerDate</c> rather than a
    /// judgement about training: fifty named plans is already more than anyone
    /// scrolls, so hitting this means a client saving in a loop, and a partition
    /// filling quietly is what it is here to prevent. Templates are listed in
    /// one unpaged query, so it is also what keeps that query one page.
    /// </summary>
    public const int MaxTemplatesPerUser = 50;

    /// <summary>
    /// Kilograms. The upper bound is past any lift a human has recorded and is
    /// there to catch a unit mistake — pounds sent where kilograms were meant
    /// stays inside it, but a stray multiplication does not.
    /// </summary>
    public const double MaxWeightKg = 1000;

    public const int MaxReps = 200;

    /// <summary>
    /// RPE 5–10 in half steps, matching the design's stepper. Optional rather
    /// than required: a set logged without one is a set, and refusing it would
    /// lose the reps and the weight along with the rating.
    /// </summary>
    public const double MinRpe = 5;

    public const double MaxRpe = 10;
}

/// <summary>One labelled day of the block. Position in the block is
/// <c>dayIndex</c>; the label is what the user called it.</summary>
/// <summary>
/// One exercise a day prescribes, and how much of it.
///
/// A name and a number of sets. Not a weight, and — since reps stopped being
/// planned — not a rep count either. Both are the same mistake: they are what
/// a session discovers, not what a programme decides. A prescribed weight is
/// wrong the moment you progress past it, and a prescribed rep count is a
/// number you either hit or quietly fudge, because the same bar is a different
/// set on a different day.
///
/// What is left is the one thing a block really does decide: how much work.
/// How hard each set is comes from the week — the front end reads a target of
/// reps left in the tank off the position in the block, ramping to nothing in
/// the last training week and to a full tank through the deload — and that is
/// derived from <c>weeks</c>, so there is nothing here to store.
///
/// <c>Sets</c> is what a training week asks for. The last week of a block is a
/// rest week and runs the same exercises at half of it, which is likewise
/// derived rather than planned: the plan hangs off the day, so there is nowhere
/// to write a lighter week even if it were worth storing.
///
/// The plan is not a promise. Nothing enforces it at logging time: a session
/// seeded from a plan is an ordinary session whose entries happen to be there
/// already, and the sets logged against it are whatever was actually lifted.
/// </summary>
public readonly record struct PlannedExercise(string ExerciseName, int Sets)
{
    /// <summary>
    /// Reads what is still planned. A block written while reps were planned
    /// has a <c>reps</c> on every entry and it is simply not read — the field
    /// is dead rather than wrong, so those blocks need no backfill and lose
    /// nothing but a number that was never binding.
    /// </summary>
    public static PlannedExercise Read(JsonElement element) => new(
        GymDocument.String(element, "exerciseName"),
        GymDocument.Int32(element, "sets"));

    public object ToResponse() => new { exerciseName = ExerciseName, sets = Sets };
}

/// <summary>
/// One labelled day of the block. Position in the block is <c>dayIndex</c>; the
/// label is what the user called it; <c>Plan</c> is what they intend to do.
///
/// The plan hangs off the day rather than off a cell of the block, so every
/// week's "Upper A" shares it. That follows the app's own premise — days are
/// labelled, not scheduled — and it keeps a block one small document instead of
/// up to 48 planned ones. What it gives up is planning a single week
/// differently, a deload week most of all; that would be a plan per cell, and
/// it is the change to make if per-week progression is ever wanted.
/// </summary>
public readonly record struct MesoDay(int DayIndex, string Label, IReadOnlyList<PlannedExercise> Plan)
{
    public static MesoDay Read(JsonElement element)
    {
        var plan = new List<PlannedExercise>();

        // Absent rather than empty on any block created before planning
        // existed, and this is the whole migration: an unplanned day reads as a
        // day with an empty plan, which is what it is.
        if (element.TryGetProperty("plan", out var stored) && stored.ValueKind == JsonValueKind.Array)
        {
            foreach (var exercise in stored.EnumerateArray())
            {
                plan.Add(PlannedExercise.Read(exercise));
            }
        }

        return new MesoDay(
            GymDocument.Int32(element, "dayIndex"),
            GymDocument.String(element, "label"),
            plan);
    }

    public object ToResponse() => new
    {
        dayIndex = DayIndex,
        label = Label,
        plan = Plan.Select(exercise => exercise.ToResponse()).ToArray(),
    };
}

/// <summary>
/// The plan, and nothing else.
///
/// No <c>status</c> — <c>user.currentMesoId</c> already says which block is
/// live, and two fields asserting one fact drift apart. No <c>createdAt</c> —
/// nothing reads it, Cosmos records <c>_ts</c> anyway, and the id is a ULID so
/// creation order is in it regardless.
/// </summary>
public sealed record Mesocycle(string Id, string Name, int Weeks, IReadOnlyList<MesoDay> Days)
{
    public static Mesocycle Read(JsonElement document)
    {
        var days = new List<MesoDay>();

        if (document.TryGetProperty("days", out var stored) && stored.ValueKind == JsonValueKind.Array)
        {
            foreach (var day in stored.EnumerateArray())
            {
                days.Add(MesoDay.Read(day));
            }
        }

        return new Mesocycle(
            GymIds.StripMesocyclePrefix(GymDocument.String(document, "id")),
            GymDocument.String(document, "name"),
            GymDocument.Int32(document, "weeks"),
            days);
    }

    /// <summary>The wire shape, which is the same shape the Plan tab
    /// edits.</summary>
    public object ToResponse() => new
    {
        id = Id,
        name = Name,
        weeks = Weeks,
        days = Days.Select(day => day.ToResponse()).ToArray(),
    };
}

/// <summary>
/// A block as the Plan tab's list sees it: the plan, whether it is the one
/// being trained, and how much is in it.
///
/// The counts are what make the two destructive actions on that screen
/// answerable — "delete this block" has to be able to say what goes with it,
/// and a row that reads "5 weeks · 4 days · 12 logged" is the difference
/// between recognising a block and guessing at it. They are counted rather
/// than stored, from a query that projects <c>mesoId</c> and <c>status</c> and
/// nothing else: no <c>entries</c>, so listing every block costs a fraction of
/// what reading one of them does.
///
/// Volume is deliberately not here. It needs the sets, and the sets are the
/// expensive half of a session document — the delete confirmation fetches it
/// for one block through <c>GET /gym/workouts?mesoId=</c> when it is about to
/// be needed, rather than every block paying for it on every list.
/// </summary>
public readonly record struct MesocycleSummary(
    Mesocycle Block,
    bool IsCurrent,
    int SessionCount,
    int SubmittedCount)
{
    public object ToResponse() => new
    {
        id = Block.Id,
        name = Block.Name,
        weeks = Block.Weeks,
        days = Block.Days.Select(day => day.ToResponse()).ToArray(),
        isCurrent = IsCurrent,
        sessionCount = SessionCount,
        submittedCount = SubmittedCount,
    };
}

/// <summary>
/// A saved day plan, reusable across blocks: a name and the same
/// <see cref="PlannedExercise"/> list a <see cref="MesoDay"/> carries.
///
/// It is deliberately the same shape as a day's plan and not a richer one,
/// because applying a template is a copy into a day and nothing else — there is
/// no link back, no id stored on the block, and nothing that re-applies a
/// template when it is edited later. A day that was filled from a template is
/// an ordinary planned day, which is what makes a template safe to rename or
/// delete: no block can be broken by it.
///
/// No <c>createdAt</c>, for the reason <see cref="Mesocycle"/> gives: the id is
/// a ULID, so creation order is already in it, and Cosmos records <c>_ts</c>
/// regardless.
///
/// The built-in templates are not these. They are identical for every user and
/// change when the app ships, so they are a CDN blob beside the exercise
/// library — <c>gym-templates.json</c> — costing no function invocation, no
/// token and no RU. What is stored here is only what a user saved.
/// </summary>
public sealed record DayTemplate(string Id, string Name, IReadOnlyList<PlannedExercise> Plan)
{
    public static DayTemplate Read(JsonElement document)
    {
        var plan = new List<PlannedExercise>();

        if (document.TryGetProperty("plan", out var stored) && stored.ValueKind == JsonValueKind.Array)
        {
            foreach (var exercise in stored.EnumerateArray())
            {
                plan.Add(PlannedExercise.Read(exercise));
            }
        }

        return new DayTemplate(
            GymDocument.String(document, "id"),
            GymDocument.String(document, "name"),
            plan);
    }

    /// <summary>
    /// The wire shape. <c>id</c> is the document id unprefixed of anything —
    /// see <see cref="GymIds.NewTemplateId"/> — so what comes back here is what
    /// the routes take.
    /// </summary>
    public object ToResponse() => new
    {
        id = Id,
        name = Name,
        plan = Plan.Select(exercise => exercise.ToResponse()).ToArray(),
    };
}

/// <summary>
/// One logged set. No id and no order: array position is the order, and the
/// patch path that appends one addresses by index.
/// </summary>
public readonly record struct WorkSet(double WeightKg, int Reps, double? Rpe)
{
    public static WorkSet Read(JsonElement element) => new(
        GymDocument.Double(element, "weightKg"),
        GymDocument.Int32(element, "reps"),
        GymDocument.OptionalDouble(element, "rpe"));

    public object ToResponse() => new { weightKg = WeightKg, reps = Reps, rpe = Rpe };
}

/// <summary>
/// One exercise in a session, with its sets.
///
/// No <c>equipment</c>: the shipped library distinguishes variants by name
/// today, and a field nothing sets is a field that is wrong later. No
/// <c>order</c>, no id, and no <c>workoutId</c> — the entry is inside the
/// session, so all three are already known from where it sits.
///
/// Position is not incidental, though: it is what the drag handle on the
/// logging screen moves, <see cref="GymStore.ReorderEntryAsync"/> is the write
/// that changes it, and a separate backend reads it downstream to compute
/// against. That is also why there is still no id to reorder by instead —
/// adding one would be for this feature's benefit alone, and the position a
/// client already addresses sets by does the job without a second identity to
/// keep in step with the first.
/// </summary>
public sealed record SessionEntry(string ExerciseName, IReadOnlyList<WorkSet> Sets)
{
    public static SessionEntry Read(JsonElement element)
    {
        var sets = new List<WorkSet>();

        if (element.TryGetProperty("sets", out var stored) && stored.ValueKind == JsonValueKind.Array)
        {
            foreach (var set in stored.EnumerateArray())
            {
                sets.Add(WorkSet.Read(set));
            }
        }

        return new SessionEntry(GymDocument.String(element, "exerciseName"), sets);
    }

    public object ToResponse() => new
    {
        exerciseName = ExerciseName,
        sets = Sets.Select(set => set.ToResponse()).ToArray(),
    };
}

/// <summary>
/// A workout: the cell of the block it belongs to, and everything logged in it.
///
/// <c>week</c> and <c>dayIndex</c> look derivable from the date and are not.
/// The design labels days rather than scheduling them — you log "Upper A"
/// whenever you do it — so ten days off does not advance the week, and date
/// arithmetic would silently skip one. These record what the user chose when
/// they tapped Start, and there is no recovering them afterwards.
///
/// <c>mesoId</c> stays even though the date nearly implies it, because blocks
/// can be edited and History filters on it directly. The day's label does not:
/// it is <c>meso.days[dayIndex].label</c>, the mesocycle is loaded on every
/// screen anyway, and a copy here would leave old sessions showing a day's old
/// name after it was renamed in the Plan tab.
/// </summary>
public sealed record GymSession(
    string Id,
    string MesoId,
    int Week,
    int DayIndex,
    string Status,
    IReadOnlyList<SessionEntry> Entries)
{
    public const string Draft = "draft";

    public const string Submitted = "submitted";

    public static GymSession Read(JsonElement document)
    {
        var entries = new List<SessionEntry>();

        if (document.TryGetProperty("entries", out var stored) && stored.ValueKind == JsonValueKind.Array)
        {
            foreach (var entry in stored.EnumerateArray())
            {
                entries.Add(SessionEntry.Read(entry));
            }
        }

        return new GymSession(
            GymDocument.String(document, "id"),
            GymDocument.String(document, "mesoId"),
            GymDocument.Int32(document, "week"),
            GymDocument.Int32(document, "dayIndex"),
            GymDocument.String(document, "status"),
            entries);
    }

    public SessionTotals Totals() => SessionTotals.Of(Entries);

    /// <summary>
    /// This session read as a plan: what was trained, and how many sets of it.
    ///
    /// It is what an unplanned day is planned from the first time it is
    /// logged. Only exercises that were actually lifted count — an entry with
    /// no sets was picked and abandoned, and prescribing it for the rest of the
    /// block on that basis is the opposite of what happened.
    ///
    /// The same exercise logged under two entries is one planned exercise of
    /// their sets combined, because that is the work that was done; the plan
    /// has no way to say "twice" and no reason to want one. Both bounds are the
    /// ones a hand-typed plan is held to, so a captured plan is nothing the
    /// Plan tab could not have saved itself.
    /// </summary>
    public IReadOnlyList<PlannedExercise> AsPlan()
    {
        var plan = new List<PlannedExercise>();
        var seen = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

        foreach (var entry in Entries)
        {
            if (entry.Sets.Count == 0)
            {
                continue;
            }

            if (seen.TryGetValue(entry.ExerciseName, out var at))
            {
                plan[at] = plan[at] with
                {
                    Sets = Math.Min(GymLimits.MaxSetsPerEntry, plan[at].Sets + entry.Sets.Count),
                };

                continue;
            }

            if (plan.Count == GymLimits.MaxPlannedPerDay)
            {
                break;
            }

            seen[entry.ExerciseName] = plan.Count;
            plan.Add(new PlannedExercise(
                entry.ExerciseName,
                Math.Min(GymLimits.MaxSetsPerEntry, entry.Sets.Count)));
        }

        return plan;
    }

    public object ToResponse() => new
    {
        id = Id,
        mesoId = MesoId,
        week = Week,
        dayIndex = DayIndex,
        status = Status,
        entries = Entries.Select(entry => entry.ToResponse()).ToArray(),
        totals = Totals().ToResponse(),
    };
}

/// <summary>
/// Volume, set count and average RPE — derived on the way out, never stored.
///
/// They are recomputable from the sets, so storing them would be a second copy
/// of a fact that can drift from the first. The day History feels slow is the
/// day a <c>totals</c> field goes on the session document and is backfilled by
/// reading each one once; until then this is what "derived" means in practice.
/// </summary>
public readonly record struct SessionTotals(
    int ExerciseCount,
    int SetCount,
    double VolumeKg,
    double? AverageRpe)
{
    public static SessionTotals Of(IReadOnlyList<SessionEntry> entries)
    {
        var sets = 0;
        var volume = 0d;
        var rpeTotal = 0d;
        var rpeCount = 0;

        foreach (var entry in entries)
        {
            foreach (var set in entry.Sets)
            {
                sets++;
                volume += set.WeightKg * set.Reps;

                if (set.Rpe is { } rpe)
                {
                    rpeTotal += rpe;
                    rpeCount++;
                }
            }
        }

        return new SessionTotals(
            entries.Count,
            sets,
            // Kilogram-reps land on halves at worst, but they are accumulated
            // as doubles across a few hundred sets, so round off the drift
            // rather than answer 8419.999999999998.
            Math.Round(volume, 2),
            rpeCount == 0 ? null : Math.Round(rpeTotal / rpeCount, 2));
    }

    public object ToResponse() => new
    {
        exerciseCount = ExerciseCount,
        setCount = SetCount,
        volumeKg = VolumeKg,
        avgRpe = AverageRpe,
    };
}

/// <summary>
/// A session as the block map and History see it: where it sits, whether it is
/// finished, and what it added up to.
/// </summary>
public readonly record struct SessionSummary(
    string Id,
    int Week,
    int DayIndex,
    string Status,
    SessionTotals Totals)
{
    public static SessionSummary Read(JsonElement document)
    {
        var entries = new List<SessionEntry>();

        if (document.TryGetProperty("entries", out var stored) && stored.ValueKind == JsonValueKind.Array)
        {
            foreach (var entry in stored.EnumerateArray())
            {
                entries.Add(SessionEntry.Read(entry));
            }
        }

        return new SessionSummary(
            GymDocument.String(document, "id"),
            GymDocument.Int32(document, "week"),
            GymDocument.Int32(document, "dayIndex"),
            GymDocument.String(document, "status"),
            SessionTotals.Of(entries));
    }

    public object ToResponse() => new
    {
        id = Id,
        week = Week,
        dayIndex = DayIndex,
        status = Status,
        exerciseCount = Totals.ExerciseCount,
        setCount = Totals.SetCount,
        volumeKg = Totals.VolumeKg,
        avgRpe = Totals.AverageRpe,
    };
}

/// <summary>
/// Reading fields out of a document this app wrote.
///
/// Strict on purpose, and different in kind from the tolerance a request body
/// gets. A missing or mistyped field here is not a caller sending the wrong
/// thing — it is a document that does not match the code that writes it, which
/// means a shape changed without the readers changing with it. Answering 500
/// with the field named is the useful outcome; substituting a default would
/// store the disagreement rather than surface it.
/// </summary>
internal static class GymDocument
{
    public static string String(JsonElement document, string name) =>
        document.TryGetProperty(name, out var property) && property.ValueKind == JsonValueKind.String
            ? property.GetString()!
            : throw Missing(document, name, "a string");

    public static int Int32(JsonElement document, string name) =>
        document.TryGetProperty(name, out var property)
        && property.ValueKind == JsonValueKind.Number
        && property.TryGetInt32(out var value)
            ? value
            : throw Missing(document, name, "a whole number");

    public static double Double(JsonElement document, string name) =>
        document.TryGetProperty(name, out var property) && property.ValueKind == JsonValueKind.Number
            ? property.GetDouble()
            : throw Missing(document, name, "a number");

    /// <summary>
    /// A field that is allowed to be absent or a literal null — RPE is the only
    /// one. Absent and null mean the same thing here, unlike on a GPS fix,
    /// because a set written before RPE was optional simply has no key.
    /// </summary>
    public static double? OptionalDouble(JsonElement document, string name) =>
        document.TryGetProperty(name, out var property) && property.ValueKind == JsonValueKind.Number
            ? property.GetDouble()
            : null;

    private static InvalidOperationException Missing(JsonElement document, string name, string expected)
    {
        var id = document.TryGetProperty("id", out var stored) && stored.ValueKind == JsonValueKind.String
            ? stored.GetString()
            : "an unidentified document";

        return new InvalidOperationException(
            $"'{name}' is missing from {id} in db/gym, or is not {expected}. The document does not "
            + "match the shape this app writes, which means it was written by something else or by "
            + "an older version of this code.");
    }
}
