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

