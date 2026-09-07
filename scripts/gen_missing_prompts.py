# -*- coding: utf-8 -*-
"""
Genera assets/img/productos/PROMPTS_FALTANTES.md: un prompt de foto por
cada bloque {prenda}-{color}-{vista} que todavía muestra el placeholder
ilustrado (no foto real), agrupado por categoría > prenda > color.

No genera imágenes — solo arma los prompts en base a js/products.js y
al estado real de los archivos en assets/img/productos/.

Uso: python scripts/gen_missing_prompts.py
"""

import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROD = os.path.join(ROOT, "assets", "img", "productos")
OUT = os.path.join(PROD, "PROMPTS_FALTANTES.md")

MODEL_DESC = "a female model with olive-toned skin and dark wavy hair, 1.75 m tall"
SCENE = (
    "standing against a raw plaster/concrete wall, dramatic warm natural window "
    "light casting a hard diagonal shadow across the frame, moody minimalist "
    "editorial mood, shot on medium format film, shallow depth of field, muted "
    "cinematic color grade"
)
BRAND = "NOIRÉ fashion campaign aesthetic, 4:5 vertical portrait, no text, no logo"

# cat, [(color_id, color_name, hex)]
PRODUCTS = [
    ("Ropa", "Oversized Blazer", "oversized-blazer",
     "an oversized blazer in cool wool gabardine, dropped shoulder, notch lapel, double-breasted button closure, cut loose and falling straight over the body",
     "the notch lapel, double button and the weave of the cool wool gabardine",
     [("negro", "black", "#141414"), ("arena", "sand beige", "#C9BCA8"),
      ("chocolate", "chocolate brown", "#4A382C"), ("gris", "stone grey", "#8A8781")]),

    ("Ropa", "Wide Leg Trouser", "wide-leg-trouser",
     "a high-waisted wide-leg trouser with front pleats, fixed waistband and a fluid drape down to the floor",
     "the fixed waistband and the fluid drape of the wide leg fabric",
     [("negro", "black", "#141414"), ("crudo", "raw ecru", "#E4DED2"), ("oliva", "olive green", "#5C5B45")]),

    ("Ropa", "Chaleco Cropped", "silk-shirt",
     "a fitted cropped vest with a single row of front buttons, worn alone or layered under a blazer",
     "the single-button front placket and the fabric weave of the cropped vest",
     [("negro", "black", "#141414"), ("marfil", "ivory", "#EFE9DD"), ("vino", "deep burgundy wine", "#5A2530")]),

    ("Accesorios", "Leather Belt", "leather-belt",
     "a 3 cm wide cowhide leather belt with a rectangular matte-finish metal buckle",
     "the rectangular matte metal buckle and the grain of the leather",
     [("negro", "black", "#141414"), ("suela", "tan suede-brown", "#8A5F3C")]),

    ("Accesorios", "Minimal Bag", "minimal-bag",
     "a structured handbag with a short top handle and a magnetic closure, cotton-lined interior",
     "the magnetic closure hardware and the structured seams of the bag",
     [("negro", "black", "#141414"), ("coñac", "cognac tan", "#8B5A2B"), ("crema", "cream", "#DED5C4")]),

    ("Calzado", "Pointed Boots", "pointed-boots",
     "a pointed-toe tall-shaft boot with a 6 cm block heel and a side zip closure",
     "the block heel and the side-zip hardware",
     [("negro", "black", "#141414"), ("chocolate", "chocolate brown", "#4A382C")]),

    ("Ropa", "Ribbed Tank Top", "ribbed-tank-top",
     "a ribbed cotton-elastane tank top with a round neckline and wide straps, fitted close to the body",
     "the ribbed knit texture and the neckline seam",
     [("oliva", "olive green", "#5C5B45"), ("negro", "black", "#141414"), ("blanco", "off-white", "#F2F0EC")]),

    ("Ropa", "Leather Jacket", "leather-jacket",
     "a cropped eco-leather biker jacket with an asymmetric zip, wide lapels and a detachable waist belt",
     "the asymmetric zipper hardware and the belt buckle",
     [("negro", "black", "#141414"), ("chocolate", "chocolate brown", "#4A382C")]),

    ("Ropa", "Satin Shirt", "satin-shirt",
     "a satin shirt with a soft sheen, camp collar and a relaxed drape, worn tucked or untucked",
     "the soft satin sheen and the camp collar stitching",
     [("negro", "black", "#141414"), ("plata", "silver", "#B9B7B2"), ("vino", "deep burgundy wine", "#5A2530")]),

    ("Ropa", "Tailored Pants", "tailored-pants",
     "a tailored mid-rise trouser with a front crease and Italian pockets, straight leg",
     "the pressed front crease and the Italian pocket opening",
     [("negro", "black", "#141414"), ("gris", "stone grey", "#8A8781")]),

    ("Ropa", "Knit Cardigan", "knit-cardigan",
     "a mid-gauge knit cardigan with a front button placket and patch pockets, soft merino-blend knit",
     "the knit stitch texture and the button placket",
     [("arena", "sand beige", "#C9BCA8"), ("negro", "black", "#141414"), ("oliva", "olive green", "#5C5B45")]),

    ("Ropa", "Cashmere Coat", "cashmere-coat",
     "a long wrap coat in a cashmere-wool blend with a matching self-tie belt",
     "the self-tie belt knot and the brushed cashmere-wool texture",
     [("camel", "camel tan", "#B08A5C"), ("negro", "black", "#141414")]),

    ("Ropa", "Straight Jean", "straight-jean",
     "a high-rise straight-leg jean in rigid denim with an even, clean wash",
     "the topstitching, rivets and denim weave",
     [("azul", "mid blue denim", "#4A6285"), ("negro", "black denim", "#141414")]),

    ("Ropa", "Satin Slip Dress", "satin-slip-dress",
     "a bias-cut satin slip dress with adjustable thin straps and a side slit",
     "the adjustable strap hardware and the bias-cut seam",
     [("negro", "black", "#141414"), ("vino", "deep burgundy wine", "#5A2530"), ("marfil", "ivory", "#EFE9DD")]),

    ("Accesorios", "Leather Tote", "leather-tote",
     "an open-top leather tote bag with long shoulder handles and an unlined interior",
     "the handle stitching and the leather grain",
     [("negro", "black", "#141414")]),

    ("Ropa", "Bodysuit", "bodysuit",
     "a fitted cotton-elastane ribbed bodysuit with a round neckline and wide straps",
     "the ribbed knit texture at the neckline and straps",
     [("negro", "black", "#141414")]),

    ("Ropa", "Long Coat", "long-coat",
     "an ankle-length straight-cut wool coat with a tailored lapel",
     "the tailored lapel and button stitching",
     [("negro", "black", "#141414")]),
]

