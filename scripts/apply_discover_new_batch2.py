"""
Segunda tanda: mapea assets/img/discover-new/67-86.png (todas en negro,
prioridad pedida por Tomás) a assets/img/productos/{slug}-{color}-{vista}.jpg.

Uso: python scripts/apply_discover_new_batch2.py
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "discover-new"
DST = ROOT / "assets" / "img" / "productos"

MAPPING = [
    ("67-black-oversized-blazer-campaign.png",           "oversized-blazer", "negro", "model"),
    ("68-black-oversized-blazer-back-campaign.png",      "oversized-blazer", "negro", "model-2"),
    ("69-black-oversized-blazer-product.png",            "oversized-blazer", "negro", "flat"),
    ("70-black-oversized-blazer-macro-detail.png",       "oversized-blazer", "negro", "detail"),

    ("71-black-wide-leg-trouser-campaign.png",           "wide-leg-trouser", "negro", "model"),
    ("72-black-wide-leg-trouser-back-campaign.png",      "wide-leg-trouser", "negro", "model-2"),
    ("73-black-wide-leg-trouser-product.png",            "wide-leg-trouser", "negro", "flat"),
    ("74-black-wide-leg-trouser-macro-detail.png",       "wide-leg-trouser", "negro", "detail"),

    ("75-black-cropped-vest-campaign.png",               "silk-shirt", "negro", "model"),
    ("76-black-cropped-vest-back-campaign.png",          "silk-shirt", "negro", "model-2"),
    ("77-black-cropped-vest-product.png",                "silk-shirt", "negro", "flat"),
    ("78-black-cropped-vest-macro-detail.png",           "silk-shirt", "negro", "detail"),

    ("79-black-ribbed-tank-top-product.png",             "ribbed-tank-top", "negro", "flat"),
    ("80-black-ribbed-tank-top-macro-detail.png",        "ribbed-tank-top", "negro", "detail"),

    ("81-black-eco-leather-biker-jacket-campaign.png",      "leather-jacket", "negro", "model"),
    ("82-black-eco-leather-biker-jacket-back-campaign.png", "leather-jacket", "negro", "model-2"),
    ("83-black-eco-leather-biker-jacket-product.png",       "leather-jacket", "negro", "flat"),
    ("84-black-eco-leather-biker-jacket-macro-detail.png",  "leather-jacket", "negro", "detail"),

    ("85-black-satin-shirt-campaign.png",                "satin-shirt", "negro", "model"),
    ("86-black-satin-shirt-back-campaign.png",           "satin-shirt", "negro", "model-2"),
]

TARGET_SIZE = (1000, 1250)  # 4:5, mismo formato que el resto de assets/img/productos


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
