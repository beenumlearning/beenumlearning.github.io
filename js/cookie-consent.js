// Wait until DOM is ready AND the fragment container exists
document.addEventListener("DOMContentLoaded", function () {

    // Wait until #cookie-banner-container is actually in the DOM
    const checkContainer = setInterval(() => {
        const container = document.getElementById("cookie-banner-container");
        if (container) {
            clearInterval(checkContainer);
            loadCookieBanner(container);
        }
    }, 50);
});


// Load the fragment
function loadCookieBanner(container) {
    fetch("/fragments/cookie-banner.html")
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;
            initCookieConsent(); // Now banner exists
        })
        .catch(err => console.error("Cookie banner load error:", err));
}


// ===============================
// COOKIE CONSENT LOGIC
// ===============================
function initCookieConsent() {

    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept");
    const rejectBtn = document.getElementById("cookie-reject");

    if (!banner) {
        console.error("Cookie banner not found after fragment load");
        return;
    }

    // Show banner only if no consent stored
    if (!localStorage.getItem("ga_consent")) {
        banner.style.display = "flex";
    }

    // Accept
    acceptBtn.onclick = function () {
        localStorage.setItem("ga_consent", "granted");
        banner.style.display = "none";
        loadGoogleAnalytics();
    };

    // Reject
    rejectBtn.onclick = function () {
        localStorage.removeItem("ga_consent"); // show again next visit
        banner.style.display = "none";
    };

    // Load GA if already accepted
    if (localStorage.getItem("ga_consent") === "granted") {
        loadGoogleAnalytics();
    }
}


// ===============================
// Load Google Analytics dynamically
// ===============================
function loadGoogleAnalytics() {
    if (window.gaLoaded) return;
    window.gaLoaded = true;

    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-KZ590MJQXF";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", "G-KZ590MJQXF");
}
