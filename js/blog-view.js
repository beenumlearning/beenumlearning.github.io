async function loadBlog() {
    const params = new URLSearchParams(window.location.search);

    const file = params.get("file");
    const title = params.get("title");
    const date = params.get("date");
    const video = params.get("video");   // ✅ THIS WAS MISSING

    document.getElementById("blog-title").textContent = title;
    document.getElementById("blog-date").textContent = "Published on: " + date;

    // Load PDF directly
    document.getElementById("pdf-viewer").src = `../blogs/${file}#view=FitH`;
    document.getElementById("pdf-download-link").href = `../blogs/${file}`;

    // YouTube embed 
    if (video) {
        const videoContainer = document.getElementById("video-container");
        const videoHeading = document.getElementById("video-heading");

        // Convert normal YouTube link to embed format
        const embedUrl = video
            .replace("youtu.be/", "www.youtube.com/embed/")
            .replace("watch?v=", "embed/");

        // Show heading
        videoHeading.textContent = "Related Video for This Blog";
        videoHeading.style.display = "block";

        // Insert video
        videoContainer.innerHTML = `
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
