const partialRoot = new URL("../", document.currentScript.src);

async function loadPartial(selector, path) {
    const element = document.querySelector(selector);
    if (!element) return;

    const response = await fetch(new URL(path, partialRoot));
    if (!response.ok) throw new Error(`Could not load ${path}`);
    element.innerHTML = await response.text();
}

document.addEventListener("DOMContentLoaded", () =>
    Promise.all([
        loadPartial("#header", "partials/header.html"),
        loadPartial("#footer", "partials/footer.html")
    ]).then(() => {
        const toggle = document.querySelector(".mobile-menu-toggle");
        toggle?.addEventListener("click", () => {
            const open = document.body.classList.toggle("mobile-menu-open");
            toggle.setAttribute("aria-expanded", String(open));
            toggle.textContent = open ? "\\close" : "==";
        });
    }).catch(console.error)
);
