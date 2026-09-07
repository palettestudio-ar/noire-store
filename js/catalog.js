/* ══════════════════════════════════════════════════
   NOIRÉ — Catálogo completo
   Grilla con todas las prendas, filtro por categoría y
   una muestra de los colores disponibles en cada una.

   Además de la categoría (Ropa/Accesorios/Calzado), entiende
   estos parámetros — cada uno recorta la base ANTES de mostrar
   los pills, así cada punto de entrada del sitio cae en su
   propio recorte, no todos en el mismo catálogo genérico:
     ?collection=essentials|after-dark|summer-state   (index.html → "Elegí tu mundo")
     ?season=verano|otono|invierno|primavera          (descubri.html → temporadas)
     ?family=neutros|negros|blancos|tierra|verdes|azules|rojos  (descubri.html → color)
     ?category=superiores|inferiores|vestidos|abrigos|accesorios (descubri.html → categoría)
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  const grid = document.getElementById('shopGrid');
  const filtersBox = document.getElementById('filters');
  const countEl = document.getElementById('shopCount');
  if (!grid) return;

  const eyebrowEl = document.getElementById('shopEyebrow');
  const titleEl = document.getElementById('shopTitle');
  const textEl = document.getElementById('shopText');
  const clearEl = document.getElementById('shopClear');

  const ALL = Object.keys(PRODUCTS).map(slug => Object.assign({ slug }, PRODUCTS[slug]));
  const qs = new URLSearchParams(location.search);

  /* ---------- Facetas que recortan la base (una por punto de entrada) ---------- */
  const collection = qs.get('collection');
  const season = qs.get('season');
  const family = qs.get('family');
  const category = qs.get('category');

  let BASE = ALL;
  let heading = null; // { eyebrow, title, text }

  if (collection && COLLECTIONS[collection]) {
    BASE = BASE.filter(p => (p.collections || []).includes(collection));
    const meta = COLLECTIONS[collection];
    heading = { eyebrow: 'Colección', title: meta.name, text: meta.desc };
  }
  if (season && SEASONS[season]) {
    BASE = BASE.filter(p => (p.seasons || []).includes(season));
    if (!heading) heading = { eyebrow: 'Temporada', title: SEASONS[season].name, text: SEASONS[season].desc };
  }
  if (family && COLOR_FAMILY_META[family]) {
    BASE = BASE.filter(p => p.colors.some(c => COLOR_FAMILIES[c.id] === family));
    if (!heading) heading = { eyebrow: 'Color', title: COLOR_FAMILY_META[family].name, text: `Toda la ropa en tonos ${COLOR_FAMILY_META[family].name.toLowerCase()}.` };
  }
  if (category && SHOP_CATEGORIES[category]) {
    const slots = SHOP_CATEGORIES[category].slots;
    BASE = BASE.filter(p => slots.includes(p.slot));
    if (!heading) heading = { eyebrow: 'Categoría', title: SHOP_CATEGORIES[category].name, text: `Todo lo que tenemos en ${SHOP_CATEGORIES[category].name.toLowerCase()}.` };
  }

  if (heading) {
    eyebrowEl.textContent = heading.eyebrow;
    titleEl.innerHTML = heading.title.replace(' ', '<br>');
    textEl.textContent = heading.text;
    clearEl.hidden = false;
  }

  /* ---------- Filtro por categoría de prenda (Ropa/Accesorios/Calzado) ---------- */
  const CATS = ['Todos', ...new Set(BASE.map(p => p.cat))];
  let active = qs.get('cat') || 'Todos';
  if (!CATS.includes(active)) active = 'Todos';

  function currentUrl(cat) {
    const params = new URLSearchParams();
    if (collection) params.set('collection', collection);
    if (season) params.set('season', season);
    if (family) params.set('family', family);
    if (category) params.set('category', category);
    if (cat && cat !== 'Todos') params.set('cat', cat);
    const q = params.toString();
    return 'catalogo.html' + (q ? '?' + q : '');
  }

  function paintFilters() {
    if (CATS.length <= 2) { filtersBox.hidden = true; return; } // no vale la pena filtrar 1 sola categoría
    filtersBox.hidden = false;
    filtersBox.innerHTML = CATS.map(cat => {
      const count = cat === 'Todos' ? BASE.length : BASE.filter(p => p.cat === cat).length;
      return `
        <button class="filter-pill${cat === active ? ' is-active' : ''}"
                data-cat="${cat}" role="tab" aria-selected="${cat === active}">
          ${cat} <span class="filter-pill__count">${count}</span>
        </button>`;
    }).join('');
  }

  function paintGrid() {
    const items = active === 'Todos' ? BASE : BASE.filter(p => p.cat === active);
    countEl.textContent = `${items.length} ${items.length === 1 ? 'prenda' : 'prendas'}`;

    grid.innerHTML = items.map(p => {
      // Si estamos navegando por familia de color (ej. "Tierra"), la miniatura
      // muestra ESE color siempre — aunque esté agotado, es lo que se vino a
      // ver acá; el aviso "Agotado" avisa en vez de mostrar otro color sin decir nada.
      const inFamily = family ? p.colors.find(c => COLOR_FAMILIES[c.id] === family) : null;
      const shown = inFamily || p.colors.find(isColorAvailable) || p.colors[0];
      const swatches = p.colors.map(c => `
        <span class="mini-swatch${isColorAvailable(c) ? '' : ' is-out'}"
              style="--chip:${c.hex}" title="${c.name}${isColorAvailable(c) ? '' : ' — agotado'}"></span>
      `).join('');
      const anyStock = inFamily ? isColorAvailable(shown) : p.colors.some(isColorAvailable);

      return `
        <li class="card">
          <a href="producto.html?id=${p.slug}" class="card__media"
             style="--img:url('${imgPath(p.slug, shown.id, 'model')}'); --tint:${shown.hex}">
            <span class="card__quick">Ver producto</span>
            ${anyStock ? '' : '<span class="card__badge">Agotado</span>'}
          </a>
          <h3 class="card__name">${p.name}</h3>
          <p class="price">${money(p.price)}</p>
          <div class="mini-swatches" aria-hidden="true">${swatches}</div>
        </li>`;
    }).join('');

    if (!items.length) {
      grid.innerHTML = `<li class="shop__empty">No hay prendas en este filtro por ahora.</li>`;
    }
  }

  filtersBox.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    active = btn.dataset.cat;
    history.replaceState(null, '', currentUrl(active));
    paintFilters();
    paintGrid();
  });

  paintFilters();
  paintGrid();
})();
