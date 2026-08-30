resource "azurerm_resource_group" "databases" {
  name     = var.db_resource_group
  location = var.location
  tags     = local.common_tags
}

resource "azurerm_cosmosdb_account" "db" {
  name                         = "nygdev-cosmos-db"
  location                     = azurerm_resource_group.databases.location
  resource_group_name          = azurerm_resource_group.databases.name
  kind                         = "GlobalDocumentDB"
  offer_type                   = "Standard"
  free_tier_enabled            = true
  local_authentication_enabled = false
  burst_capacity_enabled       = true

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

# Partitioned on /type: a document says what it is, and that is also what
# Cosmos routes on. Changing partition_key_paths is ForceNew — terraform would
# destroy and recreate the container, taking every document with it — so this
# value is not one to edit casually. Check `terraform plan` shows no
# replacement before applying.
resource "azurerm_cosmosdb_sql_container" "primary" {
  name                  = "primary"
  resource_group_name   = azurerm_resource_group.databases.name
  account_name          = azurerm_cosmosdb_account.db.name
  database_name         = azurerm_cosmosdb_sql_database.db.name
  partition_key_paths   = ["/type"]
  partition_key_version = 2

  # Indexed for exactly one query: the running dashboard reading the scored
  # runs out of the whoop_workout partition. Two paths, and nothing else.
  #
  # Opt-in rather than opt-out — /* excluded, the filter's own paths included —
  # because almost nothing in this container is ever filtered on. A WHOOP
  # record is stored field for field as WHOOP sends it, most of it properties
  # no query will ever mention; indexing all of them would be paid on every
  # record of every sync to earn nothing back. Under this policy a sync pays
  # for two properties per record and the cursors, which carry neither
  # included path, still write at the price they did with indexing off.
  #
  # Adding a path here is what a new query needs. Without one Cosmos refuses
  # the filter outright rather than quietly scanning the partition, which is
  # the behaviour to want: a query that has outgrown the policy should say so
  # rather than get slower.
  #
  # This is an in-place update, not a replacement — Cosmos reindexes in the
  # background on spare throughput and keeps serving reads throughout.
  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/sport_name/?"
    }

    included_path {
      path = "/score_state/?"
    }

    excluded_path {
      path = "/*"
    }

    # Cosmos writes this into the policy whether or not it is asked to.
    # Declaring it is what keeps `terraform plan` from reporting the same
    # drift on every run.
    excluded_path {
      path = "/\"_etag\"/?"
    }
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
# Pinned to Sweden Central rather than var.location, because the Azure SQL
# Database free offer is not available in Norway East.
#
# The server and its firewall rules are managed here; the free-tier database
# inside it is created by hand and deliberately left unmanaged, so Terraform
# will neither create nor destroy it. Adding it here later means importing it
# rather than applying a new resource.
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
