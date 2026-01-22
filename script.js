// =============================================================================
// SECURITY-HARDENED JAVASCRIPT
// =============================================================================
// This script includes security best practices:
// - Input sanitization
// - Safe DOM manipulation
// - Secure localStorage usage
// - Protection against prototype pollution
// - No eval() or innerHTML with user data
// =============================================================================

'use strict';

// =============================================================================
// SECURITY UTILITIES
// =============================================================================

// Sanitize string to prevent XSS - escape HTML entities
function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Validate URL to prevent javascript: protocol attacks
function isValidURL(string) {
  try {
    const url = new URL(string);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

// Safe JSON parse with error handling
function safeJSONParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// Freeze objects to prevent prototype pollution
function deepFreeze(obj) {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => deepFreeze(obj[key]));
    return Object.freeze(obj);
  }
  return obj;
}

// =============================================================================
// DATA (Frozen to prevent tampering)
// =============================================================================

const PHOTOS = deepFreeze([
  { src: "/assets/photos/photo-1.jpg", caption: "Lagos, 2025", alt: "Street scene in Lagos", location: "Lagos" },
  { src: "/assets/photos/photo-2.jpg", caption: "Frankfurt, 2025", alt: "Frankfurt street", location: "Frankfurt" },
  { src: "/assets/photos/photo-3.jpg", caption: "Accra, 2025", alt: "Accra market", location: "Accra" },
  { src: "/assets/photos/photo-4.jpg", caption: "Lagos, 2025", alt: "Lagos street", location: "Lagos" },
  { src: "/assets/photos/photo-5.jpg", caption: "Durham, 2024", alt: "Durham scene", location: "Durham" },
  { src: "/assets/photos/photo-6.jpg", caption: "Frankfurt, 2025", alt: "Architecture in Frankfurt", location: "Frankfurt" }
]);

const ARTICLES = deepFreeze([
  { title: "A quick note on consistency", date: "Jan 2026", topic: "Work / life", url: "/articles.html" },
  { title: "What I'm learning from walking", date: "Dec 2025", topic: "Movement", url: "/articles.html" }
]);

const TRAVELS = deepFreeze([
  { 
    title: "Frankfurt", 
    meta: "2025 · small details, big calm", 
    url: "https://www.ererezino.com/travels",
    photo: "/assets/photos/photo-2.jpg",
    stamp: "DE"
  },
  { 
    title: "Accra", 
    meta: "2025 · food, pace, and sunlight", 
    url: "https://www.ererezino.com/travels",
    photo: "/assets/photos/photo-3.jpg",
    stamp: "GH"
  }
]);

const MUSIC = deepFreeze([
  { title: "Remember", artist: "Asake", url: "https://music.youtube.com/watch?v=MhvVRw5XTVY", cover: "https://upload.wikimedia.org/wikipedia/en/9/97/Asake_-_Work_of_Art.png" },
  { title: "Gratitude", artist: "Anendlessocean", url: "https://music.youtube.com/watch?v=49mF49MR_Es", cover: "https://i.scdn.co/image/ab67616d0000b27331b046b5e8493d36db0f11da" },
  { title: "E Ti Tobi", artist: "EmmaOMG", url: "https://music.youtube.com/watch?v=ccg6uBQfViI", cover: "https://lh3.googleusercontent.com/LbQgNpK2UZz73LWbUFvvZ38O09ZzUQm0fkIISmrutPQVmEJ2yttEAmBKbqn-5UvE40fC6AHuSNEInvE0=w544-h544-l90-rj" }
]);

const BOOKS = deepFreeze([
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", url: "https://www.goodreads.com/book/show/42844155", cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1598823299i/42844155.jpg" }
]);

const TV = deepFreeze([
  { title: "Elsbeth", year: "2024", url: "https://www.imdb.com/title/tt26591110/", cover: "https://m.media-amazon.com/images/M/MV5BOTcwYzc0M2QtM2NiYy00MWU1LWEwYmYtZGYzYWM4MTZjZmU1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" }
]);

