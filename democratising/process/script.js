// scripts/resize.js
// Function to parse CSS pixel values
function parsePixels(value) {
    return parseFloat(value) || 0;
}

// Function to calculate and set the column count and width based on screen width
function updateProcessColumns() {
    const screenWidth = window.innerWidth;
    const minColumnWidthThreshold = 500; // Threshold for adding a column

    // Calculate column count
    let columnCount = Math.floor(screenWidth / minColumnWidthThreshold);
    columnCount = Math.max(1, columnCount); // Ensure at least one column

    // Get CSS variables for calculation
    const rootStyle = getComputedStyle(document.documentElement);
    const padding = parsePixels(rootStyle.getPropertyValue('--padding')) * 2; // Total horizontal padding
    const gutter = parsePixels(rootStyle.getPropertyValue('--gutter'));

    // Calculate available width for columns
    const availableWidth = screenWidth - padding;

    // Calculate total gutter width
    const totalGutterWidth = (columnCount - 1) * gutter;

    // Calculate individual column width
    let columnWidth = (availableWidth - totalGutterWidth) / columnCount;

    // Set the calculated width as a CSS variable
    document.documentElement.style.setProperty('--process-column-width', `${columnWidth}px`);

    // --- Existing column count logic (can be kept or removed if not needed elsewhere) ---
    const maxColumns = 4; // Maximum number of columns for desktop (from original code)
    let generalColumnCount = Math.ceil(screenWidth / minColumnWidthThreshold); // Original calculation method
    generalColumnCount = Math.min(generalColumnCount, maxColumns); // Apply max columns limit

    // Update the general CSS variable on all elements
    document.querySelectorAll('*').forEach(element => {
        element.style.setProperty('--column-count', generalColumnCount); // Keep general --column-count if needed
    });

    // Emit a custom event for column count change (using general count)
    const event = new CustomEvent('columnCountChanged', { detail: { columnCount: generalColumnCount } });
    document.dispatchEvent(event);
}

// Function to update process layout based on column count
function updateProcessLayout() {
    const processContainer = document.getElementById('processContainer');
    if (!processContainer) return;

    const columnCount = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--column-count')) || 1;

    processContainer.classList.toggle('wide-layout', columnCount >= 3);
    processContainer.classList.toggle('narrow-layout', columnCount < 3);
}

// Function to update grid container and grid-container-scroll width
function updateContainerWidth(columnCount) {
    // Get all grid containers, excluding those that contain process containers
    const gridContainers = Array.from(document.querySelectorAll('.grid-container, .grid-container-scroll')).filter(container => {
        // Skip containers that have a process-container as a direct child
        if (container.querySelector('.process-container')) {
            return false;
        }
        return true;
    });

    if (!gridContainers.length) return;

    // Apply classes based on column count
    if (columnCount >= 3) {
        gridContainers.forEach(container => {
            container.classList.add('wide-container');
            container.classList.remove('narrow-container');
        });
    } else {
        gridContainers.forEach(container => {
            container.classList.add('narrow-container');
            container.classList.remove('wide-container');
        });
    }
}

// Initial call to set the column count and width
updateProcessColumns();

// Update column count and width when window is resized
window.addEventListener('resize', updateProcessColumns);

