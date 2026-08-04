/* ============================================================
   COURSES PAGE — technology filter
   Pure client-side show/hide over the existing static course
   cards. No JSON, no backend — just data-category attributes
   already on each .playlist-tile.
   ============================================================ */
(function () {
  const bar = document.getElementById('course-filter-bar');
  const grid = document.querySelector('.playlist-grid');
  if (!bar || !grid) return;

  const tiles = Array.from(grid.querySelectorAll('.playlist-tile'));
  const empty = document.getElementById('course-filter-empty');

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;

    bar.querySelectorAll('.filter-pill').forEach(p => {
      p.classList.toggle('is-active', p === btn);
      p.setAttribute('aria-pressed', p === btn ? 'true' : 'false');
    });

    const category = btn.dataset.filter;
    let visibleCount = 0;
    tiles.forEach(tile => {
      const match = category === 'all' || tile.dataset.category === category;
      tile.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    if (empty) empty.classList.toggle('is-visible', visibleCount === 0);
  });
})();
