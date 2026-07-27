/* ============================================================
   BEENUM LEARNING — PWA install + service worker registration
   Drives the small download icon in the header (next to the
   theme toggle) instead of a floating button. Works on every
   page — root-relative paths throughout.
   ============================================================ */
(function () {
  const INSTALLED_KEY = 'pwa_installed';

  // ---- Register the service worker ----
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  // Actually running as the installed app right now? Remember that,
  // so even a plain browser tab visit later knows to stay quiet.
  if (isStandalone) {
    try { localStorage.setItem(INSTALLED_KEY, '1'); } catch (e) {}
  }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios|chrome/i.test(navigator.userAgent);

  let deferredPrompt = null;

  function wasInstalledBefore() {
    try { return localStorage.getItem(INSTALLED_KEY) === '1'; } catch (e) { return false; }
  }

  // Decide whether the header icon should currently be visible.
  function shouldShowIcon() {
    if (isStandalone) return false;              // already running as the app
    if (wasInstalledBefore()) return false;       // remembered from a prior standalone launch
    if (deferredPrompt) return true;              // Chrome/Edge/Android confirms it's installable
    if (isIOS && isSafari) return true;           // no native prompt, but we can show instructions
    return false;                                 // no known install path on this browser
  }

  function updateIcon() {
    const icon = document.getElementById('pwa-install-icon');
    if (!icon) return;
    icon.classList.toggle('is-visible', shouldShowIcon());
  }

  // Called by include.js right after the header HTML is injected
  window.initPwaInstallButton = function () {
    updateIcon();
  };

  // Called by the header button's onclick
  window.handlePwaInstallClick = async function () {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        await deferredPrompt.userChoice;
      } finally {
        deferredPrompt = null;
        updateIcon();
      }
      return;
    }
    if (isIOS && isSafari) {
      showIOSTip();
    }
  };

  // ---- Chrome / Edge / Android: native install prompt ----
  // We don't gate this on a stored "installed" flag — Chrome only fires
  // it for origins it doesn't consider installed, so it's a more
  // reliable live signal than a cached flag (which would stay stuck
  // forever if someone later uninstalled the app).
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    try { localStorage.removeItem(INSTALLED_KEY); } catch (e) {}
    updateIcon();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    try { localStorage.setItem(INSTALLED_KEY, '1'); } catch (e) {}
    updateIcon();
  });

  // ---- iOS Safari: no beforeinstallprompt — show manual instructions on click ----
  function showIOSTip() {
    if (document.getElementById('pwa-ios-tip')) return;

    const tip = document.createElement('div');
    tip.id = 'pwa-ios-tip';
    tip.className = 'pwa-ios-tip';
    tip.innerHTML = `
      <span class="pwa-ios-tip-text">Install this app: tap
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pwa-ios-share-icon"><path d="M12 16V4m0 0L7 9m5-5l5 5"/><path d="M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5"/></svg>
        then <strong>Add to Home Screen</strong>.
      </span>
      <button type="button" class="pwa-ios-tip-close" aria-label="Dismiss">✕</button>
    `;
    document.body.appendChild(tip);
    requestAnimationFrame(() => tip.classList.add('is-visible'));

    const remove = () => {
      tip.classList.remove('is-visible');
      setTimeout(() => tip.remove(), 250);
    };
    tip.querySelector('.pwa-ios-tip-close').addEventListener('click', remove);
    setTimeout(remove, 8000); // auto-dismiss so it doesn't linger forever
  }
})();