// Initialize process layout on page load if the column count has already been set
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateProcessLayout();
        updateContainerWidth(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--column-count')) || 1);
    });
} else {
    updateProcessLayout();
    updateContainerWidth(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--column-count')) || 1);
}


// scripts/scroll.js
document.addEventListener('DOMContentLoaded', () => {
    const row = document.querySelector('.column-adaptive');
    // Check if row exists before proceeding
    if (!row) {
        return;
    }
    const columns = document.querySelectorAll('.column');
    // Check if columns exist before proceeding
    if (!columns || columns.length === 0) {
        return;
    }

    // Calculate the snap width (column width + gutter)
    const columnWidth = columns[0].offsetWidth;
    // Ensure row.computedStyleMap() exists and has 'column-gap'
    let gutterWidth = 0;
    try {
        gutterWidth = parseInt(getComputedStyle(row).columnGap);
    } catch(e) {
        console.warn("Scroll.js: Could not read columnGap. Defaulting to 0.", e);
    }

    const snapWidth = columnWidth + gutterWidth;

    // Enable smooth scrolling
    row.style.scrollBehavior = 'smooth';

    let isScrolling = false;
    let lastScrollTime = 0;
    let scrollTimeout;
    let lastScrollLeft = 0;

    // Debug function to log key events
    function debugKeyEvent(e) {
    }

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Check if the target is an input field, textarea, or contenteditable element
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return; // Don't interfere with typing
        }

        debugKeyEvent(e); // Log key events for debugging

        // Check for arrow keys
        if (e.key === 'ArrowLeft' || e.key === 'Left' || e.keyCode === 37) {
             if (!row) return; // Guard against null row
            const currentScroll = row.scrollLeft;
            const currentColumnIndex = Math.round(currentScroll / snapWidth);
            const newScroll = Math.max(0, (currentColumnIndex - 1) * snapWidth);

            row.scrollLeft = newScroll;
            e.preventDefault();
        } else if (e.key === 'ArrowRight' || e.key === 'Right' || e.keyCode === 39) {
             if (!row) return; // Guard against null row
            const currentScroll = row.scrollLeft;
            const currentColumnIndex = Math.round(currentScroll / snapWidth);
            // Need to recalculate snapWidth potentially? Or assume it's static? Assume static for now.
            const maxScrollPossible = row.scrollWidth - row.clientWidth;
            const maxColumnIndex = Math.floor(maxScrollPossible / snapWidth);
            const newScroll = Math.min(maxScrollPossible, (currentColumnIndex + 1) * snapWidth); // Use maxScrollPossible directly

            row.scrollLeft = newScroll;
            e.preventDefault();
        }
    });

    // Handle scroll snapping
    row.addEventListener('scroll', () => {
         if (!row) return; // Guard against null row
        const now = Date.now();
        const currentScrollLeft = row.scrollLeft;

        // Clear any existing timeout
        clearTimeout(scrollTimeout);

        // If scrolling is very fast, don't snap yet
        if (now - lastScrollTime < 50) {
            lastScrollTime = now;
            lastScrollLeft = currentScrollLeft;
            return;
        }

        // Set a timeout to check if scrolling has stopped
        scrollTimeout = setTimeout(() => {
            if (isScrolling) return;
            isScrolling = true;

            // Recalculate snapWidth inside the timeout in case resize happened
            const currentColumnWidth = columns[0].offsetWidth;
            let currentGutterWidth = 0;
             try {
                currentGutterWidth = parseInt(getComputedStyle(row).columnGap);
            } catch(e) {
                console.warn("Scroll.js: Could not read columnGap during scroll snap. Defaulting to 0.", e);
            }
            const currentSnapWidth = currentColumnWidth + currentGutterWidth;


            // Calculate which column we should snap to
            const columnIndex = Math.round(currentScrollLeft / currentSnapWidth);
            const snapPosition = columnIndex * currentSnapWidth;

            // Only snap if we're not already at the snap position
            if (Math.abs(currentScrollLeft - snapPosition) > 1) {
                row.scrollLeft = snapPosition;
            }

            isScrolling = false;
        }, 150);

        lastScrollTime = now;
        lastScrollLeft = currentScrollLeft;
    });
});


// scripts/cursor.js
document.addEventListener('DOMContentLoaded', () => {
    const customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    document.body.appendChild(customCursor);

    let hideCursorTimeout; // Timeout variable for delayed hiding

    const projectDirectories = document.querySelectorAll('.column-directory');

    if (projectDirectories.length > 0) {

        projectDirectories.forEach(dirElement => {
            const linkElement = dirElement.querySelector('a[data-project]');
            const hoverDetailsElement = dirElement.querySelector('.project-hover-details'); // Data source

            if (!linkElement || !hoverDetailsElement) {
                console.warn("Cursor.js: Missing link or .project-hover-details div in:", dirElement);
                return;
            }

            const projectType = linkElement.getAttribute('data-project');
            const thumbnailElement = hoverDetailsElement.querySelector('img');
            const captionElement = hoverDetailsElement.querySelector('p');

            if (!projectType || !thumbnailElement || !captionElement) {
                console.warn("Cursor.js: Missing data-project on <a>, or <img> or <p> within .project-hover-details for element:", dirElement);
                return; 
            }

            const thumbnailUrl = thumbnailElement.getAttribute('src');
            const thumbnailAlt = thumbnailElement.getAttribute('alt') || 'Project thumbnail';
            const captionText = captionElement.textContent;

            dirElement.classList.add('custom-cursor-area');

            dirElement.addEventListener('mouseenter', () => {
                clearTimeout(hideCursorTimeout); 
                customCursor.innerHTML = ''; 

                const img = document.createElement('img');
                img.src = thumbnailUrl;
                img.alt = thumbnailAlt;
                customCursor.appendChild(img);

                const captionDiv = document.createElement('div');
                captionDiv.className = 'custom-cursor-caption'; 
                captionDiv.textContent = captionText;
                customCursor.appendChild(captionDiv);

                customCursor.classList.add('active');
                if (projectType) customCursor.classList.add(projectType);
            });

            dirElement.addEventListener('mouseleave', () => {
                clearTimeout(hideCursorTimeout); 
                hideCursorTimeout = setTimeout(() => {
                    customCursor.innerHTML = ''; 
                    customCursor.classList.remove('active');
                    if (projectType) customCursor.classList.remove(projectType);
                }, 50); 
            });
        });
    } else {
    }

    document.addEventListener('mousemove', (e) => {
        if (customCursor.classList.contains('active')) {
            customCursor.style.left = (e.clientX + 15) + 'px'; 
            customCursor.style.top = (e.clientY + 15) + 'px';
        }
    });
});


