'use strict';

// =============================================================================
// DATA
// =============================================================================

var PHOTOS = [
  { src: "/assets/photos/photo-1.jpg", caption: "Morning light", alt: "Morning light in Lagos", location: "Lagos", year: 2025 },
  { src: "/assets/photos/photo-2.jpg", caption: "City streets", alt: "Frankfurt street scene", location: "Frankfurt", year: 2025 },
  { src: "/assets/photos/photo-3.jpg", caption: "Market day", alt: "Accra market", location: "Accra", year: 2025 },
  { src: "/assets/photos/photo-4.jpg", caption: "Urban life", alt: "Lagos street life", location: "Lagos", year: 2025 },
  { src: "/assets/photos/photo-5.jpg", caption: "Cathedral view", alt: "Durham Cathedral", location: "Durham", year: 2024 },
  { src: "/assets/photos/photo-6.jpg", caption: "Architecture", alt: "Frankfurt architecture", location: "Frankfurt", year: 2025 }
];

// Helper to get thumbnail path from original
function getThumbSrc(src) {
  var lastSlash = src.lastIndexOf('/');
  return src.substring(0, lastSlash) + '/thumbs' + src.substring(lastSlash);
}

// Helper to get WebP path from original
function getWebpSrc(src) {
  return src.replace(/\.(jpe?g|png)$/i, '.webp');
}

// Helper to get AVIF path from original
function getAvifSrc(src) {
  return src.replace(/\.(jpe?g|png)$/i, '.avif');
}

// Helper to generate responsive image HTML with lazy loading, srcset, and modern formats
function getResponsiveImage(photo, lazy) {
  var lazyAttr = lazy !== false ? ' loading="lazy" decoding="async"' : ' decoding="async"';
  var thumb = getThumbSrc(photo.src);
  var thumbWebp = getWebpSrc(thumb);
  var fullWebp = getWebpSrc(photo.src);
  var thumbAvif = getAvifSrc(thumb);
  var fullAvif = getAvifSrc(photo.src);
  return '<picture>' +
    '<source type="image/avif" srcset="' + thumbAvif + ' 600w, ' + fullAvif + ' 1200w" sizes="(max-width: 768px) 50vw, 400px">' +
    '<source type="image/webp" srcset="' + thumbWebp + ' 600w, ' + fullWebp + ' 1200w" sizes="(max-width: 768px) 50vw, 400px">' +
    '<img src="' + thumb + '" srcset="' + thumb + ' 600w, ' + photo.src + ' 1200w" sizes="(max-width: 768px) 50vw, 400px" alt="' + (photo.alt || '') + '" width="400" height="400"' + lazyAttr + ' style="width:100%;height:100%;object-fit:cover;" />' +
  '</picture>';
}

var ARTICLES = [
  { title: "Why I'm Building Accrue", date: "Jan 2026", topic: "Startups", url: "/articles/why-im-building-accrue/", image: "/articles/why-im-building-accrue/team.png", featured: true, excerpt: "The agent model already exists. It just needs better rails." },
  { title: "On Walking", date: "Jan 2026", topic: "Life", url: "/articles/on-walking/", image: "/articles/on-walking/image.jpg", excerpt: "Moving through the world at five kilometers per hour." }
];

var TRAVELS = [
  {
    title: "Frankfurt",
    meta: "Small details, big calm",
    url: "/travels.html",
    photo: "/assets/photos/photo-2.jpg",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    city: "Frankfurt",
    year: "2025",
    stampValue: "€1.60"
  },
  {
    title: "Accra",
    meta: "Food, pace, and sunlight",
    url: "/travels.html",
    photo: "/assets/photos/photo-3.jpg",
    country: "Ghana",
    countryCode: "GH",
    flag: "🇬🇭",
    city: "Accra",
    year: "2025",
    stampValue: "₵8.00"
  }
];

