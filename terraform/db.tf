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

  # Session rather than Eventual, and the gym logger is what asked for it.
  #
  # Per-request consistency can only be relaxed below the account default,
  # never strengthened above it, so an account on Eventual has no
  # read-your-own-writes guarantee available to any caller: log a set, re-read
  # the session, and the replica that answers may not have it yet. On a
  # single-region account Session costs nothing to buy — same RU as Eventual on
  # a read, unlike Bounded Staleness or Strong which are roughly double, and no
  # change to latency or availability with one region to be consistent across.
  #
  # It applies to `primary` and `gps` too, harmlessly: the WHOOP sync reads its
  # own cursors back, which is exactly the read this strengthens, and nothing
  # reads the GPS spool at all.
  #
  # The app is still written not to need it — the client holds the state it
  # just wrote and the UI works off local state and deltas. This is what keeps
  # a *second* device, or a cold reload, from being shown a stale block.
  consistency_policy {
    consistency_level = "Session"
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

# The gym logger's container: one user's training block, sessions and sets.
# Three document types told apart by /type — user, mesocycle, session — with
# entries and sets embedded in the session rather than stored as documents of
# their own. GymStore in the api app is the only writer; the account-scoped
# role assignment in terraform/consumption.tf covers it without a grant here.
#
# Partitioned on /objectId, the caller's Entra object id off the validated
# token. That is the whole tenancy boundary — a caller who could name their own
# partition key could read anyone's training log — which is why the app takes
# it from the X-MS-CLIENT-PRINCIPAL headers Easy Auth populates and never from
# a request body. It is also ForceNew, as on primary and gps: editing it
# destroys and recreates the container with everything in it.
resource "azurerm_cosmosdb_sql_container" "gym" {
  name                  = "gym"
  resource_group_name   = azurerm_resource_group.databases.name
  account_name          = azurerm_cosmosdb_account.db.name
  database_name         = azurerm_cosmosdb_sql_database.db.name
  partition_key_paths   = ["/objectId"]
  partition_key_version = 2

  # Was indexing_mode = "none", which is right for a container only ever point
  # read and wrong for this one: History and the block map both filter, and
  # under mode none Cosmos refuses a query outright rather than scanning.
  #
  # Opt-in, the same shape as primary — /* excluded, only what is filtered or
  # sorted on included:
  #
  #   SELECT c.id, c.week, c.dayIndex, c.status, c.entries FROM c
  #   WHERE c.type = 'session' AND c.mesoId = @mesoId
  #   ORDER BY c.id DESC
  #
  # The exclusion is doing more work here than the inclusions. /entries is the
  # bulk of a session document and is never filtered on, and an indexed path is
  # re-indexed on every patch — so excluding it is what keeps the per-tap set
  # write flat in the number of sets already logged. Under this policy a
  # set-tap indexes nothing at all.
  #
  # /id is deliberately absent, and cannot be added: Cosmos rejects a policy
  # that names it, with "the specified path '/id/?' could not be accepted
  # because it overrides system property 'id'". It is a system property with an
  # index of its own that the policy gets no say in — which is also why
  # excluding /* does not take it away, and why History's ORDER BY c.id DESC is
  # still served under this policy.
  #
  # There is no composite index either. Session ids are ISO dates, so
  # newest-first is a single-property sort; composite indexes are only required
  # for multi-property ORDER BY, which this shape avoids. Grouping into weeks
  # happens off the week field, client-side.
  #
  # This is an in-place update rather than a replacement: Cosmos reindexes in
  # the background on spare throughput and keeps serving reads throughout.
  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/type/?"
    }

    included_path {
      path = "/mesoId/?"
    }

    excluded_path {
      path = "/*"
    }

    # Cosmos writes this into the policy whether or not it is asked to, the
    # same as on primary and gps. Declaring it is what keeps `terraform plan`
    # from reporting the same drift on every run.
    excluded_path {
      path = "/\"_etag\"/?"
    }
  }
}

# The phone's location spool, off db/primary and on its own. Partitioned on
# /sender: a document says which device uploaded it, and that is what Cosmos
# routes on, so a second device lands beside this one rather than interleaved
# with it. Written by GpsFixStore in the api app, which reaches it under the
# account-scoped role assignment in terraform/consumption.tf.
#
# partition_key_paths is ForceNew, as on primary: editing it destroys and
# recreates the container with everything in it.
resource "azurerm_cosmosdb_sql_container" "gps" {
  name                  = "gps"
  resource_group_name   = azurerm_resource_group.databases.name
  account_name          = azurerm_cosmosdb_account.db.name
  database_name         = azurerm_cosmosdb_sql_database.db.name
  partition_key_paths   = ["/sender"]
  partition_key_version = 2

  # Three days, in seconds, and then Cosmos drops the document itself.
  #
  # It counts from each document's _ts — when the segment was last written,
  # not when the fixes inside it were recorded — so an upload that upserts
  # over an existing segment starts its three days again, and a segment full
  # of a week-old backlog still gets three days from the day it arrived. The
  # expiry costs no RU from the provisioned throughput.
  #
  # A rolling window rather than an archive, which is what the container is
  # for: nothing reads these yet, the phone keeps its own spool, and anything
  # worth keeping past three days should be read out and stored somewhere that
  # is not a hot container on a 1000 RU/s account.
  default_ttl = 259200

  # Consistent with every path excluded, which reads as a contradiction and is
  # not: TTL requires indexing, and Cosmos refuses default_ttl outright on a
  # container whose indexing mode is none (and refuses mode none on a container
  # with TTL set). This is the shape the TTL documentation gives for exactly
  # this case — consistent, no included paths, /* excluded — and what it costs
  # over the mode none this container had is the id and _ts indexes, which
  # Cosmos maintains under consistent mode whatever the policy says.
  #
  # So nothing here is indexed for the sake of a query. There are none: the
  # writes are upserts by id and partition key, and a read of a segment is a
  # point read. A query that needs an index is what adds an included path, as
  # on primary.
  indexing_policy {
    indexing_mode = "consistent"

    excluded_path {
      path = "/*"
    }

    # Cosmos writes this into the policy whether or not it is asked to, the
    # same as on primary. Declaring it is what keeps `terraform plan` from
    # reporting the same drift on every run.
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
