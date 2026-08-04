/* ============================================================
   HOMEPAGE — Latest Blogs belt
   Fetches resources/data/blogs.json, sorts newest-first, shows
   the latest 5 as belt cards, then appends a "View All Blogs"
   end-card that links to pages/blogs.html.
   ============================================================ */
(function () {
  const BELT_ID = 'blogs-belt';
  const LATEST_COUNT = 5;

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, s => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
  }

  function render(blogs) {
    const track = document.getElementById(BELT_ID);
    if (!track) return;

    track.innerHTML = '';

    blogs.forEach(blog => {
      const card = document.createElement('a');
      card.className = 'blog-belt-card belt-item';
      card.href = `pages/blog-view.html?id=${encodeURIComponent(blog.id)}`;
      const pill = window.categoryPillHtml ? window.categoryPillHtml(blog.category) : '';
      card.innerHTML = `
        <div class="blog-belt-top">
          ${pill || '<span></span>'}
          <span class="blog-belt-date">${formatDate(blog.date)}</span>
        </div>
        <h3>${escapeHtml(blog.title)}</h3>
        <p>${escapeHtml(blog.excerpt)}</p>
        <span class="blog-belt-link">Read more →</span>
      `;
      track.appendChild(card);
    });

    const endCard = document.createElement('a');
    endCard.className = 'belt-end-card belt-item';
    endCard.href = 'pages/blogs.html';
    endCard.innerHTML = `
      <div class="belt-end-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
      </div>
      <h3>View All Blogs</h3>
      <p>Browse the full library</p>
    `;
    track.appendChild(endCard);

    if (typeof attachBeltScrollListener === 'function') {
      attachBeltScrollListener(BELT_ID);
    }
  }

  function renderError() {
    const track = document.getElementById(BELT_ID);
    if (!track) return;
    track.innerHTML = '<p class="belt-loading">Unable to load latest posts right now.</p>';
  }

  fetch('/resources/data/blogs.json')
    .then(res => res.json())
    .then(data => {
      const blogs = (data.blogs || [])
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, LATEST_COUNT);
      if (blogs.length) {
        render(blogs);
      } else {
        renderError();
      }
    })
    .catch(renderError);
})();
