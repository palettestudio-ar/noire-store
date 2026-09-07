/* ══════════════════════════════════════════════════
   NOIRÉ — Catálogo
   ──────────────────────────────────────────────────
   Cada producto tiene N colores y cada color tiene su
   propio set de fotos + stock por talle.

   Las fotos se resuelven solas con esta convención:
     assets/img/productos/{slug}-{color}-{vista}.jpg
   Vistas: model | model-2 | flat | detail
   Ej:  assets/img/productos/oversized-blazer-negro-model.jpg

   Stock: 0 = sin stock (el talle se muestra tachado).
          Si todos los talles de un color están en 0,
          el color aparece como AGOTADO y no se puede elegir.
   ══════════════════════════════════════════════════ */

const VIEWS = [
  { id: 'model',   label: 'En la modelo' },
  { id: 'model-2', label: 'De espaldas'  },
  { id: 'flat',    label: 'La prenda'    },
  { id: 'detail',  label: 'Detalle'      }
];

const PRODUCTS = {

  'oversized-blazer': {
    name: 'Oversized Blazer', price: 89, cat: 'Ropa', collections: ['essentials', 'after-dark'], slot: 'saco', seasons: ['otono', 'invierno'],
    desc: 'Blazer de corte holgado en gabardina de lana fría. Hombro caído, solapa de muesca y doble botón. Cae recto sobre el cuerpo y se lleva tanto abierto como cerrado.',
    care: ['70% lana fría, 30% viscosa', 'Forrería en cupro', 'Limpieza en seco', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { id: 'negro',   name: 'Negro',        hex: '#141414', stock: { XS: 3, S: 5, M: 4, L: 2, XL: 0 } },
      { id: 'arena',   name: 'Arena',        hex: '#C9BCA8', stock: { XS: 0, S: 2, M: 3, L: 1, XL: 1 } },
      { id: 'chocolate', name: 'Chocolate',  hex: '#4A382C', stock: { XS: 1, S: 0, M: 2, L: 0, XL: 0 } },
      { id: 'gris',    name: 'Gris Piedra',  hex: '#8A8781', stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0 } }
    ]
  },

  'wide-leg-trouser': {
    name: 'Wide Leg Trouser', price: 64, cat: 'Ropa', collections: ['essentials', 'summer-state'], slot: 'pantalon', seasons: ['otono', 'invierno'],
    desc: 'Pantalón de tiro alto y pierna ancha con pinzas al frente. Cintura fija con presilla interna y caída fluida hasta el piso.',
    care: ['62% viscosa, 38% poliéster', 'Lavar a mano en agua fría', 'Planchar del revés', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { id: 'negro', name: 'Negro',      hex: '#141414', stock: { XS: 4, S: 6, M: 5, L: 3, XL: 2 } },
      { id: 'crudo', name: 'Crudo',      hex: '#E4DED2', stock: { XS: 2, S: 3, M: 0, L: 1, XL: 0 } },
      { id: 'oliva', name: 'Oliva',      hex: '#5C5B45', stock: { XS: 0, S: 1, M: 2, L: 2, XL: 0 } }
    ]
  },

  'silk-shirt': {
    name: 'Chaleco Cropped', price: 59, cat: 'Ropa', collections: ['after-dark'], slot: 'top', seasons: ['otono', 'invierno'],
    desc: 'Chaleco cropped de corte ajustado con botonadura simple al frente. Se lleva solo o como capa interior bajo el blazer.',
    care: ['70% lana fría, 30% viscosa', 'Limpieza en seco', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { id: 'negro',  name: 'Negro',      hex: '#141414', stock: { XS: 2, S: 4, M: 3, L: 1 } },
      { id: 'marfil', name: 'Marfil',     hex: '#EFE9DD', stock: { XS: 1, S: 2, M: 2, L: 0 } },
      { id: 'vino',   name: 'Vino',       hex: '#5A2530', stock: { XS: 0, S: 0, M: 1, L: 1 } }
    ]
  },

  'leather-belt': {
    name: 'Leather Belt', price: 32, cat: 'Accesorios', collections: ['after-dark'], slot: 'cinturon', seasons: ['otono', 'invierno'],
    desc: 'Cinturón de cuero vacuno con hebilla rectangular metálica en acabado mate. Ancho 3 cm.',
    care: ['100% cuero vacuno', 'Hebilla de zamak', 'Limpiar con paño seco'],
    sizes: ['S', 'M', 'L'],
    colors: [
      { id: 'negro',  name: 'Negro',     hex: '#141414', stock: { S: 5, M: 6, L: 3 } },
      { id: 'suela',  name: 'Suela',     hex: '#8A5F3C', stock: { S: 2, M: 0, L: 1 } }
    ]
  },

  'minimal-bag': {
    name: 'Minimal Bag', price: 49, cat: 'Accesorios', collections: ['essentials', 'summer-state'], slot: 'bolso', seasons: ['otono', 'primavera'],
    desc: 'Bolso estructurado de mano con asa corta y cierre magnético. Interior forrado con bolsillo plano.',
    care: ['Cuero sintético de alta densidad', 'Interior en algodón', 'Medidas 24 × 18 × 9 cm'],
    sizes: ['Único'],
    colors: [
      { id: 'negro',   name: 'Negro',     hex: '#141414', stock: { 'Único': 7 } },
      { id: 'coñac',   name: 'Coñac',     hex: '#8B5A2B', stock: { 'Único': 2 } },
      { id: 'crema',   name: 'Crema',     hex: '#DED5C4', stock: { 'Único': 0 } }
    ]
  },

  'pointed-boots': {
    name: 'Pointed Boots', price: 79, cat: 'Calzado', collections: ['after-dark'], slot: 'calzado', seasons: ['otono', 'invierno'],
    desc: 'Bota caña alta en punta fina con taco bloque de 6 cm y cierre lateral. Suela de goma antideslizante.',
    care: ['Capellada de cuero sintético', 'Suela de goma', 'Taco 6 cm', 'Calza fiel al talle'],
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: [
      { id: 'negro',    name: 'Negro',     hex: '#141414', stock: { 35: 2, 36: 4, 37: 5, 38: 3, 39: 1, 40: 0 } },
      { id: 'chocolate', name: 'Chocolate', hex: '#4A382C', stock: { 35: 0, 36: 1, 37: 2, 38: 2, 39: 0, 40: 0 } }
    ]
  },

  'ribbed-tank-top': {
    name: 'Ribbed Tank Top', price: 29, cat: 'Ropa', collections: ['essentials', 'summer-state'], slot: 'top', seasons: ['verano', 'primavera'],
    desc: 'Musculosa de morley acanalado con escote redondo y tiras anchas. Ajuste al cuerpo con buena recuperación.',
    care: ['95% algodón, 5% elastano', 'Lavar en agua fría', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { id: 'oliva',  name: 'Oliva',   hex: '#5C5B45', stock: { XS: 3, S: 5, M: 4, L: 2 } },
      { id: 'negro',  name: 'Negro',   hex: '#141414', stock: { XS: 4, S: 6, M: 5, L: 3 } },
      { id: 'blanco', name: 'Blanco',  hex: '#F2F0EC', stock: { XS: 0, S: 2, M: 1, L: 0 } }
    ]
  },

  'leather-jacket': {
    name: 'Leather Jacket', price: 129, cat: 'Ropa', collections: ['after-dark'], slot: 'saco', seasons: ['otono', 'invierno'],
    desc: 'Campera de cuero de corte corto con cierre asimétrico, solapas anchas y cinto desmontable en la cintura.',
    care: ['100% cuero ecológico', 'Forrería en poliéster reciclado', 'Limpieza en seco', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { id: 'negro',     name: 'Negro',     hex: '#141414', stock: { XS: 1, S: 3, M: 2, L: 1 } },
      { id: 'chocolate', name: 'Chocolate', hex: '#4A382C', stock: { XS: 0, S: 2, M: 2, L: 0 } }
    ]
  },

  'satin-shirt': {
    name: 'Satin Shirt', price: 69, cat: 'Ropa', collections: ['after-dark'], slot: 'top', seasons: ['otono', 'invierno'],
    desc: 'Camisa de raso con brillo suave, cuello camisero y caída amplia. Se lleva por dentro o por fuera del pantalón.',
    care: ['100% poliéster satinado', 'Lavar a mano en agua fría', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { id: 'negro',  name: 'Negro',   hex: '#141414', stock: { XS: 2, S: 4, M: 4, L: 2 } },
      { id: 'plata',  name: 'Plata',   hex: '#B9B7B2', stock: { XS: 1, S: 1, M: 0, L: 0 } },
      { id: 'vino',   name: 'Vino',    hex: '#5A2530', stock: { XS: 0, S: 0, M: 0, L: 0 } }
    ]
  },

  'tailored-pants': {
    name: 'Tailored Pants', price: 69, cat: 'Ropa', collections: ['essentials'], slot: 'pantalon', seasons: ['otono', 'invierno'],
    desc: 'Pantalón sastrero de tiro medio con raya al frente y bolsillos italianos. Corte recto que estiliza sin apretar.',
    care: ['70% poliéster, 26% viscosa, 4% elastano', 'Limpieza en seco', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { id: 'negro', name: 'Negro',  hex: '#141414', stock: { XS: 3, S: 5, M: 4, L: 2, XL: 1 } },
      { id: 'gris',  name: 'Gris Piedra', hex: '#8A8781', stock: { XS: 1, S: 2, M: 3, L: 1, XL: 0 } }
    ]
  },

  'knit-cardigan': {
    name: 'Knit Cardigan', price: 85, cat: 'Ropa', collections: ['essentials'], slot: 'saco', seasons: ['otono', 'invierno'],
    desc: 'Cardigan de punto medio con botonadura al frente y bolsillos plaqué. Tejido suave que no pica.',
    care: ['50% lana merino, 50% acrílico', 'Lavar a mano en agua fría', 'Secar en plano', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { id: 'arena', name: 'Arena',  hex: '#C9BCA8', stock: { XS: 2, S: 3, M: 3, L: 1 } },
      { id: 'negro', name: 'Negro',  hex: '#141414', stock: { XS: 1, S: 2, M: 1, L: 0 } },
      { id: 'oliva', name: 'Oliva',  hex: '#5C5B45', stock: { XS: 0, S: 1, M: 0, L: 0 } }
    ]
  },

  'cashmere-coat': {
    name: 'Cashmere Coat', price: 149, cat: 'Ropa', collections: ['essentials'], slot: 'saco', seasons: ['invierno'],
    desc: 'Tapado largo de mezcla de cashmere, cruzado, con cinto al tono. La pieza de abrigo de la temporada.',
    care: ['60% lana, 20% cashmere, 20% poliamida', 'Limpieza en seco', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { id: 'camel', name: 'Camel',  hex: '#B08A5C', stock: { XS: 1, S: 2, M: 2, L: 1 } },
      { id: 'negro', name: 'Negro',  hex: '#141414', stock: { XS: 0, S: 2, M: 1, L: 1 } }
    ]
  },

  'straight-jean': {
    name: 'Straight Jean', price: 72, cat: 'Ropa', collections: ['summer-state'], slot: 'pantalon', seasons: ['primavera', 'verano'],
    desc: 'Jean de tiro alto y pierna recta en denim rígido. Lavado uniforme, sin roturas.',
    care: ['100% algodón', 'Lavar del revés', 'La modelo mide 1,75 m y usa talle 26'],
    sizes: ['24', '26', '28', '30', '32'],
    colors: [
      { id: 'azul',  name: 'Azul Medio', hex: '#4A6285', stock: { 24: 2, 26: 4, 28: 3, 30: 2, 32: 0 } },
      { id: 'negro', name: 'Negro',      hex: '#141414', stock: { 24: 1, 26: 2, 28: 2, 30: 0, 32: 0 } }
    ]
  },

  'satin-slip-dress': {
    name: 'Satin Slip Dress', price: 95, cat: 'Ropa', collections: ['after-dark'], slot: 'vestido', seasons: ['verano', 'otono'],
    desc: 'Vestido lencero de raso al bies, con breteles regulables y tajo lateral. Cae en diagonal y acompaña el movimiento.',
    care: ['100% poliéster satinado', 'Lavar a mano', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { id: 'negro',  name: 'Negro',   hex: '#141414', stock: { XS: 2, S: 3, M: 2, L: 1 } },
      { id: 'vino',   name: 'Vino',    hex: '#5A2530', stock: { XS: 1, S: 1, M: 0, L: 0 } },
      { id: 'marfil', name: 'Marfil',  hex: '#EFE9DD', stock: { XS: 0, S: 0, M: 0, L: 0 } }
    ]
  },

  'leather-tote': {
    name: 'Leather Tote', price: 99, cat: 'Accesorios', collections: ['after-dark'], slot: 'bolso', seasons: ['otono', 'invierno'],
    desc: 'Bolso tote de cuero con asas largas y silueta abierta. Interior amplio, ideal para el día a día con un aire más formal.',
    care: ['100% cuero vacuno', 'Interior sin forro', 'Medidas 40 × 32 × 14 cm'],
    sizes: ['Único'],
    colors: [
      { id: 'negro', name: 'Negro', hex: '#141414', stock: { 'Único': 5 } }
    ]
  },

  'bodysuit': {
    name: 'Bodysuit', price: 39, cat: 'Ropa', collections: ['essentials', 'after-dark'], slot: 'top', seasons: ['verano', 'primavera'],
    desc: 'Body escote redondo y tiras anchas en morley de algodón. Base ajustada al cuerpo, ideal para combinar bajo blazers o solo.',
    care: ['92% algodón, 8% elastano', 'Lavar en agua fría', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { id: 'negro', name: 'Negro', hex: '#141414', stock: { XS: 3, S: 4, M: 3, L: 1 } }
    ]
  },

  'long-coat': {
    name: 'Long Coat', price: 129, cat: 'Ropa', collections: ['after-dark'], slot: 'saco', seasons: ['invierno', 'otono'],
    desc: 'Tapado largo hasta el tobillo, de corte recto y solapa sastrera. La pieza de abrigo definitiva para looks monocromáticos.',
    care: ['80% lana, 20% poliéster', 'Limpieza en seco', 'La modelo mide 1,75 m y usa talle S'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { id: 'negro', name: 'Negro', hex: '#141414', stock: { XS: 1, S: 2, M: 2, L: 1 } }
    ]
  }

};

