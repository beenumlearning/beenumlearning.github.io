// Load RAW text content into any element with data-raw="filename"
document.addEventListener("DOMContentLoaded", () => {

    const rawElements = document.querySelectorAll("[data-raw]");

    rawElements.forEach(el => {
        const fileName = el.getAttribute("data-raw");

        fetch(`/resources/offers/${fileName}.txt`)
            .then(res => res.text())
            .then(text => {
                el.textContent = text; // preserves raw text exactly as-is
            })
            .catch(err => console.error(`Error loading ${fileName}:`, err));
    });

});
