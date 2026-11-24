document.querySelectorAll('[data-carousel]').forEach(function (c) {
  var t = c.querySelector('.carousel-track');
  var prev = c.querySelector('.prev');
  var next = c.querySelector('.next');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  c.classList.add('is-js');
  function step() {
    var card = t.querySelector('.card');
    var gap = parseFloat(getComputedStyle(t).columnGap) || 20;
    return card.getBoundingClientRect().width + gap;
  }
  function update() {
    prev.disabled = t.scrollLeft <= 2;
    next.disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
  }
  function go(dir) {
    t.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
  }
  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });
  t.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});
