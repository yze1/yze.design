// Conversion constant: 1mm = 3.779528px
const mmToPx = 3.779528;

// Default A4 page size in mm (portrait mode)
let pageWidthMM = 210;   // A4 width in mm
let pageHeightMM = 297;  // A4 height in mm

// Convert measurements to pixels
let pageWidth = pageWidthMM * mmToPx;
let pageHeight = pageHeightMM * mmToPx;

// Default margin settings (all in mm)
let marginTopMM = 10;
let marginBottomMM = 10;
let marginLeftMM = 10;
let marginRightMM = 10;

// Convert all to pixels
let marginTop = marginTopMM * mmToPx;
let marginBottom = marginBottomMM * mmToPx;
let marginLeft = marginLeftMM * mmToPx;
let marginRight = marginRightMM * mmToPx;

function calculateValues() {
    // Calculate working area (page without margins)
    let pageWorkingWidth = pageWidth - marginLeft - marginRight;
    let pageWorkingHeight = pageHeight - marginTop - marginBottom;

    return { pageWorkingWidth, pageWorkingHeight };
}

function scalePage() {
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    const maxHeight = 0.6 * screenHeight; // 60% of screen height

    // Calculate the aspect ratio of A4
    const aspectRatio = pageHeight / pageWidth;

    // Scale down proportionally if the height exceeds maxHeight
    let scaleFactor = 1;
    if (pageHeight > maxHeight) {
        scaleFactor = maxHeight / pageHeight;
    }

    // Adjust width based on height scaling, while maintaining aspect ratio
    const scaledHeight = pageHeight * scaleFactor;
    const scaledWidth = scaledHeight / aspectRatio;

    // Apply scaling to the page element
    const page = document.getElementById('page');
    page.style.width = `${scaledWidth}px`;
    page.style.height = `${scaledHeight}px`;

    page.style.transform = `scale(${scaleFactor})`;
    page.style.transformOrigin = 'top left'; // Keep scaling from the top-left corner
}

function renderPage() {
    // Clear the page
    const page = document.getElementById('page');
    page.innerHTML = '';

    const { pageWorkingWidth, pageWorkingHeight } = calculateValues();

    // Set the page dimensions
    page.style.width = `${pageWidth}px`;
    page.style.height = `${pageHeight}px`;

    // Create the margin divs (in cyan lines)
    const marginTopDiv = document.createElement('div');
    marginTopDiv.classList.add('margin');
    marginTopDiv.style.top = `0`;
    marginTopDiv.style.left = `0`;
    marginTopDiv.style.width = `${pageWidth}px`;
    marginTopDiv.style.height = `${marginTop}px`;
    page.appendChild(marginTopDiv);

    const marginBottomDiv = document.createElement('div');
    marginBottomDiv.classList.add('margin');
    marginBottomDiv.style.bottom = `0`;
    marginBottomDiv.style.left = `0`;
    marginBottomDiv.style.width = `${pageWidth}px`;
    marginBottomDiv.style.height = `${marginBottom}px`;
    page.appendChild(marginBottomDiv);

    const marginLeftDiv = document.createElement('div');
    marginLeftDiv.classList.add('margin');
    marginLeftDiv.style.top = `${marginTop}px`;
    marginLeftDiv.style.left = `0`;
    marginLeftDiv.style.width = `${marginLeft}px`;
    marginLeftDiv.style.height = `${pageWorkingHeight}px`;
    page.appendChild(marginLeftDiv);

    const marginRightDiv = document.createElement('div');
    marginRightDiv.classList.add('margin');
    marginRightDiv.style.top = `${marginTop}px`;
    marginRightDiv.style.right = `0`;
    marginRightDiv.style.width = `${marginRight}px`;
    marginRightDiv.style.height = `${pageWorkingHeight}px`;
    page.appendChild(marginRightDiv);

    // Add baseline grid lines (commented out)
    /*
    for (let i = 0; i < pageWorkingHeight / baselineGridHeight; i++) {
        const baseline = document.createElement('div');
        baseline.classList.add('baseline-grid');
        baseline.style.top = `${i * baselineGridHeight + marginTop}px`;
        page.appendChild(baseline);
    }
    */

    // Apply scaling based on screen height
    scalePage();
}

// Update values based on user input
document.getElementById('applyChanges').addEventListener('click', () => {
    pageWidthMM = parseInt(document.getElementById('pageWidth').value);
    pageHeightMM = parseInt(document.getElementById('pageHeight').value);
    marginTopMM = parseInt(document.getElementById('marginTop').value);
    marginBottomMM = parseInt(document.getElementById('marginBottom').value);
    marginLeftMM = parseInt(document.getElementById('marginLeft').value);
    marginRightMM = parseInt(document.getElementById('marginRight').value);

    // Convert updated measurements to pixels
    pageWidth = pageWidthMM * mmToPx;
    pageHeight = pageHeightMM * mmToPx;
    marginTop = marginTopMM * mmToPx;
    marginBottom = marginBottomMM * mmToPx;
    marginLeft = marginLeftMM * mmToPx;
    marginRight = marginRightMM * mmToPx;

    renderPage();
});

// Initial render
renderPage();

// Recalculate scale on window resize
window.addEventListener('resize', scalePage);
