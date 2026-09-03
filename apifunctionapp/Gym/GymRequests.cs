using System.Globalization;
using System.Text.Json;

namespace ApiFunctionApp.Gym;

/// <summary>
/// The bodies the front end posts, and what makes each of them acceptable.
///
/// Validation here is stricter than the storage strictly needs, and the reason
/// is that Cosmos will store anything: a weight of 1e9 kilograms or a
/// <c>dayIndex</c> of 400 costs the same RU as a real one and is only
/// discovered later, on a screen that cannot render it. Everything refused
/// below is refused with the value and the bound in the message, because these
/// are read by whoever is holding a request that is not working.
///
/// What is deliberately <em>not</em> validated is anything the design leaves to
/// the user: exercise names are free text because custom exercises are the
/// point, and a weight is not required to land on a 2.5 kg step because plates
/// and machines do not agree about that.
/// </summary>
internal static class GymRequests
{
    /// <summary>
    /// <c>POST /api/gym/mesocycles</c> — the Plan tab creating a block.
    /// </summary>
    public static bool TryReadMesocycle(
        JsonElement body,
        out string name,
        out int weeks,
        out IReadOnlyList<string> days,
        out string error)
    {
        name = string.Empty;
        weeks = 0;
        days = [];

        return GymJson.TryReadString(body, "name", GymLimits.MaxNameLength, out name, out error)
            && GymJson.TryReadInt(body, "weeks", GymLimits.MinWeeks, GymLimits.MaxWeeks, out weeks, out error)
            && TryReadDays(body, out days, out error);
    }

    /// <summary>
    /// <c>PATCH /api/gym/mesocycles/{id}</c> — the Plan tab editing one.
    ///
    /// Every field is optional and an absent one is left alone, which is what
    /// makes renaming a day and changing the block length two independent calls
    /// rather than a read-modify-write the client has to get right. Sending
    /// none of them is not an error: it is a no-op, and answering 400 for it
    /// would make an idempotent save awkward for no gain.
    /// </summary>
    public static bool TryReadMesocyclePatch(
        JsonElement body,
        out string? name,
        out int? weeks,
        out IReadOnlyList<string>? days,
        out string error)
    {
        name = null;
        weeks = null;
        days = null;
        error = string.Empty;

        if (body.TryGetProperty("name", out _))
        {
            if (!GymJson.TryReadString(body, "name", GymLimits.MaxNameLength, out var readName, out error))
            {
                return false;
            }

            name = readName;
        }

        if (body.TryGetProperty("weeks", out _))
        {
            if (!GymJson.TryReadInt(
                    body,
                    "weeks",
                    GymLimits.MinWeeks,
                    GymLimits.MaxWeeks,
                    out var readWeeks,
                    out error))
            {
                return false;
            }

            weeks = readWeeks;
        }

        if (body.TryGetProperty("days", out _))
        {
            if (!TryReadDays(body, out var readDays, out error))
            {
                return false;
            }

            days = readDays;
        }

        return true;
    }

    /// <summary>
    /// <c>PUT /api/gym/mesocycles/current</c> — the Plan tab switching blocks.
    ///
    /// The id goes in the body rather than in the route because the route is
    /// the thing being set: <c>gym/mesocycles/current</c> is the pointer, and
    /// PUT replaces what it names. It also keeps the literal segment from
    /// competing with <c>gym/mesocycles/{mesoId}</c> for the same verb.
    /// </summary>
    public static bool TryReadCurrentMesocycle(
        JsonElement body,
        out string mesoId,
        out string error)
    {
        // 255 is the id ceiling Cosmos itself imposes, and the same bound
        // GymIds.IsWellFormed checks below. Anything this long is not an id
        // this API handed out, but rejecting it for length says so more
        // usefully than rejecting it for shape.
        if (!GymJson.TryReadString(body, "mesoId", 255, out mesoId, out error))
        {
            return false;
        }

        if (!GymIds.IsWellFormed(mesoId))
        {
            error = $"'{mesoId}' is not a mesocycle id. They are the ids this API hands back from "
                + "POST /api/gym/mesocycles and GET /api/gym/mesocycles, not names.";
            return false;
        }

        return true;
    }

