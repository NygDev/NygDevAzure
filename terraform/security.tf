# Key Vault and SSH key live in rg-nygdev-security, which is not created by
# this configuration; they are managed here as minimal definitions.

resource "azurerm_key_vault" "nygdev" {
  name                       = "nygdev"
  location                   = var.location
  resource_group_name        = var.security_resource_group
  tenant_id                  = var.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
  tags                       = local.common_tags
}

# Stored copy of the VM admin public key (reuses the same key var as the VM)
resource "azurerm_ssh_public_key" "nygdev" {
  name                = "nygdev-ed25519"
  location            = var.location
  resource_group_name = var.security_resource_group
  public_key          = var.ssh_public_key
  tags                = local.common_tags
}
