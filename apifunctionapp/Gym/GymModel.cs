using System.Text.Json;

namespace ApiFunctionApp.Gym;

/// <summary>
/// The three documents db/gym holds, and the shapes derived from them.
///
/// Three types, one discriminator, and deliberately smaller than the design's
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
public readonly record struct MesoDay(int DayIndex, string Label);

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
                days.Add(new MesoDay(
                    GymDocument.Int32(day, "dayIndex"),
                    GymDocument.String(day, "label")));
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
        days = Days.Select(day => new { dayIndex = day.DayIndex, label = day.Label }).ToArray(),
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
