async function loadBlog() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    if (!id) {
        document.getElementById("blog-title").textContent = "Invalid Blog ID";
        return;
    }

    // Load blogs.json
    const res = await fetch("/resources/data/blogs.json");
    const data = await res.json();

    // Find the blog by ID
    const blog = data.blogs.find(b => b.id === id);

    if (!blog) {
        document.getElementById("blog-title").textContent = "Blog Not Found";
        return;
    }

    // Populate UI
    document.title = blog.title + " | BEENUM LEARNING";
    document.getElementById("blog-title").textContent = blog.title;
    document.getElementById("blog-date").textContent = "Published on: " + blog.date;

    // Small category pill above the title
    const coverSlot = document.getElementById("blog-cover-slot");
    if (coverSlot) {
        coverSlot.innerHTML = window.categoryPillHtml ? window.categoryPillHtml(blog.category) : "";
    }

    // Related posts: same category, excluding this post, up to 3
    const relatedContainer = document.getElementById("related-posts");
    if (relatedContainer) {
        const related = data.blogs
            .filter(b => b.id !== blog.id && b.category === blog.category)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        if (related.length) {
            const escapeHtml = (str) => String(str == null ? "" : str).replace(/[&<>"']/g, s => ({
                "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
            }[s]));

            relatedContainer.innerHTML = `
                <h2>Related Posts</h2>
                <div class="related-posts-grid">
                    ${related.map(b => `
                        <a class="related-post-card" href="blog-view.html?id=${b.id}">
                            ${window.categoryPillHtml ? window.categoryPillHtml(b.category) : ""}
                            <h3>${escapeHtml(b.title)}</h3>
                        </a>
                    `).join("")}
                </div>
            `;
        }
    }

    const blogUrl = `https://beenumlearning.com/pages/blog-view.html?id=${blog.id}`;

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", blogUrl);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", blogUrl);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", blog.title + " | BEENUM LEARNING");

    if (blog.summary) {
        document.getElementById("blog-summary").innerHTML = `<p>${blog.summary}</p>`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && blog.excerpt) metaDesc.setAttribute("content", blog.excerpt);

        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (!ogDesc) {
            ogDesc = document.createElement("meta");
            ogDesc.setAttribute("property", "og:description");
            document.head.appendChild(ogDesc);
        }
        if (blog.excerpt) ogDesc.setAttribute("content", blog.excerpt);
    }

    // Article structured data (JSON-LD) — helps Google recognize this as a real, dated article
    const articleSchema = document.createElement("script");
    articleSchema.type = "application/ld+json";
    articleSchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blog.title,
        "description": blog.excerpt || "",
        "datePublished": blog.date,
        "dateModified": blog.date,
        "author": { "@type": "Organization", "name": "BEENUM LEARNING" },
        "publisher": {
            "@type": "Organization",
            "name": "BEENUM LEARNING",
            "logo": { "@type": "ImageObject", "url": "https://beenumlearning.com/resources/logo/favicon.png" }
        },
        "mainEntityOfPage": { "@type": "WebPage", "@id": blogUrl }
    });
    document.head.appendChild(articleSchema);

    // PDF
    document.getElementById("pdf-viewer").src = `../blogs/${blog.file}#view=FitH`;
    document.getElementById("pdf-download-link").href = `../blogs/${blog.file}`;

    // YouTube
    if (blog.video) {
        const embedUrl = blog.video
            .replace("youtu.be/", "www.youtube.com/embed/")
            .replace("watch?v=", "embed/");

        document.getElementById("video-heading").textContent = "Related Video for This Blog";
        document.getElementById("video-heading").style.display = "block";

        document.getElementById("video-container").innerHTML = `
            <iframe class="youtube-frame"
                src="${embedUrl}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;
    }
}

loadBlog();
