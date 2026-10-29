terraform {
  required_version = ">= 1.9, < 2.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "= 4.81.0"
    }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

locals {
  tags = {
    application         = "event-operations-demo"
    environment         = "production"
    owner-group         = "portfolio-owner"
    cost-center         = "portfolio-demo"
    managed-by          = "terraform"
    criticality         = "low"
    data-classification = "public"
  }
}

resource "azurerm_resource_group" "ops" {
  name     = "rg-eus2p-wedops-01"
  location = "eastus2"
  tags     = local.tags
}

resource "azurerm_static_web_app" "ops" {
  name                = "stapp-eus2p-wedops-01"
  resource_group_name = azurerm_resource_group.ops.name
  location            = azurerm_resource_group.ops.location
  sku_tier            = "Free"
  sku_size            = "Free"
  tags                = local.tags
}

output "default_hostname" {
  value = azurerm_static_web_app.ops.default_host_name
}

resource "azurerm_static_web_app_custom_domain" "ops" {
  static_web_app_id = azurerm_static_web_app.ops.id
  domain_name       = "ops.sidvivah26.com"
  validation_type   = "cname-delegation"
}
