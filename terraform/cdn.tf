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

# Read the azadmin function app's host keys to get the EventGrid system key
data "azurerm_function_app_host_keys" "azadmin" {
  name                = azurerm_function_app_flex_consumption.azadmin.name
  resource_group_name = azurerm_resource_group.consumption.name
}

# Wire blob created events on nygdevcdn to the cachecontrolauto function
resource "azurerm_eventgrid_system_topic_event_subscription" "cachecontrolauto" {
  name                = "evgs-nygdevcdn-cachecontrolauto"
  system_topic        = azurerm_eventgrid_system_topic.nygdevcdn_blob.name
  resource_group_name = var.cdn_resource_group

  included_event_types = ["Microsoft.Storage.BlobCreated"]

  webhook_endpoint {
    url = "https://${azurerm_function_app_flex_consumption.azadmin.default_hostname}/runtime/webhooks/EventGrid?functionName=cachecontrolauto&code=${data.azurerm_function_app_host_keys.azadmin.event_grid_extension_config_key}"
  }
}

