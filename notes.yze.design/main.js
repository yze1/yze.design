(() => {
  const scriptUrl = new URL(document.currentScript?.src || "./main.js", location.href);
  const base = new URL(".", scriptUrl);
  const $ = (selector, scope = document) => scope.querySelector(selector);
  async function fetchNotes() {
    const response = await fetch(new URL("notes.json", base), { cache: "no-store" });
    if (!response.ok) throw new Error(`notes.json ${response.status}`);
    return response.json();
  }

  function slugFromTitle(title) {
    return (String(title).match(/[A-Za-z0-9]+/g) || [])
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("");
  }

  function currentSlug() {
    const relative = location.pathname.replace(base.pathname, "").replace(/^\/|\/$/g, "");
    return relative.split("/").filter(Boolean).pop() || "";
  }

  function renderList(notes) {
    const list = $("[data-blog-list]");
    const post = $("[data-blog-post]");
    if (!list) return;
    if (post) post.hidden = true;
    list.hidden = false;
    list.innerHTML = notes.map((note) => {
      const tags = (note.tags || []).map((tag) =>
        `<button class="tag" type="button" data-tag="${tag}">${tag}</button>`
      ).join("");

      return `
        <article class="project-card" data-tags="${(note.tags || []).join("|")}">
          <div class="media-wrapper">
            <a href="${new URL(`${slugFromTitle(note.title)}/`, base).href}">
              <img src="${new URL(note.thumbnail.replace(/^\//, ""), base).href}" alt="${note.title}">
            </a>
          </div>
          <div class="metadata">
            <h5 class="title"><strong>${note.title}</strong></h5>
            <p class="year">${note.date}</p>
          </div>
          ${tags ? `<div class="tags">${tags}</div>` : ""}
        </article>`;
    }).join("");

  }

  function renderPost(note) {
    const list = $("[data-blog-list]");
    const post = $("[data-blog-post]");
    if (!post) return;
    if (list) list.hidden = true;
    post.hidden = false;
    document.title = `${note.title} / YZE Notes`;
    post.innerHTML = `
      <h4><strong>${note.title}</strong></h4>
      <img src="${new URL(note.thumbnail.replace(/^\//, ""), base).href}" alt="${note.title}">
      <div class="blog-post-meta">
        <p>${note.date}</p>
        <p>Eddie Cranmer</p>
      </div>
      <p>${note.content.join("<br><br>")}</p>
    `;
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const toggle = $(".mobile-menu-toggle");
    toggle?.addEventListener("click", () => {
      const open = document.body.classList.toggle("mobile-menu-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "\\close" : "==";
    });

    const notes = await fetchNotes();
    const note = notes.find((item) => slugFromTitle(item.title) === currentSlug());
    note ? renderPost(note) : renderList(notes);
  });
})();
