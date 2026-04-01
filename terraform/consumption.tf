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
}

# Consumption (Y1) Linux App Service Plan — free tier
resource "azurerm_service_plan" "consumption" {
  name                = "asp-nygdev-consumption"
  location            = azurerm_resource_group.consumption.location
  resource_group_name = azurerm_resource_group.consumption.name
  os_type             = "Linux"
  sku_name            = "Y1"
}

# Linux Function App — C# .NET 10 isolated worker
resource "azurerm_linux_function_app" "nygdev" {
  name                = var.function_app_name
  location            = azurerm_resource_group.consumption.location
  resource_group_name = azurerm_resource_group.consumption.name

  storage_account_name       = azurerm_storage_account.consumption.name
  storage_account_access_key = azurerm_storage_account.consumption.primary_access_key
  service_plan_id            = azurerm_service_plan.consumption.id

  site_config {
    application_stack {
      dotnet_version              = "10.0"
      use_dotnet_isolated_runtime = true
    }
  }
}
