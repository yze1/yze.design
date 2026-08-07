const DEFAULT_TITLE = document.title;
const MAIN_PROJECT_ROOT_URL = new URL("../", document.currentScript.src);
const LAUNCH_PASSWORD = "2026";
const LAUNCH_DURATION_DAYS = 60;
const LAUNCH_SESSION_KEY = "oczLaunchSessionUnlocked";
const LAUNCH_TARGET_KEY = "oczLaunchTarget";
let observer;
let productsCache = [];
let activeProductSlug = null;

function projectUrl(path = "") {
  return new URL(path.replace(/^\/+/, ""), MAIN_PROJECT_ROOT_URL).href;
}

function productPageUrl(slug) {
  const url = new URL("", MAIN_PROJECT_ROOT_URL);
  url.searchParams.set("product", slug);
  return url.href;
}

function getStoredItem(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function setStoredItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (_) {
    return;
  }
}

function removeStoredItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (_) {
    return;
  }
}

function getSessionItem(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function setSessionItem(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch (_) {
    return;
  }
}

function removeSessionItem(key) {
  try {
    window.sessionStorage.removeItem(key);
  } catch (_) {
    return;
  }
}

function clearLaunchSessionOnRefresh() {
  const navigation = performance.getEntriesByType("navigation")[0];
  if (navigation?.type === "reload") {
    removeSessionItem(LAUNCH_SESSION_KEY);
  }
}

function hideLoader() {
  const loader = document.querySelector("[data-loader]");
  if (loader) loader.classList.add("is-hidden");
}

function initLoader() {
  window.addEventListener("load", hideLoader);
  window.setTimeout(hideLoader, 1200);
}

function initMenu() {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (!menuToggle || !mobileMenu) return;
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initObserver() {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

function initSignupForms() {
  document.querySelectorAll(".signup-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const button = form.querySelector('button[type="submit"]');
      const msg = form.parentElement.querySelector(".form-message");
      const email = input?.value.trim() || "";
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (msg) {
        msg.classList.remove("is-error", "is-success");
        msg.textContent = "";
      }

      if (!valid) {
        if (msg) {
          msg.textContent = "Enter a valid email address.";
          msg.classList.add("is-error");
        }
        return;
      }

      const formData = new FormData(form);
      formData.set("email", email);
      if (button) button.disabled = true;
      if (msg) msg.textContent = "Subscribing...";

      try {
        const response = await fetch(projectUrl("subscribe.php"), {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });
        const result = await response.json().catch(() => ({}));
        const success = response.ok && result.ok === true;

        if (msg) {
          msg.textContent = success
            ? "Subscribed."
            : result.message || "Something went wrong. Please try again.";
          msg.classList.add(success ? "is-success" : "is-error");
        }

        if (success) {
          form.reset();
          const launchGate = form.closest("[data-launch-gate]");
          if (launchGate) {
            window.setTimeout(() => unlockLaunchGate(launchGate), 350);
          }
        }
      } catch (_) {
        if (msg) {
          msg.textContent = "Something went wrong. Please try again.";
          msg.classList.add("is-error");
        }
      } finally {
        if (button) button.disabled = false;
      }
    });
  });
}

function initLaunchVideo() {
  const video = document.querySelector(".launch-gate__video");
  if (!video) return;

  video.controls = false;
  video.defaultMuted = true;
  video.muted = true;
  video.volume = 0;
  video.playsInline = true;

  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.removeAttribute("controls");

  const playVideo = () => {
    video.play().catch(() => {
      document.documentElement.classList.add("launch-video-blocked");
    });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(playVideo);
  });

  video.addEventListener("loadedmetadata", playVideo, { once: true });
  video.addEventListener("canplay", playVideo, { once: true });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) playVideo();
  });

  document.addEventListener("touchstart", playVideo, { once: true });
  document.addEventListener("click", playVideo, { once: true });
}

function getLaunchTargetDate() {
  const savedTarget = Number(getStoredItem(LAUNCH_TARGET_KEY));
  if (Number.isFinite(savedTarget) && savedTarget > Date.now()) {
    return savedTarget;
  }

  const target = Date.now() + LAUNCH_DURATION_DAYS * 24 * 60 * 60 * 1000;
  setStoredItem(LAUNCH_TARGET_KEY, String(target));
  return target;
}

