function fitSpreadText() {
    document.querySelectorAll(".spread").forEach(element => {
        const container = element.parentElement;

        // Remove the previous calculated size.
        element.style.fontSize = "";

        const naturalWidth = element.scrollWidth;
        const availableWidth = container.clientWidth;

        if (!naturalWidth || !availableWidth) return;

        const naturalFontSize = parseFloat(
            getComputedStyle(element).fontSize
        );

        const scale = availableWidth / naturalWidth;

        element.style.fontSize = `${naturalFontSize * scale}px`;
    });

    document.querySelectorAll(".spread-links").forEach(element => {
        element.style.display = "flex";
        element.style.justifyContent = "space-between";
        element.style.width = "100%";
    });
}

function scheduleSpreadUpdate() {
    requestAnimationFrame(fitSpreadText);
}

document.addEventListener("DOMContentLoaded", scheduleSpreadUpdate);
document.addEventListener("partialsloaded", scheduleSpreadUpdate);
window.addEventListener("load", scheduleSpreadUpdate);
window.addEventListener("resize", scheduleSpreadUpdate);

document.fonts?.ready.then(scheduleSpreadUpdate);


function updateUnderlaps() {
    const underlaps = [...document.querySelectorAll("section.underlap")];

    // Restore natural document flow before measuring.
    underlaps.forEach(section => {
        section.style.setProperty("--underlap-offset", "0px");
    });

    // Measure the distance between each section and its previous section.
    const measurements = underlaps.map(section => {
        const previousSibling = section.previousElementSibling;
        const previousSection = previousSibling?.matches("section")
            ? previousSibling
            : previousSibling?.querySelector(":scope > section:last-child");

        if (!previousSection) {
            return { section, offset: 0 };
        }

        const sectionTop = section.getBoundingClientRect().top;
        const previousTop = previousSection.getBoundingClientRect().top;

        return {
            section,
            offset: sectionTop - previousTop
        };
    });

    // Pull each section upwards by the measured distance.
    measurements.forEach(({ section, offset }) => {
        section.style.setProperty(
            "--underlap-offset",
            `${-offset}px`
        );
    });
}

const scheduleUnderlapUpdate = (() => {
    let frame;

    return () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(updateUnderlaps);
    };
})();

document.addEventListener("DOMContentLoaded", scheduleUnderlapUpdate);
document.addEventListener("partialsloaded", scheduleUnderlapUpdate);
window.addEventListener("load", scheduleUnderlapUpdate);
window.addEventListener("resize", scheduleUnderlapUpdate);

document.fonts?.ready.then(scheduleUnderlapUpdate);

const underlapObserver = new ResizeObserver(scheduleUnderlapUpdate);

document.querySelectorAll("section").forEach(section => {
    underlapObserver.observe(section);
});

document.addEventListener("DOMContentLoaded", () => {
    const time = document.querySelector("#london-time");
    if (time) {
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
    }

    const logos = document.querySelector("#logos-track");
    if (logos) {
        const files = ["food.svg", "tate.svg", "anthropic.svg", "ual.svg"];
        const set = files.map(file =>
            `<div class="logo-item"><img src="/assets/logos/${file}" alt=""></div>`
        ).join("").repeat(3);
        logos.innerHTML = `<div class="logos-set">${set}</div>`.repeat(2);
    }
});
