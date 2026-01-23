/**
 * ZINO ASAMAIGE - Shared JavaScript
 * Common functionality for all pages
 * Version: 2.0.0
 */

'use strict';

// =============================================================================
// UTILITIES
// =============================================================================

function $(sel, ctx) {
  return (ctx || document).querySelector(sel);
}

function $$(sel, ctx) {
  return Array.from((ctx || document).querySelectorAll(sel));
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

// =============================================================================
// THEME MANAGEMENT
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
}

function updateThemeColorMeta(theme) {
  var metas = document.querySelectorAll('meta[name="theme-color"]');
  metas.forEach(function(meta) {
    if (!meta.getAttribute('media')) {
      meta.setAttribute('content', theme === 'dark' ? '#0A0A0A' : '#FAFAFA');
    }
  });
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
// FOCUS TRAP - For accessible modals
// =============================================================================

var FocusTrap = {
  activeElement: null,
  container: null,
  
  activate: function(container) {
    this.container = container;
    this.activeElement = document.activeElement;
    
    // Find all focusable elements
    var focusable = this.getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
    
    // Add event listener
    document.addEventListener('keydown', this.handleKeyDown);
  },
  
  deactivate: function() {
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Restore focus to previously focused element
    if (this.activeElement && this.activeElement.focus) {
      this.activeElement.focus();
    }
    
    this.container = null;
    this.activeElement = null;
  },
  
  getFocusableElements: function(container) {
    var selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(container.querySelectorAll(selector)).filter(function(el) {
      return el.offsetParent !== null; // Only visible elements
    });
  },
  
  handleKeyDown: function(e) {
    if (e.key !== 'Tab' || !FocusTrap.container) return;
    
    var focusable = FocusTrap.getFocusableElements(FocusTrap.container);
    if (focusable.length === 0) return;
    
    var firstFocusable = focusable[0];
    var lastFocusable = focusable[focusable.length - 1];
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }
};

// =============================================================================
// MOBILE MENU
// =============================================================================

function initMobileMenu() {
  var menu = $('#mobileMenu');
  var menuBtn = $('#mobileMenuBtn');
  var closeBtn = $('#mobileMenuClose');
  
  if (!menu || !menuBtn) return;
  
  function openMenu() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Activate focus trap
    FocusTrap.activate(menu);
  }
  
  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    // Deactivate focus trap
    FocusTrap.deactivate();
  }
  
  menuBtn.addEventListener('click', openMenu);
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }
  
  // Close on link click
  $$('nav a', menu).forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
  
  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
  
  // Close on backdrop click
  menu.addEventListener('click', function(e) {
    if (e.target === menu) {
      closeMenu();
    }
  });
}

// =============================================================================
// HEADER SCROLL BEHAVIOR
// =============================================================================

function initHeader() {
  var header = $('#header');
  if (!header) return;
  
  var scrolled = false;
  
  function handleScroll() {
    var shouldBeScrolled = window.scrollY > 50;
    if (shouldBeScrolled !== scrolled) {
      scrolled = shouldBeScrolled;
      header.classList.toggle('scrolled', scrolled);
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

// =============================================================================
// THEME TOGGLE BUTTONS
// =============================================================================

function initThemeToggle() {
  var toggles = $$('#themeToggle, #mobileThemeToggle, #mobileMenuThemeToggle');
  toggles.forEach(function(btn) {
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  });
}

// =============================================================================
// BACK TO TOP BUTTON
// =============================================================================

function initBackToTop() {
  var btn = $('#backToTop');
  if (!btn) return;
  
  function handleScroll() {
    var visible = window.scrollY > 300;
    btn.classList.toggle('visible', visible);
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =============================================================================
// SCROLL ANIMATIONS (Intersection Observer)
// =============================================================================

function initScrollAnimations() {
  var observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements with animation classes
  $$('.reveal, .about-card, .closing-text, .year-stat, .month-card').forEach(function(el) {
    observer.observe(el);
  });
}

// =============================================================================
// REDUCED MOTION CHECK
// =============================================================================

function checkReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.reveal, .about-card, .closing-text, .year-stat, .month-card, .hero-title .line-inner, .hero-text, .hero-ctas, .hero-visual').forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('visible');
    });
  }
}

// =============================================================================
// SERVICE WORKER REGISTRATION
// =============================================================================

function registerServiceWorker() {
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
}

// =============================================================================
// INITIALIZE COMMON FUNCTIONALITY
// =============================================================================

function initCommon() {
  initTheme();
  initSystemThemeListener();
  initThemeToggle();
  initHeader();
  initMobileMenu();
  initBackToTop();
  initScrollAnimations();
  checkReducedMotion();
  registerServiceWorker();
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCommon);
} else {
  initCommon();
}

// Export for use in page-specific scripts
window.ZinoUtils = {
  $: $,
  $$: $$,
  storage: storage,
  toggleTheme: toggleTheme,
  FocusTrap: FocusTrap
};
