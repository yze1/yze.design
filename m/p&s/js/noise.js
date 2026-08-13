function setNoise(enabled) {
    document.documentElement.classList.toggle("noise-on", enabled);
}

globalThis.PSNoise = { set: setNoise, toggle: () => setNoise(!document.documentElement.classList.contains("noise-on")) };
setNoise(document.documentElement.dataset.noise !== "off");
