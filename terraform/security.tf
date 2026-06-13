# Key Vault and SSH key live in rg-nygdev-security, which is not created by
# this configuration. They are imported here as minimal definitions; verify
# `terraform plan` shows no changes after import (see notes below).

resource "azurerm_key_vault" "nygdev" {
  name                = "nygdev"
  location            = var.location
  resource_group_name = var.security_resource_group
  tenant_id           = var.tenant_id
  sku_name            = "standard"
  tags                = local.common_tags
}

import {
  to = azurerm_key_vault.nygdev
  id = "${local.subscription_scope}/resourceGroups/${var.security_resource_group}/providers/Microsoft.KeyVault/vaults/nygdev"
}

# Stored copy of the VM admin public key (reuses the same key var as the VM)
resource "azurerm_ssh_public_key" "nygdev" {
  name                = "nygdev-ed25519"
  location            = var.location
  resource_group_name = var.security_resource_group
  public_key          = var.ssh_public_key
  tags                = local.common_tags
}

import {
  to = azurerm_ssh_public_key.nygdev
  id = "${local.subscription_scope}/resourceGroups/${var.security_resource_group}/providers/Microsoft.Compute/sshPublicKeys/nygdev-ed25519"
}