var MUSIC = [
  { title: "Remember", artist: "Asake", url: "https://music.youtube.com/watch?v=MhvVRw5XTVY", cover: "https://upload.wikimedia.org/wikipedia/en/9/97/Asake_-_Work_of_Art.png" },
  { title: "Gratitude", artist: "Anendlessocean", url: "https://music.youtube.com/watch?v=49mF49MR_Es", cover: "https://i.scdn.co/image/ab67616d0000b27331b046b5e8493d36db0f11da" },
  { title: "E Ti Tobi", artist: "EmmaOMG", url: "https://music.youtube.com/watch?v=ccg6uBQfViI", cover: "https://lh3.googleusercontent.com/LbQgNpK2UZz73LWbUFvvZ38O09ZzUQm0fkIISmrutPQVmEJ2yttEAmBKbqn-5UvE40fC6AHuSNEInvE0=w544-h544-l90-rj" }
];

var BOOKS = [
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", url: "https://www.goodreads.com/book/show/42844155", cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1598823299i/42844155.jpg" }
];

var TV = [
  { title: "Elsbeth", year: "2024", url: "https://www.imdb.com/title/tt26591110/", cover: "https://m.media-amazon.com/images/M/MV5BOTcwYzc0M2QtM2NiYy00MWU1LWEwYmYtZGYzYWM4MTZjZmU1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" }
];

var STEPS_DATA = {
  currentMonth: {
    name: "January",
    year: 2026,
    steps: 234091,
    distance: 176,
    avgDaily: 9363
  },
  lastMonth: {
    name: "December",
    year: 2025,
    steps: 401117,
    distance: 301,
    avgDaily: 12939
  }
};

// =============================================================================
// UTILITIES
// =============================================================================

function $(sel, ctx) {
  return (ctx || document).querySelector(sel);
}

function $$(sel, ctx) {
  var elements = (ctx || document).querySelectorAll(sel);
  var arr = [];
  for (var i = 0; i < elements.length; i++) {
    arr.push(elements[i]);
  }
  return arr;
}

var prefersReducedMotion = false;
try {
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
} catch(e) {}

function formatNumber(n) {
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  try {
    return n.toLocaleString();
  } catch(e) {
    return String(n);
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

var storage = {
  get: function(key) {
    try { return localStorage.getItem(key); } 
    catch (e) { return null; }
  },
  set: function(key, value) {
    try { localStorage.setItem(key, value); return true; } 
    catch (e) { return false; }
  }
};

function throttle(fn, limit) {
  var inThrottle;
  return function() {
    var args = arguments;
    var context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(function() { inThrottle = false; }, limit);
    }
  };
}

// =============================================================================
// SCROLL MANAGER - Centralized scroll event handling
// =============================================================================

var ScrollManager = {
  callbacks: [],
  ticking: false,

  init: function() {
    var self = this;
    window.addEventListener('scroll', function() {
      if (!self.ticking) {
        requestAnimationFrame(function() {
          var scrollY = window.pageYOffset || document.documentElement.scrollTop;
          for (var i = 0; i < self.callbacks.length; i++) {
            self.callbacks[i](scrollY);
          }
          self.ticking = false;
        });
        self.ticking = true;
      }
    }, { passive: true });
  },

  subscribe: function(callback) {
    this.callbacks.push(callback);
    var self = this;
    return function() {
      self.callbacks = self.callbacks.filter(function(cb) { return cb !== callback; });
    };
  }
};

// =============================================================================
// PAGE LOADER - Removed for performance
// =============================================================================

// Page loader removed - content displays immediately
function initPageLoader() {
  // No-op: loader removed for better performance
}

// =============================================================================
// THEME
// =============================================================================

function initTheme() {
  var saved = storage.get('theme');
  var prefersDark = false;
  try {
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch(e) {}
  var isDark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  updateThemeColorMeta(isDark ? 'dark' : 'light');
}

function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';

  // Change theme
  html.setAttribute('data-theme', next);
  storage.set('theme', next);
  updateThemeColorMeta(next);

  // Force repaint for browsers that don't repaint on data-attribute changes
  void document.body.offsetHeight;
}

function updateThemeColorMeta(theme) {
  var metas = document.querySelectorAll('meta[name="theme-color"]');
  var color = theme === 'dark' ? '#0A0A0A' : '#FAFAFA';
  metas.forEach(function(meta) { meta.setAttribute('content', color); });
}

function initSystemThemeListener() {
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!storage.get('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        updateThemeColorMeta(e.matches ? 'dark' : 'light');
      }
    });
  } catch(e) {}
}

// =============================================================================
// TIME-BASED GREETING - Safari compatible
// =============================================================================

