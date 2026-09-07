/* ══════════════════════════════════════════════════
   NOIRÉ — Armá tu look
   Elegís una prenda por cada "lugar" (saco, top, pantalón,
   vestido, calzado, bolso, cinturón) entre las opciones y
   colores que la tienda tiene disponibles. Sin composición
   de imagen: cada pieza se ve puesta en la modelo con su
   propia foto — el tablero arma el conjunto completo.
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  const board = document.getElementById('board');
  if (!board) return;

  const slotsBox = document.getElementById('pickerSlots');
  const optionsBox = document.getElementById('pickerOptions');
  const countEl = document.getElementById('summaryCount');
  const totalEl = document.getElementById('summaryTotal');
  const clearBtn = document.getElementById('clearLook');
  const addBtn = document.getElementById('addLookBtn');
  const msgEl = document.getElementById('summaryMsg');

  const ALL = Object.keys(PRODUCTS).map(slug => Object.assign({ slug }, PRODUCTS[slug]));
  const bySlot = (slotId) => ALL.filter(p => p.slot === slotId);

  /* ---------- Estado ---------- */
  // look[slotId] = { slug, colorId } | null
  const look = Object.fromEntries(SLOTS.map(s => [s.id, null]));
  let activeSlot = SLOTS[0].id;

  // Arranca con el look de "Shop the Look" ya puesto, para no arrancar
  // de cero — a partir de ahí el usuario cambia lo que quiera.
  const DEFAULTS = {
    saco: 'oversized-blazer', pantalon: 'wide-leg-trouser',
    bolso: 'minimal-bag', calzado: 'pointed-boots'
  };
  Object.entries(DEFAULTS).forEach(([slotId, slug]) => {
    const p = PRODUCTS[slug];
    const c = p.colors.find(isColorAvailable);
    if (c) look[slotId] = { slug, colorId: c.id };
  });

  function productFor(sel) {
    return sel ? Object.assign({ slug: sel.slug }, PRODUCTS[sel.slug]) : null;
  }
  function colorFor(sel) {
    if (!sel) return null;
    return PRODUCTS[sel.slug].colors.find(c => c.id === sel.colorId);
  }

  /* ---------- Tablero ---------- */
  function paintBoard() {
    board.innerHTML = SLOTS.map(slot => {
      const sel = look[slot.id];
      if (!sel) {
        return `
          <button class="board__tile board__tile--empty" data-open="${slot.id}">
            <span class="board__plus">+</span>
            <span class="board__empty-label">${slot.label}</span>
          </button>`;
      }
      const p = productFor(sel);
      const c = colorFor(sel);
      return `
        <div class="board__tile">
          <a href="producto.html?id=${p.slug}" class="board__img"
             style="--img:url('${imgPath(p.slug, c.id, 'model')}'); --tint:${c.hex}"></a>
          <button class="board__remove" data-remove="${slot.id}" aria-label="Sacar ${p.name}">
            <img src="assets/icons/close.png" class="ico-img ico-img--sm" alt="" aria-hidden="true">
          </button>
          <div class="board__info">
            <span class="board__slot">${slot.label}</span>
            <span class="board__name">${p.name} — ${c.name}</span>
            <span class="board__price">${money(p.price)}</span>
          </div>
        </div>`;
    }).join('');
  }

  /* ---------- Selector de slot ---------- */
  function paintSlotTabs() {
    slotsBox.innerHTML = SLOTS.map(slot => {
      const items = bySlot(slot.id);
      const filled = !!look[slot.id];
      return `
        <button class="slot-tab${slot.id === activeSlot ? ' is-active' : ''}${filled ? ' is-filled' : ''}"
                data-slot="${slot.id}" role="tab" aria-selected="${slot.id === activeSlot}">
          ${slot.label} <span class="slot-tab__count">${items.length}</span>
        </button>`;
    }).join('');
  }

  /* ---------- Opciones del slot activo ---------- */
  function paintOptions() {
    const items = bySlot(activeSlot);
    const sel = look[activeSlot];

    if (!items.length) {
      optionsBox.innerHTML = `<p class="picker-options__empty">Todavía no hay prendas cargadas acá.</p>`;
      return;
    }

    optionsBox.innerHTML = items.map(p => `
      <div class="option">
        <div class="option__head">
          <span class="option__name">${p.name}</span>
          <span class="option__price">${money(p.price)}</span>
        </div>
        <div class="swatches">
          ${p.colors.map(c => {
            const avail = isColorAvailable(c);
            const isSel = sel && sel.slug === p.slug && sel.colorId === c.id;
            return `
              <button class="swatch${isSel ? ' is-active' : ''}${avail ? '' : ' is-out'}"
                      data-slug="${p.slug}" data-color="${c.id}"
                      ${avail ? '' : 'disabled'}
                      aria-label="${c.name}${avail ? '' : ' (agotado)'}"
                      title="${c.name}${avail ? '' : ' — agotado'}">
                <span class="swatch__chip" style="--chip:${c.hex}"></span>
                <span class="swatch__name">${c.name}</span>
              </button>`;
          }).join('')}
        </div>
      </div>
    `).join('');
  }

  /* ---------- Resumen ---------- */
  function paintSummary() {
    const chosen = SLOTS.map(s => look[s.id]).filter(Boolean);
    const total = chosen.reduce((sum, sel) => sum + productFor(sel).price, 0);
    countEl.textContent = `${chosen.length} ${chosen.length === 1 ? 'prenda elegida' : 'prendas elegidas'}`;
    totalEl.textContent = money(total);
    addBtn.disabled = chosen.length === 0;
  }

  function render() {
    paintBoard();
    paintSlotTabs();
    paintOptions();
    paintSummary();
  }

  /* ---------- Eventos ---------- */
  board.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open]');
    if (openBtn) { activeSlot = openBtn.dataset.open; render(); return; }
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) { look[removeBtn.dataset.remove] = null; render(); }
  });

  slotsBox.addEventListener('click', (e) => {
    const tab = e.target.closest('.slot-tab');
    if (!tab) return;
    activeSlot = tab.dataset.slot;
    render();
  });

  optionsBox.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch');
    if (!btn || btn.disabled) return;
    const already = look[activeSlot] && look[activeSlot].slug === btn.dataset.slug && look[activeSlot].colorId === btn.dataset.color;
    look[activeSlot] = already ? null : { slug: btn.dataset.slug, colorId: btn.dataset.color };
    render();
  });

  clearBtn.addEventListener('click', () => {
    SLOTS.forEach(s => { look[s.id] = null; });
    msgEl.classList.remove('is-on');
    render();
  });

  addBtn.addEventListener('click', () => {
    const chosen = SLOTS.map(s => look[s.id]).filter(Boolean);
    if (!chosen.length) return;
    let added = 0;
    chosen.forEach(sel => {
      const p = productFor(sel);
      const c = colorFor(sel);
      const size = p.sizes.find(s => c.stock[s] > 0);
      if (!size) return; // por si justo se agotó mientras elegía
      Cart.add({ slug: p.slug, name: p.name, price: p.price, color: c.name, size, qty: 1 });
      added++;
    });
    msgEl.textContent = added
      ? `Agregaste ${added} ${added === 1 ? 'prenda' : 'prendas'} de tu look al carrito.`
      : 'Esas prendas se agotaron justo ahora — elegí otro color.';
    msgEl.classList.add('is-on');
    setTimeout(() => msgEl.classList.remove('is-on'), 4000);
  });

  render();
})();
