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

output "function_app_hostname" {
  description = "Default hostname of the consumption Function App"
  value       = azurerm_function_app_flex_consumption.nygdev_dotnet.default_hostname
}
