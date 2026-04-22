/* ============================================================
   BEENUM LEARNING — Dark Mode Manager
   • Reads device preference on first visit (prefers-color-scheme)
   • Saves user's manual choice to localStorage
   • Applies theme before paint (no flash)
   • Exposes window.toggleTheme() for the button in header.html
   ============================================================ */
(function () {
  const KEY = 'bl-theme';
  const root = document.documentElement;

  function getPreferred() {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    // Update toggle button icon if it exists in DOM
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = theme === 'dark' ? iconSun() : iconMoon();
    }
  }

  function iconMoon() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
  }

  function iconSun() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  }

  // Apply immediately before first paint
  applyTheme(getPreferred());

  // Expose toggle for header button
  window.toggleTheme = function () {
    const current = root.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Called by include.js after header HTML is injected — sets correct icon
  window.applyThemeToButton = function () {
    const current = root.getAttribute('data-theme') || getPreferred();
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = current === 'dark' ? iconSun() : iconMoon();
    }
  };

  // Listen for OS-level changes (if user hasn't manually chosen)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();
