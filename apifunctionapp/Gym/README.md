# The gym logger's API

What the front end calls, and the three behaviours it has to know about that
are not obvious from the route list. Everything here is served by
`func-nygdev-api` and stored in `nygdev-cosmos-db` / `db` / `gym`.

The data model behind it is `DATA-MODEL.md` in the design handoff bundle, and
`API-CHANGES.md` beside it is the delta from the prototype's turn 2b. This file
is the contract as built.

---

## Before anything else

**Base URL** — `https://func-nygdev-api.azurewebsites.net/api`. The
`api_function_app_hostname` terraform output is the authority on the host.

**Every call needs a bearer token.** The endpoints are anonymous at the
Functions level — a browser cannot keep a function key secret — and are gated
instead on the principal Easy Auth builds from the token. Sign in as the
**GymLog** registration (`gymlog_client_id`, `f6922f08-…`): the platform checks
both that the token was minted *for* that registration and that it was obtained
*by* it, so a front end with a registration of its own is turned away with a 403
until that client id is added to `allowed_applications` in
`terraform/consumption.tf`.

A call with no token, or one the platform rejected, gets **401
`not_signed_in`** from this API rather than a redirect.

**The user is the token.** Nothing takes a user id — the Entra object id off the
validated principal is the Cosmos partition key, and it is never read from a
route, a query string or a body.

**Errors are JSON.** `{ok: false, error: "<code>", message: "<prose>", detail}`.
Branch on `error`; the message is written to be shown or logged as-is.

---

## The three behaviours to build around

### 1. `alreadyRecorded` is success

`POST …/sets`, `POST …/entries` and `DELETE …/sets/{i}` each carry the count the
client believes the session holds. The write applies only while that is still
true, so a request whose response was lost and was retried cannot apply twice —
it comes back `200 {alreadyRecorded: true}` instead.

**Treat that as success.** It means the first attempt landed. It is what makes
the one-tap "Log same again" button safe to hammer, and it is the whole answer
to offline drafts: a queue of taps replayed on reconnect is safe by
construction, with no reconciliation to write.

A `409 count_mismatch` is the other outcome — the client's copy is stale. It
carries `expected` and `actual`; re-read the workout and log again from what it
holds. Nothing was written.

### 2. A cell can hold more than one session

Sessions are keyed on the calendar date, not on `(meso, week, dayIndex)`, so the
prototype's rule "re-logging a completed day overwrites it" is gone. Tapping
Start on a cell that already has a submitted workout files a **second** session
on today's date, with id `session_2026-09-03_2`.

This needs a UI answer that does not exist in the prototype: most likely the
block map cell shows the most recent session and offers a way to see or delete
the other. `DELETE /gym/workouts/{id}` is there for the second half of that.

### 3. The date comes from the phone

`POST /gym/workouts` takes `date` as `YYYY-MM-DD` **in the phone's timezone**.
The server cannot derive it — the API runs in UTC and a 21:00 session in Oslo is
already tomorrow in UTC for half the year, so a server-derived date would file
evening workouts under the wrong day. The date is the session's identity.

---

## The exercise library is not here

`GET /exercises` does not exist. The built-in library is identical for every
user and changes when the app ships, so it is a static file on the CDN:

```
https://nygdevcdn.blob.core.windows.net/data/gym-exercises.json
```

Anonymous-read, `Cache-Control: public, max-age=86400`. Fetch it once and cache
it. The source is `gym/exercises.json` in this repository; the
`gym_exercise_library_url` terraform output is the authority on the URL.

```jsonc
{
  "version": "2026-09-03",
  "equipment": ["Bar", "Dumbbell", "Cable", "Machine", "Bodyweight"],
  "exercises": [{ "name": "Bench Press", "equipment": "Bar" }]
}
```

Custom exercise names are not in it and never will be: they are the user's, so
they post inline with the entry.

---

## Routes

### `GET /gym/mesocycles/current`

Everything Today and the block map need, in one call.

