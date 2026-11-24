(function () {
  var SPEED = 24; // px por segundo: movimiento lento
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach(function (c) {
    var t = c.querySelector('.carousel-track');
    var prev = c.querySelector('.prev');
    var next = c.querySelector('.next');
    var items = [].slice.call(t.children);

    // Bucle infinito: un juego de copias antes y otro despues (copias inertes)
    function clones() {
      return items.map(function (el) {
        var k = el.cloneNode(true);
        k.setAttribute('aria-hidden', 'true');
        k.setAttribute('inert', '');
        return k;
      });
    }
    var before = clones();
    var after = clones();
    before.forEach(function (k) { t.insertBefore(k, items[0]); });
    after.forEach(function (k) { t.appendChild(k); });
    c.classList.add('is-js');

    function gap() { return parseFloat(getComputedStyle(t).columnGap) || 20; }
    function setW() { return items[0].offsetLeft - before[0].offsetLeft; }
    function step() { return items[0].getBoundingClientRect().width + gap(); }
    function normalize() {
      var w = setW();
      if (t.scrollLeft >= 2 * w) t.scrollLeft -= w;
      else if (t.scrollLeft < step()) t.scrollLeft += w;
    }

    t.scrollLeft = setW();

    var playing = !reduce;
    var hover = false;
    var hold = 0;
    var visible = false;
    var pos = null;
    var last = 0;

    var pause = document.createElement('button');
    pause.type = 'button';
    pause.className = 'car-pause';
    function label() {
      pause.textContent = playing ? '⏸ Pausar' : '▶ Reanudar';
      pause.setAttribute('aria-label', playing ? 'Pausar el movimiento del carrusel' : 'Reanudar el movimiento del carrusel');
    }
    label();
    pause.addEventListener('click', function () { playing = !playing; pos = null; label(); });
    c.appendChild(pause);

    function touch() { hold = performance.now() + 4000; pos = null; }
    prev.addEventListener('click', function () {
      touch();
      if (t.scrollLeft < 2 * step()) t.scrollLeft += setW();
      t.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' });
    });
    next.addEventListener('click', function () {
      touch();
      t.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' });
    });
    t.addEventListener('scroll', normalize, { passive: true });
    ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(function (ev) {
      t.addEventListener(ev, touch, { passive: true });
    });
    c.addEventListener('mouseenter', function () { hover = true; pos = null; });
    c.addEventListener('mouseleave', function () { hover = false; pos = null; });
    window.addEventListener('resize', function () { normalize(); pos = null; });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(c);
    } else {
      visible = true;
    }

    function frame(ts) {
      var dt = Math.min(ts - (last || ts), 100);
      last = ts;
      var focused = c.matches(':focus-within');
      if (playing && visible && !hover && !focused && ts > hold) {
        if (pos === null) pos = t.scrollLeft;
        pos += SPEED * dt / 1000;
        var w = setW();
        if (pos >= 2 * w) pos -= w;
        t.scrollLeft = pos;
      } else {
        pos = null;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
})();
