using System.Text.Json;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// One WHOOP collection endpoint and how to identify a record in it.
///
/// The four collections are the same shape over the wire — a <c>records</c>
/// array and a <c>next_token</c> — so one pagination loop drives all of them.
/// What differs is the identity of a record, which is the reason this type
/// exists rather than a bare list of paths.
/// </summary>
public sealed record WhoopCollection(string Type, string Path, string IdProperty)
{
    public static readonly WhoopCollection Cycle = new("whoop_cycle", "/v2/cycle", "id");

    public static readonly WhoopCollection Sleep = new("whoop_sleep", "/v2/activity/sleep", "id");

    public static readonly WhoopCollection Workout = new("whoop_workout", "/v2/activity/workout", "id");

    /// <summary>
    /// The odd one out: WHOOP does not give a recovery an id of its own. A
    /// recovery belongs to exactly one cycle, so the cycle is its identity —
    /// which is also what makes re-syncing it idempotent.
    /// </summary>
    public static readonly WhoopCollection Recovery = new("whoop_recovery", "/v2/recovery", "cycle_id");

    public static readonly IReadOnlyList<WhoopCollection> All = [Cycle, Sleep, Workout, Recovery];

    /// <summary>
    /// Matches on the short name a caller passes as ?type= — "workout" as
    /// readily as the stored "whoop_workout".
    /// </summary>
    public static WhoopCollection? Find(string name) =>
        All.FirstOrDefault(c =>
            string.Equals(c.Type, name, StringComparison.OrdinalIgnoreCase)
            || string.Equals(c.Type["whoop_".Length..], name, StringComparison.OrdinalIgnoreCase));

    /// <summary>
    /// The document id for a record, or null when the field WHOOP is expected
    /// to key this collection by is missing or is not a value we can use.
    ///
    /// Cycle ids are integers where the rest are UUID strings, so the raw JSON
    /// text is taken for a number rather than assuming a string.
    /// </summary>
    public string? ReadId(JsonElement record)
    {
        if (record.ValueKind != JsonValueKind.Object
            || !record.TryGetProperty(IdProperty, out var id))
        {
            return null;
        }

        return id.ValueKind switch
        {
            JsonValueKind.String => id.GetString(),
            JsonValueKind.Number => id.GetRawText(),
            _ => null,
        };
    }
}
