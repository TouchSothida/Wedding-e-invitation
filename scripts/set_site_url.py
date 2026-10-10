#!/usr/bin/env python3
"""Usage: python3 scripts/set_site_url.py https://your-domain.com
Writes the absolute og:image / og:url (needed for Telegram & Messenger link previews)
and the siteUrl used by the share buttons."""
import re, sys
url = sys.argv[1].rstrip('/')
p = 'index.html'; s = open(p, encoding='utf-8').read()
s = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{url}/assets/og.jpg">', s)
if 'property="og:url"' in s:
    s = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}/">', s)
else:
    s = s.replace('<meta property="og:type"', f'<meta property="og:url" content="{url}/">\n<meta property="og:type"', 1)
s = re.sub(r'<meta name="twitter:card"[^>]*>', f'<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="{url}/assets/og.jpg">', s, count=1) if 'twitter:image' not in s else s
open(p, 'w', encoding='utf-8').write(s)
p = 'js/wedding.js'; w = open(p, encoding='utf-8').read()
w = re.sub(r"siteUrl: '[^']*'", f"siteUrl: '{url}/'", w); open(p, 'w', encoding='utf-8').write(w)
print('done ->', url)
