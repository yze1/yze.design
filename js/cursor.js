function customCursor() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";

    // Custom cursor labels are deliberately disabled for now.
    // const label = document.createElement("span");
    // label.className = "custom-cursor-label";
    // cursor.appendChild(label);

    document.body.appendChild(cursor);

    function colorUnderPointer(element) {
        if (document.body.classList.contains("mobile-menu-open")) return "light";
        if (element?.closest("#footer, .footer")) return "light";
        if (element?.closest(".landing-hero") && !matchMedia("(max-width: 768px)").matches) return "light";

        for (let node = element; node && node !== document; node = node.parentElement) {
            const match = getComputedStyle(node).backgroundColor.match(
                /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
            );
            if (match && (match[4] === undefined || Number(match[4]) > 0)) {
                const [, red, green, blue] = match.map(Number);
                return (red * 299 + green * 587 + blue * 114) / 1000 < 128
                    ? "light"
                    : "dark";
            }
        }
        return "dark";
    }

    document.addEventListener("mousemove", event => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;

        const target = document.elementFromPoint(event.clientX, event.clientY);
        const hover = target?.closest("a, button");
        cursor.classList.toggle("hover-link", Boolean(hover));
        cursor.classList.toggle("cursor-light", !hover && colorUnderPointer(target) === "light");
        cursor.classList.toggle("cursor-dark", !hover && colorUnderPointer(target) === "dark");
    });
}

document.addEventListener("DOMContentLoaded", customCursor);
