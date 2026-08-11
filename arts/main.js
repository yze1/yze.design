(() => {
  const scriptUrl = new URL(document.currentScript?.src || "/main.js", location.href);
  const root = new URL("../", scriptUrl);
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const rootPath = (path) => new URL(path.replace(/^\//, ""), root).href;
  const localPath = (path) => new URL(path, location.href).href;

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url} ${response.status}`);
    return response.json();
  }

  async function loadPartial(selector, path) {
    let target = $(selector);
    if (!target && selector === "[data-footer]") {
      target = document.createElement("div");
      target.dataset.footer = "";
      $(".container")?.after(target);
    }
    if (!target && selector === "[data-llm]") {
      target = document.createElement("div");
      target.dataset.llm = "";
      document.body.appendChild(target);
    }
    if (!target) return;
    const response = await fetch(rootPath(path), { cache: "no-store" });
    if (!response.ok) return;
    target.innerHTML = await response.text();
    $$("a[href^='/']", target).forEach((link) => {
      link.href = rootPath(link.getAttribute("href"));
    });
  }

  function mediaFor(project, key = "thumbnail") {
    const src = project[key];
    if (!src) return "";
    const url = rootPath(src);
    return src.toLowerCase().endsWith(".mp4")
      ? `<video src="${url}" autoplay loop muted playsinline preload="metadata"></video>`
      : `<img src="${url}" alt="${project.name}">`;
  }

  function processUrl(project) {
    if (!project.process || project.process === "N/A") return "";
    return rootPath(`${project.link.replace(/\/$/, "")}/${project.process.replace(/^\/|\/$/g, "")}/`);
  }

  function card(project) {
    const tags = (project.tags || []).map((tag) => (
      `<button class="tag" type="button" data-tag="${tag}">${tag}</button>`
    )).join("");
    return `
          <article class="grid-item project-card" data-tags="${(project.tags || []).join("|")}" data-kind="${project.kind || "showcase"}">
        <div class="media-wrapper">
          ${processUrl(project) ? `<a href="${processUrl(project)}" class="nav-button overlay-button" target="_blank" rel="noopener noreferrer">Process</a>` : ""}
          ${mediaFor(project)}
        </div>
        <a href="${rootPath(project.link)}" class="project-card-link">
          <div class="metadata">
            <h4 class="title">${project.name}</h4>
            ${project.year ? `<h5 class="year">${project.year}</h5>` : ""}
          </div>
          ${project.description ? `<p>${project.description}</p>` : ""}
        </a>
        ${tags ? `<div class="tags">${tags}</div>` : ""}
      </article>
    `;
  }

  async function loadProjects() {
    const projectHero = $(".grid-container.project");
    const gallery = $(".grid-container.gallery");
    if (!projectHero && !gallery) return;

    const projects = (await fetchJson(rootPath("data/projects.json"))).filter((project) => project.kind);
    const current = projects.find((project) => {
      const path = new URL(rootPath(project.link)).pathname.replace(/\/$/, "");
      return path && path === location.pathname.replace(/\/$/, "");
    });

    if (projectHero && current) {
      const url = processUrl(current);
      projectHero.innerHTML = `
        <div class="grid-single">
          <div class="project-metadata-container">
            <div class="project-title-year">
              <h3>${current.name}</h3>
              ${current.year ? `<h3 class="year">${current.year}</h3>` : ""}
            </div>
            ${url ? `<a href="${url}" class="nav-button project-process-link">Process</a>` : ""}
          </div>
          ${mediaFor(current, "hero")}
          ${current.description ? `<p class="description">${current.description}</p>` : ""}
        </div>
      `;
    }

    if (!gallery) return;

    const isSnapshot = gallery.classList.contains("snapshot");
    const showcase = projects.filter((project) => project.kind === "showcase");
    const extra = projects.filter((project) => project.kind === "more");
    let expanded = false;
    let activeTag = "";

    function visibleProjects() {
      const base = isSnapshot || (!expanded && !activeTag) ? showcase : [...showcase, ...extra];
      return activeTag ? [...showcase, ...extra].filter((project) => (project.tags || []).includes(activeTag)) : base;
    }

    function render() {
      gallery.classList.toggle("project-showcase", isSnapshot);
      gallery.innerHTML = visibleProjects().map(card).join("");
      $$(".tag", gallery).forEach((button) => {
        button.classList.toggle("is-active", button.dataset.tag === activeTag);
        button.addEventListener("click", (event) => {
          event.preventDefault();
          activeTag = activeTag === button.dataset.tag ? "" : button.dataset.tag;
          render();
        });
      });
      $$(".media-wrapper", gallery).forEach((wrapper) => {
        wrapper.addEventListener("click", (event) => {
          if (event.target.closest("a")) return;
          const link = $(".project-card-link", wrapper.closest(".project-card"));
          if (link) location.href = link.href;
        });
      });
      if (moreButton) moreButton.hidden = expanded || !extra.length;
    }

    const moreButton = $("#more-projects");
    if (moreButton) {
      moreButton.hidden = !extra.length;
      moreButton.addEventListener("click", () => {
        activeTag = "";
        expanded = true;
        render();
      });
    }

    render();
  }

  async function loadReviews() {
    const container = $("#reviews-container");
    if (!container) return;
    const reviews = await fetchJson(rootPath("data/reviews.json"));
    container.innerHTML = reviews.map((review) => `
      <div class="grid-triple" data-review="true">
        <h5>"${review.review}"</h5>
        <h4 class="rating">.star.star.star.star.star</h4>
        <p class="source">${review.nationality} ${review.author} from ${review.source}</p>
      </div>
    `).join("");
  }

  function loadLogos() {
    const track = $("#logos-track");
    if (!track) return;
    const files = ["food.svg", "tate.svg", "anthropic.svg", "ual.svg"];
    const set = files.map((file) => `
      <div class="logo-item" aria-hidden="true">
        <img src="${rootPath(`assets/logos/${file}`)}" alt="${file.replace(/\.svg$/i, "")}" draggable="false">
      </div>
    `).join("");
    track.innerHTML = `<div class="logos-set">${set}</div>`.repeat(6);
    requestAnimationFrame(() => {
      const width = $(".logos-set", track)?.getBoundingClientRect().width || 0;
      track.style.setProperty("--logos-loop-width", `${width}px`);
    });
  }

  function revealOnScroll() {
    const elements = $$(".grid-item, img, video, iframe, h1, h2, h3, p");
    elements.forEach((element) => element.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "80px" });
    elements.forEach((element) => io.observe(element));
  }

  async function loadScreen(siteReady = Promise.resolve()) {
    const isLanding = document.body.classList.contains("landing-page");

    const heroVideo = $("#landing-hero-video");
    const heroSrc = heroVideo?.dataset.src;
    const loader = document.createElement("div");
    const cursorStage = document.createElement("div");
    const asciiStage = document.createElement("div");
    const cursor = document.createElement("div");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    const offscreen = document.createElement("canvas");
    const offctx = offscreen.getContext("2d", { willReadFrequently: true });
    const preview = document.createElement("video");
    const chars = " .,:;i1tfLCG08@";
    let mouseX = innerWidth / 2;
    let mouseY = innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let start = 0;
    let cols = 0;
    let rows = 0;
    let cell = 10;
    let frame = 0;
    let cursorFrame = 0;

    document.body.classList.add("yze-loading", "yze-phase-1");
    loader.className = "yze-loader";
    cursorStage.className = "yze-cursor-stage";
    asciiStage.className = "yze-ascii-stage";
    cursor.className = "yze-load-cursor";
    cursor.textContent = "y";
    canvas.className = "yze-ascii-canvas";
    preview.muted = true;
    preview.loop = true;
    preview.playsInline = true;
    preview.preload = "auto";
    preview.src = rootPath("assets/video-preview.mp4");
    cursorStage.append(cursor);
    if (isLanding) {
      asciiStage.append(canvas);
      loader.append(asciiStage);
    }
    loader.append(cursorStage);
    document.body.appendChild(loader);

    const waitFont = (font) => document.fonts?.load(font).catch(() => {}) || Promise.resolve();
    const waitVideo = (video, event = "loadeddata") => new Promise((resolve) => {
      if (video.readyState >= 2) return resolve();
      video.addEventListener(event, resolve, { once: true });
      video.addEventListener("error", resolve, { once: true });
      video.load();
    });
    const loadVideoBlob = async (video, src) => {
      if (!video || !src) return;
      const response = await fetch(rootPath(src));
      if (!response.ok) throw new Error(`${src} ${response.status}`);
      video.src = URL.createObjectURL(await response.blob());
      video.load();
      await waitVideo(video, "loadeddata");
    };

    const sizeCanvas = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cell = innerWidth < 700 ? 8 : 10;
      cols = Math.ceil(innerWidth / cell);
      rows = Math.ceil(innerHeight / cell);
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      offscreen.width = cols;
      offscreen.height = rows;
    };

    const cropCover = (sw, sh, tw, th) => {
      const sourceRatio = sw / sh;
      const targetRatio = tw / th;
      let sx = 0, sy = 0, width = sw, height = sh;
      if (sourceRatio > targetRatio) {
        width = sh * targetRatio;
        sx = (sw - width) / 2;
      } else {
        height = sw / targetRatio;
        sy = (sh - height) / 2;
      }
      return { sx, sy, width, height };
    };

    const mainDuration = 2000;
    const firstDuration = mainDuration * (50 / 40);
    const easePower = 3;
    const pulseAmount = 0;
    const easeInOut = (local) => (
      local < 0.5
        ? 0.5 * Math.pow(local * 2, easePower)
        : 1 - 0.5 * Math.pow((1 - local) * 2, easePower)
    );
    const getLoopWeight = (progress, firstLoop) => {
      const stepped = progress * (firstLoop ? 5 : 4);
      const segment = Math.min(firstLoop ? 4 : 3, Math.floor(stepped));
      const eased = easeInOut(stepped - segment);
      return firstLoop ? segment * 10 + eased * 10 : 10 + (segment + eased) * 10;
    };

    function animateCursor(now) {
      if (!document.body.classList.contains("yze-phase-2")) return;
      if (!start) start = now;
      cursorX += (mouseX - cursorX) * 0.35;
      cursorY += (mouseY - cursorY) * 0.35;
      const elapsed = now - start;
      const firstLoop = elapsed < firstDuration;
      const progress = firstLoop
        ? elapsed / firstDuration
        : ((elapsed - firstDuration) % mainDuration) / mainDuration;
      const weight = getLoopWeight(progress, firstLoop);
      const pulse = 1 - pulseAmount * Math.pow(Math.sin(progress * Math.PI * 4), 2);
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      cursor.style.opacity = "1";
      cursor.style.fontVariationSettings = `"wght" ${weight.toFixed(2)}`;
      cursor.style.transform = `translate(-50%, -50%) rotate(0deg) scale(${pulse})`;
      cursorFrame = requestAnimationFrame(animateCursor);
    }

    function drawAscii() {
      if (!document.body.classList.contains("yze-phase-3")) return;
      const source = heroVideo?.readyState >= 2 ? heroVideo : preview;
      if (!source || source.videoWidth <= 0) {
        frame = requestAnimationFrame(drawAscii);
        return;
      }
      const crop = cropCover(source.videoWidth, source.videoHeight, cols, rows);
      offctx.drawImage(source, crop.sx, crop.sy, crop.width, crop.height, 0, 0, cols, rows);
      const data = offctx.getImageData(0, 0, cols, rows).data;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      ctx.font = `400 ${cell * 1.2}px YZE, monospace`;
      ctx.textBaseline = "top";
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const i = (y * cols + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          const boost = lum < 0.18 ? 0.18 / lum || 1 : 1;
          ctx.fillStyle = `rgb(${Math.min(255, r * boost)},${Math.min(255, g * boost)},${Math.min(255, b * boost)})`;
          ctx.fillText(chars[Math.min(chars.length - 1, Math.floor(lum * chars.length))], x * cell, y * cell);
        }
      }
      frame = requestAnimationFrame(drawAscii);
    }

    const updateMouse = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };
    document.addEventListener("mousemove", updateMouse, { passive: true });
    addEventListener("resize", sizeCanvas);
    sizeCanvas();

    await waitFont("400 16px YZELoad");
    document.body.classList.replace("yze-phase-1", "yze-phase-2");
    requestAnimationFrame(animateCursor);
    if (!isLanding) {
      await Promise.all([siteReady, waitFont("400 16px YZE")]);
      await new Promise((resolve) => setTimeout(resolve, 650));
      cancelAnimationFrame(cursorFrame);
      loader.remove();
      document.body.classList.remove("yze-loading", "yze-phase-2");
      document.removeEventListener("mousemove", updateMouse);
      removeEventListener("resize", sizeCanvas);
      return;
    }

    await Promise.all([waitVideo(preview), waitFont("400 16px YZE")]);
    await preview.play().catch(() => {});

    document.body.classList.replace("yze-phase-2", "yze-phase-3");
    cancelAnimationFrame(cursorFrame);
    drawAscii();
    await Promise.all([loadVideoBlob(heroVideo, heroSrc), siteReady]);
    await heroVideo?.play().catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 350));
    cancelAnimationFrame(frame);
    loader.remove();
    document.body.classList.remove("yze-loading", "yze-phase-3");
    document.removeEventListener("mousemove", updateMouse);
    removeEventListener("resize", sizeCanvas);
  }

  function customCursor() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    const label = document.createElement("span");
    label.className = "custom-cursor-label";
    cursor.appendChild(label);
    document.body.appendChild(cursor);

    function colorUnderPointer(element) {
      if (document.body.classList.contains("mobile-menu-open")) return "light";
      if (element?.closest("[data-footer], .site-footer")) return "light";
      if (element?.closest(".landing-hero, .landing-hero-media")) return "light";
      if (document.body.classList.contains("landing-page") && scrollY + lastY < innerHeight) return "light";
      for (let node = element; node && node !== document; node = node.parentElement) {
        const color = getComputedStyle(node).backgroundColor;
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match && (match[4] === undefined || Number(match[4]) > 0)) {
          const [, r, g, b] = match.map(Number);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness < 128 ? "light" : "dark";
        }
      }
      return "dark";
    }

    let lastY = 0;
    document.addEventListener("mousemove", (event) => {
      lastY = event.clientY;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const hover = target?.closest("a, button");
      // const text = hover ? "Link" : "";
      label.textContent = text;
      cursor.style.setProperty("--cursor-width", hover && text ? `${Math.ceil(label.scrollWidth + 26)}px` : "12px");
      cursor.classList.toggle("hover-link", !!hover);
      cursor.classList.toggle("cursor-light", !hover && colorUnderPointer(target) === "light");
      cursor.classList.toggle("cursor-dark", !hover && colorUnderPointer(target) === "dark");
    });
  }

  function initLLM() {
    const chatPanel = $("#chatPanel");
    if (!chatPanel) return;

    const endpoint = "/gemini.php";
    const profileContext = `
You are an assistant embedded on Eddie Cranmer's portfolio website.

Your job:
Answer questions about Eddie Cranmer, his work, services, background, skills, portfolio, and suitability for design, AI, or creative technology projects.

Do not answer as Eddie. Answer as a clear, concise site assistant.

Eddie Cranmer:
- Born 6th September 2001: Age 24
- London-based designer working across graphic design, computational design, AI-assisted workflows, and creative technology.
- Portfolio: yze.design.
- Best work: yze.design/work.
- Mini-projects and experiments: yze.design/m.
- BA Graphic Design with Diploma in Apple Development, Camberwell College of Arts, UAL, 2021-2025; First Class Honours.
- Foundation Diploma in Art & Design, SGS College, Bristol, 2020-2021; Distinction.
- Adobe Certified Professional in Photoshop.
- Certified Apple Developer.
- Camberwell College of Arts Interaction Design Award.
- Freelance graphic designer since 2021 with 500+ completed projects for an international client base.
- Fiverr experience includes apparel graphics, branding, logos, visual identity, websites, presentation assets, and AI-assisted visuals.
- Has worked as a freelance contractor with FOOD Arts & Technology on AI concept and prototype work for global brands.
- Participated in the May 2025 Tech, Tea + Exchange generative AI residency, a UAL/Goldsmiths collaboration with Tate and Anthropic; final work was exhibited at Tate.
- Interested in moving beyond pure graphic design toward AI, creative technology, computational design, applied AI systems, and design-tech hybrid work.

Positioning:
Present Eddie as a designer and practical AI systems builder, not as a formal ML engineer or computer scientist. Emphasise his strength at the intersection of visual design, systems thinking, AI workflows, creative coding, and client-facing delivery.

Skills and tools:
- Design: Photoshop, Illustrator, InDesign, Figma, Glyphs, typography, layout, hierarchy, branding, visual identity, presentation design.
- AI and generative workflows: ComfyUI, Flux, local models, Midjourney, Gemini, Stable Diffusion workflows, prompt schemas, AI image generation, creative pipelines, LoRA workflows, AI automation.
- Code and interaction: HTML, CSS, Python, JavaScript, p5.js, Swift, TouchDesigner, MediaPipe.
- Motion and 3D: After Effects, Premiere Pro, Blender.
- Working style: fast iteration, clear client communication, practical delivery, process-led experimentation, and controlled use of AI rather than uncontrolled output.

Relevant project areas:
- Democratising Design: AI, local models, ComfyUI, Flux, MediaPipe, TouchDesigner, gesture controls, and AI-enabled creative access.
- Arts: graphic design, typography, hierarchy, layout, motion, AI, kit design, brand systems, and social media template thinking.
- Dissertation / AI explanation work: thinking about AI's effect on the design industry and explaining AI concepts clearly.
- Analyst: exploration of how design and AI can interact.
- Foresight: website-design project and portfolio experiment.
- yze.design/m: mini-projects, experiments, learning logs, and work-in-progress AI/system demonstrations.

Rules:
- Stay on topic.
- If the user asks about unrelated topics, briefly redirect to Eddie's work.
- Do not invent projects, clients, dates, awards, prices, testimonials, credentials, or private details.
- Do not mention private notes, income, health, relationships, internal career planning, or non-public personal information.
- If information is not present in the website context, say that the site does not currently provide that detail.
- Do not overclaim Eddie's technical background. He has practical AI/design and beginner-to-intermediate coding experience, not formal ML engineering credentials.
- Keep answers concise, direct, and useful.
`;
    const offTopicTerms = ["politics", "religion", "medical", "diagnosis", "stock", "crypto", "homework", "essay", "password", "hack", "jailbreak", "weather"];
    const closeChat = $("#closeChat");
    const resetChat = $("#resetChat");
    const infoChat = $("#infoChat");
    const chatBody = $("#chatBody");
    const emptyState = $("#emptyState");
    const messages = $("#messages");
    const questionInput = $("#question");
    const sendButton = $("#send");
    let chatHistory = [];

    function showChat(event) {
      event?.preventDefault();
      document.body.classList.add("chat-open");
      chatPanel.setAttribute("aria-hidden", "false");
      setTimeout(() => questionInput?.focus(), 260);
    }
    function hideChat() {
      document.body.classList.remove("chat-open");
      chatPanel.setAttribute("aria-hidden", "true");
    }
    function appendMessage(role, text) {
      emptyState.hidden = true;
      const el = document.createElement("div");
      el.className = `message ${role}`;
      el.textContent = text;
      messages.appendChild(el);
      chatBody.scrollTop = chatBody.scrollHeight;
      return el;
    }
    function resetConversation() {
      chatHistory = [];
      messages.innerHTML = "";
      emptyState.hidden = false;
      questionInput.value = "";
      questionInput.focus();
    }
    function buildPrompt(question) {
      const recentHistory = chatHistory.slice(-6).map((message) => `${message.role}: ${message.text}`).join("\n");
      return `${profileContext}\nRecent chat:\n${recentHistory}\n\nUser question:\n${question}\n\nReturn only the final answer.`;
    }
    async function askGemini(forcedQuestion) {
      const question = (forcedQuestion || questionInput.value).trim();
      if (!question) return;
      showChat();
      appendMessage("user", question);
      questionInput.value = "";
      if (offTopicTerms.some((term) => question.toLowerCase().includes(term))) {
        appendMessage("assistant", "This assistant only answers questions about Eddie Cranmer's work, background, tools, portfolio and services.");
        return;
      }
      sendButton.disabled = true;
      const thinking = appendMessage("assistant", "Thinking...");
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: buildPrompt(question) }] }] })
        });
        if (!response.ok) throw new Error(await response.text() || response.statusText);
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer returned.";
        thinking.textContent = reply;
        chatHistory.push({ role: "user", text: question }, { role: "assistant", text: reply });
      } catch (err) {
        thinking.textContent = `Gemini request failed:\n${err.message}`;
      } finally {
        sendButton.disabled = false;
      }
    }

    $$("[data-open-llm]").forEach((button) => button.addEventListener("click", showChat));
    closeChat?.addEventListener("click", hideChat);
    resetChat?.addEventListener("click", resetConversation);
    infoChat?.addEventListener("click", () => {
      showChat();
      appendMessage("assistant", "This assistant answers questions about Eddie Cranmer's work, background, tools, portfolio and services.");
    });
    sendButton?.addEventListener("click", () => askGemini());
    questionInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        askGemini();
      }
    });
    $$(".suggestion", chatPanel).forEach((button) => button.addEventListener("click", () => askGemini(button.dataset.prompt)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hideChat();
    });
  }

  // function smoothHorizontalWheel(carousel) {
  //   if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  //   let target = carousel.scrollLeft;
  //   let frame = 0;

  //   carousel.addEventListener("wheel", (event) => {
  //     if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  //     event.preventDefault();
  //     const delta = event.deltaY * (event.deltaMode ? 40 : 1);
  //     const max = carousel.scrollWidth - carousel.clientWidth;
  //     target = Math.max(0, Math.min(max, target + delta));

  //     if (frame) return;
  //     const tick = () => {
  //       carousel.scrollLeft += (target - carousel.scrollLeft) * 0.28;
  //       if (Math.abs(target - carousel.scrollLeft) < 0.5) {
  //         carousel.scrollLeft = target;
  //         frame = 0;
  //         return;
  //       }
  //       frame = requestAnimationFrame(tick);
  //     };
  //     frame = requestAnimationFrame(tick);
  //   }, { passive: false });
  // }
  
  function horizontalHoverScroll(carousel) {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    carousel.addEventListener("wheel", (event) => {
      if (!carousel.matches(":hover")) return;

      event.preventDefault();

      carousel.scrollLeft += event.deltaY || event.deltaX;
    }, { passive: false });
  }

  function mobileMenu() {
    const toggle = $(".mobile-menu-toggle");
    const header = $(".column-header");
    if (!toggle || !header) return;
    const panel = document.createElement("div");
    panel.id = "mobile-menu-panel";
    panel.className = "mobile-menu-panel";
    panel.hidden = true;
    const links = $$("a", header).slice(1).map((link) => (
      `<a href="${link.href}"${link.dataset.openLlm !== undefined ? " data-open-llm" : ""}>${link.textContent.trim()}</a>`
    )).join("");
    const footer = $("[data-footer] .site-footer")?.cloneNode(true);
    panel.innerHTML = `<nav class="mobile-menu-links">${links}</nav><div class="mobile-menu-footer"></div>`;
    if (footer) $(".mobile-menu-footer", panel).appendChild(footer);
    document.body.appendChild(panel);

    toggle.addEventListener("click", () => {
      const open = panel.hidden;
      panel.hidden = !open;
      document.body.classList.toggle("mobile-menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "->" : "==";
    });
  }

  function stickyProcessButton() {
    const button = $(".project-process-link");
    if (!button) return;
    let start = 0;
    let left = 0;
    let width = 0;
    let top = 0;

    function measure() {
      button.classList.remove("is-fixed");
      button.style.top = "";
      button.style.left = "";
      button.style.width = "";
      const rect = button.getBoundingClientRect();
      start = rect.top + scrollY;
      left = rect.left;
      width = rect.width;
      top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing2")) || 24;
      update();
    }

    function update() {
      const fixed = scrollY > start - top;
      button.classList.toggle("is-fixed", fixed);
      button.style.top = fixed ? `${top}px` : "";
      button.style.left = fixed ? `${left}px` : "";
      button.style.width = fixed ? `${width}px` : "";
    }

    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", measure);
    measure();
  }

  function fullscreenMedia() {
    document.addEventListener("click", (event) => {
      const media = event.target.closest("img, video");
      if (!media || media.closest("a, .logo-item, .project-card")) return;
      event.preventDefault();
      const overlay = document.createElement("div");
      overlay.className = "fullscreen-overlay";
      overlay.innerHTML = `<div class="fullscreen-media-container"></div>`;
      const clone = media.cloneNode(true);
      clone.className = "fullscreen-media";
      $(".fullscreen-media-container", overlay).appendChild(clone);
      document.body.appendChild(overlay);
      overlay.style.display = "flex";

      overlay.addEventListener("click", () => overlay.remove());
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          overlay.remove()
        }
      })
    });
  }

  function londonTime() {
    const target = $("#london-time");
    if (!target) return;
    const tick = () => {
      target.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date());
    };
    tick();
    setInterval(tick, 1000);
  }

  async function archiveGrid() {
    const container = $(".grid-container.column-masonry");
    if (!container) return;
    const items = await fetchJson(localPath("archive.json"));
    container.innerHTML = items.map((item) => `
      <div class="grid-item">
        <div class="archive-item-container">
          <img src="${item.path}" alt="${item.name}" loading="lazy" class="archive-image">
        </div>
      </div>
    `).join("");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    let readySite;
    const siteReady = new Promise((resolve) => {
      readySite = resolve;
    });
    const loader = loadScreen(siteReady);
    document.body.classList.toggle("has-spacious", !!$(".container.spacious"));
    await Promise.allSettled([loadProjects(), loadReviews(), archiveGrid()]);
    loadLogos();
    londonTime();
    // $$(".project-showcase").forEach(smoothHorizontalWheel);
    $$(".project-showcase").forEach(horizontalHoverScroll);
    mobileMenu();
    stickyProcessButton();
    initLLM();
    customCursor();
    readySite();
    await loader;
    revealOnScroll();
    fullscreenMedia();
  });
})();