const STEPS_DATA = deepFreeze({
  currentMonth: {
    name: "January",
    year: 2026,
    steps: 198000,
    distance: 140,
    avgDaily: 9900
  },
  lastMonth: {
    name: "December",
    year: 2025,
    steps: 287000,
    distance: 203,
    avgDaily: 9258
  }
});

// =============================================================================
// UTILITIES
// =============================================================================

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatNumber(n) {
  if (typeof n !== 'number' || isNaN(n)) return '0';
  return n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n.toLocaleString();
}

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t)); // Clamp t between 0 and 1
}

// Safe localStorage wrapper with quota handling
const storage = {
  get(key) {
    if (typeof key !== 'string') return null;
    try { 
      return localStorage.getItem(key); 
    } catch (e) { 
      console.warn('localStorage read error:', e.name);
      return null; 
    }
  },
  set(key, value) {
    if (typeof key !== 'string') return false;
    try { 
      localStorage.setItem(key, String(value)); 
      return true; 
    } catch (e) { 
      // Handle quota exceeded
      if (e.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded');
      }
      return false; 
    }
  },
  remove(key) {
    if (typeof key !== 'string') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }
};

function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// =============================================================================
// SAFE DOM CREATION HELPERS
// =============================================================================

// Create element safely without innerHTML
function createElement(tag, attributes = {}, children = []) {
  const el = document.createElement(tag);
  
  // Set attributes safely
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = sanitizeHTML(value);
    } else if (key === 'textContent') {
      el.textContent = value; // textContent is safe
    } else if (key.startsWith('data-')) {
      el.setAttribute(key, sanitizeHTML(String(value)));
    } else if (key === 'href' || key === 'src') {
      // Validate URLs
      if (value.startsWith('/') || value.startsWith('#') || isValidURL(value)) {
        el.setAttribute(key, value);
      }
    } else if (['id', 'type', 'role', 'aria-label', 'aria-hidden', 'aria-expanded', 
                'aria-controls', 'aria-current', 'tabindex', 'loading', 'decoding',
                'alt', 'width', 'height', 'rel', 'target', 'draggable'].includes(key)) {
      el.setAttribute(key, sanitizeHTML(String(value)));
    }
  });
  
  // Append children safely
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });
  
  return el;
}

// Create SVG element safely
function createSVG(paths, viewBox = "0 0 24 24", attributes = {}) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("aria-hidden", "true");
  
  Object.entries(attributes).forEach(([key, value]) => {
    svg.setAttribute(key, value);
  });
  
  paths.forEach(pathData => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    svg.appendChild(path);
  });
  
  return svg;
}

// =============================================================================
// PAGE LOADER
// =============================================================================

function initPageLoader() {
  const loader = $('#pageLoader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.addEventListener('load', () => setTimeout(hideLoader, 300));
  setTimeout(hideLoader, 3000); // Fallback
}

// =============================================================================
// THEME
// =============================================================================

function initTheme() {
  const saved = storage.get('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved === 'dark' || (!saved && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  updateThemeColorMeta(isDark ? 'dark' : 'light');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  storage.set('theme', next);
  updateThemeColorMeta(next);
  playSound('click');
  announceToScreenReader(`Theme changed to ${next} mode`);
}

function updateThemeColorMeta(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0A0A0A' : '#FAFAFA');
}

function initSystemThemeListener() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!storage.get('theme')) {
      const theme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      updateThemeColorMeta(theme);
    }
  });
}

// =============================================================================
// TIME-BASED GREETING
// =============================================================================

function initTimeGreeting() {
  const greetingEl = $('#heroGreeting');
  const timeEl = $('#heroTime');
  if (!greetingEl) return;

  function update() {
    try {
      const now = new Date();
      const lagosTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
      const hour = lagosTime.getHours();
      
      let greeting;
      if (hour >= 5 && hour < 12) greeting = 'Good morning ☀️';
      else if (hour >= 12 && hour < 17) greeting = 'Good afternoon 🌤️';
      else if (hour >= 17 && hour < 21) greeting = 'Good evening 🌅';
      else greeting = 'Good night 🌙';
      
      greetingEl.textContent = greeting;
      
      if (timeEl) {
        timeEl.textContent = lagosTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      }
    } catch (e) {
      greetingEl.textContent = 'Welcome';
    }
  }
  
  update();
  setInterval(update, 60000);
}

