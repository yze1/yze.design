const A = "assets/images/";
const P = `${A}previews/`;
const H = `${A}full/`;
const V = "assets/videos/";
const I = "assets/icons/";
const MEDIA_CACHE_DISABLED = new URLSearchParams(location.search).get("disableMediaCache") === "1";
const MEDIA_CACHE_MODE = MEDIA_CACHE_DISABLED ? "no-store" : "default";
let highResolutionMediaReady = false;
const getDeckViewportWidth = () => {
  const desktopPadding = window.innerWidth < 1280 || window.innerHeight < 720 ? 32 : 0;
  const availableWidth = Math.max(0, window.innerWidth - desktopPadding);
  const availableHeight = Math.max(0, window.innerHeight - desktopPadding);
  return Math.min(availableWidth, availableHeight * (16 / 9));
};
let deckViewportWidth = getDeckViewportWidth();

const setDeckViewportWidth = () => {
  document.documentElement.style.setProperty("--deck-viewport-width", `${deckViewportWidth}px`);
};

setDeckViewportWidth();
window.addEventListener("resize", () => {
  deckViewportWidth = getDeckViewportWidth();
  setDeckViewportWidth();
});

const videos = new Set([
  "22pMeetingRoom",
  "5pMeetingRoom",
  "Desks",
  "DesksLong",
  "Entrance",
  "FeatureWall",
  "Kitchen",
  "KitchenOrtho",
  "Lab",
  "Pod",
  "StandingDesks",
  "Teapoint"
]);

const progressiveImage = (filename, { className = "", position = "" } = {}) => {
  const basename = filename.replace(/\.[^.]+$/, "");
  const style = position ? ` style="object-position:${position}"` : "";
  return `<img
    class="progressive-image is-loading ${className}"
    data-preview-src="${P}${basename}.webp"
    data-image-key="${basename}"
    alt=""
    decoding="async"
    draggable="false"
    ${style}
  >`;
};

const media = (filename, { fit = "cover", position = "", allowVideo = true } = {}) => {
  const basename = filename.replace(/\.[^.]+$/, "");
  const style = position ? ` style="object-position:${position}"` : "";
  const image = progressiveImage(filename, { position });
  if (!allowVideo || !videos.has(basename)) {
    return `<div class="media-swap ${fit}">${image}</div>`;
  }
  return `<div class="media-swap ${fit}" data-video-swap>
    ${image}
    <video muted playsinline webkit-playsinline loop preload="none" data-poster-key="${basename}" disablepictureinpicture disableremoteplayback controlslist="nodownload noplaybackrate noremoteplayback" aria-hidden="true"${style}>
      <source data-src="${V}${basename}.mp4" type="video/mp4">
    </video>
    <div class="media-controls">
      <div class="video-scrubber">
        <input class="video-progress" type="range" min="0" max="1000" value="0" aria-label="Video progress">
      </div>
      <button class="media-expand" type="button" aria-label="Expand video"></button>
    </div>
    <button class="media-close" type="button" aria-label="Close fullscreen"></button>
  </div>`;
};

