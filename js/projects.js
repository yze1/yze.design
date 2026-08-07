const projectRoot = new URL("../", document.currentScript.src);

function projectUrl(path) {
    return new URL(path.replace(/^\//, ""), projectRoot).href;
}

function projectMedia(project, key = "thumbnail") {
    const src = project[key];
    if (!src) return "";
    const url = projectUrl(src);
    return src.toLowerCase().endsWith(".mp4")
        ? `<video src="${url}" autoplay loop muted playsinline preload="metadata"></video>`
        : `<img src="${url}" alt="${project.name}">`;
}

function githubButtons(project) {
    const links = [project.github || []].flat();
    return links.map(link =>
        `<button type="button" aria-label="Open ${new URL(link).pathname.slice(1)} on GitHub" onclick="location.href='${link}'">GitHub</button>`
    ).join("");
}

function projectCard(project) {
    const process = project.process && project.process !== "N/A"
        ? new URL(project.process.replace(/^\//, ""), projectUrl(project.link)).href
        : "";
    const tags = (project.tags || []).map(tag =>
        `<button class="tag" type="button" data-tag="${tag}">${tag}</button>`
    ).join("");
    const actions = `${process ? `<button class="overlay-button" type="button" onclick="location.href='${process}'">Process</button>` : ""}${githubButtons(project)}`;

    return `
        <article class="project-card" data-tags="${(project.tags || []).join("|")}">
            <div class="media-wrapper">
                ${actions ? `<div class="overlay-actions">${actions}</div>` : ""}
                <a href="${projectUrl(project.link)}">${projectMedia(project)}</a>
            </div>
            <div class="metadata">
                <h5 class="title"><strong>${project.name}</strong></h5>
                ${project.year ? `<p class="year">${project.year}</p>` : ""}
            </div>
            ${project.description ? `<p>${project.description}</p>` : ""}
            ${tags ? `<div class="tags">${tags}</div>` : ""}
        </article>`;
}

let projectData;

function getProjectData() {
    projectData ??= fetch(projectUrl("data/projects.json"), {cache: "no-store"}).then(response => {
        if (!response.ok) throw new Error("Could not load projects");
        return response.json();
    });
    return projectData;
}

function projectProcessUrl(project) {
    return project.process && project.process !== "N/A"
        ? new URL(project.process.replace(/^\//, ""), projectUrl(project.link)).href
        : "";
}

async function loadProjectPage() {
    const container = document.querySelector("section.project");
    const presentation = document.querySelector(".presentation");
    if (!container && !presentation) return;

    const path = location.pathname.replace(/\/index\.html$/, "/");
    const projects = await getProjectData();
    const project = projects.find(item => {
        const projectPath = new URL(projectUrl(item.link)).pathname.replace(/\/index\.html$/, "/");
        return projectPath === path;
    });
    if (!project) return;

    const process = projectProcessUrl(project);
    const actions = `${process ? `<button type="button" onclick="location.href='${process}'">Process</button>` : ""}${githubButtons(project)}`;
    if (container) {
        const details = [
            ["Role", project.role],
            ["Timeline", project.timeline],
            ["Team", project.team],
            ["Skills", project.skills]
        ].filter(([, value]) => value).map(([label, value]) => `
            <div class="s3 t3 m2">
                <h5>${label}</h5>
                <p>${value}</p>
            </div>
        `).join("");

        container.innerHTML = `
            <div class="s10">
                <h3><strong>${project.name}</strong>${project.year ? ` ${project.year}` : ""}</h3>
            </div>
            <div class="s2 right project-actions">
                ${actions}
            </div>
            <div class="s12">${projectMedia(project, project.hero ? "hero" : "thumbnail")}</div>
            ${details}
            ${project.description ? `<div class="s6 end"><h4>${project.description}</h4></div>` : ""}
        `;
    }

    if (actions) {
        document.querySelector("#footer")?.insertAdjacentHTML("beforebegin", `
            <section class="project-actions-bottom${presentation && !container ? " presentation-actions" : ""}">
                <div class="s12 right">${actions}</div>
            </section>
        `);
    }
}

async function loadProjects() {
    const gallery = document.querySelector("[data-projects]");
    if (!gallery) return;

    const projects = (await getProjectData()).filter(project => project.kind);
    const snapshot = gallery.dataset.projects === "snapshot";
    let expanded = false;
    let activeTag = "";

    function render() {
        const all = projects.filter(project => project.kind === "showcase" || project.kind === "more");
        const visible = activeTag
            ? all.filter(project => (project.tags || []).includes(activeTag))
            : !expanded
                ? projects.filter(project => project.kind === "showcase").slice(0, snapshot ? 3 : undefined)
                : all;

        gallery.innerHTML = visible.map(projectCard).join("");
        gallery.querySelectorAll(".tag").forEach(button => {
            button.classList.toggle("is-active", button.dataset.tag === activeTag);
            button.addEventListener("click", () => {
                activeTag = activeTag === button.dataset.tag ? "" : button.dataset.tag;
                render();
            });
        });

        const more = document.querySelector("#more-projects");
        if (more) more.hidden = expanded;
    }

    document.querySelector("#more-projects")?.addEventListener("click", () => {
        activeTag = "";
        expanded = true;
        render();
    });
    render();
}

async function loadReviews() {
    const container = document.querySelector("#reviews-container");
    if (!container) return;

    const response = await fetch(projectUrl("data/reviews.json"), {cache: "no-store"});
    if (!response.ok) throw new Error("Could not load reviews");
    const reviews = await response.json();
    container.innerHTML = reviews.map(review => `
        <div class="s4">
            <h5>"${review.review}"</h5>
            <h4 class="rating"><strong>.star.star.star.star.star</strong></h4>
            <p class="source">${review.nationality} ${review.author} from ${review.source}</p>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", () =>
    Promise.all([loadProjectPage(), loadProjects(), loadReviews()]).catch(console.error)
);
