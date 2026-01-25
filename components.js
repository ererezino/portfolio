'use strict';

// =============================================================================
// COMPONENT SYSTEM
// Injects shared header, footer, and mobile menu across all pages
// =============================================================================

var Components = (function() {

  // Navigation links data
  var NAV_LINKS = [
    { href: '/about.html', text: 'About' },
    { href: '/photos/', text: 'Photos' },
    { href: '/articles/', text: 'Articles' },
    { href: '/movement.html', text: 'Movement' },
    { href: '/travels.html', text: 'Travels' },
    { href: '/contact.html', text: 'Contact' }
  ];

  // =============================================================================
  // HEADER COMPONENT
  // =============================================================================

  function renderHeader() {
    var currentPath = window.location.pathname;

    var navLinksHtml = NAV_LINKS.map(function(link) {
      var isActive = currentPath === link.href ||
                     (link.href !== '/' && currentPath.startsWith(link.href.replace('/index.html', '')));
      return '<a href="' + link.href + '" class="nav-link"' + (isActive ? ' aria-current="page"' : '') + '>' + link.text + '</a>';
    }).join('');

    return '<header id="header" role="banner">' +
      '<div class="header-inner">' +
        '<a href="/" class="logo" data-magnetic aria-label="Zino Asamaige - Home">' +
          '<img src="/assets/logo.png" alt="" class="logo-img" width="36" height="36" fetchpriority="high" />' +
          '<span class="logo-text">Zino Asamaige</span>' +
        '</a>' +
        '<nav class="header-nav" aria-label="Primary navigation">' +
          navLinksHtml +
          '<button class="theme-btn" id="themeToggle" aria-label="Toggle dark mode" data-magnetic data-sound="click" type="button">' +
            '<svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
            '<svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' +
          '</button>' +
        '</nav>' +
        '<div class="mobile-controls">' +
          '<button class="theme-btn" id="mobileThemeToggle" aria-label="Toggle dark mode" data-sound="click" type="button">' +
            '<svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
            '<svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>' +
          '</button>' +
          '<button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileMenu" type="button">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>';
  }

  // =============================================================================
  // MOBILE MENU COMPONENT
  // =============================================================================

  function renderMobileMenu() {
    var mobileNavLinksHtml = NAV_LINKS.map(function(link) {
      return '<a href="' + link.href + '">' + link.text + '</a>';
    }).join('');

    return '<div class="mobile-menu" id="mobileMenu" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Navigation menu">' +
      '<div class="mobile-menu-header">' +
        '<a href="/" class="logo">' +
          '<img src="/assets/logo.png" alt="" class="logo-img" width="32" height="32">' +
          'Zino' +
        '</a>' +
        '<div class="mobile-menu-actions">' +
          '<button class="mobile-menu-close" id="mobileMenuClose" aria-label="Close navigation menu" type="button">&times;</button>' +
        '</div>' +
      '</div>' +
      '<nav aria-label="Mobile navigation">' +
        mobileNavLinksHtml +
      '</nav>' +
    '</div>';
  }

  // =============================================================================
  // FOOTER COMPONENT
  // =============================================================================

  function renderFooter() {
    var currentYear = new Date().getFullYear();

    return '<footer role="contentinfo">' +
      '<div class="container footer-inner">' +
        '<div class="footer-main">' +
          '<span class="footer-copy">&copy; ' + currentYear + ' Zino Asamaige</span>' +
          '<nav class="footer-nav" aria-label="Footer navigation">' +
            '<a href="/about.html">About</a>' +
            '<a href="/photos/">Photos</a>' +
            '<a href="/articles/">Articles</a>' +
            '<a href="/contact.html">Contact</a>' +
          '</nav>' +
        '</div>' +
        '<div class="footer-meta">' +
          '<span class="footer-status">' +
            '<span class="location-dot" aria-hidden="true"></span>' +
            'Lagos, Nigeria' +
          '</span>' +
          '<div class="footer-social">' +
            '<a href="https://x.com/ererezino" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Follow on X (Twitter)">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
            '</a>' +
            '<a href="https://www.linkedin.com/in/ererezino/" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="Connect on LinkedIn">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  // =============================================================================
  // BACK TO TOP BUTTON
  // =============================================================================

  function renderBackToTop() {
    return '<button class="back-to-top" id="backToTop" type="button" aria-label="Back to top" data-sound="whoosh">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="M12 19V5M5 12l7-7 7 7"/>' +
      '</svg>' +
    '</button>';
  }

  // =============================================================================
  // SKIP LINK
  // =============================================================================

  function renderSkipLink() {
    return '<a class="skip-link" href="#main">Skip to content</a>';
  }

  // =============================================================================
  // LIGHTBOX COMPONENT
  // =============================================================================

  function renderLightbox() {
    return '<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Photo viewer">' +
      '<div class="lightbox-panel" role="document">' +
        '<button class="lightbox-close" type="button" aria-label="Close photo viewer">&times;</button>' +
        '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo">&#8249;</button>' +
        '<button class="lightbox-nav lightbox-next" type="button" aria-label="Next photo">&#8250;</button>' +
        '<div class="lightbox-img-container">' +
          '<img src="" alt="Loading photo..." id="lightboxImg" />' +
          '<div class="lightbox-loading" aria-hidden="true">' +
            '<div class="loader-spinner"></div>' +
          '</div>' +
        '</div>' +
        '<div class="lightbox-caption" id="lightboxCaption"></div>' +
        '<div class="lightbox-counter" id="lightboxCounter" aria-live="polite"></div>' +
      '</div>' +
    '</div>';
  }

  // =============================================================================
  // SOUND TOGGLE
  // =============================================================================

  function renderSoundToggle() {
    return '<button class="sound-toggle" id="soundToggle" aria-label="Toggle sound effects" title="Toggle sounds">' +
      '<svg class="sound-on" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>' +
        '<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>' +
      '</svg>' +
      '<svg class="sound-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>' +
        '<line x1="23" y1="9" x2="17" y2="15"/>' +
        '<line x1="17" y1="9" x2="23" y2="15"/>' +
      '</svg>' +
    '</button>';
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  function init(options) {
    options = options || {};

    var body = document.body;

    // Insert skip link at the beginning of body
    if (!document.querySelector('.skip-link')) {
      body.insertAdjacentHTML('afterbegin', renderSkipLink());
    }

    // Insert sound toggle after skip link if enabled
    if (options.soundToggle !== false && !document.querySelector('.sound-toggle')) {
      var skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.insertAdjacentHTML('afterend', renderSoundToggle());
      }
    }

    // Insert header after skip link/sound toggle
    if (!document.querySelector('header#header')) {
      var insertAfter = document.querySelector('.sound-toggle') || document.querySelector('.skip-link');
      if (insertAfter) {
        insertAfter.insertAdjacentHTML('afterend', renderHeader());
      } else {
        body.insertAdjacentHTML('afterbegin', renderHeader());
      }
    }

    // Insert mobile menu after header
    if (!document.querySelector('.mobile-menu')) {
      var header = document.querySelector('header#header');
      if (header) {
        header.insertAdjacentHTML('afterend', renderMobileMenu());
      }
    }

    // Insert lightbox if needed
    if (options.lightbox !== false && !document.querySelector('.lightbox')) {
      var mobileMenu = document.querySelector('.mobile-menu');
      if (mobileMenu) {
        mobileMenu.insertAdjacentHTML('afterend', renderLightbox());
      }
    }

    // Insert footer at the end of body (before scripts)
    if (!document.querySelector('footer')) {
      var main = document.querySelector('main');
      if (main) {
        main.insertAdjacentHTML('afterend', renderFooter());
      }
    }

    // Insert back to top button
    if (options.backToTop !== false && !document.querySelector('.back-to-top')) {
      var footer = document.querySelector('footer');
      if (footer) {
        footer.insertAdjacentHTML('afterend', renderBackToTop());
      }
    }
  }

  // Export public API
  return {
    init: init,
    renderHeader: renderHeader,
    renderMobileMenu: renderMobileMenu,
    renderFooter: renderFooter,
    renderLightbox: renderLightbox,
    renderBackToTop: renderBackToTop,
    renderSoundToggle: renderSoundToggle,
    NAV_LINKS: NAV_LINKS
  };
})();

// Auto-initialize if data-auto-init attribute is present
if (document.currentScript && document.currentScript.hasAttribute('data-auto-init')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      Components.init();
    });
  } else {
    Components.init();
  }
}
