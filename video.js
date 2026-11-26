document.querySelectorAll('.video-facade').forEach(function (b) {
  b.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1';
    f.title = 'AR Process: presentación';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.className = 'nsframe';
    b.replaceWith(f);
  });
});
document.querySelectorAll('.mm-links a').forEach(function (a) {
  a.addEventListener('click', function () {
    var d = a.closest('details');
    if (d) d.removeAttribute('open');
  });
});
