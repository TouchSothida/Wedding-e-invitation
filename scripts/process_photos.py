"""Convert photos to WebP (640/1280/2000), apply EXIF rotation, strip all metadata (GPS/EXIF), write gallery list."""
import glob, json, os, sys
from PIL import Image, ImageOps
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
items = []
for i, f in enumerate(sorted(glob.glob(os.path.join(src, '*.[Jj][Pp][Gg]')))):
    im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')  # new image has no EXIF
    name = f'p{i:02d}'
    for w in (640, 1280, 2000):
        h = round(im.height * w / im.width) if im.width >= im.height else None
        if im.width >= im.height: r = im.resize((w, h), Image.LANCZOS)
        else:
            hh = round(w * 1.0 * im.height / im.width * (w/ w)) ; r = im.resize((w, round(w*im.height/im.width)), Image.LANCZOS)
        r.save(os.path.join(out, f'{name}-{w}.webp'), 'WEBP', quality=80 if w<2000 else 78, method=6)
    items.append({'id': name, 'w': im.width, 'h': im.height})
json.dump(items, open(os.path.join(out, 'gallery.json'), 'w'))
print(len(items), 'photos')
