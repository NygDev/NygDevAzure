using System.Globalization;
using System.Security.Cryptography;

namespace ApiFunctionApp.Gym;

/// <summary>
/// How a document in db/gym is named, in one place.
///
/// Every id is <c>{type}_{natural key}</c>, joined with an underscore rather
/// than a pipe because these appear in route segments — <c>GET
/// /api/gym/workouts/session_2026-09-03</c> — and an underscore needs no
/// percent-encoding. The prefix is not what queries filter on; <c>type</c> is.
/// It is there so a document says what it is at a glance, and so an id can be
/// rebuilt from a type and a natural key without ambiguity.
///
/// Two of the four natural keys are the caller's to construct, and that is the
/// point of them:
///
/// <list type="bullet">
/// <item>A user document is <c>user_{objectId}</c>, so "which block am I in" is
/// a point read with nothing looked up first.</item>
/// <item>A session is <c>session_{local date}</c>, so resuming today's workout
/// is a point read on today's date — no "which mesocycle, which cell was I on"
/// round trip in front of it.</item>
/// </list>
///
/// The mesocycle and the day template are the exceptions: their natural keys
/// are generated here, because nothing about either one is unique enough to
/// name it by. A template's name least of all — it is renameable, and two of
/// them may share one.
/// </summary>
internal static class GymIds
{
    public const string UserType = "user";
    public const string MesocycleType = "mesocycle";
    public const string SessionType = "session";
    public const string TemplateType = "template";

    private const string UserPrefix = "user_";
    private const string MesocyclePrefix = "meso_";
    private const string SessionPrefix = "session_";
    private const string TemplatePrefix = "template_";

    /// <summary>
    /// The date format a session is keyed on: ISO, and never anything else.
    ///
    /// Lexical order is chronological order under this format, which is what
    /// lets History sort on <c>c.id</c> — a single-property ORDER BY the range
    /// index already serves, with no composite index to declare. A day-first
    /// format would sort by day-of-month and buy nothing.
    /// </summary>
    private const string DateFormat = "yyyy-MM-dd";

    /// <summary>
    /// The oldest date a session may be filed under.
    ///
    /// Not a real constraint on anyone's training history — it is a guard
    /// against a client with a broken clock or a date field that never got
    /// filled in, both of which would otherwise mint a document nobody looks
    /// for again.
    /// </summary>
    private static readonly DateOnly OldestSessionDate = new(2020, 1, 1);

    public static string User(string objectId) => UserPrefix + objectId;

    public static string Mesocycle(string mesoId) => MesocyclePrefix + mesoId;

    /// <summary>
    /// The bare mesocycle id, as <c>user.currentMesoId</c> and
    /// <c>session.mesoId</c> carry it and as it appears in routes and query
    /// strings.
    ///
    /// References are stored without the prefix and the document's own id has
    /// it, which reads as an inconsistency and is the shape the data model
    /// specifies: the prefix belongs to the document, not to the identifier.
    /// This is the one place that has to know the difference.
    /// </summary>
    public static string StripMesocyclePrefix(string documentId) =>
        documentId.StartsWith(MesocyclePrefix, StringComparison.Ordinal)
            ? documentId[MesocyclePrefix.Length..]
            : documentId;

    /// <summary>
    /// The first session id for a date. A genuine two-a-day suffixes off this
    /// one — see <see cref="SessionOnDate"/>.
    /// </summary>
    public static string Session(DateOnly date) =>
        SessionPrefix + date.ToString(DateFormat, CultureInfo.InvariantCulture);

    /// <summary>
    /// The nth session on a date, one-based: the first is
    /// <c>session_2026-09-03</c> and the second <c>session_2026-09-03_2</c>.
    ///
    /// Suffixing only on collision is what keeps the common case constructible
    /// by the client. One session per day is how this is actually used, so the
    /// date alone is the id almost always, and the suffix exists because the
    /// alternative — refusing the second session of a day, or overwriting the
    /// first — is worse than an id the client has to be told.
    /// </summary>
    public static string SessionOnDate(DateOnly date, int ordinal) =>
        ordinal <= 1
            ? Session(date)
            : $"{Session(date)}_{ordinal.ToString(CultureInfo.InvariantCulture)}";

    /// <summary>
    /// Reads the phone's local date off a request body, or says what is wrong
    /// with it.
    ///
    /// The date is sent by the client and cannot be derived here. This API runs
    /// in UTC, and a 21:00 session in Oslo is already tomorrow in UTC for half
    /// the year — deriving it server-side would file evening workouts under the
    /// wrong day, and the day is the session's identity. So it comes from the
    /// device that knows what day it is where the user is standing.
    ///
    /// Which is also why the upper bound is generous: a phone can legitimately
    /// be a day ahead of UTC, and a user filing yesterday's session from bed is
    /// ordinary rather than suspicious. What is rejected is a date no clock
    /// produces.
    /// </summary>
    public static bool TryReadDate(string? value, out DateOnly date, out string error)
    {
        date = default;

        if (string.IsNullOrWhiteSpace(value))
        {
            error = "'date' is missing. Send the phone's own local date as YYYY-MM-DD — the server "
                + "runs in UTC and cannot work out what day it is where you are.";
            return false;
        }

        if (!DateOnly.TryParseExact(
                value,
                DateFormat,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var parsed))
        {
            error = $"'date' is '{value}', which is not YYYY-MM-DD. The format is not cosmetic: "
                + "session ids are the date, and ISO order is what makes them sort chronologically.";
            return false;
        }

        // A day either side of UTC today covers every timezone on the planet,
        // so anything past it is a clock rather than a traveller.
        var latest = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);

