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
