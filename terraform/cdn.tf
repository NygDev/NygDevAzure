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
# CDN. The account itself is deliberately not managed by this configuration
# (see the data source above); the container is, because nothing else creates
# it.
#
# `blob` rather than `container`: the file is readable by anyone holding the
# URL, but the container cannot be listed. What is in it is aggregate
# distances, paces and heart rates for one person who is publishing them on
# purpose — and anonymous read is what lets the static site fetch it with no
# key, no token and no function call in between.
#
# If a `data` container already exists in the account, terraform will fail to
# create this rather than adopt it. Import it instead of deleting anything:
#   terraform import azurerm_storage_container.data \
#     /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.Storage/storageAccounts/nygdevcdn/blobServices/default/containers/data
# and check `terraform plan` before applying — an existing container may have
# been private, and this flips it to anonymous blob read.
#
# Browser CORS is not set here and cannot be: the allowed origins live on the
# account's blob service, and the account is out of this configuration's
# scope. A cross-origin fetch from run.nygard.dev needs that rule added on the
# account before it will work.
resource "azurerm_storage_container" "data" {
  name                  = "data"
  storage_account_id    = data.azurerm_storage_account.nygdevcdn.id
  container_access_type = "blob"
}
