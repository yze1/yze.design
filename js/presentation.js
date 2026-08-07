const presentationRoot = new URL("./", location.href);
const image = document.querySelector("#slide-image");
const video = document.querySelector("#slide-video");
const notes = document.querySelector("#slide-notes");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
let slides = [];
let current = 0;
let audio;

function showSlide(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    const slide = slides[current];

    audio?.pause();
    audio = slide.audio ? new Audio(new URL(slide.audio, presentationRoot)) : null;
    audio?.play().catch(() => {});

    if (slide.video) {
        image.hidden = true;
        video.hidden = false;
        video.src = new URL(slide.video, presentationRoot);
        video.setAttribute("aria-label", `Slide ${slide.number}: ${slide.title}`);
        video.play().catch(() => {});
    } else {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.hidden = true;
        image.hidden = false;
        image.src = new URL(slide.image, presentationRoot);
    }

    image.alt = `Slide ${slide.number}: ${slide.title}`;
    notes.textContent = slide.notes;
    previous.setAttribute("aria-disabled", current === 0);
    next.setAttribute("aria-disabled", current === slides.length - 1);
}

previous.addEventListener("click", () => showSlide(current - 1));
next.addEventListener("click", () => showSlide(current + 1));
[previous, next].forEach(control => control.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") control.click();
}));
document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") showSlide(current - 1);
    if (event.key === "ArrowRight") showSlide(current + 1);
});

fetch(new URL("slides.json", presentationRoot))
    .then(response => {
        if (!response.ok) throw new Error("Could not load slides");
        return response.json();
    })
    .then(data => {
        slides = data;
        showSlide(0);
    })
    .catch(console.error);
