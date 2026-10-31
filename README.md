# BEENUM LEARNING — website (plain HTML, no build step)

The site is plain HTML, CSS and JavaScript. You edit a file, save, and refresh, and upload the folder to GitHub as-is. There are no frameworks, no `npm install` and no build step. Page addresses are the same as before (`/pages/courses.html`, `/pages/blog-view.html?id=1`, …), so existing links and Google results keep working.

## Folder map

```
index.html              Home page
pages/                  All other pages (courses, videos, blogs, blog-view, offers30, …)
404.html, offline.html  "Page not found" and "You're offline" pages
css/style.css           ALL styles (colors and fonts are at the top, in section 2 "TOKENS")
js/theme.js             Applies light/dark theme before the page shows (don't move it)
js/site.js              Header, footer, menu, cookie banner, install button, icons  ← SITE SETTINGS at the top
js/blogs.js             Blog cards, blog list, single blog page
js/offers.js            30% OFF offer list + countdown
resources/data/         blogs.json and offers30.json  ← most content updates happen here
blogs/                  Blog PDF files
fonts/                  Self-hosted fonts (Sora, Inter, JetBrains Mono)
sw.js, manifest.json    Installable app (PWA) + offline support
```

## Common updates

| I want to… | Do this |
| --- | --- |
| **Add a blog post** | Add an entry to `resources/data/blogs.json` with the next `id`, a `title`, `date` (YYYY-MM-DD), `category`, `excerpt`, `summary` and optional `video` link. For the PDF use **one** of: `"file": "Name.pdf"` (put the PDF in `blogs/`), or `"pdfUrl": "https://…"` to keep the PDF on another site (a Google Drive share link set to *Anyone with the link*, or any direct `https` PDF link). If both are given, `pdfUrl` wins. A PDF on another site is shown in the viewer only if that site allows it; the **Open** button always works, and **Save offline** keeps the page but not that PDF. It appears on the home page, the blog list and at `/pages/blog-view.html?id=N` automatically. Add that URL to `sitemap/sitemap.xml` too. |
| **Start a new coupon offer** | Edit `resources/data/offers30.json`. Change `validUntil` (the text shown), `expiresAt` (the exact end time for the countdown, e.g. `2026-12-31T23:59:00+05:30`) and the course links. When the time passes, the countdown switches to "offer has ended" by itself. |
| **Add a Udemy course** | In `pages/courses.html`, copy one `<article class="… course">` block. Change `data-category`, the image file name (from the Udemy image URL), the link and the title. If it's a new category, also add a filter button for it. |
| **Add a YouTube playlist** | In `pages/videos.html`, copy one `<article class="… pl">` block and change the link, the title and the `h-XXX` color class. |
| **Change the Portal link** | Edit `portal:` in the **SITE SETTINGS** block of `js/site.js`. That is the only place the address is written; the footer link and every Portal button on the home page follow it. |
| **Change the menu, footer, email or social links** | Edit the **SITE SETTINGS** block at the top of `js/site.js`. Every page updates. |
| **Change colors** | Edit the variables at the top of `css/style.css`: section 2 for light mode, then the `[data-theme='dark']` block for dark mode. |
| **Add a technology color** | Add one line such as `.h-SOA { --h: 210; }` in the "TECHNOLOGY COLORS" section of `css/style.css`. |
| **Turn on blog comments** | Fill in `giscus` in `js/site.js` with the values from https://giscus.app. |

## Header, footer and loading spinner

Every page has two placeholders, `<div data-include="header">` and `<div data-include="footer">`. `js/site.js` fills them in instantly, with no extra file downloads. A small branded spinner covers the page until that's done. On a slow connection the spinner stays until the page is ready. If JavaScript is blocked entirely, the spinner hides itself after 3 seconds.

## Testing locally (VS Code Live Server)

1. In VS Code, use File → Open Folder and open **this folder** (the one containing `index.html`).
2. Click **Go Live**. The site opens at http://127.0.0.1:5500/.

Links start with `/` (like `/css/style.css`), so the folder you open must be the site's root folder, exactly like on GitHub Pages.

## Publishing on GitHub Pages

Replace your repository's files with the contents of this folder and push. Keep Pages set to **Deploy from a branch → main → / (root)**. `CNAME` (beenumlearning.com) is included.

You can delete these old files; nothing uses them any more: `fragments/`, `css/indexpage.css`, `css/about.css`, `css/blogs.css`, `css/courses.css`, `css/offers30.css`, `css/onlinetraining.css`, `js/include.js`, `js/darkmode.js`, `js/pwa.js`, `js/belt.js`, `js/email.js`, `js/constants.js`, `js/cookie-consent.js`, `js/home-blogs.js`, `js/blog-cover.js`, `js/blog-view.js`, `js/courses-filter.js`, `js/offers30.js`, `js/giscus-init.js`, `resources/images/`.

## About the offline app (service worker)

`sw.js` caches the site so it works offline and can be installed like an app.

- **You don't need to bump a version number when you edit pages, CSS, JS or JSON.** These are always fetched fresh when the visitor is online, and the cache is only a fallback for offline use.
- **Only change `CACHE_VERSION` in `sw.js`** if you rename or remove one of the files listed in its `PRECACHE` list.
- **If something looks stale while you're testing locally,** click "Refresh" on the "new version" message, or use DevTools → Application → Service workers → **Update on reload**.

## Fonts

The fonts are Sora, Inter and JetBrains Mono, self-hosted under the SIL Open Font License (licenses in `fonts/`).
