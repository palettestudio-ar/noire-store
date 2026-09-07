/* ══════════════════════════════════════════════════
   NOIRÉ — Página de producto
   Ver la prenda puesta en la modelo + elegir color
   según la disponibilidad real de la tienda.
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  const root = document.getElementById('pdp');
  const slug = new URLSearchParams(location.search).get('id');
  const product = getProduct(slug);

  /* ---------- Producto inexistente ---------- */
  if (!product) {
    root.innerHTML =
      '<div class="pdp__empty">' +
      '<h1 class="section-title">No encontramos<br>esa prenda</h1>' +
      '<a href="index.html" class="link-arrow">Volver al inicio <span class="arrow"></span></a>' +
      '</div>';
    return;
  }

  document.title = `NOIRÉ — ${product.name}`;

  /* ---------- Estado ---------- */
  // Arranca en el primer color con stock; si no hay ninguno, en el primero.
  let color = product.colors.find(isColorAvailable) || product.colors[0];
  let view = 'model';                       // la vista "en la modelo" es la que se ve primero
  let size = firstAvailableSize(color);

  function firstAvailableSize(c) {
    return product.sizes.find(s => c.stock[s] > 0) || null;
  }

  /* ---------- Markup ---------- */
  root.innerHTML = `
    <nav class="crumbs" aria-label="Ruta">
      <a href="index.html">Inicio</a><span>/</span>
      <a href="index.html#new-in">${product.cat}</a><span>/</span>
      <em>${product.name}</em>
    </nav>

    <div class="pdp__grid">

      <!-- ───── Galería ───── -->
      <div class="gallery">
        <div class="gallery__thumbs" id="thumbs" role="tablist" aria-label="Vistas de la prenda"></div>
        <figure class="gallery__stage">
          <div class="gallery__img" id="stage" role="img" aria-label=""></div>
          <figcaption class="gallery__caption" id="caption"></figcaption>
        </figure>
      </div>

      <!-- ───── Información ───── -->
      <div class="pinfo">
        <p class="eyebrow eyebrow--dark">${product.cat}</p>
        <h1 class="pinfo__name">${product.name}</h1>
        <p class="pinfo__price">${money(product.price)}</p>
        <p class="pinfo__desc">${product.desc}</p>

        <!-- Color -->
        <div class="picker">
          <div class="picker__head">
            <span class="picker__label">Color</span>
            <span class="picker__value" id="colorName"></span>
          </div>
          <div class="swatches" id="swatches" role="radiogroup" aria-label="Color"></div>
        </div>

        <!-- Talle -->
        <div class="picker">
          <div class="picker__head">
            <span class="picker__label">Talle</span>
            <a href="#" class="picker__guide">Guía de talles</a>
          </div>
          <div class="sizes" id="sizes" role="radiogroup" aria-label="Talle"></div>
          <p class="stock-note" id="stockNote"></p>
        </div>

        <button class="btn btn--solid" id="addBtn">Agregar al carrito</button>
        <p class="pdp__msg" id="addMsg" role="status"></p>

        <ul class="pinfo__care">
          ${product.care.map(l => `<li>${l}</li>`).join('')}
        </ul>
      </div>
    </div>`;

  const stage    = document.getElementById('stage');
  const caption  = document.getElementById('caption');
  const thumbs   = document.getElementById('thumbs');
  const swatches = document.getElementById('swatches');
  const sizesBox = document.getElementById('sizes');
  const colorName= document.getElementById('colorName');
  const stockNote= document.getElementById('stockNote');
  const addBtn   = document.getElementById('addBtn');
  const addMsg   = document.getElementById('addMsg');

  /* ---------- Galería ---------- */
  function paintGallery() {
    const label = VIEWS.find(v => v.id === view).label;

    stage.style.setProperty('--img', `url('${imgPath(product.slug, color.id, view)}')`);
    stage.style.setProperty('--tint', color.hex);
    stage.setAttribute('aria-label', `${product.name} en color ${color.name} — ${label}`);
    caption.textContent = label;

    thumbs.innerHTML = VIEWS.map(v => `
      <button class="thumb${v.id === view ? ' is-active' : ''}" data-view="${v.id}"
              role="tab" aria-selected="${v.id === view}" title="${v.label}"
              style="--img:url('${imgPath(product.slug, color.id, v.id)}'); --tint:${color.hex}">
        <span class="thumb__label">${v.label}</span>
      </button>`).join('');
  }

  thumbs.addEventListener('click', (e) => {
    const btn = e.target.closest('.thumb');
    if (!btn) return;
    view = btn.dataset.view;
    paintGallery();
  });

  /* ---------- Colores ---------- */
  function paintColors() {
    colorName.textContent = color.name +
      (isColorAvailable(color) ? '' : ' — agotado');

    swatches.innerHTML = product.colors.map(c => {
      const avail = isColorAvailable(c);
      const units = colorStock(c);
      return `
        <button class="swatch${c.id === color.id ? ' is-active' : ''}${avail ? '' : ' is-out'}"
                data-color="${c.id}" role="radio"
                aria-checked="${c.id === color.id}" ${avail ? '' : 'disabled'}
                aria-label="${c.name}${avail ? '' : ' (agotado)'}"
                title="${c.name}${avail ? ` — ${units} disponibles` : ' — agotado'}">
          <span class="swatch__chip" style="--chip:${c.hex}"></span>
          <span class="swatch__name">${c.name}</span>
        </button>`;
    }).join('');
  }

  swatches.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch');
    if (!btn || btn.disabled) return;
    color = product.colors.find(c => c.id === btn.dataset.color);
    // Si el talle elegido no existe en el color nuevo, se pasa al primero disponible
    if (!size || color.stock[size] === 0) size = firstAvailableSize(color);
    render();
  });

  /* ---------- Talles ---------- */
  function paintSizes() {
    sizesBox.innerHTML = product.sizes.map(s => {
      const units = color.stock[s] || 0;
      return `
        <button class="size${s === size ? ' is-active' : ''}${units ? '' : ' is-out'}"
                data-size="${s}" role="radio" aria-checked="${s === size}"
                ${units ? '' : 'disabled'}
                title="${units ? `${units} disponibles` : 'Sin stock en este talle'}">${s}</button>`;
    }).join('');

    const units = size ? color.stock[size] : 0;
    if (!isColorAvailable(color)) {
      stockNote.textContent = 'Este color está agotado. Elegí otro para continuar.';
      stockNote.className = 'stock-note is-out';
    } else if (!size) {
      stockNote.textContent = 'Elegí un talle.';
      stockNote.className = 'stock-note';
    } else if (units <= 3) {
      stockNote.textContent = `Últimas ${units} unidades en ${color.name.toLowerCase()}, talle ${size}.`;
      stockNote.className = 'stock-note is-low';
    } else {
      stockNote.textContent = `Disponible — ${units} unidades en stock.`;
      stockNote.className = 'stock-note';
    }
  }

  sizesBox.addEventListener('click', (e) => {
    const btn = e.target.closest('.size');
    if (!btn || btn.disabled) return;
    size = btn.dataset.size;
    render();
  });

  /* ---------- Agregar al carrito ---------- */
  addBtn.addEventListener('click', () => {
    if (!size || !color.stock[size]) {
      addMsg.textContent = 'Elegí un color y un talle disponibles.';
      addMsg.classList.add('is-on', 'is-err');
      return setTimeout(() => addMsg.classList.remove('is-on'), 3000);
    }
    Cart.add({ slug: product.slug, name: product.name, price: product.price,
               color: color.name, size: size, qty: 1 });
    addMsg.textContent = `Agregado: ${product.name} · ${color.name} · Talle ${size}`;
    addMsg.classList.add('is-on');
    addMsg.classList.remove('is-err');
    setTimeout(() => addMsg.classList.remove('is-on'), 3000);
  });

  /* ---------- Render general ---------- */
  function render() {
    paintGallery();
    paintColors();
    paintSizes();
    addBtn.disabled = !size || !color.stock[size];
    addBtn.textContent = addBtn.disabled ? 'Sin stock' : 'Agregar al carrito';
  }
  render();

  /* ---------- Relacionados ---------- */
  const relatedGrid = document.getElementById('relatedGrid');
  const others = Object.keys(PRODUCTS).filter(s => s !== product.slug).slice(0, 4);
  if (others.length) {
    document.getElementById('related').hidden = false;
    relatedGrid.innerHTML = others.map(s => {
      const p = PRODUCTS[s];
      const c = p.colors.find(isColorAvailable) || p.colors[0];
      return `
        <li class="card card--light">
          <a href="producto.html?id=${s}" class="card__media"
             style="--img:url('${imgPath(s, c.id, 'model')}'); --tint:${c.hex}">
            <span class="card__quick">Ver producto</span>
          </a>
          <h3 class="card__name">${p.name}</h3>
          <p class="price">${money(p.price)}</p>
        </li>`;
    }).join('');
  }
})();
