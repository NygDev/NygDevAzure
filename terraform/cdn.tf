data "azurerm_storage_account" "nygdevcdn" {
  name                = "nygdevcdn"
  resource_group_name = var.cdn_resource_group
}

# The container the API publishes the running dashboard into, as
# https://nygdevcdn.blob.core.windows.net/data/marathonprep.json
#
# A third thing out of an account that already serves two — Foundry media in
# `foundry`, the LikeC4 site in `$web`. It belongs here rather than in the
# API's own storage account because a browser on run.nygard.dev is what reads
# it, and this is the account that is already public and already fronted by the
# CDN.
#
# Read rather than declared, and deliberately so. The container was created by
# hand, like the account holding it, and azurerm_storage_container fails on one
# that already exists rather than adopting it — the same reason the Key Vault
# role assignment in security.tf is not declared either. Adopting it would mean
# a terraform import, not an add.
#
# A data source still earns its place over hardcoding the name: if the
# container is ever renamed or removed, the plan fails here rather than the
# app discovering it at 07:00 the next morning.
#
# Two things this configuration therefore does not control, and that the blob
# being publicly readable depends on:
#   - the container's public access level, which has to be blob (anonymous
#     read of a known URL, no listing) for run.nygard.dev to fetch it;
#   - blob-service CORS, which lives on the account and governs whether a
#     cross-origin fetch from run.nygard.dev is allowed at all.
data "azurerm_storage_container" "cdn_data" {
  name               = "data"
  storage_account_id = data.azurerm_storage_account.nygdevcdn.id
}