/* Colecciones editoriales (index.html → sección "Elegí tu mundo").
   Cada producto de PRODUCTS declara a qué colección(es) pertenece
   en su campo `collections`. Se usan para armar catalogo.html?collection=... */
const COLLECTIONS = {
  'essentials':    { name: 'Essentials',    desc: 'Minimal pieces for everyday.' },
  'after-dark':    { name: 'After Dark',    desc: 'For nights that become stories.' },
  'summer-state':  { name: 'Summer State',  desc: 'Light, fresh & made to last.' }
};

/* "Lugares" del look (armar-look.html → armador de outfit).
   Cada producto declara en qué lugar del cuerpo va con su campo
   `slot`. El armador arma una lista por slot y deja elegir libremente,
   sin forzar combinaciones — el vestido es standalone, no obliga a
   sacar el resto si alguien igual quiere sumar cinturón o bolso. */
const SLOTS = [
  { id: 'saco',     label: 'Saco / Abrigo' },
  { id: 'top',      label: 'Top / Camisa' },
  { id: 'vestido',  label: 'Vestido' },
  { id: 'pantalon', label: 'Pantalón' },
  { id: 'calzado',  label: 'Calzado' },
  { id: 'bolso',    label: 'Bolso' },
  { id: 'cinturon', label: 'Cinturón' }
];

