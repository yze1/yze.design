document.addEventListener("DOMContentLoaded", function () {
    // Titles and width classes for headings
    const headingTitles = [
        "Interests & Influences",
        "7 Principles",
        "Artist Research",
        "MakingA",
        "Packaging",
        "Packaging Development",
    ];
    const headingWidths = [
        "one",
        "one",
        "two",
        "one",
        "one",
        "three"
    ];

    // Populate heading titles and apply width classes
    const headings = document.querySelectorAll(".heading");

    headings.forEach((heading, index) => {
        if (index >= headingTitles.length) return; // Prevents extra headings from being processed

        // Get the corresponding title and width class from the arrays
        const title = headingTitles[index];
        const widthClass = headingWidths[index];

        // Find the <h3> inside the heading div and set its text content
        const h3Element = heading.querySelector("h3");
        if (h3Element) {
            h3Element.textContent = title;
        }

        // Update the heading ID dynamically
        heading.id = `H${String(index + 1).padStart(2, "0")}`;

        // Apply the width class from the headingWidths array
        heading.classList.add(widthClass);
    });

    // Populate the contentList div with items from the headingTitles array
    const contentList = document.getElementById("contentList");

    if (contentList) {
        headingTitles.forEach((title, index) => {
            // Create a paragraph element for each title
            const paragraph = document.createElement("p");
            paragraph.textContent = title;

            // Add the paragraph to the content list
            contentList.appendChild(paragraph);

            // Add a divider after each paragraph except the last one
            if (index < headingTitles.length - 1) {
                const divider = document.createElement("div");
                divider.classList.add("divider");
                contentList.appendChild(divider);
            }
        });
    }
});