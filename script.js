// =============================================================================
// DATA
// =============================================================================

const PHOTOS = [
  { src: "/assets/photos/photo-1.jpg", caption: "Lagos, 2025", alt: "Street scene in Lagos", location: "Lagos" },
  { src: "/assets/photos/photo-2.jpg", caption: "Frankfurt, 2025", alt: "Frankfurt street", location: "Frankfurt" },
  { src: "/assets/photos/photo-3.jpg", caption: "Accra, 2025", alt: "Accra market", location: "Accra" },
  { src: "/assets/photos/photo-4.jpg", caption: "Lagos, 2025", alt: "Lagos street", location: "Lagos" },
  { src: "/assets/photos/photo-5.jpg", caption: "Durham, 2024", alt: "Durham scene", location: "Durham" },
  { src: "/assets/photos/photo-6.jpg", caption: "Frankfurt, 2025", alt: "Architecture in Frankfurt", location: "Frankfurt" }
];

const ARTICLES = [
  { title: "A quick note on consistency", date: "Jan 2026", topic: "Work / life", url: "/articles.html" },
  { title: "What I'm learning from walking", date: "Dec 2025", topic: "Movement", url: "/articles.html" }
];

const TRAVELS = [
  { title: "Frankfurt", meta: "2025 · small details, big calm", url: "/travel.html" },
  { title: "Accra", meta: "2025 · food, pace, and sunlight", url: "/travel.html" }
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

// January 2026 data only
const STEPS_DATA = {
  month: "January",
  year: 2026,
  goal: 310000,
  current: 198000,
  distance: 140,
  activeMinutes: 1680,
  calories: 8200,
  dailyAvg: 9914,
  daysElapsed: 20,
  weeklyData: [
    { day: "Mon", steps: 11200 },
    { day: "Tue", steps: 8500 },
    { day: "Wed", steps: 12300 },
    { day: "Thu", steps: 9800 },
    { day: "Fri", steps: 7600 },
    { day: "Sat", steps: 14200 },
    { day: "Sun", steps: 10500 }
  ]
};

// =============================================================================
// UTILITIES
// =============================================================================

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const formatNumber = (n) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n.toLocaleString();
const lerp = (a, b, t) => a + (b - a) * t;

// Safe localStorage wrapper
const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage not available:', e);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  }
};

// Debounce utility
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle utility for scroll events
function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// =============================================================================
// PAGE LOADER
// =============================================================================

function initPageLoader() {
  const loader = $('#pageLoader');
  if (!loader) return;

  // Hide loader when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  });

  // Fallback: hide loader after 3 seconds regardless
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3000);
}

// =============================================================================
// THEME
// =============================================================================

function initTheme() {
  const saved = storage.get('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  
  // Update theme-color meta tag
  updateThemeColorMeta(isDark ? 'dark' : 'light');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  storage.set('theme', next);
  updateThemeColorMeta(next);
  
  // Announce theme change to screen readers
  announceToScreenReader(`Theme changed to ${next} mode`);
}

function updateThemeColorMeta(theme) {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0A0A0A' : '#FAFAFA');
  }
}

// Listen for system theme changes
function initSystemThemeListener() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!storage.get('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateThemeColorMeta(e.matches ? 'dark' : 'light');
    }
  });
}

// =============================================================================
// ACCESSIBILITY HELPERS
// =============================================================================

// Announce messages to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Trap focus within modal
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  element.addEventListener('keydown', handleTabKey);
  return () => element.removeEventListener('keydown', handleTabKey);
}

// =============================================================================
// CUSTOM CURSOR
// =============================================================================

