// Auto-detect the folder that script.js is being served from.
// Works on localhost AND production.
const scriptEl =
  document.currentScript ||
  document.querySelector('script[src$="script.js"]');

const PROJECT_ROOT = new URL('.', scriptEl.src); // e.g. http://localhost:5500/betterbilingual/

function applySiteBaseToAssets(root = document) {
  root.querySelectorAll("[data-src]").forEach(el => {
    const rel = el.getAttribute("data-src").replace(/^\//, "");
    el.setAttribute("src", new URL(rel, PROJECT_ROOT).href);
  });
}

async function loadComponent(elementId, componentPath, callback) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            applyProjectLinks(element);
            element.querySelectorAll('[data-href]').forEach(a => {
  a.href = new URL(a.getAttribute('data-href'), PROJECT_ROOT).href;
});
            applySiteBaseToAssets(element);
            if (callback) callback();
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
  loadComponent('header-placeholder', new URL('header.html', PROJECT_ROOT).href);
  loadComponent('footer-placeholder', new URL('footer.html', PROJECT_ROOT).href);
  loadComponent('sidebar-placeholder', new URL('sidebar.html', PROJECT_ROOT).href, initSidebar);

  applySiteBaseToAssets();
});

// Navigation functions
function navigateToHome() {
  window.location.href = PROJECT_ROOT; // "/betterbilingual/"
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    
    sidebar.classList.add('open');
    body.classList.add('sidebar-open');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    
    sidebar.classList.remove('open');
    body.classList.remove('sidebar-open');
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    document.addEventListener('click', (event) => {
    if (!sidebar.classList.contains('open')) return;

    const clickedInsideSidebar = sidebar.contains(event.target);
    const clickedMenuToggle = event.target.closest('.menu-toggle');
    const clickedNavLink =
      event.target.closest('a[data-href], a[href], .sidebar-nav a');

    // If it's NOT a nav click and NOT inside sidebar and NOT the toggle -> close.
    if (!clickedInsideSidebar && !clickedMenuToggle && !clickedNavLink) {
      closeSidebar();
    }
  });

}

function applyProjectLinks(root = document) {
  root.querySelectorAll("[data-href]").forEach(a => {
    const rel = a.getAttribute("data-href");
    a.href = new URL(rel, PROJECT_ROOT).href;
  });
}