function initTimeGreeting() {
  var greetingEl = $('#heroGreeting');
  var timeEl = $('#heroTime');
  if (!greetingEl) return;

  function update() {
    try {
      var now = new Date();
      var hour = now.getUTCHours() + 1; // Lagos is UTC+1
      if (hour >= 24) hour -= 24;
      
      var greeting;
      if (hour >= 5 && hour < 12) {
        greeting = 'Good morning';
      } else if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon';
      } else if (hour >= 17 && hour < 21) {
        greeting = 'Good evening';
      } else {
        greeting = 'Good night';
      }
      
      greetingEl.textContent = greeting;
      
      if (timeEl) {
        var hours = hour;
        var minutes = now.getUTCMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        var minuteStr = minutes < 10 ? '0' + minutes : minutes;
        timeEl.textContent = hours + ':' + minuteStr + ' ' + ampm;
      }
    } catch(e) {
      greetingEl.textContent = 'Hello';
    }
  }
  
  update();
  setInterval(update, 60000);
}

// =============================================================================
// HEADER
// =============================================================================

function initHeader() {
  var header = $('#header');
  var backToTop = $('#backToTop');

  ScrollManager.subscribe(function(scrollY) {
    if (header) header.classList.toggle('scrolled', scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);
  });

  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo(0, 0);
    });
  }
}

// =============================================================================
// FOCUS TRAP UTILITY
// =============================================================================

function createFocusTrap(container) {
  var focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function getFocusableElements() {
    return $$(focusableSelectors, container).filter(function(el) {
      return !el.disabled && el.offsetParent !== null;
    });
  }

  function handleKeydown(e) {
    if (e.key !== 'Tab') return;

    var focusable = getFocusableElements();
    if (focusable.length === 0) return;

    var firstEl = focusable[0];
    var lastEl = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }

  return {
    activate: function() {
      container.addEventListener('keydown', handleKeydown);
      var focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    },
    deactivate: function() {
      container.removeEventListener('keydown', handleKeydown);
    }
  };
}

// =============================================================================
// MOBILE MENU
// =============================================================================

function initMobileMenu() {
  var menu = $('#mobileMenu');
  var openBtn = $('#mobileMenuBtn');
  var closeBtn = $('#mobileMenuClose');
  var previousActiveElement = null;
  var focusTrap = menu ? createFocusTrap(menu) : null;

  function open() {
    if (menu) {
      previousActiveElement = document.activeElement;
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      if (focusTrap) focusTrap.activate();
    }
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (menu) {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      if (focusTrap) focusTrap.deactivate();
    }
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (previousActiveElement) {
      previousActiveElement.focus();
      previousActiveElement = null;
    }
  }

  if (openBtn) openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  $$('a', menu).forEach(function(link) { link.addEventListener('click', close); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) close();
  });
}

// =============================================================================
// RENDER FUNCTIONS
// =============================================================================

function renderPhotoGrid() {
  var container = $('#photoGrid');
  if (!container) return;

  var displayPhotos = PHOTOS.slice(0, 4);
  var html = '';

  displayPhotos.forEach(function(photo, i) {
    html += '<button type="button" class="photo-item" data-index="' + i + '" role="listitem" aria-label="View photo: ' + photo.alt + '">' +
      getResponsiveImage(photo, true) +
      '<div class="photo-item-overlay"></div>' +
      '<span class="photo-item-caption">' + photo.caption + '</span>' +
    '</button>';
  });

  container.innerHTML = html;

  $$('.photo-item', container).forEach(function(item) {
    item.addEventListener('click', function() {
      if (window.openLightbox) {
        window.openLightbox(parseInt(item.dataset.index, 10));
      }
    });
  });

  var countEl = $('#photoCount');
  if (countEl) countEl.textContent = PHOTOS.length + '+ photos';
}

