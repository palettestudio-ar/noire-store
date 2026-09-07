"""
Quinta tanda: discover-new 87-90 -> Pointed Boots negro (set completo).

Uso: python scripts/apply_discover_new_batch5.py
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "discover-new"
DST = ROOT / "assets" / "img" / "productos"

MAPPING = [
    ("87-black-tall-pointed-boots-campaign.png",      "pointed-boots", "negro", "model"),
    ("88-black-tall-pointed-boots-campaign-v2.png",   "pointed-boots", "negro", "model-2"),
    ("89-black-tall-pointed-boots-product.png",       "pointed-boots", "negro", "flat"),
    ("90-black-tall-pointed-boots-macro-detail.png",  "pointed-boots", "negro", "detail"),
]

TARGET_SIZE = (1000, 1250)


def crop_to_ratio(im, target_w, target_h):
    target_ratio = target_w / target_h
    w, h = im.size
    ratio = w / h
    if ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 3
        im = im.crop((0, top, w, top + new_h))
    return im.resize(TARGET_SIZE, Image.LANCZOS)


def main():
    done, missing = [], []
    for filename, slug, color, view in MAPPING:
        src = SRC / filename
        if not src.exists():
            missing.append(filename)
            continue
        im = Image.open(src).convert("RGB")
        im = crop_to_ratio(im, *TARGET_SIZE)
        dst = DST / f"{slug}-{color}-{view}.jpg"
        im.save(dst, "JPEG", quality=88)
        done.append(dst.name)

    print(f"Aplicadas {len(done)} imagenes:")
    for name in done:
        print(f"  - {name}")
    if missing:
        print(f"\nNo encontradas ({len(missing)}):")
        for name in missing:
            print(f"  - {name}")


if __name__ == "__main__":
    main()