const slides = [
  { type: "cover", title: "BioMérieux" },
  {
    type: "about",
    title: "About BioMérieux",
    paragraphs: [
      "BioMérieux’s work is rooted in scientific precision, diagnostic clarity and public health impact. The workplace reflects these values through a clean, structured and considered environment that supports focus, collaboration and everyday human connection.",
      "Design Strategy: A workplace built around clarity, collaboration and care, translating BioMérieux’s scientific precision into a clean, warm and highly usable working environment."
    ]
  },
  {
    type: "strategy",
    title: "Design Strategy",
    subtitle: "A workplace shaped around<br>clarity, collaboration and care.",
    paragraphs: [
      "BioMérieux’s workplace translates scientific precision into a calm, structured and human-centred environment. The design balances technical focus with everyday comfort, creating a clear journey through arrival, meeting, work, lab and social spaces.",
      "Glazed rooms support visibility and connection, focused work settings provide flexibility and warm materials soften the clinical clarity of the scheme. The result is a workplace that feels professional, efficient and welcoming."
    ]
  },
  { type: "overview", title: "Spatial Overview", subtitle: "A connected workplace journey from arrival<br>to lab, focus, meeting and refreshment." },
  {
    type: "room", title: "Arrival & Meeting Frontage", subtitle: "A composed first impression with clear<br>wayfinding and professional transparency.",
    image: "Entrance.png", dot: ["21.41cqw", "1.20cqw"], calls: ["Visitor clarity", "Professional first impression", "Meeting suite access"],
    body: "The welcome and meeting-room frontage creates a clean, confident first impression as visitors arrive into the workplace. Located along the right-hand arrival and circulation route, the space uses glazed meeting rooms, branded wall panels, soft neutral finishes, tall storage and planting to establish a composed professional identity. The layout provides immediate visual clarity, guiding visitors toward the enclosed meeting suite and wider office."
  },
  {
    type: "room", title: "Lab Workspace", subtitle: "A precise technical environment supporting<br>BioMérieux’s scientific workflow.",
    image: "Lab.png", dot: ["23.98cqw", "5.84cqw"], calls: ["Technical workflow", "Equipment access", "Controlled circulation"],
    body: "The lab area translates BioMérieux’s scientific identity into a practical, ordered workspace. Perimeter worktops, diagnostic equipment, PC stations, microscope positions, storage units and a central collaboration table create a controlled technical environment with clear circulation. The neutral material palette, bright task lighting and uncluttered layout reinforce clarity, hygiene and operational efficiency."
  },
  {
    type: "room", title: "Teapoint", subtitle: "A practical hospitality point integrated<br>into the workplace social zone.",
    image: "Kitchen.png", dot: ["23.46cqw", "9.10cqw"], calls: ["Daily refreshment", "Staff hospitality", "Breakout connection"],
    body: "The teapoint kitchen brings practical hospitality into the breakout area, supporting staff comfort, refreshment and informal connection. Positioned within the lower-right teapoint zone beside the tea store, the crisp white cabinetry, sink, open shelving, under-shelf lighting and warm tiled splashback create a polished workplace café feel. The view opens into the breakout setting, linking daily refreshment with social seating and communal activity."
  },
  {
    type: "room", title: "Breakout Space", subtitle: "A warm social hub for informal meetings,<br>pause points and team connection.",
    image: "Teapoint.png", dot: ["19.35cqw", "9.32cqw"], calls: ["Informal meetings", "Staff pause point", "Team connection"],
    body: "The teapoint and breakout area creates an inviting social heart for the workplace, encouraging informal meetings, relaxed conversation and moments of pause throughout the day. Located in the lower-right breakout zone, the space combines a poseur-height communal table, café-style seating, soft lounge furniture, warm timber detailing, lockers and planting. The “Sip, Savour, Socialise” feature graphic gives the area an identity and sense of place."
  },
  {
    type: "room", title: "Jenner Meeting Room", subtitle: "A transparent small meeting room<br>connected to the wider meeting suite.",
    image: "5pMeetingRoom.png", dot: ["17.72cqw", "4.05cqw"], calls: ["Small-team reviews", "Visitor conversations", "Transparent collaboration"],
    body: "The Jenner room supports smaller meetings, focused reviews and quick project discussions within the glazed meeting-room cluster. The compact table setting, white chairs, freestanding screen and transparent partitions create a professional but accessible meeting environment. Its proximity to adjacent meeting rooms makes it useful for both internal collaboration and visitor-facing conversations."
  },
  {
    type: "room", title: "Open-Plan Workspace", subtitle: "A bright, structured desk environment<br>designed for focus, flexibility and wellbeing.",
    image: "DesksLong.png", imagePosition: "65% center", dot: ["13.96cqw", "8.80cqw"], calls: ["Focused desk work", "Clear circulation", "Biophilic wellbeing"],
    body: "The open-plan workspace creates a calm, efficient setting for focused daily work, with long banks of white desks arranged in a clear linear layout beneath exposed services and suspended task lighting. Height-adjustable workstations, ergonomic chairs, integrated monitor screens and mobile pedestals support practical working needs, while generous circulation routes keep the space open and easy to navigate. The full-height planted wall and soft lounge seating introduce a biophilic pause point, balancing BioMérieux’s clean scientific identity with warmth, comfort and staff wellbeing."
  },
  {
    type: "room", title: "Focus Pod", subtitle: "A compact enclosed setting for focused<br>work and confidential discussion.",
    image: "Pod.png", dot: ["8.95cqw", "5.25cqw"], calls: ["Confidential discussion", "Focused work", "Acoustic separation"],
    body: "The pod provides a quiet, contained space for focused work, confidential conversations and short internal meetings. Glazed frontage maintains connection to the wider workplace, while soft wall panels, ergonomic chairs and warm lighting create a calm setting for concentration."
  },
  {
    type: "room", title: "Rising Desk Station", subtitle: "Height-adjustable workstations designed for<br>everyday comfort and healthier working.",
    image: "StandingDesks.png", dot: ["5.21cqw", "4.75cqw"], calls: ["Sit-stand flexibility", "Ergonomic working", "Individual focus"],
    body: "The rising desk zone supports healthier working patterns through sit-stand desks, ergonomic chairs and a calm planted backdrop. The layout gives staff a clean, practical working environment with generous spacing and visual consistency, while the green wall introduces softness and wellbeing into the otherwise precise workplace setting."
  },
  {
    type: "room", title: "Open-Plan Desk Detail", subtitle: "Generous desk planning, planted dividers and<br>clear circulation for productive daily work.",
    image: "Desks.png", dot: ["4.32cqw", "0.32cqw"], calls: ["Team adjacency", "Monitor-ready desks", "Planted screening"],
    body: "The beautifully organised open-plan desk area promotes productivity through bright, spacious workstation settings, generous circulation and calm visual consistency. Positioned across the large central-left desking zone, the space combines rising desks, ergonomic task chairs, monitor screens and storage dividers. The green feature wall adds a strong biophilic focal point, supporting focus, wellbeing and a more energising working environment."
  },
  {
    type: "room", title: "Fleming Meeting Room", subtitle: "A high-capacity meeting suite for presentations,<br>decision-making and client collaboration.",
    image: "22pMeetingRoom.png", dot: ["17.07cqw", "0.28cqw"], calls: ["Client presentations", "Decision-making", "Large-team collaboration"],
    body: "The Fleming meeting room provides a refined, high-capacity setting for presentations, meetings and collaboration. Positioned in the upper central meeting suite, the room is anchored by a generous boardroom table, meeting chairs and a sculptural feature ceiling. Full-height glazing maintains connection to the wider office while preserving a professional, enclosed environment suited to focused discussion."
  },
  {
    type: "focus-detail", title: "Teapoint Elevation", image: "KitchenOrtho.png",
    calls: ["Integrated appliances", "Easy maintenance", "Everyday amenity"],
    body: "The teapoint elevation shows the practical detail behind the breakout experience. Tall storage, integrated appliances, clean white cabinetry, sink and warm under-cabinet lighting create a refined refreshment point. The restrained material palette keeps the space professional while giving staff a comfortable everyday amenity."
  },
  {
    type: "focus-detail", title: "Biophilic Feature Wall", image: "FeatureWall.png",
    calls: ["Social threshold", "Brand warmth", "Wellbeing cue"],
    body: "The feature wall creates a strong visual threshold into the teapoint and breakout area. Timber battens frame a planted green panel, adding warmth, texture and biophilic contrast to the clean workplace palette. The opening gives a controlled glimpse into the kitchen, helping the social zone feel connected and defined."
  },
  { type: "materials", title: "Material & Atmosphere Palette" },
  {
    type: "summary", title: "Proposal Summary", image: "Kitchen.png",
    body: "BioMérieux’s workplace is presented as a clear, efficient and human‑centred environment: precise enough to support scientific work, transparent enough to encourage collaboration and warm enough to improve everyday staff experience. Arrival, glazing and brand moments create a professional first impression while desks, pods, meeting rooms, laboratory and social spaces connect into one coherent workplace journey."
  }
];

