function updateLayout() {
    document.querySelectorAll(".spread:not(.gong-frame .spread)").forEach(element => {
        element.style.fontSize = "";

        const parent = element.parentElement;
        const style = getComputedStyle(parent);
        const availableWidth = parent.clientWidth
            - parseFloat(style.paddingLeft)
            - parseFloat(style.paddingRight);

        if (element.scrollWidth && availableWidth) {
            const fontSize = parseFloat(getComputedStyle(element).fontSize);
            element.style.fontSize = `${fontSize * availableWidth / element.scrollWidth}px`;
        }
    });

    document.querySelectorAll(".spacer, .spacer-mini").forEach(spacer => {
        if (spacer.previousElementSibling) {
            spacer.style.width = `${spacer.previousElementSibling.getBoundingClientRect().width}px`;
        }
    });

    const footerLogo = document.querySelector("#footer .footer-logo h2");
    const footerLinks = document.querySelector("#footer .footer-nav .spread-links");

    if (footerLogo && footerLinks) {
        footerLogo.style.fontSize = "";

        if (matchMedia("(min-width: 1025px)").matches) {
            const logoHeight = footerLogo.getBoundingClientRect().height;
            const linksHeight = footerLinks.getBoundingClientRect().height;

            if (logoHeight && linksHeight) {
                const fontSize = parseFloat(getComputedStyle(footerLogo).fontSize);
                footerLogo.style.fontSize = `${fontSize * linksHeight / logoHeight}px`;
            }
        }
    }

    const underlaps = [...document.querySelectorAll("section.underlap")];
    underlaps.forEach(section => section.style.setProperty("--underlap-offset", "0px"));
    underlaps.forEach(section => {
        const sibling = section.previousElementSibling;
        const previous = sibling?.matches("section")
            ? sibling
            : sibling?.querySelector(":scope > section:last-child");

        if (previous) {
            section.style.setProperty(
                "--underlap-offset",
                `${Math.min(0, previous.getBoundingClientRect().top - section.getBoundingClientRect().top)}px`
            );
        }
    });
}

let layoutFrame;
function scheduleLayoutUpdate() {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(updateLayout);
}

document.addEventListener("DOMContentLoaded", scheduleLayoutUpdate);
document.addEventListener("partialsloaded", scheduleLayoutUpdate);
addEventListener("load", scheduleLayoutUpdate);
addEventListener("resize", scheduleLayoutUpdate);
document.fonts?.ready.then(scheduleLayoutUpdate);

document.addEventListener("DOMContentLoaded", () => {
    const time = document.querySelector("#london-time");
    if (!time) return;

    const tick = () => {
        time.textContent = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/London",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }).format(new Date());
    };

    tick();
    setInterval(tick, 1000);
});
