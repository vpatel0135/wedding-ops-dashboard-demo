# Event Operations Dashboard Demo

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

Prepared for an independently deployed Azure Static Web App in the existing landing zone, with a dedicated workload resource group. Deploy only `site/`. `infra/main.tf` provisions the dedicated resource group and Free Static Web App. Run `bash infra/deploy.sh` in authenticated Azure Cloud Shell to build, check, apply the reviewed Terraform plan and deploy. Terraform state uses the existing landing-zone state account with a dedicated `ops-production` container. No automatic deployment identity or GitHub secret is created. Hosting configuration supplies security headers; inline scripts/styles remain permitted because the retained app is built as a self-contained HTML file.

Real operational use with personal data would require genuine authentication, authorization and a shared persistence design before deployment.
