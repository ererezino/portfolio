// ========================================
// Content Data
// ========================================
const PHOTOS = [
  { src: "/assets/photos/photo-1.jpg", caption: "Lagos, 2025", alt: "Street scene in Lagos at golden hour" },
  { src: "/assets/photos/photo-2.jpg", caption: "Frankfurt, 2025", alt: "A quiet street corner in Frankfurt" },
  { src: "/assets/photos/photo-3.jpg", caption: "Frankfurt, 2025", alt: "Architecture detail in Frankfurt" },
  { src: "/assets/photos/photo-4.jpg", caption: "Accra, 2025", alt: "Market colors and motion in Accra" }
];

const HERO_PHOTOS = [PHOTOS[0], PHOTOS[1], PHOTOS[3]];

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

// ========================================
// Utility Functions
// ========================================
const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n.toLocaleString();
const lerp = (a, b, t) => a + (b - a) * t;

// ========================================
// Theme Management
// ========================================
function setTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
document.getElementById('mobileThemeToggle')?.addEventListener('click', toggleTheme);

// ========================================
// Custom Cursor
// ========================================
const cursor = document.getElementById('cursor');
const cursorLabel = document.getElementById('cursorLabel');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

if (window.matchMedia('(hover: hover)').matches && cursor) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('visible');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
    cursorLabel.classList.remove('visible');
  });

  function updateCursor() {
    cursorX = lerp(cursorX, mouseX, 0.15);
    cursorY = lerp(cursorY, mouseY, 0.15);
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    cursorLabel.style.left = `${cursorX}px`;
    cursorLabel.style.top = `${cursorY}px`;
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Bind hover states after content renders
  function bindCursorHovers() {
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (!el.classList.contains('photo-item') && !el.classList.contains('photo-card')) {
          cursor.classList.add('hover');
        }
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
}

// ========================================
// Magnetic Buttons
// ========================================
function initMagneticButtons() {
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    const inner = btn.querySelector('.btn-inner') || btn;
    
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      inner.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      inner.style.transform = 'translate(0, 0)';
    });
  });
}

// ========================================
// Header Scroll
// ========================================
window.addEventListener('scroll', () => {
  document.getElementById('header')?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ========================================
// Mobile Menu
// ========================================
const mobileMenu = document.getElementById('mobileMenu');
const menuBtn = document.getElementById('mobileMenuBtn');
const menuClose = document.getElementById('mobileMenuClose');

function openMenu() {
  mobileMenu?.classList.add('open');
  mobileMenu?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  mobileMenu?.querySelector('a')?.focus();
}

function closeMenu() {
  mobileMenu?.classList.remove('open');
  mobileMenu?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  menuBtn?.focus();
}

menuBtn?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMenu();
});

// ========================================
// Lightbox
// ========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
let currentPhotoIndex = 0;
let lastFocusedEl = null;

function openLightbox(index, opener) {
  currentPhotoIndex = index;
  lastFocusedEl = opener || document.activeElement;
  lightboxImg.src = PHOTOS[index].src;
  lightboxImg.alt = PHOTOS[index].alt || PHOTOS[index].caption;
  lightboxCaption.textContent = PHOTOS[index].caption;
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close')?.focus();
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
  lightboxImg.alt = PHOTOS[currentPhotoIndex].alt || PHOTOS[currentPhotoIndex].caption;
  lightboxCaption.textContent = PHOTOS[currentPhotoIndex].caption;
}

lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ========================================
// Animated Counter
// ========================================
function animateCounter(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // ease-out-quart
    const current = Math.floor(start + (target - start) * eased);
    el.textContent = fmt(current);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// ========================================
// Render Content
// ========================================
function renderContent() {
  // Hero Photo Stack
  const heroStack = document.getElementById('heroPhotoStack');
  if (heroStack) {
    heroStack.innerHTML = HERO_PHOTOS.map((p, i) => `
      <button type="button" class="photo-card" data-photo-index="${PHOTOS.indexOf(p)}" aria-label="View photo: ${p.caption}">
        <img src="${p.src}" alt="${p.alt}" loading="eager" draggable="false" />
        <div class="photo-card-caption">${p.caption}</div>
      </button>
    `).join('');
  }

  // Photo Grid
  const photoGrid = document.getElementById('photoGrid');
  if (photoGrid) {
    photoGrid.innerHTML = PHOTOS.map((p, i) => `
      <button type="button" class="photo-item" data-photo-index="${i}" aria-label="View photo: ${p.caption}">
        <img src="${p.src}" alt="${p.alt}" loading="lazy" />
        <span class="photo-item-caption">
          <span>${p.caption}</span>
          <span style="opacity:.75">View</span>
        </span>
      </button>
    `).join('');
  }

  // Bind photo click events
  document.querySelectorAll('[data-photo-index]').forEach(el => {
    el.addEventListener('click', () => {
      openLightbox(Number(el.getAttribute('data-photo-index')), el);
    });
  });

  // Articles
  const articleGrid = document.getElementById('articleGrid');
  if (articleGrid) {
    articleGrid.innerHTML = ARTICLES.map(a => `
      <a class="card" href="${a.url}">
        <div class="card-inner">
          <div class="card-kicker">${a.topic}</div>
          <div class="card-title">${a.title}</div>
          <div class="card-meta">${a.date}</div>
          <span class="card-link">
            Read
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </a>
    `).join('');
  }

  // Travels
  const travelGrid = document.getElementById('travelGrid');
  if (travelGrid) {
    travelGrid.innerHTML = TRAVELS.map(t => `
      <a class="card" href="${t.url}">
        <div class="card-inner">
          <div class="card-kicker">Travel</div>
          <div class="card-title">${t.title}</div>
          <div class="card-meta">${t.meta}</div>
          <span class="card-link">
            Explore
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </a>
    `).join('');
  }

  // Music
  document.getElementById('musicList').innerHTML = MUSIC.map(m => `
    <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="into-item">
      <div class="into-cover">
        <img src="${m.cover}" alt="Cover: ${m.title}" loading="lazy" width="56" height="56">
      </div>
      <div class="into-text">
        <div class="into-title">${m.title}</div>
        <div class="into-meta">${m.artist}</div>
      </div>
    </a>
  `).join('');

  // Books
  document.getElementById('bookList').innerHTML = BOOKS.map(b => `
    <a href="${b.url}" target="_blank" rel="noopener noreferrer" class="into-item">
      <div class="into-cover book">
        <img src="${b.cover}" alt="Cover: ${b.title}" loading="lazy" width="48" height="72">
      </div>
      <div class="into-text">
        <div class="into-title">${b.title}</div>
        <div class="into-meta">${b.author}</div>
      </div>
    </a>
  `).join('');

  // TV
  document.getElementById('tvList').innerHTML = TV.map(t => `
    <a href="${t.url}" target="_blank" rel="noopener noreferrer" class="into-item">
      <div class="into-cover">
        <img src="${t.cover}" alt="Poster: ${t.title}" loading="lazy" width="56" height="56">
      </div>
      <div class="into-text">
        <div class="into-title">${t.title}</div>
        <div class="into-meta">${t.year}</div>
      </div>
    </a>
  `).join('');

  // Month Cards
  const monthCards = document.getElementById('monthCards');
  if (monthCards) {
    monthCards.innerHTML = MONTHS.map(m => {
      const pct = (m.steps / MONTHLY_GOAL) * 100;
      const displayPct = Math.round(pct);
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
          <div class="month-steps" data-steps="${m.steps}">${fmt(m.steps)}</div>
          <div class="month-goal"><span class="month-pct">${displayPct}%</span> of 310k goal</div>
          <div class="progress-wrapper">
            <div class="progress-track">
              <div class="progress-fill" data-width="${barWidth}"></div>
            </div>
            ${m.isCurrent ? '<div class="progress-dot"></div>' : ''}
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

// ========================================
// Intersection Observer for Animations
// ========================================
function initScrollAnimations() {
  // Section animations
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Animate progress bars in movement section
        if (entry.target.id === 'movement') {
          entry.target.querySelectorAll('.progress-fill').forEach(fill => {
            setTimeout(() => {
              fill.style.width = fill.dataset.width + '%';
            }, 300);
          });
          
          // Animate counters
          const totalSteps = document.getElementById('totalSteps');
          const totalKm = document.getElementById('totalKm');
          const dailyAvg = document.getElementById('dailyAvg');
          
          if (totalSteps) animateCounter(totalSteps, parseInt(totalSteps.dataset.target));
          if (totalKm) animateCounter(totalKm, parseInt(totalKm.dataset.target));
          if (dailyAvg) animateCounter(dailyAvg, parseInt(dailyAvg.dataset.target));
        }
        
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('section:not(.hero)').forEach(section => {
    sectionObserver.observe(section);
  });
}

// ========================================
// Hero Animations with GSAP
// ========================================
function initHeroAnimations() {
  // Wait for GSAP to load
  if (typeof gsap === 'undefined') {
    setTimeout(initHeroAnimations, 100);
    return;
  }

  // Logo and nav
  document.querySelector('.logo')?.classList.add('animate-in');
  document.querySelector('.header-nav')?.classList.add('animate-in');
  
  // Hero content
  document.querySelector('.hero-location')?.classList.add('animate-in');
  document.querySelectorAll('.hero-title .line-inner').forEach(el => el.classList.add('animate-in'));
  document.querySelector('.hero-title em')?.classList.add('animate-in');
  document.querySelector('.hero-text')?.classList.add('animate-in');
  document.querySelector('.hero-ctas')?.classList.add('animate-in');
  document.querySelector('.hero-visual')?.classList.add('animate-in');
  
  // Photo stack hover animation
  const photoStack = document.querySelector('.photo-stack');
  if (photoStack && typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax effect on scroll
    gsap.to('.hero-visual', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });
  }
}

// ========================================
// Initialize Everything
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  renderContent();
  initMagneticButtons();
  initScrollAnimations();
  initHeroAnimations();
  
  if (typeof bindCursorHovers === 'function') {
    bindCursorHovers();
  }
});