/* Temporadas (descubri.html → tarjetas de temporada + filtro lateral).
   Cada producto declara en qué temporada(s) tiene sentido con `seasons`. */
const SEASONS = {
  'verano':    { name: 'Verano',    desc: 'Colección ligera y fresca.' },
  'otono':     { name: 'Otoño',     desc: 'Capas livianas, tonos cálidos.' },
  'invierno':  { name: 'Invierno',  desc: 'Abrigos, texturas y esenciales.' },
  'primavera': { name: 'Primavera', desc: 'Renovate con colores y flores.' }
};

/* Familias de color (descubri.html → "Explorá por color").
   Mapeo del id de cada color de PRODUCTS a una familia amplia —
   un producto "matchea" una familia si alguno de sus colores cae ahí. */
const COLOR_FAMILIES = {
  'negro':     'negros',
  'blanco':    'blancos',
  'marfil':    'blancos',
  'crema':     'blancos',
  'crudo':     'neutros',
  'arena':     'neutros',
  'gris':      'neutros',
  'plata':     'neutros',
  'chocolate': 'tierra',
  'camel':     'tierra',
  'coñac':     'tierra',
  'suela':     'tierra',
  'oliva':     'verdes',
  'azul':      'azules',
  'vino':      'rojos'
};
const COLOR_FAMILY_META = {
  'neutros': { name: 'Neutros', hex: '#C9BCA8' },
  'negros':  { name: 'Negros',  hex: '#141414' },
  'blancos': { name: 'Blancos', hex: '#F2F0EC' },
  'tierra':  { name: 'Tierra',  hex: '#8B5A2B' },
  'verdes':  { name: 'Verdes',  hex: '#5C5B45' },
  'azules':  { name: 'Azules',  hex: '#4A6285' },
  'rojos':   { name: 'Rojos',   hex: '#5A2530' }
};

