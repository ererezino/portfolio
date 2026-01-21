// Content Data
const PHOTOS = [
  { src: "/assets/photos/photo-1.jpg", caption: "Lagos, 2025", alt: "Street scene in Lagos" },
  { src: "/assets/photos/photo-2.jpg", caption: "Frankfurt, 2025", alt: "Frankfurt street" },
  { src: "/assets/photos/photo-3.jpg", caption: "Frankfurt, 2025", alt: "Architecture in Frankfurt" },
  { src: "/assets/photos/photo-4.jpg", caption: "Accra, 2025", alt: "Accra market" },
  { src: "/assets/photos/photo-5.jpg", caption: "Lagos, 2025", alt: "Lagos street" },
  { src: "/assets/photos/photo-6.jpg", caption: "Durham, 2024", alt: "Durham scene" }
];

const ARTICLES = [
  { title: "A quick note on consistency", date: "Jan 2026", topic: "Work / life", url: "/articles.html" },
  { title: "What I'm learning from walking", date: "Dec 2025", topic: "Movement", url: "/articles.html" }
];

const TRAVELS = [
  { title: "Frankfurt", meta: "2025 · small details, big calm", url: "/travels.html" },
  { title: "Accra", meta: "2025 · food, pace, and sunlight", url: "/travels.html" }
];

const MUSIC = [
  { title: "Remember", artist: "Asake", url: "https://music.youtube.com/watch?v=MhvVRw5XTVY", cover: "https://upload.wikimedia.org/wikipedia/en/9/97/Asake_-_Work_of_Art.png" },
  { title: "Gratitude", artist: "Anendlessocean", url: "https://music.youtube.com/watch?v=49mF49MR_Es", cover: "https://i.scdn.co/image/ab67616d0000b27331b046b5e8493d36db0f11da" },
  { title: "E Ti Tobi", artist: "EmmaOMG", url: "https://music.youtube.com/watch?v=ccg6uBQfViI", cover: "https://lh3.googleusercontent.com/LbQgNpK2UZz73LWbUFvvZ38O09ZzUQm0fkIISmrutPQVmEJ2yttEAmBKbqn-5UvE40fC6AHuSNEInvE0=w544-h544-l90-rj" }
];

const BOOKS = [
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", url: "https://www.goodreads.com/book/show/42844155", cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1598823299i/42844155.jpg" }
];

const TV = [
  { title: "Elsbeth", year: "2024", url: "https://www.imdb.com/title/tt26591110/", cover: "https://m.media-amazon.com/images/M/MV5BOTcwYzc0M2QtM2NiYy00MWU1LWEwYmYtZGYzYWM4MTZjZmU1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" }
];

const MONTHLY_GOAL = 310000;
const MONTHS = [
  { month: "January", year: 2026, isCurrent: true, steps: 198000, km: 140, avgStepsPerDay: 9914 },
  { month: "December", year: 2025, isCurrent: false, steps: 401117, km: 307, avgStepsPerDay: 12939 }
];

// Utilities
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n.toLocaleString();
const lerp = (a, b, t) => a + (b - a) * t;

// Theme
function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
function toggleTheme() {
  setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
}
const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
document.getElementById('mobileThemeToggle')?.addEventListener('click', toggleTheme);

// Cursor
const cursor = document.getElementById('cursor');
const cursorLabel = document.getElementById('cursorLabel');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches && cursor) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.classList.add('visible');
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
    cursorLabel.classList.remove('visible');
  });

  (function animateCursor() {
    cursorX = lerp(cursorX, mouseX, 0.15);
    cursorY = lerp(cursorY, mouseY, 0.15);
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    cursorLabel.style.left = `${cursorX}px`;
    cursorLabel.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  })();
}

function bindCursorHovers() {
  if (!cursor || prefersReducedMotion) return;

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!el.classList.contains('photo-item') && !el.classList.contains('photo-card')) cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover', 'photo-hover');
      cursorLabel.classList.remove('visible');
    });
  });

  document.querySelectorAll('.photo-item, .photo-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.remove('hover');
      cursor.classList.add('photo-hover');
      cursorLabel.textContent = 'View';
      cursorLabel.classList.add('visible');
    });
  });
}

// Magnetic buttons
function initMagneticButtons() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    const inner = btn.querySelector('.btn-inner') || btn;
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      inner.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => inner.style.transform = 'translate(0, 0)');
  });
}

