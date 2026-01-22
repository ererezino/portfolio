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
  return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
}

var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatNumber(n) {
  return n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n.toLocaleString();
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
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
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
  announceToScreenReader('Theme changed to ' + next + ' mode');
}

function updateThemeColorMeta(theme) {
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0A0A0A' : '#FAFAFA');
}

function initSystemThemeListener() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!storage.get('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateThemeColorMeta(e.matches ? 'dark' : 'light');
    }
  });
}

// =============================================================================
// TIME-BASED GREETING
// =============================================================================

function initTimeGreeting() {
  var greetingEl = $('#heroGreeting');
  var timeEl = $('#heroTime');
  if (!greetingEl) return;

  function update() {
    var now = new Date();
    var lagosTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
    var hour = lagosTime.getHours();
    
    var greeting;
    if (hour >= 5 && hour < 12) {
      greeting = 'Good morning ☀️';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Good afternoon 🌤️';
    } else if (hour >= 17 && hour < 21) {
      greeting = 'Good evening 🌅';
    } else {
      greeting = 'Good night 🌙';
    }
    
    greetingEl.textContent = greeting;
    
    if (timeEl) {
      timeEl.textContent = lagosTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
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
    sounds.context = new AudioContext();
  } catch (e) {
    console.warn('Web Audio API not supported');
  }
}

function playSound(type) {
  if (!soundEnabled || !sounds.context || prefersReducedMotion) return;

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
}

function bindSounds() {
  $$('[data-sound]').forEach(function(el) {
    el.addEventListener('click', function() {
      playSound(el.dataset.sound);
    });
  });
}

// =============================================================================
// ACCESSIBILITY HELPERS
// =============================================================================

function announceToScreenReader(message) {
  var announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(function() { document.body.removeChild(announcement); }, 1000);
}

function trapFocus(element) {
  var focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  var first = focusable[0];
  var last = focusable[focusable.length - 1];

  function handleTab(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  element.addEventListener('keydown', handleTab);
  return function() { element.removeEventListener('keydown', handleTab); };
}

// =============================================================================
// CUSTOM CURSOR WITH TRAIL
// =============================================================================

function initCursor() {
  if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

  var cursor = $('#cursor');
  var cursorTrail = $('#cursorTrail');
  var cursorLabel = $('#cursorLabel');
  if (!cursor) return;

  var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  var trailX = 0, trailY = 0;
  var moveTimeout;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('visible');
    
    if (cursorTrail) cursorTrail.classList.add('visible');
    
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(function() {
      if (cursorTrail) cursorTrail.classList.remove('visible');
    }, 100);
  }, { passive: true });

  document.addEventListener('mouseleave', function() {
    cursor.classList.remove('visible');
    if (cursorTrail) cursorTrail.classList.remove('visible');
    if (cursorLabel) cursorLabel.classList.remove('visible');
  });

  function animate() {
    cursorX = lerp(cursorX, mouseX, 0.15);
    cursorY = lerp(cursorY, mouseY, 0.15);
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    if (cursorLabel) {
      cursorLabel.style.left = cursorX + 'px';
      cursorLabel.style.top = cursorY + 'px';
    }
    
    if (cursorTrail) {
      trailX = lerp(trailX, mouseX, 0.08);
      trailY = lerp(trailY, mouseY, 0.08);
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
    }
    
    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('mouseover', function(e) {
    var target = e.target.closest('a, button');
    var photoTarget = e.target.closest('.photo-item, .stack-card, .travel-postcard');
    var labelTarget = e.target.closest('[data-cursor-label]');

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
      if (cursorLabel) cursorLabel.classList.remove('visible');
    }
  });

  document.addEventListener('mouseout', function(e) {
    var target = e.target.closest('a, button, .photo-item, .stack-card, .travel-postcard, [data-cursor-label]');
    if (target) {
      cursor.classList.remove('hover', 'photo-hover');
      if (cursorLabel) cursorLabel.classList.remove('visible');
    }
  });
}

