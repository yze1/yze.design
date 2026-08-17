function setupContact() {
    const form = document.querySelector(".mailing-list-form");
    const heading = document.querySelector("#contact h2");

    if (form && heading && !form.dataset.contactReady) {
        form.dataset.contactReady = "true";
        const matchHeadingWidth = () => form.style.width = `${heading.getBoundingClientRect().width * 0.75}px`;
        new ResizeObserver(matchHeadingWidth).observe(heading);
        document.fonts?.ready.then(matchHeadingWidth);
        matchHeadingWidth();

        form.addEventListener("submit", event => {
            event.preventDefault();
            if (form.reportValidity()) form.dispatchEvent(new CustomEvent("mailinglistsubmit", {
                bubbles: true,
                detail: { email: form.elements.email.value }
            }));
        });
    }

    document.querySelectorAll(".holding-header a[href$='/contact/']").forEach(link => {
        link.href = "#contact";
    });
}

document.addEventListener("DOMContentLoaded", setupContact);
document.addEventListener("partialsloaded", setupContact);