// Header scroll + back-to-top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  document.getElementById('header')?.classList.toggle('scrolled', window.scrollY > 50);
  toTop?.classList.toggle('visible', window.scrollY > 700);
}, { passive: true });

toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// Mobile menu
const mobileMenu = document.getElementById('mobileMenu');
const menuBtn = document.getElementById('mobileMenuBtn');
const menuClose = document.getElementById('mobileMenuClose');

function openMenu() {
  mobileMenu?.classList.add('open');
  mobileMenu?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu?.classList.remove('open');
  mobileMenu?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

menuBtn?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMenu();
});

// Lightbox (with focus trap)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
let currentPhotoIndex = 0;
let lastFocusedEl = null;

function getFocusable(container) {
  return [...container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.hasAttribute('disabled'));
}

function openLightbox(index, opener) {
  currentPhotoIndex = index;
  lastFocusedEl = opener || document.activeElement;

  lightboxImg.src = PHOTOS[index].src;
  lightboxImg.alt = PHOTOS[index].alt;
  lightboxCaption.textContent = PHOTOS[index].caption;

  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus close button for accessibility
  lightbox.querySelector('.lightbox-close')?.focus();

  // Preload neighbors for faster nav
  const next = PHOTOS[(index + 1) % PHOTOS.length]?.src;
  const prev = PHOTOS[(index - 1 + PHOTOS.length) % PHOTOS.length]?.src;
  [next, prev].forEach(src => { const img = new Image(); img.src = src; });
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocusedEl?.focus();
}

function navigateLightbox(dir) {
  currentPhotoIndex = (currentPhotoIndex + dir + PHOTOS.length) % PHOTOS.length;
  lightboxImg.src = PHOTOS[currentPhotoIndex].src;
  lightboxImg.alt = PHOTOS[currentPhotoIndex].alt;
  lightboxCaption.textContent = PHOTOS[currentPhotoIndex].caption;
}

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);

  // Focus trap (Tab)
  if (e.key === 'Tab') {
    const focusables = getFocusable(lightbox);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Animated counter
function animateCounter(el, target, duration = 2000) {
  if (prefersReducedMotion) {
    el.textContent = fmt(target);
    return;
  }
  const start = performance.now();
  (function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = fmt(Math.floor(target * eased));
    if (progress < 1) requestAnimationFrame(update);
  })(start);
}

// Swipeable hero photos
class SwipeableGallery {
  constructor(container, photos) {
    this.container = container;
    this.photos = photos;
    this.currentIndex = 0;
    this.startX = 0;
    this.isDragging = false;
    this.deltaX = 0;
    this.render();
    this.bindEvents();
  }

  render() {
    const track = document.createElement('div');
    track.className = 'photo-gallery-track';

    this.photos.forEach((photo, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'photo-card';
      card.setAttribute('data-index', i);
      card.setAttribute('aria-label', `Open photo: ${photo.caption}`);
      card.innerHTML = `
        <img src="${photo.src}" alt="${photo.alt}" draggable="false" loading="eager" decoding="async" />
        <div class="photo-card-caption">
          <span>${photo.caption}</span>
          <div class="photo-card-indicator">
            ${this.photos.map((_, j) => `<span ${j === 0 ? 'class="active"' : ''}></span>`).join('')}
          </div>
        </div>
      `;
      track.appendChild(card);
    });

    const hint = document.createElement('div');
    hint.className = 'photo-gallery-hint';
    hint.innerHTML = `<span>Swipe or click</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>`;

    this.container.innerHTML = '';
    this.container.appendChild(track);
    this.container.appendChild(hint);

    this.cards = track.querySelectorAll('.photo-card');
    this.updatePositions();
  }

