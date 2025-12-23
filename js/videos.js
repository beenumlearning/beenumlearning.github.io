document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById("year-copyright");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
