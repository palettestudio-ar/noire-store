/* ══════════════════════════════════════════════════
   NOIRÉ — Carrito (mínimo, persistido en localStorage)
   ══════════════════════════════════════════════════ */
const Cart = (function () {
  'use strict';
  const KEY = 'noire_cart';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* modo privado */ }
    paint();
  }
  function count() {
    return read().reduce((n, i) => n + i.qty, 0);
  }
  function add(item) {
    const items = read();
    const found = items.find(i =>
      i.slug === item.slug && i.color === item.color && i.size === item.size);
    if (found) found.qty += item.qty;
    else items.push(item);
    write(items);
    return count();
  }
  function remove(index) {
    const items = read();
    items.splice(index, 1);
    write(items);
  }
  function setQty(index, qty) {
    const items = read();
    if (!items[index]) return;
    if (qty < 1) items.splice(index, 1);
    else items[index].qty = qty;
    write(items);
  }
  function paint() {
    const el = document.getElementById('cartCount');
    if (el) el.textContent = count();
  }

  document.addEventListener('DOMContentLoaded', paint);
  return { add, remove, setQty, count, read, paint };
})();
