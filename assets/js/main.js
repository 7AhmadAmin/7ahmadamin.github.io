const root = document.documentElement;
const body = document.body;
const themeBtn = document.getElementById('themeToggle');
const langBtn = document.getElementById('langToggle');
const showBtn = document.getElementById('showMore');
const pubList = document.querySelector('.pub-list');
const toast = document.getElementById('pageToast');

const storage = {
  get(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }
};

const savedTheme = storage.get('theme', 'dark');
const savedLang = storage.get('lang', 'en');
root.setAttribute('data-theme', savedTheme);
if (savedLang === 'zh') body.classList.add('lang-zh');

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function flashTheme() {
  body.classList.remove('theme-flash');
  void body.offsetWidth;
  body.classList.add('theme-flash');
  setTimeout(() => body.classList.remove('theme-flash'), 720);
}

themeBtn?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  storage.set('theme', next);
  flashTheme();
  showToast(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
});

langBtn?.addEventListener('click', () => {
  body.classList.toggle('lang-zh');
  const isZh = body.classList.contains('lang-zh');
  storage.set('lang', isZh ? 'zh' : 'en');
  showToast(isZh ? '中文模式已开启' : 'English mode enabled');
});

showBtn?.addEventListener('click', () => {
  if (!pubList) return;
  pubList.classList.toggle('show-all');
  const expanded = pubList.classList.contains('show-all');
  const en = showBtn.querySelector('.en');
  const zh = showBtn.querySelector('.zh');
  if (en) en.textContent = expanded ? 'Hide extra publications' : '+ Show more publications';
  if (zh) zh.textContent = expanded ? '隐藏更多论文' : '+ 显示更多论文';
  showToast(expanded ? 'More publications shown' : 'Extra publications hidden');
});

function wireCopyButtons() {
  document.querySelectorAll('[data-email]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email');
      if (!email) return;
      try {
        await navigator.clipboard.writeText(email);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      const mini = btn.querySelector('.copy-mini') || btn.querySelector('span:last-child');
      const old = mini ? mini.textContent : '';
      btn.classList.add('copy-done');
      if (mini) mini.textContent = body.classList.contains('lang-zh') ? '已复制' : 'COPIED';
      showToast(body.classList.contains('lang-zh') ? '邮箱已复制' : 'Email copied');
      setTimeout(() => {
        btn.classList.remove('copy-done');
        if (mini) mini.textContent = old || 'COPY';
      }, 1400);
    });
  });
}

function initBackToTop() {
  document.querySelectorAll('a[href="#top"], .back-to-top').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(body.classList.contains('lang-zh') ? '回到顶部' : 'Back to top');
    });
  });
}

function initButtonRipples() {
  const selectors = '.btn, .top-pill, .icon-btn, .inline-copy, .socials a';
  document.querySelectorAll(selectors).forEach(el => {
    el.addEventListener('click', event => {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}

function initRevealOnScroll() {
  const items = document.querySelectorAll('.section-frame, .field-strip, .design-ledger');
  if (!('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    observer.observe(item);
  });
}

function initScrollStateAndActiveNav() {
  const header = document.querySelector('.site-header');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const update = () => {
    body.classList.toggle('is-scrolled', window.scrollY > 16);
    let current = '';
    const offset = (header?.offsetHeight || 0) + 120;
    sections.forEach(section => {
      if (section.offsetTop - offset <= window.scrollY) current = `#${section.id}`;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === current));
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initHeroParallax() {
  const heroArt = document.querySelector('.hero-art');
  if (!heroArt || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  heroArt.addEventListener('pointermove', event => {
    const rect = heroArt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroArt.style.transform = `perspective(1100px) rotateY(${x * 3.2}deg) rotateX(${-y * 3.2}deg) translateY(-2px)`;
  });
  heroArt.addEventListener('pointerleave', () => {
    heroArt.style.transform = '';
  });
}

wireCopyButtons();
initBackToTop();
initButtonRipples();
initRevealOnScroll();
initScrollStateAndActiveNav();
initHeroParallax();