// scripts/grid.js
document.addEventListener('DOMContentLoaded', function() {
    const masonryGrid = document.querySelector('.masonry-grid');
    if (masonryGrid) {
        // Initial randomization
        randomizeMasonryItems(masonryGrid);

        // Create a MutationObserver to watch for changes to the CSS variables on the root
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "attributes" &&
                    (mutation.attributeName === "style" || mutation.attributeName === "class")) {
                    // Check if --column-count potentially changed
                    const currentColumnCount = getComputedStyle(document.documentElement).getPropertyValue('--column-count');
                    if (masonryGrid.dataset.lastColumnCount !== currentColumnCount) {
                        updateMasonryColumns();
                        masonryGrid.dataset.lastColumnCount = currentColumnCount; // Store the new count
                    }
                }
            });
        });

        // Store initial column count
        masonryGrid.dataset.lastColumnCount = getComputedStyle(document.documentElement).getPropertyValue('--column-count');


        // Start observing the document root for style changes that affect --column-count
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style', 'class'] // Observe style and class changes on <html>
        });
    } else {
    }
});

// Function to shuffle and apply masonry items
function randomizeMasonryItems(masonryGrid) {
    const items = Array.from(masonryGrid.children);

    // Shuffle the items array (Fisher-Yates shuffle)
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    // Clear the grid and append the shuffled items
    masonryGrid.innerHTML = '';
    items.forEach(item => masonryGrid.appendChild(item));
}

// Function to update the masonry grid columns when the CSS variable changes
function updateMasonryColumns() {
    const masonryGrid = document.querySelector('.masonry-grid');
    if (masonryGrid) {
        // The CSS already handles the column count via var(--column-count).
        // This function is a placeholder or for triggering potential re-layouts if needed.
        // Force reflow/repaint if needed, although usually not necessary for 'columns' property
    }
}


// scripts/media.js
// Check if we're in an iframe
const isInIframe = window !== window.parent;

// Listen for messages from iframes (only relevant in main window)
if (!isInIframe) {
    window.addEventListener('message', function(event) {
        try {
            // Add origin check for security
            // if (event.origin !== 'expected_origin') return;
            const data = event.data;
            if (data && data.type === 'showMedia') {
                // Ensure the function exists before calling
                if (window.showMediaInFullscreen) {
                    window.showMediaInFullscreen(data.src, data.alt, data.mediaType);
                } else {
                    console.error('Media.js: showMediaInFullscreen function not found on window.');
                }
            }
        } catch (error) {
            console.error('Media.js: Error handling message:', error);
        }
    });
}


