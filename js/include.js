// Inject favicon if missing
// Inject favicons if missing
if (!document.querySelector("link[rel='icon']")) {

    const icons = [
        {
            size: "32x32",
            href: "/resources/logo/favicon-32.png"
        },
        {
            size: "16x16",
            href: "/resources/logo/favicon-16.png"
        }
    ];

    icons.forEach(icon => {
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.sizes = icon.size;
        link.href = icon.href;
        document.head.appendChild(link);
    });
}


// Helper: hide loader
function hideLoader() {
    const loader = document.getElementById("page-loader");
    if (loader) {
        loader.classList.add("hide");
        setTimeout(() => loader.remove(), 500); // remove from DOM after fade-out
    }
}

// Load header + footer in parallel
const headerPromise = new Promise(resolve => {
    const header = document.querySelector("[data-include='header']");
    if (!header) return resolve();

    fetch("/fragments/header.html")
        .then(res => res.text())
        .then(html => {
            header.innerHTML = html;
            resolve();
        })
        .catch(err => {
            console.error("Header load error:", err);
            resolve();
        });
});

const footerPromise = new Promise(resolve => {
    const footer = document.querySelector("[data-include='footer']");
    if (!footer) return resolve();

    fetch("/fragments/footer.html")
        .then(res => res.text())
        .then(html => {
            footer.innerHTML = html;

            // Update year
            const yearSpan = document.getElementById("year-copyright");
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }

            resolve();
        })
        .catch(err => {
            console.error("Footer load error:", err);
            resolve();
        });
});

// When both header + footer are done → hide loader
Promise.all([headerPromise, footerPromise]).then(() => {
    hideLoader();
});
