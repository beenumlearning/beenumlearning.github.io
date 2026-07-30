function applyEmail() {
    const email = window.BEENUM ? BEENUM.EMAIL : null;
    const whatsapp = window.BEENUM ? BEENUM.WHATSAPP : null;
    
    if (!email) {
        setTimeout(applyEmail, 100);
        return;
    }

    /* Update all email-link elements */
    const emailLinks = document.querySelectorAll("#email-link");
    emailLinks.forEach(el => {
        el.href = "mailto:" + email;
        if (!el.textContent.trim()) {
            el.textContent = email;
        }
    });

    /* Update WhatsApp channel link */
    const whatsappLinks = document.querySelectorAll("#whatsapp-link");
    whatsappLinks.forEach(el => {
        el.href = whatsapp;
        if (!el.textContent.trim()) {
            el.textContent = "Join our WhatsApp Channel";
        }
    });

    /* Update announcement offer tiles */
    const trainingEmail = document.getElementById("training-email");
    if (trainingEmail) {
        trainingEmail.href = "mailto:" + email + "?subject=10% OFF | Training Inquiry | I want to know more";
    }

    const consult10 = document.getElementById("consulting-email");
    if (consult10) {
        consult10.href = "mailto:" + email + "?subject=10% OFF on Consulting & Project Support | I want to know more";
    }

    /* Strategic advisory email button */
    const consultLink = document.getElementById("consult-email-link");
    if (consultLink) {
        consultLink.href = "mailto:" + email + "?subject=Strategic Cloud & AI Advisory Inquiry";
    }
    const consultAddr = document.getElementById("consult-email-addr");
    if (consultAddr) {
        consultAddr.textContent = email;
    }

    /* Instructor tile email trigger */
    const emailTiles = document.querySelectorAll(".team-email-trigger");
    emailTiles.forEach(tile => {
        tile.style.cursor = "pointer";
        tile.onclick = () => {
            window.location.href = "mailto:" + email + "?subject=Contact from About Page";
        };
    });
}

document.addEventListener("DOMContentLoaded", applyEmail);
