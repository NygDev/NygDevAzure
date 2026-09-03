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

The API the front end calls for everything else is documented in
`apifunctionapp/Gym/README.md`.

Editing it is a `terraform apply` — the blob's `content_md5` changes, and the
provider reuploads. Bumping `version` is not load-bearing; it is there so a
cached copy can say which one it is.