function initCursor() {
  if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

  const cursor = $('#cursor');
  const cursorLabel = $('#cursorLabel');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  let animationId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('visible');
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
    cursorLabel?.classList.remove('visible');
  });

  function animate() {
    cursorX = lerp(cursorX, mouseX, 0.15);
    cursorY = lerp(cursorY, mouseY, 0.15);
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    if (cursorLabel) {
      cursorLabel.style.left = `${cursorX}px`;
      cursorLabel.style.top = `${cursorY}px`;
    }
    animationId = requestAnimationFrame(animate);
  }
  animate();

  // Bind hover effects using event delegation
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button');
    const photoTarget = e.target.closest('.photo-item, .stack-card');
    const labelTarget = e.target.closest('[data-cursor-label]');

    if (photoTarget) {
      cursor.classList.add('photo-hover');
      cursor.classList.remove('hover');
      if (cursorLabel) {
        cursorLabel.textContent = 'View';
        cursorLabel.classList.add('visible');
      }
    } else if (labelTarget && cursorLabel) {
      cursor.classList.add('hover');
      cursorLabel.textContent = labelTarget.dataset.cursorLabel;
      cursorLabel.classList.add('visible');
    } else if (target) {
      cursor.classList.add('hover');
      cursor.classList.remove('photo-hover');
      cursorLabel?.classList.remove('visible');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, .photo-item, .stack-card, [data-cursor-label]');
    if (target) {
      cursor.classList.remove('hover', 'photo-hover');
      cursorLabel?.classList.remove('visible');
    }
  });

  // Clean up on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && animationId) {
      cancelAnimationFrame(animationId);
    } else if (!document.hidden) {
      animate();
    }
  });
}

// =============================================================================
// MAGNETIC BUTTONS
// =============================================================================