  updatePositions() {
    this.cards.forEach((card, i) => {
      const offset = (i - this.currentIndex + this.photos.length) % this.photos.length;
      if (offset === 0) card.setAttribute('data-position', '0');
      else if (offset === 1) card.setAttribute('data-position', '1');
      else if (offset === this.photos.length - 1) card.setAttribute('data-position', '2');
      else card.setAttribute('data-position', 'hidden');

      // Indicators: show "currentIndex" consistently
      card.querySelectorAll('.photo-card-indicator span').forEach((dot, j) => {
        dot.classList.toggle('active', j === this.currentIndex);
      });
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.updatePositions();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.updatePositions();
  }

  bindEvents() {
    this.cards.forEach(card => {
      card.addEventListener('click', () => {
        const pos = card.getAttribute('data-position');
        if (pos === '0') {
          const idx = parseInt(card.getAttribute('data-index'), 10);
          openLightbox(idx, card);
        } else {
          this.next();
        }
      });

      // Drag/swipe
      card.addEventListener('mousedown', e => this.onDragStart(e));
      card.addEventListener('touchstart', e => this.onDragStart(e), { passive: true });
    });

    document.addEventListener('mousemove', e => this.onDragMove(e), { passive: true });
    document.addEventListener('touchmove', e => this.onDragMove(e), { passive: true });
    document.addEventListener('mouseup', () => this.onDragEnd());
    document.addEventListener('touchend', () => this.onDragEnd());

    // keyboard: when any card focused
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  onDragStart(e) {
    this.isDragging = true;
    this.startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  }

  onDragMove(e) {
    if (!this.isDragging) return;
    const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    this.deltaX = x - this.startX;
  }

  onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.deltaX > 50) this.prev();
    else if (this.deltaX < -50) this.next();
    this.deltaX = 0;
  }
}

// Photos: filters + shuffle
let activePhotoFilter = 'All';

function getLocationTag(caption) {
  // "Lagos, 2025" -> "Lagos"
  return (caption || '').split(',')[0].trim() || 'Other';
}

function renderPhotoChips() {
  const wrap = document.getElementById('photoChips');
  if (!wrap) return;

  const tags = [...new Set(PHOTOS.map(p => getLocationTag(p.caption)))].sort((a, b) => a.localeCompare(b));
  const allTags = ['All', ...tags];

  wrap.innerHTML = allTags.map(tag => `
    <button class="chip ${tag === activePhotoFilter ? 'active' : ''}" type="button" data-tag="${tag}">
      ${tag}
    </button>
  `).join('');

  wrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      activePhotoFilter = btn.dataset.tag;
      renderPhotoChips();
      renderPhotoGrid();
      bindCursorHovers();
    });
  });
}

