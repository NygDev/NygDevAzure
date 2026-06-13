# Static Web Apps in rg-nygdev-web. Static Web Apps are only available in a
# handful of regions; these are deployed in West Europe (not the default
# Norway East), so location is set explicitly. Both default to the Free SKU.

resource "azurerm_static_web_app" "gymlog" {
  name                = "gymlog"
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

resource "azurerm_static_web_app" "nygdevapex" {
  name                = "nygdevapex"
  resource_group_name = var.web_resource_group
  location            = "westeurope"
  tags                = local.common_tags

  # See gymlog above — GitHub integration is managed outside Terraform.
  lifecycle {
    ignore_changes = [repository_branch, repository_token, repository_url, app_settings]
  }
}
