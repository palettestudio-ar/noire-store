/* ══════════════════════════════════════════════════
   NOIRÉ — Panel del carrito
   Se inyecta solo en cualquier página que cargue este
   script (después de products.js y cart.js). Escucha
   el botón "Ver carrito" del header, sin importar si
   tiene id o no.
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  function ensureDrawer() {
    if (document.getElementById('cartDrawer')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="drawer drawer--right cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Carrito" hidden>
        <div class="drawer__backdrop" data-close-cart></div>
        <aside class="drawer__panel cart-drawer__panel">
          <button class="drawer__close" data-close-cart aria-label="Cerrar carrito">
            <img src="assets/icons/close.png" class="ico-img ico-img--lg" alt="" aria-hidden="true">
          </button>
          <h2 class="cart-drawer__title">Tu carrito</h2>
          <div class="cart-drawer__body" id="cartBody"></div>
          <div class="cart-drawer__foot" id="cartFoot"></div>
        </aside>
      </div>`;
    document.body.appendChild(wrap.firstElementChild);
  }

  function itemImage(item) {
    if (typeof getProduct !== 'function') return '';
    const product = getProduct(item.slug);
    const color = product && product.colors.find((c) => c.name === item.color);
    return product && color ? `assets/img/productos/${item.slug}-${color.id}-flat.jpg` : '';
  }

  function render() {
    const body = document.getElementById('cartBody');
    const foot = document.getElementById('cartFoot');
    if (!body || !foot) return;
    const items = Cart.read();

    if (!items.length) {
      body.innerHTML = '<p class="cart-drawer__empty">Tu carrito está vacío.</p>';
      foot.innerHTML = '<a href="catalogo.html" class="btn btn--dark cart-drawer__checkout">Ver catálogo</a>';
      return;
    }

    let subtotal = 0;
    body.innerHTML = items.map((item, i) => {
      subtotal += item.price * item.qty;
      const img = itemImage(item);
      const media = img
        ? `<img src="${img}" alt="${item.name}" class="cart-item__img">`
        : '<span class="cart-item__img cart-item__img--ph" aria-hidden="true"></span>';
      return `
        <div class="cart-item">
          ${media}
          <div class="cart-item__info">
            <p class="cart-item__name">${item.name}</p>
            <p class="cart-item__meta">${item.color} · Talle ${item.size}</p>
            <div class="cart-item__row">
              <label class="cart-item__qty">
                Cant.
                <select data-qty="${i}" aria-label="Cantidad de ${item.name}">
                  ${[1, 2, 3, 4, 5].map((n) => `<option value="${n}" ${n === item.qty ? 'selected' : ''}>${n}</option>`).join('')}
                </select>
              </label>
              <span class="cart-item__price">${typeof money === 'function' ? money(item.price * item.qty) : '$' + (item.price * item.qty).toFixed(2)}</span>
            </div>
          </div>
          <button class="cart-item__remove" data-remove="${i}" aria-label="Quitar ${item.name} del carrito">
            <img src="assets/icons/close.png" class="ico-img" alt="" aria-hidden="true">
          </button>
        </div>`;
    }).join('');

    const subtotalFmt = typeof money === 'function' ? money(subtotal) : '$' + subtotal.toFixed(2);
    foot.innerHTML = `
      <div class="cart-drawer__subtotal"><span>Subtotal</span><span>${subtotalFmt}</span></div>
      <button class="btn btn--dark cart-drawer__checkout" id="fakeCheckout">Finalizar compra</button>
      <p class="cart-drawer__note">Proyecto de portfolio — esta compra no se procesa de verdad.</p>
    `;
  }

  function open() {
    ensureDrawer();
    render();
    const drawer = document.getElementById('cartDrawer');
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    document.body.classList.add('is-locked');
  }

  function close() {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => { drawer.hidden = true; }, 450);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[aria-label="Ver carrito"]').forEach((btn) => {
      btn.addEventListener('click', open);
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-cart]')) return close();

    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      Cart.remove(Number(removeBtn.dataset.remove));
      return render();
    }

    const checkoutBtn = e.target.closest('#fakeCheckout');
    if (checkoutBtn) {
      const foot = document.getElementById('cartFoot');
      foot.innerHTML = '<p class="cart-drawer__thanks">¡Gracias por tu compra! · Esto es una demo, no se realizó ningún cobro real.</p>';
      return;
    }
  });

  document.addEventListener('change', (e) => {
    const select = e.target.closest('[data-qty]');
    if (!select) return;
    Cart.setQty(Number(select.dataset.qty), Number(select.value));
    render();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();
