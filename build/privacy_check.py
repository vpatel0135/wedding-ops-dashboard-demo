#!/usr/bin/env python3
"""Conservative public-demo gate. Run on all tracked candidate text files."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parent.parent
allowed = {'.js', '.json', '.html', '.css', '.svg', '.txt', '.md', '.py', '.yml', '.gitignore'}
failures = []
for path in ROOT.rglob('*'):
    if not path.is_file() or '.git' in path.parts:
        continue
    if path.suffix not in allowed and path.name != '.gitignore':
        failures.append(f'{path.relative_to(ROOT)}: unreviewed file type')
        continue
    text = path.read_text()
    patterns = {
        'email address': r'\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b',
        'telephone number': r'\b\d{3}[- .]\d{3}[- .]\d{4}\b',
        'cloud identifier': r'\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b',
        'private key': r'-----BEGIN [A-Z ]*PRIVATE KEY-----',
        'access token': r'\b(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}',
    }
    for label, pattern in patterns.items():
        if re.search(pattern, text): failures.append(f'{path.relative_to(ROOT)}: {label}')
    if path.parts[-2] == 'src' or 'site' in path.relative_to(ROOT).parts:
        for domain in re.findall(r'https?://([^/\s\"\'<>]+)', text):
            if domain not in {'www.w3.org', 'maps.google.com'}:
                failures.append(f'{path.relative_to(ROOT)}: external integration URL')
if failures:
    raise SystemExit('\n'.join(failures))
print('Privacy gate passed: text-only approved files; no detected contact details, tokens, cloud IDs or external integrations.')
