/* ══════════════════════════════════════════════════
   NOIRÉ — Descubrí lo nuevo
   Solo el acordeón de la barra de filtros lateral —
   el resto de la página es contenido estático con links
   reales a catalogo.html (temporada, color, categoría,
   colección) y a look.html (The After Hours).
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.querySelectorAll('.filter-group__head').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.filter-group');
      const isOpen = group.classList.toggle('is-open');
      btn.querySelector('.filter-group__icon').textContent = isOpen ? '–' : '+';
    });
  });
})();
