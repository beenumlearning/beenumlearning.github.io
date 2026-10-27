/* ============================================================
   BEENUM LEARNING — site.js  (shared by every page)

   1. SITE SETTINGS ......... email, social links, menu, footer  ← edit here
   2. Header / footer / menu  (drawn into the [data-include] placeholders)
   3. Theme toggle (light / dark)
   4. Cookie consent + Google Analytics
   5. PWA: service worker, install button, update message
   6. Small helpers used on several pages:
      toast, filters, carousel, countdown, YouTube player
   7. Icons (the whole icon set, added to each page once)

   No build step: edit, save, refresh.
   ============================================================ */

/* ═══════════════ 1. SITE SETTINGS ═══════════════ */
const SITE = {
  name: 'BEENUM LEARNING',
  tagline: 'Simplifying Imaginations',
  email: 'info@beenumlearning.com',
  analyticsId: 'G-KZ590MJQXF',
  links: {
    youtube: 'https://www.youtube.com/@BEENUMLEARNING',
    youtubeJoin: 'https://www.youtube.com/@BEENUMLEARNING/join',
    linkedin: 'https://www.linkedin.com/company/beenum-learning',
    whatsapp: 'https://whatsapp.com/channel/0029VbCvoOb1XquSVCQdGc3n',
    buyMeACoffee: 'https://www.buymeacoffee.com/beenumlearning',
    // Learner portal (Oracle APEX app, Google sign-in). Also used by every [data-portal] link.
    portal: 'https://g5e5bc90877eab3-mudatp.adb.us-ashburn-1.oraclecloudapps.com/ords/r/learningapex1001/xxbl-portal-beenumlearning-app',
  },
  // Blog comments (Giscus). Fill these in from https://giscus.app to switch comments on.
  giscus: { repo: '', repoId: '', category: 'General', categoryId: '' },
};

// Main menu (desktop bar + mobile menu). icon = a name from the ICONS list at the bottom of this file
const NAV = [
  { href: '/pages/courses.html', label: 'Courses', icon: 'cap', hint: 'Udemy courses' },
  { href: '/pages/videos.html', label: 'YouTube', icon: 'youtube', hint: 'Free playlists & members' },
  { href: '/pages/onlinetraining.html', label: 'Training', icon: 'users', hint: 'Live & self-paced programs' },
  { href: '/pages/consulting.html', label: 'Consulting', icon: 'briefcase', hint: 'Project support' },
  { href: '/pages/blogs.html', label: 'Blog', icon: 'book', hint: 'Learning paths & guides' },
  { href: '/pages/about.html', label: 'About', icon: 'globe', hint: 'Our story' },
  { href: '/pages/contact.html', label: 'Contact', icon: 'mail', hint: 'Talk to us' },
];

// Footer link columns
const FOOTER_COLUMNS = [
  { title: 'Learn', links: [
    ['/pages/courses.html', 'Udemy courses'],
    ['/pages/videos.html', 'YouTube playlists'],
    ['/pages/blogs.html', 'Blogs & learning paths'],
    ['/pages/offers30.html', '30% OFF offers'],
    [SITE.links.portal, 'Login to Portal'],
  ] },
  { title: 'Services', links: [
    ['/pages/onlinetraining.html', 'Training programs'],
    ['/pages/consulting.html', 'Consulting & support'],
    ['/pages/service-request.html', 'Service request'],
    [SITE.links.youtubeJoin, 'YouTube membership'],
  ] },
  { title: 'Company', links: [
    ['/pages/about.html', 'About'],
    ['/pages/contact.html', 'Contact'],
    ['/pages/privacy.html', 'Privacy policy'],
    ['/pages/terms.html', 'Terms & conditions'],
  ] },
];

/* ═══════════════ helpers ═══════════════ */
const icon = (name, cls = '') =>
  `<svg class="i ${cls}" aria-hidden="true" focusable="false"><use href="#${name}"></use></svg>`;