```jsonc
{
  "ok": true,
  "mesocycle": {
    "id": "01k4…",                       // bare id — this is what routes take
    "name": "Meso 3 — Upper/Lower",
    "weeks": 5,
    "days": [
      {
        "dayIndex": 0,
        "label": "Upper A",
        "plan": [{ "exerciseName": "Bench Press", "sets": 3 }]
      }
    ]
  },
  "sessions": [
    {
      "id": "session_2026-09-03",
      "week": 2, "dayIndex": 1, "status": "submitted",
      "exerciseCount": 3, "setCount": 15, "volumeKg": 8760, "avgRpe": 7.6
    }
  ]
}
```

`"mesocycle": null` with an empty `sessions` is a **first run**, not an error —
nobody has planned a block yet. Sessions come back newest first.

### `POST /gym/mesocycles`

```jsonc
{ "name": "Autumn block", "weeks": 5, "days": ["Upper A", "Lower A"] }
```

`weeks` 3–8, `days` 2–6 entries; the position in the array is the `dayIndex`.
Creating is also switching — the new block becomes current in the same
transaction, so there is no separate activate call. **201** with
`{ok, mesocycle}`.

A day may be a bare label, as above, or an object carrying what it prescribes:

```jsonc
{
  "name": "Autumn block",
  "weeks": 5,
  "days": [
    { "label": "Upper A", "plan": [
      { "exerciseName": "Bench Press", "sets": 3 },
      { "exerciseName": "Barbell Row", "sets": 4 }
    ]},
    "Lower A"
  ]
}
```

Both shapes are ordinary; neither is a legacy path. `plan` is optional and an
absent one is empty, so renaming a day never requires restating what it does.

**The plan hangs off the day, not off a cell**, so every week's "Upper A"
shares it. That follows from days being labelled rather than scheduled, and it
keeps a block one small document instead of up to 48 planned ones. Planning a
single week differently — a deload week most of all — is what this gives up.

Targets are **a set count only**. No target weight and no target reps: both are
what a session discovers, and a prescribed one is stale the moment it is beaten.
Sets are bounded by the session's own cap, so a plan cannot prescribe something
the logging screen would refuse to record. At most 20 exercises to a day.

A `reps` sent on a planned exercise is **ignored**, not refused, and blocks
written while reps were planned still carry one — the field is dead rather than
wrong, so nothing needs backfilling. How hard a set should be is not planned
either: the front end reads a target of reps left in the tank off the week's
position in the block, ramping to none in the last training week and to a full
tank through the final week, which it treats as a deload. That is a function of
`weeks` and the session's `week`, both already on the wire, so the API neither
stores nor sends it.

### `PATCH /gym/mesocycles/{mesoId}`

Same three fields, all optional; an absent one is left alone. Sending none is a
no-op rather than an error. **200** with the updated mesocycle.

`days` is replaced **wholesale** when it is sent, plans included — so sending
bare labels for a block that had plans clears them. That is why the Plan tab
sends back the whole array it is holding rather than a diff.

Editing weeks or days never deletes a workout — sessions are keyed on their date
rather than their position, so cells outside the new bounds are simply hidden.

### `GET /gym/mesocycles`

Every block this user has planned, newest first — the Plan tab's block list.

```jsonc
{
  "ok": true,
  "mesocycles": [
    {
      "id": "01k4…",
      "name": "Meso 3 — Upper/Lower",
      "weeks": 5,
      "days": [{ "dayIndex": 0, "label": "Upper A" }],
      "isCurrent": true,
      "sessionCount": 14,
      "submittedCount": 13
    }
  ]
}
```

An empty array is a **first run**, the same as `"mesocycle": null` on
`/current`. Sorted by id, which is a ULID, so newest-first costs nothing.

The two counts are there so the delete below can say what it is about to take.
Volume is deliberately not — it needs the sets, and the sets are the expensive
half of a session document. A confirmation that wants to say "8.4t of recorded
volume" reads `GET /gym/workouts?mesoId=` for the one block it is asking about,
rather than every block paying for it on every list.

### `PUT /gym/mesocycles/current`

```jsonc
{ "mesoId": "01k4…" }
```

Points the user at an existing block. **200** with `{ok, mesocycle}`.

