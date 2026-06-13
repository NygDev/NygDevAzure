locals {
  data_resource_group = "rg-nygdev-data"

  # Subscription scope used to build resource IDs for import blocks
  subscription_scope = "/subscriptions/${var.subscription_id}"

  common_tags = {
    managed_by  = "terraform"
    environment = "personal"
  }
}