// =============================================================================
// SOUND EFFECTS (Web Audio API - no external files)
// =============================================================================

let soundEnabled = false;
const sounds = { context: null };

function initSounds() {
  const toggle = $('#soundToggle');
  if (!toggle) return;

  soundEnabled = storage.get('soundEnabled') === 'true';
  toggle.classList.toggle('muted', !soundEnabled);

  toggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    storage.set('soundEnabled', String(soundEnabled));
    toggle.classList.toggle('muted', !soundEnabled);
    if (soundEnabled) playSound('click');
  });

  document.addEventListener('click', initAudioContext, { once: true });
}

function initAudioContext() {
  if (sounds.context) return;
  try {
    sounds.context = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.warn('Web Audio API not supported');
  }
}

function playSound(type) {
  if (!soundEnabled || !sounds.context || prefersReducedMotion) return;

  try {
    const ctx = sounds.context;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'click') {
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } else if (type === 'whoosh') {
      oscillator.frequency.value = 400;
      oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      oscillator.type = 'sine';
      gainNode.gain.value = 0.05;
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // Silently fail - sound is not critical
  }
}

function bindSounds() {
  $$('[data-sound]').forEach(el => {
    el.addEventListener('click', () => playSound(el.dataset.sound));
  });
}

// =============================================================================
// ACCESSIBILITY HELPERS
// =============================================================================

function announceToScreenReader(message) {
  const announcement = createElement('div', {
    role: 'status',
    'aria-live': 'polite',
    'aria-atomic': 'true',
    className: 'sr-only',
    textContent: message
  });
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleTab(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  element.addEventListener('keydown', handleTab);
  return () => element.removeEventListener('keydown', handleTab);
}

// =============================================================================
// CUSTOM CURSOR
// =============================================================================

function initCursor() {
  if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

  const cursor = $('#cursor');
  const cursorTrail = $('#cursorTrail');
  const cursorLabel = $('#cursorLabel');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  let trailX = 0, trailY = 0;
  let moveTimeout;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('visible');
    cursorTrail?.classList.add('visible');
    
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => cursorTrail?.classList.remove('visible'), 100);
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
    cursorTrail?.classList.remove('visible');
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
    
    if (cursorTrail) {
      trailX = lerp(trailX, mouseX, 0.08);
      trailY = lerp(trailY, mouseY, 0.08);
      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
    }
    
    requestAnimationFrame(animate);
  }
  animate();

  // Hover effects using event delegation
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button');
    const photoTarget = e.target.closest('.photo-item, .stack-card, .travel-postcard');
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
      cursorLabel.textContent = labelTarget.dataset.cursorLabel || '';
      cursorLabel.classList.add('visible');
    } else if (target) {
      cursor.classList.add('hover');
      cursor.classList.remove('photo-hover');
      cursorLabel?.classList.remove('visible');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .photo-item, .stack-card, .travel-postcard, [data-cursor-label]')) {
      cursor.classList.remove('hover', 'photo-hover');
      cursorLabel?.classList.remove('visible');
    }
  });
}

// =============================================================================
// 3D TILT EFFECT
// =============================================================================

