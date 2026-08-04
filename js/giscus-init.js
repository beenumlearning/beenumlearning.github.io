/* ============================================================
   GISCUS COMMENTS (blog detail pages)
   Giscus is a free comment widget backed by GitHub Discussions —
   no server, no database, works fine on GitHub Pages.

   ⚠️ SETUP REQUIRED before this will work:
   1. Make sure the repo this site is deployed from is PUBLIC and
      has Discussions enabled (repo Settings → Features → Discussions).
   2. Install the giscus app on that repo: https://github.com/apps/giscus
   3. Go to https://giscus.app, fill in your repo name, and it will
      generate the exact data-repo-id / data-category / data-category-id
      values for you (pick "pathname" as the mapping, same as below).
   4. Replace the three placeholder values below with the real ones
      giscus.app gives you. Until then, the comments box simply won't
      appear — it fails silently, it won't break the page.
   ============================================================ */
(function () {
  const GISCUS_REPO = "YOUR-GITHUB-USERNAME/YOUR-REPO-NAME";       // e.g. "beenumlearning/beenumlearning.github.io"
  const GISCUS_REPO_ID = "YOUR_REPO_ID";                            // from giscus.app
  const GISCUS_CATEGORY = "General";                                 // Discussions category name
  const GISCUS_CATEGORY_ID = "YOUR_CATEGORY_ID";                    // from giscus.app

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function init() {
    const container = document.getElementById("giscus-comments");
    if (!container) return;

    // Don't even try if the placeholders haven't been filled in yet
    if (GISCUS_REPO.indexOf("YOUR-") === 0 || GISCUS_REPO_ID.indexOf("YOUR_") === 0) {
      container.style.display = "none";
      return;
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", GISCUS_REPO);
    script.setAttribute("data-repo-id", GISCUS_REPO_ID);
    script.setAttribute("data-category", GISCUS_CATEGORY);
    script.setAttribute("data-category-id", GISCUS_CATEGORY_ID);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", currentTheme());
    script.setAttribute("data-lang", "en");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;
    container.appendChild(script);

    // Keep the comment widget's theme in sync with the site's own dark-mode toggle
    const originalToggle = window.toggleTheme;
    if (typeof originalToggle === "function") {
      window.toggleTheme = function () {
        originalToggle();
        const iframe = document.querySelector("iframe.giscus-frame");
        if (iframe) {
          iframe.contentWindow.postMessage(
            { giscus: { setConfig: { theme: currentTheme() } } },
            "https://giscus.app"
          );
        }
      };
    }
  }

  init();
})();
