terraform {
  required_version = ">= 1.9"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 5.3"
    }

    # Entra ID objects (terraform/entra.tf) are Microsoft Graph, not Resource
    # Manager, and azurerm does not reach them.
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 3.9"
    }

    # Solely for the GymLog scope id, which has to be a stable UUID that no
    # consent grant should ever see change.
    random = {
      source  = "hashicorp/random"
      version = "~> 3.7"
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

# Graph is addressed per tenant rather than per subscription, so this takes
# tenant_id and nothing else. It picks up the same OIDC credentials from
# ARM_CLIENT_ID / ARM_USE_OIDC that the apply workflow already exports for
# azurerm.
provider "azuread" {
  tenant_id = var.tenant_id
}