function initTiltEffect() {
  if (prefersReducedMotion) return;

  $$('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = Math.max(-10, Math.min(10, (y - centerY) / 20));
      const rotateY = Math.max(-10, Math.min(10, (centerX - x) / 20));
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
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
      const x = Math.max(-20, Math.min(20, (e.clientX - rect.left - rect.width / 2) * 0.2));
      const y = Math.max(-20, Math.min(20, (e.clientY - rect.top - rect.height / 2) * 0.2));
      btn.style.transform = `translate(${x}px, ${y}px)`;
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
    playSound('whoosh');
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
    setTimeout(() => $('nav a', menu)?.focus(), 100);
    if (menu) removeTrapFocus = trapFocus(menu);
    announceToScreenReader('Navigation menu opened');
  }

  function close() {
    menu?.classList.remove('open');
    menu?.setAttribute('aria-hidden', 'true');
    openBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    openBtn?.focus();
    if (removeTrapFocus) { removeTrapFocus(); removeTrapFocus = null; }
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

function initLightbox() {
  const lightbox = $('#lightbox');
  const img = $('#lightboxImg');
  const caption = $('#lightboxCaption');
  const counter = $('#lightboxCounter');
  const loading = $('.lightbox-loading', lightbox);

  function showLoading() { loading?.classList.add('visible'); }
  function hideLoading() { loading?.classList.remove('visible'); }

  function open(index, opener) {
    if (index < 0 || index >= PHOTOS.length) return;
    
    currentPhotoIndex = index;
    lastFocusedElement = opener || document.activeElement;
    showLoading();
    
    const photo = PHOTOS[index];
    const newImg = new Image();
    newImg.onload = () => {
      img.src = photo.src;
      img.alt = photo.alt;
      hideLoading();
    };
    newImg.onerror = () => { hideLoading(); img.alt = 'Failed to load image'; };
    newImg.src = photo.src;
    
    caption.textContent = photo.caption;
    if (counter) counter.textContent = `${index + 1} / ${PHOTOS.length}`;
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => $('.lightbox-close', lightbox)?.focus(), 100);
    if (lightbox) removeLightboxTrapFocus = trapFocus(lightbox);
    
    playSound('whoosh');
    announceToScreenReader(`Photo ${index + 1} of ${PHOTOS.length}: ${photo.caption}`);
  }

  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
    if (removeLightboxTrapFocus) { removeLightboxTrapFocus(); removeLightboxTrapFocus = null; }
  }

  function navigate(dir) {
    currentPhotoIndex = (currentPhotoIndex + dir + PHOTOS.length) % PHOTOS.length;
    const photo = PHOTOS[currentPhotoIndex];
    
    showLoading();
    const newImg = new Image();
    newImg.onload = () => {
      img.src = photo.src;
      img.alt = photo.alt;
      hideLoading();
    };
    newImg.src = photo.src;
    
    caption.textContent = photo.caption;
    if (counter) counter.textContent = `${currentPhotoIndex + 1} / ${PHOTOS.length}`;
    
    playSound('whoosh');
    announceToScreenReader(`Photo ${currentPhotoIndex + 1} of ${PHOTOS.length}: ${photo.caption}`);
  }

  $('.lightbox-close', lightbox)?.addEventListener('click', close);
  $('.lightbox-prev', lightbox)?.addEventListener('click', () => navigate(-1));
  $('.lightbox-next', lightbox)?.addEventListener('click', () => navigate(1));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Touch gestures
  const imgContainer = $('.lightbox-img-container', lightbox);
  imgContainer?.addEventListener('touchstart', (e) => {
    lightboxTouchStartX = e.touches[0].clientX;
  }, { passive: true });

  imgContainer?.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - lightboxTouchStartX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? -1 : 1);
  }, { passive: true });

  window.openLightbox = open;
}

// =============================================================================
// PHOTO STACK
// =============================================================================

class PhotoStack {
  constructor(container, photos) {
    this.container = container;
    this.photos = photos.slice(0, 4); // Limit to 4
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.deltaX = 0;
    this.hintHidden = false;
    this.render();
    this.bindEvents();
  }

