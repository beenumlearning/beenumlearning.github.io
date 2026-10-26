/* ============================================================
   theme.js — applies the saved (or system) light/dark theme
   BEFORE the page paints, so there is never a white flash.
   Loaded in <head> without "defer" on purpose. Keep it tiny.
   ============================================================ */
(function () {
  var theme;
  try { theme = localStorage.getItem('bl-theme'); } catch (e) {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d0f12' : '#faf8f3');
})();
