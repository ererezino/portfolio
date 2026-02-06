'use strict';

// =============================================================================
// DEFERRED FEATURES - Loaded after initial render for better performance
// Depends on: $, $$, PHOTOS, ScrollManager, prefersReducedMotion, storage,
//             getThumbSrc, getWebpSrc, getAvifSrc, createFocusTrap
// =============================================================================

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
  var previousActiveElement = null;
  var focusTrap = createFocusTrap(lightbox);

  function open(index) {
    currentPhotoIndex = index;
    previousActiveElement = document.activeElement;

    if (img) {
      img.src = getWebpSrc(PHOTOS[index].src);
      img.alt = PHOTOS[index].alt;
    }
    if (caption) caption.textContent = PHOTOS[index].caption;
    if (counter) counter.textContent = (index + 1) + ' / ' + PHOTOS.length;

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    focusTrap.activate();
      }

  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    focusTrap.deactivate();

    if (previousActiveElement) {
      previousActiveElement.focus();
      previousActiveElement = null;
    }
  }

  function navigate(dir) {
    currentPhotoIndex = (currentPhotoIndex + dir + PHOTOS.length) % PHOTOS.length;
    if (img) {
      img.src = getWebpSrc(PHOTOS[currentPhotoIndex].src);
      img.alt = PHOTOS[currentPhotoIndex].alt;
    }
    if (caption) caption.textContent = PHOTOS[currentPhotoIndex].caption;
    if (counter) counter.textContent = (currentPhotoIndex + 1) + ' / ' + PHOTOS.length + ' — ' + PHOTOS[currentPhotoIndex].alt;
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

  // Touch gestures: swipe + pinch-to-zoom
  if (img) {
    img.style.touchAction = 'none';

    var zoomScale = 1, lastZoomScale = 1;
    var zoomPanX = 0, zoomPanY = 0, lastZPanX = 0, lastZPanY = 0;
    var touchStartX = 0, touchStartY = 0;
    var pinching = false, swiping = false, initDist = 0;

    function dist(t) {
      var dx = t[0].clientX - t[1].clientX;
      var dy = t[0].clientY - t[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function applyZoom() {
      img.style.transform = 'translate(' + zoomPanX + 'px, ' + zoomPanY + 'px) scale(' + zoomScale + ')';
    }

    function resetZoom() {
      zoomScale = 1; lastZoomScale = 1;
      zoomPanX = 0; zoomPanY = 0; lastZPanX = 0; lastZPanY = 0;
      img.style.transform = '';
      img.style.transition = '';
    }

    lightbox.addEventListener('touchstart', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.touches.length === 2) {
        pinching = true; swiping = false;
        initDist = dist(e.touches);
        lastZoomScale = zoomScale;
        lastZPanX = zoomPanX; lastZPanY = zoomPanY;
        img.style.transition = 'none';
        e.preventDefault();
      } else if (e.touches.length === 1 && zoomScale <= 1) {
        swiping = true; pinching = false;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      } else if (e.touches.length === 1 && zoomScale > 1) {
        swiping = false; pinching = false;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        lastZPanX = zoomPanX; lastZPanY = zoomPanY;
        img.style.transition = 'none';
        e.preventDefault();
      }
    }, { passive: false });

    lightbox.addEventListener('touchmove', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (pinching && e.touches.length === 2) {
        zoomScale = Math.min(Math.max(lastZoomScale * (dist(e.touches) / initDist), 1), 4);
        applyZoom();
        e.preventDefault();
      } else if (!pinching && e.touches.length === 1 && zoomScale > 1) {
        zoomPanX = lastZPanX + (e.touches[0].clientX - touchStartX);
        zoomPanY = lastZPanY + (e.touches[0].clientY - touchStartY);
        applyZoom();
        e.preventDefault();
      }
    }, { passive: false });

    lightbox.addEventListener('touchend', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (pinching) {
        pinching = false;
        lastZoomScale = zoomScale;
        if (zoomScale <= 1.05) resetZoom();
        return;
      }
      if (swiping && e.changedTouches.length === 1) {
        swiping = false;
        var dx = touchStartX - e.changedTouches[0].clientX;
        var dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          resetZoom();
          navigate(dx > 0 ? 1 : -1);
        }
        if (dy < -80 && Math.abs(dy) > Math.abs(dx)) {
          resetZoom();
          close();
        }
      }
      if (zoomScale > 1) { lastZPanX = zoomPanX; lastZPanY = zoomPanY; }
    }, { passive: true });

    // Double-tap to zoom
    var lastTapTime = 0;
    img.addEventListener('touchend', function(e) {
      var now = Date.now();
      if (now - lastTapTime < 300) {
        e.preventDefault();
        if (zoomScale > 1) {
          img.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          resetZoom();
        } else {
          zoomScale = 2.5; lastZoomScale = zoomScale;
          img.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          applyZoom();
        }
      }
      lastTapTime = now;
    });

    // Reset zoom on navigate/close
    var origNav = navigate;
    navigate = function(dir) { resetZoom(); origNav(dir); };
    var origClose = close;
    close = function() { resetZoom(); origClose(); };
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
  this.cards = [];
  this.render();
  this.bindEvents();
}

