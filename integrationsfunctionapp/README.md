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

## What this app holds

WHOOP (the OAuth flow, a status check, the sync and its timer), the phone's GPS
spool, and the running dashboard with its own timer. `Program.cs` is the only
file that was written rather than moved: the same registrations as the api app
had, minus the gym logger's.

No Easy Auth and no CORS list, and neither is an omission. Nothing that calls
this app is a browser holding a token — the WHOOP callback is a top-level
redirect, the rest carry function keys, and `run.nygard.dev` reads the
dashboard off the CDN rather than through a function.

## What is left on the api app

`func-nygdev-api` is the gym logger and nothing else. Two things remain to
finish there, in this order:

1. **Turn the Easy Auth gate on** — `require_authentication = true` with
   `unauthenticated_action = "Return401"`, and no `excluded_paths`, which is
   what moving this code bought. Test the CORS preflight on a throwaway app
   first: a browser sends `OPTIONS` with no `Authorization` header, and if the
   auth module answers 401 to it, both front ends break at once and it reads
   as a CORS fault.
2. **Revoke the two grants `id-nygdev-api` no longer needs** — Storage Blob
   Data Contributor on the CDN `data` container, and Key Vault Secrets
   Officer. Both are revoked out of band and then removed from the
   configuration; the commands and the reasoning are in
   `terraform/consumption.tf` beside the assignment.

Narrowing that app's Cosmos grant from the account to `db/gym` is a third,
optional one. It is a destroy and a create rather than an edit, so it wants
its own change: the window it opens is now a failed write in front of somebody
mid-workout rather than a sync that retries.
