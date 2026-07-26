/* ============================================================
   BELT / CAROUSEL CONTROLLER
   Reusable horizontal "conveyor belt" carousel used by the
   Courses, Reviews and Latest Blogs sections on the homepage.
   ============================================================ */

// How far a single arrow click scrolls, based on the width of
// one card/tile inside the belt (moves roughly 2 cards at a time).
function getBeltStep(track) {
  const item = track.querySelector('.belt-item, .belt-end-card');
  const width = item ? item.getBoundingClientRect().width : 260;
  const styles = getComputedStyle(track);
  const gapValue = parseFloat(styles.columnGap || styles.gap) || 18;
  return (width + gapValue) * 2;
}

// Scroll a belt track left (-1) or right (1). Belts flagged
// data-loop="true" (e.g. reviews) wrap around at either end.
function beltScroll(id, dir) {
  const track = document.getElementById(id);
  if (!track) return;

  const maxScroll = track.scrollWidth - track.clientWidth;
  const loop = track.dataset.loop === 'true';

  if (loop && dir > 0 && track.scrollLeft >= maxScroll - 4) {
    track.scrollTo({ left: 0, behavior: 'smooth' });
    return;
  }
  if (loop && dir < 0 && track.scrollLeft <= 4) {
    track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    return;
  }

  track.scrollBy({ left: getBeltStep(track) * dir, behavior: 'smooth' });
}

// Disable the prev/next arrows when the belt is at either end
// (non-looping belts only — looping belts stay always active).
function updateBeltArrows(id) {
  const track = document.getElementById(id);
  if (!track) return;
  const wrap = track.closest('.belt-wrap');
  if (!wrap) return;

  const prev = wrap.querySelector('.belt-prev');
  const next = wrap.querySelector('.belt-next');

  if (track.dataset.loop === 'true') {
    if (prev) prev.disabled = false;
    if (next) next.disabled = false;
    return;
  }

  const maxScroll = track.scrollWidth - track.clientWidth - 2;
  if (prev) prev.disabled = track.scrollLeft <= 2;
  if (next) next.disabled = maxScroll <= 2 || track.scrollLeft >= maxScroll;
}

// Binds scroll/resize listeners to a belt so its arrows react
// to swiping/scrolling too, not just clicking. Safe to call
// more than once (e.g. after dynamically injected content).
function attachBeltScrollListener(id) {
  const track = document.getElementById(id);
  if (!track || track.dataset.beltBound === 'true') return;
  track.dataset.beltBound = 'true';

  updateBeltArrows(id);
  track.addEventListener('scroll', () => updateBeltArrows(id), { passive: true });
  window.addEventListener('resize', () => updateBeltArrows(id));
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.belt-track').forEach(track => {
    attachBeltScrollListener(track.id);
  });
});