PhotoStack.prototype.render = function() {
  var self = this;

  var stack = document.createElement('div');
  stack.className = 'photo-stack';

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

    var thumbPath = getThumbSrc(photo.src);
    var thumbWebpPath = getWebpSrc(thumbPath);
    var fullWebpPath = getWebpSrc(photo.src);
    var thumbAvifPath = getAvifSrc(thumbPath);
    var fullAvifPath = getAvifSrc(photo.src);
    card.innerHTML =
      '<picture>' +
        '<source type="image/avif" srcset="' + thumbAvifPath + ' 600w, ' + fullAvifPath + ' 1200w" sizes="(max-width: 768px) 90vw, 400px">' +
        '<source type="image/webp" srcset="' + thumbWebpPath + ' 600w, ' + fullWebpPath + ' 1200w" sizes="(max-width: 768px) 90vw, 400px">' +
        '<img src="' + thumbPath + '" srcset="' + thumbPath + ' 600w, ' + photo.src + ' 1200w" sizes="(max-width: 768px) 90vw, 400px" alt="' + photo.alt + '" draggable="false" width="400" height="500" style="width:100%;height:100%;object-fit:cover;" />' +
      '</picture>' +
      '<div class="stack-card-footer">' +
        '<span class="stack-card-caption">' + photo.caption + '</span>' +
        '<div class="stack-card-dots" aria-hidden="true">' + dotsHTML + '</div>' +
      '</div>';
    track.appendChild(card);
  });

  var hint = document.createElement('div');
  hint.className = 'stack-hint';
  hint.innerHTML = '<span>Swipe or tap to browse</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

  stack.appendChild(track);

  this.container.innerHTML = '';
  this.container.appendChild(stack);
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
// MAGNETIC BUTTON EFFECT
// =============================================================================

function initMagneticButtons() {
  if (prefersReducedMotion) return;

  var magneticElements = $$('[data-magnetic]');

  magneticElements.forEach(function(el) {
    var strength = 0.3;
    var ease = 0.12;
    var currentX = 0;
    var currentY = 0;
    var targetX = 0;
    var targetY = 0;
    var isHovering = false;
    var animating = false;

    function animate() {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      el.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px)';

      var stillMoving = Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1;
      if (isHovering || stillMoving) {
        requestAnimationFrame(animate);
      } else {
        currentX = 0;
        currentY = 0;
        el.style.transform = '';
        animating = false;
      }
    }

    el.addEventListener('mouseenter', function() {
      isHovering = true;
      if (!animating) {
        animating = true;
        requestAnimationFrame(animate);
      }
    });

    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      targetX = (e.clientX - centerX) * strength;
      targetY = (e.clientY - centerY) * strength;
    });

    el.addEventListener('mouseleave', function() {
      isHovering = false;
      targetX = 0;
      targetY = 0;
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
  var konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
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

      }
}

// =============================================================================
// PAGE TRANSITIONS (View Transitions API)
// =============================================================================

function initPageTransitions() {
  if (!document.startViewTransition) return;

  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
    if (link.target === '_blank') return;

    e.preventDefault();

    document.startViewTransition(function() {
      window.location.href = href;
    });
  });
}

// =============================================================================
// ENHANCED SCROLL INDICATOR
// =============================================================================

function initScrollIndicator() {
  var indicator = $('.scroll-indicator');
  if (!indicator) return;

  ScrollManager.subscribe(function(scrollY) {
    var opacity = Math.max(0, 1 - (scrollY / 300));
    indicator.style.opacity = opacity;
    indicator.style.pointerEvents = scrollY > 300 ? 'none' : '';
  });
}

// =============================================================================
// HERO PARALLAX
// =============================================================================

function initHeroParallax() {
  if (prefersReducedMotion) return;
  var heroVisual = $('#heroPhotoStack');
  if (!heroVisual) return;

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var scrollY = window.scrollY;
        if (scrollY < 800) {
          var offset = scrollY * 0.08;
          heroVisual.style.transform = 'translateY(' + (-offset) + 'px)';
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
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

  var currentGreeting = greetingEl.textContent;

  if (greetingEl.dataset.scrambled) return;
  greetingEl.dataset.scrambled = 'true';

  var fx = new TextScramble(greetingEl);
  greetingEl.textContent = '';

  setTimeout(function() {
    fx.setText(currentGreeting);
  }, 800);
}

// =============================================================================
// ARTICLE HOVER PREVIEW
// =============================================================================

function initArticlePreview() {
  if (prefersReducedMotion) return;
  if (window.innerWidth < 768) return;

  var preview = document.createElement('div');
  preview.className = 'article-preview';
  preview.innerHTML = '<img src="" alt="" />';
  document.body.appendChild(preview);

  var img = preview.querySelector('img');
  var currentX = 0;
  var currentY = 0;
  var targetX = 0;
  var targetY = 0;
  var isVisible = false;
  var animating = false;
  var ease = 0.08;

  function animate() {
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    preview.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px)';

    var stillMoving = Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5;
    if (isVisible || stillMoving) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
    }
  }

  var cards = $$('.article-card-image-card');

  cards.forEach(function(card) {
    var cardImg = card.querySelector('.article-card-image img');
    if (!cardImg) return;

    var imageSrc = cardImg.getAttribute('src');

    card.addEventListener('mouseenter', function() {
      img.src = imageSrc;
      preview.classList.add('visible');
      isVisible = true;
      if (!animating) {
        animating = true;
        requestAnimationFrame(animate);
      }
    });

    card.addEventListener('mousemove', function(e) {
      targetX = e.clientX + 20;
      targetY = e.clientY - 60;
    });

    card.addEventListener('mouseleave', function() {
      preview.classList.remove('visible');
      isVisible = false;
    });
  });
}

// =============================================================================
// INIT DEFERRED FEATURES
// =============================================================================

(function() {
  initLightbox();

  var heroStack = $('#heroPhotoStack');
  if (heroStack) new PhotoStack(heroStack, PHOTOS.slice(0, 4));

  initMagneticButtons();
  initTiltEffect();
  initKonamiCode();
  initPageTransitions();
  initScrollIndicator();
  initHeroParallax();
  initTextScramble();
  initArticlePreview();
})();
