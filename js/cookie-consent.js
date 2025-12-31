// ===============================
// COOKIE CONSENT + GOOGLE ANALYTICS
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept");
    const rejectBtn = document.getElementById("cookie-reject");

    if (!banner) return;

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
        localStorage.setItem("ga_consent", "denied");
        banner.style.display = "none";
    };

    // Load GA if already accepted
    if (localStorage.getItem("ga_consent") === "granted") {
        loadGoogleAnalytics();
    }
});

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
