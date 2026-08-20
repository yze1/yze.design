document.documentElement.classList.toggle("noise-on", document.documentElement.dataset.noise !== "off");

addEventListener("keydown", event => {
    if (event.key.toLowerCase() === "n" && !event.target.closest?.("input, textarea, [contenteditable]")) {
        document.documentElement.classList.toggle("noise-debug");
    }
});