/* "Comprá por categoría" (descubri.html) — agrupa los SLOTS en las
   5 categorías grandes con las que la gente realmente navega. */
const SHOP_CATEGORIES = {
  'superiores':  { name: 'Prendas Superiores',  slots: ['top'] },
  'inferiores':  { name: 'Prendas Inferiores',  slots: ['pantalon'] },
  'vestidos':    { name: 'Vestidos',            slots: ['vestido'] },
  'abrigos':     { name: 'Abrigos & Chaquetas', slots: ['saco'] },
  'accesorios':  { name: 'Accesorios',          slots: ['bolso', 'cinturon', 'calzado'] }
};

/* ---------- Helpers ---------- */

/** Ruta de la foto de un color en una vista dada.
    Nota: esta ruta se usa siempre dentro de una custom property CSS
    (--img) consumida desde css/styles.css. Los url() dentro de una
    custom property se resuelven relativos a la hoja de estilos que
    los USA, no a la página HTML — por eso el prefijo '../'.        */
function imgPath(slug, colorId, view) {
  return `../assets/img/productos/${slug}-${colorId}-${view}.jpg`;
}

/** Unidades totales de un color (sumando todos los talles). */
function colorStock(color) {
  return Object.values(color.stock).reduce((a, b) => a + b, 0);
}

/** Un color está disponible si le queda al menos una unidad. */
function isColorAvailable(color) {
  return colorStock(color) > 0;
}

/** Devuelve el producto + su slug, o null. */
function getProduct(slug) {
  const p = PRODUCTS[slug];
  return p ? Object.assign({ slug }, p) : null;
}

/** Formatea un precio en el formato del sitio. */
function money(n) {
  return '$' + n.toFixed(2);
}
