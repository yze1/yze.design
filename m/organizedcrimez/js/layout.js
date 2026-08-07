const LAYOUT_PROJECT_ROOT_URL = new URL("../", document.currentScript.src);

function layoutProjectUrl(path = "") {
    return new URL(path.replace(/^\/+/, ""), LAYOUT_PROJECT_ROOT_URL).href;
}

function rewriteProjectUrls(container) {
    container.querySelectorAll("[data-project-src]").forEach((element) => {
        element.src = layoutProjectUrl(element.getAttribute("data-project-src"));
    });

    container.querySelectorAll("[data-project-href]").forEach((element) => {
        element.href = layoutProjectUrl(element.getAttribute("data-project-href"));
    });

    container.querySelectorAll("[data-social-icon]").forEach((element) => {
        element.style.setProperty(
            "--social-icon",
            `url('${layoutProjectUrl(element.getAttribute("data-social-icon"))}')`,
        );
    });

    container.querySelectorAll("[src^='/']").forEach((element) => {
        element.src = layoutProjectUrl(element.getAttribute("src"));
    });

    container.querySelectorAll("[href='/'], [href^='/#'], [href^='/about']").forEach((element) => {
        const href = element.getAttribute("href");
        if (href === "/") {
            element.href = layoutProjectUrl("");
            return;
        }
        element.href = layoutProjectUrl(href);
    });

    container.querySelectorAll("[style*=\"url('/\"]").forEach((element) => {
        element.setAttribute(
            "style",
            element.getAttribute("style").replace(/url\('\/([^']+)'\)/g, (_, path) => `url('${layoutProjectUrl(path)}')`),
        );
    });
}

async function loadPartial(targetSelector, url) {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Unable to load ${url}`);
    }
    target.innerHTML = await response.text();
    rewriteProjectUrls(target);
}

async function initLayout() {
    await Promise.all([
        loadPartial("[data-site-header]", layoutProjectUrl("partials/header.html")),
        loadPartial("[data-site-footer]", layoutProjectUrl("partials/footer.html")),
    ]);
    document.dispatchEvent(new CustomEvent("site-layout:loaded"));
}

document.addEventListener("DOMContentLoaded", () => {
    initLayout().catch(() => {
        document.dispatchEvent(new CustomEvent("site-layout:loaded"));
    });
});
