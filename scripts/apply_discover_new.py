"""
Mapea las imágenes nuevas en assets/img/discover-new/ (22-66, fotos de
producto generadas con los prompts de la charla anterior) a su lugar
final en assets/img/productos/{slug}-{color}-{vista}.jpg, reemplazando
los placeholders ilustrados.

Uso: python scripts/apply_discover_new.py
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "discover-new"
DST = ROOT / "assets" / "img" / "productos"

# (archivo origen, slug, color, vista)
MAPPING = [
    ("22-chocolate-blazer-editorial.png",        "oversized-blazer", "chocolate", "model"),
    ("28-chocolate-blazer-flatlay.png",          "oversized-blazer", "chocolate", "flat"),

    ("23-chocolate-leather-biker-editorial.png", "leather-jacket",   "chocolate", "model"),
    ("29-chocolate-biker-jacket-product.png",    "leather-jacket",   "chocolate", "model-2"),

    ("24-camel-wrap-coat-editorial.png",         "cashmere-coat",    "camel",     "model"),
    ("30-camel-wrap-coat-product.png",           "cashmere-coat",    "camel",     "model-2"),

    ("25-cognac-top-handle-bag-editorial.png",   "minimal-bag",      "coñac",     "model"),
    ("31-cognac-top-handle-bag-product.png",     "minimal-bag",      "coñac",     "model-2"),

    ("26-tan-suede-belt-detail.png",             "leather-belt",     "suela",     "detail"),
    ("32-tan-suede-belt-product.png",            "leather-belt",     "suela",     "model-2"),

    ("27-chocolate-knee-high-boots.png",         "pointed-boots",    "chocolate", "model"),
    ("33-chocolate-knee-high-boots-product.png", "pointed-boots",    "chocolate", "model-2"),

    ("34-black-leather-belt-editorial.png",      "leather-belt",     "negro",     "model"),
    ("60-black-leather-belt-product.png",        "leather-belt",     "negro",     "model-2"),

    ("35-black-ribbed-tank-editorial.png",       "ribbed-tank-top",  "negro",     "model"),
    ("61-black-ribbed-tank-product.png",         "ribbed-tank-top",  "negro",     "model-2"),

    ("36-black-tailored-pants-editorial.png",    "tailored-pants",   "negro",     "model"),
    ("62-black-tailored-pants-product.png",      "tailored-pants",   "negro",     "model-2"),

    ("37-black-knit-cardigan-editorial.png",     "knit-cardigan",    "negro",     "model"),
    ("63-black-knit-cardigan-product.png",       "knit-cardigan",    "negro",     "model-2"),

    ("38-black-cashmere-coat-editorial.png",     "cashmere-coat",    "negro",     "model"),
    ("64-black-cashmere-coat-product.png",       "cashmere-coat",    "negro",     "model-2"),

    ("39-black-straight-jean-editorial.png",     "straight-jean",    "negro",     "model"),
    ("65-black-straight-jean-product.png",       "straight-jean",    "negro",     "model-2"),

    ("40-black-satin-slip-dress-editorial.png",  "satin-slip-dress", "negro",     "model"),
    ("66-black-satin-slip-dress-product.png",    "satin-slip-dress", "negro",     "model-2"),

    ("41-ivory-cropped-vest-editorial.png",      "silk-shirt",       "marfil",    "model"),
    ("45-ivory-cropped-vest-product.png",        "silk-shirt",       "marfil",    "model-2"),

    ("42-cream-minimal-bag-editorial.png",       "minimal-bag",      "crema",     "model"),
    ("46-cream-minimal-bag-product.png",         "minimal-bag",      "crema",     "model-2"),

    ("43-off-white-ribbed-tank-editorial.png",   "ribbed-tank-top",  "blanco",    "model"),
    ("47-off-white-ribbed-tank-product.png",     "ribbed-tank-top",  "blanco",    "model-2"),

    ("44-ivory-satin-slip-dress-editorial.png",  "satin-slip-dress", "marfil",    "model"),
    ("48-ivory-satin-slip-dress-product.png",    "satin-slip-dress", "marfil",    "model-2"),

    ("49-olive-wide-leg-trouser-editorial.png",  "wide-leg-trouser", "oliva",     "model"),
    ("52-olive-wide-leg-trouser-product.png",    "wide-leg-trouser", "oliva",     "model-2"),

    ("50-olive-ribbed-tank-editorial.png",       "ribbed-tank-top",  "oliva",     "model"),
    ("53-olive-ribbed-tank-product.png",         "ribbed-tank-top",  "oliva",     "model-2"),

    ("51-olive-knit-cardigan-editorial.png",     "knit-cardigan",    "oliva",     "model"),
    ("54-olive-knit-cardigan-product.png",       "knit-cardigan",    "oliva",     "model-2"),

    ("55-medium-blue-straight-jean-editorial.png", "straight-jean",  "azul",      "model"),
    ("56-medium-blue-straight-jean-product.png",   "straight-jean",  "azul",      "model-2"),

    ("57-burgundy-cropped-vest-editorial.png",   "silk-shirt",       "vino",      "model"),
    ("58-burgundy-satin-shirt-editorial.png",    "satin-shirt",      "vino",      "model"),
    ("59-burgundy-satin-slip-dress-editorial.png", "satin-slip-dress", "vino",    "model"),
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
        top = (h - new_h) // 3  # un poco más de aire arriba que abajo (retrato)
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

    print(f"Aplicadas {len(done)} imágenes:")
    for name in done:
        print(f"  - {name}")
    if missing:
        print(f"\nNo encontradas ({len(missing)}):")
        for name in missing:
            print(f"  - {name}")


if __name__ == "__main__":
    main()
