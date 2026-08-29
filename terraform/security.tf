# Key Vault and SSH key live in rg-nygdev-security, which is not created by
# this configuration; they are managed here as minimal definitions.
#
# The secrets themselves are deliberately absent: whoop-clientsecret is
# copied in by hand from the WHOOP developer dashboard, and whoop-token is
# written by the function app itself on every token refresh. Declaring
# either here would mean putting a secret in state and having terraform
# overwrite a value the app owns.
#
# The Key Vault Secrets Officer assignment for id-nygdev-api was granted
# out of band and is not declared here — azurerm_role_assignment fails on an
# assignment that already exists, so adopting it means a terraform import
# rather than an add.

resource "azurerm_key_vault" "nygdev" {
  name                       = "nygdev"
  location                   = var.location
  resource_group_name        = var.security_resource_group
  tenant_id                  = var.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7

  # Declared, not merely inherited. The vault's data plane is governed by Azure
  # RBAC — id-nygdev-api holds Key Vault Secrets Officer on it, which is what
  # lets func-nygdev-api read whoop-clientsecret and write the rotated
  # whoop-token back. This argument defaults to false, so leaving it out would
  # have terraform hand the vault back to access policies on the next apply and
  # cut off every role assignment against it.
  rbac_authorization_enabled = true

  tags = local.common_tags
}

# Stored copy of the VM admin public key (reuses the same key var as the VM)
resource "azurerm_ssh_public_key" "nygdev" {
  name                = "nygdev-ed25519"
  location            = var.location
  resource_group_name = var.security_resource_group
  public_key          = var.ssh_public_key
  tags                = local.common_tags
}
