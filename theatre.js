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

// Wire up all image grids
document.querySelectorAll('.img-grid').forEach(grid => {
  const imgs = [...grid.querySelectorAll('img')].map(i => i.src);
  grid.querySelectorAll('img').forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(imgs, i));
  });
});