const isExternal = (href) => /^https?:/.test(href);
const ext = (href) => (isExternal(href) ? ' target="_blank" rel="noopener"' : '');
const mailto = (subject) => `mailto:${SITE.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
const escapeHtml = (s) =>
  String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Which menu item is "current"? (blog-view counts as Blog)
const currentPath = (() => {
  const p = location.pathname.replace(/\/index\.html$/, '/');
  return p === '/pages/blog-view.html' ? '/pages/blogs.html' : p;
})();
const current = (href) => (href === currentPath ? ' aria-current="page"' : '');

/* ═══════════════ 2. HEADER / FOOTER / MENU ═══════════════ */
function headerHTML() {
  return `
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="${SITE.name} — home">
      <img src="/resources/logo/logos.jpg" width="40" height="40" alt="" class="brand-logo">
      <span class="brand-text"><span class="brand-name">${SITE.name}</span><span class="brand-tag">${SITE.tagline}</span></span>
    </a>
    <nav class="nav-desktop" aria-label="Primary">
      <ul role="list">${NAV.map((l) => `<li><a href="${l.href}"${current(l.href)}>${l.label}</a></li>`).join('')}</ul>
    </nav>
    <div class="header-actions">
      <button type="button" class="icon-btn" data-pwa-install hidden aria-label="Install the BEENUM app" title="Install app">${icon('install')}</button>
      <button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="Toggle theme" title="Toggle light / dark">${icon('moon', 'i-moon')}${icon('sun', 'i-sun')}</button>
      <button type="button" class="icon-btn menu-btn" popovertarget="mobile-nav" aria-label="Open menu">${icon('menu')}</button>
    </div>
  </div>
</header>
<div id="mobile-nav" popover class="mobile-nav" aria-label="Menu">
  <div class="mobile-nav-head">
    <span class="brand"><img src="/resources/logo/logos.jpg" width="36" height="36" alt="" class="brand-logo"><span class="brand-name">${SITE.name}</span></span>
    <button type="button" class="icon-btn" popovertarget="mobile-nav" popovertargetaction="hide" aria-label="Close menu">${icon('x')}</button>
  </div>
  <nav aria-label="Mobile">
    <ul role="list" class="mobile-links">
      <li><a class="ml-portal" data-portal href="${SITE.links.portal}" target="_blank" rel="noopener"><span class="ml-icon">${icon('lock')}</span><span><strong>Portal</strong><small>Sign in with Google</small></span></a></li>
      ${[{ href: '/', label: 'Home', icon: 'home', hint: 'Start here' }, ...NAV]
        .map((l) => `<li><a href="${l.href}"${current(l.href)}><span class="ml-icon">${icon(l.icon)}</span><span><strong>${l.label}</strong><small>${l.hint}</small></span></a></li>`)
        .join('')}
    </ul>
  </nav>
  <div class="mobile-nav-foot">
    <div class="mobile-nav-row">
      <button type="button" class="btn btn-outline btn-sm" data-theme-toggle aria-label="Toggle theme">${icon('moon', 'i-sm i-moon')}${icon('sun', 'i-sm i-sun')} Theme</button>
      <button type="button" class="btn btn-outline btn-sm" data-pwa-install hidden>${icon('install', 'i-sm')} Install app</button>
      <a class="icon-btn" href="${SITE.links.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube')}</a>
      <a class="icon-btn" href="${SITE.links.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin')}</a>
    </div>
  </div>
</div>`;
}

function footerHTML() {
  return `
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="f-brand" href="/"><img src="/resources/logo/logos.jpg" width="48" height="48" alt="" loading="lazy">
        <span><strong>${SITE.name}</strong><small>${SITE.tagline}</small></span></a>
      <p>Hands-on Oracle Cloud &amp; AI learning — OIC, VBCS, OPA, ORDS, APEX, Fusion &amp; OCI — built from real enterprise projects.</p>
      <div class="f-social">
        <a href="${SITE.links.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube')}</a>
        <a href="${SITE.links.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin')}</a>
        <a href="${SITE.links.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp channel">${icon('whatsapp')}</a>
        <a href="mailto:${SITE.email}" aria-label="Email ${SITE.email}">${icon('mail')}</a>
      </div>
    </div>
    ${FOOTER_COLUMNS.map((col) => `
    <nav class="f-col" aria-label="${col.title}">
      <h2>${col.title}</h2>
      <ul role="list">${col.links.map(([href, label]) => `<li><a href="${href}"${ext(href)}>${escapeHtml(label)}</a></li>`).join('')}</ul>
    </nav>`).join('')}
  </div>
  <div class="container footer-bar">
    <p>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</p>
    <div class="f-actions">
      <button type="button" data-cookie-settings>${icon('cookie', 'i-xs')} Cookie settings</button>
      <button type="button" data-pwa-install hidden>${icon('install', 'i-xs')} Install app</button>
      <a href="#top">${icon('arrow-up-right', 'i-xs')} Back to top</a>
    </div>
  </div>
