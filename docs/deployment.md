# Production deployment

Verified October 28, 2026 (America/New_York).

- Public URL: https://gray-ocean-0a1a4710f.3.azurestaticapps.net/
- Resource group: `rg-eus2p-wedops-01`
- Static Web App: `stapp-eus2p-wedops-01`
- Region: East US 2
- Hosting plan: Free
- Terraform provider: AzureRM 4.81.0
- State: existing landing-zone state account, dedicated `ops-production` container and `ops-production.tfstate` key.

The application was provisioned using `infra/main.tf` and deployed from `site/` using the Azure Static Web Apps CLI. The deployment credential was retrieved at runtime and held in process memory; it is not stored in this repository or GitHub secrets. Deployments are currently manual through authenticated Azure Cloud Shell using `bash infra/deploy.sh`.

Verification completed:

- Build, privacy checks, JavaScript syntax and fixture-reference checks passed.
- Terraform successfully provisioned the dedicated resource group and application.
- Azure reported a successful production artifact upload.
- HTTPS returned HTTP 200; the response body matched the reviewed `site/index.html` byte for byte.
- Content Security Policy, framing restrictions, MIME protection, referrer policy and permissions policy headers were returned.
- The live Home and Schedule screens rendered with fictional data.

The original guest-site workload was not modified. The initial temporary generic-named deployment was replaced with the wedding-ops names during this deployment; those temporary resources are not retained.

This is a public portfolio demo. Edits remain in each visitor's browser, with no shared backend or production personal data. The app uses a simulated event clock by default. A custom domain and automatic deployment identity are not configured.
