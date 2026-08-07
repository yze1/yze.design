(() => {
  const CHARACTER_PATHS = [
    "assets/characters/SKIPPIES_SHAPE - CALM 1.svg",
    "assets/characters/SKIPPIES_SHAPE - CALM 2.svg",
    "assets/characters/SKIPPIES_SHAPE - HAPPY 1.svg",
    "assets/characters/SKIPPIES_SHAPE - HAPPY 2.svg",
    "assets/characters/SKIPPIES_SHAPE - JOYFUL.svg",
    "assets/characters/SKIPPIES_SHAPE - SHOCKED 1.svg",
    "assets/characters/SKIPPIES_SHAPE - SHOCKED 2.svg"
  ];

  const state = {
    loader: null,
    loaderCharacter: null,
    loaderIntervalId: null,
    loaderHideTimeoutId: null,
    loaderStartedAt: 0
  };

  function start() {
    state.loader = document.getElementById("site-loader");
    state.loaderCharacter = document.getElementById("site-loader-character");

    document.body.classList.add("is-loading");
    state.loaderStartedAt = Date.now();

    if (!state.loader || !state.loaderCharacter) {
      return;
    }

    let loaderIndex = 0;
    state.loaderCharacter.src = CHARACTER_PATHS[loaderIndex];

    state.loaderIntervalId = window.setInterval(() => {
      loaderIndex = (loaderIndex + 1) % CHARACTER_PATHS.length;
      state.loaderCharacter.src = CHARACTER_PATHS[loaderIndex];
    }, 500);
  }

  function hide() {
    const minVisibleDurationMs = 1300;
    const elapsed = Date.now() - state.loaderStartedAt;
    const remaining = Math.max(0, minVisibleDurationMs - elapsed);

    if (state.loaderHideTimeoutId) {
      window.clearTimeout(state.loaderHideTimeoutId);
    }

    state.loaderHideTimeoutId = window.setTimeout(() => {
      if (state.loaderIntervalId) {
        window.clearInterval(state.loaderIntervalId);
        state.loaderIntervalId = null;
      }

      document.body.classList.remove("is-loading");

      if (state.loader) {
        state.loader.classList.add("is-hidden");
      }

      state.loaderHideTimeoutId = null;
    }, remaining);
  }

  window.SkippiesLoader = { hide };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
