const mediaScriptUrl = document.currentScript.src;

function setupHoverGif(image) {
    const animatedSrc = image.dataset.animatedSrc;
    if (!animatedSrc) return;

    const stillSrc = image.src;
    const play = () => { image.src = animatedSrc; };
    const pause = () => { image.src = stillSrc; };

    image.addEventListener("pointerenter", play);
    image.addEventListener("pointerleave", pause);
}

document.querySelectorAll("img[data-animated-src]").forEach(setupHoverGif);

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
    const stage = carousel.querySelector(".portfolio-carousel__stage");
    const clamp = value => Math.min(1, Math.max(0, value));
    const lerp = (start, end, amount) => start + (end - start) * amount;
    const posterFor = source => source.replace("/gifs/", "/gifs/posters/").replace(/\.gif$/i, ".webp");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cards = [];
    let targetProgress = 0;
    let currentProgress = 0;
    let cardWidth = 0;
    let expandedStep = 0;
    let compressedStep = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartProgress = 0;

    function measure() {
        cardWidth = cards[0]?.getBoundingClientRect().width || 0;
        expandedStep = cardWidth + parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--gutter"));
        compressedStep = Math.max(32, cardWidth * 0.12);
    }

    function positions(activeIndex) {
        const result = [];
        let x = 0;

        cards.forEach((card, index) => {
            result[index] = x;
            x += lerp(compressedStep, expandedStep, Math.max(0, 1 - Math.abs(index - activeIndex)));
        });

        return result;
    }

    function render(progress) {
        if (!cards.length) return;

        const activeIndex = progress * (cards.length - 1);
        const cardPositions = positions(activeIndex);
        const lower = Math.floor(activeIndex);
        const upper = Math.min(lower + 1, cards.length - 1);
        const activeX = lerp(cardPositions[lower], cardPositions[upper], activeIndex - lower);
        const centeredOffset = carousel.clientWidth / 2 - activeX - cardWidth / 2;
        const offset = centeredOffset - (carousel.clientWidth / 2 - cardWidth / 2) * (1 - progress);

        cards.forEach((card, index) => {
            card.style.transform = `translate3d(${offset + cardPositions[index]}px, -50%, 0)`;
            const distance = Math.abs(index - activeIndex);
            const opacity = Math.max(0, 1 - distance * 2);
            const caption = card.querySelector(".portfolio-carousel__caption");
            caption.style.opacity = opacity;
            caption.style.transform = `translate3d(0, ${lerp(8, 0, opacity)}px, 0)`;
        });
    }

    function frame() {
        currentProgress = reducedMotion ? targetProgress : lerp(currentProgress, targetProgress, 0.08);
        render(currentProgress);
        requestAnimationFrame(frame);
    }

    fetch(new URL("../data/carousel.json", mediaScriptUrl))
        .then(response => {
            if (!response.ok) throw new Error(`Could not load carousel: ${response.status}`);
            return response.json();
        })
        .then(items => {
            console.assert(items.every(item => item.link && item.title && item.year), "Invalid carousel item");

            items.forEach((item, index) => {
                const card = document.createElement("article");
                const media = document.createElement("div");
                const image = document.createElement("img");
                const caption = document.createElement("div");
                const title = document.createElement("p");
                const year = document.createElement("p");

                card.className = "portfolio-carousel__card";
                card.style.zIndex = index + 1;
                media.className = "portfolio-carousel__media";
                image.src = posterFor(item.link);
                image.dataset.animatedSrc = item.link;
                image.alt = item.title;
                image.loading = index < 3 ? "eager" : "lazy";
                caption.className = "portfolio-carousel__caption";
                title.textContent = item.title;
                year.textContent = item.year;
                caption.append(title, year);
                media.append(image);
                card.append(media, caption);
                stage.append(card);
                setupHoverGif(image);
            });

            cards = [...stage.children];
            measure();
            render(0);
            requestAnimationFrame(frame);
            new ResizeObserver(measure).observe(carousel);
        })
        .catch(console.error);

    carousel.addEventListener("wheel", event => {
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if ((delta < 0 && targetProgress === 0) || (delta > 0 && targetProgress === 1)) return;
        event.preventDefault();
        targetProgress = clamp(targetProgress + delta * 0.0005);
    }, {passive: false});

    stage.addEventListener("pointerdown", event => {
        dragging = true;
        dragStartX = event.clientX;
        dragStartProgress = targetProgress;
        stage.setPointerCapture(event.pointerId);
    });

    stage.addEventListener("pointermove", event => {
        if (!dragging) return;
        targetProgress = clamp(dragStartProgress - (event.clientX - dragStartX) / (carousel.clientWidth * 1.5));
    });

    stage.addEventListener("pointerup", () => { dragging = false; });
    stage.addEventListener("pointercancel", () => { dragging = false; });
}
