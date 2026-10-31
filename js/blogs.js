/* ============================================================
   blogs.js — everything blog-related, driven by
   /resources/data/blogs.json  (add a post there + its PDF in /blogs/, or a "pdfUrl" link instead)

   • Home page ........ <div id="latest-blogs">   → newest 3 posts
   • Blogs page ....... <div id="blog-list">      → all posts + search/filter
   • Blog view page ... <main data-blog-view>     → one post (?id=N)
   ============================================================ */
(function () {
  const { icon, escapeHtml, mailto, SITE, toast } = window.BL;
  const DATA_URL = '/resources/data/blogs.json';

  // Short labels shown big on the colored covers
  const COVER_LABEL = { Database: 'DB', Others: 'More' };
  const coverLabel = (cat) => COVER_LABEL[cat] || cat;
  const hueClass = (cat) => `h-${escapeHtml(cat || 'Others')}`;

  const formatDate = (iso, month = 'short') => {
    const d = new Date(`${iso}T00:00:00Z`);
    return isNaN(d) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric', timeZone: 'UTC' });
  };
  const readingMinutes = (b) => Math.max(3, Math.round(String(b.summary || '').split(/\s+/).length / 220) + 3);
  const postUrl = (b) => `/pages/blog-view.html?id=${encodeURIComponent(b.id)}`;
  const youTubeId = (url) => (String(url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1] || null;

  async function loadBlogs() {
    const res = await fetch(DATA_URL);
    const data = await res.json();
    return (data.blogs || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }

  /* ---------- One post card ---------- */
  function cardHTML(b, { featured = false, heading = 'h3' } = {}) {
    const roadmap = featured ? `
      <span class="latest">Latest guide</span>
      <div class="route" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path class="route-bg" d="M4 84 C 18 84, 20 62, 32 62 S 46 44, 58 44 S 76 24, 88 22"/>
          <path class="route-line" d="M4 84 C 18 84, 20 62, 32 62 S 46 44, 58 44 S 76 24, 88 22"/>
        </svg>
        <span class="node" style="left:32%;top:62%"><i></i><b>Fundamentals</b></span>
        <span class="node" style="left:58%;top:44%"><i></i><b>Hands-on</b></span>
        <span class="node last" style="left:88%;top:22%"><i>${icon('check', 'i-xs')}</i><b>Production</b></span>
      </div>
      <ul class="inside" role="list" aria-label="Includes">
        ${pdfSource(b) ? `<li>${icon('file', 'i-xs')} PDF guide</li>` : ''}${b.video ? `<li>${icon('play', 'i-xs')} Video</li>` : ''}
      </ul>` : '';
    return `
    <article class="card card-link post${featured ? ' featured' : ''}" data-category="${escapeHtml(b.category)}"
      data-search="${escapeHtml(`${b.title} ${b.excerpt} ${b.category}`.toLowerCase())}">
      <div class="post-cover cover ${hueClass(b.category)}">
        <span class="post-kicker">Learning path</span>${roadmap}
        <span class="cover-mono post-mono" aria-hidden="true">${escapeHtml(coverLabel(b.category))}</span>
        ${icon('route', 'i-lg post-icon')}
      </div>
      <div class="post-body">
        <div class="post-meta">
          <span class="chip ${hueClass(b.category)}">${escapeHtml(b.category)}</span>
          <span><time datetime="${escapeHtml(b.date)}">${formatDate(b.date)}</time> · ${readingMinutes(b)} min</span>
        </div>
        <${heading} class="post-title"><a class="stretched" href="${postUrl(b)}">${escapeHtml(b.title)}</a></${heading}>
        <p>${escapeHtml(b.excerpt)}</p>
        <span class="arrow-link">Read the guide ${icon('arrow-right', 'i-sm')}</span>
      </div>
    </article>`;
  }

  const errorHTML = '<p class="empty-state">Unable to load the blogs right now — please refresh the page.</p>';

  /* ---------- Home: latest 3 ---------- */
  async function renderLatest(el) {
    try {
      const blogs = await loadBlogs();
      el.innerHTML = blogs.slice(0, 3).map((b, i) => cardHTML(b, { featured: i === 0 })).join('');
    } catch (e) {
      el.innerHTML = errorHTML;
    }
  }

  /* ---------- Blogs page: all posts + filters ---------- */
  async function renderList(el) {
    const root = el.closest('[data-filter-root]');
    try {
      const blogs = await loadBlogs();
      el.innerHTML = blogs.map((b) => cardHTML(b, { heading: 'h2' })).join('');
      const filters = root?.querySelector('[data-filter-buttons]');
      if (filters) {
        const counts = {};
        blogs.forEach((b) => (counts[b.category] = (counts[b.category] || 0) + 1));
        filters.innerHTML =
          `<button type="button" class="filter" data-filter="all" aria-pressed="true">All <span class="count">${blogs.length}</span></button>` +
          Object.keys(counts).sort().map((c) =>
            `<button type="button" class="filter" data-filter="${escapeHtml(c)}" aria-pressed="false">${escapeHtml(c)} <span class="count">${counts[c]}</span></button>`).join('');
      }
      if (root) window.BL.initFilter(root);
    } catch (e) {
      el.innerHTML = errorHTML;
    }
  }

  /* ---------- Blog view page (?id=N) ---------- */
  function setMeta(selector, attr, value) {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const m = selector.match(/\[(name|property)="([^"]+)"\]/);
      if (m) el.setAttribute(m[1], m[2]);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  }

  // Where a post's PDF lives. Two ways to give it in blogs.json:
  //   "file":   "X.pdf"      a PDF kept in /blogs/ on this site
  //   "pdfUrl": "https://…"  a PDF hosted elsewhere: a Google Drive share link or any direct https link
  // "pdfUrl" is used when both are present. Returns null when the post has no usable PDF.
  function pdfSource(b) {
    const link = String(b.pdfUrl || '').trim();
    let u = null;
    try { u = link ? new URL(link) : null; } catch (e) { u = null; }
    if (u && u.protocol === 'https:') {
      if (u.hostname === 'drive.google.com') {
        const id = (u.pathname.match(/\/file\/d\/([\w-]+)/) || [])[1] || u.searchParams.get('id');
        if (id && /^[\w-]+$/.test(id)) {
          return {
            local: false, label: 'Google Drive',
            open: `https://drive.google.com/file/d/${id}/view`,
            embed: `https://drive.google.com/file/d/${id}/preview`,
            download: `https://drive.google.com/uc?export=download&id=${id}`,
          };
        }
      }
      let name = '';
      try { name = decodeURIComponent(u.pathname.split('/').pop() || ''); } catch (e) { name = ''; }
      return {
        local: false, label: /\.pdf$/i.test(name) ? name : u.hostname,
        open: u.href, embed: `${u.href.split('#')[0]}#view=FitH`, download: u.href,
      };
    }
    if (b.file) {
      const path = `/blogs/${b.file}`;
      return { local: true, label: b.file, open: path, embed: `${path}#view=FitH`, download: path };
    }
    return null;
  }

  async function renderArticle(main) {
    const id = parseInt(new URLSearchParams(location.search).get('id'), 10);
    let blogs;
    try { blogs = await loadBlogs(); } catch (e) { main.innerHTML = `<div class="container">${errorHTML}</div>`; return; }
    const b = blogs.find((x) => x.id === id);
    if (!b) {
      main.innerHTML = `<section class="container not-found-msg"><h1>Blog not found</h1><p class="lead">This post may have moved.</p>
        <a class="btn btn-gold" href="/pages/blogs.html">See all blogs ${icon('arrow-right')}</a></section>`;
      return;
    }

    const url = `https://beenumlearning.com${postUrl(b)}`;
    const src = pdfSource(b);
    // a file on this site downloads in place; a file on another site opens in a new tab
    const fileAttrs = src && (src.local ? 'download' : 'target="_blank" rel="noopener noreferrer"');
    const vid = youTubeId(b.video);
    const related = [...blogs.filter((x) => x.id !== b.id && x.category === b.category), ...blogs.filter((x) => x.id !== b.id && x.category !== b.category)].slice(0, 3);

    // SEO: title, description, canonical, social tags, structured data
    document.title = `${b.title} | ${SITE.name}`;
    setMeta('meta[name="description"]', 'content', b.excerpt);
    setMeta('meta[property="og:title"]', 'content', `${b.title} | ${SITE.name}`);
    setMeta('meta[property="og:description"]', 'content', b.excerpt);
    setMeta('meta[property="og:url"]', 'content', url);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article', headline: b.title, description: b.excerpt,
      datePublished: b.date, dateModified: b.date, image: 'https://beenumlearning.com/og/default.jpg',
      author: { '@type': 'Organization', name: SITE.name, url: 'https://beenumlearning.com' },
      publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: 'https://beenumlearning.com/resources/logo/favicon.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    });
    document.head.appendChild(ld);

    main.innerHTML = `
    <div class="progress" aria-hidden="true"></div>
    <article>
      <header class="post-hero cover ${hueClass(b.category)}">
        <div class="container-narrow">
          <nav aria-label="Breadcrumb"><ol class="crumbs" role="list">
            <li><a href="/">Home</a></li><li><a href="/pages/blogs.html">Blog</a></li>
            <li><a href="/pages/blogs.html?category=${encodeURIComponent(b.category)}">${escapeHtml(b.category)}</a></li>
          </ol></nav>
          <div class="ph-meta"><span class="chip chip-dot ${hueClass(b.category)}">${escapeHtml(b.category)}</span><span class="mono">Learning path</span></div>
          <h1>${escapeHtml(b.title)}</h1>
          <p class="lead">${escapeHtml(b.excerpt)}</p>
          <div class="byline">
            <img src="/resources/logo/logos.jpg" width="40" height="40" alt="">
            <span><strong>${SITE.name}</strong><small><time datetime="${escapeHtml(b.date)}">Published ${formatDate(b.date, 'long')}</time> · ${readingMinutes(b)} min read</small></span>
          </div>
          <div class="cluster article-actions">
            ${src ? `<a class="btn btn-gold" href="${escapeHtml(src.download)}" ${fileAttrs}>${icon('file')} Download PDF</a>` : ''}
            <button type="button" class="btn btn-outline" data-share>${icon('share')} Share</button>
            <button type="button" class="btn btn-ghost" data-save-offline hidden>${icon('cloud-down')} Save offline</button>
          </div>
        </div>
      </header>

      <div class="container-narrow article-body">
        <section class="prose" aria-labelledby="overview"><h2 id="overview">Overview</h2><p>${escapeHtml(b.summary)}</p></section>

        ${src ? `
        <section class="card pdf-card" aria-labelledby="pdf-title">
          <div class="pdf-head">
            <span class="pdf-icon">${icon('file')}</span>
            <div><h2 id="pdf-title">The full learning path</h2><p>${escapeHtml(src.label)} · PDF</p></div>
            <div class="cluster pdf-actions">
              <a class="btn btn-outline btn-sm" href="${escapeHtml(src.open)}" target="_blank" rel="noopener">Open ${icon('arrow-up-right', 'i-sm')}</a>
              <a class="btn btn-gold btn-sm" href="${escapeHtml(src.download)}" ${fileAttrs}>Download</a>
            </div>
          </div>
          <div class="pdf-frame" data-pdf="${escapeHtml(src.embed)}"></div>
          ${src.local ? '' : '<p class="pdf-note">Can\u2019t see the preview? Use <strong>Open</strong> \u2014 some websites don\u2019t allow their files to be shown inside other pages.</p>'}
        </section>` : ''}

        ${vid ? `
        <section class="article-video" aria-labelledby="video-title">
          <h2 id="video-title">Related video for this blog</h2>
          <div class="lite-yt" data-yt="${vid}" data-title="${escapeHtml(b.title)}">
            <img src="https://i.ytimg.com/vi/${vid}/hqdefault.jpg" width="480" height="360" alt="" loading="lazy" onerror="this.remove()">
            <button type="button" class="lite-play" aria-label="Play video: ${escapeHtml(b.title)}"><span>${icon('play', 'i-lg')}</span></button>
            <span class="lite-label">${icon('youtube', 'i-sm')} Watch the companion video</span>
          </div>
        </section>` : ''}

        <aside class="card card-pad keep-going" aria-label="Keep learning">
          <div>
            <h2>Keep going with ${escapeHtml(b.category)}</h2>
            <p>Questions about this guide? Write to us at <a href="${mailto(`Question about: ${b.title}`)}">${SITE.email}</a>.</p>
          </div>
          <div class="cluster">
            <a class="btn btn-gold" href="/pages/courses.html?tech=${encodeURIComponent(b.category)}">${icon('cap')} ${escapeHtml(b.category)} courses</a>
            <a class="btn btn-outline" href="/pages/consulting.html">${icon('briefcase')} Get project help</a>
          </div>
        </aside>

        <section class="article-comments" id="comments-section" hidden><h2>Discussion</h2><div id="giscus"></div></section>
      </div>
    </article>

    ${related.length ? `
    <section class="container section-tight" aria-labelledby="related-title">
      <h2 id="related-title" class="section-title">Related posts</h2>
      <div class="grid grid-3">${related.map((r) => cardHTML(r)).join('')}</div>
    </section>` : ''}`;

    window.BL.initLiteYouTube(main);
    mountPdfPreview(main.querySelector('[data-pdf]'), b.title);
    initShare(main.querySelector('[data-share]'), b.title, url);
    initSaveOffline(main.querySelector('[data-save-offline]'), [location.pathname + location.search, ...(src && src.local ? [src.open] : []), DATA_URL],
      src && !src.local);
    initGiscus();
  }

  // PDF preview only on wide screens — phones can't show inline PDFs well
  function mountPdfPreview(frame, title) {
    if (!frame) return;
    const wide = matchMedia('(min-width: 860px)');
    const mount = () => {
      if (!wide.matches || frame.firstChild) return;
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const iframe = document.createElement('iframe');
        iframe.src = frame.dataset.pdf;
        iframe.title = `PDF: ${title}`;
        frame.appendChild(iframe);
      }, { rootMargin: '300px' });
      io.observe(frame);
    };
    mount();
    wide.addEventListener('change', mount);
  }

  function initShare(btn, title, url) {
    btn?.addEventListener('click', async () => {
      try {
        if (navigator.share) await navigator.share({ title, url });
        else { await navigator.clipboard.writeText(url); toast('Link copied to clipboard'); }
      } catch (e) {}
    });
  }

  // "Save offline": stores the page, its PDF and the blog data in a cache the service worker keeps
  // (a PDF on another website can't be stored by the site, so only the page and blog data are saved for it)
  function initSaveOffline(btn, urls, pdfIsExternal) {
    if (!btn || !('caches' in window) || !('serviceWorker' in navigator)) return;
    btn.hidden = false;
    btn.addEventListener('click', async () => {
      try {
        const cache = await caches.open('beenum-saved');
        await cache.addAll(urls);
        btn.lastChild.textContent = ' Saved for offline';
        toast(pdfIsExternal ? 'Saved — this page now works offline. The PDF needs an internet connection.' : 'Saved — this guide and its PDF now work offline.');
      } catch (e) {
        toast('Could not save right now — please try again.');
      }
    });
  }

  function initGiscus() {
    const g = SITE.giscus;
    if (!g.repo || !g.repoId || !g.categoryId) return; // comments switched off until configured
    document.getElementById('comments-section').hidden = false;
    const theme = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    const attrs = { repo: g.repo, 'repo-id': g.repoId, category: g.category, 'category-id': g.categoryId, mapping: 'url',
      strict: '0', 'reactions-enabled': '1', 'emit-metadata': '0', 'input-position': 'bottom', theme: theme(), lang: 'en', loading: 'lazy' };
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(`data-${k}`, v));
    document.getElementById('giscus').appendChild(s);
    window.addEventListener('themechange', () => {
      document.querySelector('iframe.giscus-frame')?.contentWindow?.postMessage({ giscus: { setConfig: { theme: theme() } } }, 'https://giscus.app');
    });
  }

  /* ---------- Start ---------- */
  const latest = document.getElementById('latest-blogs');
  const list = document.getElementById('blog-list');
  const article = document.querySelector('[data-blog-view]');
  if (latest) renderLatest(latest);
  if (list) renderList(list);
  if (article) renderArticle(article);
})();
