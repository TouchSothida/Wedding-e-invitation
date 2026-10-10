# Norint & Sothida: wedding e-invitation

Static site (no build step). Open `index.html` through any static server, or deploy the folder as is.

- Wedding details: `js/wedding.js`. All text (Khmer + English): `js/i18n.js`.
- Photos: put originals in `photos-src/` and run `python3 scripts/process_photos.py`. This writes 640/1280/2000 px WebP, strips GPS/EXIF, and rewrites `assets/photos/gallery.json`.
- Link preview: after you know the domain, run `python3 scripts/set_site_url.py https://your-domain`.
- Link-preview image: `scripts/og.html` -> `assets/og.jpg`.
- Music: `assets/music.mp3`. Make sure you have the rights to use it.
