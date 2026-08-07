const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
    });
}, {threshold: 0.08});

function observeContent() {
    document.querySelectorAll("section:not(.nav) > div:not(.load-reveal)").forEach(element => {
        element.classList.add("load-reveal");
        revealObserver.observe(element);
    });
}

observeContent();
document.addEventListener("contentloaded", observeContent);
