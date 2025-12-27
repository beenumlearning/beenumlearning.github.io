// Inject favicon if missing
if (!document.querySelector("link[rel='icon']")) {
    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/jpeg";
    favicon.href = "/resources/logo/logos.jpg";
    document.head.appendChild(favicon);
}

// Load header
const header = document.querySelector("[data-include='header']");
if (header) {
    fetch("/fragments/header.html")
        .then(res => res.text())
        .then(html => {
            header.innerHTML = html;
        })
        .catch(err => console.error("Header load error:", err));
}

// Load footer
const footer = document.querySelector("[data-include='footer']");
if (footer) {
    fetch("/fragments/footer.html")
        .then(res => res.text())
        .then(html => {
            footer.innerHTML = html;

            // Update year
            const yearSpan = document.getElementById("year-copyright");
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }
        })
        .catch(err => console.error("Footer load error:", err));
}