const summaryFooter = () => `
  <footer class="slide-footer summary-footer">
    <span class="footer-brand"><img class="footer-logo" src="${I}logo.svg" alt="Curve" draggable="false"></span>
  </footer>`;

const header = (slide) => `
  <header class="slide-header">
    <h1 class="slide-title">${slide.title}</h1>
    ${slide.subtitle ? `<p class="slide-subtitle"><span class="subtitle-desktop">${slide.subtitle}</span><span class="subtitle-mobile">${slide.subtitle.replaceAll("<br>", " ")}</span></p>` : ""}
  </header>`;

const callout = (text) => {
  const words = text.split(" ");
  const splitAt = Math.ceil(words.length / 2);
  return `<span class="call-line">${words.slice(0, splitAt).join(" ")}</span><span class="call-line">${words.slice(splitAt).join(" ")}</span>`;
};

const room = (s) => `
  <section class="slide dark room">
    ${header(s)}
    <main class="room-body">
      <div class="hero">${media(s.image, { position: s.imagePosition })}</div>
      <aside class="sidebar" style="--dot-x:${s.dot[0]};--dot-y:${s.dot[1]}">
        <div class="map">${progressiveImage("FloorplanCrop.png")}<i class="map-dot"></i></div>
        <div class="room-text">
          <ul class="calls">${s.calls.map(x => `<li>${callout(x)}</li>`).join("")}</ul>
          <p class="body-copy">${s.body}</p>
        </div>
      </aside>
    </main>
  </section>`;

const render = (s) => {
  if (s.type === "cover") return `<section class="slide dark cover"><h1 class="cover-title">${s.title}</h1><span class="footer-brand cover-logo"><img class="footer-logo" src="${I}logo.svg" alt="Curve" draggable="false"></span></section>`;
  if (s.type === "about") return `<section class="slide about">${header(s)}<main class="about-copy body-copy">${s.paragraphs.map(p => `<p>${p}</p>`).join("")}</main></section>`;
  if (s.type === "strategy") return `<section class="slide strategy">${header(s)}<main><div class="strategy-copy body-copy">${s.paragraphs.map(p => `<p>${p}</p>`).join("")}</div><div class="strategy-plan">${progressiveImage("FloorplanCrop_dark.png", { className: "image-contain" })}</div></main></section>`;
  if (s.type === "overview") return `<section class="slide overview">${header(s)}<main class="overview-body">${progressiveImage("OfficePlan.png", { className: "overview-plan image-contain" })}<span class="overview-node arrival">Arrival</span><span class="overview-node collaboration">Collaboration</span><span class="overview-node lab">Lab</span><span class="overview-node focus">Focus Work</span><span class="overview-node social">Social Hub</span></main></section>`;
  if (s.type === "room") return room(s);
  if (s.type === "focus-detail") return `<section class="slide dark focus-detail">${header(s)}<main class="detail-body"><div class="detail-copy"><ul class="calls">${s.calls.map(x => `<li>${callout(x)}</li>`).join("")}</ul><p class="body-copy">${s.body}</p></div><div class="detail-image">${media(s.image)}</div></main></section>`;
  if (s.type === "materials") {
    const mats = [["glass.png","Glazed Partitions",false],["WhiteJoinery.png","Warm Tiled Splashback"],["TimerBattens.png","Timber Battens"],["SoftAcousticPanels.png","Soft Acoustic Panels"],["Planting.png","Biophilic Planting"],["WarmLighting.png","Integrated Lighting"]];
    return `<section class="slide dark materials">${header(s)}<main class="materials-body"><div class="materials-grid">${mats.map(([img,label,allowVideo = true]) => `<figure class="material">${media(img, { allowVideo })}<figcaption class="caption">${label}</figcaption></figure>`).join("")}</div><div class="materials-lower"><p class="body-copy">A restrained palette of white surfaces, pale flooring, glazed partitions, acoustic panels, timber battens, integrated lighting and planting keeps the workplace precise and professional while avoiding a cold clinical atmosphere.</p><ul class="calls"><li>${callout("Cleanability")}</li><li>${callout("Transparency")}</li><li>${callout("Warmth & wellbeing")}</li></ul></div></main></section>`;
  }
  return `<section class="slide summary"><div class="summary-left">${header(s)}<p class="summary-copy body-copy">${s.body}</p>${summaryFooter()}</div><div class="summary-image">${media(s.image)}</div></section>`;
};

