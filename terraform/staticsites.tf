# Static Web Apps in rg-nygdev-web. Static Web Apps are only available in a
# handful of regions; these are deployed in West Europe (not the default
# Norway East), so location is set explicitly. Both default to the Free SKU.

resource "azurerm_static_web_app" "gymlog" {
  name                = "gymlog"
  resource_group_name = var.web_resource_group
  location            = "westeurope"
  tags                = local.common_tags
}

import {
  to = azurerm_static_web_app.gymlog
  id = "${local.subscription_scope}/resourceGroups/${var.web_resource_group}/providers/Microsoft.Web/staticSites/gymlog"
}

resource "azurerm_static_web_app" "nygdevapex" {
  name                = "nygdevapex"
  resource_group_name = var.web_resource_group
  location            = "westeurope"
  tags                = local.common_tags
}

import {
  to = azurerm_static_web_app.nygdevapex
  id = "${local.subscription_scope}/resourceGroups/${var.web_resource_group}/providers/Microsoft.Web/staticSites/nygdevapex"
}
