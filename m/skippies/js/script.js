(() => {
  const { Engine, World, Bodies, Body, Events } = Matter;

  const CONFIG = {
    characterPaths: [
      "assets/characters/SKIPPIES_SHAPE - CALM 1.svg",
      "assets/characters/SKIPPIES_SHAPE - CALM 2.svg",
      "assets/characters/SKIPPIES_SHAPE - HAPPY 1.svg",
      "assets/characters/SKIPPIES_SHAPE - HAPPY 2.svg",
      "assets/characters/SKIPPIES_SHAPE - JOYFUL.svg",
      "assets/characters/SKIPPIES_SHAPE - SHOCKED 1.svg",
      "assets/characters/SKIPPIES_SHAPE - SHOCKED 2.svg"
    ],
    gravityY: 0.92,
    spawnIntervalMs: 760,
    spawnIntervalMsMobile: 1180,
    spawnIntervalMsReduced: 1600,
    maxBodiesDesktop: 100,
    // maxBodiesDesktop: 10,
    maxBodiesMobile: 100,
    maxBodiesReduced: 100,
    characterSizeDesktop: [30, 48],
    characterSizeMobile: [23, 36],
    neckCharacterFit: 1.2,
    wallThickness: 9,
    wallRenderStroke: 4,
    pageFloorHeight: 42,
    pageWallThickness: 48,
    curveSamples: 14,
    baseRestitution: 0.28,
    baseFriction: 0.08,
    baseAirFriction: 0.012,
    submitEndpoint: "",
    simulationScale: window.devicePixelRatio > 1.5 ? 0.95 : 1
  };

  const GEOMETRY_DEFAULTS = {
    outerTopScale: 0.56,
    outerBottomScale: 0.56,
    neckHalfScale: 0.02,
    topBulge: 1.5,
    bottomBulge: 1.5,
    neckPull: 1.2
  };

  const state = {
    container: document.getElementById("hourglass-canvas"),
    hero: document.querySelector(".hero"),
    heroIntro: document.querySelector(".hero-intro"),
    hourglassFrame: document.querySelector(".hourglass-frame"),
    header: document.querySelector(".site-header"),
    engine: null,
    world: null,
    characterImages: [],
    spritesLoaded: false,
    bodies: [],
    walls: [],
    pageBounds: [],
    nextAssetIndex: 0,
    autoSpawnAt: 0,
    geometry: null,
    tuning: { ...GEOMETRY_DEFAULTS },
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    pointerBound: false,
    lowPowerMode: window.innerWidth < 768
  };

  function randRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function cubicPoint(p0, p1, p2, p3, t) {
    const u = 1 - t;
    const uu = u * u;
    const uuu = uu * u;
    const tt = t * t;
    const ttt = tt * t;

    return {
      x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
      y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
    };
  }

  function sampleBezier(p0, p1, p2, p3, samples) {
    const points = [];
    for (let index = 0; index <= samples; index += 1) {
      points.push(cubicPoint(p0, p1, p2, p3, index / samples));
    }
    return points;
  }

  function getCharacterSizeRange() {
    return window.innerWidth < 768 ? CONFIG.characterSizeMobile : CONFIG.characterSizeDesktop;
  }

  function getRequiredNeckHalfWidth() {
    const [, maxCharacterSize] = getCharacterSizeRange();
    const maxCharacterDiameter = maxCharacterSize * CONFIG.simulationScale * 0.74;
    return (maxCharacterDiameter * CONFIG.neckCharacterFit) / 2;
  }

  function getPageSimulationHeight() {
    const { body, documentElement } = document;
    return Math.max(
      body ? body.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      documentElement ? documentElement.scrollHeight : 0,
      documentElement ? documentElement.offsetHeight : 0,
      documentElement ? documentElement.clientHeight : 0,
      window.innerHeight
    );
  }

  function syncHeroLayout() {
    if (!state.hero || !state.heroIntro) {
      return;
    }

    state.lowPowerMode = window.innerWidth < 768 || state.reducedMotion;

    document.documentElement.style.setProperty("--page-sim-height", `${Math.ceil(getPageSimulationHeight())}px`);

    if (window.innerWidth <= 920) {
      state.hero.style.removeProperty("--hero-intro-height");
      return;
    }

    const introHeight = Math.ceil(state.heroIntro.getBoundingClientRect().height);
    state.hero.style.setProperty("--hero-intro-height", `${introHeight}px`);
  }

  function getCanvasPixelDensity() {
    return state.lowPowerMode ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  }

  function initNotifyModal() {
    const modal = document.getElementById("notify-modal");
    const triggers = Array.from(document.querySelectorAll("[aria-controls='notify-modal']"));
    const closeButton = document.getElementById("notify-close");
    const backdrop = modal.querySelector("[data-close-modal='true']");
    const form = document.getElementById("notify-form");
    const emailInput = document.getElementById("email-input");
    const submitButton = document.getElementById("notify-submit");
    const feedback = document.getElementById("form-feedback");

    let lastFocus = null;

    const openModal = () => {
      lastFocus = document.activeElement;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      emailInput.focus();
    };

    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      feedback.textContent = "";
      feedback.className = "form-feedback";
      emailInput.removeAttribute("aria-invalid");
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", openModal);
    });
    closeButton.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    emailInput.addEventListener("input", () => {
      if (emailInput.hasAttribute("aria-invalid")) {
        emailInput.removeAttribute("aria-invalid");
      }
      if (feedback.classList.contains("error")) {
        feedback.textContent = "";
        feedback.className = "form-feedback";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });

    modal.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || !modal.classList.contains("open")) {
        return;
      }

      const focusable = modal.querySelectorAll("button, input, [href], [tabindex]:not([tabindex='-1'])");
      const items = Array.from(focusable).filter((node) => !node.hasAttribute("disabled"));
      if (!items.length) {
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        feedback.textContent = "Please enter a valid email address.";
        feedback.className = "form-feedback error";
        emailInput.setAttribute("aria-invalid", "true");
        emailInput.focus();
        return;
      }

      emailInput.removeAttribute("aria-invalid");
      feedback.textContent = "Submitting...";
      feedback.className = "form-feedback";
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        if (CONFIG.submitEndpoint) {
          const response = await fetch(CONFIG.submitEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });

          if (!response.ok) {
            throw new Error("Submission failed");
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 520));
        }

        feedback.textContent = "Thanks. You are on the list.";
        feedback.className = "form-feedback success";
        form.reset();
      } catch (_error) {
        feedback.textContent = "Something went wrong. Please try again shortly.";
        feedback.className = "form-feedback error";
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Notify me";
      }
    });
  }

  function initCountdown() {
    const countdownRoot = document.querySelector("[data-countdown-target]");
    if (!countdownRoot) {
      return;
    }

    const target = countdownRoot.getAttribute("data-countdown-target");
    const targetTime = target ? new Date(target).getTime() : Number.NaN;
    if (Number.isNaN(targetTime)) {
      return;
    }

    const daysNode = document.getElementById("countdown-days");
    const hoursNode = document.getElementById("countdown-hours");
    const minutesNode = document.getElementById("countdown-minutes");
    const secondsNode = document.getElementById("countdown-seconds");

    if (!daysNode || !hoursNode || !minutesNode || !secondsNode) {
      return;
    }

    const formatUnit = (value) => String(value).padStart(2, "0");

    const renderCountdown = () => {
      const remaining = Math.max(0, targetTime - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      daysNode.textContent = formatUnit(days);
      hoursNode.textContent = formatUnit(hours);
      minutesNode.textContent = formatUnit(minutes);
      secondsNode.textContent = formatUnit(seconds);
    };

    renderCountdown();
    window.setInterval(renderCountdown, 1000);
  }

  function buildGeometry(width, height, frame) {
    const tuning = state.tuning;
    const centerX = frame.x + frame.width / 2;
    const topInset = frame.height * 0.04;
    const bottomInset = frame.height * 0.04;
    const topY = frame.y + topInset;
    const bottomY = frame.y + frame.height - bottomInset;
    const neckY = frame.y + frame.height * 0.5;
    const outerTop = frame.width * tuning.outerTopScale;
    const tunedNeckHalf = frame.width * tuning.neckHalfScale;
    const neckHalf = Math.max(tunedNeckHalf, getRequiredNeckHalfWidth());
    const outerBottom = frame.width * tuning.outerBottomScale;
    const isDesktopFrame = window.innerWidth > 920;
    const topEdgeReach = isDesktopFrame ? 1 : 1.24;
    const bottomEdgeReach = isDesktopFrame ? 1 : 1.24;
    const edgeInset = isDesktopFrame ? frame.width * 0.03 : 0;
    const maxOuterTop = frame.width / 2 - edgeInset;
    const maxOuterBottom = frame.width / 2 - edgeInset;
    const topExtent = Math.min(outerTop * topEdgeReach, maxOuterTop);
    const bottomExtent = Math.min(outerBottom * bottomEdgeReach, maxOuterBottom);

    const points = {
      leftTop: { x: centerX - topExtent, y: topY },
      leftNeck: { x: centerX - neckHalf, y: neckY },
      leftBottom: { x: centerX - bottomExtent, y: bottomY },
      rightTop: { x: centerX + topExtent, y: topY },
      rightNeck: { x: centerX + neckHalf, y: neckY },
      rightBottom: { x: centerX + bottomExtent, y: bottomY }
    };

    const maxControlInset = isDesktopFrame ? frame.width * 0.04 : 0;
    const minControlX = frame.x + maxControlInset;
    const maxControlX = frame.x + frame.width - maxControlInset;
    const clampControlX = (value) => Math.min(maxControlX, Math.max(minControlX, value));

    const controls = {
      // Push and lift top/bottom controls so the page-edge ends visibly curve outward.
      leftTopC1: { x: clampControlX(centerX - outerTop * (tuning.topBulge + 0.36)), y: topY + frame.height * 0.18 },
      leftTopC2: { x: clampControlX(centerX - neckHalf * (tuning.neckPull * 0.82)), y: neckY - frame.height * 0.16 },
      leftBottomC1: { x: clampControlX(centerX - neckHalf * (tuning.neckPull * 0.82)), y: neckY + frame.height * 0.16 },
      leftBottomC2: { x: clampControlX(centerX - outerBottom * (tuning.bottomBulge + 0.36)), y: bottomY - frame.height * 0.18 },
      rightTopC1: { x: clampControlX(centerX + outerTop * (tuning.topBulge + 0.36)), y: topY + frame.height * 0.18 },
      rightTopC2: { x: clampControlX(centerX + neckHalf * (tuning.neckPull * 0.82)), y: neckY - frame.height * 0.16 },
      rightBottomC1: { x: clampControlX(centerX + neckHalf * (tuning.neckPull * 0.82)), y: neckY + frame.height * 0.16 },
      rightBottomC2: { x: clampControlX(centerX + outerBottom * (tuning.bottomBulge + 0.36)), y: bottomY - frame.height * 0.18 }
    };

    return {
      centerX,
      topY,
      neckY,
      bottomY,
      outerTop,
      neckHalf,
      outerBottom,
      frame,
      points,
      controls
    };
  }

  function makeWallSegment(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.max(Math.hypot(dx, dy), 2);

    return Bodies.rectangle((x1 + x2) / 2, (y1 + y2) / 2, length, CONFIG.wallThickness, {
      isStatic: true,
      angle: Math.atan2(dy, dx),
      chamfer: { radius: 2 },
      friction: 0.04,
      restitution: 0.04
    });
  }

  function makeSegmentsFromPoints(points) {
    const segments = [];
    for (let index = 0; index < points.length - 1; index += 1) {
      const from = points[index];
      const to = points[index + 1];
      segments.push(makeWallSegment(from.x, from.y, to.x, to.y));
    }
    return segments;
  }

  function rebuildHourglassWalls() {
    if (!state.world || !state.geometry) {
      return;
    }

    state.walls.forEach((wall) => World.remove(state.world, wall));
    state.walls = [];

    const g = state.geometry;
    const leftTopCurve = sampleBezier(g.points.leftTop, g.controls.leftTopC1, g.controls.leftTopC2, g.points.leftNeck, CONFIG.curveSamples);
    const leftBottomCurve = sampleBezier(
      g.points.leftNeck,
      g.controls.leftBottomC1,
      g.controls.leftBottomC2,
      g.points.leftBottom,
      CONFIG.curveSamples
    );
    const rightTopCurve = sampleBezier(
      g.points.rightTop,
      g.controls.rightTopC1,
      g.controls.rightTopC2,
      g.points.rightNeck,
      CONFIG.curveSamples
    );
    const rightBottomCurve = sampleBezier(
      g.points.rightNeck,
      g.controls.rightBottomC1,
      g.controls.rightBottomC2,
      g.points.rightBottom,
      CONFIG.curveSamples
    );

    state.walls = [
      ...makeSegmentsFromPoints(leftTopCurve),
      ...makeSegmentsFromPoints(leftBottomCurve),
      ...makeSegmentsFromPoints(rightTopCurve),
      ...makeSegmentsFromPoints(rightBottomCurve),
      Bodies.rectangle(g.centerX, g.bottomY + 24, g.outerBottom * 2 + 70, 34, {
        isStatic: true,
        chamfer: { radius: 12 },
        friction: 0.22,
        restitution: 0.01
      })
    ];

    World.add(state.world, state.walls);
  }

  function rebuildPageBounds(canvasWidth, canvasHeight) {
    if (!state.world) {
      return;
    }

    state.pageBounds.forEach((bound) => World.remove(state.world, bound));

    const floor = Bodies.rectangle(
      canvasWidth / 2,
      canvasHeight - CONFIG.pageFloorHeight / 2,
      canvasWidth + CONFIG.pageWallThickness * 2,
      CONFIG.pageFloorHeight,
      {
        isStatic: true,
        friction: 0.35,
        restitution: 0.42
      }
    );

    const leftWall = Bodies.rectangle(
      -CONFIG.pageWallThickness / 2 + 6,
      canvasHeight / 2,
      CONFIG.pageWallThickness,
      canvasHeight + CONFIG.pageFloorHeight * 2,
      {
        isStatic: true,
        friction: 0.2,
        restitution: 0.28
      }
    );

    const rightWall = Bodies.rectangle(
      canvasWidth + CONFIG.pageWallThickness / 2 - 6,
      canvasHeight / 2,
      CONFIG.pageWallThickness,
      canvasHeight + CONFIG.pageFloorHeight * 2,
      {
        isStatic: true,
        friction: 0.2,
        restitution: 0.28
      }
    );

    state.pageBounds = [floor, leftWall, rightWall];
    World.add(state.world, state.pageBounds);
  }

  function recalcGeometry() {
    syncHeroLayout();
    if (state.engine) {
      state.engine.gravity.y = state.lowPowerMode ? 0.78 : CONFIG.gravityY;
    }
    const width = state.container.clientWidth;
    const height = state.container.clientHeight;
    const frameRect = state.hourglassFrame.getBoundingClientRect();
    const frame = {
      x: frameRect.left + window.scrollX,
      y: frameRect.top + window.scrollY,
      width: frameRect.width,
      height: frameRect.height
    };

    state.geometry = buildGeometry(width, height, frame);
    rebuildPageBounds(width, height);
    rebuildHourglassWalls();
  }

  function initGeometryControls() {
    const controls = Array.from(document.querySelectorAll("[data-geom-key]"));
    const outputs = Array.from(document.querySelectorAll("[data-geom-output]"));
    const resetButton = document.getElementById("geometry-reset");
    const exportButton = document.getElementById("geometry-export");
    const exportOutput = document.getElementById("geometry-export-output");

    if (!controls.length) {
      return;
    }

    const refreshOutputs = () => {
      for (const output of outputs) {
        const key = output.dataset.geomOutput;
        if (!key) {
          continue;
        }
        output.textContent = `${state.tuning[key].toFixed(3)}`;
      }
    };

    const updateSliderUI = () => {
      for (const control of controls) {
        const key = control.dataset.geomKey;
        if (!key) {
          continue;
        }
        control.value = `${state.tuning[key]}`;
      }
      refreshOutputs();
    };

    for (const control of controls) {
      control.addEventListener("input", (event) => {
        const input = event.currentTarget;
        const key = input.dataset.geomKey;
        if (!key) {
          return;
        }

        state.tuning[key] = Number.parseFloat(input.value);
        refreshOutputs();
        recalcGeometry();
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        state.tuning = { ...GEOMETRY_DEFAULTS };
        updateSliderUI();
        recalcGeometry();
      });
    }

    if (exportButton) {
      exportButton.addEventListener("click", async () => {
        const payload = JSON.stringify(state.tuning, null, 2);
        exportOutput.value = payload;

        try {
          await navigator.clipboard.writeText(payload);
          exportButton.textContent = "Copied";
        } catch (_error) {
          exportButton.textContent = "Copy failed";
        }

        window.setTimeout(() => {
          exportButton.textContent = "Export JSON";
        }, 1200);
      });
    }

    updateSliderUI();
  }

  function clampBodies() {
    const maxBodies = state.reducedMotion
      ? CONFIG.maxBodiesReduced
      : window.innerWidth < 768
      ? CONFIG.maxBodiesMobile
      : CONFIG.maxBodiesDesktop;

    while (state.bodies.length > maxBodies) {
      const removed = state.bodies.shift();
      if (removed) {
        World.remove(state.world, removed.body);
      }
    }
  }

  function nextCharacterImage() {
    if (!state.characterImages.length) {
      return null;
    }

    const image = state.characterImages[state.nextAssetIndex % state.characterImages.length];
    state.nextAssetIndex += 1;
    return image;
  }

  function widthAtY(y) {
    const g = state.geometry;
    const epsilon = 0.0001;

    if (y <= g.neckY) {
      const ratio = (y - g.topY) / Math.max(g.neckY - g.topY, epsilon);
      return g.outerTop + (g.neckHalf - g.outerTop) * ratio;
    }

    const ratio = (y - g.neckY) / Math.max(g.bottomY - g.neckY, epsilon);
    return g.neckHalf + (g.outerBottom - g.neckHalf) * ratio;
  }

  function isUpperInterior(x, y) {
    const g = state.geometry;
    if (y < 0 || y > g.neckY - 12) {
      return false;
    }

    const halfWidth = widthAtY(y) - 8;
    return Math.abs(x - g.centerX) <= halfWidth;
  }

  function spawnCharacter(x, y) {
    const image = nextCharacterImage();
    if (!image) {
      return;
    }

    const sizeRange = getCharacterSizeRange();
    const size = randRange(sizeRange[0], sizeRange[1]) * CONFIG.simulationScale;
    const radius = size * 0.37;

    const body = Bodies.circle(x, y, radius, {
      restitution: CONFIG.baseRestitution,
      friction: CONFIG.baseFriction,
      frictionAir: CONFIG.baseAirFriction,
      density: 0.0008,
      slop: 0.02
    });

    Body.setAngularVelocity(body, randRange(-0.025, 0.025));
    World.add(state.world, body);

    state.bodies.push({
      body,
      image,
      size,
      createdAt: Date.now()
    });

    clampBodies();
  }

  function maxSpawnRadius() {
    const [, maxCharacterSize] = getCharacterSizeRange();
    return maxCharacterSize * CONFIG.simulationScale * 0.37;
  }

  function topEntryHalfWidth() {
    const g = state.geometry;
    const safeMargin = maxSpawnRadius() + CONFIG.wallThickness + 18;
    return Math.max(0, (g.outerTop - safeMargin) * 0.9);
  }

  function spawnFromAbove(targetX) {
    const g = state.geometry;
    const headerHeight = state.header ? state.header.getBoundingClientRect().bottom + window.scrollY : 0;
    const spawnMinY = Math.min(g.topY + 8, headerHeight - 12);
    const spawnMaxY = g.topY + 80;
    const y = randRange(spawnMinY, spawnMaxY);
    const entryHalfWidth = topEntryHalfWidth();
    const clampedX = Math.min(g.centerX + entryHalfWidth, Math.max(g.centerX - entryHalfWidth, targetX));

    spawnCharacter(clampedX, y);
  }

  function spawnFromPointer(clientX, clientY) {
    const rect = state.hourglassFrame.getBoundingClientRect();
    if (clientX < rect.left || clientY < rect.top || clientX > rect.right || clientY > rect.bottom) {
      return;
    }

    const x = clientX + window.scrollX;
    const y = clientY + window.scrollY;

    // Manual add-back behavior: spawn directly where the user clicks in the upper hourglass.
    if (isUpperInterior(x, y)) {
      spawnCharacter(x, Math.max(8, y - 4));
    }
  }

  function bindManualSpawn() {
    if (state.pointerBound) {
      return;
    }

    state.hourglassFrame.addEventListener("pointerdown", (event) => {
      if (!state.spritesLoaded) {
        return;
      }
      spawnFromPointer(event.clientX, event.clientY);
    });

    state.pointerBound = true;
  }

  function autoBurstCount() {
    if (state.reducedMotion) {
      return Math.random() < 0.72 ? 1 : 2;
    }

    const roll = Math.random();
    if (roll < 0.24) {
      return 3;
    }
    if (roll < 0.68) {
      return 2;
    }
    return 1;
  }

  function spawnAutoBurst() {
    const g = state.geometry;
    const headerHeight = state.header ? state.header.getBoundingClientRect().bottom + window.scrollY : 0;
    const offscreenY = Math.min(g.topY + 18, headerHeight - 12);
    const span = Math.min(topEntryHalfWidth(), Math.max(0, widthAtY(offscreenY) - (maxSpawnRadius() + CONFIG.wallThickness + 18)));
    const count = autoBurstCount();

    for (let index = 0; index < count; index += 1) {
      const x = randRange(g.centerX - span, g.centerX + span);
      spawnFromAbove(x);
    }
  }

  function removeFarBodies(canvasHeight) {
    state.bodies = state.bodies.filter((item) => {
      const outOfRange = item.body.position.y > canvasHeight + 520;
      if (outOfRange) {
        World.remove(state.world, item.body);
        return false;
      }
      return true;
    });
  }

  function setupPhysics() {
    state.engine = Engine.create({
      gravity: { x: 0, y: state.lowPowerMode ? 0.78 : CONFIG.gravityY }
    });

    state.world = state.engine.world;
    state.autoSpawnAt = Date.now() + 260;

    Events.on(state.engine, "beforeUpdate", () => {
      if (document.hidden) {
        return;
      }

      const now = Date.now();
      if (now >= state.autoSpawnAt && state.spritesLoaded) {
        spawnAutoBurst();
        const delay = state.reducedMotion
          ? CONFIG.spawnIntervalMsReduced
          : state.lowPowerMode
          ? CONFIG.spawnIntervalMsMobile
          : CONFIG.spawnIntervalMs;
        state.autoSpawnAt = now + delay;
      }
    });
  }

  function drawCurve(p5, start, c1, c2, end) {
    p5.beginShape();
    p5.vertex(start.x, start.y);
    p5.bezierVertex(c1.x, c1.y, c2.x, c2.y, end.x, end.y);
    p5.endShape();
  }

  function drawHourglassOutline(p5) {
    const g = state.geometry;
    p5.push();
    p5.noFill();
    p5.stroke("#1A2449");
    p5.strokeWeight(CONFIG.wallRenderStroke);

    drawCurve(p5, g.points.leftTop, g.controls.leftTopC1, g.controls.leftTopC2, g.points.leftNeck);
    drawCurve(p5, g.points.leftNeck, g.controls.leftBottomC1, g.controls.leftBottomC2, g.points.leftBottom);
    drawCurve(p5, g.points.rightTop, g.controls.rightTopC1, g.controls.rightTopC2, g.points.rightNeck);
    drawCurve(p5, g.points.rightNeck, g.controls.rightBottomC1, g.controls.rightBottomC2, g.points.rightBottom);
    p5.pop();
  }

  function setupSketch() {
    const sketch = (p5) => {
      p5.preload = () => {
        state.characterImages = CONFIG.characterPaths.map((path) => p5.loadImage(path));
      };

      p5.setup = () => {
        const canvas = p5.createCanvas(state.container.clientWidth, state.container.clientHeight);
        canvas.parent(state.container);
        p5.pixelDensity(getCanvasPixelDensity());
        recalcGeometry();
        bindManualSpawn();
        state.spritesLoaded = true;
        if (window.SkippiesLoader && typeof window.SkippiesLoader.hide === "function") {
          window.SkippiesLoader.hide();
        }
      };

      p5.windowResized = () => {
        syncHeroLayout();
        p5.pixelDensity(getCanvasPixelDensity());
        p5.resizeCanvas(state.container.clientWidth, state.container.clientHeight);
        recalcGeometry();
      };

      p5.draw = () => {
        p5.clear();
        Engine.update(state.engine, state.lowPowerMode ? 1000 / 40 : 1000 / 60);

        drawHourglassOutline(p5);

        const visibleTop = window.scrollY - 160;
        const visibleBottom = window.scrollY + window.innerHeight + 220;

        for (let index = 0; index < state.bodies.length; index += 1) {
          const item = state.bodies[index];
          const position = item.body.position;
          if (position.y < visibleTop || position.y > visibleBottom) {
            continue;
          }
          p5.push();
          p5.translate(position.x, position.y);
          p5.rotate(item.body.angle);
          p5.imageMode(p5.CENTER);
          p5.image(item.image, 0, 0, item.size, item.size);
          p5.pop();
        }

        removeFarBodies(p5.height);
      };
    };

    // eslint-disable-next-line no-new
    new window.p5(sketch);
  }

  function start() {
    syncHeroLayout();
    initCountdown();
    initNotifyModal();
    initGeometryControls();
    setupPhysics();
    setupSketch();
    window.addEventListener("resize", syncHeroLayout);
    window.addEventListener("resize", recalcGeometry);
    window.addEventListener("load", recalcGeometry);
    window.setTimeout(recalcGeometry, 120);
  }

  start();
})();
