# 📦 Masonry Layout Requirements Document

## 🧠 Overview

This document outlines the **technical and design requirements** for implementing a **masonry-style archive gallery** that dynamically loads content from `archive.json` using `archive.js`. The goal is to achieve a **clean, responsive, column-based layout** that automatically adapts to the number and size of items without complex layout logic or JavaScript-heavy solutions.

---

## 🎯 Objectives

- Load project data dynamically via JSON
- Create a visually appealing **masonry-style layout**
- Ensure **responsive behavior** (1–3 columns based on screen width)
- Minimize dependencies and keep the solution maintainable
- Avoid unnecessary use of JavaScript layout libraries unless needed for advanced cases

---

## ✅ Recommended Approach

### 1. **CSS Column-Based Masonry Layout**

Use native CSS `column-count` to achieve masonry behavior without external libraries.

#### CSS Rules

```css
.grid-container.gallery {
  column-count: 3;
  column-gap: var(--spacing3);
}

.grid-container.gallery .grid-item {
  break-inside: avoid;
  margin-bottom: var(--spacing3);
  width: 100%;
}
Responsive Adjustments
css
Copy
Edit
@media (max-width: 1024px) {
  .grid-container.gallery {
    column-count: 2;
  }
}
@media (max-width: 600px) {
  .grid-container.gallery {
    column-count: 1;
  }
}
Notes:
Avoid grid-column span classes (like grid-triple) inside the masonry layout, as they are irrelevant in a column layout.

You may retain these classes in other grid-based sections.

2. HTML Structure
A sample structure (you do not manually write this—see JavaScript section below):

html
Copy
Edit
<div class="grid-container gallery">
  <div class="grid-item">
    <img src="..." alt="...">
    <h5>Project Name</h5>
    <p>Description</p>
    <div class="tags">
      <h6>tag1</h6>
      <h6>tag2</h6>
    </div>
  </div>
  <!-- Repeat -->
</div>
3. JSON Structure (archive.json)
json
Copy
Edit
[
  {
    "name": "Project Title",
    "path": "../archive/content/example.png",
    "description": "Short project description here.",
    "tags": ["tag1", "tag2"]
  }
]
Ensure image paths are correct relative to the HTML that loads them.

4. JavaScript (archive.js)
Dynamically load archive content and inject it into .grid-container.gallery.

js
Copy
Edit
fetch('archive.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('.grid-container.gallery');
    data.forEach(project => {
      const item = document.createElement('div');
      item.classList.add('grid-item');

      item.innerHTML = `
        <img src="${project.path}" alt="${project.name}">
        <h5>${project.name}</h5>
        <p>${project.description}</p>
        <div class="tags">
          ${project.tags.map(tag => `<h6>${tag}</h6>`).join('')}
        </div>
      `;

      container.appendChild(item);
    });
  });
🔄 Optional Alternative: Masonry.js (if you need tighter control)
If you require:

More control over item positioning

Animations when loading items

Items that have different widths (e.g., not uniform)

Then consider Masonry.js and replace .grid-container.gallery with this structure:

html
Copy
Edit
<div class="grid-container gallery">
  <div class="grid-sizer"></div>
  <div class="grid-item">...</div>
</div>
Then initialize Masonry after content is loaded:

js
Copy
Edit
const msnry = new Masonry('.grid-container.gallery', {
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  percentPosition: true,
  gutter: 24
});
⚠️ Only use this if native CSS columns are insufficient for your design.

📐 Visual & UX Notes
Images and text must be width: 100% inside .grid-item to flow properly

Maintain consistent margin-bottom spacing between items

Use border-radius, box-shadow, or hover effects for polish (optional)

📁 File Structure
bash
Copy
Edit
/archive/
  archive.json
  archive.js
  content/
    1.png
    2.png
    ...
/styles/
  style.css
index.html
✅ Summary
Feature	Status
JSON-based dynamic loading	✅
Native CSS masonry layout	✅
Responsive column count	✅
Clean separation of concerns	✅
Minimal JS dependencies	✅
Optional advanced control	Masonry.js available

✍️ To Do
 Ensure archive.json paths are correct

 Add fallback alt text for accessibility

 Lazy-load images if performance is an issue

 Consider filtering/sorting logic later via JS

yaml
Copy
Edit

---

Let me know if you want a version split across files (`README.md`, `archive.js`, `style.css`), or if you'd like