const deck = document.querySelector("#deck");
const darkTypes = new Set(["cover", "room", "focus-detail", "materials"]);
const EXPECTED_SLIDE_COUNT = 18;
if (slides.length !== EXPECTED_SLIDE_COUNT) {
  throw new Error(`Expected ${EXPECTED_SLIDE_COUNT} slides, received ${slides.length}`);
}

const chapterDefinitions = [
  { name: "Cover", start: 0, end: 1 },
  { name: "Strategy", start: 1, end: 4 },
  { name: "Spatial Journey", start: 4, end: 14, transition: "stack" },
  { name: "Detail", start: 14, end: 17, transition: "detail-stack" },
  { name: "Summary", start: 17, end: 18 }
];

const groups = chapterDefinitions.map((chapter) => ({
  ...chapter,
  slides: slides
    .slice(chapter.start, chapter.end)
    .map((slide, localIndex) => ({
      slide,
      index: chapter.start + localIndex
    }))
}));

const groupColor = (type) => darkTypes.has(type) ? "var(--dark)" : "var(--paper)";

deck.innerHTML = groups.map((group, groupIndex) => {
  const color = groupColor(group.slides[0].slide.type);
  const transitionClass = group.transition ? ` is-${group.transition}` : "";
  const shells = group.slides.map(({ slide, index }, slideIndex) => {
    const stacked = group.transition === "stack"
      || (group.transition === "detail-stack" && slideIndex < 2);
    const zIndex = stacked ? group.slides.length - slideIndex : slideIndex + 1;
    const slideColor = groupColor(slide.type);
    const nextSlide = slides[index + 1];
    const nextColor = nextSlide ? groupColor(nextSlide.type) : slideColor;
    return `<div class="slide-shell ${darkTypes.has(slide.type) ? "dark-shell" : "light-shell"}" id="slide-${index + 1}" style="z-index:${zIndex};--slide-color:${slideColor};--next-slide-color:${nextColor}">${render(slide)}</div>`;
  }).join("");
  const snapPoints = group.slides.map(() => `<span class="slide-snap-point" aria-hidden="true"></span>`).join("");
  return `<section class="slide-group${transitionClass}" data-chapter="${groupIndex}" data-slide-count="${group.slides.length}" style="--slide-count:${group.slides.length};--group-color:${color}">
    <div class="slide-snap-points">${snapPoints}</div>
    <div class="group-scroll" aria-label="${group.name} chapter">
      <div class="group-track">${shells}</div>
    </div>
  </section>`;
}).join("");

const revealSelectors = [
  ".cover-title",
  ".cover-logo",
  ".slide-header",
  ".about-copy",
  ".strategy-copy",
  ".strategy-plan",
  ".overview-body",
  ".room-body > .hero",
  ".room-body > .sidebar",
  ".room .map",
  ".room .room-text .calls",
  ".room .room-text .body-copy",
  ".detail-copy",
  ".detail-image",
  ".focus-detail .detail-copy .calls",
  ".focus-detail .detail-copy .body-copy",
  ".materials-grid .material",
  ".materials-lower > *",
  ".summary-left > *",
  ".summary-image"
].join(",");

document.querySelectorAll(".slide-shell").forEach((shell) => {
  shell.querySelectorAll(revealSelectors).forEach((element, index) => {
    element.classList.add("reveal-target");
    element.style.setProperty("--reveal-index", index);
  });
});

const previewImages = [...document.querySelectorAll("img[data-image-key]")];
const siteLoader = document.querySelector(".site-loader");
const loadingBar = document.querySelector(".site-loading-bar");
const loadingFill = document.querySelector(".site-loading-fill");
const loadingLabels = [...document.querySelectorAll(".site-loading-label")];
const previewObjectUrls = new Map();

