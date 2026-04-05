locals {
  data_resource_group = "rg-nygdev-data"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "norwayeast"
}

variable "home_ip" {
  description = "Home IP address for NSG rules"
  type        = string
  sensitive   = true
}

variable "ssh_public_key" {
  description = "SSH public key for VM access"
  type        = string
  sensitive   = true
}

variable "vm_name" {
  description = "Name of the virtual machine"
  type        = string
  default     = "rpg-vm"
}

variable "vm_size" {
  description = "Size of the virtual machine"
  type        = string
  default     = "Standard_B2s"
}

variable "admin_username" {
  description = "Admin username for the VM"
  type        = string
  sensitive   = true
}

variable "network_resource_group" {
  description = "Resource group containing network resources"
  type        = string
  default     = "rg-nygdev-network"
}

variable "vm_resource_group" {
  description = "Resource group for VM resources"
  type        = string
  default     = "rg-nygdev-vm"
}

variable "ubuntu_offer" {
  description = "Ubuntu image offer name"
  type        = string
  default     = "ubuntu-25_10"
}

variable "db_resource_group" {
  description = "Free tier databases"
  type        = string
  default     = "rg-nygdev-db"
}

variable "consumption_resource_group" {
  description = "Resource group for consumption-tier serverless resources (Function Apps, Logic Apps)"
  type        = string
  default     = "rg-nygdev-consumption"
}

variable "function_app_name" {
  description = "Name of the consumption Function App (must be globally unique in Azure)"
  type        = string
  default     = "func-nygdev"
}

variable "function_app_ps_name" {
  description = "Name of the PowerShell Function App (must be globally unique in Azure)"
  type        = string
  default     = "func-nygdev-ps"
}

variable "entra_owner_objectid" {
  description = "Object ID of the Entra owner user"
  type        = string
  sensitive   = true
}
