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

# The API app — .NET 10 isolated on Flex Consumption. The gym logger, and
# since the split nothing else: it reads and writes one user's training block
# in nygdev-cosmos-db / db / gym. WHOOP, the phone's GPS spool and the running
# dashboard moved to func-nygdev-integrations further down.
#
# Its Cosmos access is granted by the role assignment below, scoped to db/gym
# and nothing else — so the identity cannot reach db/primary or db/gps even
# though they sit in the same account.
#
# Every endpoint is at Anonymous auth level on purpose — a browser front end
# cannot hold a function key — and gated instead by the Easy Auth block further
# down plus an explicit check in the code: every gym function refuses a request
# that arrives without a validated principal, because the object id off that
# principal is the Cosmos partition key and therefore the whole tenancy
# boundary. See GymPrincipal in apifunctionapp/Gym.
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

    # AzureWebJobsStorage is not listed here, and is not missing: the azurerm
    # provider derives it from the storage account and storage_access_key
    # above, and adding it by hand would fight the value injected on every
    # apply. Nothing here leases a blob any more — the timers went to
    # func-nygdev-integrations with WHOOP and the dashboard — but the host
    # still expects the setting.
    #
    # The WHOOP_REDIRECT_URI and WEBSITE_TIME_ZONE notes that used to sit here
    # went with those functions; they are on the integrations app now, which is
    # where the reasoning applies.
  }

  site_config {
    # Browser calls come from the static sites, each a different origin, so the
    # platform has to stamp Access-Control-Allow-Origin onto the function's
    # responses — without it the browser discards the response and reports a
    # bare network failure. Listing the origins here is the only way to get that
    # header; the function code never sees the preflight.
    cors {
      allowed_origins = [
        # The gym logger. Its calls carry an Authorization header, which costs
        # nothing here: a bearer header is a request header the platform
        # reflects in Access-Control-Allow-Headers on the preflight rather than
        # a credential in the CORS sense. Cookies are what support_credentials
        # is about, and there are none — every call carries its own token and
        # the Easy Auth token store is off.
        #
        # run.nygard.dev and its Static Web App hostname used to be listed
        # here and are not missing: that page reads marathonprep.json straight
        # off the CDN and has never called a function. Its own CSP says so —
        # connect-src in sites/run/staticwebapp.config.json names the blob
        # endpoint alone.
        "https://gym.nygard.dev",
        "https://${azurerm_static_web_app.nygdevgym.default_host_name}",

        # The desktop planner, on the same terms. It reads and writes the same
        # /gym routes as the logger with the same bearer token — a different
        # origin is the only thing about it this list cares about, and an origin
        # missing from here is a browser discarding a 200 and reporting a bare
        # network failure.
        "https://gymbro.nygard.dev",
        "https://${azurerm_static_web_app.nygdevgymbro.default_host_name}",
      ]

      # No cookies on the call, and support_credentials would force an
      # exact-origin echo we don't need.
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
  # Enforced, finally, and with no excluded_paths — which is what the split was
  # for. This ran with require_authentication = false for as long as the WHOOP
  # callback, the phone's GPS upload and the dashboard trigger shared the app:
  # none of them can present a token, so the gate would have shut the door on
  # them in the same instant. Exempting them by path was the alternative, and a
  # poor one, because excluded_paths is documented against the login redirect
  # rather than a 401 — relying on it would have meant proving by experiment
  # that it does anything at all here. Moving them to func-nygdev-integrations
  # left nothing to exempt.
  #
  # Return401 rather than RedirectToLoginPage because every caller is a fetch
  # from a front end that already holds a token. A redirect would arrive at the
  # browser as an opaque failure on an XHR; a 401 is something the client can
  # act on, and it matches what GymEndpoint already answers.
  #
  # The one thing to watch after applying this is the CORS preflight. A browser
  # sends OPTIONS with no Authorization header, so if the auth module answers
  # 401 to it, both front ends stop working at once and it reads as a CORS
  # fault rather than an auth one. Test it directly rather than through the
  # site, because the browser will not tell you which of the two it was:
  #
  #   curl -i -X OPTIONS \
  #     https://func-nygdev-api.azurewebsites.net/api/gym/workouts \
  #     -H 'Origin: https://gym.nygard.dev' \
  #     -H 'Access-Control-Request-Method: GET' \
  #     -H 'Access-Control-Request-Headers: authorization'
  #
  # A 200 or 204 carrying Access-Control-Allow-Origin is what it should be. A
  # 401 means the module is gating preflight, and the fix is to put these two
  # arguments back the way they were — the code-side gate is unaffected either
  # way, so reverting costs nothing but the platform's belt on top of it.
  #
  # Because that is the point worth keeping hold of: GymPrincipal is not made
  # redundant by this. The gate establishes that a token was valid. That check
  # establishes which user it was for, which is the Cosmos partition key, and
  # it is still the only thing between the training logs and a forged header if
  # auth_enabled is ever turned off — a config change rather than a deploy.
  auth_settings_v2 {
    auth_enabled           = true
    require_authentication = true
    unauthenticated_action = "Return401"
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
# Scoped to db/gym, which is every container this app has code for. It was
# account-scoped while this app also ran WHOOP, the GPS spool and the dashboard
# — three containers and an argument that the app was the only writer on the
# account anyway. That stopped being true when the integrations app got its own
# identity, and an account-scoped grant now means each app's identity can read
# the other's data. For this one that is the training logs, which is the thing
# the whole tenancy boundary exists to protect.
#
# The cost of the narrow scope is the ordering trap it always had: a new
# container needs its grant applied before the code that writes it, or every
# write answers 403. That is the right trade here — this app has had exactly
# one container for its whole life as a gym logger.
resource "azurerm_cosmosdb_sql_role_assignment" "api_cosmos" {
  resource_group_name = azurerm_resource_group.databases.name
  account_name        = azurerm_cosmosdb_account.db.name
  role_definition_id  = "${azurerm_cosmosdb_account.db.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = azurerm_user_assigned_identity.api.principal_id

  # Account id plus the data-plane path. Not the container's ARM id, which
  # spells the same containment as /sqlDatabases/db/containers/gym and is not
  # what this API accepts. Built from the resources rather than typed so a
  # rename cannot leave a grant pointing at a container that is gone.
  scope = "${azurerm_cosmosdb_account.db.id}/dbs/${azurerm_cosmosdb_sql_database.db.name}/colls/${azurerm_cosmosdb_sql_container.gym.name}"

  lifecycle {
    # Scope is ForceNew, so narrowing this is a replacement. Without this the
    # order is terraform's to choose and the app can be left with no access at
    # all in between; with it the narrow grant is created before the broad one
    # is destroyed, and the overlap is two valid grants rather than none.
    #
    # It does not close the window completely, and nothing in terraform can: a
    # data-plane assignment takes a few minutes to become effective, while a
    # revocation is immediate. So the new grant may still be propagating when
    # the old one goes. Apply this when nobody is mid-session — the failure
    # looks like a 403 on a logged set, and the client's answer to that is to
    # show it rather than to retry.
    create_before_destroy = true
  }
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
#
# Nothing on this app writes that blob any more — the running dashboard went
# to func-nygdev-integrations, which holds its own grant on the same container.
# This is kept rather than deleted because deleting it is not free: the
# resource is in state, so removing it from the configuration asks the apply
# workflow to destroy a role assignment, and that identity has already been
# refused roleAssignments/write once, on rg-nygdev-security. Discovering it
# cannot delete this one either, in the middle of an apply, is a worse way to
# find out than choosing when to.
#
# So it is revoked out of band, then removed from here and from the import
# step in .github/workflows/terraform-import.yml that adopts it:
#
#   az role assignment delete \
#     --assignee $(az identity show \
#       --resource-group rg-nygdev-consumption \
#       --name id-nygdev-api \
#       --query principalId --output tsv) \
#     --role "Storage Blob Data Contributor" \
#     --scope $(az storage account show --name nygdevcdn \
#       --query id --output tsv)/blobServices/default/containers/data
#
# The same is true of id-nygdev-api's Key Vault Secrets Officer, which was
# never declared here at all — see security.tf.
resource "azurerm_role_assignment" "api_cdn_data" {
  # The container's own id is the Resource Manager id — which is what a role
  # assignment scope has to be — because the resource is declared with
  # storage_account_id rather than the older storage_account_name. That is also
  # what deprecated resource_manager_id: the two now say the same thing.
  scope                = azurerm_storage_container.data.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_user_assigned_identity.api.principal_id
}

# ---------------------------------------------------------------------------
# The integrations app — the other half of func-nygdev-api, pre-created.
#
# WHOOP, the phone's GPS spool and the running dashboard, split off from
# func-nygdev-api so the two halves stop having to share one answer to "must a
# caller be signed in".
#
# Sharing that answer was the whole problem. Easy Auth on the api app ran with
# require_authentication = false because the WHOOP callback has to be reachable
# by WHOOP, and the GPS upload by a phone holding a function key — so the
# platform gate could not be turned on for the gym endpoints without shutting
# the door on both in the same instant. With those callers here, that app has
# nothing anonymous left and its gate is on, with no exclusions at all: no
# excludedPaths list, whose documented behaviour covers the login redirect
# rather than a 401 and would have had to be verified by experiment, and no
# exempt path for a future endpoint to be written into by accident.
#
# The code has moved and so have the callers: the WHOOP developer dashboard's
# redirect URL and the phone's GPS upload URL both name this app now, and
# deploy-integrations-function-app.yml publishes to it. Key Vault Secrets
# Officer for id-nygdev-integrations was granted out of band — see the note at
# the end of this block for the command and why it is not a resource here.
#
# What is left is on the api app rather than this one: turning its Easy Auth
# gate on, and revoking the two grants id-nygdev-api no longer needs.
# ---------------------------------------------------------------------------

# A third plan for a third app, and not by preference: Flex Consumption permits
# exactly one app per plan, so an app is a plan whatever its runtime. (That is
# also the real reason flex_ps and flex_dotnet are two plans rather than one —
# the runtime is set on the app, not here.)
#
# The plan costs nothing standing. Flex bills execution time plus an always-
# ready baseline, and there are no always-ready instances on this app, so an
# idle plan bills zero.
resource "azurerm_service_plan" "flex_integrations" {
  name                = "asp-nygdev-flex-integrations"
  resource_group_name = azurerm_resource_group.consumption.name
  location            = azurerm_resource_group.consumption.location
  os_type             = "Linux"
  sku_name            = "FC1"
  tags                = local.common_tags
}

# Deployment artifact container for the integrations function app
resource "azurerm_storage_container" "integrations" {
  name                  = "integrations-deploy"
  storage_account_id    = azurerm_storage_account.consumption.id
  container_access_type = "private"
}

# Its own identity rather than a second app on id-nygdev-api, because the point
# of the split is that these two apps stop sharing things. Sharing the identity
# would leave the gym app's principal holding Key Vault Secrets Officer and the
# integrations app's principal holding read/write on db/gym — each with the
# other's rights and no use for them.
#
# It also leaves room to narrow id-nygdev-api afterwards: once WHOOP lives
# here, that identity has no reason to keep its vault access or its grant on
# the CDN data container.
resource "azurerm_user_assigned_identity" "integrations" {
  name                = "id-nygdev-integrations"
  resource_group_name = azurerm_resource_group.consumption.name
  location            = azurerm_resource_group.consumption.location
  tags                = local.common_tags
}

# WHOOP, GPS and the running dashboard, once they move. .NET 10 isolated on
# Flex Consumption, same as the app it is splitting from — the code is the same
# code, so the runtime has to be.
#
# No auth_settings_v2 block, and that is the point of this app rather than an
# omission: everything destined for it authenticates as something other than an
# Entra user. The WHOOP callback is anonymous because WHOOP redirects a browser
# to it with a code; the rest are at Function auth level and carry a key. Easy
# Auth knows nothing about function keys, so turning it on here would 401 them
# all before the host ever checked one.
#
# No CORS block either. Nothing that moves here is called from a browser by
# XHR: the phone posts to /api/gps/locations directly, the WHOOP callback is a
# top-level navigation, and run.nygard.dev reads the dashboard as a blob off
# the CDN rather than through the function. A cors block would be a list of
# origins that never send a preflight.
resource "azurerm_function_app_flex_consumption" "integrations" {
  name                = "func-nygdev-integrations"
  resource_group_name = azurerm_resource_group.consumption.name
  location            = azurerm_resource_group.consumption.location
  service_plan_id     = azurerm_service_plan.flex_integrations.id

  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.consumption.primary_blob_endpoint}${azurerm_storage_container.integrations.name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = azurerm_storage_account.consumption.primary_access_key

  runtime_name    = "dotnet-isolated"
  runtime_version = "10.0"

  # The same shape as the api app. Worth leaving alone: the on-demand free
  # grant of GB-s and executions applies only while an app has no always-ready
  # instances — always-ready billing has no free grants at all — and nothing
  # here is latency-sensitive enough to buy warm instances for. The WHOOP sync
  # and the dashboard build run on timers, and the phone's upload is a spool
  # that resends.
  instance_memory_in_mb  = 512
  maximum_instance_count = 1

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.integrations.id]
  }

  app_settings = {
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.consumption.connection_string

    # The same account, the same containers, the same vault as the api app
    # reads today — what changes at the split is which app holds them, not
    # where anything lives. See the api app above for why each is a bare
    # endpoint rather than a connection string: local auth is off on Cosmos and
    # the secrets never leave the vault.
    COSMOS_ENDPOINT    = azurerm_cosmosdb_account.db.endpoint
    DASHBOARD_BLOB_URL = "${data.azurerm_storage_account.nygdevcdn.primary_blob_endpoint}${azurerm_storage_container.data.name}/marathonprep.json"
    KEY_VAULT_URI      = azurerm_key_vault.nygdev.vault_uri

    MANAGED_IDENTITY_CLIENT_ID = azurerm_user_assigned_identity.integrations.client_id

    WHOOP_CLIENT_ID = var.whoop_client_id
    WHOOP_SCOPES    = var.whoop_scopes

    # WEBSITE_AUTH_AAD_ALLOWED_TENANTS is deliberately absent, unlike on the
    # api app: it is an Easy Auth control, and there is no Easy Auth here.
    #
    # WHOOP_REDIRECT_URI is absent for the reason it is absent there — it would
    # name this app's own hostname, which is a dependency cycle. The code reads
    # WEBSITE_HOSTNAME at run time instead.
  }

  site_config {}

  tags = local.common_tags

  lifecycle {
    # As on the two apps above: Flex Consumption doesn't return the App
    # Insights connection string in app_settings on read, mirrors it into
    # site_config, and adds a hidden-link tag once connected.
    ignore_changes = [
      app_settings["APPLICATIONINSIGHTS_CONNECTION_STRING"],
      site_config[0].application_insights_connection_string,
      tags["hidden-link: /app-insights-resource-id"],
    ]
  }
}

# Cosmos data-plane read/write for the integrations app: one assignment per
# container it writes, on the same reasoning as api_cosmos above. This was a
# single account-scoped grant, which meant this identity could read db/gym —
# every user's training log — to run a WHOOP sync. Nothing here has ever had
# code for that container.
#
# Two resources rather than one because the scope is a single path and this app
# genuinely writes two containers: db/primary for the WHOOP collections and the
# running workouts built from them, db/gps for the phone's location spool.
#
# No create_before_destroy on these, unlike api_cosmos. Replacing one resource
# with two is not a replacement terraform can overlap — the old address is
# going away — so there is a window, and it is cheap here in a way it is not
# there: a WHOOP sync runs again on its timer and the phone keeps its spool and
# resends.
resource "azurerm_cosmosdb_sql_role_assignment" "integrations_cosmos_primary" {
  resource_group_name = azurerm_resource_group.databases.name
  account_name        = azurerm_cosmosdb_account.db.name
  role_definition_id  = "${azurerm_cosmosdb_account.db.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = azurerm_user_assigned_identity.integrations.principal_id
  scope               = "${azurerm_cosmosdb_account.db.id}/dbs/${azurerm_cosmosdb_sql_database.db.name}/colls/${azurerm_cosmosdb_sql_container.primary.name}"
}

resource "azurerm_cosmosdb_sql_role_assignment" "integrations_cosmos_gps" {
  resource_group_name = azurerm_resource_group.databases.name
  account_name        = azurerm_cosmosdb_account.db.name
  role_definition_id  = "${azurerm_cosmosdb_account.db.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = azurerm_user_assigned_identity.integrations.principal_id
  scope               = "${azurerm_cosmosdb_account.db.id}/dbs/${azurerm_cosmosdb_sql_database.db.name}/colls/${azurerm_cosmosdb_sql_container.gps.name}"
}

# Write access on the CDN data container, for the dashboard blob the running
# build rewrites in place. Container-scoped rather than account-scoped for the
# reason api_cdn_data gives: nygdevcdn also holds Foundry's media and the
# LikeC4 site, neither of which is this app's business.
resource "azurerm_role_assignment" "integrations_cdn_data" {
  scope                = azurerm_storage_container.data.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_user_assigned_identity.integrations.principal_id
}

# Key Vault Secrets Officer for id-nygdev-integrations is granted out of band
# and is deliberately not declared here, which is what security.tf already
# records for id-nygdev-api. The reason is the same in substance and different
# in mechanism: that one pre-existed and azurerm_role_assignment refuses to
# adopt an assignment that already exists, while this one was declared, tried,
# and refused — the apply workflow's identity holds no
# Microsoft.Authorization/roleAssignments/write on rg-nygdev-security, so
# terraform cannot make the grant at all.
#
# Granting it to the workflow would mean User Access Administrator on the
# resource group holding the vault, so that every future apply could hand any
# role on it to anyone. That is a much wider standing permission than one
# assignment is worth, and the same trade was already made and declined for
# id-nygdev-api.
#
# What has to be run once, by someone who does hold it, before WHOOP moves to
# this app — until then the app has no code and nothing asks for a secret:
#
#   az role assignment create \
#     --assignee-object-id $(az identity show \
#       --resource-group rg-nygdev-consumption \
#       --name id-nygdev-integrations \
#       --query principalId --output tsv) \
#     --assignee-principal-type ServicePrincipal \
#     --role "Key Vault Secrets Officer" \
#     --scope $(az keyvault show --name nygdev --query id --output tsv)
#
# --assignee-principal-type is not optional ceremony: without it the CLI looks
# the principal up in Graph, and a managed identity created moments earlier is
# not replicated yet, so the command fails on a principal that plainly exists.