function renderArticles() {
  var container = $('#articleGrid');
  if (!container) return;

  var html = '';

  // Render all articles with uniform card design
  ARTICLES.forEach(function(article) {
    if (article.image) {
      // Card with image - uniform design for all
      html += '<a href="' + article.url + '" class="article-card-image-card" role="listitem">' +
        '<div class="article-card-image">' +
          '<img src="' + article.image + '" alt="" loading="lazy" />' +
        '</div>' +
        '<div class="article-card-content">' +
          '<div>' +
            '<div class="article-card-topic">' + article.topic + '</div>' +
            '<h3 class="article-card-title">' + article.title + '</h3>' +
            (article.excerpt ? '<p class="article-card-excerpt">' + article.excerpt + '</p>' : '') +
          '</div>' +
          '<div class="article-card-footer">' +
            '<span class="article-card-date">' + article.date + '</span>' +
            '<span class="article-card-arrow" aria-hidden="true">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                '<path d="M7 17L17 7M17 7H7M17 7v10"/>' +
              '</svg>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</a>';
    } else {
      // Standard card without image
      html += '<a href="' + article.url + '" class="article-card" role="listitem" data-tilt>' +
        '<div>' +
          '<div class="article-card-topic">' + article.topic + '</div>' +
          '<h3 class="article-card-title">' + article.title + '</h3>' +
        '</div>' +
        '<div class="article-card-footer">' +
          '<span class="article-card-date">' + article.date + '</span>' +
          '<span class="article-card-arrow" aria-hidden="true">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
              '<path d="M7 17L17 7M17 7H7M17 7v10"/>' +
            '</svg>' +
          '</span>' +
        '</div>' +
      '</a>';
    }
  });

  container.innerHTML = html;
}

function renderStepsSimple() {
  var container = $('#stepsSimple');
  if (!container) return;

  var current = STEPS_DATA.currentMonth;
  var last = STEPS_DATA.lastMonth;

  container.innerHTML = 
    '<div class="steps-current-card">' +
      '<div class="steps-current-header">' +
        '<span class="steps-current-month">' + current.name + ' ' + current.year + '</span>' +
        '<span class="steps-current-badge">This month</span>' +
      '</div>' +
      '<div>' +
        '<div class="steps-current-value">' + formatNumber(current.steps) + '</div>' +
        '<div class="steps-current-label">steps so far</div>' +
      '</div>' +
      '<div class="steps-current-stats">' +
        '<div class="steps-mini-stat">' +
          '<div class="steps-mini-value">' + current.distance + ' km</div>' +
          '<div class="steps-mini-label">Distance</div>' +
        '</div>' +
        '<div class="steps-mini-stat">' +
          '<div class="steps-mini-value">' + formatNumber(current.avgDaily) + '</div>' +
          '<div class="steps-mini-label">Daily avg</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="steps-last-card">' +
      '<div class="steps-last-header">' + last.name + ' ' + last.year + '</div>' +
      '<div>' +
        '<div class="steps-last-value">' + formatNumber(last.steps) + '</div>' +
        '<div class="steps-last-label">total steps</div>' +
      '</div>' +
      '<div class="steps-last-stats">' +
        '<div class="steps-mini-stat">' +
          '<div class="steps-mini-value">' + last.distance + ' km</div>' +
          '<div class="steps-mini-label">Distance</div>' +
        '</div>' +
        '<div class="steps-mini-stat">' +
          '<div class="steps-mini-value">' + formatNumber(last.avgDaily) + '</div>' +
          '<div class="steps-mini-label">Daily avg</div>' +
        '</div>' +
      '</div>' +
      '<a href="/movement.html" class="steps-history-btn">' +
        'See walking history' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<path d="M5 12h14M12 5l7 7-7 7"/>' +
        '</svg>' +
      '</a>' +
    '</div>';
}

function renderTravels() {
  var container = $('#travelGrid');
  if (!container) return;

  var html = '';
  TRAVELS.forEach(function(travel) {
    html += '<a href="' + travel.url + '" class="travel-postcard" role="listitem" data-tilt>' +
      '<div class="travel-postcard-frame">' +
        '<div class="travel-postcard-photo">' +
          '<img class="travel-postcard-bg" src="' + travel.photo + '" alt="' + travel.title + '" loading="lazy">' +
          '<div class="travel-postcard-overlay"></div>' +
          '<div class="travel-postcard-content">' +
            '<h3 class="travel-postcard-title">' + travel.title + '</h3>' +
            '<p class="travel-postcard-meta">' + travel.year + ' &middot; ' + travel.meta + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="travel-postcard-stamp">' +
          '<span class="travel-postcard-stamp-country">' + travel.countryCode + '</span>' +
          '<span class="travel-postcard-stamp-flag">' + travel.flag + '</span>' +
          '<span class="travel-postcard-stamp-value">' + travel.stampValue + '</span>' +
        '</div>' +
        '<div class="travel-postcard-postmark">' +
          '<span class="travel-postcard-postmark-city">' + travel.city + '</span>' +
          '<span class="travel-postcard-postmark-date">' + travel.year + '</span>' +
        '</div>' +
        '<div class="travel-postcard-airmail"></div>' +
      '</div>' +
    '</a>';
  });

  container.innerHTML = html;
}

