"""
Cuarta tanda: discover-new 113-153. Completa Oversized Blazer (chocolate),
Wide Leg Trouser (crudo), Chaleco Cropped (marfil+vino), Ribbed Tank Top
(blanco), Leather Jacket (chocolate), Satin Shirt (negro+plata+vino),
Tailored Pants (negro), Knit Cardigan (negro), Cashmere Coat (camel+negro),
Straight Jean (azul+negro), Satin Slip Dress (negro+vino+marfil), Bodysuit (negro).

Uso: python scripts/apply_discover_new_batch4.py
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "img" / "discover-new"
DST = ROOT / "assets" / "img" / "productos"

MAPPING = [
    ("113-chocolate-brown-oversized-blazer-back-campaign.png", "oversized-blazer", "chocolate", "model-2"),
    ("114-chocolate-brown-oversized-blazer-macro.png",         "oversized-blazer", "chocolate", "detail"),

    ("115-raw-ecru-wide-leg-trouser-campaign.png",      "wide-leg-trouser", "crudo", "model"),
    ("116-raw-ecru-wide-leg-trouser-back-campaign.png", "wide-leg-trouser", "crudo", "model-2"),
    ("117-raw-ecru-wide-leg-trouser-product.png",       "wide-leg-trouser", "crudo", "flat"),
    ("118-raw-ecru-wide-leg-trouser-macro.png",         "wide-leg-trouser", "crudo", "detail"),

    ("119-ivory-cropped-vest-macro.png",              "silk-shirt", "marfil", "detail"),
    ("120-burgundy-cropped-vest-back-campaign.png",   "silk-shirt", "vino", "model-2"),
    ("121-burgundy-cropped-vest-product.png",         "silk-shirt", "vino", "flat"),
    ("122-burgundy-cropped-vest-macro.png",           "silk-shirt", "vino", "detail"),

    ("123-off-white-ribbed-tank-macro.png", "ribbed-tank-top", "blanco", "detail"),

    ("124-chocolate-brown-biker-jacket-macro.png", "leather-jacket", "chocolate", "detail"),

    ("125-black-satin-shirt-product.png",         "satin-shirt", "negro", "flat"),
    ("126-black-satin-shirt-macro.png",           "satin-shirt", "negro", "detail"),
    ("127-silver-satin-shirt-campaign.png",       "satin-shirt", "plata", "model"),
    ("128-silver-satin-shirt-back-campaign.png",  "satin-shirt", "plata", "model-2"),
    ("129-silver-satin-shirt-product.png",        "satin-shirt", "plata", "flat"),
    ("130-silver-satin-shirt-macro.png",          "satin-shirt", "plata", "detail"),
    ("131-burgundy-satin-shirt-back-campaign.png","satin-shirt", "vino", "model-2"),
    ("132-burgundy-satin-shirt-product.png",      "satin-shirt", "vino", "flat"),
    ("133-burgundy-satin-shirt-macro.png",        "satin-shirt", "vino", "detail"),

    ("134-black-tailored-straight-trouser-product.png", "tailored-pants", "negro", "flat"),
    ("135-black-tailored-straight-trouser-macro.png",   "tailored-pants", "negro", "detail"),

    ("136-black-merino-cardigan-product.png", "knit-cardigan", "negro", "flat"),
    ("137-black-merino-cardigan-macro.png",   "knit-cardigan", "negro", "detail"),

    ("138-camel-cashmere-wrap-coat-macro.png",   "cashmere-coat", "camel", "detail"),
    ("139-black-cashmere-wrap-coat-product.png", "cashmere-coat", "negro", "flat"),
    ("140-black-cashmere-wrap-coat-macro.png",   "cashmere-coat", "negro", "detail"),

    ("141-mid-blue-straight-jean-product.png", "straight-jean", "azul", "flat"),
    ("142-mid-blue-straight-jean-macro.png",   "straight-jean", "azul", "detail"),
    ("143-black-straight-jean-product.png",    "straight-jean", "negro", "flat"),
    ("144-black-straight-jean-macro.png",      "straight-jean", "negro", "detail"),

    ("145-black-satin-slip-dress-product.png",        "satin-slip-dress", "negro", "flat"),
    ("146-black-satin-slip-dress-macro.png",          "satin-slip-dress", "negro", "detail"),
    ("147-burgundy-satin-slip-dress-back-campaign.png","satin-slip-dress", "vino", "model-2"),
    ("148-burgundy-satin-slip-dress-product.png",     "satin-slip-dress", "vino", "flat"),
    ("149-burgundy-satin-slip-dress-macro.png",       "satin-slip-dress", "vino", "detail"),
    ("150-ivory-satin-slip-dress-macro.png",          "satin-slip-dress", "marfil", "detail"),

    ("151-black-ribbed-bodysuit-back-campaign.png", "bodysuit", "negro", "model-2"),
    ("152-black-ribbed-bodysuit-product.png",       "bodysuit", "negro", "flat"),
    ("153-black-ribbed-bodysuit-macro.png",         "bodysuit", "negro", "detail"),
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
