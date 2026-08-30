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