function filteredPhotos() {
  if (activePhotoFilter === 'All') return PHOTOS;
  return PHOTOS.filter(p => getLocationTag(p.caption) === activePhotoFilter);
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderPhotoGrid(overrideList = null) {
  const photoGrid = document.getElementById('photoGrid');
  if (!photoGrid) return;

  const list = overrideList || filteredPhotos();

  photoGrid.innerHTML = list.map((p) => {
    const originalIndex = PHOTOS.indexOf(p);
    return `
      <button type="button" class="photo-item" data-photo-index="${originalIndex}">
        <img src="${p.src}" alt="${p.alt}" loading="lazy" decoding="async" />
        <span class="photo-item-caption">${p.caption}</span>
      </button>
    `;
  }).join('');

  photoGrid.querySelectorAll('.photo-item').forEach(el => {
    el.addEventListener('click', () => openLightbox(parseInt(el.dataset.photoIndex, 10), el));
  });
}

// Render content
function renderContent() {
  // Hero photo gallery
  const heroStack = document.getElementById('heroPhotoStack');
  if (heroStack) {
    new SwipeableGallery(heroStack, PHOTOS.slice(0, 4));
  }

  // Photos: chips + grid
  renderPhotoChips();
  renderPhotoGrid();

  document.getElementById('shufflePhotos')?.addEventListener('click', () => {
    const list = shuffleArray(filteredPhotos());
    renderPhotoGrid(list);
    bindCursorHovers();
  });

  // Articles
  const articleGrid = document.getElementById('articleGrid');
  if (articleGrid) {
    articleGrid.innerHTML = ARTICLES.map(a => `
      <a class="article-card" href="${a.url}">
        <div class="article-card-top">
          <div class="article-card-kicker">${a.topic}</div>
          <div class="article-card-title">${a.title}</div>
        </div>
        <div class="article-card-bottom">
          <span class="article-card-date">${a.date}</span>
          <div class="article-card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </div>
        </div>
      </a>
    `).join('');
  }

  // Travels
  const travelGrid = document.getElementById('travelGrid');
  if (travelGrid) {
    travelGrid.innerHTML = TRAVELS.map(t => `
      <a class="travel-card" href="${t.url}">
        <div>
          <div class="travel-card-title">${t.title}</div>
          <div class="travel-card-meta">${t.meta}</div>
        </div>
        <div class="travel-card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </a>
    `).join('');
  }

  // Music, Books, TV
  document.getElementById('musicList').innerHTML = MUSIC.map(m => `
    <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="into-item">
      <div class="into-cover"><img src="${m.cover}" alt="${m.title}" loading="lazy" decoding="async"></div>
      <div class="into-text">
        <div class="into-title">${m.title}</div>
        <div class="into-meta">${m.artist}</div>
      </div>
    </a>
  `).join('');

  document.getElementById('bookList').innerHTML = BOOKS.map(b => `
    <a href="${b.url}" target="_blank" rel="noopener noreferrer" class="into-item">
      <div class="into-cover"><img src="${b.cover}" alt="${b.title}" loading="lazy" decoding="async"></div>
      <div class="into-text">
        <div class="into-title">${b.title}</div>
        <div class="into-meta">${b.author}</div>
      </div>
    </a>
  `).join('');

  document.getElementById('tvList').innerHTML = TV.map(t => `
    <a href="${t.url}" target="_blank" rel="noopener noreferrer" class="into-item">
      <div class="into-cover"><img src="${t.cover}" alt="${t.title}" loading="lazy" decoding="async"></div>
      <div class="into-text">
        <div class="into-title">${t.title}</div>
        <div class="into-meta">${t.year}</div>
      </div>
    </a>
  `).join('');

  // Month cards
  const monthCards = document.getElementById('monthCards');
  if (monthCards) {
    monthCards.innerHTML = MONTHS.map(m => {
      const pct = Math.round((m.steps / MONTHLY_GOAL) * 100);
      const barWidth = Math.min(pct, 100);
      const met = m.steps >= MONTHLY_GOAL;
      const stateClass = m.isCurrent ? 'current' : (met ? 'completed' : '');
      const badgeClass = m.isCurrent ? 'now' : (met ? 'complete' : '');
      const badgeText = m.isCurrent ? 'In Progress' : (met ? 'Complete' : 'Not yet');

      return `
        <div class="month-card ${stateClass}">
          <div class="month-card-header">
            <div class="month-name">${m.month} ${m.year}</div>
            <span class="month-badge ${badgeClass}">${badgeText}</span>
          </div>

          <div class="month-steps">${fmt(m.steps)}</div>
          <div class="month-goal"><span class="month-pct">${pct}%</span> of 310k goal</div>

          <div class="progress-wrapper">
            <div class="progress-track">
              <div class="progress-fill" data-width="${barWidth}"></div>
            </div>
          </div>

          <div class="month-details">
            <div>
              <div class="month-detail-value">${m.km} km</div>
              <div class="month-detail-label">Distance</div>
            </div>
            <div>
              <div class="month-detail-value">${fmt(m.avgStepsPerDay)}</div>
              <div class="month-detail-label">Daily Avg</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Scroll animations
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('in-view');

      if (entry.target.id === 'movement') {
        entry.target.querySelectorAll('.progress-fill').forEach(fill => {
          // allow layout first, then animate width
          setTimeout(() => {
            fill.style.width = fill.dataset.width + '%';
          }, prefersReducedMotion ? 0 : 260);
        });

        const totalSteps = document.getElementById('totalSteps');
        const totalKm = document.getElementById('totalKm');
        const dailyAvg = document.getElementById('dailyAvg');

        if (totalSteps) animateCounter(totalSteps, parseInt(totalSteps.dataset.target, 10));
        if (totalKm) animateCounter(totalKm, parseInt(totalKm.dataset.target, 10));
        if (dailyAvg) animateCounter(dailyAvg, parseInt(dailyAvg.dataset.target, 10));
      }

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('section:not(.hero)').forEach(s => observer.observe(s));
}

// Hero animations
function initHeroAnimations() {
  document.querySelector('.logo')?.classList.add('animate-in');
  document.querySelector('.header-nav')?.classList.add('animate-in');
  document.querySelector('.hero-location')?.classList.add('animate-in');
  document.querySelectorAll('.hero-title .line-inner').forEach(el => el.classList.add('animate-in'));
  document.querySelector('.hero-title em')?.classList.add('animate-in');
  document.querySelector('.hero-text')?.classList.add('animate-in');
  document.querySelector('.hero-ctas')?.classList.add('animate-in');
  document.querySelector('.hero-visual')?.classList.add('animate-in');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderContent();
  initMagneticButtons();
  initScrollAnimations();
  initHeroAnimations();
  bindCursorHovers();
});