    /// <summary>
    /// <c>POST /api/gym/workouts</c> — Start.
    ///
    /// The mesocycle is not in the body and is not meant to be: the server
    /// reads it off the user's own pointer document, which is one point read it
    /// is making anyway and one fewer thing a client can get wrong. What the
    /// client does have to send is the date, because only the phone knows what
    /// day it is where the user is standing.
    /// </summary>
    public static bool TryReadWorkoutStart(
        JsonElement body,
        out DateOnly date,
        out int week,
        out int dayIndex,
        out string error)
    {
        date = default;
        week = 0;
        dayIndex = 0;

        var value = body.TryGetProperty("date", out var stored) && stored.ValueKind == JsonValueKind.String
            ? stored.GetString()
            : null;

        if (!GymIds.TryReadDate(value, out date, out error))
        {
            return false;
        }

        // The upper bound on the week is the block's, which is not known here.
        // This is the shape check; the endpoint reads the mesocycle and checks
        // the week against its actual length.
        return GymJson.TryReadInt(body, "week", 1, GymLimits.MaxWeeks, out week, out error)
            && GymJson.TryReadInt(body, "dayIndex", 0, GymLimits.MaxDays - 1, out dayIndex, out error);
    }

    /// <summary>
    /// <c>POST /api/gym/workouts/{id}/entries</c> — the exercise picker.
    ///
    /// <c>expectedEntryCount</c> is how many exercises the session already had
    /// when the user tapped. The server appends only if that still matches, so
    /// a tap whose response was lost and retried adds one exercise rather than
    /// two.
    /// </summary>
    public static bool TryReadEntry(
        JsonElement body,
        out string exerciseName,
        out int expectedEntryCount,
        out string error)
    {
        exerciseName = string.Empty;
        expectedEntryCount = 0;

        return GymJson.TryReadString(
                body,
                "exerciseName",
                GymLimits.MaxExerciseNameLength,
                out exerciseName,
                out error)
            && GymJson.TryReadInt(
                body,
                "expectedEntryCount",
                0,
                GymLimits.MaxEntriesPerSession - 1,
                out expectedEntryCount,
                out error);
    }

    /// <summary>
    /// <c>POST /api/gym/workouts/{id}/sets</c> — the tap that fires thirty or
    /// forty times a session.
    ///
    /// Four required fields and an optional RPE. <c>entryIndex</c> is the
    /// position of the exercise in the session and <c>expectedSetCount</c> how
    /// many sets it already had, which together are what make the append safe
    /// to replay: see <see cref="GymStore.AppendSetAsync"/>.
    /// </summary>
    public static bool TryReadSet(
        JsonElement body,
        out int entryIndex,
        out int expectedSetCount,
        out WorkSet set,
        out string error)
    {
        entryIndex = 0;
        expectedSetCount = 0;
        set = default;

        if (!GymJson.TryReadInt(
                body,
                "entryIndex",
                0,
                GymLimits.MaxEntriesPerSession - 1,
                out entryIndex,
                out error)
            || !GymJson.TryReadInt(
                body,
                "expectedSetCount",
                0,
                GymLimits.MaxSetsPerEntry - 1,
                out expectedSetCount,
                out error)
            || !GymJson.TryReadDouble(body, "weightKg", 0, GymLimits.MaxWeightKg, out var weight, out error)
            || !GymJson.TryReadInt(body, "reps", 1, GymLimits.MaxReps, out var reps, out error)
            || !TryReadRpe(body, out var rpe, out error))
        {
            return false;
        }

        set = new WorkSet(weight, reps, rpe);
        return true;
    }

    /// <summary>
    /// RPE: absent, a literal null, or a number from 5 to 10 on a half step.
    ///
    /// Optional because a set without a rating is still a set, and refusing it
    /// would throw away the reps and the weight along with the rating the user
    /// did not give. The half-step check is worth having where the 2.5 kg one
    /// is not: RPE is a closed scale the design renders as a fixed set of
    /// labels, so 7.3 is not a finer reading, it is a value with nothing to
    /// show for it.
    /// </summary>
    private static bool TryReadRpe(JsonElement body, out double? rpe, out string error)
    {
        rpe = null;
        error = string.Empty;

        if (!body.TryGetProperty("rpe", out var property) || property.ValueKind == JsonValueKind.Null)
        {
            return true;
        }

        if (!GymJson.TryReadDouble(body, "rpe", GymLimits.MinRpe, GymLimits.MaxRpe, out var value, out error))
        {
            return false;
        }

        if (Math.Abs((value * 2) - Math.Round(value * 2)) > 0.0001)
        {
            error = $"'rpe' is {value.ToString(CultureInfo.InvariantCulture)}, which is not a half step. "
                + "The scale runs 5 to 10 in steps of 0.5 and every value on it has a meaning the app "
                + "shows in words; one in between has none.";
            return false;
        }

        rpe = value;
        return true;
    }

