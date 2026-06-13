data "azurerm_storage_account" "nygdevcdn" {
  name                = "nygdevcdn"
  resource_group_name = var.cdn_resource_group
}
