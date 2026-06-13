locals {
  data_resource_group = "rg-nygdev-data"

  common_tags = {
    managed_by  = "terraform"
    environment = "personal"
  }
}
