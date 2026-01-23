'use strict';

// =============================================================================
// DATA
// =============================================================================

var PHOTOS = [
  { src: "/assets/photos/photo-1.jpg", caption: "Lagos, 2025", alt: "Street scene in Lagos", location: "Lagos" },
  { src: "/assets/photos/photo-2.jpg", caption: "Frankfurt, 2025", alt: "Frankfurt street", location: "Frankfurt" },
  { src: "/assets/photos/photo-3.jpg", caption: "Accra, 2025", alt: "Accra market", location: "Accra" },
  { src: "/assets/photos/photo-4.jpg", caption: "Lagos, 2025", alt: "Lagos street", location: "Lagos" },
  { src: "/assets/photos/photo-5.jpg", caption: "Durham, 2024", alt: "Durham scene", location: "Durham" },
  { src: "/assets/photos/photo-6.jpg", caption: "Frankfurt, 2025", alt: "Architecture in Frankfurt", location: "Frankfurt" }
];

// Helper to generate responsive image HTML
function getResponsiveImage(photo, lazy) {
  return '<img src="' + photo.src + '" alt="' + (photo.alt || '') + '" width="400" height="400" style="width:100%;height:100%;object-fit:cover;" />';
}

var ARTICLES = [
  { title: "A quick note on consistency", date: "Jan 2026", topic: "Work / life", url: "/articles.html" },
  { title: "What I'm learning from walking", date: "Dec 2025", topic: "Movement", url: "/articles.html" }
];

