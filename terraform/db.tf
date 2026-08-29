resource "azurerm_resource_group" "databases" {
  name     = var.db_resource_group
  location = var.location
  tags     = local.common_tags
}

resource "azurerm_cosmosdb_account" "db" {
  name                          = "nygdev-cosmos-db"
  location                      = azurerm_resource_group.databases.location
  resource_group_name           = azurerm_resource_group.databases.name
  kind                          = "GlobalDocumentDB"
  offer_type                    = "Standard"
  free_tier_enabled             = true
  local_authentication_disabled = true
  burst_capacity_enabled        = true

  capacity {
    total_throughput_limit = 1000
  }

  consistency_policy {
    consistency_level = "Eventual"
  }

  geo_location {
    location          = azurerm_resource_group.databases.location
    failover_priority = 0
  }

  tags = local.common_tags
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "db"
  resource_group_name = azurerm_resource_group.databases.name
  account_name        = azurerm_cosmosdb_account.db.name
  throughput          = 1000
}

resource "azurerm_cosmosdb_sql_container" "primary" {
  name                  = "primary"
  resource_group_name   = azurerm_resource_group.databases.name
  account_name          = azurerm_cosmosdb_account.db.name
  database_name         = azurerm_cosmosdb_sql_database.db.name
  partition_key_paths   = ["/partition"]
  partition_key_version = 2

  indexing_policy {
    indexing_mode = "none"
  }
}

resource "azurerm_cosmosdb_sql_role_assignment" "my_user" {
  resource_group_name = azurerm_resource_group.databases.name
  account_name        = azurerm_cosmosdb_account.db.name
  role_definition_id  = "${azurerm_cosmosdb_account.db.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = var.entra_owner_objectid
  scope               = azurerm_cosmosdb_account.db.id
}

# ---------------------------------------------------------------------------
# Azure SQL — Sweden Central
#
# The Azure SQL Database free offer (one free database per subscription,
# 100,000 vCore-seconds + 32 GB storage per month) requires a serverless
# General Purpose database, and is not offered in Norway East, so the server
# is pinned to Sweden Central rather than var.location.
# ---------------------------------------------------------------------------

resource "azurerm_mssql_server" "nygdev" {
  name                = "sql-nygdev"
  resource_group_name = azurerm_resource_group.databases.name
  location            = "swedencentral"
  version             = "12.0"
  minimum_tls_version = "1.2"

  # Entra ID is the only way in — no SQL login/password to store or rotate,
  # so administrator_login/_password are deliberately absent. object_id is
  # what actually grants access; login_username is only the display label
  # Azure shows for the admin.
  azuread_administrator {
    login_username              = "nygdev-owner"
    object_id                   = var.entra_owner_objectid
    tenant_id                   = var.tenant_id
    azuread_authentication_only = true
  }

  tags = local.common_tags
}

# Home access for management/queries; nothing else reaches the server.
resource "azurerm_mssql_firewall_rule" "home" {
  name             = "home"
  server_id        = azurerm_mssql_server.nygdev.id
  start_ip_address = var.home_ip
  end_ip_address   = var.home_ip
}

# Free-tier database. The free offer (one per subscription: 100,000 vCore-
# seconds of compute and 32 GB of storage per month) is driven by the
# useFreeLimit / freeLimitExhaustionBehavior properties, which the azurerm
# provider does not expose on azurerm_mssql_database at any 4.x or 5.x
# version — hence azapi against the ARM API directly. GP_S_Gen5_2
# (serverless, 2 vCores) is the only SKU the free offer supports, and
# AutoPause means the database stops rather than starts billing once the
# monthly grant is used up.
resource "azapi_resource" "sqldb_nygdev" {
  type      = "Microsoft.Sql/servers/databases@2025-01-01"
  name      = "sqldb-nygdev"
  parent_id = azurerm_mssql_server.nygdev.id
  location  = azurerm_mssql_server.nygdev.location
  tags      = local.common_tags

  body = {
    sku = {
      name     = "GP_S_Gen5_2"
      tier     = "GeneralPurpose"
      family   = "Gen5"
      capacity = 2
    }
    properties = {
      collation      = "SQL_Latin1_General_CP1_CI_AS"
      maxSizeBytes   = 34359738368 # 32 GB, the free grant's storage ceiling
      minCapacity    = 0.5
      autoPauseDelay = 60

      useFreeLimit                = true
      freeLimitExhaustionBehavior = "AutoPause"

      # Local-redundant backups: cheapest option, and the free grant only
      # covers 32 GB of local backup storage.
      requestedBackupStorageRedundancy = "Local"
      zoneRedundant                    = false
    }
  }
}
