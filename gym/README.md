# gym/

The gym logger's shipped content — the part of the app that is the same for
every user and changes when the code changes, rather than when the user trains.

## `exercises.json`

The exercise picker's built-in library. It is deliberately **not** in Cosmos:
`db/gym` holds what the user wrote, not what shipped with the app, and a list
identical for every user would be paid for on every read of every account.

Terraform uploads it to the CDN storage account beside the running dashboard
blob (`terraform/cdn.tf`), where it is anonymous-read and fetched directly by
the front end — one request, cached hard, no function invocation and no token.
The `gym_exercise_library_url` output is the URL.

Custom exercise names are not in here and never will be: they are the user's,
so they post inline with the entry and live on the session document.

## `templates.json`

The built-in **day templates** — named plans like Push or Lower A that the Plan
tab drops into a day of a block. Same argument as the file above, and the same
treatment: identical for every user, so it is a blob rather than a route, and
`gym_template_library_url` is the URL.

A template is `{id, name, plan}` and `plan` is exactly a day's:
`[{exerciseName, sets}]`. Sets only — no target weight and no target reps, for
the reason the API's README gives at length.

Two rules to keep when editing it:

- **Every `exerciseName` should be in `exercises.json`.** Nothing enforces it —
  a name that is not in the library is legal and simply shows as "Custom" — but
  a built-in template pointing at an exercise the built-in picker does not have
  is a loose end, not a feature.
- **Ids are `builtin_…` and are not reused.** The prefix is how the front end
  tells a shipped template from one the user saved (`template_…`, minted by the
  API), and it is what decides whether a row can be deleted.

The user's *own* saved templates are not here and cannot be: they are per
account, so they are `type = "template"` documents in `db/gym`, alongside that
user's blocks and sessions. Applying either kind copies the exercises into the
block, so editing this file changes what a new day can be filled with and never
touches a day somebody already filled.

The API the front end calls for everything else is documented in
`apifunctionapp/Gym/README.md`.

Editing it is a `terraform apply` — the blob's `content_md5` changes, and the
provider reuploads. Bumping `version` is not load-bearing; it is there so a
cached copy can say which one it is.