var TRAVELS = [
  { 
    title: "Frankfurt", 
    meta: "Small details, big calm", 
    url: "https://www.ererezino.com/travels",
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
    url: "https://www.ererezino.com/travels",
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
// PAGE LOADER
// =============================================================================

function initPageLoader() {
  var loader = $('#pageLoader');
  if (!loader) return;

  window.addEventListener('load', function() {
    setTimeout(function() {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  });

  setTimeout(function() {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3000);
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
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  storage.set('theme', next);
  updateThemeColorMeta(next);
  playSound('click');
}

function updateThemeColorMeta(theme) {
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0A0A0A' : '#FAFAFA');
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
// SOUND EFFECTS
// =============================================================================

var soundEnabled = false;
var sounds = {};

function initSounds() {
  var toggle = $('#soundToggle');
  if (!toggle) return;

  soundEnabled = storage.get('soundEnabled') === 'true';
  toggle.classList.toggle('muted', !soundEnabled);

  toggle.addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    storage.set('soundEnabled', soundEnabled);
    toggle.classList.toggle('muted', !soundEnabled);
    
    if (soundEnabled) {
      playSound('click');
    }
  });

  document.addEventListener('click', initAudioContext, { once: true });
}

function initAudioContext() {
  if (sounds.context) return;
  
  try {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      sounds.context = new AudioContext();
    }
  } catch (e) {}
}

function playSound(type) {
  if (!soundEnabled || !sounds.context || prefersReducedMotion) return;

  try {
    var ctx = sounds.context;
    var oscillator = ctx.createOscillator();
    var gainNode = ctx.createGain();

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
  } catch(e) {}
}

function bindSounds() {
  $$('[data-sound]').forEach(function(el) {
    el.addEventListener('click', function() {
      playSound(el.dataset.sound);
    });
  });
}

// =============================================================================
// HEADER
// =============================================================================

function initHeader() {
  var header = $('#header');
  var backToTop = $('#backToTop');
  
  var handleScroll = throttle(function() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo(0, 0);
      playSound('whoosh');
    });
  }
}

// =============================================================================
// MOBILE MENU
// =============================================================================

function initMobileMenu() {
  var menu = $('#mobileMenu');
  var openBtn = $('#mobileMenuBtn');
  var closeBtn = $('#mobileMenuClose');

  function open() {
    if (menu) {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
    }
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (menu) {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    }
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  $$('a', menu).forEach(function(link) { link.addEventListener('click', close); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) close();
  });
}

// =============================================================================
// LIGHTBOX
// =============================================================================

var currentPhotoIndex = 0;

function initLightbox() {
  var lightbox = $('#lightbox');
  if (!lightbox) return;
  
  var img = $('#lightboxImg');
  var caption = $('#lightboxCaption');
  var counter = $('#lightboxCounter');

  function open(index) {
    currentPhotoIndex = index;
    if (img) {
      img.src = PHOTOS[index].src;
      img.alt = PHOTOS[index].alt;
    }
    if (caption) caption.textContent = PHOTOS[index].caption;
    if (counter) counter.textContent = (index + 1) + ' / ' + PHOTOS.length;
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    playSound('whoosh');
  }

  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentPhotoIndex = (currentPhotoIndex + dir + PHOTOS.length) % PHOTOS.length;
    if (img) {
      img.src = PHOTOS[currentPhotoIndex].src;
      img.alt = PHOTOS[currentPhotoIndex].alt;
    }
    if (caption) caption.textContent = PHOTOS[currentPhotoIndex].caption;
    if (counter) counter.textContent = (currentPhotoIndex + 1) + ' / ' + PHOTOS.length;
    playSound('whoosh');
  }

  var closeBtn = $('.lightbox-close', lightbox);
  var prevBtn = $('.lightbox-prev', lightbox);
  var nextBtn = $('.lightbox-next', lightbox);
  
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', function() { navigate(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { navigate(1); });
  lightbox.addEventListener('click', function(e) { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  window.openLightbox = open;
}

// =============================================================================
// PHOTO STACK (Hero)
// =============================================================================

function PhotoStack(container, photos) {
  this.container = container;
  this.photos = photos;
  this.currentIndex = 0;
  this.cards = [];
  this.render();
  this.bindEvents();
}

PhotoStack.prototype.render = function() {
  var self = this;
  var track = document.createElement('div');
  track.className = 'photo-stack-track';

  this.photos.forEach(function(photo, i) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'stack-card';
    card.dataset.index = i;
    card.setAttribute('aria-label', 'View photo: ' + photo.caption);
    
    var dotsHTML = '';
    for (var j = 0; j < self.photos.length; j++) {
      dotsHTML += '<span' + (j === 0 ? ' class="active"' : '') + '></span>';
    }
    
    card.innerHTML = 
      '<img src="' + photo.src + '" alt="' + photo.alt + '" draggable="false" />' +
      '<div class="stack-card-footer">' +
        '<span class="stack-card-caption">' + photo.caption + '</span>' +
        '<div class="stack-card-dots" aria-hidden="true">' + dotsHTML + '</div>' +
      '</div>';
    track.appendChild(card);
  });

  var hint = document.createElement('div');
  hint.className = 'stack-hint';
  hint.innerHTML = '<span>Swipe or tap to browse</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

  this.container.innerHTML = '';
  this.container.appendChild(track);
  this.container.appendChild(hint);
  this.cards = $$('.stack-card', track);
  this.updatePositions();
};

PhotoStack.prototype.updatePositions = function() {
  var self = this;
  this.cards.forEach(function(card, i) {
    var offset = (i - self.currentIndex + self.photos.length) % self.photos.length;
    
    if (offset === 0) {
      card.dataset.position = '0';
    } else if (offset === 1) {
      card.dataset.position = '1';
    } else if (offset === self.photos.length - 1) {
      card.dataset.position = '2';
    } else {
      card.dataset.position = 'hidden';
    }

    var dots = $$('.stack-card-dots span', card);
    for (var j = 0; j < dots.length; j++) {
      if (j === self.currentIndex) {
        dots[j].className = 'active';
      } else {
        dots[j].className = '';
      }
    }
  });
};

PhotoStack.prototype.next = function() { 
  this.currentIndex = (this.currentIndex + 1) % this.photos.length; 
  this.updatePositions();
  playSound('whoosh');
};

PhotoStack.prototype.bindEvents = function() {
  var self = this;
  
  this.cards.forEach(function(card) {
    card.addEventListener('click', function() {
      if (card.dataset.position === '0') {
        if (window.openLightbox) {
          window.openLightbox(parseInt(card.dataset.index, 10));
        }
      } else {
        self.next();
      }
    });
  });
};

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
  ARTICLES.forEach(function(article) {
    html += '<a href="' + article.url + '" class="article-card" role="listitem">' +
      '<div>' +
        '<div class="article-card-topic">' + article.topic + '</div>' +
        '<h3 class="article-card-title">' + article.title + '</h3>' +
      '</div>' +
      '<div class="article-card-footer">' +
        '<span class="article-card-date">' + article.date + '</span>' +
        '<span class="article-card-arrow" aria-hidden="true">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M7 17L17 7M17 7H7M17 7v10"/>' +
          '</svg>' +
        '</span>' +
      '</div>' +
    '</a>';
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
        'See movement history' +
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
    html += '<a href="' + travel.url + '" class="travel-postcard" role="listitem">' +
      '<div class="travel-postcard-frame">' +
        '<div class="travel-postcard-photo">' +
          '<div class="travel-postcard-bg" style="background-image: url(\'' + travel.photo + '\')"></div>' +
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
// MAGNETIC BUTTON EFFECT
// =============================================================================

function initMagneticButtons() {
  if (prefersReducedMotion) return;

  var magneticElements = $$('[data-magnetic]');

  magneticElements.forEach(function(el) {
    var strength = 0.3;
    var boundingRect;

    el.addEventListener('mouseenter', function() {
      boundingRect = el.getBoundingClientRect();
    });

    el.addEventListener('mousemove', function(e) {
      if (!boundingRect) return;

      var centerX = boundingRect.left + boundingRect.width / 2;
      var centerY = boundingRect.top + boundingRect.height / 2;
      var deltaX = (e.clientX - centerX) * strength;
      var deltaY = (e.clientY - centerY) * strength;

      el.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
    });

    el.addEventListener('mouseleave', function() {
      el.style.transform = '';
      el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(function() {
        el.style.transition = '';
      }, 300);
    });
  });
}

// =============================================================================
// TILT EFFECT FOR CARDS
// =============================================================================

function initTiltEffect() {
  if (prefersReducedMotion) return;

  var tiltElements = $$('[data-tilt]');

  tiltElements.forEach(function(el) {
    var maxTilt = 8;
    var perspective = 1000;
    var scale = 1.02;

    el.style.transformStyle = 'preserve-3d';

    el.addEventListener('mouseenter', function() {
      el.style.transition = 'transform 0.1s ease-out';
    });

    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var mouseX = e.clientX - centerX;
      var mouseY = e.clientY - centerY;

      var rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
      var rotateY = (mouseX / (rect.width / 2)) * maxTilt;

      el.style.transform = 'perspective(' + perspective + 'px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(' + scale + ', ' + scale + ', ' + scale + ')';
    });

    el.addEventListener('mouseleave', function() {
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'perspective(' + perspective + 'px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// =============================================================================
// KONAMI CODE EASTER EGG
// =============================================================================

function initKonamiCode() {
  var konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right b a
  var konamiIndex = 0;

  document.addEventListener('keydown', function(e) {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;

      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateEasterEgg() {
    var overlay = document.createElement('div');
    overlay.className = 'easter-egg-overlay';
    overlay.innerHTML =
      '<div class="easter-egg-content">' +
        '<div class="easter-egg-emoji">🎉</div>' +
        '<div class="easter-egg-text">You found me!</div>' +
        '<p style="margin-top: 16px; font-family: var(--font-mono); font-size: 14px; opacity: 0.8;">Thanks for exploring. Here\'s a virtual high five! ✋</p>' +
      '</div>';

    document.body.appendChild(overlay);

    setTimeout(function() {
      overlay.classList.add('active');
    }, 10);

    overlay.addEventListener('click', function() {
      overlay.classList.remove('active');
      setTimeout(function() {
        overlay.remove();
      }, 500);
    });

    document.addEventListener('keydown', function closeOnEscape(e) {
      if (e.key === 'Escape') {
        overlay.classList.remove('active');
        setTimeout(function() {
          overlay.remove();
        }, 500);
        document.removeEventListener('keydown', closeOnEscape);
      }
    });

    playSound('whoosh');
  }
}

// =============================================================================
// PAGE TRANSITIONS
// =============================================================================

function initPageTransitions() {
  if (prefersReducedMotion) return;

  // Create transition overlay
  var transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition';
  transitionOverlay.innerHTML = '<div class="page-transition-inner"></div>';
  document.body.appendChild(transitionOverlay);

  // Intercept internal navigation
  $$('a[href^="/"], a[href^="./"]').forEach(function(link) {
    // Skip external links and hash links
    if (link.getAttribute('target') === '_blank') return;
    if (link.getAttribute('href').indexOf('#') === 0) return;

    link.addEventListener('click', function(e) {
      var href = link.getAttribute('href');

      // Don't intercept if modifier keys pressed
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      e.preventDefault();

      transitionOverlay.classList.add('active');
      playSound('whoosh');

      setTimeout(function() {
        window.location.href = href;
      }, 400);
    });
  });

  // Fade in on page load
  window.addEventListener('pageshow', function() {
    transitionOverlay.classList.remove('active');
  });
}

// =============================================================================
// ENHANCED SCROLL INDICATOR
// =============================================================================

function initScrollIndicator() {
  var indicator = $('.scroll-indicator');
  if (!indicator) return;

  var handleScroll = throttle(function() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var opacity = Math.max(0, 1 - (scrollY / 300));
    indicator.style.opacity = opacity;

    if (scrollY > 300) {
      indicator.style.pointerEvents = 'none';
    } else {
      indicator.style.pointerEvents = '';
    }
  }, 16);

  window.addEventListener('scroll', handleScroll, { passive: true });
}

// =============================================================================
// SIGNATURE HERO INTERACTION - Parallax text reveal
// =============================================================================

function initHeroParallax() {
  if (prefersReducedMotion) return;

  var heroContent = $('.hero-content');
  var heroVisual = $('.hero-visual');
  var heroTitle = $('.hero-title');

  if (!heroContent || !heroVisual) return;

  var handleScroll = throttle(function() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var windowHeight = window.innerHeight;

    if (scrollY > windowHeight) return;

    var progress = scrollY / (windowHeight * 0.5);

    // Parallax effect on hero elements
    if (heroTitle) {
      heroTitle.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
      heroTitle.style.opacity = Math.max(0, 1 - progress * 0.8);
    }

    if (heroVisual) {
      heroVisual.style.transform = 'translateY(' + (scrollY * 0.08) + 'px) scale(' + (1 - progress * 0.05) + ')';
    }
  }, 16);

  window.addEventListener('scroll', handleScroll, { passive: true });
}

// =============================================================================
// TEXT SCRAMBLE EFFECT FOR HERO
// =============================================================================

function TextScramble(el) {
  this.el = el;
  this.chars = '!<>-_\\/[]{}—=+*^?#________';
  this.update = this.update.bind(this);
}

TextScramble.prototype.setText = function(newText) {
  var self = this;
  var oldText = this.el.innerText;
  var length = Math.max(oldText.length, newText.length);
  var promise = new Promise(function(resolve) { self.resolve = resolve; });
  this.queue = [];

  for (var i = 0; i < length; i++) {
    var from = oldText[i] || '';
    var to = newText[i] || '';
    var start = Math.floor(Math.random() * 40);
    var end = start + Math.floor(Math.random() * 40);
    this.queue.push({ from: from, to: to, start: start, end: end });
  }

  cancelAnimationFrame(this.frameRequest);
  this.frame = 0;
  this.update();
  return promise;
};

TextScramble.prototype.update = function() {
  var output = '';
  var complete = 0;
  var self = this;

  for (var i = 0; i < this.queue.length; i++) {
    var item = this.queue[i];
    var from = item.from;
    var to = item.to;
    var start = item.start;
    var end = item.end;
    var char = item.char;

    if (this.frame >= end) {
      complete++;
      output += to;
    } else if (this.frame >= start) {
      if (!char || Math.random() < 0.28) {
        char = this.chars[Math.floor(Math.random() * this.chars.length)];
        item.char = char;
      }
      output += '<span class="scramble-char">' + char + '</span>';
    } else {
      output += from;
    }
  }

  this.el.innerHTML = output;

  if (complete === this.queue.length) {
    this.resolve();
  } else {
    this.frameRequest = requestAnimationFrame(this.update);
    this.frame++;
  }
};

function initTextScramble() {
  if (prefersReducedMotion) return;

  var greetingEl = $('#heroGreeting');
  if (!greetingEl || !greetingEl.textContent) return;

  var phrases = ['Good morning', 'Good afternoon', 'Good evening', 'Good night'];
  var currentGreeting = greetingEl.textContent;

  // Only scramble on first load
  if (greetingEl.dataset.scrambled) return;
  greetingEl.dataset.scrambled = 'true';

  var fx = new TextScramble(greetingEl);
  greetingEl.textContent = '';

  setTimeout(function() {
    fx.setText(currentGreeting);
  }, 800);
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
  
  var themeToggle = $('#themeToggle');
  var mobileThemeToggle = $('#mobileThemeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
  
  initTimeGreeting();
  initSounds();
  bindSounds();
  initHeader();
  initMobileMenu();
  initLightbox();

  var heroStack = $('#heroPhotoStack');
  if (heroStack) new PhotoStack(heroStack, PHOTOS.slice(0, 4));

  renderPhotoGrid();
  renderArticles();
  renderStepsSimple();
  renderTravels();
  renderInto();

  initHeroAnimations();
  initScrollAnimations();
  initMagneticButtons();
  initTiltEffect();
  initKonamiCode();
  initPageTransitions();
  initScrollIndicator();
  initHeroParallax();
  initTextScramble();
});
