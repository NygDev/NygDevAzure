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
  description = "Where the running dashboard JSON is published. This is the URL the run.nygard.dev page fetches; it is anonymous-read, so no key or function call is involved. Rewritten by the API on its own timer, a quarter of an hour behind each six-hourly WHOOP sync."
  value       = "${data.azurerm_storage_account.nygdevcdn.primary_blob_endpoint}${azurerm_storage_container.data.name}/marathonprep.json"
}

output "gymlog_easy_auth_redirect_uri" {
  description = "Register this as a Web redirect URI on the GymLog app registration if the built-in sign-in flow at /.auth/login/aad is ever used. It is not needed for the path in use today — a front end that signs in itself and presents a bearer token — and that flow needs a client secret besides. Listed here for the same reason as whoop_redirect_uri: the registration is managed by hand, so anything terraform knows and the portal needs has to be printed rather than applied."
  value       = "https://${azurerm_function_app_flex_consumption.api.default_hostname}/.auth/login/aad/callback"
}

output "gym_static_site_hostname" {
  description = "Default hostname of the gym logger's Static Web App. The front end's own origin, and one of the entries in the api function app's CORS list — a browser call from anywhere not on that list is discarded before the response is read. gym.nygard.dev is allowed alongside it, but the DNS for it is a separate manual step."
  value       = azurerm_static_web_app.nygdevgym.default_host_name
}

output "gymbro_static_site_hostname" {
  description = "Default hostname of the desktop planner's Static Web App. Same role as gym_static_site_hostname: it is the planner's own origin and one of the entries in the api function app's CORS list. gymbro.nygard.dev is allowed alongside it, and the DNS for it is a separate manual step."
  value       = azurerm_static_web_app.nygdevgymbro.default_host_name
}

output "gym_exercise_library_url" {
  description = "Where the gym logger's built-in exercise library is published. Anonymous-read and cached for a day, so the front end fetches it once with no token and no function call. The file is gym/exercises.json in this repository; editing it and applying is what republishes it."
  value       = "${data.azurerm_storage_account.nygdevcdn.primary_blob_endpoint}${azurerm_storage_container.data.name}/${azurerm_storage_blob.gym_exercises.name}"
}

output "gym_template_library_url" {
  description = "Where the gym logger's built-in day templates are published — the named plans the Plan tab drops into a day. Anonymous-read and cached for a day, on the same terms as the exercise library beside it. The file is gym/templates.json in this repository; a user's own saved templates are not here, they are per-account documents in db/gym."
  value       = "${data.azurerm_storage_account.nygdevcdn.primary_blob_endpoint}${azurerm_storage_container.data.name}/${azurerm_storage_blob.gym_templates.name}"
}

output "gymlog_spa_redirect_uri" {
  description = "Register all of these as Single-page application redirect URIs on the GymLog app registration. Both front ends sign in as that registration — Easy Auth on the api app checks the appid claim and turns away a token minted by any other client — so this is what has to be there before the first sign-in works. Two entries per origin, and both are load-bearing: since MSAL v5 every authorization response comes back through /auth.html, including the one the hidden renewal iframe waits ten seconds for, while sign-out lands on the origin root and Entra validates that against the same reply-URL list. Matched as strings, trailing slash included. Manual, like everything else on the Entra side; the registration is not managed by this configuration."
  value = [
    "https://gym.nygard.dev/auth.html",
    "https://gym.nygard.dev/",
    "https://${azurerm_static_web_app.nygdevgym.default_host_name}/auth.html",
    "https://${azurerm_static_web_app.nygdevgym.default_host_name}/",
    "https://gymbro.nygard.dev/auth.html",
    "https://gymbro.nygard.dev/",
    "https://${azurerm_static_web_app.nygdevgymbro.default_host_name}/auth.html",
    "https://${azurerm_static_web_app.nygdevgymbro.default_host_name}/",
  ]
}