// =============================================================================
// 3D TILT EFFECT
// =============================================================================

function initTiltEffect() {
  if (prefersReducedMotion) return;

  $$('[data-tilt]').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      
      var rotateX = (y - centerY) / 20;
      var rotateY = (centerX - x) / 20;
      
      el.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
    });

    el.addEventListener('mouseleave', function() {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// =============================================================================
// MAGNETIC BUTTONS
// =============================================================================

function initMagneticButtons() {
  if (prefersReducedMotion) return;

  $$('[data-magnetic]').forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });

    btn.addEventListener('mouseleave', function() {
      btn.style.transform = 'translate(0, 0)';
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
    var scrollY = window.scrollY;
    if (header) header.classList.toggle('scrolled', scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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
  var removeTrapFocus = null;

  function open() {
    if (menu) {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
    }
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      var firstLink = $('nav a', menu);
      if (firstLink) firstLink.focus();
    }, 100);
    if (menu) removeTrapFocus = trapFocus(menu);
    announceToScreenReader('Navigation menu opened');
  }

  function close() {
    if (menu) {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    }
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (openBtn) openBtn.focus();
    if (removeTrapFocus) { removeTrapFocus(); removeTrapFocus = null; }
    announceToScreenReader('Navigation menu closed');
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
var lastFocusedElement = null;
var removeLightboxTrapFocus = null;
var lightboxTouchStartX = 0;

function initLightbox() {
  var lightbox = $('#lightbox');
  var img = $('#lightboxImg');
  var caption = $('#lightboxCaption');
  var counter = $('#lightboxCounter');
  var loading = $('.lightbox-loading', lightbox);

  function showLoading() { if (loading) loading.classList.add('visible'); }
  function hideLoading() { if (loading) loading.classList.remove('visible'); }

  function open(index, opener) {
    currentPhotoIndex = index;
    lastFocusedElement = opener || document.activeElement;
    showLoading();
    
    var newImg = new Image();
    newImg.onload = function() {
      img.src = PHOTOS[index].src;
      img.alt = PHOTOS[index].alt;
      hideLoading();
    };
    newImg.onerror = function() { hideLoading(); img.alt = 'Failed to load image'; };
    newImg.src = PHOTOS[index].src;
    
    caption.textContent = PHOTOS[index].caption;
    if (counter) counter.textContent = (index + 1) + ' / ' + PHOTOS.length;
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(function() {
      var closeBtn = $('.lightbox-close', lightbox);
      if (closeBtn) closeBtn.focus();
    }, 100);
    if (lightbox) removeLightboxTrapFocus = trapFocus(lightbox);
    
    playSound('whoosh');
    announceToScreenReader('Photo ' + (index + 1) + ' of ' + PHOTOS.length + ': ' + PHOTOS[index].caption);
  }

  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
    if (removeLightboxTrapFocus) { removeLightboxTrapFocus(); removeLightboxTrapFocus = null; }
  }

  function navigate(dir) {
    currentPhotoIndex = (currentPhotoIndex + dir + PHOTOS.length) % PHOTOS.length;
    showLoading();
    
    var newImg = new Image();
    newImg.onload = function() {
      img.src = PHOTOS[currentPhotoIndex].src;
      img.alt = PHOTOS[currentPhotoIndex].alt;
      hideLoading();
    };
    newImg.src = PHOTOS[currentPhotoIndex].src;
    
    caption.textContent = PHOTOS[currentPhotoIndex].caption;
    if (counter) counter.textContent = (currentPhotoIndex + 1) + ' / ' + PHOTOS.length;
    
    playSound('whoosh');
    announceToScreenReader('Photo ' + (currentPhotoIndex + 1) + ' of ' + PHOTOS.length + ': ' + PHOTOS[currentPhotoIndex].caption);
  }

  var closeBtn = $('.lightbox-close', lightbox);
  var prevBtn = $('.lightbox-prev', lightbox);
  var nextBtn = $('.lightbox-next', lightbox);
  
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', function() { navigate(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { navigate(1); });
  if (lightbox) lightbox.addEventListener('click', function(e) { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  var imgContainer = $('.lightbox-img-container', lightbox);
  if (imgContainer) {
    imgContainer.addEventListener('touchstart', function(e) {
      lightboxTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    imgContainer.addEventListener('touchend', function(e) {
      var diff = e.changedTouches[0].clientX - lightboxTouchStartX;
      if (Math.abs(diff) > 50) navigate(diff > 0 ? -1 : 1);
    }, { passive: true });
  }

  window.openLightbox = open;
}

// =============================================================================
// PHOTO STACK (Hero)
// =============================================================================

function PhotoStack(container, photos) {
  this.container = container;
  this.photos = photos;
  this.currentIndex = 0;
  this.isDragging = false;
  this.startX = 0;
  this.deltaX = 0;
  this.hintHidden = false;
  this.cards = [];
  this.hint = null;
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
    card.setAttribute('tabindex', i === 0 ? '0' : '-1');
    
    var dotsHTML = self.photos.map(function(_, j) {
      return '<span ' + (j === 0 ? 'class="active"' : '') + '></span>';
    }).join('');
    
    card.innerHTML = 
      '<img src="' + photo.src + '" alt="' + photo.alt + '" draggable="false" loading="' + (i === 0 ? 'eager' : 'lazy') + '" />' +
      '<div class="stack-card-footer">' +
        '<span class="stack-card-caption">' + photo.caption + '</span>' +
        '<div class="stack-card-dots" aria-hidden="true">' + dotsHTML + '</div>' +
      '</div>';
    track.appendChild(card);
  });

  var hint = document.createElement('div');
  hint.className = 'stack-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.innerHTML = '<span>Swipe or tap to browse</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

  this.container.innerHTML = '';
  this.container.appendChild(track);
  this.container.appendChild(hint);
  this.cards = $$('.stack-card', track);
  this.hint = hint;
  this.updatePositions();
};

PhotoStack.prototype.hideHint = function() {
  if (!this.hintHidden && this.hint) {
    this.hint.classList.add('hidden');
    this.hintHidden = true;
  }
};

PhotoStack.prototype.updatePositions = function() {
  var self = this;
  this.cards.forEach(function(card, i) {
    var offset = (i - self.currentIndex + self.photos.length) % self.photos.length;
    
    if (offset === 0) {
      card.dataset.position = '0';
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-current', 'true');
    } else if (offset === 1) {
      card.dataset.position = '1';
      card.setAttribute('tabindex', '-1');
      card.setAttribute('aria-current', 'false');
    } else if (offset === self.photos.length - 1) {
      card.dataset.position = '2';
      card.setAttribute('tabindex', '-1');
      card.setAttribute('aria-current', 'false');
    } else {
      card.dataset.position = 'hidden';
      card.setAttribute('tabindex', '-1');
      card.setAttribute('aria-current', 'false');
    }

    $$('.stack-card-dots span', card).forEach(function(dot, j) {
      dot.classList.toggle('active', j === self.currentIndex);
    });
  });
};

PhotoStack.prototype.next = function() { 
  this.currentIndex = (this.currentIndex + 1) % this.photos.length; 
  this.updatePositions();
  this.hideHint();
  playSound('whoosh');
};

PhotoStack.prototype.prev = function() { 
  this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length; 
  this.updatePositions();
  this.hideHint();
  playSound('whoosh');
};

PhotoStack.prototype.bindEvents = function() {
  var self = this;
  
  this.cards.forEach(function(card) {
    card.addEventListener('click', function() {
      if (card.dataset.position === '0') {
        window.openLightbox(parseInt(card.dataset.index, 10), card);
      } else {
        self.next();
      }
    });
    
    card.addEventListener('mousedown', function(e) { self.onDragStart(e); });
    card.addEventListener('touchstart', function(e) { self.onDragStart(e); }, { passive: true });
  });

  document.addEventListener('mousemove', function(e) { self.onDragMove(e); }, { passive: true });
  document.addEventListener('touchmove', function(e) { self.onDragMove(e); }, { passive: true });
  document.addEventListener('mouseup', function() { self.onDragEnd(); });
  document.addEventListener('touchend', function() { self.onDragEnd(); });

  this.container.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') { self.prev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { self.next(); e.preventDefault(); }
  });
};

PhotoStack.prototype.onDragStart = function(e) {
  this.isDragging = true;
  this.startX = e.type.indexOf('mouse') !== -1 ? e.clientX : e.touches[0].clientX;
};

PhotoStack.prototype.onDragMove = function(e) {
  if (!this.isDragging) return;
  var x = e.type.indexOf('mouse') !== -1 ? e.clientX : e.touches[0].clientX;
  this.deltaX = x - this.startX;
};

PhotoStack.prototype.onDragEnd = function() {
  if (!this.isDragging) return;
  this.isDragging = false;
  if (this.deltaX > 60) this.prev();
  else if (this.deltaX < -60) this.next();
  this.deltaX = 0;
};

// =============================================================================
// RENDER FUNCTIONS
// =============================================================================

function renderPhotoGrid() {
  var container = $('#photoGrid');
  if (!container) return;

  var displayPhotos = PHOTOS.slice(0, 4);

  container.innerHTML = displayPhotos.map(function() {
    return '<div class="photo-item skeleton" role="listitem"></div>';
  }).join('');

  var photoItems = $$('.photo-item', container);
  
  displayPhotos.forEach(function(photo, i) {
    var item = photoItems[i];
    var img = new Image();
    
    img.onload = function() {
      item.innerHTML = 
        '<img src="' + photo.src + '" alt="' + photo.alt + '" loading="lazy" />' +
        '<div class="photo-item-overlay"></div>' +
        '<span class="photo-item-caption">' + photo.caption + '</span>';
      item.classList.remove('skeleton');
      item.dataset.index = i;
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'View photo: ' + photo.caption);
      
      item.addEventListener('click', function() { window.openLightbox(parseInt(item.dataset.index, 10), item); });
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.openLightbox(parseInt(item.dataset.index, 10), item);
        }
      });
    };
    
    img.onerror = function() {
      item.innerHTML = '<span class="photo-item-caption">Failed to load</span>';
      item.classList.remove('skeleton');
    };
    
    img.src = photo.src;
  });

  var countEl = $('#photoCount');
  if (countEl) countEl.textContent = PHOTOS.length + '+ photos';
}