        if (parsed < OldestSessionDate || parsed > latest)
        {
            error = $"'date' is {value}, outside {OldestSessionDate.ToString(DateFormat, CultureInfo.InvariantCulture)} "
                + $"to {latest.ToString(DateFormat, CultureInfo.InvariantCulture)}. That range is a broken-clock "
                + "guard, not a limit on your training history — the upper end is already a day past UTC today "
                + "so that no real timezone falls outside it.";
            return false;
        }

        date = parsed;
        error = string.Empty;
        return true;
    }

    /// <summary>
    /// A new mesocycle id, bare: references carry it without the prefix.
    /// </summary>
    public static string NewMesocycleId() => NewUlid();

    /// <summary>
    /// A new template id, <em>with</em> its prefix — unlike a mesocycle id.
    ///
    /// Nothing references a template, so there is no second form of the
    /// identifier for a reference to carry, and the document id is what routes
    /// and responses use as-is. That is the session's shape rather than the
    /// mesocycle's, and it is the shape to copy when a new document type has no
    /// references pointing at it: one identifier, no strip-the-prefix rule to
    /// remember.
    /// </summary>
    public static string NewTemplateId() => TemplatePrefix + NewUlid();

    /// <summary>
    /// A ULID, lowercase Crockford base32.
    ///
    /// 48 bits of millisecond timestamp followed by 80 bits of randomness, so
    /// ids sort by the moment they were created and collide never in practice.
    /// The sort order is the reason for choosing this over a GUID: the data
    /// model leaves <c>createdAt</c> off the mesocycle and the template alike
    /// because nothing read it, and an id that is already in creation order
    /// means both lists get newest-first off the index Cosmos keeps on
    /// <c>id</c> anyway.
    /// </summary>
    private static string NewUlid()
    {
        // Crockford's alphabet: no I, L, O or U, so an id read aloud or copied
        // by hand has no character that can be confused for another.
        const string Alphabet = "0123456789abcdefghjkmnpqrstvwxyz";

        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        Span<byte> randomness = stackalloc byte[10];
        RandomNumberGenerator.Fill(randomness);

        // 128 bits as one big-endian buffer — the 48-bit timestamp first, so
        // the base32 encoding below comes out in time order.
        Span<byte> value = stackalloc byte[16];

        for (var i = 0; i < 6; i++)
        {
            value[5 - i] = (byte)(timestamp >> (8 * i));
        }

        randomness.CopyTo(value[6..]);

        // 26 characters of 5 bits each would be 130 bits and there are 128, so
        // the first character carries 3 bits — never above '7' — and the other
        // twenty-five follow in whole strides. Shifting a rolling window rather
        // than converting to a big integer keeps this allocation-free.
        Span<char> id = stackalloc char[26];
        var bitOffset = 0;

        for (var i = 0; i < 26; i++)
        {
            var bits = i == 0 ? 3 : 5;
            var accumulated = 0;

            for (var b = 0; b < bits; b++)
            {
                var byteIndex = bitOffset >> 3;
                var bit = (value[byteIndex] >> (7 - (bitOffset & 7))) & 1;
                accumulated = (accumulated << 1) | bit;
                bitOffset++;
            }

            id[i] = Alphabet[accumulated];
        }

        return new string(id);
    }

    /// <summary>
    /// Whether a string is safe to use as an id we were handed rather than one
    /// we built.
    ///
    /// Mesocycle and session ids arrive in route segments and query strings, so
    /// they reach Cosmos as a point-read key or as a query parameter. The
    /// parameter is bound rather than interpolated, so this is not an injection
    /// guard — it is a guard against ids Cosmos itself refuses (<c>/</c>,
    /// <c>\</c>, <c>#</c>, <c>?</c> and control characters are all illegal in a
    /// document id) coming back as an opaque 400 from the SDK instead of an
    /// answer that says which value was wrong.
    /// </summary>
    public static bool IsWellFormed(string? id) =>
        !string.IsNullOrWhiteSpace(id)
        && id.Length <= 255
        && id.All(c => char.IsAsciiLetterOrDigit(c) || c is '_' or '-' or '.' or ':');

    /// <summary>
    /// Whether a route segment names a session document and nothing else.
    ///
    /// A session id is the document id as-is — unlike a mesocycle id, which is
    /// prefixed before it reaches Cosmos — so the workout routes point-read,
    /// patch and delete whatever id they are handed. Without this check,
    /// <c>DELETE /gym/workouts/user_{oid}</c> would remove the caller's own
    /// pointer document, <c>DELETE /gym/workouts/meso_…</c> would remove a
    /// block out from under its sessions, and a submit would write a
    /// <c>status</c> onto a document that has none. All within the caller's
    /// own partition, but every one of them is a state this API otherwise
    /// promises it cannot produce.
    /// </summary>
    public static bool IsSessionId(string? id) =>
        IsWellFormed(id) && id!.StartsWith(SessionPrefix, StringComparison.Ordinal);

    /// <summary>
    /// Whether a route segment names a template document and nothing else.
    ///
    /// The same guard as <see cref="IsSessionId"/> and for the same reason: a
    /// template id reaches Cosmos as a point-write or delete key exactly as it
    /// arrived, so without this <c>DELETE /gym/templates/user_{oid}</c> would
    /// take the caller's own pointer document with it and a PUT at a session id
    /// would overwrite a logged workout with a template. Inside the caller's
    /// own partition in both cases, and both are states this API otherwise
    /// promises it cannot reach.
    /// </summary>
    public static bool IsTemplateId(string? id) =>
        IsWellFormed(id) && id!.StartsWith(TemplatePrefix, StringComparison.Ordinal);
}
