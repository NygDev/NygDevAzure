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
  for_each              = toset(["deploymentpackage-ps", "deploymentpackage-logger"])
  name                  = each.key
  storage_account_id    = azurerm_storage_account.consumption.id
  container_access_type = "private"
}

# FC1 Linux App Service Plans (one per Function App — FC1 allows only one app per plan)
resource "azurerm_service_plan" "consumption" {
  for_each = {
    powershell = "asp-nygdev-consumption-ps"
    logger     = "asp-nygdev-consumption-logger"
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
  daily_quota_gb      = 0.1
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
  storage_authentication_type = "SystemAssignedIdentity"
  instance_memory_in_mb       = 512
  maximum_instance_count      = 1
  http_concurrency            = 1
  runtime_name                = each.value.runtime_name
  runtime_version             = each.value.runtime_version

  identity {
    type = "SystemAssigned"
  }

  site_config {
    cors {
      allowed_origins = ["https://portal.azure.com"]
    }
  }

  app_settings = {
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.consumption.connection_string
    AzureWebJobsStorage__serviceUri       = azurerm_storage_account.consumption.primary_blob_endpoint
  }

  tags = local.common_tags
}

# Logger Function App — dotnet-isolated with Azure AD authentication
resource "azurerm_function_app_flex_consumption" "logger" {
  name                        = var.function_app_logger_name
  location                    = azurerm_resource_group.consumption.location
  resource_group_name         = azurerm_resource_group.consumption.name
  service_plan_id             = azurerm_service_plan.consumption["logger"].id
  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.consumption.primary_blob_endpoint}${azurerm_storage_container.consumption["deploymentpackage-logger"].name}"
  storage_authentication_type = "SystemAssignedIdentity"
  instance_memory_in_mb       = 512
  maximum_instance_count      = 1
  http_concurrency            = 1
  runtime_name                = "dotnet-isolated"
  runtime_version             = "10.0"

  identity {
    type = "SystemAssigned"
  }

  site_config {
    cors {
      allowed_origins = ["https://portal.azure.com"]
    }
  }

  app_settings = {
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.consumption.connection_string
    AzureWebJobsStorage__serviceUri       = azurerm_storage_account.consumption.primary_blob_endpoint
  }

  auth_settings_v2 {
    auth_enabled           = true
    require_authentication = true
    default_provider       = "azureActiveDirectory"

    active_directory_v2 {
      client_id            = "3b099f85-b92c-4f7a-ad5c-addd588d57ac"
      tenant_auth_endpoint = "https://login.microsoftonline.com/${var.tenant_id}/v2.0"
      allowed_audiences    = ["api://3b099f85-b92c-4f7a-ad5c-addd588d57ac"]
    }

    login {
      token_store_enabled = false
    }
  }

  tags = local.common_tags
}

moved {
  from = azurerm_function_app_flex_consumption.nygdev_ps
  to   = azurerm_function_app_flex_consumption.this["powershell"]
}

moved {
  from = azurerm_service_plan.consumption["ps"]
  to   = azurerm_service_plan.consumption["powershell"]
}
