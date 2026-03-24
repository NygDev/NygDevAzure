resource "azurerm_resource_group" "databases" {
  name      = var.db_resource_group
  location  = var.location
}

# Cosmos Db
resource "azurerm_cosmosdb_account" "db" {
  name      = "nygdev-cosmos-db"
  location  = var.location
  resource_group_name = var.db_resource_group
  kind  = "nosql"
offer_type = "freetier"


  consistency_policy {
    consistency_level       = "Eventual"
  }
}
