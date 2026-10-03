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
    /// How many custom exercises one user may describe, for the same reason as
    /// <see cref="MaxTemplatesPerUser"/>: the shipped library is fifty-odd, so
    /// two hundred of your own is a client creating in a loop rather than a
    /// gym, and the list is one unpaged query.
    /// </summary>
    public const int MaxExercisesPerUser = 200;

    /// <summary>
    /// A custom exercise's equipment, group, and each muscle. Short words in
    /// the shipped library — "Dumbbell", "Posterior", "Side Delts" — so this
    /// is a bound on a typo rather than on a vocabulary.
    /// </summary>
    public const int MaxTagLength = 40;

    /// <summary>
    /// What an exercise trains, main muscle first. Three, as the shipped
    /// library's rule has it: what the exercise is <em>for</em>, not every
    /// muscle that works during it.
    /// </summary>
    public const int MaxMusclesPerExercise = 3;

    /// <summary>
    /// Starred exercises. A hundred is past anything a picker section can be
    /// scanned at, and the list is sent whole on every change.
    /// </summary>
    public const int MaxFavorites = 100;

    /// <summary>
    /// How many recently used exercises are remembered: two or three workouts'
    /// worth, which is what "recent" means at the top of a picker.
    /// </summary>
    public const int MaxRecent = 20;

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
    public static MesoDay Read(JsonElement element) => new(
        GymDocument.Int32(element, "dayIndex"),
        GymDocument.String(element, "label"),
        GymDocument.List(element, "plan", PlannedExercise.Read));

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
    public static Mesocycle Read(JsonElement document) => new(
        GymIds.StripMesocyclePrefix(GymDocument.String(document, "id")),
        GymDocument.String(document, "name"),
        GymDocument.Int32(document, "weeks"),
        GymDocument.List(document, "days", MesoDay.Read));

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
    public static DayTemplate Read(JsonElement document) => new(
        GymDocument.String(document, "id"),
        GymDocument.String(document, "name"),
        GymDocument.List(document, "plan", PlannedExercise.Read));

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
/// An exercise of the user's own, described the way the shipped library
/// describes one: equipment, the muscle group it is planned against, what it
/// trains, and the family it belongs to.
///
/// <b>It is a description, not a reference.</b> Plans and sessions store an
/// exercise by name, as they always have, and nothing on them points at this
/// document. That is what keeps everything already logged valid, and it is why
/// the name cannot change: renaming the record would leave every session that
/// used the old name describing an exercise that no longer exists, and every
/// chart split in two. A different name is a different exercise — create it.
/// Deleting one likewise touches no plan and no workout: the name stays where
/// it was used and reads as an undescribed custom name again, which is what it
/// was before the record existed.
///
/// The front ends merge these into the library they already read, so the
/// muscle-group tallies, the equipment chip and the swap suggestions treat a
/// custom exercise exactly as they treat a shipped one. The library is the
/// CDN's and is the same for every account; these are the one part of it that
/// is somebody's, which is why they are here.
///
/// Every field but the name is optional, and absent reads as unknown — the
/// same rule the shipped library follows.
/// </summary>
public sealed record CustomExercise(
    string Id,
    string Name,
    string? Equipment,
    string? Group,
    IReadOnlyList<string> Muscles,
    string? VariationOf)
{
    public static CustomExercise Read(JsonElement document) => new(
        GymDocument.String(document, "id"),
        GymDocument.String(document, "name"),
        GymDocument.OptionalString(document, "equipment"),
        GymDocument.OptionalString(document, "group"),
        GymDocument.List(document, "muscles", element => element.GetString() ?? string.Empty),
        GymDocument.OptionalString(document, "variationOf"));

    /// <summary>
    /// The wire shape: the library's own field names, so a client can put one
    /// of these in the list beside the shipped exercises without translating
    /// it. Unknown fields are left off rather than sent as null, as the
    /// library leaves them off.
    /// </summary>
    public object ToResponse()
    {
        var response = new Dictionary<string, object>
        {
            ["id"] = Id,
            ["name"] = Name,
        };

        if (Equipment is not null)
        {
            response["equipment"] = Equipment;
        }

        if (Group is not null)
        {
            response["group"] = Group;
        }

        if (Muscles.Count > 0)
        {
            response["muscles"] = Muscles;
        }

        if (VariationOf is not null)
        {
            response["variationOf"] = VariationOf;
        }

        return response;
    }
}