    /// <summary>
    /// The day labels of a block, as an array of strings — <c>["Upper A",
    /// "Lower A"]</c>.
    ///
    /// Labels rather than objects, and position rather than an explicit
    /// <c>dayIndex</c>, because the array's order <em>is</em> the order of the
    /// days. Letting the client send an index as well would be a second way to
    /// say the same thing, and the two disagreeing is a bug with nowhere to
    /// surface.
    /// </summary>
    private static bool TryReadDays(
        JsonElement body,
        out IReadOnlyList<string> days,
        out string error)
    {
        days = [];

        if (!body.TryGetProperty("days", out var property) || property.ValueKind == JsonValueKind.Null)
        {
            error = "'days' is missing. Send the day labels in order, as an array of strings — "
                + "the position in the array is the dayIndex.";
            return false;
        }

        if (property.ValueKind != JsonValueKind.Array)
        {
            error = $"'days' is {property.ValueKind}, expected an array of strings.";
            return false;
        }

        var length = property.GetArrayLength();

        if (length < GymLimits.MinDays || length > GymLimits.MaxDays)
        {
            error = $"'days' holds {length} labels, outside {GymLimits.MinDays} to {GymLimits.MaxDays}.";
            return false;
        }

        var labels = new List<string>(length);
        var index = 0;

        foreach (var label in property.EnumerateArray())
        {
            if (label.ValueKind != JsonValueKind.String)
            {
                error = $"Day {index} of 'days' is {label.ValueKind}, expected a string.";
                return false;
            }

            var text = label.GetString()!.Trim();

            if (text.Length == 0 || text.Length > GymLimits.MaxLabelLength)
            {
                error = $"Day {index} of 'days' is {text.Length} characters, outside 1 to "
                    + $"{GymLimits.MaxLabelLength}.";
                return false;
            }

            labels.Add(text);
            index++;
        }

        days = labels;
        error = string.Empty;
        return true;
    }
}

/// <summary>
/// Reading one field out of a request body, with the message that explains a
/// refusal.
///
/// Deliberately unlike <see cref="GymDocument"/>, which reads documents this
/// app wrote and throws when they surprise it. These read what a client sent,
/// where being wrong is ordinary and the useful answer is a 400 naming the
/// field, what arrived in it, and what was expected instead.
/// </summary>
internal static class GymJson
{
    public static bool TryReadString(
        JsonElement body,
        string name,
        int maxLength,
        out string value,
        out string error)
    {
        value = string.Empty;

        if (!body.TryGetProperty(name, out var property))
        {
            error = $"'{name}' is missing.";
            return false;
        }

        if (property.ValueKind != JsonValueKind.String)
        {
            error = $"'{name}' is {property.ValueKind}, expected a string.";
            return false;
        }

        var text = property.GetString()!.Trim();

        if (text.Length == 0)
        {
            error = $"'{name}' is empty.";
            return false;
        }

        if (text.Length > maxLength)
        {
            error = $"'{name}' is {text.Length} characters, over the {maxLength} allowed.";
            return false;
        }

        value = text;
        error = string.Empty;
        return true;
    }

    public static bool TryReadInt(
        JsonElement body,
        string name,
        int minimum,
        int maximum,
        out int value,
        out string error)
    {
        value = 0;

        if (!body.TryGetProperty(name, out var property))
        {
            error = $"'{name}' is missing.";
            return false;
        }

        if (property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var number))
        {
            error = $"'{name}' is {property.GetRawText()}, expected a whole number.";
            return false;
        }

        if (number < minimum || number > maximum)
        {
            error = $"'{name}' is {number.ToString(CultureInfo.InvariantCulture)}, outside "
                + $"{minimum.ToString(CultureInfo.InvariantCulture)} to "
                + $"{maximum.ToString(CultureInfo.InvariantCulture)}.";
            return false;
        }

        value = number;
        error = string.Empty;
        return true;
    }

    public static bool TryReadDouble(
        JsonElement body,
        string name,
        double minimum,
        double maximum,
        out double value,
        out string error)
    {
        value = 0;

        if (!body.TryGetProperty(name, out var property))
        {
            error = $"'{name}' is missing.";
            return false;
        }

        if (property.ValueKind != JsonValueKind.Number)
        {
            error = $"'{name}' is {property.GetRawText()}, expected a number.";
            return false;
        }

        var number = property.GetDouble();

        // JSON has no NaN or infinity literal, but a number too large for a
        // double parses to infinity rather than failing — and an infinite
        // weight would serialize back out as something no JSON reader accepts.
        if (!double.IsFinite(number))
        {
            error = $"'{name}' is {property.GetRawText()}, which is not a finite number.";
            return false;
        }

        if (number < minimum || number > maximum)
        {
            error = $"'{name}' is {number.ToString(CultureInfo.InvariantCulture)}, outside "
                + $"{minimum.ToString(CultureInfo.InvariantCulture)} to "
                + $"{maximum.ToString(CultureInfo.InvariantCulture)}.";
            return false;
        }

        value = number;
        error = string.Empty;
        return true;
    }
}
