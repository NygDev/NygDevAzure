resource "azurerm_resource_group" "databases" {
  name     = var.db_resource_group
  location = var.location
}

resource "azurerm_cosmosdb_account" "db" {
  name                = "nygdev-cosmos-db"
  location            = azurerm_resource_group.databases.location
  resource_group_name = azurerm_resource_group.databases.name
  kind                = "GlobalDocumentDB"
  offer_type          = "Standard"
  enable_free_tier    = true

  consistency_policy {
    consistency_level = "Eventual"
  }

  geo_location {
    location          = azurerm_resource_group.databases.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "db"
  resource_group_name = azurerm_resource_group.databases.name
  account_name        = azurerm_cosmosdb_account.db.name
  throughput          = 1000
}

resource "azurerm_cosmosdb_sql_container" "primary" {
  name                = "primary"
  resource_group_name = azurerm_resource_group.databases.name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.db.name
  partition_key_paths = ["/partition"]

  indexing_policy {
    indexing_mode = "none"
  }
}