  render() {
    // Clear container safely
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    const track = createElement('div', { className: 'photo-stack-track' });

    this.photos.forEach((photo, i) => {
      const img = createElement('img', {
        src: photo.src,
        alt: photo.alt,
        draggable: 'false',
        loading: i === 0 ? 'eager' : 'lazy'
      });

      const caption = createElement('span', { 
        className: 'stack-card-caption',
        textContent: photo.caption
      });

      const dots = createElement('div', { className: 'stack-card-dots' });
      this.photos.forEach((_, j) => {
        const dot = createElement('span', { className: j === 0 ? 'active' : '' });
        dots.appendChild(dot);
      });

      const footer = createElement('div', { className: 'stack-card-footer' }, [caption, dots]);

      const card = createElement('button', {
        type: 'button',
        className: 'stack-card',
        'data-index': String(i),
        'aria-label': `View photo: ${photo.caption}`,
        tabindex: i === 0 ? '0' : '-1'
      }, [img, footer]);

      track.appendChild(card);
    });

    const hint = createElement('div', { 
      className: 'stack-hint',
      'aria-hidden': 'true'
    });
    hint.appendChild(createElement('span', { textContent: 'Swipe or tap to browse' }));
    hint.appendChild(createSVG(["M5 12h14M12 5l7 7-7 7"]));

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
      
      card.dataset.position = offset === 0 ? '0' : offset === 1 ? '1' : 
                              offset === this.photos.length - 1 ? '2' : 'hidden';
      card.setAttribute('tabindex', offset === 0 ? '0' : '-1');
      card.setAttribute('aria-current', offset === 0 ? 'true' : 'false');

      $$('.stack-card-dots span', card).forEach((dot, j) => {
        dot.classList.toggle('active', j === this.currentIndex);
      });
    });
  }

  next() { 
    this.currentIndex = (this.currentIndex + 1) % this.photos.length; 
    this.updatePositions();
    this.hideHint();
    playSound('whoosh');
  }
  
  prev() { 
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length; 
    this.updatePositions();
    this.hideHint();
    playSound('whoosh');
  }

  bindEvents() {
    this.cards.forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.position === '0') {
          const index = parseInt(card.dataset.index, 10);
          if (!isNaN(index)) window.openLightbox(index, card);
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
      if (e.key === 'ArrowLeft') { this.prev(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { this.next(); e.preventDefault(); }
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
    if (this.deltaX > 60) this.prev();
    else if (this.deltaX < -60) this.next();
    this.deltaX = 0;
  }
}

// =============================================================================
// RENDER FUNCTIONS (Using safe DOM creation)
// =============================================================================

function renderPhotoGrid() {
  const container = $('#photoGrid');
  if (!container) return;

  // Clear safely
  while (container.firstChild) container.removeChild(container.firstChild);

  const displayPhotos = PHOTOS.slice(0, 4);

  // Add skeletons
  displayPhotos.forEach(() => {
    container.appendChild(createElement('div', { 
      className: 'photo-item skeleton', 
      role: 'listitem' 
    }));
  });

  const photoItems = $$('.photo-item', container);
  
  displayPhotos.forEach((photo, i) => {
    const item = photoItems[i];
    const img = new Image();
    
    img.onload = () => {
      // Clear skeleton
      while (item.firstChild) item.removeChild(item.firstChild);
      
      item.appendChild(createElement('img', {
        src: photo.src,
        alt: photo.alt,
        loading: 'lazy'
      }));
      item.appendChild(createElement('div', { className: 'photo-item-overlay' }));
      item.appendChild(createElement('span', { 
        className: 'photo-item-caption',
        textContent: photo.caption
      }));
      
      item.classList.remove('skeleton');
      item.dataset.index = String(i);
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `View photo: ${photo.caption}`);
      
      item.addEventListener('click', () => window.openLightbox(i, item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.openLightbox(i, item);
        }
      });
    };
    
    img.onerror = () => {
      while (item.firstChild) item.removeChild(item.firstChild);
      item.appendChild(createElement('span', { 
        className: 'photo-item-caption',
        textContent: 'Failed to load'
      }));
      item.classList.remove('skeleton');
    };
    
    img.src = photo.src;
  });

  const countEl = $('#photoCount');
  if (countEl) countEl.textContent = `${PHOTOS.length}+ photos`;
}