const updateLoadingProgress = (label, loaded, total) => {
  const percentage = total
    ? Math.round((loaded / total) * 100)
    : 100;
  loadingFill.style.width = `${percentage}%`;
  for (const labelElement of loadingLabels) {
    labelElement.textContent = `${label} ${String(percentage).padStart(2, "0")}%`;
  }
};

const waitForImage = (image) => {
  if (image.complete) {
    return Promise.resolve(image.naturalWidth > 0 ? "loaded" : "failed");
  }
  return new Promise((resolve) => {
    image.addEventListener("load", () => resolve("loaded"), { once: true });
    image.addEventListener("error", () => resolve("failed"), { once: true });
  });
};

const afterNextPaint = () => new Promise((resolve) => {
  let resolved = false;
  const finish = () => {
    if (resolved) return;
    resolved = true;
    resolve();
  };
  requestAnimationFrame(() => requestAnimationFrame(finish));
  setTimeout(finish, 50);
});

const getPreviewGroups = () => {
  const groups = new Map();
  for (const image of previewImages) {
    const source = image.dataset.previewSrc;
    if (!groups.has(source)) {
      groups.set(source, []);
    }
    groups.get(source).push(image);
  }
  return groups;
};

const loadStructure = () => {
  updateLoadingProgress("LOADING SITE", 0, 1);
  updateLoadingProgress("LOADING SITE", 1, 1);
};

const revealSite = async () => {
  document.documentElement.classList.remove("site-loading");
  document.documentElement.classList.add("site-background-loading");
  siteLoader?.setAttribute("aria-label", "Loading preview media");
  await afterNextPaint();
};

const loadPreviewPhase = async () => {
  const previewGroups = getPreviewGroups();
  const phaseTotal = previewGroups.size;
  let loaded = 0;
  const reportLoaded = () => {
    loaded += 1;
    updateLoadingProgress("LOADING", loaded, phaseTotal);
  };

  updateLoadingProgress("LOADING", 0, phaseTotal);

  const loadGroup = async (source, images) => {
    try {
      const response = await fetch(source, { cache: MEDIA_CACHE_MODE });
      if (!response.ok) throw new Error(`Unable to load ${source}`);
      const objectUrl = URL.createObjectURL(await response.blob());
      previewObjectUrls.set(source, objectUrl);
      for (const image of images) image.src = objectUrl;
      await Promise.all(images.map(async (image) => {
        if (await waitForImage(image) !== "loaded") return;
        await image.decode?.().catch(() => {});
        image.classList.remove("is-loading");
      }));
    } catch {
      return;
    } finally {
      reportLoaded();
    }
  };

  const visible = [];
  const deferred = [];
  for (const group of previewGroups.entries()) {
    const isNearViewport = group[1].some((image) => {
      const rect = image.getBoundingClientRect();
      return rect.bottom > -window.innerHeight * 1.5
        && rect.top < window.innerHeight * 2.5
        && rect.right > -window.innerWidth * 1.5
        && rect.left < window.innerWidth * 2.5;
    });
    (isNearViewport ? visible : deferred).push(group);
  }

  const queue = [...visible, ...deferred];
  const workers = Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const [source, images] = queue.shift();
      await loadGroup(source, images);
    }
  });
  await Promise.all(workers);
};

const getHighResolutionGroups = () => {
  const groups = new Map();
  for (const image of previewImages) {
    const source = `${H}${image.dataset.imageKey}.webp`;
    if (!groups.has(source)) groups.set(source, []);
    groups.get(source).push(image);
  }
  return groups;
};

const loadHighResolutionImages = async (groups, reportLoaded) => {
  const visible = [];
  const deferred = [];
  for (const group of groups.entries()) {
    const isVisible = group[1].some((image) => {
      const rect = image.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    });
    (isVisible ? visible : deferred).push(group);
  }

  const queue = [...visible, ...deferred];
  const loadGroup = async ([source, targets]) => {
    let objectUrl;
    try {
      const response = await fetch(source, { cache: MEDIA_CACHE_MODE });
      if (!response.ok) throw new Error(`Unable to load ${source}`);
      objectUrl = URL.createObjectURL(await response.blob());
    } catch {
      return;
    } finally {
      reportLoaded();
    }
    for (const target of targets) {
      target.src = objectUrl;
      target.removeAttribute("data-image-key");
      target.classList.add("is-high-resolution");
    }
    const imageKey = source.slice(source.lastIndexOf("/") + 1, -5);
    document.querySelectorAll(`video[data-poster-key="${imageKey}"]`).forEach((video) => {
      video.poster = objectUrl;
      video.removeAttribute("data-poster-key");
    });
    await Promise.all(targets.map(async (target) => {
      const imageStatus = await waitForImage(target);
      if (imageStatus !== "loaded") return;
      await target.decode?.().catch(() => {});
      target.classList.remove("is-loading");
    }));
  };

  const workers = Array.from({ length: 3 }, async () => {
    while (queue.length) await loadGroup(queue.shift());
  });
  await Promise.all(workers);
  for (const [source, objectUrl] of previewObjectUrls) {
    const images = previewImages.filter((image) => image.dataset.previewSrc === source);
    if (!images.every((image) => image.classList.contains("is-high-resolution"))) continue;
    URL.revokeObjectURL(objectUrl);
    previewObjectUrls.delete(source);
  }
};

