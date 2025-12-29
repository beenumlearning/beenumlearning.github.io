async function loadBlog() {
    const params = new URLSearchParams(window.location.search);

    const file = params.get("file");
    const title = params.get("title");
    const date = params.get("date");

    document.getElementById("blog-title").textContent = title;
    document.getElementById("blog-date").textContent = "Published on: " + date;

    // Load PDF directly
    document.getElementById("pdf-viewer").src = `../blogs/${file}#view=FitH`;
    document.getElementById("pdf-download-link").href = `../blogs/${file}`;

}

loadBlog();
