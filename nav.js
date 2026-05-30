// Version badge changelog toggle
(function () {
  const btn = document.getElementById('version-btn');
  const log = document.getElementById('changelog');
  if (!btn || !log) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    log.classList.toggle('open');
  });
  document.addEventListener('click', () => log.classList.remove('open'));
})();

// Red dot = back button on every page except the main page
(function () {
  const redDot = document.querySelector('.dot.red');
  if (!redDot) return;

  const isMainPage = ['/', '/index.html', 'index.html'].some(p =>
    window.location.pathname.endsWith(p) || window.location.pathname === '/'
  );

  if (isMainPage) {
    redDot.title = 'main page';
    redDot.style.cursor = 'default';
  } else {
    redDot.title = 'go back';
    redDot.style.cursor = 'pointer';
    redDot.style.transition = 'transform 0.15s, box-shadow 0.15s';
    redDot.addEventListener('mouseenter', () => {
      redDot.style.boxShadow = '0 0 8px #ff5f57';
      redDot.style.transform = 'scale(1.2)';
    });
    redDot.addEventListener('mouseleave', () => {
      redDot.style.boxShadow = '';
      redDot.style.transform = '';
    });
    redDot.addEventListener('click', () => {
      if (history.length > 1) {
        history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }
})();
