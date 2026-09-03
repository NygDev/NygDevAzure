# Static Web Apps in rg-nygdev-web. Static Web Apps are only available in a
# handful of regions; these are deployed in West Europe (not the default
# Norway East), so location is set explicitly. Defaults to the Free SKU.

resource "azurerm_static_web_app" "nygdevapex" {
  name                = "nygdevapex"
  resource_group_name = var.web_resource_group
  location            = "westeurope"
  tags                = local.common_tags

  # GitHub integration + app settings are wired up by the app's own deploy
  # pipeline; the repository_token is never returned by Azure, so let those
  # attributes drift rather than have Terraform clear them.
  lifecycle {
    ignore_changes = [repository_branch, repository_token, repository_url, app_settings]
  }
}

# Running/marathon dashboard. Same pattern as the apex site: provisioned
# empty here, content deployed by the app's own repository.
resource "azurerm_static_web_app" "nygdevrun" {
  name                = "nygdevrun"
  resource_group_name = var.web_resource_group
  location            = "westeurope"
  tags                = local.common_tags

  lifecycle {
    ignore_changes = [repository_branch, repository_token, repository_url, app_settings]
  }
}

# The gym session logger's front end. Same pattern again: provisioned empty
# here, content deployed by its own pipeline.
#
# It exists in this configuration before the front end does because the API
# needs it: an app that calls func-nygdev-api from a browser has to have its
# origin in that app's CORS list, and the origin is this resource's hostname.
# Creating it here is what lets both halves be applied once, rather than the
# front end landing and then waiting on a second terraform change before it can
# make a single call.
#
# Unlike the two above it also has an identity on the Entra side: the front end
# signs in as the GymLog registration (var.gymlog_client_id), which is the only
# client Easy Auth on the API accepts. That registration is managed by hand, so
# the SPA redirect URI it needs is printed as the gymlog_spa_redirect_uri
# output rather than applied.
resource "azurerm_static_web_app" "nygdevgym" {
  name                = "nygdevgym"
  resource_group_name = var.web_resource_group
  location            = "westeurope"
  tags                = local.common_tags

  lifecycle {
    ignore_changes = [repository_branch, repository_token, repository_url, app_settings]
  }
}
