let blogs = [];
let currentIndex = 0;
const batchSize = 25;

async function loadBlogs() {
    const res = await fetch("/resources/data/blogs.json");
    const data = await res.json();

    // Sort by date
    blogs = data.blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    loadMore();
}

function loadMore() {
    const container = document.getElementById("blogs-container");

    const nextBatch = blogs.slice(currentIndex, currentIndex + batchSize);

    nextBatch.forEach(blog => {
        const tile = document.createElement("div");
        tile.className = "blog-tile";
        tile.onclick = () => {
            window.location.href =
                `blog-view.html?file=${blog.file}&title=${encodeURIComponent(blog.title)}&date=${blog.date}&video=${encodeURIComponent(blog.video || "")}`;
        };


        tile.innerHTML = `
            <h3>${blog.title}</h3>
            <p class="blog-subtitle">View full details →</p>
        `;

        container.appendChild(tile);
    });

    currentIndex += batchSize;

    if (currentIndex >= blogs.length) {
        document.getElementById("load-more-btn").style.display = "none";
    }
}

document.getElementById("load-more-btn").addEventListener("click", loadMore);

loadBlogs();
