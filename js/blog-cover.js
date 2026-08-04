/* ============================================================
   Shared blog category → small pill badge helper.
   Renders a compact colored tag (like the .tag pills used
   elsewhere on the site) instead of a large cover banner.
   ============================================================ */
(function () {
    const KNOWN_CATEGORIES = ["OIC", "VBCS", "OCI", "Fusion", "APEX", "Database", "OPA", "Others"];

    function escapeHtml(str) {
        return String(str == null ? "" : str).replace(/[&<>"']/g, s => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[s]));
    }

    window.categoryPillClass = function (category) {
        const cat = KNOWN_CATEGORIES.includes(category) ? category : "Others";
        return "cat-" + cat;
    };

    window.categoryPillHtml = function (category) {
        if (!category) return "";
        const cls = window.categoryPillClass(category);
        return `<span class="cat-pill ${cls}">${escapeHtml(category)}</span>`;
    };
})();
