// Toggle the mobile nav and keep aria-expanded in sync for screen readers
window.toggleMobileNav = function () {
    const isOpen = document.body.classList.toggle("nav-open");
    const btn = document.getElementById("nav-toggle-btn");
    if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
};

window.closeMobileNav = function () {
    document.body.classList.remove("nav-open");
    const btn = document.getElementById("nav-toggle-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
};

// Close the mobile nav on: Escape key, backdrop tap, or tapping a nav link
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        window.closeMobileNav();
        const btn = document.getElementById("nav-toggle-btn");
        if (btn) btn.focus();
    }
});

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "nav-backdrop") window.closeMobileNav();
});

document.addEventListener("click", (e) => {
    const nav = document.getElementById("site-nav");
    if (nav && e.target.closest && nav.contains(e.target) && e.target.closest("a")) {
        window.closeMobileNav();
    }
});

// Highlight the current page in the nav for sighted + screen-reader users
function markActiveNavLink() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    const currentPath = window.location.pathname.replace(/\/index\.html$/, "/") || "/";
    nav.querySelectorAll("a").forEach(link => {
        const linkPath = new URL(link.href).pathname.replace(/\/index\.html$/, "/") || "/";
        if (linkPath === currentPath || (currentPath === "/" && linkPath === "/")) {
            link.classList.add("nav-active");
            link.setAttribute("aria-current", "page");
        }
    });
}

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
            // Inject theme icon now that button exists in DOM
            if (window.applyThemeToButton) window.applyThemeToButton();
            // Wire up + show/hide the install icon now that it exists in DOM
            if (window.initPwaInstallButton) window.initPwaInstallButton();
            markActiveNavLink();
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