function initMagneticButtons() {
  if (prefersReducedMotion) return;

  $$('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// =============================================================================
// HEADER
// =============================================================================

function initHeader() {
  const header = $('#header');
  const backToTop = $('#backToTop');
  
  const handleScroll = throttle(() => {
    const scrollY = window.scrollY;
    header?.classList.toggle('scrolled', scrollY > 50);
    backToTop?.classList.toggle('visible', scrollY > 600);
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    // Focus on skip link or main content for accessibility
    $('#main')?.focus();
  });
}

// =============================================================================
// MOBILE MENU
// =============================================================================

function initMobileMenu() {
  const menu = $('#mobileMenu');
  const openBtn = $('#mobileMenuBtn');
  const closeBtn = $('#mobileMenuClose');
  let removeTrapFocus = null;

  function open() {
    menu?.classList.add('open');
    menu?.setAttribute('aria-hidden', 'false');
    openBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item
    setTimeout(() => {
      $('nav a', menu)?.focus();
    }, 100);
    
    // Trap focus within menu
    if (menu) {
      removeTrapFocus = trapFocus(menu);
    }
    
    announceToScreenReader('Navigation menu opened');
  }

  function close() {
    menu?.classList.remove('open');
    menu?.setAttribute('aria-hidden', 'true');
    openBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    // Return focus to menu button
    openBtn?.focus();
    
    // Remove focus trap
    if (removeTrapFocus) {
      removeTrapFocus();
      removeTrapFocus = null;
    }
    
    announceToScreenReader('Navigation menu closed');
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
let removeLightboxTrapFocus = null;
let lightboxTouchStartX = 0;
let lightboxTouchStartY = 0;

function initLightbox() {
  const lightbox = $('#lightbox');
  const img = $('#lightboxImg');
  const caption = $('#lightboxCaption');
  const counter = $('#lightboxCounter');
  const loading = $('.lightbox-loading', lightbox);

  function showLoading() {
    loading?.classList.add('visible');
  }

  function hideLoading() {
    loading?.classList.remove('visible');
  }

  function open(index, opener) {
    currentPhotoIndex = index;
    lastFocusedElement = opener || document.activeElement;
    
    showLoading();
    
    // Preload image
    const newImg = new Image();
    newImg.onload = () => {
      img.src = PHOTOS[index].src;
      img.alt = PHOTOS[index].alt;
      hideLoading();
    };
    newImg.onerror = () => {
      hideLoading();
      img.alt = 'Failed to load image';
    };
    newImg.src = PHOTOS[index].src;
    
    caption.textContent = PHOTOS[index].caption;
    if (counter) {
      counter.textContent = `${index + 1} / ${PHOTOS.length}`;
    }
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus close button
    setTimeout(() => {
      $('.lightbox-close', lightbox)?.focus();
    }, 100);
    
    // Trap focus
    if (lightbox) {
      removeLightboxTrapFocus = trapFocus(lightbox);
    }
    
    announceToScreenReader(`Photo ${index + 1} of ${PHOTOS.length}: ${PHOTOS[index].caption}`);
  }

  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Return focus
    lastFocusedElement?.focus();
    
    // Remove focus trap
    if (removeLightboxTrapFocus) {
      removeLightboxTrapFocus();
      removeLightboxTrapFocus = null;
    }
  }

  function navigate(dir) {
    currentPhotoIndex = (currentPhotoIndex + dir + PHOTOS.length) % PHOTOS.length;
    
    showLoading();
    
    const newImg = new Image();
    newImg.onload = () => {
      img.src = PHOTOS[currentPhotoIndex].src;
      img.alt = PHOTOS[currentPhotoIndex].alt;
      hideLoading();
    };
    newImg.src = PHOTOS[currentPhotoIndex].src;
    
    caption.textContent = PHOTOS[currentPhotoIndex].caption;
    if (counter) {
      counter.textContent = `${currentPhotoIndex + 1} / ${PHOTOS.length}`;
    }
    
    announceToScreenReader(`Photo ${currentPhotoIndex + 1} of ${PHOTOS.length}: ${PHOTOS[currentPhotoIndex].caption}`);
  }

  // Button event listeners
  $('.lightbox-close', lightbox)?.addEventListener('click', close);
  $('.lightbox-prev', lightbox)?.addEventListener('click', () => navigate(-1));
  $('.lightbox-next', lightbox)?.addEventListener('click', () => navigate(1));
  
  // Click outside to close
  lightbox?.addEventListener('click', (e) => { 
    if (e.target === lightbox) close(); 
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Touch gestures for lightbox
  const imgContainer = $('.lightbox-img-container', lightbox);
  
  imgContainer?.addEventListener('touchstart', (e) => {
    lightboxTouchStartX = e.touches[0].clientX;
    lightboxTouchStartY = e.touches[0].clientY;
  }, { passive: true });

  imgContainer?.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - lightboxTouchStartX;
    const diffY = touchEndY - lightboxTouchStartY;
    
    // Only trigger if horizontal swipe is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        navigate(-1); // Swipe right = previous
      } else {
        navigate(1); // Swipe left = next
      }
    }
  }, { passive: true });

  // Preload adjacent images
  function preloadAdjacent() {
    const prevIndex = (currentPhotoIndex - 1 + PHOTOS.length) % PHOTOS.length;
    const nextIndex = (currentPhotoIndex + 1) % PHOTOS.length;
    
    new Image().src = PHOTOS[prevIndex].src;
    new Image().src = PHOTOS[nextIndex].src;
  }

  // Export open function
  window.openLightbox = (index, opener) => {
    open(index, opener);
    preloadAdjacent();
  };
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
    this.hintHidden = false;
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
      card.setAttribute('tabindex', i === 0 ? '0' : '-1');
      card.innerHTML = `
        <img src="${photo.src}" alt="${photo.alt}" draggable="false" loading="${i === 0 ? 'eager' : 'lazy'}" />
        <div class="stack-card-footer">
          <span class="stack-card-caption">${photo.caption}</span>
          <div class="stack-card-dots" aria-hidden="true">
            ${this.photos.map((_, j) => `<span ${j === 0 ? 'class="active"' : ''}></span>`).join('')}
          </div>
        </div>
      `;
      track.appendChild(card);
    });

    const hint = document.createElement('div');
    hint.className = 'stack-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML = `<span>Swipe or tap</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

    this.container.innerHTML = '';
    this.container.appendChild(track);
    this.container.appendChild(hint);
    this.cards = $$('.stack-card', track);
    this.hint = hint;
    this.updatePositions();
  }

  hideHint() {
    if (!this.hintHidden && this.hint) {
      this.hint.classList.add('hidden');
      this.hintHidden = true;
    }
  }

  updatePositions() {
    this.cards.forEach((card, i) => {
      const offset = (i - this.currentIndex + this.photos.length) % this.photos.length;
      
      if (offset === 0) {
        card.dataset.position = '0';
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-current', 'true');
      } else if (offset === 1) {
        card.dataset.position = '1';
        card.setAttribute('tabindex', '-1');
        card.setAttribute('aria-current', 'false');
      } else if (offset === this.photos.length - 1) {
        card.dataset.position = '2';
        card.setAttribute('tabindex', '-1');
        card.setAttribute('aria-current', 'false');
      } else {
        card.dataset.position = 'hidden';
        card.setAttribute('tabindex', '-1');
        card.setAttribute('aria-current', 'false');
      }

      $$('.stack-card-dots span', card).forEach((dot, j) => {
        dot.classList.toggle('active', j === this.currentIndex);
      });
    });
  }

  next() { 
    this.currentIndex = (this.currentIndex + 1) % this.photos.length; 
    this.updatePositions();
    this.hideHint();
  }
  
  prev() { 
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length; 
    this.updatePositions();
    this.hideHint();
  }

  bindEvents() {
    this.cards.forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.position === '0') {
          window.openLightbox(parseInt(card.dataset.index, 10), card);
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
      if (e.key === 'ArrowLeft') {
        this.prev();
        e.preventDefault();
      }
      if (e.key === 'ArrowRight') {
        this.next();
        e.preventDefault();
      }
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
    
    // Increased threshold for less sensitive swiping
    if (this.deltaX > 60) this.prev();
    else if (this.deltaX < -60) this.next();
    
    this.deltaX = 0;
  }
}