</footer>`;
}

function extrasHTML() {
  return `
<div id="cookie-banner" class="cookie" role="dialog" aria-live="polite" aria-label="Cookie consent" hidden>
  <div class="cookie-icon">${icon('cookie')}</div>
  <p>We use analytics cookies to understand what helps learners most. <a href="/pages/privacy.html#cookies">Read our cookie policy</a></p>
  <div class="cookie-actions">
    <button type="button" class="btn btn-outline btn-sm" data-consent="reject">Reject</button>
    <button type="button" class="btn btn-gold btn-sm" data-consent="accept">Accept</button>
  </div>
</div>
<div id="ios-install-tip" popover class="ios-tip">
  <img src="/resources/logo/icon-192.png" width="44" height="44" alt="">
  <p>Install <strong>BEENUM</strong>: tap ${icon('share', 'i-sm')} Share, then <strong>Add to Home Screen</strong>.</p>
  <button type="button" class="icon-btn" popovertarget="ios-install-tip" popovertargetaction="hide" aria-label="Dismiss">${icon('x', 'i-sm')}</button>
</div>
<div id="toast" class="toast" data-state="hidden" role="status" aria-live="polite">
  <span data-toast-text></span>
  <button type="button" class="btn btn-gold btn-sm" data-toast-action hidden>OK</button>
