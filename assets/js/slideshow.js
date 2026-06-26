/* ============================================
   SLIDESHOW.JS — Isolated slideshow functionality
   Only attaches to elements within .slideshow-container
   Safe to include on any page without side effects
   ============================================ */

(function() {
  'use strict';

  // Only initialize if slideshow container exists
  const container = document.getElementById('slideshowContainer');
  if (!container) return;

  const slides = container.querySelectorAll('.slide');
  const thumbs = container.querySelectorAll('.thumb');
  const prevBtn = document.getElementById('ssPrev');
  const nextBtn = document.getElementById('ssNext');
  const fullscreenBtn = document.getElementById('ssFullscreen');
  const currentEl = document.getElementById('ssCurrent');
  const totalEl = document.getElementById('ssTotal');

  if (!slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Initialize total counter
  if (totalEl) totalEl.textContent = totalSlides;

  // ========== Core Navigation ==========

  function goToSlide(index) {
    // Bounds check
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    // Remove active from current
    slides[currentIndex].classList.remove('active');
    if (thumbs[currentIndex]) thumbs[currentIndex].classList.remove('active');

    // Set new current
    currentIndex = index;
    slides[currentIndex].classList.add('active');
    if (thumbs[currentIndex]) thumbs[currentIndex].classList.add('active');

    // Update counter
    if (currentEl) currentEl.textContent = currentIndex + 1;

    // Scroll thumbnail into view
    if (thumbs[currentIndex]) {
      thumbs[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    // Scroll slide content to top
    slides[currentIndex].scrollTop = 0;
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // ========== Event Listeners ==========

  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  // Thumbnail clicks
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => goToSlide(index));
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Only respond if slideshow is in viewport or fullscreen
    const rect = container.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    const isFullscreen = container.classList.contains('is-fullscreen');

    if (!isVisible && !isFullscreen) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case 'Escape':
        if (isFullscreen) {
          exitFullscreen();
        }
        break;
      case 'f':
      case 'F':
        if (e.ctrlKey || e.metaKey) return; // Don't intercept Ctrl+F
        toggleFullscreen();
        break;
    }
  });

  // ========== Fullscreen ==========

  function toggleFullscreen() {
    const isFullscreen = container.classList.contains('is-fullscreen');

    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }

  function enterFullscreen() {
    container.classList.add('is-fullscreen');
    document.body.style.overflow = 'hidden';

    if (fullscreenBtn) {
      // Update icon to "exit fullscreen"
      fullscreenBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      `;
      fullscreenBtn.setAttribute('aria-label', 'Exit fullscreen');
    }
  }

  function exitFullscreen() {
    container.classList.remove('is-fullscreen');
    document.body.style.overflow = '';

    if (fullscreenBtn) {
      // Update icon to "enter fullscreen"
      fullscreenBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      `;
      fullscreenBtn.setAttribute('aria-label', 'Toggle fullscreen');
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Handle browser fullscreen API if user presses F11
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      // Browser exited fullscreen, sync our state
      if (container.classList.contains('is-fullscreen')) {
        exitFullscreen();
      }
    }
  });

  // ========== Touch / Swipe Support ==========

  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < minSwipeDistance) return;

    if (swipeDistance < 0) {
      // Swipe left → next
      nextSlide();
    } else {
      // Swipe right → previous
      prevSlide();
    }
  }

  // ========== Auto-focus on scroll into view ==========

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Slideshow is visible, enable keyboard nav
        container.setAttribute('tabindex', '-1');
      }
    });
  }, { threshold: 0.3 });

  observer.observe(container);

  // ========== Initialize ==========

  // Ensure first slide is active
  goToSlide(0);

  console.log(`Slideshow initialized: ${totalSlides} slides`);

})();