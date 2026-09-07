# -*- coding: utf-8 -*-
"""
Genera placeholders ILUSTRADOS (no fotos) para NOIRÉ:
- Producto x color x vista  -> assets/img/productos/{slug}-{color}-{view}.jpg
- Imágenes editoriales del home (hero, look, colecciones, etc.)

Estética: fondo con degradé tonal del color de la prenda + silueta de
línea fina (según categoría de prenda) + etiqueta tipográfica con la
vista. Nada pretende ser una foto real: es un reemplazo prolijo hasta
que se cargue fotografía real (ver assets/img/productos/README.md).

Requiere Pillow (ya instalado). Se corre una sola vez:
    python scripts/gen_placeholders.py
"""

import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
PROD = os.path.join(IMG, "productos")
os.makedirs(PROD, exist_ok=True)

CREAM = (239, 237, 232)
INK = (26, 26, 26)


# ───────────────────────── utilidades de color ─────────────────────────

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def mix(c1, c2, t):
    return tuple(round(a + (b - a) * t) for a, b in zip(c1, c2))


def relative_luminance(rgb):
    def lin(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def ink_or_cream(bg):
    # Texto oscuro sobre fondos claros, crema sobre fondos oscuros
    return INK if relative_luminance(bg) > 0.42 else (245, 243, 238)


def font(size, weight="regular"):
    candidates = {
        "regular": ["arial.ttf", "Arial.ttf", "DejaVuSans.ttf"],
        "light": ["arial.ttf", "Arial.ttf", "DejaVuSans.ttf"],
    }
    for name in candidates.get(weight, candidates["regular"]):
        for base in (r"C:\Windows\Fonts", ""):
            path = os.path.join(base, name) if base else name
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


# ───────────────────────── fondo ─────────────────────────

def gradient_bg(w, h, tint, seed=0):
    """Degradé diagonal sutil en el tono de la prenda, con un leve grano."""
    top = mix(tint, (255, 255, 255), 0.22)
    bottom = mix(tint, (0, 0, 0), 0.30)
    img = Image.new("RGB", (w, h), top)
    px = img.load()
    for y in range(h):
        t = y / h
        row = mix(top, bottom, t)
        for x in range(0, w, 2):           # paso de 2px: más rápido, imperceptible
            px[x, y] = row
            if x + 1 < w:
                px[x + 1, y] = row

    # grano muy leve para que no se vea "plano"
    rnd = random.Random(seed)
    grain = Image.effect_noise((w, h), 14).convert("L")
    grain = grain.filter(ImageFilter.GaussianBlur(0.4))
    img = Image.composite(Image.new("RGB", (w, h), (255, 255, 255)), img, grain.point(lambda p: int(p * 0.05)))
    return img


# ───────────────────────── siluetas (línea fina) ─────────────────────────
# Cada función dibuja una silueta centrada en un box (cx, cy, s) con PIL,
# en el color `line`. s = escala de referencia (alto aprox. de la figura).

def _stroke(d, pts, line, w, closed=False):
    d.line(pts + ([pts[0]] if closed else []), fill=line, width=w, joint="curve")


def silhouette_person_generic(d, cx, cy, s, line, w):
    """Figura humana simplificada de pie, de frente — para 'model'."""
    head_r = s * 0.055
    hx, hy = cx, cy - s * 0.40
    d.ellipse([hx - head_r, hy - head_r, hx + head_r, hy + head_r], outline=line, width=w)
    neck_y = hy + head_r
    sh_y = neck_y + s * 0.03
    sh_w = s * 0.17
    hip_y = cy + s * 0.02
    hip_w = s * 0.12
    knee_y = cy + s * 0.24
    foot_y = cy + s * 0.46
    # torso
    _stroke(d, [(cx - sh_w, sh_y), (cx - hip_w, hip_y), (cx - hip_w * 0.9, knee_y * 0.5 + hip_y * 0.5)], line, w)
    _stroke(d, [(cx + sh_w, sh_y), (cx + hip_w, hip_y), (cx + hip_w * 0.9, knee_y * 0.5 + hip_y * 0.5)], line, w)
    d.line([(cx - sh_w, sh_y), (cx + sh_w, sh_y)], fill=line, width=w)
    # piernas
    leg_gap = s * 0.045
    _stroke(d, [(cx - hip_w * 0.7, hip_y), (cx - leg_gap - s * 0.01, knee_y), (cx - leg_gap, foot_y)], line, w)
    _stroke(d, [(cx + hip_w * 0.7, hip_y), (cx + leg_gap + s * 0.01, knee_y), (cx + leg_gap, foot_y)], line, w)
    # brazos
    _stroke(d, [(cx - sh_w, sh_y + s * 0.01), (cx - sh_w * 1.35, hip_y + s * 0.05), (cx - sh_w * 1.15, hip_y + s * 0.16)], line, w)
    _stroke(d, [(cx + sh_w, sh_y + s * 0.01), (cx + sh_w * 1.35, hip_y + s * 0.05), (cx + sh_w * 1.15, hip_y + s * 0.16)], line, w)


def silhouette_person_back(d, cx, cy, s, line, w):
    """Igual que de frente pero con una línea central (columna) — para 'model-2'."""
    silhouette_person_generic(d, cx, cy, s, line, w)
    d.line([(cx, cy - s * 0.33), (cx, cy + s * 0.02)], fill=line, width=max(1, w - 1))


def flat_jacket(d, cx, cy, s, line, w):
    top = cy - s * 0.30
    bottom = cy + s * 0.30
    hw = s * 0.24
    _stroke(d, [(cx - s*0.06, top), (cx - hw, top + s*0.06), (cx - hw*0.9, bottom), (cx - s*0.04, bottom - s*0.02)], line, w)
    _stroke(d, [(cx + s*0.06, top), (cx + hw, top + s*0.06), (cx + hw*0.9, bottom), (cx + s*0.04, bottom - s*0.02)], line, w)
    d.line([(cx - s*0.06, top), (cx - s*0.02, top + s*0.10)], fill=line, width=w)
    d.line([(cx + s*0.06, top), (cx + s*0.02, top + s*0.10)], fill=line, width=w)
    d.arc([cx - s*0.09, top - s*0.05, cx + s*0.09, top + s*0.06], 200, 340, fill=line, width=w)
    d.line([(cx - s*0.02, top + s*0.10), (cx - s*0.015, bottom - s*0.04)], fill=line, width=max(1, w-1))
    # mangas
    _stroke(d, [(cx - hw, top + s*0.07), (cx - hw*1.5, top + s*0.22), (cx - hw*1.4, bottom*0.55 + top*0.45)], line, w)
    _stroke(d, [(cx + hw, top + s*0.07), (cx + hw*1.5, top + s*0.22), (cx + hw*1.4, bottom*0.55 + top*0.45)], line, w)


def flat_shirt(d, cx, cy, s, line, w):
    flat_jacket(d, cx, cy, s * 0.9, line, w)


def flat_trouser(d, cx, cy, s, line, w):
    top = cy - s * 0.28
    bottom = cy + s * 0.30
    hw = s * 0.16
    d.line([(cx - hw, top), (cx + hw, top)], fill=line, width=w)
    gap = s * 0.02
    _stroke(d, [(cx - hw, top), (cx - hw*0.9, bottom), (cx - gap, bottom), (cx - gap*0.6, top + s*0.10)], line, w, closed=True)
    _stroke(d, [(cx + hw, top), (cx + hw*0.9, bottom), (cx + gap, bottom), (cx + gap*0.6, top + s*0.10)], line, w, closed=True)


def flat_dress(d, cx, cy, s, line, w):
    top = cy - s * 0.30
    bottom = cy + s * 0.34
    hw_top = s * 0.13
    hw_bot = s * 0.26
    _stroke(d, [(cx - hw_top, top), (cx - hw_bot, bottom)], line, w)
    _stroke(d, [(cx + hw_top, top), (cx + hw_bot, bottom)], line, w)
    d.arc([cx - hw_top*1.3, top - s*0.04, cx + hw_top*1.3, top + s*0.05], 200, 340, fill=line, width=w)
    d.line([(cx - hw_bot, bottom), (cx + hw_bot, bottom)], fill=line, width=w)


def flat_bag(d, cx, cy, s, line, w):
    top = cy - s * 0.10
    bottom = cy + s * 0.22
    hw = s * 0.22
    d.rounded_rectangle([cx - hw, top, cx + hw, bottom], radius=s*0.03, outline=line, width=w)
    d.arc([cx - hw*0.6, top - s*0.22, cx + hw*0.6, top + s*0.04], 190, 350, fill=line, width=w)


def flat_boots(d, cx, cy, s, line, w):
    top = cy - s * 0.30
    bottom = cy + s * 0.16
    hw = s * 0.10
    _stroke(d, [(cx - hw, top), (cx - hw, bottom), (cx - hw*2.2, bottom), (cx - hw*2.0, bottom - s*0.05), (cx - hw*0.4, bottom - s*0.05)], line, w)
    d.line([(cx - hw, top), (cx + hw*0.7, top)], fill=line, width=w)
    d.line([(cx + hw*0.7, top), (cx + hw*0.4, bottom - s*0.05)], fill=line, width=w)


def flat_belt(d, cx, cy, s, line, w):
    r = s * 0.30
    d.arc([cx - r, cy - r*0.5, cx + r, cy + r*0.5], 20, 340, fill=line, width=w)
    bw, bh = s*0.09, s*0.06
    d.rectangle([cx - bw/2, cy - bh/2, cx + bw/2, cy + bh/2], outline=line, width=w)


CATEGORY_SHAPES = {
    'oversized-blazer': flat_jacket,
    'leather-jacket': flat_jacket,
    'knit-cardigan': flat_jacket,
    'cashmere-coat': flat_jacket,
    'silk-shirt': flat_shirt,
    'satin-shirt': flat_shirt,
    'ribbed-tank-top': flat_shirt,
    'wide-leg-trouser': flat_trouser,
    'tailored-pants': flat_trouser,
    'straight-jean': flat_trouser,
    'satin-slip-dress': flat_dress,
    'minimal-bag': flat_bag,
    'pointed-boots': flat_boots,
    'leather-belt': flat_belt,
}

VIEW_LABELS = {
    'model': 'EN LA MODELO',
    'model-2': 'DE ESPALDAS',
    'flat': 'LA PRENDA',
    'detail': 'DETALLE',
}


# ───────────────────────── composición ─────────────────────────

def draw_label(d, w, h, text, ink):
    f = font(15)
    tw = d.textlength(text, font=f)
    x = (w - tw) / 2
    y = h - 46
    d.text((x, y), text, font=f, fill=ink)
    d.line([(w/2 - 20, y - 12), (w/2 + 20, y - 12)], fill=ink, width=1)


def draw_watermark(d, w, h, ink):
    f = font(11)
    text = "NOIRÉ · placeholder"
    tw = d.textlength(text, font=f)
    faded = tuple(list(ink) + [140]) if len(ink) == 3 else ink
    d.text((w - tw - 20, 20), text, font=f, fill=ink)


def title_case(slug):
    return slug.replace('-', ' ').title()


def draw_center_multiline(d, w, cy, lines, ink):
    """lines: lista de (texto, font, espaciado_extra_debajo)"""
    total_h = sum(d.textbbox((0, 0), t, font=f)[3] + gap for t, f, gap in lines)
    y = cy - total_h / 2
    for t, f, gap in lines:
        tw = d.textlength(t, font=f)
        th = d.textbbox((0, 0), t, font=f)[3]
        d.text(((w - tw) / 2, y), t, font=f, fill=ink)
        y += th + gap


def make_product_image(slug, color_id, color_hex, view, w=1000, h=1250):
    """Tarjeta tipográfica prolija (sin silueta de maniquí) mientras se
    carga la fotografía real: fondo degradé en el tono de la prenda +
    nombre del producto + color + vista, todo centrado y minimalista."""
    tint = hex_to_rgb(color_hex)
    seed = abs(hash((slug, color_id, view))) % 10_000
    img = gradient_bg(w, h, tint, seed=seed).convert("RGB")
    d = ImageDraw.Draw(img)
    ink = ink_or_cream(mix(tint, (255, 255, 255), 0.22))
    ink_soft = tuple(round(c * 0.72 + 0) for c in ink) if sum(ink) > 400 else tuple(min(255, round(c * 1.9 + 40)) for c in ink)

    # Wordmark arriba
    f_word = font(18)
    word = "NOIRÉ"
    tw = d.textlength(word, font=f_word)
    d.text(((w - tw) / 2, h * 0.10), word, font=f_word, fill=ink)

    # Bloque central: nombre del producto / color / vista
    f_name = font(int(w * 0.052))
    f_meta = font(int(w * 0.026))
    color_label = color_id.upper()
    view_label = VIEW_LABELS[view]

    draw_center_multiline(d, w, h * 0.50, [
        (title_case(slug), f_name, int(h * 0.018)),
    ], ink)

    meta = f"{color_label}  ·  {view_label}"
    tw = d.textlength(meta, font=f_meta)
    my = h * 0.50 + int(w * 0.052) * 0.9
    d.line([(w/2 - 26, my), (w/2 + 26, my)], fill=ink_soft, width=1)
    d.text(((w - tw) / 2, my + h * 0.03), meta, font=f_meta, fill=ink_soft)

    # Aviso discreto de que es un adelanto, no la foto final
    f_note = font(13)
    note = "PRÓXIMAMENTE"
    tw = d.textlength(note, font=f_note)
    d.text(((w - tw) / 2, h - h * 0.09), note, font=f_note, fill=ink_soft)

    img = img.filter(ImageFilter.SMOOTH_MORE)
    path = os.path.join(PROD, f"{slug}-{color_id}-{view}.jpg")
    img.save(path, quality=82)
    return path


def make_editorial(name, tint_hex, w, h, label, style="scene"):
    tint = hex_to_rgb(tint_hex)
    seed = abs(hash(name)) % 10_000
    img = gradient_bg(w, h, tint, seed=seed).convert("RGB")
    d = ImageDraw.Draw(img)
    line = ink_or_cream(mix(tint, (255, 255, 255), 0.22))
    cx, cy, s = w * 0.62, h * 0.52, h * 0.68
    silhouette_person_generic(d, cx, cy, s, line, max(2, int(h / 500)))
    draw_watermark(d, w, h, line)
    f = font(20)
    tw = d.textlength(label, font=f)
    d.text(((w - tw) / 2, h - 60), label, font=f, fill=line)
    path = os.path.join(IMG, f"{name}.jpg")
    img.save(path, quality=84)
    return path


# ───────────────────────── catálogo ─────────────────────────
# Espejo liviano de js/products.js — solo lo necesario (slug, colores)
# para generar las imágenes. Si agregás un producto o color nuevo en
# products.js, sumalo también acá y volvé a correr el script.

PRODUCTS = {
    'oversized-blazer': ['negro:#141414', 'arena:#C9BCA8', 'chocolate:#4A382C', 'gris:#8A8781'],
    'wide-leg-trouser': ['negro:#141414', 'crudo:#E4DED2', 'oliva:#5C5B45'],
    'silk-shirt':       ['negro:#141414', 'marfil:#EFE9DD', 'vino:#5A2530'],
    'leather-belt':     ['negro:#141414', 'suela:#8A5F3C'],
    'minimal-bag':      ['negro:#141414', 'coñac:#8B5A2B', 'crema:#DED5C4'],
    'pointed-boots':    ['negro:#141414', 'chocolate:#4A382C'],
    'ribbed-tank-top':  ['oliva:#5C5B45', 'negro:#141414', 'blanco:#F2F0EC'],
    'leather-jacket':   ['negro:#141414', 'chocolate:#4A382C'],
    'satin-shirt':      ['negro:#141414', 'plata:#B9B7B2', 'vino:#5A2530'],
    'tailored-pants':   ['negro:#141414', 'gris:#8A8781'],
    'knit-cardigan':    ['arena:#C9BCA8', 'negro:#141414', 'oliva:#5C5B45'],
    'cashmere-coat':    ['camel:#B08A5C', 'negro:#141414'],
    'straight-jean':    ['azul:#4A6285', 'negro:#141414'],
    'satin-slip-dress': ['negro:#141414', 'vino:#5A2530', 'marfil:#EFE9DD'],
    'leather-tote':     ['negro:#141414'],
    'bodysuit':         ['negro:#141414'],
    'long-coat':        ['negro:#141414'],
}

EDITORIAL = [
    # nombre archivo (sin .jpg),   tono,      tamaño,      etiqueta
    ('hero-1', '#2A2724', (2400, 1600), 'THE AFTER HOURS'),
    ('hero-2', '#8A8072', (2400, 1600), 'QUIET LUXURY'),
    ('hero-3', '#141414', (2400, 1600), 'NIGHT STORIES'),
    ('look',   '#141414', (900, 1200),  'SHOP THE LOOK'),
    ('p-blazer', '#141414', (300, 400), 'OVERSIZED BLAZER'),
    ('p-trouser', '#141414', (300, 400), 'WIDE LEG TROUSER'),
    ('p-bag', '#8B5A2B', (300, 400), 'MINIMAL BAG'),
    ('p-boots', '#141414', (300, 400), 'POINTED BOOTS'),
    ('new-1', '#5C5B45', (750, 1000), 'RIBBED TANK TOP'),
    ('new-2', '#141414', (750, 1000), 'LEATHER JACKET'),
    ('new-3', '#141414', (750, 1000), 'SATIN SHIRT'),
    ('new-4', '#8A8781', (750, 1000), 'TAILORED PANTS'),
    ('new-5', '#C9BCA8', (750, 1000), 'KNIT CARDIGAN'),
    ('coll-1', '#CFC7BB', (800, 1100), 'ESSENTIALS'),
    ('coll-2', '#141414', (800, 1100), 'AFTER DARK'),
    ('coll-3', '#DED5C4', (800, 1100), 'SUMMER STATE'),
    ('news',   '#0B0B0B', (1200, 1200), 'BE PART OF NOIRÉ'),
]


def main():
    """Regenera SOLO los placeholders de producto (assets/img/productos/).
    Las imágenes editoriales (hero, look, colecciones, new-in, etc.) ya
    tienen fotografía real cargada — este script no las toca para no
    pisarlas. Si en algún momento hace falta regenerarlas también,
    llamá a make_editorial(...) puntualmente, nunca en bloque."""
    count = 0
    for slug, colors in PRODUCTS.items():
        for entry in colors:
            color_id, color_hex = entry.split(':')
            for view in VIEW_LABELS:
                make_product_image(slug, color_id, color_hex, view)
                count += 1
    print(f"Generados {count} placeholders de producto en {PROD}")


if __name__ == "__main__":
    main()
