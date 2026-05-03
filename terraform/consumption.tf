# Resource group for consumption-tier serverless resources
resource "azurerm_resource_group" "consumption" {
  name     = var.consumption_resource_group
  location = var.location
  tags     = local.common_tags
}

# Storage account required by Function Apps
resource "azurerm_storage_account" "consumption" {
  name                     = "nygdevfunc"
  resource_group_name      = azurerm_resource_group.consumption.name
  location                 = azurerm_resource_group.consumption.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  blob_properties {
    versioning_enabled  = false
    change_feed_enabled = false
    delete_retention_policy {
      days = 1
    }
    container_delete_retention_policy {
      days = 1
    }
  }

  tags = local.common_tags
}

# Storage containers for Flex Consumption deployment packages
resource "azurerm_storage_container" "consumption" {
  for_each              = toset(["deploymentpackage", "deploymentpackage-ps"])
  name                  = each.key
  storage_account_id    = azurerm_storage_account.consumption.id
  container_access_type = "private"
}

# FC1 Linux App Service Plans (one per Function App — FC1 allows only one app per plan)
resource "azurerm_service_plan" "consumption" {
  for_each = {
    dotnet     = "asp-nygdev-consumption-dotnet"
    powershell = "asp-nygdev-consumption-ps"
  }
  name                = each.value
  location            = azurerm_resource_group.consumption.location
  resource_group_name = azurerm_resource_group.consumption.name
  os_type             = "Linux"
  sku_name            = "FC1"
  tags                = local.common_tags
}

locals {
  apps = {
    dotnet = {
      name            = var.function_app_name
      runtime_name    = "dotnet-isolated"
      runtime_version = "10.0"
      container       = "deploymentpackage"
    }
    powershell = {
      name            = var.function_app_ps_name
      runtime_name    = "powershell"
      runtime_version = "7.4"
      container       = "deploymentpackage-ps"
    }
  }
}

resource "azurerm_log_analytics_workspace" "consumption" {
  name                = "log-nygdev-consumption"
  location            = azurerm_resource_group.consumption.location
  resource_group_name = azurerm_resource_group.consumption.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.common_tags
}

resource "azurerm_application_insights" "consumption" {
  name                = "appi-nygdev-consumption"
  location            = azurerm_resource_group.consumption.location
  resource_group_name = azurerm_resource_group.consumption.name
  workspace_id        = azurerm_log_analytics_workspace.consumption.id
  application_type    = "web"
  tags                = local.common_tags
}

# Flex Consumption Function Apps
resource "azurerm_function_app_flex_consumption" "this" {
  for_each                    = local.apps
  name                        = each.value.name
  location                    = azurerm_resource_group.consumption.location
  resource_group_name         = azurerm_resource_group.consumption.name
  service_plan_id             = azurerm_service_plan.consumption[each.key].id
  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.consumption.primary_blob_endpoint}${azurerm_storage_container.consumption[each.value.container].name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = azurerm_storage_account.consumption.primary_access_key
  instance_memory_in_mb       = 512
  maximum_instance_count      = 1
  http_concurrency            = 1
  runtime_name                = each.value.runtime_name
  runtime_version             = each.value.runtime_version

  identity {
    type = "SystemAssigned"
  }

  site_config {}

  app_settings = {
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.consumption.connection_string
  }

  tags = local.common_tags
}

moved {
  from = azurerm_function_app_flex_consumption.nygdev_dotnet
  to   = azurerm_function_app_flex_consumption.this["dotnet"]
}

moved {
  from = azurerm_function_app_flex_consumption.nygdev_ps
  to   = azurerm_function_app_flex_consumption.this["powershell"]
}

moved {
  from = azurerm_service_plan.consumption["ps"]
  to   = azurerm_service_plan.consumption["powershell"]
}