// =============================================================================
// RENDER FUNCTIONS
// =============================================================================

function renderPhotoGrid() {
  const container = $('#photoGrid');
  if (!container) return;

  // Show only 4 photos for minimal look
  const displayPhotos = PHOTOS.slice(0, 4);

  // Initially render skeletons
  container.innerHTML = displayPhotos.map(() => `
    <div class="photo-item skeleton" role="listitem"></div>
  `).join('');

  // Load actual photos
  const photoItems = $$('.photo-item', container);
  
  displayPhotos.forEach((photo, i) => {
    const item = photoItems[i];
    const img = new Image();
    
    img.onload = () => {
      item.innerHTML = `
        <img src="${photo.src}" alt="${photo.alt}" loading="lazy" />
        <div class="photo-item-overlay"></div>
        <span class="photo-item-caption">${photo.caption}</span>
      `;
      item.classList.remove('skeleton');
      item.setAttribute('role', 'listitem');
      item.dataset.index = i;
      
      // Make it a button for accessibility
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `View photo: ${photo.caption}`);
      
      // Add click handler
      item.addEventListener('click', () => {
        window.openLightbox(parseInt(item.dataset.index, 10), item);
      });
      
      // Add keyboard handler
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.openLightbox(parseInt(item.dataset.index, 10), item);
        }
      });
    };
    
    img.onerror = () => {
      item.innerHTML = `<span class="photo-item-caption">Failed to load</span>`;
      item.classList.remove('skeleton');
    };
    
    img.src = photo.src;
  });

  // Update photo count
  const countEl = $('#photoCount');
  if (countEl) countEl.textContent = `${PHOTOS.length}+ photos`;
}

function renderArticles() {
  const container = $('#articleGrid');
  if (!container) return;

  container.innerHTML = ARTICLES.map(article => `
    <a href="${article.url}" class="article-card" role="listitem">
      <div>
        <div class="article-card-topic">${article.topic}</div>
        <h3 class="article-card-title">${article.title}</h3>
      </div>
      <div class="article-card-footer">
        <span class="article-card-date">${article.date}</span>
        <span class="article-card-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </span>
      </div>
    </a>
  `).join('');
}

