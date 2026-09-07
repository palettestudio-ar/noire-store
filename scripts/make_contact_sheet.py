"""
Genera una hoja de contacto (grilla) con la vista 'model' de cada
combinacion prenda+color, con etiqueta, para auditar visualmente que
ninguna imagen quedo cruzada entre prenda/color.

Uso: python scripts/make_contact_sheet.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROD = os.path.join(ROOT, "assets", "img", "productos")

ITEMS = [
    ("oversized-blazer", "Oversized Blazer", ["negro", "arena", "chocolate", "gris"]),
    ("wide-leg-trouser", "Wide Leg Trouser", ["negro", "crudo", "oliva"]),
    ("silk-shirt", "Chaleco Cropped", ["negro", "marfil", "vino"]),
    ("leather-belt", "Leather Belt", ["negro", "suela"]),
    ("minimal-bag", "Minimal Bag", ["negro", "coñac", "crema"]),
    ("pointed-boots", "Pointed Boots", ["negro", "chocolate"]),
    ("ribbed-tank-top", "Ribbed Tank Top", ["oliva", "negro", "blanco"]),
    ("leather-jacket", "Leather Jacket", ["negro", "chocolate"]),
    ("satin-shirt", "Satin Shirt", ["negro", "plata", "vino"]),
    ("tailored-pants", "Tailored Pants", ["negro", "gris"]),
    ("knit-cardigan", "Knit Cardigan", ["arena", "negro", "oliva"]),
    ("cashmere-coat", "Cashmere Coat", ["camel", "negro"]),
    ("straight-jean", "Straight Jean", ["azul", "negro"]),
    ("satin-slip-dress", "Satin Slip Dress", ["negro", "vino", "marfil"]),
    ("leather-tote", "Leather Tote", ["negro"]),
    ("bodysuit", "Bodysuit", ["negro"]),
    ("long-coat", "Long Coat", ["negro"]),
]

TILE_W, TILE_H = 220, 320
LABEL_H = 46
COLS = 6

tiles = []
for slug, name, colors in ITEMS:
    for c in colors:
        tiles.append((slug, name, c))

rows = (len(tiles) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * TILE_W, rows * (TILE_H + LABEL_H)), (30, 30, 30))
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 15)
except Exception:
    font = ImageFont.load_default()

for i, (slug, name, color) in enumerate(tiles):
    col = i % COLS
    row = i // COLS
    x = col * TILE_W
    y = row * (TILE_H + LABEL_H)

    fn = os.path.join(PROD, f"{slug}-{color}-detail.jpg")
    if os.path.exists(fn):
        im = Image.open(fn).convert("RGB")
        im.thumbnail((TILE_W - 8, TILE_H - 8))
        px = x + (TILE_W - im.width) // 2
        py = y + (TILE_H - im.height) // 2
        sheet.paste(im, (px, py))
    else:
        draw.rectangle([x, y, x + TILE_W, y + TILE_H], fill=(80, 20, 20))
        draw.text((x + 10, y + 10), "FALTA", fill=(255, 255, 255), font=font)

    label = f"{name}\n{color}"
    draw.rectangle([x, y + TILE_H, x + TILE_W, y + TILE_H + LABEL_H], fill=(20, 20, 20))
    draw.text((x + 6, y + TILE_H + 4), label, fill=(240, 240, 240), font=font)

out = os.path.join(ROOT, "scripts", "contact_sheet_detail.jpg")
sheet.save(out, "JPEG", quality=85)
print("Escrito", out, f"({len(tiles)} tiles, {COLS}x{rows})")
