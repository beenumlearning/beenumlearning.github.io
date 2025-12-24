function applyEmail() {
    const emailLinks = document.querySelectorAll("#email-link");

    let found = false;

    emailLinks.forEach(el => {
        if (window.BEENUM && BEENUM.EMAIL) {
            el.href = "mailto:" + BEENUM.EMAIL;

            // If text is empty, fill with the email
            if (!el.textContent.trim()) {
                el.textContent = BEENUM.EMAIL;
            }

            found = true;
        }
    });

    // Footer loads late → retry until found
    if (!found) {
        setTimeout(applyEmail, 100);
    }
}

document.addEventListener("DOMContentLoaded", applyEmail);