/// <summary>
/// The exercises a user reaches for: the ones they starred, and the ones they
/// lifted lately. Both are names, as everything that refers to an exercise is,
/// so a favourite covers the exercise's whole history and survives its
/// description being deleted.
///
/// A document of its own rather than two fields on the pointer document, and
/// not for tidiness: the pointer is written with a whole-document upsert every
/// time the current block changes — create, switch, a delete that repoints —
/// and every one of those would have wiped the lists. Here nothing else writes,
/// so each list is patched alone.
///
/// <c>Favorites</c> are in the order they were starred; <c>Recent</c> is most
/// recent first, written by Submit. Absent reads as empty — a user who has
/// starred nothing and finished nothing since this existed simply has no
/// document.
/// </summary>
public sealed record ExercisePreferences(IReadOnlyList<string> Favorites, IReadOnlyList<string> Recent)
{
    public static readonly ExercisePreferences Empty = new([], []);

    public static ExercisePreferences Read(JsonElement document) => new(
        GymDocument.List(document, "favorites", element => element.GetString() ?? string.Empty),
        GymDocument.List(document, "recent", element => element.GetString() ?? string.Empty));

    /// <summary>
    /// The lists after a workout: what it lifted, in the order it was lifted,
    /// ahead of whatever was there, each name once, and no longer than
    /// <see cref="GymLimits.MaxRecent"/>.
    /// </summary>
    public IReadOnlyList<string> RecentAfter(IReadOnlyList<string> lifted) =>
        lifted
            .Concat(Recent)
            .Distinct(StringComparer.Ordinal)
            .Take(GymLimits.MaxRecent)
            .ToArray();
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
///
/// <c>SwappedFrom</c> is the exercise this entry was swapped in for — the rack
/// was taken, so the planned squat became a leg press. It records a decision
/// made at the time and nothing else records it: the plan still says squat, and
/// the leg press's own name says nothing about why it is there. It is what lets
/// the front end carry the planned set count across to the substitute, and it
/// always names the <em>original</em> exercise, so swapping twice still points
/// at the plan rather than at the first substitute. Absent on every entry that
/// was not swapped, which is every entry written before swapping existed.
/// </summary>
public sealed record SessionEntry(string ExerciseName, IReadOnlyList<WorkSet> Sets, string? SwappedFrom = null)
{
    public static SessionEntry Read(JsonElement element) => new(
        GymDocument.String(element, "exerciseName"),
        GymDocument.List(element, "sets", WorkSet.Read),
        GymDocument.OptionalString(element, "swappedFrom"));