function renderInto() {
  var musicList = $('#musicList');
  var bookList = $('#bookList');
  var tvList = $('#tvList');

  if (musicList) {
    var html = '';
    MUSIC.forEach(function(item) {
      html += '<a href="' + item.url + '" target="_blank" rel="noopener noreferrer" class="into-item" role="listitem">' +
        '<div class="into-cover"><img src="' + item.cover + '" alt="" loading="lazy" /></div>' +
        '<div class="into-text">' +
          '<div class="into-title">' + item.title + '</div>' +
          '<div class="into-meta">' + item.artist + '</div>' +
        '</div>' +
      '</a>';
    });
    musicList.innerHTML = html;
  }

  if (bookList) {
    var html = '';
    BOOKS.forEach(function(item) {
      html += '<a href="' + item.url + '" target="_blank" rel="noopener noreferrer" class="into-item" role="listitem">' +
        '<div class="into-cover"><img src="' + item.cover + '" alt="" loading="lazy" /></div>' +
        '<div class="into-text">' +
          '<div class="into-title">' + item.title + '</div>' +
          '<div class="into-meta">' + item.author + '</div>' +
        '</div>' +
      '</a>';
    });
    bookList.innerHTML = html;
  }

  if (tvList) {
    var html = '';
    TV.forEach(function(item) {
      html += '<a href="' + item.url + '" target="_blank" rel="noopener noreferrer" class="into-item" role="listitem">' +
        '<div class="into-cover"><img src="' + item.cover + '" alt="" loading="lazy" /></div>' +
        '<div class="into-text">' +
          '<div class="into-title">' + item.title + '</div>' +
          '<div class="into-meta">' + item.year + '</div>' +
        '</div>' +
      '</a>';
    });
    tvList.innerHTML = html;
  }
}

// =============================================================================
// ANIMATIONS
// =============================================================================

function initHeroAnimations() {
  if (prefersReducedMotion) return;
  
  setTimeout(function() {
    $$('.hero-title .line-inner').forEach(function(el) { el.classList.add('animate'); });
  }, 100);
  
  setTimeout(function() {
    var heroText = $('.hero-text');
    if (heroText) heroText.classList.add('animate');
  }, 200);
  
  setTimeout(function() {
    var heroCtas = $('.hero-ctas');
    if (heroCtas) heroCtas.classList.add('animate');
  }, 300);
  
  setTimeout(function() {
    var heroVisual = $('.hero-visual');
    if (heroVisual) heroVisual.classList.add('animate');
  }, 400);
}

function initScrollAnimations() {
  if (typeof IntersectionObserver === 'undefined') return;
  
  var sections = $$('section');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(function(section) {
    section.classList.add('reveal');
    observer.observe(section);
  });
}

// =============================================================================
// INIT
// =============================================================================

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('SW registered:', registration.scope);
      })
      .catch(function(error) {
        console.log('SW registration failed:', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initPageLoader();
  initTheme();
  initSystemThemeListener();

  // Initialize scroll manager first (other inits subscribe to it)
  ScrollManager.init();

  var themeToggle = $('#themeToggle');
  var mobileThemeToggle = $('#mobileThemeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

  initTimeGreeting();
  initHeader();
  initMobileMenu();

  renderPhotoGrid();
  renderArticles();
  renderStepsSimple();
  renderTravels();
  renderInto();

  initHeroAnimations();
  initScrollAnimations();

  // Lazy-load non-critical features (lightbox, photo stack, effects)
  var deferredScript = document.createElement('script');
  deferredScript.src = '/script-deferred.js?v=20260206b';
  deferredScript.defer = true;
  document.body.appendChild(deferredScript);
});