</div>`;
}

function drawLayout() {
  const header = document.querySelector('[data-include="header"]');
  const footer = document.querySelector('[data-include="footer"]');
  if (header) header.outerHTML = headerHTML();
  if (footer) footer.outerHTML = footerHTML();
  document.body.insertAdjacentHTML('beforeend', extrasHTML());
  document.body.id = document.body.id || 'top';
}

function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  loader.classList.add('is-done');
  setTimeout(() => loader.remove(), 400);
}

/* ═══════════════ 3. THEME TOGGLE ═══════════════ */
const THEME_KEY = 'bl-theme';
const THEME_COLORS = { light: '#faf8f3', dark: '#0d0f12' };
const root = document.documentElement;
const currentTheme = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    b.setAttribute('aria-pressed', String(theme === 'dark'));
  });
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

function toggleTheme(event) {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) return applyTheme(next);

  // Circular reveal from the button that was clicked
  const r = event.currentTarget.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.classList.add('theme-vt');
  const vt = document.startViewTransition(() => applyTheme(next));
  vt.ready
    .then(() => root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' }))
    .catch(() => {});
  vt.finished.finally(() => root.classList.remove('theme-vt'));
}

function initTheme() {
  applyTheme(currentTheme());
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.addEventListener('click', toggleTheme));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (err) {}
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });
}

/* ═══════════════ 4. COOKIE CONSENT + GOOGLE ANALYTICS ═══════════════
   Analytics loads only after "Accept". The choice is remembered both ways;
   "Cookie settings" (footer / privacy page) opens the banner again. */
const CONSENT_KEY = 'ga_consent';

function loadAnalytics() {
  if (!SITE.analyticsId || window.__gaLoaded) return;
  window.__gaLoaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.analyticsId}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', SITE.analyticsId, { anonymize_ip: true });
}

function initConsent() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  const read = () => { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } };
  const write = (v) => { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} };
  const show = () => { banner.hidden = false; requestAnimationFrame(() => banner.setAttribute('data-open', '')); };
  const hide = () => { banner.removeAttribute('data-open'); setTimeout(() => (banner.hidden = true), 300); };

  banner.querySelector('[data-consent="accept"]').addEventListener('click', () => { write('granted'); hide(); loadAnalytics(); });
  banner.querySelector('[data-consent="reject"]').addEventListener('click', () => { write('denied'); hide(); });
  document.querySelectorAll('[data-cookie-settings]').forEach((el) => el.addEventListener('click', show));

  const choice = read();
  if (choice === 'granted') loadAnalytics();
  else if (choice !== 'denied') setTimeout(show, 1200);
}

/* ═══════════════ 5. PWA ═══════════════ */
const INSTALLED_KEY = 'pwa_installed';
let deferredPrompt = null;
const isStandalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const ua = navigator.userAgent;
const isIOS = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
const isIOSSafari = isIOS && /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
const installedFlag = {
  get: () => { try { return localStorage.getItem(INSTALLED_KEY) === '1'; } catch (e) { return false; } },
  set: (v) => { try { v ? localStorage.setItem(INSTALLED_KEY, '1') : localStorage.removeItem(INSTALLED_KEY); } catch (e) {} },
};
if (isStandalone) installedFlag.set(true);

function refreshInstallButtons() {
  const show = !isStandalone && !installedFlag.get() && (Boolean(deferredPrompt) || isIOSSafari);
  document.querySelectorAll('[data-pwa-install]').forEach((el) => (el.hidden = !show));
}

async function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    try {
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') installedFlag.set(true);
    } finally {
      deferredPrompt = null;
      refreshInstallButtons();
    }
  } else if (isIOSSafari) {
    document.getElementById('ios-install-tip')?.showPopover?.();
  }
}

// These events can fire before the header exists, so they are registered right away.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installedFlag.set(false);
  refreshInstallButtons();
});
window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  installedFlag.set(true);
  refreshInstallButtons();
  toast('App installed — find BEENUM on your home screen.');
});

function initPWA() {
  document.querySelectorAll('[data-pwa-install]').forEach((el) => el.addEventListener('click', installApp));
  refreshInstallButtons();
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      let accepted = false;
      const promptUpdate = (worker) =>
        toast('A new version of the site is ready.', { label: 'Refresh', onClick: () => { accepted = true; worker.postMessage('SKIP_WAITING'); } }, 0);
      if (reg.waiting && navigator.serviceWorker.controller) promptUpdate(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) promptUpdate(worker);
        });
      });
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (accepted) location.reload(); });
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    } catch (e) { /* the site works fine without the service worker */ }
  });
}

/* ═══════════════ 6. SHARED HELPERS ═══════════════ */

/* Toast message at the bottom of the screen */
function toast(message, action, timeout = 5000) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.querySelector('[data-toast-text]').textContent = message;
  const btn = el.querySelector('[data-toast-action]');
  btn.hidden = !action;
  btn.onclick = action ? action.onClick : null;
  if (action) btn.textContent = action.label;
  el.dataset.state = 'visible';
  clearTimeout(el._timer);
  if (timeout > 0) el._timer = setTimeout(() => (el.dataset.state = 'hidden'), timeout);
}

/* Filters (courses + blog). Markup:
   [data-filter-root] > buttons [data-filter="all|OIC|…"], optional input [data-filter-search],
   items inside [data-filter-items] with data-category, and [data-filter-empty]. */
function initFilter(rootEl) {
  if (!rootEl || rootEl._filterReady) return;
  rootEl._filterReady = true;
  const buttons = [...rootEl.querySelectorAll('[data-filter]')];
  const search = rootEl.querySelector('[data-filter-search]');
  const items = () => [...rootEl.querySelectorAll('[data-filter-items] > [data-category]')];
  const empty = rootEl.querySelector('[data-filter-empty]');
  const status = rootEl.querySelector('[data-filter-status]');
  const param = rootEl.dataset.filterParam || 'tech';
  let category = 'all';
  const fromUrl = new URLSearchParams(location.search).get(param);
  if (fromUrl && buttons.some((b) => b.dataset.filter === fromUrl)) category = fromUrl;

  const run = () => {
    const q = (search?.value || '').trim().toLowerCase();
    let shown = 0;
    items().forEach((item) => {
      const okCat = category === 'all' || item.dataset.category === category;
      const okText = !q || (item.dataset.search || item.textContent).toLowerCase().includes(q);
      item.hidden = !(okCat && okText);
      if (!item.hidden) shown++;
    });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === category)));
    if (empty) empty.hidden = shown !== 0;
    if (status) status.textContent = `${shown} ${shown === 1 ? 'result' : 'results'}`;
  };
  const apply = (animate) => {
    const list = items();
    if (animate && document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      list.forEach((el, i) => (el.style.viewTransitionName = `fi-${i}`));
      document.startViewTransition(run).finished.finally(() => list.forEach((el) => (el.style.viewTransitionName = '')));
    } else run();
  };
  buttons.forEach((b) => b.addEventListener('click', () => {
    category = b.dataset.filter;
    const url = new URL(location.href);
    category === 'all' ? url.searchParams.delete(param) : url.searchParams.set(param, category);
    history.replaceState(null, '', url);
    apply(true);
  }));
  let t;
  search?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => apply(false), 120); });
  apply(false);
}

/* Horizontal carousel (reviews): native swipe + arrow buttons */
function initCarousel(rootEl) {
  const track = rootEl.querySelector('.carousel-track');
  const [prev, next] = rootEl.querySelectorAll('[data-dir]');
  if (!track || !prev || !next) return;
  const step = () => {
    const first = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    return first ? first.getBoundingClientRect().width + gap : 300;
  };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };
  [prev, next].forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: step() * Number(b.dataset.dir), behavior: 'smooth' })));
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
}

/* Countdown: <div class="countdown" data-countdown="2026-10-31T19:38:00-07:00"> */
function startCountdown(el) {
  const end = Date.parse(el.dataset.countdown);
  if (Number.isNaN(end)) return;
  const units = {};
  el.querySelectorAll('[data-u]').forEach((u) => (units[u.dataset.u] = u));
  const pad = (n) => String(n).padStart(2, '0');
  el.dataset.ready = '';
  const tick = () => {
    const left = end - Date.now();
    if (left <= 0) {
      el.dataset.ended = '';
      el.closest('[data-offer]')?.setAttribute('data-ended', '');
      const note = el.querySelector('.cd-note');
      if (note) note.textContent = 'This offer has ended — check back soon for the next one.';
      clearInterval(timer);
      return;
    }
    const s = Math.floor(left / 1000);
    units.d.textContent = pad(Math.floor(s / 86400));
    units.h.textContent = pad(Math.floor((s % 86400) / 3600));
    units.m.textContent = pad(Math.floor((s % 3600) / 60));
    units.s.textContent = pad(s % 60);
  };
  const timer = setInterval(tick, 1000);
  tick();
}

/* Click-to-load YouTube player: <div class="lite-yt" data-yt="VIDEO_ID" data-title="…"> */
function initLiteYouTube(scope = document) {
  scope.querySelectorAll('[data-yt]').forEach((el) => {
    el.querySelector('button')?.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${el.dataset.yt}?autoplay=1&rel=0`;
      iframe.title = el.dataset.title || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      el.replaceChildren(iframe);
    });
  });
}

