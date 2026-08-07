async function loadPartial(selector, filePath) {
    const element = document.querySelector(selector);

    if (!element) {
        console.error(`Partial container not found: ${selector}`);
        return;
    }

    try {
        const response = await fetch(filePath, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `Could not load ${filePath}: ${response.status}`
            );
        }

        element.innerHTML = await response.text();

        const theme = element.dataset.theme;

        if (theme && element.firstElementChild) {
            element.firstElementChild.classList.add(theme);
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        loadPartial(
            "#header",
            "/m/scy/partials/header.html"
        ),
        loadPartial(
            "#footer",
            "/m/scy/partials/footer.html"
        )
    ]);
    document.dispatchEvent(new Event("partialsloaded"));

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            const open = mobileMenu.classList.toggle("open");

            menuToggle.textContent = open ? "×" : "=";
            menuToggle.setAttribute("aria-expanded", String(open));
            menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });
    }
});
