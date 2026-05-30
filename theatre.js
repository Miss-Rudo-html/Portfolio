// ── Sidebar active link on scroll ──
const sections  = document.querySelectorAll('.theatre-section');
const navLinks  = document.querySelectorAll('.nav-link');
const scrollArea = document.getElementById('scroll-area');

scrollArea.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (scrollArea.scrollTop >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))
      ?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Lightbox ──
const lb        = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCounter = document.getElementById('lb-counter');
const lbClose   = document.getElementById('lb-close');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');

let currentGallery = [];
let currentIndex   = 0;

function openLightbox(imgs, index) {
  currentGallery = imgs;
  currentIndex   = index;
  showImage();
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showImage() {
  lbImg.src = currentGallery[currentIndex];
  lbCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
}

lbClose.addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

lbPrev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  showImage();
});

lbNext.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentGallery.length;
  showImage();
});

document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') lbNext.click();
  if (e.key === 'ArrowLeft')  lbPrev.click();
  if (e.key === 'Escape')     closeLightbox();
});

// ── Keypad ──
const keypadModal   = document.getElementById('keypad-modal');
const keypadDots    = document.getElementById('keypad-dots');
const keypadStatus  = document.getElementById('keypad-status');
const CODE          = '9898';
let   kpInput       = '';
let   kpUnlocked    = false;

function updateDots() {
  const filled = '●'.repeat(kpInput.length);
  const empty  = '○'.repeat(Math.max(0, 4 - kpInput.length));
  keypadDots.textContent = filled + empty;
}

document.querySelectorAll('.kp-btn[data-val]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (kpInput.length >= 4) return;
    kpInput += btn.dataset.val;
    updateDots();
    keypadStatus.textContent = '';
    keypadStatus.className = '';
  });
});

document.getElementById('kp-clear').addEventListener('click', () => {
  kpInput = '';
  updateDots();
  keypadStatus.textContent = '';
  keypadStatus.className = '';
});

document.getElementById('kp-enter').addEventListener('click', () => {
  if (kpInput === CODE) {
    keypadStatus.textContent = '// ACCESS GRANTED';
    keypadStatus.className = 'success';
    setTimeout(() => {
      keypadModal.classList.remove('open');
      kpUnlocked = true;
      const trigger = document.getElementById('prompt-book-trigger');
      const details = document.getElementById('prompt-book-details');
      trigger.classList.add('unlocked');
      details.classList.add('open');
      kpInput = '';
      updateDots();
      keypadStatus.textContent = '';
    }, 600);
  } else {
    keypadStatus.textContent = '// ACCESS DENIED';
    keypadStatus.className = 'error';
    document.getElementById('keypad-box').classList.add('shake');
    setTimeout(() => document.getElementById('keypad-box').classList.remove('shake'), 400);
    kpInput = '';
    updateDots();
  }
});

document.getElementById('prompt-book-trigger').addEventListener('click', () => {
  if (kpUnlocked) {
    const details = document.getElementById('prompt-book-details');
    details.classList.toggle('open');
  } else {
    kpInput = '';
    updateDots();
    keypadStatus.textContent = '';
    keypadModal.classList.add('open');
  }
});

keypadModal.addEventListener('click', e => {
  if (e.target === keypadModal) keypadModal.classList.remove('open');
});

// ── Expandable assignment panels ──
document.querySelectorAll('.assign-item.expandable').forEach(item => {
  item.addEventListener('click', () => {
    const target = document.getElementById(item.dataset.target);
    if (!target) return;
    const isOpen = target.classList.contains('open');
    target.classList.toggle('open', !isOpen);
    item.classList.toggle('open', !isOpen);
  });
});

// Wire up all image grids
document.querySelectorAll('.img-grid').forEach(grid => {
  const imgs = [...grid.querySelectorAll('img')].map(i => i.src);
  grid.querySelectorAll('img').forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(imgs, i));
  });
});