/* Speculation Rules: Chrome/Edge pre-load the next page on hover → near-instant navigation */
function addSpeculationRules() {
  if (!HTMLScriptElement.supports?.('speculationrules')) return;
  const s = document.createElement('script');
  s.type = 'speculationrules';
  s.textContent = JSON.stringify({
    prerender: [{ where: { and: [{ href_matches: '/*' }, { not: { href_matches: ['/*.pdf', '/*.xml', '/sw.js'] } }] }, eagerness: 'moderate' }],
  });
  document.head.appendChild(s);
}

/* Shared API for the page scripts (blogs.js, offers.js) */
window.BL = { SITE, icon, mailto, escapeHtml, toast, initFilter, startCountdown, initLiteYouTube };

/* ═══════════════ 7. ICONS ═══════════════
   All icons live here (24×24, drawn with lines). They are added to every page
   once, then used anywhere with:  <svg class="i"><use href="#mail"></use></svg>
   To add one, copy a line and paste the inner <path> of any 24×24 line icon
   (e.g. from lucide.dev). */
const ICONS = {
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  'arrow-left': '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  'moon': '<path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a6.6 6.6 0 0 0 10.6 10.6Z"/>',
  'install': '<path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5"/><path d="M4 17v1.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V17"/>',
  'menu': '<path d="M4 7h16M4 12h16M4 17h10"/>',
  'x': '<path d="M18 6 6 18M6 6l12 12"/>',
  'play': '<path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" stroke="none"/>',
  'youtube': '<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  'linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
  'whatsapp': '<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.6-2-1-1 .8a4 4 0 0 1-2.2-2.2l.8-1-1-2Z"/>',
  'mail': '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 7 9 6 9-6"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  'clock': '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3 2"/>',
  'check': '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  'star': '<path d="m12 2.8 2.8 5.7 6.3.9-4.55 4.43 1.07 6.27L12 17.1l-5.62 2.95 1.07-6.27L2.9 9.4l6.3-.9Z" fill="currentColor" stroke="none"/>',
  'sparkles': '<path d="M9.94 14.06 8 20l-1.94-5.94L0 12l6.06-2.06L8 4l1.94 5.94L16 12z" transform="translate(2 -1) scale(.9)"/><path d="M19 3v4M17 5h4"/>',
  'cap': '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2.5 9 2.5 12 0v-5"/>',
  'briefcase': '<rect x="2.5" y="7" width="19" height="13" rx="2.5"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2.5 13h19"/>',
  'book': '<path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  'route': '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5"/>',
  'layers': '<path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  'life': '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="4"/><path d="m4.9 4.9 4.3 4.3m5.6 5.6 4.3 4.3m0-14.2-4.3 4.3m-5.6 5.6-4.3 4.3"/>',
  'target': '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="1.5"/>',
  'calendar': '<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
  'file': '<path d="M14.5 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-12z"/><path d="M14 2.5V8h5.5M8.5 13h7M8.5 17h5"/>',
  'share': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  'cloud-down': '<path d="M12 13v8m0 0-3.5-3.5M12 21l3.5-3.5"/><path d="M20 16.6A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>',
  'search': '<circle cx="11" cy="11" r="7.5"/><path d="m20.5 20.5-4.2-4.2"/>',
  'coffee': '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
  'lock': '<rect x="4" y="10.5" width="16" height="11" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  'wifi-off': '<path d="M12 20h.01M8.5 16.4a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 4.2-2.6M10.7 5.1A15 15 0 0 1 22 8.8M5 12.9a10 10 0 0 1 5.2-2.8M19 12.9a10 10 0 0 0-1.5-1.2M2 2l20 20"/>',
  'message': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  'gift': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  'ticket': '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
  'zap': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  'award': '<circle cx="12" cy="8.5" r="6"/><path d="m15.5 13.9 1.5 8.1-5-3-5 3 1.5-8.1"/>',
  'globe': '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5a14.5 14.5 0 0 1 0 19 14.5 14.5 0 0 1 0-19"/>',
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  'code': '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  'rss': '<path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5"/>',
  'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  'home': '<path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-7H9v7H4.5A1.5 1.5 0 0 1 3 20Z"/>',
  'cookie': '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5h.01M16 15.5h.01M12 12h.01M11 17h.01M7 14h.01"/>',
  'phone': '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/>',
};

function injectIcons() {
  if (document.getElementById('bl-icons')) return;
  const symbols = Object.entries(ICONS)
    .map(([id, paths]) => `<symbol id="${id}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</g></symbol>`)
    .join('');
  document.body.insertAdjacentHTML('afterbegin', `<svg id="bl-icons" xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${symbols}</svg>`);
}

/* ═══════════════ START ═══════════════ */
injectIcons();
drawLayout();
initTheme();
initConsent();
initPWA();
document.querySelectorAll('[data-filter-root]:not([data-filter-manual])').forEach(initFilter);
document.querySelectorAll('[data-carousel]').forEach(initCarousel);
document.querySelectorAll('[data-countdown]').forEach(startCountdown);
document.querySelectorAll('[data-mailto]').forEach((a) => (a.href = mailto(a.dataset.mailto)));
document.querySelectorAll('[data-portal]').forEach((a) => (a.href = SITE.links.portal));
initLiteYouTube();
addSpeculationRules();
hideLoader();
