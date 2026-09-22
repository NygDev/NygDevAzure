using System.Globalization;
using System.Text.Json;

namespace ApiFunctionApp.Gps;

/// <summary>
/// One location fix as the phone reports it: six keys, always all six, three
/// of them nullable.
///
/// The nullable three are nullable because Android's Location carries them
/// only when the fix actually had them — a fix with no altitude sends
/// <c>"alt": null</c> rather than dropping the key or substituting a zero. So
/// they are <c>double?</c> here and are stored as literal nulls, because a
/// zero altitude and an unknown altitude are not the same reading and nothing
/// downstream could tell them apart afterwards.
/// </summary>
public readonly record struct GpsFix(
    double Latitude,
    double Longitude,
    double? Accuracy,
    double? Altitude,
    double? Speed,
    long TimestampMs)
{
    /// <summary>
    /// The document id, and with it the dedupe key.
    ///
    /// The phone resends a batch whose response it never saw, so the same fix
    /// arrives twice and must not be stored twice. <c>ts</c> is unique per fix
    /// for one device, so keying the document on it makes the write an upsert
    /// that lands on the same document the second time round. A second phone
    /// would break that — its fixes could share a millisecond with this one's
    /// — and would need a device id in the key, which the payload does not
    /// carry.
    /// </summary>
    public string Id => TimestampMs.ToString(CultureInfo.InvariantCulture);

    /// <summary>
    /// <c>ts</c> as a timestamp, stored alongside the raw number so the
    /// container can be read by eye. Epoch milliseconds tell nobody when a fix
    /// was taken without a conversion first.
    /// </summary>
    public DateTimeOffset RecordedAt => DateTimeOffset.FromUnixTimeMilliseconds(TimestampMs);

    /// <summary>
    /// The oldest <c>ts</c> accepted, in epoch milliseconds — 1973-03-03.
    ///
    /// This is the seconds-versus-milliseconds guard the payload contract
    /// warns about. A seconds-scale timestamp is a nine- or ten-digit number,
    /// which as milliseconds lands in 1970, so anything below this floor is a
    /// unit mistake rather than a fix from half a century ago. Worth catching
    /// loudly: stored as-is it would be silently wrong, and every fix in the
    /// spool would collide into a handful of ids.
    /// </summary>
    private const long OldestAcceptedMs = 100_000_000_000L;

    /// <summary>
    /// The newest <c>ts</c> accepted — 5138-11-16. Far enough out to be no
    /// constraint on a real clock, close enough to catch microseconds or
    /// nanoseconds arriving where milliseconds were meant.
    /// </summary>
    private const long NewestAcceptedMs = 100_000_000_000_000L;

    /// <summary>
    /// Reads one element of the posted array, or says what is wrong with it.
    ///
    /// Everything here is a rejection the phone's own encoder should make
    /// impossible, so a failure is a bug on one side or the other rather than
    /// a fix that happens to be unusable — which is why it fails the whole
    /// request instead of being skipped. See the endpoint for what that costs.
    /// </summary>
    public static bool TryRead(JsonElement element, out GpsFix fix, out string error)
    {
        fix = default;

        if (element.ValueKind != JsonValueKind.Object)
        {
            error = $"expected an object, got {Describe(element.ValueKind)}";
            return false;
        }

        if (!TryReadRequired(element, "lat", out var lat, out error)
            || !TryReadRequired(element, "lon", out var lon, out error)
            || !TryReadOptional(element, "acc", out var acc, out error)
            || !TryReadOptional(element, "alt", out var alt, out error)
            || !TryReadOptional(element, "spd", out var spd, out error))
        {
            return false;
        }

        // WGS84 degrees. Out of range is not a fix that drifted, it is a
        // payload that means something other than what it says.
        if (lat is < -90 or > 90)
        {
            error = $"'lat' is {lat.ToString(CultureInfo.InvariantCulture)}, outside -90..90";
            return false;
        }

        if (lon is < -180 or > 180)
        {
            error = $"'lon' is {lon.ToString(CultureInfo.InvariantCulture)}, outside -180..180";
            return false;
        }

        if (!element.TryGetProperty("ts", out var ts) || ts.ValueKind != JsonValueKind.Number)
        {
            error = element.TryGetProperty("ts", out var wrong)
                ? $"'ts' is {Describe(wrong.ValueKind)}, expected a number"
                : "'ts' is missing";
            return false;
        }

        // TryGetInt64 rather than a cast off a double: past 2^53 a double no
        // longer holds every millisecond, and a value that does not survive
        // the round trip would produce a document id that is not the timestamp
        // that was sent.
        if (!ts.TryGetInt64(out var timestampMs))
        {
            error = $"'ts' is {ts.GetRawText()}, which is not a whole number of milliseconds in an int64";
            return false;
        }

        if (timestampMs < OldestAcceptedMs)
        {
            error = $"'ts' is {timestampMs.ToString(CultureInfo.InvariantCulture)}, which is before 1973 read "
                + "as epoch milliseconds — epoch seconds sent where milliseconds were expected look exactly "
                + "like this";
            return false;
        }

        if (timestampMs > NewestAcceptedMs)
        {
            error = $"'ts' is {timestampMs.ToString(CultureInfo.InvariantCulture)}, far past any real clock "
                + "read as epoch milliseconds — microseconds or nanoseconds sent where milliseconds were "
                + "expected look exactly like this";
            return false;
        }

        fix = new GpsFix(lat, lon, acc, alt, spd, timestampMs);
        error = string.Empty;
        return true;
    }

    /// <summary>lat and lon: present, a number, and never null.</summary>
    private static bool TryReadRequired(JsonElement element, string name, out double value, out string error)
    {
        value = 0;

        if (!element.TryGetProperty(name, out var property))
        {
            error = $"'{name}' is missing";
            return false;
        }

        if (property.ValueKind != JsonValueKind.Number)
        {
            error = $"'{name}' is {Describe(property.ValueKind)}, expected a number";
            return false;
        }

        return TryReadFinite(property, name, out value, out error);
    }

    /// <summary>
    /// acc, alt and spd: present as a key, but a number or a literal null.
    ///
    /// A missing key is still refused. All six are documented as always
    /// present, and treating an absent one as null would turn a truncated or
    /// half-built payload into a fix that reads as complete.
    /// </summary>
    private static bool TryReadOptional(JsonElement element, string name, out double? value, out string error)
    {
        value = null;

        if (!element.TryGetProperty(name, out var property))
        {
            error = $"'{name}' is missing; it is null when the fix did not carry the value, never absent";
            return false;
        }

        if (property.ValueKind == JsonValueKind.Null)
        {
            error = string.Empty;
            return true;
        }

        if (property.ValueKind != JsonValueKind.Number)
        {
            error = $"'{name}' is {Describe(property.ValueKind)}, expected a number or null";
            return false;
        }

        if (!TryReadFinite(property, name, out var number, out error))
        {
            return false;
        }

        value = number;
        return true;
    }

    /// <summary>
    /// JSON has no NaN or infinity literal, but a number too large for a
    /// double parses to infinity rather than failing — and an infinite
    /// coordinate would serialize back out as something no JSON reader accepts.
    /// </summary>
    private static bool TryReadFinite(JsonElement property, string name, out double value, out string error)
    {
        value = property.GetDouble();

        if (double.IsFinite(value))
        {
            error = string.Empty;
            return true;
        }

        error = $"'{name}' is {property.GetRawText()}, which is not a finite number";
        value = 0;
        return false;
    }

    private static string Describe(JsonValueKind kind) => kind switch
    {
        JsonValueKind.Null => "null",
        JsonValueKind.True or JsonValueKind.False => "a boolean",
        JsonValueKind.String => "a string",
        JsonValueKind.Array => "an array",
        JsonValueKind.Object => "an object",
        JsonValueKind.Number => "a number",
        _ => "undefined",
    };
}
