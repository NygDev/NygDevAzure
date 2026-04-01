# Resource group for consumption-tier serverless resources
resource "azurerm_resource_group" "consumption" {
  name     = var.consumption_resource_group
  location = var.location
}

# Storage account required by Function Apps
resource "azurerm_storage_account" "consumption" {
  name                     = "nygdevfunc"
  resource_group_name      = azurerm_resource_group.consumption.name
  location                 = azurerm_resource_group.consumption.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  blob_properties {
    versioning_enabled = false
  }
}

# Storage container for Flex Consumption deployment packages
resource "azurerm_storage_container" "consumption" {
  name                  = "deploymentpackage"
  storage_account_name  = azurerm_storage_account.consumption.name
  container_access_type = "private"
}

# Flex Consumption (FC1) Linux App Service Plan
resource "azurerm_service_plan" "consumption" {
  name                = "asp-nygdev-consumption"
  location            = azurerm_resource_group.consumption.location
  resource_group_name = azurerm_resource_group.consumption.name
  os_type             = "Linux"
  sku_name            = "FC1"
}

# Linux Flex Consumption Function App — C# .NET 10 isolated worker
resource "azurerm_function_app_flex_consumption" "nygdev" {
  name                        = var.function_app_name
  location                    = azurerm_resource_group.consumption.location
  resource_group_name         = azurerm_resource_group.consumption.name
  service_plan_id             = azurerm_service_plan.consumption.id
  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.consumption.primary_blob_endpoint}${azurerm_storage_container.consumption.name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = azurerm_storage_account.consumption.primary_access_key
  runtime_name                = "dotnet-isolated"
  runtime_version             = "10.0"

  site_config {}
}
