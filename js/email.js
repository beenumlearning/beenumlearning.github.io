function applyEmail() {
    const email = window.BEENUM ? BEENUM.EMAIL : null;
    if (!email) {
        setTimeout(applyEmail, 100);
        return;
    }

    let found = false;

    /* Update all email-link elements */
    const emailLinks = document.querySelectorAll("#email-link");
    emailLinks.forEach(el => {
        if (el) {
            el.href = "mailto:" + email;

            if (!el.textContent.trim()) {
                el.textContent = email;
            }

            found = true;
        }
    });

    /* Update announcement offer tiles */
    const offer50 = document.getElementById("offer-50");
    const offer30 = document.getElementById("offer-30");

    if (offer50) {
        offer50.href = "mailto:" + email + "?subject=30% OFF on Online Courses | I want to know more";
        found = true;
    }

    if (offer30) {
        offer30.href = "mailto:" + email + "?subject=10% OFF on Online Training | I want to know more";
        found = true;
    }

    /* Retry until footer + tiles exist */
    if (!found) {
        setTimeout(applyEmail, 100);
    }
}

document.addEventListener("DOMContentLoaded", applyEmail);