function renderCountdown(targetTime) {
  const countdown = document.querySelector("[data-countdown]");
  if (!countdown) return;

  const remaining = Math.max(0, targetTime - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");

  countdown.querySelector("[data-countdown-days]").textContent = String(days);
  countdown.querySelector("[data-countdown-hours]").textContent = pad(hours);
  countdown.querySelector("[data-countdown-minutes]").textContent = pad(minutes);
  countdown.querySelector("[data-countdown-seconds]").textContent = pad(seconds);
}

function unlockLaunchGate(gate) {
  setSessionItem(LAUNCH_SESSION_KEY, "true");
  gate.classList.add("is-unlocking");
  document.body.classList.remove("launch-locked");
  window.setTimeout(() => {
    gate.hidden = true;
    gate.setAttribute("aria-hidden", "true");
  }, 700);
}

function initLaunchGate() {
  removeStoredItem("oczLaunchUnlocked");
  const gate = document.querySelector("[data-launch-gate]");
  if (!gate) {
    if (getSessionItem(LAUNCH_SESSION_KEY) !== "true") {
      window.location.replace(projectUrl(""));
    }
    return;
  }

  if (getSessionItem(LAUNCH_SESSION_KEY) === "true") {
    gate.hidden = true;
    gate.setAttribute("aria-hidden", "true");
    document.body.classList.remove("launch-locked");
    return;
  }

  document.body.classList.add("launch-locked");
  const targetTime = getLaunchTargetDate();
  renderCountdown(targetTime);
  window.setInterval(() => renderCountdown(targetTime), 1000);

  const form = gate.querySelector("[data-password-form]");
  const input = gate.querySelector("[data-password-input]");
  const emailInput = gate.querySelector("#launch-email");
  const message = gate.querySelector("[data-password-message]");
  if (!form || !input) return;

  function syncPasswordVisibility() {
    const shouldShow = emailInput?.value.trim().toLowerCase() === "password";
    form.hidden = !shouldShow;
    if (!shouldShow) {
      input.value = "";
      if (message) message.textContent = "";
    }
  }

  emailInput?.addEventListener("input", syncPasswordVisibility);
  syncPasswordVisibility();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value.trim() === LAUNCH_PASSWORD) {
      if (message) message.textContent = "";
      unlockLaunchGate(gate);
      return;
    }

    if (message) message.textContent = "Password not recognized.";
    input.select();
  });
}

async function getProducts() {
  if (productsCache.length) return productsCache;
  const response = await fetch(projectUrl("data/products.json"));
  if (!response.ok) throw new Error("Product data unavailable");
  productsCache = await response.json();
  return productsCache;
}

function imageBlock(label, path, loading = "lazy", zoomable = false) {
  const tag = zoomable ? "button" : "div";
  const type = zoomable ? ' type="button"' : "";
  const src = projectUrl(path);
  const zoomAttrs = zoomable
    ? ` data-image-trigger data-image-src="${src}" data-image-label="${label}"`
    : "";

  return `
        <${tag} class="product-image-frame${zoomable ? " product-image-zoom" : ""}"${type}${zoomAttrs}>
            <img
                class="product-image"
                src="${src}"
                alt="${label}"
                loading="${loading}"
                onerror="this.closest('.product-image-frame').classList.add('is-missing')"
            />
            <div class="placeholder-image">${label}</div>
        </${tag}>
    `;
}

function renderProductCarousel(container, product) {
  const slides = [
    { label: product.name, src: product.thumbnailImage },
    ...(product.additionalImages || []).map((src, index) => ({
      label: `${product.name} image ${index + 1}`,
      src,
    })),
  ];
  let currentIndex = 0;

  container.innerHTML = `
    <div class="product-carousel" data-product-carousel>
      <button class="product-carousel__arrow product-carousel__arrow--prev" type="button" data-product-image-prev aria-label="Previous product image">
        <img src="${projectUrl("assets/icons/left.svg")}" alt="" aria-hidden="true" />
      </button>
      <button class="product-image-frame product-image-zoom product-carousel__image" type="button" data-image-trigger>
        <img
          class="product-image"
          src=""
          alt=""
          loading="eager"
          onerror="this.closest('.product-image-frame').classList.add('is-missing')"
        />
        <div class="placeholder-image"></div>
      </button>
      <button class="product-carousel__arrow product-carousel__arrow--next" type="button" data-product-image-next aria-label="Next product image">
        <img src="${projectUrl("assets/icons/right.svg")}" alt="" aria-hidden="true" />
      </button>
    </div>
  `;

  const frame = container.querySelector("[data-image-trigger]");
  const image = container.querySelector(".product-image");
  const placeholder = container.querySelector(".placeholder-image");
  const prev = container.querySelector("[data-product-image-prev]");
  const next = container.querySelector("[data-product-image-next]");

  function updateSlide(nextIndex) {
    currentIndex = (nextIndex + slides.length) % slides.length;
    const slide = slides[currentIndex];
    const src = projectUrl(slide.src);
    image.src = src;
    image.alt = slide.label;
    placeholder.textContent = slide.label;
    frame.classList.remove("is-missing");
    frame.setAttribute("data-image-src", src);
    frame.setAttribute("data-image-label", slide.label);
  }

  if (slides.length <= 1) {
    prev.hidden = true;
    next.hidden = true;
  }

  prev.addEventListener("click", () => updateSlide(currentIndex - 1));
  next.addEventListener("click", () => updateSlide(currentIndex + 1));
  frame.addEventListener("click", () => {
    openImageOverlay(
      frame.getAttribute("data-image-src"),
      frame.getAttribute("data-image-label"),
    );
  });
  updateSlide(0);
}