function renderArticles() {
  const container = $('#articleGrid');
  if (!container) return;

  while (container.firstChild) container.removeChild(container.firstChild);

  ARTICLES.forEach(article => {
    const arrow = createSVG(["M7 17L17 7M17 7H7M17 7v10"]);
    
    const card = createElement('a', {
      href: article.url,
      className: 'article-card',
      role: 'listitem'
    }, [
      createElement('div', {}, [
        createElement('div', { className: 'article-card-topic', textContent: article.topic }),
        createElement('h3', { className: 'article-card-title', textContent: article.title })
      ]),
      createElement('div', { className: 'article-card-footer' }, [
        createElement('span', { className: 'article-card-date', textContent: article.date }),
        createElement('span', { className: 'article-card-arrow' }, [arrow])
      ])
    ]);
    
    container.appendChild(card);
  });
}

function renderStepsSimple() {
  const container = $('#stepsSimple');
  if (!container) return;

  while (container.firstChild) container.removeChild(container.firstChild);

  const current = STEPS_DATA.currentMonth;
  const last = STEPS_DATA.lastMonth;

  // Current month card
  const currentCard = createElement('div', { className: 'steps-current-card' }, [
    createElement('div', { className: 'steps-current-header' }, [
      createElement('span', { className: 'steps-current-month', textContent: `${current.name} ${current.year}` }),
      createElement('span', { className: 'steps-current-badge', textContent: 'This month' })
    ]),
    createElement('div', {}, [
      createElement('div', { className: 'steps-current-value', textContent: formatNumber(current.steps) }),
      createElement('div', { className: 'steps-current-label', textContent: 'steps so far' })
    ]),
    createElement('div', { className: 'steps-current-stats' }, [
      createElement('div', { className: 'steps-mini-stat' }, [
        createElement('div', { className: 'steps-mini-value', textContent: `${current.distance} km` }),
        createElement('div', { className: 'steps-mini-label', textContent: 'Distance' })
      ]),
      createElement('div', { className: 'steps-mini-stat' }, [
        createElement('div', { className: 'steps-mini-value', textContent: formatNumber(current.avgDaily) }),
        createElement('div', { className: 'steps-mini-label', textContent: 'Daily avg' })
      ])
    ])
  ]);

  // Last month card
  const historyBtn = createElement('a', {
    href: '/steps.html',
    className: 'steps-history-btn'
  }, [
    document.createTextNode('See step history'),
    createSVG(["M5 12h14M12 5l7 7-7 7"])
  ]);

  const lastCard = createElement('div', { className: 'steps-last-card' }, [
    createElement('div', { className: 'steps-last-header', textContent: `${last.name} ${last.year}` }),
    createElement('div', {}, [
      createElement('div', { className: 'steps-last-value', textContent: formatNumber(last.steps) }),
      createElement('div', { className: 'steps-last-label', textContent: 'total steps' })
    ]),
    createElement('div', { className: 'steps-last-stats' }, [
      createElement('div', { className: 'steps-mini-stat' }, [
        createElement('div', { className: 'steps-mini-value', textContent: `${last.distance} km` }),
        createElement('div', { className: 'steps-mini-label', textContent: 'Distance' })
      ]),
      createElement('div', { className: 'steps-mini-stat' }, [
        createElement('div', { className: 'steps-mini-value', textContent: formatNumber(last.avgDaily) }),
        createElement('div', { className: 'steps-mini-label', textContent: 'Daily avg' })
      ])
    ]),
    historyBtn
  ]);

  container.appendChild(currentCard);
  container.appendChild(lastCard);
}

function renderTravels() {
  const container = $('#travelGrid');
  if (!container) return;

  while (container.firstChild) container.removeChild(container.firstChild);

  TRAVELS.forEach(travel => {
    if (!isValidURL(travel.url) && !travel.url.startsWith('/')) return;

    const bg = createElement('div', { className: 'travel-postcard-bg' });
    bg.style.backgroundImage = `url('${sanitizeHTML(travel.photo)}')`;

    const card = createElement('a', {
      href: travel.url,
      className: 'travel-postcard',
      role: 'listitem',
      rel: 'noopener'
    }, [
      bg,
      createElement('div', { className: 'travel-postcard-overlay' }),
      createElement('div', { className: 'travel-postcard-stamp', textContent: travel.stamp }),
      createElement('div', { className: 'travel-postcard-content' }, [
        createElement('h3', { className: 'travel-postcard-title', textContent: travel.title }),
        createElement('p', { className: 'travel-postcard-meta', textContent: travel.meta })
      ]),
      createElement('div', { className: 'travel-postcard-corner' })
    ]);

    container.appendChild(card);
  });
}

