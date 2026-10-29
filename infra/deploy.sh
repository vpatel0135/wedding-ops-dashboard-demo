#!/usr/bin/env bash
# Run from a fresh checkout in authenticated Azure Cloud Shell (Bash).
set -euo pipefail
cd "$(dirname "$0")/.."
python3 build/build.py
python3 build/privacy_check.py
node --check src/app.js
node build/check_data.js
export ARM_SUBSCRIPTION_ID="$(az account show --query id -o tsv)"
export ARM_TENANT_ID="$(az account show --query tenantId -o tsv)"
export ARM_USE_AZUREAD=true
az storage container create --account-name steus2pstate01 --name ops-production --auth-mode login --only-show-errors -o none
terraform -chdir=infra init -input=false \
  -backend-config=resource_group_name=rg-eus2p-state-01 \
  -backend-config=storage_account_name=steus2pstate01 \
  -backend-config=container_name=ops-production \
  -backend-config=key=ops-production.tfstate \
  -backend-config=use_azuread_auth=true
terraform -chdir=infra plan -input=false -out=/tmp/ops-reviewed.tfplan
terraform -chdir=infra apply -input=false /tmp/ops-reviewed.tfplan
# Keep the deployment credential in process memory; never print or save it.
export SWA_CLI_DEPLOYMENT_TOKEN="$(az staticwebapp secrets list --name stapp-eus2p-wedops-01 --resource-group rg-eus2p-wedops-01 --query properties.apiKey -o tsv)"
npx --yes @azure/static-web-apps-cli@2.0.10 deploy site --env production
unset SWA_CLI_DEPLOYMENT_TOKEN
printf '\nDashboard URL: https://%s\n' "$(terraform -chdir=infra output -raw default_hostname)"
