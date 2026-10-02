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

An exercise is `{name, equipment}` and, optionally, four fields that describe
what it is a substitute for. The front end reads them to suggest a swap when the
machine you wanted has eight people waiting for it:

| Field | What it says | Example |
| --- | --- | --- |
| `variationOf` | The same movement, done another way. Names the family's root — the "regular" one | `Preacher Curl` → `Bicep Curl` |
| `pattern` | The job the movement does, so different exercises can stand in for each other | `horizontal-push`, `hinge`, `curl` |
| `muscles` | What it trains, main muscle first, one to three of them | `Chin-up` → `["Lats", "Biceps", "Upper Back"]` |
| `group` | The muscle group it is planned against — one of gymbro's seven | `Chest`, `Posterior` |

All four are optional and absent reads as unknown, so a library without them —
an older cached copy, or the app's bundled fallback from before them — still
works and simply suggests less.

The swap sheet offers them in that order: the exercise's variations, then
others with its `pattern`, then whatever trains the same `muscles` — ranked by
overlap, with the main muscle on each side counting most, and shown with the
muscles they share. So a curl's same-muscle suggestions are a chin-up and a
close-grip pulldown, *Biceps*. `group` is deliberately not what that tier
uses: it is a planning bucket, and Arms holding biceps and triceps both made a
triceps pushdown a curl's "same muscle group". It is only the fallback for a
library too old to carry `muscles`.

`muscles` is a short list on purpose — what the exercise is *for*, not every
muscle that works during it — and its vocabulary is a closed one: Chest, Front
Delts, Side Delts, Rear Delts, Triceps, Biceps, Forearms, Lats, Upper Back,
Lower Back, Quads, Glutes, Hamstrings, Calves. A name spelled differently is a
muscle that matches nothing.

The logger bundles a copy of this file as its offline fallback
(`sites/gym/src/lib/library.ts` in nygdevweb), because a gym with no signal is
when a picker — and a swap sheet — can least afford to be empty. Change one and
change the other.

### Variations are exercises, not an attribute of one

A preacher curl is **its own exercise, linked to a parent**, rather than a
`variant: "preacher"` on a bicep curl. The reasons are the history it has to
produce:

- **Progress and top sets are tracked per variation.** Thirty kilos on a
  preacher bench and thirty standing are not the same lift; a chart that mixed
  them would show progress whenever you switched to the easier one. Keeping the
  names apart is what keeps gymbro's top-set chart honest.
- **What a variation counts toward is derived, not stored.** "Sets of arms this
  week" counts preacher curls through `group`, and a family rollup ("all
  curls") is a `variationOf` lookup away whenever a screen wants one.
- **Nothing on the wire changes.** A session entry is a name, and a variation
  is a name, so every session, plan and template ever written is still valid
  and nothing needs a migration.

Three rules keep the links useful:

- **Names are unique.** Equipment used to tell the two bench presses apart,
  but an entry stores only a name, so both were one exercise in history. The
  dumbbell one is now `Dumbbell Bench Press`; old sessions that say `Bench
  Press` read as the barbell lift, which is what the picker already showed them
  as.
- **Families are one level deep.** `variationOf` names a root, never another
  variation, and a variation shares its root's `group`.
- **A family is the same movement.** `Romanian Deadlift` has a `hinge` pattern
  like `Deadlift`, but it is a lift of its own with its own variations, not a
  deadlift done differently. The pattern is what still offers one for the
  other.

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

The timed templates — `Full Body` and `Upper Body`, each at `30 min`, `60 min`
and `90 min` — are sized by working sets, since sets are all a plan can say:
about two and a half minutes a set with its rest, and the remainder of the hour
or half hour left for warming up. That is ten, twenty and thirty sets. The
minutes are only in the name, so change the sets and the name stops being true.
`Upper Body` has no legs in it, and no hinge either: a Romanian Deadlift is a
leg day's exercise however much of it the back does.

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
