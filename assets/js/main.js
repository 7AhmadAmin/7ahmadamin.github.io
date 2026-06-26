/* ============================================
   CANOO PORTFOLIO — MAIN JS (with scroll glow for .nav-name)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const langToggles = document.querySelectorAll('.lang-btn');
  const emailCopy = document.getElementById('emailCopy');
  const showMore = document.getElementById('showMore');
  const showMoreNews = document.getElementById('showMoreNews');
  const toast = document.getElementById('toast');
  const body = document.body;
  const navName = document.querySelector('.nav-name');
  const dockToggle = document.getElementById('dockToggle');
  const sideDock = document.getElementById('sideDock');

  let isZh = false;
  let scrollTimer = null;

  // Helper to add/remove scrolling class on nav-name
  function addScrollingClass() {
    if (!navName) return;
    navName.classList.add('nav-name-scrolling');
  }
  function removeScrollingClass() {
    if (!navName) return;
    navName.classList.remove('nav-name-scrolling');
  }

  // Language toggle (works for both desktop and mobile buttons)
  langToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      isZh = !isZh;
      body.classList.toggle('lang-zh', isZh);
      const label = isZh ? '中 / EN' : 'EN / 中';
      langToggles.forEach(b => b.textContent = label);
    });
  });

  // Nav scroll effect (background blur)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ========== SCROLL GLOW FOR NAME ==========
  window.addEventListener('scroll', () => {
    addScrollingClass();
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      removeScrollingClass();
    }, 200);
  });

  window.addEventListener('scrollend', () => {
    removeScrollingClass();
    if (scrollTimer) clearTimeout(scrollTimer);
  });

  // ========== DOCK TOGGLE (mobile) ==========
  if (dockToggle && sideDock) {
    dockToggle.addEventListener('click', () => {
      const expanded = sideDock.classList.toggle('expanded');
      dockToggle.setAttribute('aria-expanded', expanded);
    });

    // Close dock when clicking a social link (mobile)
    sideDock.querySelectorAll('.dock-links a').forEach(link => {
      link.addEventListener('click', () => {
        sideDock.classList.remove('expanded');
        dockToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dock when clicking outside
    document.addEventListener('click', (e) => {
      if (!sideDock.contains(e.target)) {
        sideDock.classList.remove('expanded');
        dockToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Email copy
  if (emailCopy) {
    emailCopy.addEventListener('click', () => {
      const email = emailCopy.dataset.email;
      navigator.clipboard.writeText(email).then(() => {
        showToast(isZh ? '已复制邮箱地址' : 'EMAIL COPIED');
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(isZh ? '已复制邮箱地址' : 'EMAIL COPIED');
      });
    });
  }

  // Show more publications
  if (showMore) {
    showMore.addEventListener('click', () => {
      const parent = showMore.closest('section');
      parent.classList.toggle('show-all');
      const en = showMore.querySelector('.en');
      const zh = showMore.querySelector('.zh');
      if (parent.classList.contains('show-all')) {
        if (en) en.textContent = '- SHOW LESS';
        if (zh) zh.textContent = '- 收起';
      } else {
        if (en) en.textContent = '+ SHOW MORE PUBLICATIONS';
        if (zh) zh.textContent = '+ 显示更多论文';
      }
    });
  }

  // Show more news
  if (showMoreNews) {
    showMoreNews.addEventListener('click', () => {
      const parent = showMoreNews.closest('section');
      parent.classList.toggle('show-all');
      const en = showMoreNews.querySelector('.en');
      const zh = showMoreNews.querySelector('.zh');
      if (parent.classList.contains('show-all')) {
        if (en) en.textContent = '- SHOW LESS';
        if (zh) zh.textContent = '- 收起';
      } else {
        if (en) en.textContent = '+ SHOW MORE NEWS';
        if (zh) zh.textContent = '+ 显示更多动态';
      }
    });
  }

  // Toast helper
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