// Function to show media in fullscreen (should ideally only be defined once in the main window scope)
// We define it on window so iframes can potentially call it via parent
window.showMediaInFullscreen = function(src, alt, type) {
    try {

        // Get or create fullscreen container (ensure it's only done once)
        let fullscreenContainer = document.querySelector('.fullscreen-container');
        if (!fullscreenContainer) {
            if (isInIframe) {
                 console.warn("Media.js: Attempted to create fullscreen container from iframe. This should happen in the main window.");
                // Try sending a message back to parent to create it? Complex.
                return; // Exit if in iframe and container doesn't exist
            }
            fullscreenContainer = document.createElement('div');
            fullscreenContainer.className = 'fullscreen-container';
            document.body.appendChild(fullscreenContainer);

             // Add click listener to close when container is created
             fullscreenContainer.addEventListener('click', function handleContainerClick(e) {
                 if (e.target === fullscreenContainer) {
                     // Pause video if it's playing
                     const video = fullscreenContainer.querySelector('video');
                     if (video) {
                         video.pause();
                     }
                     fullscreenContainer.style.display = 'none';
                     fullscreenContainer.innerHTML = ''; // Clear content on close
                 }
             });
        }

        // Clear previous content
        fullscreenContainer.innerHTML = '';

        if (type === 'video') {
            const fullscreenVideo = document.createElement('video');
            fullscreenVideo.src = src;
            fullscreenVideo.alt = alt;
            fullscreenVideo.className = 'fullscreen-video';
            fullscreenVideo.autoplay = true;
            fullscreenVideo.loop = true;
            fullscreenVideo.muted = true; // Muted by default might be better UX
            fullscreenVideo.playsInline = true;
            fullscreenVideo.controls = true; // Add controls for interaction
            fullscreenContainer.appendChild(fullscreenVideo);
        } else { // Default to image
            const fullscreenImg = document.createElement('img');
            fullscreenImg.src = src;
            fullscreenImg.alt = alt;
            fullscreenImg.className = 'fullscreen-image';
            fullscreenContainer.appendChild(fullscreenImg);
        }

        fullscreenContainer.style.display = 'flex';
    } catch (error) {
        console.error('Media.js: Error showing media in fullscreen:', error);
    }
};


