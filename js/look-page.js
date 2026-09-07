/* ══════════════════════════════════════════════════
   NOIRÉ — Look 01: The After Hours
   Página de look curado: el conjunto completo con sus
   5 piezas, precio total, y sugeridos relacionados.
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  const listEl = document.getElementById('lookList');
  if (!listEl) return;

  /* ---------- Las 5 piezas de este look ---------- */
  const LOOK_ITEMS = [
    { slug: 'oversized-blazer', colorId: 'negro', thumb: '../assets/img/look-01/04-oversized-blazer.png',
      hx: 42, hy: 32 },
    { slug: 'silk-shirt',       colorId: 'negro', thumb: '../assets/img/look-01/05-tailored-vest.png',
      hx: 50, hy: 45 },
    { slug: 'wide-leg-trouser', colorId: 'negro', thumb: '../assets/img/look-01/06-wide-leg-trouser.png',
      hx: 50, hy: 57 },
    { slug: 'minimal-bag',      colorId: 'negro', thumb: '../assets/img/look-01/07-minimal-bag.png',
      hx: 30, hy: 78 },
    { slug: 'pointed-boots',    colorId: 'negro', thumb: '../assets/img/look-01/08-pointed-boots.png',
      hx: 50, hy: 86 }
  ];

  /* ---------- Sugeridos ("También te puede gustar") ---------- */
  const RELATED = [
    { slug: 'leather-jacket', thumb: '../assets/img/look-01/09-leather-jacket.png' },
    { slug: 'satin-shirt',    thumb: '../assets/img/look-01/10-satin-shirt.png' },
    { slug: 'leather-tote',   thumb: '../assets/img/look-01/11-leather-tote.png' },
    { slug: 'bodysuit',       thumb: '../assets/img/look-01/12-bodysuit.png' },
    { slug: 'long-coat',      thumb: '../assets/img/look-01/13-long-coat.png' }
  ];

  function itemData(it) {
    const p = getProduct(it.slug);
    const c = p.colors.find(c => c.id === it.colorId);
    return { p, c };
  }

  /* ---------- Lista de piezas ---------- */
  listEl.innerHTML = LOOK_ITEMS.map(it => {
    const { p } = itemData(it);
    return `
      <li class="stl__item">
        <div class="stl__thumb" style="--img:url('${it.thumb}')"></div>
        <div class="stl__info">
          <h3>${p.name}</h3>
          <p class="price">${money(p.price)}</p>
          <a href="producto.html?id=${p.slug}" class="link-arrow link-arrow--sm">Ver producto <span class="arrow"></span></a>
        </div>
      </li>`;
  }).join('');

  /* ---------- Hotspots sobre la foto principal ---------- */
  const hotspotsBox = document.getElementById('lookHotspots');
  hotspotsBox.innerHTML = LOOK_ITEMS.map(it => {
    const { p } = itemData(it);
    return `
      <div class="hotspot" style="--x:${it.hx}%; --y:${it.hy}%">
        <button class="hotspot__toggle" aria-expanded="false" aria-label="Ver precio de ${p.name}">
          <span class="hotspot__dot"><span class="hotspot__plus"></span></span>
          <span class="hotspot__line"></span>
        </button>
        <span class="hotspot__card">
          <span class="hotspot__name">${p.name}</span>
          <span class="hotspot__price">${money(p.price)}</span>
          <a href="producto.html?id=${p.slug}" class="hotspot__link">Ver producto</a>
        </span>
      </div>`;
  }).join('');

  /* ---------- Precio total + comprar look completo ---------- */
  const total = LOOK_ITEMS.reduce((sum, it) => sum + itemData(it).p.price, 0);
  document.getElementById('lookTotal').textContent = money(total);

  const buyBtn = document.getElementById('buyLookBtn');
  const buyMsg = document.getElementById('buyMsg');
  buyBtn.addEventListener('click', () => {
    let added = 0;
    LOOK_ITEMS.forEach(it => {
      const { p, c } = itemData(it);
      const size = p.sizes.find(s => c.stock[s] > 0);
      if (!size) return;
      Cart.add({ slug: p.slug, name: p.name, price: p.price, color: c.name, size, qty: 1 });
      added++;
    });
    buyMsg.textContent = added === LOOK_ITEMS.length
      ? `Agregaste el look completo (${added} prendas) al carrito.`
      : `Agregaste ${added} de ${LOOK_ITEMS.length} prendas — alguna se agotó justo ahora.`;
    buyMsg.classList.add('is-on');
    setTimeout(() => buyMsg.classList.remove('is-on'), 4000);
  });

  /* ---------- También te puede gustar ---------- */
  const track = document.getElementById('newinTrack');
  if (track) {
    track.innerHTML = RELATED.map(it => {
      const p = getProduct(it.slug);
      return `
        <li class="card">
          <a href="producto.html?id=${p.slug}" class="card__media" style="--img:url('${it.thumb}')">
            <span class="card__quick">Ver producto</span>
          </a>
          <h3 class="card__name">${p.name}</h3>
          <p class="price price--light">${money(p.price)}</p>
        </li>`;
    }).join('');
  }
})();
