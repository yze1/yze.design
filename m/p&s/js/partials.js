const projectRoot = new URL("../../", document.currentScript.src);

function updateHeaderColor() {
    const header = document.querySelector("#header");
    if (!header?.firstElementChild) return;

    const y = header.getBoundingClientRect().height / 2;
    header.classList.toggle("over-red", [...document.querySelectorAll("section.red")].some(section => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= y && bounds.bottom >= y;
    }));
}

addEventListener("scroll", updateHeaderColor, { passive: true });
addEventListener("resize", updateHeaderColor);
document.addEventListener("partialsloaded", updateHeaderColor);

async function loadPartial(selector, filePath) {
    const element = document.querySelector(selector);

    if (!element) {
        console.error(`Partial container not found: ${selector}`);
        return;
    }

    try {
        const response = await fetch(new URL(filePath, projectRoot), {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `Could not load ${filePath}: ${response.status}`
            );
        }

        element.innerHTML = await response.text();

        element.querySelectorAll("[href^='/']").forEach(link => {
            link.href = new URL(link.getAttribute("href").slice(1), projectRoot);
        });

        const theme = element.dataset.theme;

        if (theme && element.firstElementChild) {
            element.firstElementChild.classList.add(theme);
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const partials = [
        loadPartial(
            "#header",
            "p&s/partials/header.html"
        ),
        loadPartial(
            "#footer",
            "p&s/partials/footer.html"
        )
    ];

    if (document.querySelector("#contact-partial")) {
        partials.push(loadPartial(
            "#contact-partial",
            "p&s/partials/contact.html"
        ));
    }

    await Promise.all(partials);

    document.dispatchEvent(new Event("partialsloaded"));

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            const open = mobileMenu.classList.toggle("open");

            menuToggle.textContent = open ? "×" : "=";
            menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
            menuToggle.setAttribute("aria-expanded", String(open));
        });
    }

});