const ensureVideoSource = (video) => {
  video.controls = false;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  const source = video.querySelector("source[data-src]");
  if (!source) return;
  source.src = source.dataset.src;
  source.removeAttribute("data-src");
  video.preload = "auto";
  video.load();
};

const getVideoGroups = () => {
  const groups = new Map();
  for (const video of document.querySelectorAll("[data-video-swap] video")) {
    const source = video.querySelector("source[data-src]");
    if (!source) continue;
    if (!groups.has(source.dataset.src)) groups.set(source.dataset.src, []);
    groups.get(source.dataset.src).push(video);
  }
  return groups;
};

const loadVideosInBackground = async (groups, reportLoaded) => {
  const queue = [...groups.entries()];
  const loadGroup = async ([sourceUrl, targets]) => {
    try {
      const response = await fetch(sourceUrl, { cache: MEDIA_CACHE_MODE });
      if (!response.ok) throw new Error(`Unable to load ${sourceUrl}`);
      const objectUrl = URL.createObjectURL(await response.blob());
      for (const video of targets) {
        const source = video.querySelector("source[data-src]");
        source.src = objectUrl;
        source.removeAttribute("data-src");
        video.preload = "auto";
        video.load();
      }
    } catch {
      return;
    } finally {
      reportLoaded();
    }
  };

  const workers = Array.from({ length: 2 }, async () => {
    while (queue.length) await loadGroup(queue.shift());
  });
  await Promise.all(workers);
};

const loadSite = async () => {
  loadStructure();
  await revealSite();

  await loadPreviewPhase();
  await afterNextPaint();

  loadingFill.style.transition = "none";
  updateLoadingProgress("LOADING HIGH RESOLUTION MEDIA", 0, 1);
  siteLoader?.setAttribute("aria-label", "Loading high resolution media");

  await afterNextPaint();
  loadingFill.style.transition = "";

  const imageGroups = getHighResolutionGroups();
  const videoGroups = getVideoGroups();
  const totalHighResolutionAssets = imageGroups.size + videoGroups.size;
  let loadedHighResolutionAssets = 0;
  const reportLoaded = () => {
    loadedHighResolutionAssets += 1;
    updateLoadingProgress(
      "LOADING HIGH RESOLUTION MEDIA",
      loadedHighResolutionAssets,
      totalHighResolutionAssets
    );
  };

  updateLoadingProgress("LOADING HIGH RESOLUTION MEDIA", 0, totalHighResolutionAssets);

  await Promise.allSettled([
    loadHighResolutionImages(imageGroups, reportLoaded),
    loadVideosInBackground(videoGroups, reportLoaded)
  ]);

  highResolutionMediaReady = true;
  document.querySelectorAll("[data-video-swap]").forEach((swap) => {
    const rect = swap.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) playVideo(swap);
  });
  loadingBar.hidden = true;
  document.documentElement.classList.remove("site-background-loading");
  document.documentElement.classList.add("site-ready");
  siteLoader?.setAttribute("aria-hidden", "true");
};

loadSite();

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting && entry.intersectionRatio > 0.22) entry.target.classList.add("is-visible");
  }
}, { threshold: [0.22] });

document.querySelectorAll(".slide-shell").forEach((slide) => revealObserver.observe(slide));

const chapterSections = [...document.querySelectorAll(".slide-group")];
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileLayoutQuery = window.matchMedia("(max-width: 700px) and (orientation: portrait)");
let activeChapterIndex = 0;
let activeLocalSlide = 0;
let scrollUpdateQueued = false;

const getChapterState = (section) => {
  const slideCount = Number(section.dataset.slideCount);
  const scrollRange = section.offsetHeight - window.innerHeight;
  const rawProgress = scrollRange > 0
    ? (window.scrollY - section.offsetTop) / scrollRange
    : 0;
  const progress = Math.max(0, Math.min(1, rawProgress));
  const localSlide = slideCount > 1
    ? Math.round(progress * (slideCount - 1))
    : 0;
  const localPosition = progress * Math.max(0, slideCount - 1);
  return { slideCount, progress, localSlide, localPosition };
};

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.max(minimum, Math.min(maximum, value));

