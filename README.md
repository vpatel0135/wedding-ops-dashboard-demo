# Event Operations Dashboard Demo

**Live demo:** https://ops.sidvivah26.com/

A public, interactive portfolio copy of an event operations dashboard built to coordinate a multi-day wedding. The original layout and operational workflows are retained, with a standalone fictional dataset. This repository begins with a fresh Git history.

## Explore the dashboard

Open `site/index.html` directly in a browser. No installation, account, backend or network integrations are required.

- **Home:** current event, operational status and upcoming handoffs.
- **Schedule:** six events and 135 run-of-show items, including parallel ritual tracks.
- **Responsibilities:** event handoffs and the team responsible for each.
- **Contacts:** fictional participants, vendors and reference information.
- **Manage:** planning tasks, event workspaces, assignments, notes and backup tools.
- **Reference tools:** fictional photo groups, searchable reception seating and a sample floor plan.
- **Demo clock:** starts during the fictional ceremony; explore other event times using the clock controls.

Edits are stored only in the current browser's local storage. This is a single-browser demonstration, with no shared synchronization or server-side authentication. Do not enter personal information. Local storage keys are separate from the original app.

## Privacy boundary

All people, vendors, venues, seating lists, planning notes and assignments are fictional. Dates have been moved to June 13–16, 2030. Event names, ritual structure, sequence and general operational interactions are retained to demonstrate the real use case.

No original Git history, contact details, addresses, spreadsheet IDs, photo-sharing links, QR codes, guest lists, private documents, recordings, infrastructure state or credentials are included. The ceremony guide and reception layout are newly authored examples. Private performance audio is excluded.

A generic privacy gate checks the complete public tree. A separate local comparison against the private source was used before publication; private reference terms are not embedded in this public repository. Automated scanning reduces risk but cannot establish that arbitrary future free text is safe: review new content before publishing.

## Build and verify

Requires Python 3 and Node.js 24 (no package dependencies).

```sh
python3 build/build.py
python3 build/privacy_check.py
node --check src/app.js
node build/check_data.js
```

`src/` contains only public demo source and fixtures. `site/` is the deployable output. Edit source files and rebuild; do not manually edit `site/index.html`. The GitHub workflow checks fixtures, syntax, privacy and reproducible output.

## Azure onboarding

The Azure workload uses resource group `rg-eus2p-wedops-01` and Free Static Web App `stapp-eus2p-wedops-01` in the existing landing zone. The **Validate and deploy wedding ops demo** GitHub Actions workflow builds and checks each change. Successful pushes to `main` deploy only the validated `site/` output; pull requests validate without deployment credentials. Use **Actions → Validate and deploy wedding ops demo → Run workflow** to redeploy `main` manually.

One-time setup: add the existing app's deployment token as the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in the GitHub environment `wedding-ops-production`. The credential belongs only to `stapp-eus2p-wedops-01`; do not use the guest app's token. Tokens must never be committed, printed, or placed in workflow inputs. Deployment fails clearly when the secret is absent. Review or roll back through Git commits and rerun the workflow.

`infra/main.tf` manages the dedicated Azure resources separately. Terraform state uses the existing landing-zone state account with a dedicated `ops-production` container. Content releases do not run Terraform or change DNS. Hosting configuration supplies security headers; inline scripts/styles remain permitted because the retained app is built as a self-contained HTML file. The older `infra/deploy.sh` is a bootstrap reference, not the routine release path.

Real operational use with personal data would require genuine authentication, authorization and a shared persistence design before deployment.

See [deployment verification](docs/deployment.md) for the live configuration and checks.
