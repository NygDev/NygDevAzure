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
  storage_account_id    = azurerm_storage_account.consumption.id
  container_access_type = "private"
}

# Storage container for PowerShell Function App deployment packages
resource "azurerm_storage_container" "consumption_ps" {
  name                  = "deploymentpackage-ps"
  storage_account_id    = azurerm_storage_account.consumption.id
  container_access_type = "private"
}

# Flex Consumption (FC1) Linux App Service Plan — dotnet
resource "azurerm_service_plan" "consumption_dotnet" {
  name                = "asp-nygdev-consumption"
  location            = azurerm_resource_group.consumption.location
  resource_group_name = azurerm_resource_group.consumption.name
  os_type             = "Linux"
  sku_name            = "FC1"
}

# Dedicated FC1 plan for PowerShell Function App (FC1 allows only one app per plan)
resource "azurerm_service_plan" "consumption_ps" {
  name                = "asp-nygdev-consumption-ps"
  location            = azurerm_resource_group.consumption.location
  resource_group_name = azurerm_resource_group.consumption.name
  os_type             = "Linux"
  sku_name            = "FC1"
}

# Linux Flex Consumption Function App — dotnet-isolated .NET 10
resource "azurerm_function_app_flex_consumption" "nygdev_dotnet" {
  name                        = var.function_app_name
  location                    = azurerm_resource_group.consumption.location
  resource_group_name         = azurerm_resource_group.consumption.name
  service_plan_id             = azurerm_service_plan.consumption_dotnet.id
  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.consumption.primary_blob_endpoint}${azurerm_storage_container.consumption.name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = azurerm_storage_account.consumption.primary_access_key
  instance_memory_in_mb       = 512
  maximum_instance_count      = 1
  http_concurrency            = 1
  runtime_name                = "dotnet-isolated"
  runtime_version             = "10.0"

  site_config {}
}

# Linux Flex Consumption Function App — PowerShell 7.4
resource "azurerm_function_app_flex_consumption" "nygdev_ps" {
  name                        = var.function_app_ps_name
  location                    = azurerm_resource_group.consumption.location
  resource_group_name         = azurerm_resource_group.consumption.name
  service_plan_id             = azurerm_service_plan.consumption_ps.id
  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.consumption.primary_blob_endpoint}${azurerm_storage_container.consumption_ps.name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = azurerm_storage_account.consumption.primary_access_key
  instance_memory_in_mb       = 512
  maximum_instance_count      = 1
  http_concurrency            = 1
  runtime_name                = "powershell"
  runtime_version             = "7.4"

  site_config {}
}
