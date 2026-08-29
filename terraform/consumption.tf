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

# Identity for the api app. User-assigned rather than system-assigned so the
# principal exists independently of the app: its Cosmos role assignment can be
# made before the app is created and survives the app being recreated, where a
# system-assigned principal is destroyed with the app and every assignment
# naming it has to be rebuilt.
resource "azurerm_user_assigned_identity" "api" {
  name                = "id-nygdev-api"
  resource_group_name = azurerm_resource_group.consumption.name
  location            = azurerm_resource_group.consumption.location
  tags                = local.common_tags
}

# The API app — .NET 10 isolated on Flex Consumption. Hosts the WHOOP
# integration: the OAuth flow, a status check, and the sync that writes WHOOP's
# collections into nygdev-cosmos-db / db / primary. Its Cosmos access is
# granted by the role assignment below.
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
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.api.id]
  }

  app_settings = {
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.consumption.connection_string

    # The account endpoint the app builds its CosmosClient against. No key or
    # connection string: local auth is disabled on the account, so the app
    # authenticates with its managed identity via DefaultAzureCredential.
    COSMOS_ENDPOINT = azurerm_cosmosdb_account.db.endpoint

    # Which identity to authenticate as. A user-assigned identity has to be
    # named explicitly — unlike a system-assigned one, the platform can't infer
    # it, and a token request without a client id fails on an app that has no
    # system-assigned identity.
    MANAGED_IDENTITY_CLIENT_ID = azurerm_user_assigned_identity.api.client_id

    # WHOOP. The vault holds both secrets — whoop-clientsecret, copied from the
    # developer dashboard, and whoop-token, which the app rewrites every time
    # WHOOP rotates the refresh token. Neither appears here; the app reads them
    # at run time as id-nygdev-api, which is Key Vault Secrets Officer on the
    # vault (officer, not reader: the write-back is the whole point).
    KEY_VAULT_URI = azurerm_key_vault.nygdev.vault_uri

    # Public half of the WHOOP app registration — it rides along in the browser
    # on every authorization redirect, so it is configuration, not a secret.
    WHOOP_CLIENT_ID = var.whoop_client_id

    # Narrow this (via var.whoop_scopes) if the app registration is not granted
    # all of them — WHOOP refuses the entire authorization request when it is
    # asked for one scope the client does not hold, rather than dropping it.
    WHOOP_SCOPES = var.whoop_scopes

    # WHOOP_REDIRECT_URI is deliberately not set. It would have to contain this
    # app's own default_hostname, and an app setting on the app that reads that
    # attribute is a dependency cycle. The app builds the URL from the
    # platform's WEBSITE_HOSTNAME instead; the whoop_redirect_uri output below
    # is the same string, for pasting into the developer dashboard.

    # WEBSITE_TIME_ZONE is deliberately not set either, and should not be. It
    # is what would let the WhoopSyncTimer function write its NCRONTAB schedule
    # in local time rather than UTC, but Microsoft does not support it on Linux
    # under Flex Consumption — setting it there causes TLS errors and stops the
    # app's metrics. The timer runs on UTC instead.

    # AzureWebJobsStorage is not listed here either, and is not missing: the
    # timer trigger needs it for the blob lease that keeps one firing from
    # overlapping the next, and the azurerm provider derives it from the
    # storage account and storage_access_key above. Adding it by hand would
    # fight the value the provider injects on every apply.
  }

  site_config {
    # Browser calls come from the run.nygard.dev static site, a different
    # origin, so the platform has to stamp Access-Control-Allow-Origin onto the
    # function's responses — without it the browser discards the response and
    # reports a bare network failure. Listing the origins here is the only way
    # to get that header; the function code never sees the preflight.
    cors {
      allowed_origins = [
        "https://run.nygard.dev",

        # The Static Web App's own hostname, so the site still works when
        # opened there instead of through the custom domain (the deploy
        # pipeline publishes to the app, and DNS is a separate step).
        "https://${azurerm_static_web_app.nygdevrun.default_host_name}",
      ]

      # No cookies or Authorization header on the call, and support_credentials
      # would force an exact-origin echo we don't need.
      support_credentials = false
    }
  }

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
  principal_id        = azurerm_user_assigned_identity.api.principal_id
  scope               = "${azurerm_cosmosdb_account.db.id}/dbs/${azurerm_cosmosdb_sql_database.db.name}/colls/${azurerm_cosmosdb_sql_container.primary.name}"
}
