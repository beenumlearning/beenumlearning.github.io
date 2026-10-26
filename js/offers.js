/* ============================================================
   offers.js — the 30% OFF coupon offer, driven by
   /resources/data/offers30.json

   To start a new offer, edit that file:
     "validUntil": text shown to visitors
     "expiresAt":  exact end time for the countdown (ISO format,
                   e.g. "2026-12-31T23:59:00+05:30")
     "courses":    the coupon links
   ============================================================ */
(function () {
  const { icon, escapeHtml, startCountdown } = window.BL;

  function render(data) {
    const expires = Date.parse(data.expiresAt || data.validUntil);

    // Countdowns: <div class="countdown" data-offer-countdown>
    document.querySelectorAll('[data-offer-countdown]').forEach((el) => {
      const note = el.querySelector('.cd-note');
      if (note) note.textContent = `Valid until ${data.validUntil}`;
      if (!Number.isNaN(expires)) {
        el.dataset.countdown = new Date(expires).toISOString();
        startCountdown(el);
      }
    });

    // Home hero pill: "All Udemy courses · ends Oct 31"
    document.querySelectorAll('[data-offer-ends]').forEach((el) => {
      if (Number.isNaN(expires)) return;
      el.textContent = expires > Date.now()
        ? `All Udemy courses · ends ${new Date(expires).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Los_Angeles' })}`
        : 'New course coupons coming soon';
    });

    // "13 courses" + technology chips (home page)
    document.querySelectorAll('[data-offer-tags]').forEach((el) => {
      const tags = [...new Set((data.courses || []).map((c) => c.tag).filter(Boolean))];
      el.innerHTML = `<span class="om-count">${(data.courses || []).length} courses</span>` +
        tags.map((t) => `<span class="chip h-${escapeHtml(t)}">${escapeHtml(t)}</span>`).join('');
    });

    // Full coupon list (offers page)
    const list = document.querySelector('[data-offer-list]');
    if (list) {
      list.innerHTML = (data.courses || []).map((c, i) => `
        <li class="card card-link offer-item">
          <span class="num">${String(i + 1).padStart(2, '0')}</span>
          <div class="oi-body">
            ${c.tag ? `<span class="chip h-${escapeHtml(c.tag)}">${escapeHtml(c.tag)}</span>` : ''}
            <a class="stretched oi-title" href="${escapeHtml(c.url)}" target="_blank" rel="noopener sponsored">${escapeHtml(c.title)}</a>
          </div>
          <span class="oi-cta">Enroll — 30% off ${icon('arrow-up-right', 'i-sm')}</span>
        </li>`).join('');
    }
    const note = document.querySelector('[data-offer-note]');
    if (note && data.note) {
      note.innerHTML = `${icon('message', 'i-sm')} <span>${escapeHtml(data.note)}</span>`;
      note.hidden = false;
    }
  }

  function renderError() {
    const list = document.querySelector('[data-offer-list]');
    if (list) list.innerHTML = '<li class="card card-pad">Unable to load the current course list right now — please refresh, or email us and we\'ll send the links directly.</li>';
  }

  fetch('/resources/data/offers30.json')
    .then((r) => r.json())
    .then(render)
    .catch(renderError);
})();
