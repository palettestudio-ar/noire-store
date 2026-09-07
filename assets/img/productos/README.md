# Fotos de producto (por color)

Cada color de cada prenda tiene su propio set de 4 fotos. Convención
de nombre — **tenés que respetarla exacto**, así el sitio las
encuentra solo, sin tocar código:

```
assets/img/productos/{slug-de-la-prenda}-{color}-{vista}.jpg
```

- **slug**: el id del producto en `js/products.js` (ej. `oversized-blazer`).
- **color**: el id del color, también en `js/products.js` (ej. `negro`, `arena`).
- **vista**: una de estas 4 —
  - `model`   → la modelo de frente, con la prenda puesta (la que se ve primero)
  - `model-2` → la modelo de espaldas o en otro ángulo
  - `flat`    → la prenda sola, sin modelo (foto de producto)
  - `detail`  → un detalle: tela, costura, hebilla, etc.

Ejemplo para el Blazer en negro:

```
assets/img/productos/oversized-blazer-negro-model.jpg
assets/img/productos/oversized-blazer-negro-model-2.jpg
assets/img/productos/oversized-blazer-negro-flat.jpg
assets/img/productos/oversized-blazer-negro-detail.jpg
```

Repetís lo mismo para cada color de esa prenda (`oversized-blazer-arena-model.jpg`, etc.)
y para cada producto del catálogo.

## Estado actual

Ahora mismo hay **placeholders ilustrados** generados automáticamente
(silueta de línea fina + el tono real de cada color + etiqueta de la
vista) — no son fotos reales, son un reemplazo prolijo para que el
sitio se vea completo y la función de "elegir color" ya se pueda
probar de punta a punta. Se generaron con:

```bash
python scripts/gen_placeholders.py
```

## Para poner las fotos reales

1. Sacá/conseguí las 4 fotos por color (o al menos `model` y `flat`;
   si falta alguna vista, esa miniatura muestra el placeholder tintado
   en vez de romperse).
2. Guardalas en esta carpeta con el nombre exacto de arriba.
3. Listo — no hay que tocar `producto.html` ni el CSS. Si agregás un
   color o producto nuevo, sumalo en `js/products.js` (con su stock
   por talle) y opcionalmente en `scripts/gen_placeholders.py` para
   tener un placeholder mientras llega la foto real.

## Formato sugerido

- Relación 4:5 (vertical), mínimo 1000×1250px.
- Mismo fondo/luz entre `model` y `model-2` de un mismo color, para
  que el cambio de vista se sienta parejo.
- Mismo encuadre entre colores de una misma prenda (misma pose,
  cambia solo el color) — así el selector de color se siente como
  "la misma foto, otro color" y no como fotos sueltas.
