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
    document.getElementById("blog-title").textContent = blog.title;
    document.getElementById("blog-date").textContent = "Published on: " + blog.date;

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
