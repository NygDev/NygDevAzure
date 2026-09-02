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
# collections into nygdev-cosmos-db / db / primary, and the endpoint that writes
# the phone's location spool into db / gps. Its Cosmos access is granted by the
# account-scoped role assignment below, which covers both and whatever comes
# next.
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

    # Where the running dashboard is published — the whole blob URI, so the app
    # builds one client from it and carries no account, container or file name
    # of its own. Composed from the account's own endpoint rather than typed
    # out, so it cannot drift from the account the role assignment below grants
    # against.
    DASHBOARD_BLOB_URL = "${data.azurerm_storage_account.nygdevcdn.primary_blob_endpoint}${azurerm_storage_container.data.name}/marathonprep.json"

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

    # Tenant requirement on Easy Auth: allow requests only from the issuer
    # tenant. The platform checks the `tid` claim against this list and answers
    # 403 to a token from anywhere else.
    #
    # An app setting rather than part of the auth_settings_v2 block below, and
    # not by preference — this is the only place Azure exposes the check. It is
    # absent from the auth v2 API object entirely, which is why the azurerm
    # provider has no argument for it and why a setting that reads like
    # configuration is carrying a security control. The value is a
    # comma-separated list of up to ten tenant ids.
    #
    # Derived from var.tenant_id rather than typed out so it cannot drift from
    # tenant_auth_endpoint below: "the issuer tenant" is a promise that the two
    # are the same tenant, and one literal copied to two places is how that
    # stops being true.
    WEBSITE_AUTH_AAD_ALLOWED_TENANTS = var.tenant_id

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

  # Easy Auth against the GymLog registration. The platform validates the bearer
  # token before the request reaches any function and hands the code the
  # resulting claims through the X-MS-CLIENT-PRINCIPAL headers — which is where
  # the /objectId partition key on the `gym` container is meant to come from.
  #
  # The registration itself is not managed here. It was created by hand in the
  # portal, and terraform only points at it, by client id, through
  # var.gymlog_client_id. Declaring it would mean the azuread provider and a
  # Microsoft Graph application grant on the apply workflow's identity — a much
  # wider permission than one registration justifies. The cost of the trade is
  # that everything on the Entra side is a manual change: the App ID URI, the
  # exposed scope, the redirect URIs. The gymlog_easy_auth_redirect_uri output
  # exists because of that, the same way whoop_redirect_uri does.
  #
  # Deliberately not enforced yet. require_authentication = false with
  # AllowAnonymous means every existing caller keeps working exactly as it does
  # today: the WHOOP callback, the GPS upload from the phone, the dashboard
  # timer, all of them anonymous. A request that does carry a token gets it
  # validated and the claims populated; a request that carries none is passed
  # through untouched rather than bounced to a login. So this turns on the
  # machinery without turning on the gate, which is what makes it safe to apply
  # before a single client knows how to sign in.
  #
  # Flipping require_authentication to true and unauthenticated_action to
  # "Return401" is what closes it later — and doing that shuts the door on the
  # anonymous callers above at the same instant, so those need their own answer
  # (a separate app, or an exclusion path) before it happens.
  auth_settings_v2 {
    auth_enabled           = true
    require_authentication = false
    unauthenticated_action = "AllowAnonymous"
    require_https          = true

    active_directory_v2 {
      client_id = var.gymlog_client_id

      # The v2.0 issuer. The registration has to agree with it — its manifest
      # needs requestedAccessTokenVersion 2, which is what the portal sets when
      # an app is created as single-tenant and left alone. At 1 the endpoint
      # mints v1 tokens that this validator rejects, and the failure surfaces
      # as a 401 with nothing in it to say why.
      tenant_auth_endpoint = "https://login.microsoftonline.com/${var.tenant_id}/v2.0"

      # Both spellings of the audience. A token minted for this app can carry
      # either the App ID URI or the bare client id in `aud` depending on how
      # the client asked for it, and accepting only one of them turns a working
      # sign-in into a 401 that looks like a broken token. The api:// form
      # assumes the registration's App ID URI was left at the default the
      # portal offers; if it was set to something else, that string belongs
      # here instead.
      allowed_audiences = [
        var.gymlog_client_id,
        "api://${var.gymlog_client_id}",
      ]

      # Client application requirement: allow requests only from this
      # application itself. The platform reads the `appid`/`azp` claim — which
      # names the client that obtained the token, not the resource it is for —
      # and rejects anything that is not GymLog with a 403.
      #
      # It is the same client id as above and means something different there.
      # allowed_audiences is who the token was minted *for*; this is who minted
      # it. A token for GymLog obtained by some other registration in the
      # directory satisfies the first check and fails this one, which is the
      # whole point of setting it.
      #
      # The consequence to know about: a front end has to sign in *as* this
      # registration, using this client id as its own. Giving the front end its
      # own registration later — a separate SPA app, say — puts that app's id in
      # `appid` and this check turns it away, so that day this list grows a
      # second entry rather than the front end quietly breaking.
      allowed_applications = [var.gymlog_client_id]

      # No client_secret_setting_name, and none is missing. A secret is what the
      # interactive /.auth/login/aad code exchange needs; this app validates
      # bearer tokens a front end already obtained, which needs no credential of
      # its own. Adding the interactive flow later means a secret in the vault
      # and an app setting naming it — not a value typed in here, which would
      # put it in state.
    }

    login {
      # No session cookie to keep. Every call carries its own token, so a token
      # store would be state the platform maintains for nobody.
      token_store_enabled = false
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

# Data-plane read/write on Cosmos for the api app. The account has
# local_authentication_enabled = false, so this Entra role assignment is the
# only way in — there are no keys to fall back on. Cosmos DB Built-in Data
# Contributor (…0002) is the read/write built-in role.
#
# Scoped to the account rather than to a container. This was two per-container
# assignments, one for primary and one for gps, and the narrow scope bought
# little for what it cost: the app is the only writer on nygdev-cosmos-db and
# will reach the containers that land there as they arrive, while a
# per-container grant has to be applied before the code that needs it or every
# write answers 403 — an ordering trap paid again on each new container.
#
# What the narrow scope did buy was a boundary against something that is not
# this app landing in the account. If that happens, this goes back to one
# assignment per container the app actually writes to.
#
# Replacing the two with this one is a destroy and a create, and terraform does
# not order them: an apply can briefly leave the app with no Cosmos access at
# all. Nothing is lost to that — the WHOOP sync runs again on its timer and the
# phone keeps its spool and resends — but a GPS upload or a sync landing inside
# the window will fail once.
resource "azurerm_cosmosdb_sql_role_assignment" "api_cosmos" {
  resource_group_name = azurerm_resource_group.databases.name
  account_name        = azurerm_cosmosdb_account.db.name
  role_definition_id  = "${azurerm_cosmosdb_account.db.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = azurerm_user_assigned_identity.api.principal_id
  scope               = azurerm_cosmosdb_account.db.id
}

# Write access on the data container for the api app, and on nothing else in
# that account. Scoped to the container rather than the account — the opposite
# of the Cosmos assignment above, and what makes the difference is what the two
# accounts hold: nygdev-cosmos-db holds this app's data and nothing else, while
# nygdevcdn also holds Foundry's media and the published LikeC4 site, neither of
# which is this app's business. Contributor rather than a reader role because
# the dashboard blob is rewritten in place on every build.
#
# Granted by hand and adopted by the Terraform Import workflow, like the
# container it is scoped to. azurerm_role_assignment fails on an assignment
# that already exists rather than adopting it, so an apply could never have
# been the thing that first put this in state.
resource "azurerm_role_assignment" "api_cdn_data" {
  # The container's own id is the Resource Manager id — which is what a role
  # assignment scope has to be — because the resource is declared with
  # storage_account_id rather than the older storage_account_name. That is also
  # what deprecated resource_manager_id: the two now say the same thing.
  scope                = azurerm_storage_container.data.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_user_assigned_identity.api.principal_id
}
