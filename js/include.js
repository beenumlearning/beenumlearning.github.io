document.addEventListener("DOMContentLoaded", () => {
    // Inject favicon into <head> if not already present 
    if (!document.querySelector("link[rel='icon']")) {
        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/jpeg";
        favicon.href = "/resources/logo/logos.jpg"; // must be in root 
        document.head.appendChild(favicon);
    }
    // Load header
    const header = document.querySelector("[data-include='header']");
    if (header) {
        fetch("/fragments/header.html")
            .then(res => res.text())
            .then(data => header.innerHTML = data);
    }

    // Load footer
    const footer = document.querySelector("[data-include='footer']");
    if (footer) {
        fetch("/fragments/footer.html")
            .then(res => res.text())
            .then(data => {
                footer.innerHTML = data;
                const yearSpan = document.getElementById("year-copyright");
                if (yearSpan) yearSpan.textContent = new Date().getFullYear();
            });
    }
});