function renderGallery(products) {
  const gallery = document.querySelector("[data-product-gallery]");
  if (!gallery) return;
  gallery.innerHTML = products
    .map(
      (product) => `
            <a class="product-card fade-in" href="${productPageUrl(product.slug)}" data-product-trigger="${product.slug}">
                ${imageBlock(product.name, product.thumbnailImage)}
                <h3>${product.name}</h3>
                <p>${product.price || "$TBC"}</p>
            </a>
        `,
    )
    .join("");
  gallery.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
}

function renderRelatedProducts(currentProduct) {
  const section = document.querySelector("[data-product-related]");
  const gallery = document.querySelector("[data-related-product-gallery]");
  if (!section || !gallery) return;

  const relatedProducts = productsCache.filter(
    (product) => product.slug !== currentProduct.slug,
  );

  section.hidden = relatedProducts.length === 0;
  gallery.innerHTML = relatedProducts
    .map(
      (product) => `
        <a class="product-card fade-in" href="${productPageUrl(product.slug)}" data-related-product-trigger="${product.slug}">
          ${imageBlock(product.name, product.thumbnailImage)}
          <h3>${product.name}</h3>
          <p>${product.price || "$TBC"}</p>
        </a>
      `,
    )
    .join("");

  gallery.querySelectorAll("[data-related-product-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const slug = trigger.getAttribute("data-related-product-trigger");
      const product = productsCache.find((item) => item.slug === slug);
      if (!product) return;

      renderProductOverlay(product);
      document
        .querySelector(".product-overlay__panel")
        ?.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  gallery.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
  section.classList.remove("is-visible");
  observer.observe(section);
}

function initHorizontalGalleryScroll() {
  const section = document.querySelector("[data-horizontal-gallery-section]");
  const gallery = document.querySelector("[data-product-gallery]");
  if (!section || !gallery) return;

  section.addEventListener(
    "wheel",
    (event) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      const hasHorizontalIntent = absX > absY;
      const looksLikeMouseWheel =
        event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL ||
        (absY >= 50 && absX < 1);

      if (!hasHorizontalIntent && !looksLikeMouseWheel) return;

      const scrollDelta = hasHorizontalIntent ? event.deltaX : event.deltaY;
      if (!scrollDelta) return;

      const maxScroll = gallery.scrollWidth - gallery.clientWidth;
      const nextScroll = gallery.scrollLeft + scrollDelta;
      const canScrollLeft = scrollDelta < 0 && gallery.scrollLeft > 0;
      const canScrollRight = scrollDelta > 0 && gallery.scrollLeft < maxScroll;

      if (!canScrollLeft && !canScrollRight) return;

      event.preventDefault();
      gallery.scrollLeft = Math.max(0, Math.min(maxScroll, nextScroll));
    },
    { passive: false },
  );
}

function setSelectedSize(container) {
  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      container
        .querySelectorAll("button")
        .forEach((btn) => btn.classList.remove("is-selected"));
      button.classList.add("is-selected");
    });
  });
}

function updateHistoryForProduct(slug) {
  const url = new URL(window.location.href);
  if (slug) {
    url.searchParams.set("product", slug);
  } else {
    url.searchParams.delete("product");
  }
  window.history.pushState({ product: slug || null }, "", url);
}

function replaceHistoryForProduct(slug) {
  const url = new URL(window.location.href);
  if (slug) {
    url.searchParams.set("product", slug);
  } else {
    url.searchParams.delete("product");
  }
  window.history.replaceState({ product: slug || null }, "", url);
}

function fitFooterBrand() {
  const brand = document.querySelector("[data-footer-brand]");
  if (!brand) return;
  const parent = brand.parentElement;
  if (!parent) return;
  brand.style.fontSize = "";
  const availableWidth = Math.floor(parent.clientWidth * 0.96);
  if (!availableWidth) return;
  brand.style.fontSize = "220px";
  const measuredWidth = brand.scrollWidth || 1;
  const nextSize = Math.max(
    44,
    Math.floor((availableWidth / measuredWidth) * 220),
  );
  brand.style.fontSize = `${nextSize}px`;
}

function initFooterBrandFit() {
  fitFooterBrand();
  window.addEventListener("resize", fitFooterBrand);
  if ("ResizeObserver" in window) {
    const footer = document.querySelector(".site-footer");
    if (footer) {
      const resizeObserver = new ResizeObserver(() => fitFooterBrand());
      resizeObserver.observe(footer);
    }
  }
}

