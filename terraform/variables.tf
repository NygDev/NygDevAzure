variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
  sensitive   = true
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
  default     = "ubuntu-26_04-lts"
}

variable "db_resource_group" {
  description = "Free tier databases"
  type        = string
  default     = "rg-nygdev-db"
}

variable "cdn_resource_group" {
  description = "Resource group containing the nygdevcdn storage account"
  type        = string
  default     = "rg-nygdev-web"
}

variable "consumption_resource_group" {
  description = "Resource group for consumption-tier serverless resources (Function Apps, Logic Apps)"
  type        = string
  default     = "rg-nygdev-consumption"
}

variable "security_resource_group" {
  description = "Resource group for security resources (Key Vault, SSH keys)"
  type        = string
  default     = "rg-nygdev-security"
}

variable "web_resource_group" {
  description = "Resource group for web front-end resources (Static Web Apps)"
  type        = string
  default     = "rg-nygdev-web"
}

variable "entra_owner_objectid" {
  description = "Object ID of the Entra owner user"
  type        = string
  sensitive   = true
}

variable "tenant_id" {
  description = "Azure AD tenant ID"
  type        = string
  sensitive   = true
}

variable "whoop_client_id" {
  description = "Client ID of the WHOOP application registered in the WHOOP developer dashboard. Not a secret — it travels in the browser on every authorization redirect. Its client secret and the refresh token it mints live in the nygdev Key Vault as whoop-clientsecret and whoop-token."
  type        = string
  default     = "9a692aea-e2d9-414c-8324-9ae8d7e1e19b"
}
