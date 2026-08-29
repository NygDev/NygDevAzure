terraform {
  required_version = ">= 1.9"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.71"
    }

    # Used only for the free-tier SQL database, whose useFreeLimit /
    # freeLimitExhaustionBehavior properties azurerm does not expose.
    azapi = {
      source  = "Azure/azapi"
      version = "~> 2.12"
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
  features {}
}

provider "azapi" {
  subscription_id = var.subscription_id
}