function renderInto() {
  const musicList = $('#musicList');
  const bookList = $('#bookList');
  const tvList = $('#tvList');

  function renderList(container, items, getSubtitle) {
    if (!container) return;
    while (container.firstChild) container.removeChild(container.firstChild);

    items.forEach(item => {
      if (!isValidURL(item.url)) return;

      const link = createElement('a', {
        href: item.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'into-item',
        role: 'listitem'
      }, [
        createElement('div', { className: 'into-cover' }, [
          createElement('img', { src: item.cover, alt: '', loading: 'lazy' })
        ]),
        createElement('div', { className: 'into-text' }, [
          createElement('div', { className: 'into-title', textContent: item.title }),
          createElement('div', { className: 'into-meta', textContent: getSubtitle(item) })
        ])
      ]);

      container.appendChild(link);
    });
  }

  renderList(musicList, MUSIC, item => item.artist);
  renderList(bookList, BOOKS, item => item.author);
  renderList(tvList, TV, item => item.year);
}

// =============================================================================
// ANIMATIONS
// =============================================================================

function initHeroAnimations() {
  if (prefersReducedMotion) return;
  
  setTimeout(() => $$('.hero-title .line-inner').forEach(el => el.classList.add('animate')), 100);
  setTimeout(() => $('.hero-text')?.classList.add('animate'), 200);
  setTimeout(() => $('.hero-ctas')?.classList.add('animate'), 300);
  setTimeout(() => $('.hero-visual')?.classList.add('animate'), 400);
}

function initScrollAnimations() {
  const sections = $$('section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  sections.forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}

// =============================================================================
// KONAMI CODE
// =============================================================================

function initKonamiCode() {
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  let index = 0;

  document.addEventListener('keydown', (e) => {
    if (e.code === code[index]) {
      index++;
      if (index === code.length) {
        triggerEasterEgg();
        index = 0;
      }
    } else {
      index = 0;
    }
  });
}

function triggerEasterEgg() {
  const overlay = createElement('div', { className: 'easter-egg-overlay' }, [
    createElement('div', { className: 'easter-egg-content' }, [
      createElement('div', { className: 'easter-egg-emoji', textContent: '🎉' }),
      createElement('div', { className: 'easter-egg-text', textContent: 'You found the secret!' })
    ])
  ]);
  
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));
  
  // Play celebration sound
  if (soundEnabled && sounds.context) {
    try {
      const ctx = sounds.context;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    } catch (e) {}
  }
  
  setTimeout(() => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 500);
  }, 2000);
}

// =============================================================================
// KEYBOARD SHORTCUTS
// =============================================================================

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey) {
      toggleTheme();
    }
    
    if ((e.key === 'h' || e.key === 'H') && !e.metaKey && !e.ctrlKey) {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      playSound('whoosh');
    }
  });
}

// =============================================================================
// INIT
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initTheme();
  initSystemThemeListener();
  
  $('#themeToggle')?.addEventListener('click', toggleTheme);
  $('#mobileThemeToggle')?.addEventListener('click', toggleTheme);
  
  initTimeGreeting();
  initSounds();
  bindSounds();

  initCursor();
  initMagneticButtons();
  initTiltEffect();
  initHeader();
  initMobileMenu();
  initLightbox();

  const heroStack = $('#heroPhotoStack');
  if (heroStack) new PhotoStack(heroStack, PHOTOS);

  renderPhotoGrid();
  renderArticles();
  renderStepsSimple();
  renderTravels();
  renderInto();

  initHeroAnimations();
  initScrollAnimations();
  initKonamiCode();
  initKeyboardShortcuts();
});

document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('page-hidden', document.hidden);
});
