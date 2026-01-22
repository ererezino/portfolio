// =============================================================================
// DATA
// =============================================================================

const PHOTOS = [
  { src: "/assets/photos/photo-1.jpg", caption: "Lagos, 2025", alt: "Street scene in Lagos", location: "Lagos" },
  { src: "/assets/photos/photo-2.jpg", caption: "Frankfurt, 2025", alt: "Frankfurt street", location: "Frankfurt" },
  { src: "/assets/photos/photo-3.jpg", caption: "Frankfurt, 2025", alt: "Architecture in Frankfurt", location: "Frankfurt" },
  { src: "/assets/photos/photo-4.jpg", caption: "Accra, 2025", alt: "Accra market", location: "Accra" },
  { src: "/assets/photos/photo-5.jpg", caption: "Lagos, 2025", alt: "Lagos street", location: "Lagos" },
  { src: "/assets/photos/photo-6.jpg", caption: "Durham, 2024", alt: "Durham scene", location: "Durham" }
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

// =============================================================================
// UTILITIES
// =============================================================================

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  return n.toLocaleString();
};

// =============================================================================
// THEME
// =============================================================================

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// =============================================================================
// HEADER
// =============================================================================

function initHeader() {
  const header = $('#header');
  const backToTop = $('#backToTop');
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header?.classList.toggle('scrolled', window.scrollY > 50);
        backToTop?.classList.toggle('visible', window.scrollY > 600);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// =============================================================================
// MOBILE MENU
// =============================================================================

function initMobileMenu() {
  const menu = $('#mobileMenu');
  const openBtn = $('#mobileMenuBtn');
  const closeBtn = $('#mobileMenuClose');
  
  function open() {
    menu?.classList.add('open');
    menu?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  
  function close() {
    menu?.classList.remove('open');
    menu?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  
  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  
  $$('a', menu).forEach(link => link.addEventListener('click', close));
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu?.classList.contains('open')) close();
  });
}

// =============================================================================
// LIGHTBOX
// =============================================================================

let currentPhotoIndex = 0;
let lastFocusedElement = null;

function initLightbox() {
  const lightbox = $('#lightbox');
  const img = $('#lightboxImg');
  const caption = $('#lightboxCaption');
  
  function open(index, opener) {
    currentPhotoIndex = index;
    lastFocusedElement = opener || document.activeElement;
    
    img.src = PHOTOS[index].src;
    img.alt = PHOTOS[index].alt;
    caption.textContent = PHOTOS[index].caption;
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    $('.lightbox-close', lightbox)?.focus();
  }
  
  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
  }
  
  function navigate(dir) {
    currentPhotoIndex = (currentPhotoIndex + dir + PHOTOS.length) % PHOTOS.length;
    img.src = PHOTOS[currentPhotoIndex].src;
    img.alt = PHOTOS[currentPhotoIndex].alt;
    caption.textContent = PHOTOS[currentPhotoIndex].caption;
  }
  
  $('.lightbox-close', lightbox)?.addEventListener('click', close);
  $('.lightbox-prev', lightbox)?.addEventListener('click', () => navigate(-1));
  $('.lightbox-next', lightbox)?.addEventListener('click', () => navigate(1));
  
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
  
  window.openLightbox = open;
}

// =============================================================================
// PHOTO STACK (Hero)
// =============================================================================

class PhotoStack {
  constructor(container, photos) {
    this.container = container;
    this.photos = photos;
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.deltaX = 0;
    
    this.render();
    this.bindEvents();
  }
  
  render() {
    const track = document.createElement('div');
    track.className = 'photo-stack-track';
    
    this.photos.forEach((photo, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'stack-card';
      card.dataset.index = i;
      card.setAttribute('aria-label', `View photo: ${photo.caption}`);
      
      card.innerHTML = `
        <img src="${photo.src}" alt="${photo.alt}" draggable="false" />
        <div class="stack-card-footer">
          <span class="stack-card-caption">${photo.caption}</span>
          <div class="stack-card-dots">
            ${this.photos.map((_, j) => `<span ${j === 0 ? 'class="active"' : ''}></span>`).join('')}
          </div>
        </div>
      `;
      
      track.appendChild(card);
    });
    
    const hint = document.createElement('div');
    hint.className = 'stack-hint';
    hint.innerHTML = `
      <span>Swipe or tap</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    `;
    
    this.container.innerHTML = '';
    this.container.appendChild(track);
    this.container.appendChild(hint);
    
    this.cards = $$('.stack-card', track);
    this.updatePositions();
  }
  
