# Public demo privacy review

Reviewed October 28, 2026 (America/New_York), before custom-domain publication.

## Scope and results

- Reviewed application source, inline HTML/CSS/JavaScript, fictional fixtures, generated production HTML, assets, infrastructure scripts, workflow and documentation.
- Scanned all 29 unique historical file blobs reachable from the public repository's four commits at review time. No original private repository history was imported.
- Compared against 600 private-source participant, guest, vendor, contact and venue name strings, plus 12 private contact/address/event-sharing references. Reference terms were kept outside this public repository.
- No original private names used as person records, phone numbers, email addresses, venue addresses, photo-sharing URLs, spreadsheet identifiers, private media, credentials, cloud account UUIDs or private keys were detected.
- Three additional name matches were manually reviewed as ceremony words used in event titles, not person records. Cultural event names and event order are intentionally retained.
- All shipped contact numbers and venue addresses are blank. Photo-sharing configuration and performance-audio references are null. The sample brochure and seating layout are newly authored demo assets.
- Public source includes generic contact, map, media and import/export UI functions. These functions contain no real contact values, private endpoints or private files.
- App edits are browser-local. No analytics collector, remote database, backend data feed or private integration is configured. Content Security Policy blocks outgoing application connections.
- Build privacy checks, JavaScript syntax checks and fixture-reference checks passed.

The public domain name, repository owner, deployment hostname and generic landing-zone resource names are intentional public project metadata. This review is evidence of checks performed, not a guarantee against all possible future content. Review new fixtures and source changes before publishing; do not enter personal information into the demo.
