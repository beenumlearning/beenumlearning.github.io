let blogs = [];
let filteredBlogs = [];
let currentIndex = 0;
const batchSize = 25;

async function loadBlogs() {
    const res = await fetch("/resources/data/blogs.json");
    const data = await res.json();

    // Sort by date (newest first)
    blogs = data.blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Initially show all blogs
    filteredBlogs = blogs;

    renderBlogs();
}

function renderBlogs() {
    const container = document.getElementById("blogs-container");

    // Clear only when starting fresh
    if (currentIndex === 0) {
        container.innerHTML = "";
    }

    const nextBatch = filteredBlogs.slice(currentIndex, currentIndex + batchSize);

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

    // Hide Load More if no more blogs
    document.getElementById("load-more-btn").style.display =
        currentIndex >= filteredBlogs.length ? "none" : "block";
}

function applyFilters() {
    const searchValue = document.getElementById("search-input").value.toLowerCase();
    const categoryValue = document.getElementById("category-filter").value;

    filteredBlogs = blogs.filter(blog => {
        const matchesCategory = categoryValue === "all" || blog.category === categoryValue;
        const matchesSearch = blog.title.toLowerCase().includes(searchValue);
        return matchesCategory && matchesSearch;
    });

    // Reset pagination
    currentIndex = 0;

    renderBlogs();
}

// Event listeners
document.getElementById("load-more-btn").addEventListener("click", renderBlogs);
document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("category-filter").addEventListener("change", applyFilters);

// Load initial blogs
loadBlogs();
