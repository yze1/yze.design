document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".column-masonry");
    if (!container) return;

    const response = await fetch("/archive/archive.json");
    if (!response.ok) throw new Error("Could not load archive");
    const items = await response.json();
    container.innerHTML = items.map(item => `
        <div class="archive-item-container">
            <img src="${item.path}" alt="${item.name}" loading="lazy" class="archive-image">
        </div>
    `).join("");
});