  updatePositions() {
    this.cards.forEach((card, i) => {
      const offset = (i - this.currentIndex + this.photos.length) % this.photos.length;
      
      if (offset === 0) {
        card.dataset.position = '0';
      } else if (offset === 1) {
        card.dataset.position = '1';
      } else if (offset === this.photos.length - 1) {
        card.dataset.position = '2';
      } else {
        card.dataset.position = 'hidden';
      }
      
      $$('.stack-card-dots span', card).forEach((dot, j) => {
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
        const pos = card.dataset.position;
        if (pos === '0') {
          const idx = parseInt(card.dataset.index, 10);
          window.openLightbox(idx, card);
        } else {
          this.next();
        }
      });
      
      card.addEventListener('mousedown', (e) => this.onDragStart(e));
      card.addEventListener('touchstart', (e) => this.onDragStart(e), { passive: true });
    });
    
    document.addEventListener('mousemove', (e) => this.onDragMove(e), { passive: true });
    document.addEventListener('touchmove', (e) => this.onDragMove(e), { passive: true });
    document.addEventListener('mouseup', () => this.onDragEnd());
    document.addEventListener('touchend', () => this.onDragEnd());
    
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

// =============================================================================
// PHOTO GRID
// =============================================================================

let activeFilter = 'All';

function getLocations() {
  const locations = [...new Set(PHOTOS.map(p => p.location))].sort();
  return ['All', ...locations];
}

function renderPhotoFilters() {
  const container = $('#photoFilters');
  if (!container) return;
  
  const locations = getLocations();
  
  container.innerHTML = locations.map(loc => `
    <button class="filter-chip ${loc === activeFilter ? 'active' : ''}" type="button" data-filter="${loc}">
      ${loc}
    </button>
  `).join('');
  
  $$('.filter-chip', container).forEach(chip => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter;
      renderPhotoFilters();
      renderPhotoGrid();
    });
  });
}

function renderPhotoGrid() {
  const container = $('#photoGrid');
  if (!container) return;
  
  const filtered = activeFilter === 'All' 
    ? PHOTOS 
    : PHOTOS.filter(p => p.location === activeFilter);
  
  container.innerHTML = filtered.map((photo) => {
    const originalIndex = PHOTOS.indexOf(photo);
    return `
      <button type="button" class="photo-item" data-index="${originalIndex}">
        <img src="${photo.src}" alt="${photo.alt}" loading="lazy" />
        <div class="photo-item-overlay"></div>
        <span class="photo-item-caption">${photo.caption}</span>
      </button>
    `;
  }).join('');
  
  $$('.photo-item', container).forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index, 10);
      window.openLightbox(index, item);
    });
  });
}

// =============================================================================
// ARTICLES
// =============================================================================

function renderArticles() {
  const container = $('#articleGrid');
  if (!container) return;
  
  container.innerHTML = ARTICLES.map(article => `
    <a href="${article.url}" class="article-card">
      <div>
        <div class="article-card-topic">${article.topic}</div>
        <h3 class="article-card-title">${article.title}</h3>
      </div>
      <div class="article-card-footer">
        <span class="article-card-date">${article.date}</span>
        <span class="article-card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </span>
      </div>
    </a>
  `).join('');
}

// =============================================================================
// MOVEMENT
// =============================================================================

function animateCounter(el, target, duration = 1500) {
  if (prefersReducedMotion) {
    el.textContent = formatNumber(target);
    return;
  }
  
  const start = performance.now();
  
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNumber(Math.floor(target * eased));
    
    if (progress < 1) requestAnimationFrame(update);
  }
  
  requestAnimationFrame(update);
}

