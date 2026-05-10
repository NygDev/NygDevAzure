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

# ---------------------------------------------------------------------------
# Flex Consumption plans (SKU: FC1)
# Free grant: 100,000 executions + 250,000 GB-s compute per month per
# subscription — no baseline cost, you only pay for what you use beyond that.
# Both runtimes (PowerShell 7.x and .NET 10 isolated) run on Linux under
# Flex Consumption.
# ---------------------------------------------------------------------------

# Intended for PowerShell 7.x function apps
resource "azurerm_service_plan" "flex_ps" {
  name                = "asp-nygdev-flex-ps"
  resource_group_name = azurerm_resource_group.consumption.name
  location            = azurerm_resource_group.consumption.location
  os_type             = "Linux"
  sku_name            = "FC1"
  tags                = local.common_tags
}

# Intended for .NET 10 isolated-worker function apps
resource "azurerm_service_plan" "flex_dotnet" {
  name                = "asp-nygdev-flex-dotnet"
  resource_group_name = azurerm_resource_group.consumption.name
  location            = azurerm_resource_group.consumption.location
  os_type             = "Linux"
  sku_name            = "FC1"
  tags                = local.common_tags
}

# Azure admin automation — PowerShell 7.4 on Flex Consumption
resource "azurerm_linux_function_app" "azadmin" {
  name                          = "func-nygdev-azadmin"
  resource_group_name           = azurerm_resource_group.consumption.name
  location                      = azurerm_resource_group.consumption.location
  service_plan_id               = azurerm_service_plan.flex_ps.id
  storage_account_name          = azurerm_storage_account.consumption.name
  storage_uses_managed_identity = true

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_stack {
      powershell_core_version = "7.4"
    }
  }

  tags = local.common_tags
}
