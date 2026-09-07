/* ══════════════════════════════════════════════════
   NOIRÉ — Interacciones
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ---------- 1. Header sólido al scrollear ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. Drawer / menú ---------- */
  const drawer = document.getElementById('drawer');
  const menuBtn = document.getElementById('menuBtn');

  function openDrawer() {
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    document.body.classList.add('is-locked');
    menuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    menuBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { drawer.hidden = true; }, 450);
  }

  if (drawer && menuBtn) {
    menuBtn.addEventListener('click', openDrawer);
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-drawer]') || e.target.closest('.drawer__nav a')) closeDrawer();
    });
  }

  /* ---------- 3. HOTSPOTS: click en la prenda → precio ----------
     Es la interacción principal del sitio: cada punto sobre la foto
     abre la ficha con nombre + precio de esa prenda.               */
  document.querySelectorAll('.hotspot__toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const spot = toggle.closest('.hotspot');
      const wasOpen = spot.classList.contains('is-open');
      // Solo una ficha abierta por slide
      spot.closest('.hotspots').querySelectorAll('.hotspot').forEach((s) => {
        s.classList.remove('is-open');
        s.querySelector('.hotspot__toggle').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        spot.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Click afuera o Escape → cerrar fichas
  function closeAllSpots() {
    document.querySelectorAll('.hotspot.is-open').forEach((s) => {
      s.classList.remove('is-open');
      const t = s.querySelector('.hotspot__toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', closeAllSpots);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeAllSpots();
    if (drawer && drawer.classList.contains('is-open')) closeDrawer();
  });

  /* ---------- 4. Hotspots de "Shop the Look" → resaltan el producto ---------- */
  document.querySelectorAll('.hotspot--plain').forEach((spot) => {
    spot.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = document.getElementById(spot.dataset.target);
      if (!item) return;
      document.querySelectorAll('.stl__item').forEach((i) => i.classList.remove('is-flash'));
      item.classList.add('is-flash');
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      setTimeout(() => item.classList.remove('is-flash'), 1800);
    });
  });

  /* ---------- 5. Slider del hero ---------- */
  // (esta sección y la del carrusel de abajo son opcionales: en páginas
  // que no tienen hero o carrusel de New In, simplemente no hacen nada)
  const hero = document.getElementById('hero');
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');

  if (hero && slides.length) {
    let current = 0;
    let timer = null;
    const DELAY = 7000;

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
      closeAllSpots();
    };
    const play = () => { stop(); timer = setInterval(() => goTo(current + 1), DELAY); };
    const stop = () => { if (timer) clearInterval(timer); };

    dots.forEach((dot) => dot.addEventListener('click', () => { goTo(+dot.dataset.goto); play(); }));
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', play);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
    if (slides.length > 1) play();
  }

  /* ---------- 6. Carrusel "New In" ---------- */
  const track = document.getElementById('newinTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (track && prevBtn && nextBtn) {
    const step = () => {
      const card = track.querySelector('.card');
      if (!card) return 300;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return card.getBoundingClientRect().width + gap;
    };
    const syncNav = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= max;
    };
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', syncNav, { passive: true });
    window.addEventListener('resize', syncNav);
    syncNav();
  }

  /* ---------- 7. Newsletter ---------- */
  const form = document.getElementById('newsForm');
  const email = document.getElementById('newsEmail');
  const msg = document.getElementById('newsMsg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      msg.textContent = ok ? '¡Listo! Ya estás en la lista.' : 'Ingresá un email válido.';
      msg.classList.add('is-on');
      if (ok) form.reset();
      setTimeout(() => msg.classList.remove('is-on'), 3500);
    });
  }

  /* ---------- 8. Reveal al entrar en viewport ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.stl__intro, .stl__media, .stl__item, .newin__intro, .card, .coll, .news__copy, .benefit')
      .forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = `opacity .8s cubic-bezier(.22,.61,.36,1) ${(i % 6) * 60}ms, transform .8s cubic-bezier(.22,.61,.36,1) ${(i % 6) * 60}ms`;
        io.observe(el);
      });
  }
})();
