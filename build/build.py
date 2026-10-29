#!/usr/bin/env python3
"""Build only the approved demo sources; never imports a private checkout."""
import re
import shutil
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
SRC, SITE = ROOT / 'src', ROOT / 'site'
shell = (SRC / 'skeleton.html').read_text()
shell = shell.replace('</style>', (SRC / 'event-day.css').read_text() + '\n</style>', 1)
parts = ['const EVENT_GUEST_WINDOWS = ' + (SRC / 'event-windows.json').read_text() + ';']
parts += [(SRC / f).read_text() for f in ['data.js', 'planning.js', 'photo-groups.js', 'seating.js', 'app.js']]
html, count = re.subn(r'<script>\s*</script>', lambda _: '<script>\n' + '\n'.join(parts) + '\n</script>', shell, count=1)
assert count == 1, 'Expected exactly one script placeholder'
SITE.mkdir(exist_ok=True)
(SITE / 'index.html').write_text(html)
print(f'Built site/index.html ({len(html):,} characters)')
