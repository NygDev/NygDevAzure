resource "azurerm_resource_group" "databases" {
  name      = var.db_resource_group
  location  = var.location
}

# Cosmos Db