const updateStackedSlides = (section, state) => {
  const shells = [...section.querySelectorAll(".slide-shell")];
  const track = section.querySelector(".group-track");
  const previousActiveSlide = Number(section.dataset.activeSlide ?? -1);

  const setActiveSlide = () => {
    section.dataset.activeSlide = state.localSlide;
    shells.forEach((shell, index) => {
      const isActive = index === state.localSlide;
      shell.classList.toggle("is-active-shell", isActive);
      if (isActive) return;
      shell.querySelectorAll("[data-video-swap]").forEach((swap) => {
        const video = swap.querySelector("video");
        swap.classList.remove("is-playing");
        video.pause();
      });
    });
    if (state.localSlide !== previousActiveSlide && highResolutionMediaReady) {
      shells[state.localSlide].querySelectorAll("[data-video-swap]").forEach((swap) => {
        playVideo(swap);
      });
    }
  };

  if (section.classList.contains("is-stack")) {
    track.style.transform = "translate3d(0, 0, 0)";
    const currentIndex = Math.floor(state.localPosition);
    const nextIndex = Math.min(shells.length - 1, currentIndex + 1);
    const transitionProgress = state.localPosition - currentIndex;
    shells.forEach((shell, index) => {
      let opacity = 0;
      let translateY = 18;
      if (index === currentIndex) {
        opacity = 1 - transitionProgress;
        translateY = -18 * transitionProgress;
      } else if (index === nextIndex) {
        opacity = transitionProgress;
        translateY = 18 * (1 - transitionProgress);
      }
      shell.style.opacity = opacity;
      shell.style.transform = `translate3d(0, ${translateY}px, 0)`;
      shell.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
    });
    setActiveSlide();
    return true;
  }

  if (section.classList.contains("is-detail-stack")) {
    const fadeProgress = clamp(state.localPosition);
    const horizontalProgress = clamp(state.localPosition - 1);
    track.style.transform = `translate3d(${-horizontalProgress * 100}vw, 0, 0)`;

    shells[0].style.opacity = 1 - fadeProgress;
    shells[0].style.transform = `translate3d(0, ${-18 * fadeProgress}px, 0)`;
    shells[0].style.pointerEvents = fadeProgress < 0.5 ? "auto" : "none";
    shells[1].style.opacity = fadeProgress;
    shells[1].style.transform = `translate3d(0, ${18 * (1 - fadeProgress)}px, 0)`;
    shells[1].style.pointerEvents = horizontalProgress < 0.5 ? "auto" : "none";
    shells[2].style.opacity = 1;
    shells[2].style.pointerEvents = horizontalProgress >= 0.5 ? "auto" : "none";
    setActiveSlide();
    return true;
  }

  return false;
};

const updateScrollExperience = () => {
  scrollUpdateQueued = false;
  if (mobileLayoutQuery.matches) return;
  if (reducedMotionQuery.matches) {
    const viewportMiddle = window.innerHeight / 2;
    let closestSlide = document.querySelector(".slide-shell");
    let closestDistance = Infinity;

    document.querySelectorAll(".slide-shell").forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - viewportMiddle);
      if (distance < closestDistance) {
        closestSlide = slide;
        closestDistance = distance;
      }
    });

    const activeSection = closestSlide.closest(".slide-group");
    activeChapterIndex = Number(activeSection.dataset.chapter);
    activeLocalSlide = [...activeSection.querySelectorAll(".slide-shell")].indexOf(closestSlide);
    return;
  }

  const viewportMiddle = window.scrollY + window.innerHeight / 2;
  let nextActiveChapter = 0;

  chapterSections.forEach((section, chapterIndex) => {
    const state = getChapterState(section);
    if (!updateStackedSlides(section, state)) {
      const shift = -state.progress * (state.slideCount - 1) * 100;
      section.querySelector(".group-track").style.transform = `translate3d(${shift}vw, 0, 0)`;
    }

    const sectionStart = section.offsetTop;
    const sectionEnd = sectionStart + section.offsetHeight;
    if (viewportMiddle >= sectionStart && viewportMiddle < sectionEnd) {
      nextActiveChapter = chapterIndex;
    }
  });

  activeChapterIndex = nextActiveChapter;
  const activeSection = chapterSections[activeChapterIndex];
  const activeState = getChapterState(activeSection);
  activeLocalSlide = activeState.localSlide;

};

const requestScrollUpdate = () => {
  if (scrollUpdateQueued) return;
  scrollUpdateQueued = true;
  const flush = () => {
    if (!scrollUpdateQueued) return;
    updateScrollExperience();
  };
  requestAnimationFrame(flush);
  setTimeout(flush, 80);
};

const scrollToChapterSlide = (chapterIndex, localSlide, behavior = "smooth") => {
  const section = chapterSections[chapterIndex];
  const slideCount = Number(section.dataset.slideCount);
  const targetSlide = Math.max(0, Math.min(slideCount - 1, localSlide));
  const scrollRange = section.offsetHeight - window.innerHeight;
  const progress = slideCount > 1 ? targetSlide / (slideCount - 1) : 0;
  window.scrollTo({
    top: section.offsetTop + scrollRange * progress,
    behavior
  });
};

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("scrollend", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
reducedMotionQuery.addEventListener?.("change", requestScrollUpdate);
mobileLayoutQuery.addEventListener?.("change", requestScrollUpdate);
requestScrollUpdate();

document.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const activeSection = chapterSections[activeChapterIndex];
  const slideCount = Number(activeSection.dataset.slideCount);
  let nextChapter = activeChapterIndex;
  let nextSlide = activeLocalSlide + direction;

  if (nextSlide < 0 && activeChapterIndex > 0) {
    nextChapter -= 1;
    nextSlide = Number(chapterSections[nextChapter].dataset.slideCount) - 1;
  } else if (nextSlide >= slideCount && activeChapterIndex < chapterSections.length - 1) {
    nextChapter += 1;
    nextSlide = 0;
  } else if (nextSlide < 0 || nextSlide >= slideCount) {
    return;
  }

  event.preventDefault();
  scrollToChapterSlide(nextChapter, nextSlide);
});