function renderStepsDashboard() {
  const container = $('#stepsDashboard');
  if (!container) return;

  const d = STEPS_DATA;
  const pct = Math.round((d.current / d.goal) * 100);
  const ringOffset = 377 - (377 * Math.min(pct, 100) / 100);
  const remaining = Math.max(d.goal - d.current, 0);
  const daysLeft = 31 - d.daysElapsed;
  const dailyNeeded = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : 0;

  container.innerHTML = `
    <!-- Main stats card -->
    <div class="steps-main-card">
      <div class="steps-primary">
        <div class="steps-value" id="stepsValue" aria-label="${formatNumber(d.current)} steps this month">${formatNumber(d.current)}</div>
        <div class="steps-label">steps this month</div>
      </div>
      <div class="steps-ring-container" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Monthly goal progress: ${pct}%">
        <svg class="steps-ring" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--accent)" />
              <stop offset="100%" stop-color="var(--accent-light)" />
            </linearGradient>
          </defs>
          <circle class="ring-bg" cx="60" cy="60" r="52" />
          <circle class="ring-progress" cx="60" cy="60" r="52" id="ringProgress" style="stroke-dashoffset: 377;" data-offset="${ringOffset}" />
        </svg>
        <div class="steps-ring-center">
          <span class="ring-percentage">${pct}%</span>
          <span class="ring-goal-label">of goal</span>
        </div>
      </div>
    </div>

    <!-- Stats row -->
    <div class="steps-stats-row">
      <div class="steps-stat-card">
        <div class="steps-stat-icon distance" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="steps-stat-value">${d.distance} km</div>
        <div class="steps-stat-label">Distance</div>
      </div>

      <div class="steps-stat-card">
        <div class="steps-stat-icon time" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="steps-stat-value">${Math.floor(d.activeMinutes / 60)}h ${d.activeMinutes % 60}m</div>
        <div class="steps-stat-label">Active time</div>
      </div>

      <div class="steps-stat-card">
        <div class="steps-stat-icon calories" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22c-4.97 0-9-2.582-9-7v-.088C3 12.794 4.338 11.1 6.375 10c1.949-1.052 3.101-2.99 3.112-5l.013-3 2.26 1.378a8.002 8.002 0 0 1 3.54 4.53l.168.5.168-.5a8.002 8.002 0 0 1 3.54-4.53L21.438 2l.012 3c.011 2.01 1.163 3.948 3.112 5C26.662 11.1 28 12.794 28 14.912V15c0 4.418-4.03 7-9 7z" transform="scale(0.85) translate(2, 2)"/>
          </svg>
        </div>
        <div class="steps-stat-value">${formatNumber(d.calories)}</div>
        <div class="steps-stat-label">Calories</div>
      </div>

      <div class="steps-stat-card">
        <div class="steps-stat-icon avg" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="20" x2="12" y2="10"/>
            <line x1="18" y1="20" x2="18" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="16"/>
          </svg>
        </div>
        <div class="steps-stat-value">${formatNumber(d.dailyAvg)}</div>
        <div class="steps-stat-label">Daily avg</div>
      </div>
    </div>

    <!-- Weekly chart -->
    <div class="steps-chart-card">
      <div class="steps-chart-header">
        <span class="steps-chart-title">This week</span>
        <span class="steps-chart-period">Jan 13 - 19</span>
      </div>
      <div class="steps-chart" role="img" aria-label="Weekly steps chart showing ${d.weeklyData.map(day => `${day.day}: ${formatNumber(day.steps)} steps`).join(', ')}">
        ${d.weeklyData.map(day => {
          const height = (day.steps / 15000) * 100;
          return `
            <div class="chart-bar">
              <div class="chart-bar-fill" style="height: 0px;" data-height="${height}"></div>
              <span class="chart-bar-label">${day.day}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Goal card -->
    <div class="steps-goal-card">
      <div class="steps-goal-header">
        <span class="steps-goal-title">Monthly Goal</span>
        <span class="steps-goal-status in-progress">${pct >= 100 ? 'Complete' : 'In progress'}</span>
      </div>
      <div class="steps-goal-progress">
        <div class="steps-goal-numbers">
          <span class="steps-goal-current">${formatNumber(d.current)}</span>
          <span class="steps-goal-target">/ ${formatNumber(d.goal)}</span>
        </div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-fill" id="goalProgress" data-width="${pct}"></div>
        </div>
      </div>
      <div class="steps-goal-meta">
        <span>${formatNumber(remaining)} to go</span>
        <span>${formatNumber(dailyNeeded)}/day needed</span>
      </div>
    </div>
  `;
}

function renderTravels() {
  const container = $('#travelGrid');
  if (!container) return;

  container.innerHTML = TRAVELS.map(travel => `
    <a href="${travel.url}" class="travel-card" role="listitem">
      <div>
        <h3 class="travel-card-title">${travel.title}</h3>
        <p class="travel-card-meta">${travel.meta}</p>
      </div>
      <span class="travel-card-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </span>
    </a>
  `).join('');
}

function renderInto() {
  const musicList = $('#musicList');
  const bookList = $('#bookList');
  const tvList = $('#tvList');

  if (musicList) {
    musicList.innerHTML = MUSIC.map(item => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="into-item" role="listitem">
        <div class="into-cover"><img src="${item.cover}" alt="" loading="lazy" /></div>
        <div class="into-text">
          <div class="into-title">${item.title}</div>
          <div class="into-meta">${item.artist}</div>
        </div>
      </a>
    `).join('');
  }

  if (bookList) {
    bookList.innerHTML = BOOKS.map(item => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="into-item" role="listitem">
        <div class="into-cover"><img src="${item.cover}" alt="" loading="lazy" /></div>
        <div class="into-text">
          <div class="into-title">${item.title}</div>
          <div class="into-meta">${item.author}</div>
        </div>
      </a>
    `).join('');
  }

  if (tvList) {
    tvList.innerHTML = TV.map(item => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="into-item" role="listitem">
        <div class="into-cover"><img src="${item.cover}" alt="" loading="lazy" /></div>
        <div class="into-text">
          <div class="into-title">${item.title}</div>
          <div class="into-meta">${item.year}</div>
        </div>
      </a>
    `).join('');
  }
}