function openImageOverlay(src, label) {
  const overlay = document.querySelector("[data-image-overlay]");
  const image = document.querySelector("[data-image-overlay-img]");
  const caption = document.querySelector("[data-image-overlay-caption]");
  if (!overlay || !image || !caption) return;

  image.src = src;
  image.alt = label;
  caption.textContent = label;
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
}

function closeImageOverlay() {
  const overlay = document.querySelector("[data-image-overlay]");
  const image = document.querySelector("[data-image-overlay-img]");
  if (!overlay) return;

  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  image?.removeAttribute("src");
}

function initImageOverlay() {
  const overlay = document.querySelector("[data-image-overlay]");
  if (!overlay) return;

  overlay.querySelectorAll("[data-image-close]").forEach((closeControl) => {
    closeControl.addEventListener("click", closeImageOverlay);
  });
}

function closeProductOverlay({ updateHistory = true } = {}) {
  const overlay = document.querySelector("[data-product-overlay]");
  if (!overlay) return;
  closeImageOverlay();
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-overlay-open");
  document.title = DEFAULT_TITLE;
  activeProductSlug = null;
  if (updateHistory) updateHistoryForProduct(null);
}

function renderProductOverlay(product, { updateHistory = true } = {}) {
  const page = document.querySelector("[data-product-page]");
  const overlay = document.querySelector("[data-product-overlay]");
  if (!page || !overlay || !product) return;
  activeProductSlug = product.slug;
  document.title = `${product.name} | brandname`;
  document.querySelector("[data-product-name]").textContent = product.name;
  document.querySelector("[data-product-description]").textContent =
    product.description;
  const availability = document.querySelector("[data-product-availability]");
  if (availability) {
    availability.textContent = product.availability || "";
    availability.hidden = !product.availability;
  }
  document.querySelector("[data-shopify-link]").href = product.shopifyUrl;

  const details = document.querySelector("[data-product-details]");
  details.innerHTML = (product.details || [])
    .map((detail) => `<li>${detail}</li>`)
    .join("");

  const sizes = document.querySelector("[data-product-sizes]");
  sizes.innerHTML = (product.sizes || [])
    .map(
      (size, index) =>
        `<button type="button" class="${index === 0 ? "is-selected" : ""}">${size}</button>`,
    )
    .join("");
  setSelectedSize(sizes);

  const images = document.querySelector("[data-product-images]");
  renderProductCarousel(images, product);
  renderRelatedProducts(product);

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-overlay-open");
  if (updateHistory) updateHistoryForProduct(product.slug);

  overlay.querySelectorAll(".fade-in").forEach((el) => {
    el.classList.remove("is-visible");
    observer.observe(el);
  });
}

function initProductOverlay(products) {
  const overlay = document.querySelector("[data-product-overlay]");
  if (!overlay) return;

  document.querySelectorAll("[data-product-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const slug = trigger.getAttribute("data-product-trigger");
      const product = products.find((item) => item.slug === slug);
      if (product) renderProductOverlay(product);
    });
  });

  overlay.querySelectorAll("[data-product-close]").forEach((closeControl) => {
    closeControl.addEventListener("click", () => closeProductOverlay());
  });

  document.addEventListener("keydown", (event) => {
    const imageOverlay = document.querySelector("[data-image-overlay]");
    if (event.key === "Escape" && imageOverlay?.classList.contains("is-open")) {
      closeImageOverlay();
      return;
    }

    if (event.key === "Escape" && activeProductSlug) {
      closeProductOverlay();
    }
  });

  window.addEventListener("popstate", () => {
    const slug = new URL(window.location.href).searchParams.get("product");
    if (!slug) {
      closeProductOverlay({ updateHistory: false });
      return;
    }
    const product = products.find((item) => item.slug === slug);
    if (product) {
      renderProductOverlay(product, { updateHistory: false });
    }
  });

  const initialSlug = new URL(window.location.href).searchParams.get("product");
  if (initialSlug) {
    const product = products.find((item) => item.slug === initialSlug);
    if (product) {
      renderProductOverlay(product, { updateHistory: false });
      replaceHistoryForProduct(initialSlug);
    }
  }
}

async function initProducts() {
  try {
    const products = await getProducts();
    renderGallery(products);
    initProductOverlay(products);
  } catch (_) {
    return;
  }
}

function initSite() {
  clearLaunchSessionOnRefresh();
  initLoader();
  initLaunchVideo();
  initLaunchGate();
  initMenu();
  initObserver();
  initSignupForms();
  initHorizontalGalleryScroll();
  initImageOverlay();
  initFooterBrandFit();
  initProducts();
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("site-layout:loaded", initSite, { once: true });
});