function renderArticles() {
  var container = $('#articleGrid');
  if (!container) return;

  container.innerHTML = ARTICLES.map(function(article) {
    return '<a href="' + article.url + '" class="article-card" role="listitem">' +
      '<div>' +
        '<div class="article-card-topic">' + article.topic + '</div>' +
        '<h3 class="article-card-title">' + article.title + '</h3>' +
      '</div>' +
      '<div class="article-card-footer">' +
        '<span class="article-card-date">' + article.date + '</span>' +
        '<span class="article-card-arrow" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M7 17L17 7M17 7H7M17 7v10"/>' +
          '</svg>' +
        '</span>' +
      '</div>' +
    '</a>';
  }).join('');
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
      '<a href="/steps.html" class="steps-history-btn">' +
        'See step history' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<path d="M5 12h14M12 5l7 7-7 7"/>' +
        '</svg>' +
      '</a>' +
    '</div>';
}

function renderTravels() {
  var container = $('#travelGrid');
  if (!container) return;

  container.innerHTML = TRAVELS.map(function(travel) {
    return '<a href="' + travel.url + '" class="travel-postcard" role="listitem" rel="noopener">' +
      '<div class="travel-postcard-frame">' +
        '<div class="travel-postcard-photo">' +
          '<div class="travel-postcard-bg" style="background-image: url(\'' + travel.photo + '\')"></div>' +
          '<div class="travel-postcard-overlay"></div>' +
          '<div class="travel-postcard-content">' +
            '<h3 class="travel-postcard-title">' + travel.title + '</h3>' +
            '<p class="travel-postcard-meta">' + travel.year + ' · ' + travel.meta + '</p>' +
          '</div>' +
          '<div class="travel-postcard-wish">Wish you were here...</div>' +
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
  }).join('');
}

