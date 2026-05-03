data "azurerm_storage_account" "nygdevcdn" {
  name                = "nygdevcdn"
  resource_group_name = var.cdn_resource_group
}

resource "azurerm_eventgrid_system_topic" "nygdevcdn_blob" {
  name                   = "evgt-nygdevcdn-blob"
  resource_group_name    = var.cdn_resource_group
  location               = var.location
  source_arm_resource_id = data.azurerm_storage_account.nygdevcdn.id
  topic_type             = "Microsoft.Storage.StorageAccounts"
  tags                   = local.common_tags
}

resource "azurerm_eventgrid_system_topic_event_subscription" "cachecontrolauto" {
  name                = "evgs-nygdevcdn-cachecontrolauto"
  system_topic        = azurerm_eventgrid_system_topic.nygdevcdn_blob.name
  resource_group_name = var.cdn_resource_group

  included_event_types = ["Microsoft.Storage.BlobCreated"]

  subject_filter {
    subject_begins_with = "/blobServices/default/containers/foundry/"
  }

  azure_function_endpoint {
    function_id = "${azurerm_function_app_flex_consumption.this["powershell"].id}/functions/cachecontrolauto"
  }
}

# The PS function calls Connect-AzAccount -Identity and writes blob headers on the
# foundry container. Scoped to the container (not the whole account) for least privilege.
resource "azurerm_role_assignment" "ps_func_nygdevcdn_foundry" {
  scope                = "${data.azurerm_storage_account.nygdevcdn.id}/blobServices/default/containers/foundry"
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_function_app_flex_consumption.this["powershell"].identity[0].principal_id
}
