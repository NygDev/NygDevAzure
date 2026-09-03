terraform {
  required_version = ">= 1.9"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.3"
    }
  }

  backend "azurerm" {
    resource_group_name  = "rg-nygdev-data"
    storage_account_name = "nygdevtfstate"
    container_name       = "tfstate"
    key                  = "azure-infrastructure.tfstate"
    use_azuread_auth     = true
  }
}

provider "azurerm" {
  subscription_id                 = var.subscription_id
  resource_provider_registrations = "none"

  # nygdevcdn does not allow shared-key access, so the provider's default route
  # to a blob — an account key fetched through listKeys — comes back 403 "Key
  # based authentication is not permitted on this storage account". This moves
  # the data plane onto the same Entra auth the state backend above already
  # uses, which is the authentication the account does accept.
  #
  # It needs the apply identity to hold Storage Blob Data Contributor on
  # nygdevcdn, and that is a grant terraform cannot make for itself: the
  # assignment and the write it authorises would land in the same apply, and
  # RBAC takes minutes to propagate. It is granted once, by hand, out of band —
  # see the note on azurerm_storage_blob.gym_exercises in cdn.tf, which
  # predicted this failure and prescribed this fix.
  #
  # That blob is the only data-plane resource in this configuration, so this
  # setting affects it and nothing else. Everything else here is Resource
  # Manager, which was never using a key.
  storage_use_azuread = true

  features {}
}