function renderInto() {
  var musicList = $('#musicList');
  var bookList = $('#bookList');
  var tvList = $('#tvList');

  if (musicList) {
    musicList.innerHTML = MUSIC.map(function(item) {
      return '<a href="' + item.url + '" target="_blank" rel="noopener noreferrer" class="into-item" role="listitem">' +
        '<div class="into-cover"><img src="' + item.cover + '" alt="" loading="lazy" /></div>' +
        '<div class="into-text">' +
          '<div class="into-title">' + item.title + '</div>' +
          '<div class="into-meta">' + item.artist + '</div>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  if (bookList) {
    bookList.innerHTML = BOOKS.map(function(item) {
      return '<a href="' + item.url + '" target="_blank" rel="noopener noreferrer" class="into-item" role="listitem">' +
        '<div class="into-cover"><img src="' + item.cover + '" alt="" loading="lazy" /></div>' +
        '<div class="into-text">' +
          '<div class="into-title">' + item.title + '</div>' +
          '<div class="into-meta">' + item.author + '</div>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  if (tvList) {
    tvList.innerHTML = TV.map(function(item) {
      return '<a href="' + item.url + '" target="_blank" rel="noopener noreferrer" class="into-item" role="listitem">' +
        '<div class="into-cover"><img src="' + item.cover + '" alt="" loading="lazy" /></div>' +
        '<div class="into-text">' +
          '<div class="into-title">' + item.title + '</div>' +
          '<div class="into-meta">' + item.year + '</div>' +
        '</div>' +
      '</a>';
    }).join('');
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
  var sections = $$('section');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  sections.forEach(function(section) {
    section.classList.add('reveal');
    observer.observe(section);
  });
}

// =============================================================================
// KONAMI CODE EASTER EGG
// =============================================================================

function initKonamiCode() {
  var konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  var konamiIndex = 0;

  document.addEventListener('keydown', function(e) {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;
      
      if (konamiIndex === konamiCode.length) {
        triggerEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

function triggerEasterEgg() {
  var overlay = document.createElement('div');
  overlay.className = 'easter-egg-overlay';
  overlay.innerHTML = 
    '<div class="easter-egg-content">' +
      '<div class="easter-egg-emoji">🎉</div>' +
      '<div class="easter-egg-text">You found the secret!</div>' +
    '</div>';
  document.body.appendChild(overlay);
  
  requestAnimationFrame(function() {
    overlay.classList.add('active');
  });
  
  if (soundEnabled && sounds.context) {
    var ctx = sounds.context;
    var notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.value = 0.1;
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  }
  
  setTimeout(function() {
    overlay.classList.remove('active');
    setTimeout(function() { overlay.remove(); }, 500);
  }, 2000);
}

// =============================================================================
// KEYBOARD SHORTCUTS
// =============================================================================

function initKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
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
// ERROR HANDLING
// =============================================================================

function initErrorHandling() {
  document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
      console.warn('Image failed to load:', e.target.src);
      e.target.style.opacity = '0.3';
    }
  }, true);
}

// =============================================================================
// INIT
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
  initErrorHandling();
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

  initCursor();
  initMagneticButtons();
  initTiltEffect();
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
  
  initKonamiCode();
  initKeyboardShortcuts();
});

document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    document.body.classList.add('page-hidden');
  } else {
    document.body.classList.remove('page-hidden');
  }
});
