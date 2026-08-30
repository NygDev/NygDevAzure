output "vnet_id" {
  description = "ID of the virtual network"
  value       = azurerm_virtual_network.nygdev.id
}

output "subnet_id" {
  description = "ID of the RPG subnet"
  value       = azurerm_subnet.rpg.id
}

output "nsg_id" {
  description = "ID of the network security group"
  value       = azurerm_network_security_group.nygdev.id
}

output "vm_name" {
  description = "Name of the virtual machine"
  value       = azurerm_linux_virtual_machine.rpg.name
}

output "vm_private_ip" {
  description = "Private IP address of the VM"
  value       = azurerm_network_interface.vm.private_ip_address
}

output "vm_id" {
  description = "ID of the virtual machine"
  value       = azurerm_linux_virtual_machine.rpg.id
}

output "consumption_resource_group_name" {
  description = "Name of the consumption resource group"
  value       = azurerm_resource_group.consumption.name
}

output "app_insights_name" {
  description = "Name of the Application Insights instance for consumption function apps"
  value       = azurerm_application_insights.consumption.name
}

output "sql_server_fqdn" {
  description = "Fully qualified domain name of the Azure SQL server"
  value       = azurerm_mssql_server.nygdev.fully_qualified_domain_name
}

output "api_function_app_hostname" {
  description = "Default hostname of the api function app. The run.nygard.dev site hardcodes this origin in main.js (SPOT_URL) and in the connect-src of its staticwebapp.config.json; both have to match it, and it has to appear in the app's CORS allowed origins."
  value       = azurerm_function_app_flex_consumption.api.default_hostname
}

output "whoop_redirect_uri" {
  description = "Register this exactly as a redirect URL on the WHOOP application in the developer dashboard. WHOOP compares it on both legs of the authorization code grant, so a trailing slash or a different host is a rejected flow rather than a warning. The app derives the same string from WEBSITE_HOSTNAME at run time."
  value       = "https://${azurerm_function_app_flex_consumption.api.default_hostname}/api/whoop/callback"
}

output "whoop_authorize_url" {
  description = "Open this once, in a browser, to grant the app access to a WHOOP account and seed the whoop-token secret. Needs ?code=<function key> appended — the endpoint is at Function auth level."
  value       = "https://${azurerm_function_app_flex_consumption.api.default_hostname}/api/whoop/authorize"
}

output "running_dashboard_url" {
  description = "Where the running dashboard JSON is published. This is the URL the run.nygard.dev page fetches; it is anonymous-read, so no key or function call is involved. Rewritten by the API after every WHOOP sync."
  value       = "${data.azurerm_storage_account.nygdevcdn.primary_blob_endpoint}${azurerm_storage_container.data.name}/marathonprep.json"
}