Creating a block already switches to it in the same transaction, so this exists
for the case that had no answer before there was a list: opening one of the
others. Idempotent — switching to the block you are on writes what is already
there.

**404 `no_such_mesocycle`** if the id is not in this user's log. The read in
front of the write is the point: a pointer naming a block that is not there is
the one state `/current` cannot answer, and it reports that as a 500
`dangling_mesocycle` precisely because nothing here is supposed to produce it.

### `DELETE /gym/mesocycles/{mesoId}`

Deletes a block **and every session logged in it**.

```jsonc
{ "ok": true, "id": "01k4…", "deleted": true, "sessionsDeleted": 14, "currentMesoId": "01k3…" }
```

Read that cascade before calling it. Everywhere else this API goes out of its
way not to destroy a logged workout — re-logging a day files a second session
rather than overwriting the first, because losing one to a mistyped tap is the
worse failure. This call is the deliberate exception, and it is deliberate
because refusing while the block holds anything would make clearing a
mis-created block a session-by-session chore.

**So the confirmation is the client's, and it is not optional.** There is no
undo here and no soft delete anywhere in this API. `sessionCount` on the list
above is what a confirmation names; `GET /gym/workouts?mesoId=` is where the
volume behind it comes from.

`currentMesoId` says where the pointer landed. Deleting the block you are
standing in repoints it at the newest block left, or clears it when there is
none — which is the first-run state rather than a broken one, so the field is
`null` both when nothing moved and when nothing is left. Either way it is there
so the client does not have to guess whether to reload.

**Safe to retry.** Sessions are deleted first and the block document last, so
an interrupted cascade leaves a block that still lists and still opens holding
fewer sessions; a second call finishes it. A call for a block already gone is a
**404 `no_such_mesocycle`**, which after a lost response is the retry finding
the first one finished.

It is batched rather than atomic — Cosmos caps a transactional batch at 100
operations and a block can hold up to 480 sessions, ten to a date across 48
cells. Each batch is atomic; the sequence is resumable, which the ordering
above is what makes acceptable.

### `POST /gym/workouts` — Start

```jsonc
{ "date": "2026-09-03", "week": 2, "dayIndex": 1 }
```

No `mesoId`: the server reads the user's current block and checks `week` and
`dayIndex` against its actual shape.

- **201** `{ok, resumed: false, workout}` — a new draft, opened with one entry
  per exercise the day plans and no sets against them. Seeding it here is what
  keeps Start one round trip instead of an entry POST per planned exercise, and
  it means the entry indexes a client logs against are the ones it was just
  handed. The **targets are not copied onto the session** — they stay on the
  block, which the client already holds, so there is no second place for them
  to be wrong after the plan is edited.
- **200** `{ok, resumed: true, workout}` — today's draft on this same cell was
  already open and comes back as it stands, everything already logged in it.
  **Not re-seeded**: it already has whatever the plan gave it when it was
  created, and seeding again would duplicate the planned exercises every time
  Start was tapped twice.
  This is Start tapped twice, or an app returning from the background.
- **409 `no_current_mesocycle`** — plan a block first.
- **409 `date_full`** — ten sessions on one date; a client that lost its id.

`workout` is the full session shape below.

### `GET /gym/workouts/{sessionId}`

The workout detail screen, and how a client resyncs after a `409`.

```jsonc
{
  "ok": true,
  "workout": {
    "id": "session_2026-09-03",
    "mesoId": "01k4…",
    "week": 2, "dayIndex": 1, "status": "draft",
    "entries": [
      {
        "exerciseName": "Back squat",
        "sets": [{ "weightKg": 100, "reps": 5, "rpe": 7.5 }]
      }
    ],
    "totals": { "exerciseCount": 1, "setCount": 1, "volumeKg": 500, "avgRpe": 7.5 }
  }
}
```

The id is constructible: `session_` plus today's date resumes a draft directly,
with no "which block, which cell was I on" lookup in front of it. It only
exists once Start has created it.

### `GET /gym/workouts?mesoId=`

History. Without `mesoId`, the current block. Same session summaries as
`/mesocycles/current`, newest first, grouped into weeks client-side off `week`.

### `POST /gym/workouts/{id}/entries` — the picker

