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

# Deployment artifact container for the azadmin function app
resource "azurerm_storage_container" "azadmin" {
  name                  = "azadmin-deploy"
  storage_account_id    = azurerm_storage_account.consumption.id
  container_access_type = "private"
}

# Azure admin automation — PowerShell 7.4 on Flex Consumption
resource "azurerm_function_app_flex_consumption" "azadmin" {
  name                = "func-nygdev-azadmin"
  resource_group_name = azurerm_resource_group.consumption.name
  location            = azurerm_resource_group.consumption.location
  service_plan_id     = azurerm_service_plan.flex_ps.id

  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.consumption.primary_blob_endpoint}${azurerm_storage_container.azadmin.name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = azurerm_storage_account.consumption.primary_access_key

  runtime_name    = "powershell"
  runtime_version = "7.4"

  instance_memory_in_mb  = 512
  maximum_instance_count = 1

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.consumption.connection_string
  }

  site_config {}

  tags = local.common_tags

  lifecycle {
    # Flex Consumption doesn't return APPLICATIONINSIGHTS_CONNECTION_STRING in
    # app_settings on read, and mirrors it into site_config; ignore both so
    # Terraform stops re-adding/clearing a value the platform already manages.
    ignore_changes = [
      app_settings["APPLICATIONINSIGHTS_CONNECTION_STRING"],
      site_config[0].application_insights_connection_string,
    ]
  }
}

# Grant azadmin blob contributor on the CDN storage account
resource "azurerm_role_assignment" "azadmin_cdn_storage" {
  scope                = data.azurerm_storage_account.nygdevcdn.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_function_app_flex_consumption.azadmin.identity[0].principal_id
}

# Deployment artifact container for the api function app
resource "azurerm_storage_container" "api" {
  name                  = "api-deploy"
  storage_account_id    = azurerm_storage_account.consumption.id
  container_access_type = "private"
}

# Placeholder .NET 10 isolated app on Flex Consumption — provisioned empty, no
# code deployed yet. App-specific settings (CORS, auth, data bindings) get
# added when something lands here; its Cosmos access is granted below.
resource "azurerm_function_app_flex_consumption" "api" {
  name                = "func-nygdev-api"
  resource_group_name = azurerm_resource_group.consumption.name
  location            = azurerm_resource_group.consumption.location
  service_plan_id     = azurerm_service_plan.flex_dotnet.id

  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.consumption.primary_blob_endpoint}${azurerm_storage_container.api.name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = azurerm_storage_account.consumption.primary_access_key

  runtime_name    = "dotnet-isolated"
  runtime_version = "10.0"

  instance_memory_in_mb  = 512
  maximum_instance_count = 1

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.consumption.connection_string
  }

  site_config {}

  tags = local.common_tags

  lifecycle {
    # Flex Consumption doesn't return APPLICATIONINSIGHTS_CONNECTION_STRING in
    # app_settings on read, mirrors it into site_config, and adds a hidden-link
    # tag when App Insights is connected; ignore all three so Terraform stops
    # fighting values the platform already manages.
    ignore_changes = [
      app_settings["APPLICATIONINSIGHTS_CONNECTION_STRING"],
      site_config[0].application_insights_connection_string,
      tags["hidden-link: /app-insights-resource-id"],
    ]
  }
}

# Data-plane read/write on the Cosmos container for the api app. The account
# has local_authentication_disabled, so this Entra role assignment is the only
# way in — there are no keys to fall back on. Cosmos DB Built-in Data
# Contributor (…0002) is the read/write built-in role; scoped to the primary
# container rather than the account, so the app can't reach anything else that
# lands in the account later.
resource "azurerm_cosmosdb_sql_role_assignment" "api_cosmos_primary" {
  resource_group_name = azurerm_resource_group.databases.name
  account_name        = azurerm_cosmosdb_account.db.name
  role_definition_id  = "${azurerm_cosmosdb_account.db.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = azurerm_function_app_flex_consumption.api.identity[0].principal_id
  scope               = "${azurerm_cosmosdb_account.db.id}/dbs/${azurerm_cosmosdb_sql_database.db.name}/colls/${azurerm_cosmosdb_sql_container.primary.name}"
}
