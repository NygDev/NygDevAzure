# The integrations app

WHOOP, the phone's GPS spool and the running dashboard, on
`func-nygdev-integrations`. Everything here is a copy of code that is still
live on `func-nygdev-api`, and will be until the cutover below.

## Why this exists

`func-nygdev-api` serves two kinds of caller that want opposite things from the
platform. The gym logger is a browser holding an Entra token. WHOOP's callback,
the phone's GPS upload and the manual dashboard trigger hold either nothing or
a function key — none of them can present a token, and Easy Auth knows nothing
about function keys, so requiring authentication in front of them would answer
401 before the host checked a single key.

That is why Easy Auth on the api app runs with `require_authentication = false`
and the gym endpoints are gated in code instead — correct, but resting on the
auth module staying on, since stripping a forgeable `X-MS-CLIENT-PRINCIPAL` is
what the module is doing for us. Move these endpoints here and the api app has
nothing anonymous left on it, so the platform gate can go on with no exclusion
list at all.

## What is a copy, and what is not

Every `.cs` file under `Gps/`, `Running/` and `Whoop/` is byte-identical to its
counterpart under `apifunctionapp/`, namespaces included. Keeping them
identical is the point: the two trees can be diffed to nothing, so the cutover
is a deletion rather than a merge, and nothing has to be re-reviewed.

The copy is complete, the two timer functions included. `Program.cs` is the
only hand-written file: the same registrations minus the gym logger's, which
stays where it is.

## func-nygdev-api is stopped, and has to stay that way

The timers are only safe to hold here because that app is stopped. Two apps
running `WhoopSyncTimer` would be two syncs against one WHOOP refresh token,
and WHOOP rotates it on every use — the app refreshing second finds its stored
token dead, and the fix is re-authorizing by hand. The extension's blob lease
would not save it: the lease is scoped to one app, and these are two.

So until `Gps/`, `Running/` and `Whoop/` are deleted from `apifunctionapp/`,
nothing may start that app again. Worth knowing that a deploy can do it
without anyone deciding to — `deploy-api-function-app.yml` fires on any push
to `master` touching `apifunctionapp/**`, and deploying to a stopped app is a
good way to find it running again.

The same stop takes the gym logger down with it: `gym.nygard.dev` and
`gymbro.nygard.dev` are served by that app, and they stay down until it comes
back. That is the cost of this window, and the reason to keep it short.

## While the copy lasts

Both apps can serve these endpoints at once. They share the `whoop-token`
secret, and `WhoopSecretStore` reads it from the vault on every refresh rather
than caching it, so a rotation by one app is visible to the other — the two
stay consistent as long as they do not refresh *concurrently*.

The api app's timers fire at `0 0 */6 * * *` (00:00, 06:00, 12:00, 18:00 UTC)
and `0 15 */6 * * *`. Triggering `whoop/sync` here in the minutes around those
is the one thing to avoid.

## The cutover

1. Point the WHOOP developer dashboard's redirect URL at this app — the
   `integrations_whoop_redirect_uri` terraform output is the string. The
   six-hourly sync keeps working without this: the `refresh_token` grant sends
   no `redirect_uri` (see `WhoopClient`), so only a fresh `whoop/authorize`
   needs it.
2. Point the phone at this app's `gps/locations`, with a key minted here —
   function keys are per app, so the one it holds today does not carry over.
3. Delete `Gps/`, `Running/` and `Whoop/` from `apifunctionapp/`, deploy it,
   and start it again — in that order, so the gym logger comes back on an app
   that no longer holds a timer.
4. Then the terraform follow-ups: repoint the `whoop_*` outputs, drop
   `KEY_VAULT_URI`, `WHOOP_*` and `DASHBOARD_BLOB_URL` from the api app, drop
   `azurerm_role_assignment.api_cdn_data`, and revoke `id-nygdev-api`'s
   out-of-band Key Vault Secrets Officer.
5. Last, and only after testing that a CORS preflight survives it:
   `require_authentication = true` with `Return401` on the api app.