```jsonc
{ "exerciseName": "Back squat", "expectedEntryCount": 0 }
```

`expectedEntryCount` is how many exercises the session had before the tap.
**200** `{ok, alreadyRecorded, entryIndex, entryCount, exerciseName}` —
`entryIndex` is what sets are logged against.

### `POST /gym/workouts/{id}/sets` — the tap

```jsonc
{ "entryIndex": 0, "expectedSetCount": 2, "weightKg": 100, "reps": 5, "rpe": 7.5 }
```

`rpe` is optional (absent or `null`); when given it is 5–10 on a half step.
**200** `{ok, alreadyRecorded, entryIndex, setIndex, setCount}`.

**409 `no_such_entry`** means the entry index is not in the session — add the
exercise first.

### `DELETE /gym/workouts/{id}/entries/{entryIndex}/sets/{setIndex}?expectedSetCount=`

`expectedSetCount` is required, and for a reason: an unguarded remove-by-index
is the one operation here that a retry could turn into deleting a set the user
did do. **200** `{ok, alreadyRemoved, entryIndex, setCount}`.

### `POST /gym/workouts/{id}/submit`

Flips `draft` → `submitted`. One patch, idempotent, safe to retry.
**200** `{ok, id, status: "submitted"}`.

### `DELETE /gym/workouts/{id}`

Removes a workout — the answer to the duplicate a cell can now collect.
**200** `{ok, id, deleted: true}`.

---

## Deliberately absent

- **`GET /exercises`** — see above; it is a CDN file.
- **Copying a block.** There is no copy route and does not need to be one:
  `POST /gym/mesocycles` already takes a name, a week count and day labels, so
  copying is the client sending back the shape it is looking at. The new block
  becomes current in the same transaction, which is what copying one is for.
- **Undoing a block delete.** Nothing here is soft-deleted, so there is nothing
  to undo with. The count on the list is what makes the confirmation
  answerable, and the confirmation is the whole safety mechanism.
- **Removing an exercise from a session.** Sets can be taken back one at a time;
  an entry cannot. The prototype has no such control either, so rather than
  invent the semantics it is left out — an entry with no sets contributes
  nothing to any total. If the picker turns out to need it, it is the same
  guarded shape as the set delete: `DELETE …/entries/{i}?expectedEntryCount=`.
- **Editing a logged set in place.** Delete it and log it again; both calls are
  guarded, so the pair is safe to retry.
- **The rest of the design's open questions** — deload flags, warm-up marking,
  a rest timer. Day templates were one of these and are now the `plan` on a
  day; the others are still free to add to the stored shape when they are
  decided, and none is assumed here.
- **Enforcing a plan.** Nothing checks a logged set against what the day
  prescribed. A seeded session is an ordinary session whose entries happen to be
  there already; what is logged is what was lifted, and an exercise can be added
  or left empty regardless of the plan.

---

## Error codes

| Status | `error` | Meaning |
| --- | --- | --- |
| 400 | `invalid_json`, `invalid_request` | The body, or a route or query value. `message` names the field, what arrived and what was expected. |
| 401 | `not_signed_in` | No validated principal. Sign in again. |
| 404 | `no_such_workout`, `no_such_mesocycle` | Not in this user's log. |
| 409 | `count_mismatch` | Stale client state. Carries `expected` and `actual`; re-read and retry. Nothing was written. |
| 409 | `no_such_entry` | The entry index is not in the session. |
| 409 | `no_current_mesocycle`, `date_full` | See Start, above. |
| 500 | `unreadable_document`, `dangling_mesocycle` | A stored document does not match what the code writes. Not retryable. |
| 502 | `storage_error` | Cosmos refused. `message` carries the hint for which cause. |
| 503 | `timed_out` | Over the ten second budget. Every write here is safe to retry. |

---

## Volume and RPE are derived

They are never stored — they are summed from the sets on the way out, which is
why the session list reads the entries arrays. A block is at most 48 documents
of about 2 KB in one partition, so it is tens of RU. The day History feels slow
is the day a stored `totals` field is worth its backfill; nothing about the wire
shape changes then.
