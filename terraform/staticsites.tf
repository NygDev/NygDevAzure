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

# The desktop planner for the same training log. Provisioned empty here, content
# deployed by its own pipeline in the nygdevweb repository.
#
# A fourth Static Web App rather than a path on the gym one because SWA routes
# on path only, with no host-based routing — a second subdomain with different
# content needs a second resource, which is the same reason there are three
# already.
#
# It shares everything on the identity side with nygdevgym and shares nothing on
# the hosting side. Same API, same Cosmos partition, same GymLog registration:
# Easy Auth on the api app checks the appid claim, so a planner with a
# registration of its own would be turned away with a 403. What that costs is
# two more manual Entra entries — this app's origin has to join the SPA redirect
# URI list, which is why gymlog_spa_redirect_uri now prints four values.
resource "azurerm_static_web_app" "nygdevgymbro" {
  name                = "nygdevgymbro"
  resource_group_name = var.web_resource_group
  location            = "westeurope"
  tags                = local.common_tags

  lifecycle {
    ignore_changes = [repository_branch, repository_token, repository_url, app_settings]
  }
}
