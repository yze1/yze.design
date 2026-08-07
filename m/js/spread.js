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
}

function scheduleSpreadUpdate() {
    requestAnimationFrame(fitSpreadText);
}

document.addEventListener("DOMContentLoaded", scheduleSpreadUpdate);
window.addEventListener("load", scheduleSpreadUpdate);
window.addEventListener("resize", scheduleSpreadUpdate);

document.fonts?.ready.then(scheduleSpreadUpdate);