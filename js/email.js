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
    const trainingEmail = document.getElementById("training-email");
    const consult10 = document.getElementById("consulting-email");



    if (trainingEmail) {
        trainingEmail.href = "mailto:" + email + "?subject=10% OFF | Training Inquiry | I want to know more";
        found = true;
    }

    if (consult10) {
        consult10.href = "mailto:" + email + "?subject=10% OFF on Consulting & Project Support | I want to know more";
        found = true;
    }

    /* Retry until footer + tiles exist */
    if (!found) {
        setTimeout(applyEmail, 100);
        return;
    }


    /* Instructor tile email trigger */
    /* Make all instructor tiles clickable for email */
    const emailTiles = document.querySelectorAll(".team-email-trigger");
    emailTiles.forEach(tile => {
        tile.style.cursor = "pointer";
        tile.onclick = () => {
            window.location.href = "mailto:" + email + "?subject=Contact from About Page";
        };
        found = true;
    });

}

document.addEventListener("DOMContentLoaded", applyEmail);