// =============================================================================
// ANIMATIONS
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

function initHeroAnimations() {
  if (prefersReducedMotion) return;
  
  // Stagger the animations
  setTimeout(() => {
    $$('.hero-title .line-inner').forEach(el => el.classList.add('animate'));
  }, 100);
  
  setTimeout(() => {
    $('.hero-text')?.classList.add('animate');
  }, 200);
  
  setTimeout(() => {
    $('.hero-ctas')?.classList.add('animate');
  }, 300);
  
  setTimeout(() => {
    $('.hero-visual')?.classList.add('animate');
  }, 400);
}

function initScrollAnimations() {
  const sections = $$('section');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      entry.target.classList.add('visible');

      // Animate steps dashboard elements
      if (entry.target.id === 'steps') {
        // Animate progress bar
        const goalProgress = $('#goalProgress');
        if (goalProgress) {
          setTimeout(() => {
            goalProgress.style.width = goalProgress.dataset.width + '%';
          }, 300);
        }
        
        // Animate ring progress
        const ringProgress = $('#ringProgress');
        if (ringProgress) {
          setTimeout(() => {
            ringProgress.style.strokeDashoffset = ringProgress.dataset.offset;
          }, 300);
        }
        
        // Animate chart bars
        $$('.chart-bar-fill').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.height = bar.dataset.height + 'px';
          }, 400 + (i * 100));
        });
      }

      observer.unobserve(entry.target);
    });
  }, observerOptions);

  sections.forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}

// =============================================================================
// KEYBOARD SHORTCUTS
// =============================================================================

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Press 'D' for dark mode toggle
    if (e.key === 'd' || e.key === 'D') {
      if (!e.metaKey && !e.ctrlKey) {
        toggleTheme();
      }
    }
    
    // Press 'H' to go home
    if (e.key === 'h' || e.key === 'H') {
      if (!e.metaKey && !e.ctrlKey) {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  });
}

// =============================================================================
// ERROR HANDLING
// =============================================================================

function initErrorHandling() {
  // Handle image loading errors
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      console.warn('Image failed to load:', e.target.src);
      // Optionally set a placeholder
      e.target.style.opacity = '0.3';
    }
  }, true);
}

// =============================================================================
// INIT
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Error handling
  initErrorHandling();
  
  // Page loader
  initPageLoader();
  
  // Theme
  initTheme();
  initSystemThemeListener();
  $('#themeToggle')?.addEventListener('click', toggleTheme);
  $('#mobileThemeToggle')?.addEventListener('click', toggleTheme);

  // Core functionality
  initCursor();
  initMagneticButtons();
  initHeader();
  initMobileMenu();
  initLightbox();

  // Hero photo stack
  const heroStack = $('#heroPhotoStack');
  if (heroStack) new PhotoStack(heroStack, PHOTOS.slice(0, 4));

  // Render content
  renderPhotoGrid();
  renderArticles();
  renderStepsDashboard();
  renderTravels();
  renderInto();

  // Animations
  initHeroAnimations();
  initScrollAnimations();
  
  // Keyboard shortcuts
  initKeyboardShortcuts();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any running animations
    document.body.classList.add('page-hidden');
  } else {
    document.body.classList.remove('page-hidden');
  }
});