const videoTimers = new WeakMap();

const playVideo = async (swap, { restart = true } = {}) => {
  if (!highResolutionMediaReady) return;
  const video = swap.querySelector("video");
  ensureVideoSource(video);
  const existingTimer = videoTimers.get(swap);
  if (existingTimer) clearTimeout(existingTimer);
  videoTimers.delete(swap);

  try {
    if (restart) video.currentTime = 0;
    video.playbackRate = 1;
    await video.play();
    swap.classList.add("is-playing");
  } catch {
    swap.classList.remove("is-playing");
  }
};

const videoObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const swap = entry.target;
    const video = swap.querySelector("video");
    const existingTimer = videoTimers.get(swap);
    const shell = swap.closest(".slide-shell");
    const inStackedGroup = shell?.closest(".is-stack, .is-detail-stack");
    const isInactiveStackedSlide = !mobileLayoutQuery.matches
      && inStackedGroup
      && !shell.classList.contains("is-active-shell");

    if (existingTimer) {
      clearTimeout(existingTimer);
      videoTimers.delete(swap);
    }

    if (!entry.isIntersecting || entry.intersectionRatio <= 0 || isInactiveStackedSlide) {
      swap.classList.remove("is-playing");
      video.pause();
      video.currentTime = 0;
      continue;
    }

    const timer = setTimeout(async () => {
      if (!swap.isConnected) return;
      await playVideo(swap);
    }, 1000);

    videoTimers.set(swap, timer);
  }
}, { threshold: 0.01 });

document.querySelectorAll("[data-video-swap]").forEach((swap) => videoObserver.observe(swap));
document.querySelectorAll("[data-video-swap] > img").forEach((image) => {
  image.addEventListener("click", () => playVideo(image.parentElement, { restart: true }));
});

document.querySelectorAll("[data-video-swap]").forEach((swap) => {
  const video = swap.querySelector("video");
  const progress = swap.querySelector(".video-progress");
  let resumeAfterScrub = false;

  const updateProgress = () => {
    const percentage = video.duration ? (video.currentTime / video.duration) * 100 : 0;
    progress.value = Math.round(percentage * 10);
    progress.style.setProperty("--video-progress", `${percentage}%`);
    progress.setAttribute("aria-valuetext", `${Math.round(percentage)}%`);
  };

  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("loadedmetadata", updateProgress);
  video.addEventListener("click", (event) => {
    event.stopPropagation();
    const timer = videoTimers.get(swap);
    if (timer) clearTimeout(timer);
    videoTimers.delete(swap);
    if (video.paused) {
      playVideo(swap, { restart: false });
      return;
    }
    video.pause();
    swap.classList.add("is-playing");
  });

  progress.addEventListener("pointerdown", () => {
    if (!highResolutionMediaReady) return;
    const timer = videoTimers.get(swap);
    if (timer) clearTimeout(timer);
    videoTimers.delete(swap);
    ensureVideoSource(video);
    resumeAfterScrub = !video.paused;
    video.pause();
    swap.classList.add("is-playing");
  });

  progress.addEventListener("input", () => {
    if (!highResolutionMediaReady) return;
    ensureVideoSource(video);
    swap.classList.add("is-playing");
    const seek = () => {
      if (!video.duration) return;
      video.currentTime = (Number(progress.value) / 1000) * video.duration;
      updateProgress();
    };
    if (video.readyState >= 1) seek();
    else video.addEventListener("loadedmetadata", seek, { once: true });
  });

  progress.addEventListener("change", () => {
    if (resumeAfterScrub) {
      video.playbackRate = 1;
      video.play().catch(() => {});
    }
    resumeAfterScrub = false;
  });
});

document.querySelectorAll("[data-video-swap] .media-expand").forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.stopPropagation();
    const mediaContainer = button.closest(".media-swap");
    if (!mediaContainer?.requestFullscreen) return;
    await mediaContainer.requestFullscreen().catch(() => {});
  });
});

document.querySelectorAll("[data-video-swap] .media-close").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  });
});

document.querySelectorAll("[data-video-swap]").forEach((swap) => {
  swap.addEventListener("click", (event) => {
    if (document.fullscreenElement !== swap || event.target !== swap) return;
    document.exitFullscreen().catch(() => {});
  });
});

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest("img, video, .media-swap, .slide")) event.preventDefault();
});

document.addEventListener("dragstart", (event) => {
  if (event.target.closest("img, video")) event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  const modifier = event.metaKey || event.ctrlKey;
  if (!modifier) return;
  if (["s", "u"].includes(event.key.toLowerCase())) event.preventDefault();
});
