'use strict';

// =============================================================================
// SHARED UTILITIES - Loaded by all pages except index.html (which uses script.js)
// =============================================================================

// Theme toggle
function toggleTheme() {
  var html = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  var next = isDark ? 'light' : 'dark';

  // Enable smooth theme transition
  html.classList.add('theme-transitioning');

  html.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch(e) {}

  // Update theme-color meta tags
  var metas = document.querySelectorAll('meta[name="theme-color"]');
  var color = next === 'dark' ? '#0A0A0A' : '#FAFAFA';
  metas.forEach(function(meta) { meta.setAttribute('content', color); });

  // Force repaint for browsers that don't repaint on data-attribute changes
  void document.body.offsetHeight;

  // Remove transition class after animation completes
  setTimeout(function() {
    html.classList.remove('theme-transitioning');
  }, 350);
}

// Mobile menu with focus trap and focus restoration
(function() {
  var menu = document.getElementById('mobileMenu');
  var openBtn = document.getElementById('mobileMenuBtn');
  var closeBtn = document.getElementById('mobileMenuClose');
  var previousActiveElement = null;

  if (!menu || !openBtn) return;

  function getFocusable() {
    return Array.prototype.slice.call(
      menu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function(el) { return !el.disabled && el.offsetParent !== null; });
  }

  function open() {
    previousActiveElement = document.activeElement;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var focusable = getFocusable();
    if (focusable.length > 0) focusable[0].focus();
  }

  function close() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (previousActiveElement) {
      previousActiveElement.focus();
      previousActiveElement = null;
    }
  }

  openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Close on link click or backdrop click
  menu.addEventListener('click', function(e) {
    if (e.target === menu || e.target.tagName === 'A') close();
  });

  // Keyboard: Escape to close + focus trap
  document.addEventListener('keydown', function(e) {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      var focusable = getFocusable();
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

// Theme toggle button bindings
(function() {
  var themeToggle = document.getElementById('themeToggle');
  var mobileThemeToggle = document.getElementById('mobileThemeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
})();

// Header scroll effect
(function() {
  var header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();
