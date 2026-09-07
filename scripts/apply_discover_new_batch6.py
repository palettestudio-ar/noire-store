"""
Sexta tanda: discover-new 154-172. Cierra Long Coat, Leather Belt, Minimal Bag
(negro+coñac+crema), Leather Tote y Pointed Boots (negro+chocolate).

Uso: python scripts/apply_discover_new_batch6.py
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "discover-new"
DST = ROOT / "assets" / "img" / "productos"

MAPPING = [
    ("154-black-wool-coat-back-campaign.png", "long-coat", "negro", "model-2"),
    ("155-black-wool-coat-product.png",       "long-coat", "negro", "flat"),
    ("156-black-wool-coat-macro-detail.png",  "long-coat", "negro", "detail"),

    ("157-black-leather-belt-product.png",      "leather-belt", "negro", "flat"),
    ("158-black-leather-belt-macro-detail.png", "leather-belt", "negro", "detail"),

    ("159-black-structured-handbag-campaign.png",      "minimal-bag", "negro", "model"),
    ("160-black-structured-handbag-back-campaign.png", "minimal-bag", "negro", "model-2"),
    ("161-black-structured-handbag-product.png",       "minimal-bag", "negro", "flat"),
    ("162-black-structured-handbag-macro-detail.png",  "minimal-bag", "negro", "detail"),
    ("163-cognac-structured-handbag-macro-detail.png", "minimal-bag", "coñac", "detail"),
    ("164-cream-structured-handbag-macro-detail.png",  "minimal-bag", "crema", "detail"),

    ("165-black-open-top-tote-back-campaign.png", "leather-tote", "negro", "model-2"),
    ("166-black-open-top-tote-product.png",       "leather-tote", "negro", "flat"),
    ("167-black-open-top-tote-macro-detail.png",  "leather-tote", "negro", "detail"),

    ("168-black-pointed-tall-boots-campaign.png",      "pointed-boots", "negro", "model"),
    ("169-black-pointed-tall-boots-back-campaign.png", "pointed-boots", "negro", "model-2"),
    ("170-black-pointed-tall-boot-product.png",        "pointed-boots", "negro", "flat"),
    ("171-black-pointed-tall-boot-macro-detail.png",   "pointed-boots", "negro", "detail"),
    ("172-chocolate-pointed-tall-boot-macro-detail.png", "pointed-boots", "chocolate", "detail"),
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