// Initialization logic that runs ONCE per context (main window or iframe)
document.addEventListener('DOMContentLoaded', () => {

    // Create fullscreen container and styles ONLY in the main window
    if (!isInIframe) {

        // Ensure container exists (might have been created by showMediaInFullscreen already)
        let fullscreenContainer = document.querySelector('.fullscreen-container');
        if (!fullscreenContainer) {
            fullscreenContainer = document.createElement('div');
            fullscreenContainer.className = 'fullscreen-container';
            document.body.appendChild(fullscreenContainer);

             // Add click listener to close
             fullscreenContainer.addEventListener('click', function handleContainerClick(e) {
                 if (e.target === fullscreenContainer) {
                     const video = fullscreenContainer.querySelector('video');
                     if (video) video.pause();
                     fullscreenContainer.style.display = 'none';
                     fullscreenContainer.innerHTML = '';
                 }
             });
        }

        // Add styles for fullscreen container if they don't exist
        if (!document.querySelector('style[data-fullscreen-styles]')) {
            const style = document.createElement('style');
            style.setAttribute('data-fullscreen-styles', ''); // Mark the style tag
            // Using CSS variables with fallbacks for padding
             const paddingVar = getComputedStyle(document.documentElement).getPropertyValue('--padding') || '40px';
            style.textContent = `
                .fullscreen-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    display: none; /* Initially hidden */
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    z-index: 9999;
                }

                .fullscreen-image, .fullscreen-video {
                    max-width: calc(100% - (${paddingVar} * 2)); /* Use calculated or fallback padding */
                    max-height: calc(100% - (${paddingVar} * 2)); /* Use calculated or fallback padding */
                    object-fit: contain;
                    cursor: default; /* Content itself is not clickable to close */
                }

                /* Ensure media elements in the page are clickable */
                img, video {
                    cursor: pointer;
                    pointer-events: auto !important; /* Redundant? */
                }

                .image-container { /* Ensure containers are also clickable */
                    cursor: pointer;
                    pointer-events: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    } // End if (!isInIframe) block for main window setup

    // Function to handle media click (defined within DOMContentLoaded scope)
    function handleMediaClick(e) {
        try {
            // Stop the event from bubbling up or default actions
            e.preventDefault();
            e.stopPropagation();

            const element = this; // 'this' refers to the clicked element (img/video)

            const type = element.tagName.toLowerCase(); // 'img' or 'video'
            const src = element.src;
            const alt = element.alt || ' '; // Provide default alt text

            if (!src) {
                console.error("Media.js: Clicked media element has no src attribute.");
                return false;
            }

            if (isInIframe) {
                // If in iframe, use postMessage to communicate with parent
                window.parent.postMessage({
                    type: 'showMedia',
                    src: src,
                    alt: alt,
                    mediaType: type
                }, '*'); // Use specific origin in production instead of '*'

            } else {
                // If in main window, show directly using the globally defined function
                if (typeof window.showMediaInFullscreen === 'function') {
                    window.showMediaInFullscreen(src, alt, type);
                } else {
                    console.error('Media.js: window.showMediaInFullscreen function not found.');
                }
            }
        } catch (error) {
            console.error('Media.js: Error handling media click:', error);
        }

        // Return false to prevent default browser action (like navigating to image src)
        return false;
    }

    // Function to initialize media listeners (defined within DOMContentLoaded scope)
    function initializeMediaListeners() {
        try {

            // Find all media elements and their containers
            const mediaElements = document.querySelectorAll('img, video');
            const mediaContainers = document.querySelectorAll('.image-container');


            // Add click handlers to individual media elements
            mediaElements.forEach(element => {
                // Only add listener if not inside a designated .image-container
                if (!element.closest('.image-container')) {
                    try {
                        // Remove any existing listener to prevent duplicates
                        // To properly remove, the function reference must be the same.
                        // If handleMediaClick was previously added directly, this should work.
                        element.removeEventListener('click', handleMediaClick);
                        element.removeEventListener('keydown', handleDirectMediaKeydown); // Assuming a named keydown handler

                        // Add the new click handler
                        element.addEventListener('click', handleMediaClick);
                        // Make element focusable and add keyboard handler for accessibility
                        element.setAttribute('tabindex', '0');
                        element.addEventListener('keydown', handleDirectMediaKeydown); // Use a named function
                    } catch (error) {
                        console.error('Media.js: Error processing direct media element:', error);
                    }
                } else {
                }
            });

            // Add click handlers to containers (delegates click to the media element inside)
            mediaContainers.forEach(container => {
                try {
                    const mediaElement = container.querySelector('img, video');
                    if (mediaElement) {

                        // Remove previous listeners if they exist, using the stored reference
                        if (container._clickHandler) {
                            container.removeEventListener('click', container._clickHandler);
                        }
                        if (container._keyHandler) {
                            container.removeEventListener('keydown', container._keyHandler);
                        }

                        // Define the click handler for this specific container and its mediaElement
                        // This captures the current mediaElement in its closure.
                        container._clickHandler = function(e) {
                             e.preventDefault();
                             e.stopPropagation();
                             // Call the main handler with the *media element* as 'this'
                             handleMediaClick.call(mediaElement, e);
                         };

                        // Define the keydown handler
                        container._keyHandler = function(e) {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault(); // Prevent default spacebar scroll
                                // Call the container's click handler logic, ensuring 'this' is the container
                                container._clickHandler.call(container, e);
                            }
                        };

                        // Add new click handler to container
                        container.addEventListener('click', container._clickHandler);

                        // Make container focusable and add keyboard handler for accessibility
                        container.setAttribute('tabindex', '0');
                        container.addEventListener('keydown', container._keyHandler);

                    } else {
                         console.warn('Media.js: .image-container found without img/video inside:', container);
                    }
                } catch (error) {
                    console.error('Media.js: Error processing container:', error);
                }
            });
        } catch (error) {
            console.error('Media.js: Error initializing media listeners:', error);
        }
    }

    // Named function for direct media element keydown handling
    function handleDirectMediaKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') { // Space or Enter
            e.preventDefault(); // Prevent default spacebar scroll
            handleMediaClick.call(this, e); // Call handler with element as 'this'
        }
    }

    // Initialize media listeners for the current context
    initializeMediaListeners();

    // --- MutationObserver to handle dynamically added content ---
    // Only set up observer in the main window or iframes expected to load dynamic content
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check added nodes for new media or containers and attach listeners
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) { // Check if it's an element
                        // Find new media elements within the added node(s)
                        const newMedia = node.matches('img, video') ? [node] : Array.from(node.querySelectorAll('img, video'));
                        const newContainers = node.matches('.image-container') ? [node] : Array.from(node.querySelectorAll('.image-container'));

                        if (newMedia.length > 0 || newContainers.length > 0) {
                             // Re-run initialization logic, but targeted if possible
                             // For simplicity, just re-run the full initialization on the whole document.
                             // A more optimized approach would target only new elements.
                             initializeMediaListeners();
                             // Break after finding new content to avoid redundant runs if multiple mutations occur
                             return;
                        }
                    }
                });
            }
        }
    });

    // Start observing the body for added child elements
    observer.observe(document.body, { childList: true, subtree: true });

}); // End DOMContentLoaded 

document.addEventListener('DOMContentLoaded', function() {
    const readMoreToggleButtons = document.querySelectorAll('.read-more-toggle');

    readMoreToggleButtons.forEach(button => {
        const textElement = button.firstElementChild;
        // Store the original text in a data attribute if it hasn't been stored yet
        if (textElement && !button.dataset.originalText) {
            button.dataset.originalText = textElement.textContent.trim();
        }

        button.addEventListener('click', function() {
            const contentToToggle = this.nextElementSibling;
            const currentTextElement = this.firstElementChild; // Re-fetch in case of DOM changes, though unlikely here
            const arrowElement = this.children[1];

            if (contentToToggle && contentToToggle.classList.contains('collapsible-content')) {
                contentToToggle.classList.toggle('visible');

                if (contentToToggle.classList.contains('visible')) {
                    if (currentTextElement) currentTextElement.textContent = 'Collapse';
                    if (arrowElement) arrowElement.textContent = '/\\';
                } else {
                    if (currentTextElement) currentTextElement.textContent = this.dataset.originalText || 'Read More'; // Fallback if data attribute not set
                    if (arrowElement) arrowElement.textContent = '\\/';
                }
            }
        });
    });
}); 

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function adjustImageRowHeights() {
    const imageRows = document.querySelectorAll(
        '.image-grid .image-double, .image-grid .image-triple, .image-grid .image-quadruple'
    );

    imageRows.forEach(row => {
        const images = Array.from(row.querySelectorAll('img'));
        
        // Reset styles for rows with less than 2 images or if recalculating
        if (images.length < 2) {
            images.forEach(img => {
                img.style.height = ''; // Revert to CSS defined height (likely 'auto')
                img.style.width = '';  // Revert to CSS defined width (likely 'auto' or 100% based on other rules)
            });
            return;
        }

        const imageLoadPromises = images.map(img => {
            return new Promise((resolve, reject) => {
                if (img.complete && img.naturalHeight !== 0 && img.naturalWidth !== 0) {
                    resolve(img);
                } else if (img.naturalHeight === 0 && img.complete) { // Image loaded but has no height (e.g. broken link but load event fired)
                    console.warn("Image loaded with zero height, possibly broken:", img.src);
                    resolve(img); // Resolve anyway to not block others, handle in calculation
                }
                else {
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.error("Image failed to load:", img.src);
                        resolve(img); // Resolve even on error to not break Promise.all, handle in calculation
                    };
                }
            });
        });

        Promise.all(imageLoadPromises)
            .then(loadedImages => { // `loadedImages` is an array of the image elements
                const rowStyle = window.getComputedStyle(row);
                const rowWidth = row.getBoundingClientRect().width;
                let gap = parseFloat(rowStyle.gap);
                if (isNaN(gap)) { // Fallback if 'gap' is not set or not a number (e.g., 'normal')
                    // Try column-gap as it's the actual property name for flex/grid gap
                    gap = parseFloat(rowStyle.columnGap); 
                }
                if (isNaN(gap)) { // If still NaN, default to 0 or a known value
                    gap = 10; // Defaulting to 10px if not found, adjust as necessary
                }


                const validImages = loadedImages.filter(img => img.naturalWidth > 0 && img.naturalHeight > 0);

                if (validImages.length < 1) { // Need at least one valid image to proceed
                     // Reset styles for all images in this row if no valid images found
                    images.forEach(img => {
                        img.style.height = '';
                        img.style.width = '';
                    });
                    return;
                }
                
                // If only one valid image after filtering, but original row had more, treat as single image (let CSS handle)
                // Or, if you want the single valid image to fill based on some rule, add logic here.
                // For now, if validImages.length is 1 but images.length > 1, we might just let CSS do its thing
                // by resetting. However, the problem is to make *all* images in the row same height.
                // If some are broken, how should the valid ones behave?
                // For now, calculations proceed based on validImages. Broken ones won't get styles.

                const availableImageWidth = rowWidth - (images.length - 1) * gap;
                let sumAR = 0;
                validImages.forEach(img => {
                    sumAR += img.naturalWidth / img.naturalHeight;
                });

                if (sumAR === 0) {
                    // This case implies all validImages had naturalHeight of 0, which filter should prevent
                    // but as a safeguard:
                    console.warn("Sum of aspect ratios is zero, cannot calculate target height.", row);
                    images.forEach(img => { // Reset all original images in the row
                        img.style.height = '';
                        img.style.width = '';
                    });
                    return;
                }
                
                const targetHeight = availableImageWidth / sumAR;

                // Apply styles only to the original images list, but use natural dims from validImages
                images.forEach(img => {
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) { // Check again before applying
                        const aspectRatio = img.naturalWidth / img.naturalHeight;
                        img.style.height = targetHeight + 'px';
                        img.style.width = (aspectRatio * targetHeight) + 'px';
                    } else {
                        // For images that were not valid (broken, zero dimensions)
                        img.style.height = targetHeight + 'px'; // Make them same height box
                        img.style.width = 'auto'; // Let them be auto width, or 0, or some placeholder
                                                // Or you might want to hide them: img.style.display = 'none';
                        console.warn("Applying default height to broken/invalid image:", img.src);
                    }
                });
            })
            .catch(error => {
                console.error("Error processing images in a row:", error, row);
                 // Fallback: Reset styles for all images in the row on error
                images.forEach(img => {
                    img.style.height = '';
                    img.style.width = '';
                });
            });
    });
}

// Ensure the script runs after the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', adjustImageRowHeights);
} else {
    // DOMContentLoaded has already fired
    adjustImageRowHeights();
}

window.addEventListener('resize', debounce(adjustImageRowHeights, 250)); 

// ----- Project Hover Effect ----- //
document.addEventListener('DOMContentLoaded', () => {
    const hoverInfoDiv = document.getElementById('hover-info');
    const hoverThumbnail = document.getElementById('hover-thumbnail');
    const hoverCaption = document.getElementById('hover-caption');
    const offset = 15; // Offset from cursor in pixels

    // Function to handle mouseover
    function onMouseOver(event) {
        let targetLink = null;
        // Check if the event target is an 'a' tag with data-src or if its parent is
        if (event.target.tagName === 'A' && event.target.dataset.src) {
            targetLink = event.target;
        } else if (event.target.parentElement && event.target.parentElement.tagName === 'A' && event.target.parentElement.dataset.src) {
            targetLink = event.target.parentElement;
        }

        if (targetLink && hoverInfoDiv && hoverThumbnail && hoverCaption) {
            const imgSrc = targetLink.dataset.src;
            const captionText = targetLink.dataset.caption;
            const isVideo = imgSrc && (imgSrc.endsWith('.mp4') || imgSrc.endsWith('.mov') || imgSrc.endsWith('.gif')); // Basic check for video/gif

            hoverThumbnail.src = imgSrc;
            hoverThumbnail.alt = isVideo ? 'Media preview' : 'Image preview';
            hoverCaption.textContent = captionText || ' '; // Ensure some content to prevent collapse
            hoverInfoDiv.style.display = 'flex';
        }
    }

    // Function to handle mouseout
    function onMouseOut(event) {
        let targetLink = null;
        if (event.target.tagName === 'A' && event.target.dataset.src) {
            targetLink = event.target;
        } else if (event.target.parentElement && event.target.parentElement.tagName === 'A' && event.target.parentElement.dataset.src) {
            targetLink = event.target.parentElement;
        }

        if (targetLink && hoverInfoDiv) {
             // Hide only if mouse is moving outside of this link or its children
            if (!event.relatedTarget || !targetLink.contains(event.relatedTarget)) {
                hoverInfoDiv.style.display = 'none';
                if (hoverThumbnail) hoverThumbnail.src = '';
                if (hoverCaption) hoverCaption.textContent = '';
            }
        }
    }

    // Function to handle mousemove
    function onMouseMove(event) {
        if (hoverInfoDiv && hoverInfoDiv.style.display === 'flex') {
            const hoverElementWidth = hoverInfoDiv.offsetWidth;
            const hoverElementHeight = hoverInfoDiv.offsetHeight;
            let x = event.pageX + offset;
            let y = event.pageY + offset;

            // Adjust position to keep the element within the viewport
            if (x + hoverElementWidth > window.innerWidth) {
                x = event.pageX - hoverElementWidth - offset;
            }
            if (y + hoverElementHeight > window.innerHeight) {
                y = event.pageY - hoverElementHeight - offset;
            }
             // Ensure x and y are not less than 0 if the element is larger than cursor pos - offset
            if (x < 0) x = offset;
            if (y < 0) y = offset;

            hoverInfoDiv.style.left = `${x}px`;
            hoverInfoDiv.style.top = `${y}px`;
        }
    }

    // Attach event listeners to project lists
    const projectList = document.getElementById('project-list');
    const projectListGoogle = document.getElementById('project-list-google');

    // New Media Grids
    const unit9MediaGrid = document.getElementById('unit9-media-grid');
    const unit10MediaGrid = document.getElementById('unit10-media-grid');
    const mlMediaGrid = document.getElementById('ml-media-grid');

    // Log whether the grid elements were found
    if (projectList) {
        projectList.addEventListener('mouseover', onMouseOver);
        projectList.addEventListener('mouseout', onMouseOut);
    }

    if (projectListGoogle) {
        projectListGoogle.addEventListener('mouseover', onMouseOver);
        projectListGoogle.addEventListener('mouseout', onMouseOut);
    }

    if (unit9MediaGrid) {
        unit9MediaGrid.addEventListener('mouseover', onMouseOverMediaItem);
        unit9MediaGrid.addEventListener('mouseout', onMouseOutMediaItem);
    } else {
    }
    
    if (unit10MediaGrid) {
        unit10MediaGrid.addEventListener('mouseover', onMouseOverMediaItem);
        unit10MediaGrid.addEventListener('mouseout', onMouseOutMediaItem);
    } else {
    }

    if (mlMediaGrid) {
        mlMediaGrid.addEventListener('mouseover', onMouseOverMediaItem);
        mlMediaGrid.addEventListener('mouseout', onMouseOutMediaItem);
    } else {
    }

    // Shared function to handle mouseover for media grid items (img/video)
    function onMouseOverMediaItem(event) {
        let mediaElement = null;
        if (event.target.tagName === 'IMG' || event.target.tagName === 'VIDEO') {
            mediaElement = event.target;
        } else if (event.target.parentElement && (event.target.parentElement.tagName === 'IMG' || event.target.parentElement.tagName === 'VIDEO')) {
            mediaElement = event.target.parentElement;
        } else if (event.target.closest('.media-grid-item')) {
            mediaElement = event.target.closest('.media-grid-item').querySelector('img, video');
        }

        if (mediaElement && mediaElement.dataset.src && mediaElement.dataset.caption && hoverInfoDiv && hoverThumbnail && hoverCaption) {
            const imgSrc = mediaElement.dataset.src;
            const captionText = mediaElement.dataset.caption;
            
            const currentPagePath = window.location.pathname;
            const isNoThumbnailPage = currentPagePath.includes('/Unit9/index.html') ||
                                       currentPagePath.includes('/Unit10/index.html') ||
                                       currentPagePath.includes('/ML/index.html');

            hoverCaption.textContent = captionText || ' ';

            if (isNoThumbnailPage) {
                hoverThumbnail.style.display = 'none'; 
                hoverThumbnail.src = ''; // Clear src as well
            } else {
                hoverThumbnail.style.display = 'block'; 
                hoverThumbnail.src = imgSrc;
                const isSpecialMedia = imgSrc && (imgSrc.endsWith('.mp4') || imgSrc.endsWith('.mov') || imgSrc.endsWith('.gif'));
                hoverThumbnail.alt = isSpecialMedia ? 'Media preview' : 'Image preview';
            }
            
            hoverInfoDiv.style.display = 'flex';
        }
    }

    // Shared function to handle mouseout for media grid items
    function onMouseOutMediaItem(event) {
        let mediaElement = null;
        if (event.target.tagName === 'IMG' || event.target.tagName === 'VIDEO') {
            mediaElement = event.target;
        } else if (event.target.closest('.media-grid-item')) {
            mediaElement = event.target.closest('.media-grid-item').querySelector('img, video');
        }

        if (mediaElement && hoverInfoDiv) {
            const gridItem = mediaElement.closest('.media-grid-item');
            if (gridItem && (!event.relatedTarget || !gridItem.contains(event.relatedTarget))) {
                hoverInfoDiv.style.display = 'none';
                if (hoverThumbnail) {
                    hoverThumbnail.src = '';
                    hoverThumbnail.style.display = 'block'; // Reset display
                }
                if (hoverCaption) hoverCaption.textContent = '';
            }
        }
    }

    // Attach mousemove to the document to track cursor everywhere
    document.addEventListener('mousemove', onMouseMove);
}); 