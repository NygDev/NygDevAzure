data "azurerm_storage_account" "nygdevcdn" {
  name                = "nygdevcdn"
  resource_group_name = var.cdn_resource_group
}

# Where the API publishes the running dashboard: one JSON blob, rewritten in
# place after every sync, served at
# https://nygdevcdn.blob.core.windows.net/data/marathonprep.json
#
# A third thing out of an account that already serves two — Foundry media in
# `foundry`, the LikeC4 site in `$web`. It belongs here rather than in the
# API's own storage account because a browser on run.nygard.dev is what reads
# it, and this is the account that is already public and already fronted by the
# CDN.
#
# The container was created by hand and adopted into state by the Terraform
# Import workflow, not created by an apply — terraform creates rather than
# adopts, and would have failed on one that already exists. The account around
# it stays unmanaged, as the data source above.
#
# `blob` rather than `container`: the file is readable by anyone holding the
# URL, but the container cannot be listed. What is in it is aggregate
# distances, paces and heart rates published on purpose — and anonymous read
# is what lets the static site fetch it with no key, no token and no function
# call in between. If the container was made private, the first plan after the
# import is where that shows up, as a change to this argument.
#
# Blob-service CORS is not set here and cannot be: the allowed origins live on
# the account, which this configuration reads rather than owns. A cross-origin
# fetch from run.nygard.dev needs that rule added on the account by hand.
resource "azurerm_storage_container" "data" {
  name                  = "data"
  storage_account_id    = data.azurerm_storage_account.nygdevcdn.id
  container_access_type = "blob"
}

# The gym logger's built-in exercise library, published at
# https://nygdevcdn.blob.core.windows.net/data/gym-exercises.json
#
# It is on the CDN rather than in Cosmos or behind the API because it is
# identical for every user and changes when the code ships, not when anyone
# trains: db/gym holds what the user wrote, and a list the same for everybody
# would be paid for on every read of every account. As a blob the front end
# fetches it once, anonymously, and caches it — no function invocation, no
# token, no RU. Custom exercise names are the user's and stay on the session
# document, posted inline with the entry.
#
# The file itself is gym/exercises.json in this repository, so the library is
# reviewed and versioned like code. content_md5 is what makes an edit to it a
# change terraform notices — without it the provider has no cheap way to tell
# the local file from the uploaded blob, and a reworded exercise would sit in
# the repo without ever reaching the CDN.
#
# One thing to know before the first apply: this is the only data-plane
# resource in this configuration. The container above and everything else are
# Resource Manager calls, but writing a blob is not, and the azurerm provider
# reaches it with an account key it fetches through listKeys. That works while
# the apply identity can list the account's keys and the account still allows
# them. If either stops being true the apply fails here alone, and the fix is
# `storage_use_azuread = true` on the provider plus Storage Blob Data
# Contributor for the apply identity on nygdevcdn — the same authentication the
# state backend already uses.
resource "azurerm_storage_blob" "gym_exercises" {
  name = "gym-exercises.json"

  # The container's Resource Manager id, which is what the v5 provider takes —
  # it replaced the older account-name/container-name pair, the same way
  # storage_account_id replaced storage_account_name on the container above.
  storage_container_id = azurerm_storage_container.data.id

  type        = "Block"
  source      = "${path.module}/../gym/exercises.json"
  content_md5 = filemd5("${path.module}/../gym/exercises.json")

  # Without this the blob is served as application/octet-stream, which a
  # browser fetch().json() still parses but which makes the URL useless to open
  # by hand — it downloads rather than displays.
  content_type = "application/json"

  # A day, because the library changes only on a deploy and the front end
  # should not re-fetch it on every cold load. Not longer: the front end has no
  # way to be told the list changed, so this interval is also the worst case
  # for a new exercise reaching a phone that has already loaded the app once.
  cache_control = "public, max-age=86400"
}

# The gym logger's built-in day templates, published at
# https://nygdevcdn.blob.core.windows.net/data/gym-templates.json
#
# A template is a named plan — Push, Lower A — that drops into a day of a block
# in the Plan tab. The built-in ones are here for the same reason the exercise
# library is: they are identical for every user and change when the code ships,
# so serving them per account through the API would be a function invocation, a
# token and an RU spent handing back the same ten objects.
#
# The user's *own* saved templates are not here and cannot be. They are written
# per account, so they are type = "template" documents in db/gym, in the same
# logical partition as that user's blocks and sessions — see
# apifunctionapp/Gym/GymTemplates.cs. The front end reads both and shows them
# in one picker; only that half needs a principal.
#
# Applying a template writes nothing on either side: it copies the exercises
# into the Plan tab's local draft, which saves with the block. So editing this
# file changes what a new day can be filled with and never touches a block
# somebody already filled.
resource "azurerm_storage_blob" "gym_templates" {
  name = "gym-templates.json"

  storage_container_id = azurerm_storage_container.data.id

  type        = "Block"
  source      = "${path.module}/../gym/templates.json"
  content_md5 = filemd5("${path.module}/../gym/templates.json")

  content_type = "application/json"

  # The same day the exercise library gets, and for the same reason — these two
  # files are fetched together on a cold load and change on the same deploys.
  cache_control = "public, max-age=86400"
}