    /// <summary>
    /// The wire shape. <c>swappedFrom</c> is present only on an entry that was
    /// swapped, for the reason <see cref="SessionSummary.ToResponse"/> leaves
    /// <c>entries</c> off: a key that is null on nearly every entry is bytes
    /// on every session read for nothing.
    /// </summary>
    public object ToResponse() => SwappedFrom is null
        ? new
        {
            exerciseName = ExerciseName,
            sets = Sets.Select(set => set.ToResponse()).ToArray(),
        }
        : new
        {
            exerciseName = ExerciseName,
            swappedFrom = SwappedFrom,
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

    public static GymSession Read(JsonElement document) => new(
        GymDocument.String(document, "id"),
        GymDocument.String(document, "mesoId"),
        GymDocument.Int32(document, "week"),
        GymDocument.Int32(document, "dayIndex"),
        GymDocument.String(document, "status"),
        GymDocument.List(document, "entries", SessionEntry.Read));

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

    /// <summary>
    /// The entries with one exercise swapped for another — what
    /// <see cref="GymStore.SwapEntryAsync"/> writes, kept here so the rule is a
    /// function of the session rather than half of a Cosmos call.
    ///
    /// Three shapes:
    ///
    /// <list type="bullet">
    /// <item>Nothing logged against it: it is <em>replaced</em> in place. The
    /// slot keeps its position, so the substitute is where the plan expects
    /// the original to be.</item>
    /// <item>Sets logged against it: those sets stay where they are, on the
    /// exercise they were lifted on, and the substitute is <em>inserted</em>
    /// straight after it — the rack was taken halfway through. A swap never
    /// moves a set onto an exercise it was not done on unless asked to: that
    /// would put two lifts' numbers into one history, which is exactly what
    /// keeping variations apart exists to prevent.</item>
    /// <item><paramref name="withSets"/>: the sets <em>were</em> done on
    /// <paramref name="to"/>, and the entry was simply logged under the wrong
    /// name — the planned curl was done on the cable because the dumbbells were
    /// taken, and nobody swapped before logging. It is replaced in place and
    /// its sets go with it, so their history lands on the exercise they were
    /// actually lifted on. It is what a swap on a finished workout always
    /// means — there is nothing left to log, only a record to correct — and
    /// what one mid-workout means when the user says so.</item>
    /// </list>
    ///
    /// The substitute's <c>SwappedFrom</c> is the <em>original</em> exercise,
    /// not the one it directly replaces, so a second swap still points at the
    /// plan. Replacing a slot with its original again clears it — the slot is
    /// back to what the plan says. Inserting the original after a substitute
    /// that was lifted keeps it, because that entry is still standing in for
    /// the sets the plan asked of the first one.
    /// </summary>
    public (IReadOnlyList<SessionEntry> Entries, int At, bool Replaced) WithSwap(
        int entryIndex,
        string to,
        bool withSets = false)
    {
        var current = Entries[entryIndex];
        var original = current.SwappedFrom ?? current.ExerciseName;
        var next = Entries.ToList();

        if (current.Sets.Count == 0 || withSets)
        {
            next[entryIndex] = new SessionEntry(to, current.Sets, original == to ? null : original);

            return (next, entryIndex, true);
        }

        next.Insert(entryIndex + 1, new SessionEntry(to, [], original));

        return (next, entryIndex + 1, false);
    }

    /// <summary>
    /// The entries with one logged set replaced by another — the edit that
    /// corrects a mistyped weight without deleting the set and logging it again
    /// at the bottom of the list.
    /// </summary>
    public IReadOnlyList<SessionEntry> WithSet(int entryIndex, int setIndex, WorkSet set) =>
        Entries
            .Select((entry, index) => index != entryIndex
                ? entry
                : entry with
                {
                    Sets = entry.Sets.Select((logged, at) => at == setIndex ? set : logged).ToArray(),
                })
            .ToArray();

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
///
/// <see cref="Entries"/> is the sets themselves, and is null unless the caller
/// asked for them. Every summary is built by reading them — volume and average
/// RPE are derived rather than stored, so the sets have to be parsed to add
/// them up — and the default is to add them up and drop them, because the block
/// map and History want a number per cell rather than a session per cell.
///
/// Keeping them instead is what <c>?include=entries</c> buys, and the reason it
/// can be nearly free: the query already projects <c>c.entries</c> and this
/// already walks every set in it, so the cost of answering with them is the
/// bytes on the wire and nothing else. See <see cref="GymWorkouts.List"/> for
/// what that replaces.
/// </summary>
public readonly record struct SessionSummary(
    string Id,
    int Week,
    int DayIndex,
    string Status,
    SessionTotals Totals,
    IReadOnlyList<SessionEntry>? Entries = null)
{
    /// <summary>
    /// Reads one row of the block's session query.
    ///
    /// <paramref name="withEntries"/> decides whether the parsed sets are kept
    /// on the summary or thrown away once they have been added up. It does not
    /// decide whether they are read: they are on the document either way, and
    /// the totals cannot be derived without walking them.
    /// </summary>
    public static SessionSummary Read(JsonElement document, bool withEntries = false)
    {
        var entries = GymDocument.List(document, "entries", SessionEntry.Read);

        return new SessionSummary(
            GymDocument.String(document, "id"),
            GymDocument.Int32(document, "week"),
            GymDocument.Int32(document, "dayIndex"),
            GymDocument.String(document, "status"),
            SessionTotals.Of(entries),
            withEntries ? entries : null);
    }

    /// <summary>
    /// The wire shape. <c>entries</c> is present only when it was asked for,
    /// rather than sent as null: a client reading the block map should not have
    /// to skip over a key that is never populated for it.
    /// </summary>
    public object ToResponse() => Entries is null
        ? new
        {
            id = Id,
            week = Week,
            dayIndex = DayIndex,
            status = Status,
            exerciseCount = Totals.ExerciseCount,
            setCount = Totals.SetCount,
            volumeKg = Totals.VolumeKg,
            avgRpe = Totals.AverageRpe,
        }
        : new
        {
            id = Id,
            week = Week,
            dayIndex = DayIndex,
            status = Status,
            exerciseCount = Totals.ExerciseCount,
            setCount = Totals.SetCount,
            volumeKg = Totals.VolumeKg,
            avgRpe = Totals.AverageRpe,
            entries = Entries.Select(entry => entry.ToResponse()).ToArray(),
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

    /// <summary>
    /// The same, for a string — an entry's <c>swappedFrom</c>, which every entry
    /// written before swapping existed simply does not have.
    /// </summary>
    public static string? OptionalString(JsonElement document, string name) =>
        document.TryGetProperty(name, out var property) && property.ValueKind == JsonValueKind.String
            ? property.GetString()
            : null;

    /// <summary>
    /// An array field, read element by element. Absent reads as empty, and that
    /// is the whole migration for every array here: a document written before
    /// the field existed — a day from before planning, most of all — simply has
    /// no key, and an empty list is what it means.
    /// </summary>
    public static IReadOnlyList<T> List<T>(JsonElement document, string name, Func<JsonElement, T> read) =>
        document.TryGetProperty(name, out var property) && property.ValueKind == JsonValueKind.Array
            ? property.EnumerateArray().Select(read).ToArray()
            : [];

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
