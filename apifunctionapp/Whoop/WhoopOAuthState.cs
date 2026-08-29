using System.Buffers.Text;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace ApiFunctionApp.Whoop;

/// <summary>
/// The OAuth <c>state</c> parameter, as a self-verifying token.
///
/// State exists to prove that the code arriving at the callback belongs to an
/// authorization this app actually started. The usual way to do that is to
/// stash a random value in a session and compare on the way back, but this app
/// has no session store and its callback may land on a different instance than
/// the one that issued the redirect. So the state carries its own proof: an
/// issue time plus an HMAC of that time keyed on the WHOOP client secret.
/// Anyone can read it; only something holding the client secret can mint one.
///
/// The ten-minute window bounds replay — a state lifted out of a browser
/// history is useless once it expires, and the authorization it belonged to is
/// long finished by then anyway.
/// </summary>
public static class WhoopOAuthState
{
    private static readonly TimeSpan MaxAge = TimeSpan.FromMinutes(10);

    // Clocks between here and WHOOP are not exactly in step; allow a state to
    // look very slightly future-dated rather than rejecting a live flow.
    private static readonly TimeSpan MaxClockSkew = TimeSpan.FromMinutes(1);

    public static string Create(string signingKey, DateTimeOffset issuedAt)
    {
        var issued = issuedAt.ToUnixTimeSeconds().ToString(CultureInfo.InvariantCulture);
        return $"{issued}.{Base64Url.EncodeToString(Sign(signingKey, issued))}";
    }

    public static bool Validate(string? state, string signingKey, DateTimeOffset now)
    {
        if (string.IsNullOrEmpty(state))
        {
            return false;
        }

        var separator = state.IndexOf('.');
        if (separator <= 0 || separator == state.Length - 1)
        {
            return false;
        }

        var issued = state[..separator];
        if (!long.TryParse(issued, NumberStyles.None, CultureInfo.InvariantCulture, out var issuedSeconds))
        {
            return false;
        }

        byte[] presented;
        try
        {
            presented = Base64Url.DecodeFromChars(state.AsSpan(separator + 1));
        }
        catch (FormatException)
        {
            return false;
        }

        // Compare before looking at the clock, and in fixed time: a signature
        // check that returns early leaks how much of the digest matched.
        if (!CryptographicOperations.FixedTimeEquals(presented, Sign(signingKey, issued)))
        {
            return false;
        }

        var age = now - DateTimeOffset.FromUnixTimeSeconds(issuedSeconds);
        return age <= MaxAge && age >= -MaxClockSkew;
    }

    private static byte[] Sign(string signingKey, string payload) =>
        HMACSHA256.HashData(Encoding.UTF8.GetBytes(signingKey), Encoding.UTF8.GetBytes(payload));
}
