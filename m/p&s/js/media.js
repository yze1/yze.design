const gallery = document.querySelector(".horizontal-gallery");
const galleryTrack = gallery?.querySelector(".horizontal-gallery__track");

if (galleryTrack) {
    fetch("./data/work.json")
        .then(response => {
            if (!response.ok) throw new Error(`Could not load work: ${response.status}`);
            return response.json();
        })
        .then(work => {
            galleryTrack.innerHTML = work.map((item, index) => `
                <article class="horizontal-gallery__item" style="--index: ${index}; --stack-left: ${index * 60}px">
                    <a href="${item.link}">
                        <img src="${item.thumbnail}" alt="${item.title}">
                    </a>
                    <div class="horizontal-gallery__meta">
                        <p>${item.title}</p>
                        <p>${item.year}</p>
                    </div>
                </article>
            `).join("");

            const items = [...galleryTrack.children];
            const updateCaptions = () => items.forEach((item, index) => {
                const nextItem = items[index + 1];
                item.classList.toggle("is-stacked", nextItem && nextItem.getBoundingClientRect().left - item.getBoundingClientRect().left < 150);
            });

            galleryTrack.addEventListener("scroll", updateCaptions, { passive: true });
            updateCaptions();
        })
        .catch(console.error);

    gallery.addEventListener("wheel", event => {
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        const atStart = galleryTrack.scrollLeft <= 0;
        const atEnd = galleryTrack.scrollLeft >= galleryTrack.scrollWidth - galleryTrack.clientWidth - 1;

        if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;

        event.preventDefault();
        galleryTrack.scrollLeft += delta;
    }, { passive: false });
}
