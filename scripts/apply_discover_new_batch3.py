"""
Tercera tanda: completa Oliva (flat+detail) y agrega Arena + Gris Piedra
completos para Oversized Blazer / Knit Cardigan / Tailored Pants.

Uso: python scripts/apply_discover_new_batch3.py
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "discover-new"
DST = ROOT / "assets" / "img" / "productos"

MAPPING = [
    ("91-olive-wide-leg-trouser-product.png",       "wide-leg-trouser", "oliva", "flat"),
    ("92-olive-wide-leg-trouser-macro-detail.png",  "wide-leg-trouser", "oliva", "detail"),
    ("93-olive-ribbed-tank-top-product.png",        "ribbed-tank-top",  "oliva", "flat"),
    ("94-olive-ribbed-tank-top-macro-detail.png",   "ribbed-tank-top",  "oliva", "detail"),
    ("95-olive-merino-cardigan-product.png",        "knit-cardigan",    "oliva", "flat"),
    ("96-olive-merino-cardigan-macro-detail.png",   "knit-cardigan",    "oliva", "detail"),

    ("97-sand-beige-oversized-blazer-campaign.png",      "oversized-blazer", "arena", "model"),
    ("98-sand-beige-oversized-blazer-back-campaign.png", "oversized-blazer", "arena", "model-2"),
    ("99-sand-beige-oversized-blazer-product.png",       "oversized-blazer", "arena", "flat"),
    ("100-sand-beige-oversized-blazer-macro-detail.png", "oversized-blazer", "arena", "detail"),

    ("101-sand-beige-merino-cardigan-campaign.png",      "knit-cardigan", "arena", "model"),
    ("102-sand-beige-merino-cardigan-back-campaign.png", "knit-cardigan", "arena", "model-2"),
    ("103-sand-beige-merino-cardigan-product.png",       "knit-cardigan", "arena", "flat"),
    ("104-sand-beige-merino-cardigan-macro.png",         "knit-cardigan", "arena", "detail"),

    ("105-stone-grey-oversized-blazer-campaign.png",      "oversized-blazer", "gris", "model"),
    ("106-stone-grey-oversized-blazer-back-campaign.png", "oversized-blazer", "gris", "model-2"),
    ("107-stone-grey-oversized-blazer-product.png",       "oversized-blazer", "gris", "flat"),
    ("108-stone-grey-oversized-blazer-macro.png",         "oversized-blazer", "gris", "detail"),

    ("109-stone-grey-tailored-trouser-campaign.png",      "tailored-pants", "gris", "model"),
    ("110-stone-grey-tailored-trouser-back-campaign.png", "tailored-pants", "gris", "model-2"),
    ("111-stone-grey-tailored-trouser-product.png",       "tailored-pants", "gris", "flat"),
    ("112-stone-grey-tailored-trouser-macro.png",         "tailored-pants", "gris", "detail"),
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
