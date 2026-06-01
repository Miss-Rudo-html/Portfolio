// ── Scroll reveal animations ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');

    // Stagger learnings list items
    el.querySelectorAll('.learnings li').forEach((li, i) => {
      li.style.transitionDelay = `${0.15 + i * 0.1}s`;
      li.classList.add('visible');
    });

    // Stagger timeline steps
    el.querySelectorAll('.timeline-step').forEach((step, i) => {
      step.style.transitionDelay = `${0.1 + i * 0.12}s`;
      step.classList.add('visible');
    });

    revealObserver.unobserve(el);
  });
}, { root: document.getElementById('scroll-area'), threshold: 0.06 });

document.querySelectorAll('.theatre-section').forEach(s => revealObserver.observe(s));

// ── Sidebar active link on scroll ──
const sections   = document.querySelectorAll('.theatre-section');
const navLinks   = document.querySelectorAll('.nav-link');
const scrollArea = document.getElementById('scroll-area');
const sidebar    = document.getElementById('sidebar');

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
    closeSidebar();
  });
});

// ── Mobile sidebar toggle ──
const sidebarToggle  = document.getElementById('sidebar-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('open');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
}

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

sidebarOverlay.addEventListener('click', closeSidebar);

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
