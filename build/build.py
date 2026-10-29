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
style_match = re.search(r'<style>\s*(.*?)\s*</style>', shell, re.S)
assert style_match, 'Expected one inline style block'
html = shell[:style_match.start()] + '<link rel="stylesheet" href="/styles.css">' + shell[style_match.end():]
html, count = re.subn(
    r'<script>\s*</script>',
    '<script src="https://js.monitor.azure.com/scripts/b/ai.3.gbl.min.js" crossorigin="anonymous"></script>\n'
    '<script src="/telemetry.js"></script>\n'
    '<script src="/app.js" defer></script>',
    html,
    count=1,
)
assert count == 1, 'Expected exactly one script placeholder'
SITE.mkdir(exist_ok=True)
(SITE / 'index.html').write_text(html)
(SITE / 'styles.css').write_text(style_match.group(1) + '\n')
(SITE / 'app.js').write_text('\n'.join(parts) + '\n')
(SITE / 'telemetry.js').write_text((SRC / 'telemetry.js').read_text())
print(f'Built site/index.html ({len(html):,} characters)')