function renderMonthCards() {
  const container = $('#monthGrid');
  if (!container) return;
  
  container.innerHTML = MONTHS.map(m => {
    const pct = Math.round((m.steps / MONTHLY_GOAL) * 100);
    const barWidth = Math.min(pct, 100);
    const isComplete = m.steps >= MONTHLY_GOAL;
    
    return `
      <div class="month-card">
        <div class="month-card-header">
          <span class="month-card-name">${m.month} ${m.year}</span>
          <span class="month-card-status ${m.isCurrent ? 'current' : isComplete ? 'complete' : ''}">
            ${m.isCurrent ? 'In progress' : isComplete ? 'Complete' : 'Incomplete'}
          </span>
        </div>
        <div class="month-card-steps">${formatNumber(m.steps)}</div>
        <div class="month-card-goal">
          <strong>${pct}%</strong> of 310k goal
        </div>
        <div class="progress-bar">
          <div class="progress-fill" data-width="${barWidth}"></div>
        </div>
      </div>
    `;
  }).join('');
}

// =============================================================================
// TRAVELS
// =============================================================================

function renderTravels() {
  const container = $('#travelGrid');
  if (!container) return;
  
  container.innerHTML = TRAVELS.map(travel => `
    <a href="${travel.url}" class="travel-card">
      <div>
        <h3 class="travel-card-title">${travel.title}</h3>
        <p class="travel-card-meta">${travel.meta}</p>
      </div>
      <span class="travel-card-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </span>
    </a>
  `).join('');
}

// =============================================================================
// INTO (Music, Books, TV)
// =============================================================================

function renderInto() {
  const musicList = $('#musicList');
  const bookList = $('#bookList');
  const tvList = $('#tvList');
  
  if (musicList) {
    musicList.innerHTML = MUSIC.map(item => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="into-item">
        <div class="into-cover">
          <img src="${item.cover}" alt="${item.title}" loading="lazy" />
        </div>
        <div class="into-text">
          <div class="into-title">${item.title}</div>
          <div class="into-meta">${item.artist}</div>
        </div>
      </a>
    `).join('');
  }
  
  if (bookList) {
    bookList.innerHTML = BOOKS.map(item => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="into-item">
        <div class="into-cover">
          <img src="${item.cover}" alt="${item.title}" loading="lazy" />
        </div>
        <div class="into-text">
          <div class="into-title">${item.title}</div>
          <div class="into-meta">${item.author}</div>
        </div>
      </a>
    `).join('');
  }
  
  if (tvList) {
    tvList.innerHTML = TV.map(item => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="into-item">
        <div class="into-cover">
          <img src="${item.cover}" alt="${item.title}" loading="lazy" />
        </div>
        <div class="into-text">
          <div class="into-title">${item.title}</div>
          <div class="into-meta">${item.year}</div>
        </div>
      </a>
    `).join('');
  }
}

// =============================================================================
// SCROLL ANIMATIONS
// =============================================================================

function initScrollAnimations() {
  const sections = $$('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      entry.target.classList.add('visible');
      
      if (entry.target.id === 'movement') {
        const yearSteps = $('#yearSteps');
        const totalKm = $('#totalKm');
        const dailyAvg = $('#dailyAvg');
        
        if (yearSteps) animateCounter(yearSteps, parseInt(yearSteps.dataset.target, 10));
        if (totalKm) animateCounter(totalKm, parseInt(totalKm.dataset.target, 10));
        if (dailyAvg) animateCounter(dailyAvg, parseInt(dailyAvg.dataset.target, 10));
        
        setTimeout(() => {
          $$('.progress-fill', entry.target).forEach(fill => {
            fill.style.width = fill.dataset.width + '%';
          });
        }, 300);
      }
      
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  sections.forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}

// =============================================================================
// INIT
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Theme
  initTheme();
  $('#themeToggle')?.addEventListener('click', toggleTheme);
  $('#mobileThemeToggle')?.addEventListener('click', toggleTheme);
  
  // Core functionality
  initHeader();
  initMobileMenu();
  initLightbox();
  
  // Hero photo stack
  const heroStack = $('#heroPhotoStack');
  if (heroStack) {
    new PhotoStack(heroStack, PHOTOS.slice(0, 4));
  }
  
  // Render content
  renderPhotoFilters();
  renderPhotoGrid();
  renderArticles();
  renderMonthCards();
  renderTravels();
  renderInto();
  
  // Scroll animations
  initScrollAnimations();
});