VIEWS = ["model", "model-2", "flat", "detail"]


def is_missing(slug, color_id, view):
    fn = os.path.join(PROD, f"{slug}-{color_id}-{view}.jpg")
    return (not os.path.exists(fn)) or os.path.getsize(fn) < 60000


def prompt_model(garment_desc, color_name, chex):
    return (
        f"Editorial fashion photograph of {MODEL_DESC}, wearing {garment_desc}, "
        f"in {color_name} (hex {chex}), facing the camera or in a relaxed three-quarter "
        f"pose, {SCENE}. {BRAND}."
    )


def prompt_model2(garment_desc, color_name, chex):
    return (
        f"Editorial fashion photograph of {MODEL_DESC}, wearing {garment_desc}, "
        f"in {color_name} (hex {chex}), shown from the back or in a side profile turn "
        f"to reveal the fit from another angle, same continuity of scene: {SCENE}. {BRAND}."
    )


def prompt_flat(garment_desc, color_name, chex):
    return (
        f"Minimal e-commerce product photograph of {garment_desc}, in {color_name} "
        f"(hex {chex}), no model — either laid flat or on an invisible mannequin, "
        f"styled neatly on a warm neutral-gray backdrop, soft directional studio "
        f"light that reveals the fabric drape and texture, clean flat-lay "
        f"composition, 4:5 vertical, no text, no logo."
    )


def prompt_detail(garment_desc, color_name, chex, detail_focus):
    return (
        f"Close-up macro product detail photograph of {garment_desc}, in {color_name} "
        f"(hex {chex}), focused tightly on {detail_focus}, soft raking studio light "
        f"that emphasizes texture, shallow depth of field, neutral warm-gray "
        f"background, minimalist luxury e-commerce detail shot, 4:5 vertical crop, "
        f"no text, no logo."
    )


PROMPT_FN = {
    "model": prompt_model,
    "model-2": prompt_model2,
    "flat": prompt_flat,
    "detail": prompt_detail,
}

VIEW_LABEL = {
    "model": "En la modelo (frente)",
    "model-2": "De espaldas / otro ángulo",
    "flat": "La prenda sola (flat)",
    "detail": "Detalle",
}


def main():
    lines = []
    lines.append("# Prompts de fotos faltantes — NOIRÉ\n")
    lines.append(
        "Generado automáticamente comparando `js/products.js` contra los "
        "archivos reales en `assets/img/productos/` — solo lista los bloques "
        "que hoy siguen con el placeholder ilustrado. Guardá cada foto con el "
        "nombre exacto indicado (`{slug}-{color}-{vista}.jpg`) en esta misma "
        "carpeta y el sitio la toma sola, sin tocar código.\n"
    )

    total = 0
    by_cat = {}
    for cat, name, slug, garment_desc, detail_focus, colors in PRODUCTS:
        for color_id, color_name, chex in colors:
            missing_views = [v for v in VIEWS if is_missing(slug, color_id, v)]
            if not missing_views:
                continue
            by_cat.setdefault(cat, []).append(
                (name, slug, color_id, color_name, chex, missing_views)
            )
            total += len(missing_views)

    lines.append(f"**Total: {total} imágenes faltantes.**\n")

    for cat in ["Ropa", "Accesorios", "Calzado"]:
        items = by_cat.get(cat)
        if not items:
            continue
        lines.append(f"\n## {cat}\n")
        current_name = None
        for name, slug, color_id, color_name, chex, missing_views in items:
            if name != current_name:
                lines.append(f"\n### {name}\n")
                current_name = name
            lines.append(f"\n#### Color: {color_name} (`{color_id}`, {chex})\n")
            for v in missing_views:
                garment_desc = next(p[3] for p in PRODUCTS if p[2] == slug)
                detail_focus = next(p[4] for p in PRODUCTS if p[2] == slug)
                fn = f"{slug}-{color_id}-{v}.jpg"
                if v == "detail":
                    prompt = PROMPT_FN[v](garment_desc, color_name, chex, detail_focus)
                else:
                    prompt = PROMPT_FN[v](garment_desc, color_name, chex)
                lines.append(f"- **{VIEW_LABEL[v]}** → guardar como `{fn}`\n")
                lines.append(f"  > {prompt}\n")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Escrito {OUT} con {total} prompts.")


if __name__ == "__main__":
    main()
