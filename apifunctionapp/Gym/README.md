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
    "days": [{ "dayIndex": 0, "label": "Upper A" }]
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

`weeks` 3–8, `days` 2–6 labels; the position in the array is the `dayIndex`.
Creating is also switching — the new block becomes current in the same
transaction, so there is no separate activate call. **201** with
`{ok, mesocycle}`.

### `PATCH /gym/mesocycles/{mesoId}`

Same three fields, all optional; an absent one is left alone. Sending none is a
no-op rather than an error. **200** with the updated mesocycle.

Editing weeks or days never deletes a workout — sessions are keyed on their date
rather than their position, so cells outside the new bounds are simply hidden.

### `POST /gym/workouts` — Start

```jsonc
{ "date": "2026-09-03", "week": 2, "dayIndex": 1 }
```

No `mesoId`: the server reads the user's current block and checks `week` and
`dayIndex` against its actual shape.

- **201** `{ok, resumed: false, workout}` — a new draft.
- **200** `{ok, resumed: true, workout}` — today's draft on this same cell was
  already open and comes back as it stands, everything already logged in it.
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
- **Removing an exercise from a session.** Sets can be taken back one at a time;
  an entry cannot. The prototype has no such control either, so rather than
  invent the semantics it is left out — an entry with no sets contributes
  nothing to any total. If the picker turns out to need it, it is the same
  guarded shape as the set delete: `DELETE …/entries/{i}?expectedEntryCount=`.
- **Editing a logged set in place.** Delete it and log it again; both calls are
  guarded, so the pair is safe to retry.
- **Anything from the design's open questions** — deload flags, day templates,
  warm-up marking, a rest timer. Each is free to add to the stored shape when it
  is decided; none is assumed here.

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
