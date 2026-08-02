/* ============================================================
   OFFERS PAGE — 30% OFF course list
   Loads resources/data/offers30.json and renders each course as
   a real, clickable <a> link (coupon code baked into the URL),
   plus the current expiry note. Falls back to a friendly error
   message if the JSON can't be loaded.
   ============================================================ */
(function () {
  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, s => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
  }

  function render(data) {
    const expiry = document.getElementById('offer-expiry');
    if (expiry) {
      expiry.innerHTML = `<strong>⚠️ Offer valid until ${escapeHtml(data.validUntil)}</strong>`;
    }

    const list = document.getElementById('offer-course-list');
    if (!list) return;

    list.innerHTML = '';
    (data.courses || []).forEach(course => {
      const li = document.createElement('li');
      li.className = 'offer-course-item';
      li.innerHTML = `
        <a href="${escapeHtml(course.url)}" target="_blank" rel="noopener sponsored">
          ${course.tag ? `<span class="tag tag-blue">${escapeHtml(course.tag)}</span>` : ''}
          <span class="offer-course-title">${escapeHtml(course.title)}</span>
          <span class="offer-course-cta">Enroll — 30% off →</span>
        </a>
      `;
      list.appendChild(li);
    });

    if (data.note) {
      const note = document.createElement('p');
      note.className = 'offer-note';
      note.textContent = data.note;
      list.insertAdjacentElement('afterend', note);
    }
  }

  function renderError() {
    const list = document.getElementById('offer-course-list');
    if (list) list.innerHTML = '<li class="offer-course-item">Unable to load the current course list right now — please refresh, or email us and we\'ll send the links directly.</li>';
    const expiry = document.getElementById('offer-expiry');
    if (expiry) expiry.innerHTML = '<strong>⚠️ Limited-time offer</strong>';
  }

  fetch('/resources/data/offers30.json')
    .then(res => res.json())
    .then(render)
    .catch(renderError);
})();
