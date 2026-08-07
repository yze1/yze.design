// @ts-nocheck
// P5.js setup utilities are loaded from p5setup.js

// Global variable to hold our shape sketch instance
let shapeSketch;

// Counter for saved files
let saveCounter = 1;

// Animation variables
let isAnimating = false;
let originalParams = null;
let animationStartTime;
const ANIMATION_DURATION = 5000; // 5 seconds in milliseconds
const FRAME_RATE = 60; // Changed from 30 to 60 fps
let gifCounter = 1;
let gifRecording = false;
let isPlaying = false;

// Current canvas dimensions
let canvasWidth = 1080;
let canvasHeight = 1350; // Default to 4:5 ratio

function calculateCanvasDimensions(container) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    console.log('Container dimensions:', containerWidth, 'x', containerHeight);
    
    // Calculate dimensions based on aspect ratio
    const aspectRatio = canvasWidth / canvasHeight;
    console.log('Target aspect ratio:', aspectRatio);

    // Calculate dimensions that would fit if constrained by width or height
    const fitByWidth = {
        width: containerWidth,
        height: containerWidth / aspectRatio
    };

    const fitByHeight = {
        width: containerHeight * aspectRatio,
        height: containerHeight
    };

    // Choose the smaller of the two options to ensure canvas fits in container
    let finalDimensions;
    if (fitByWidth.height <= containerHeight) {
        // If fitting by width results in a height that fits, use that
        finalDimensions = fitByWidth;
        console.log('Fitting to width');
    } else {
        // Otherwise, fit by height
        finalDimensions = fitByHeight;
        console.log('Fitting to height');
    }

    console.log('Final canvas dimensions:', finalDimensions.width, 'x', finalDimensions.height);
    
    return {
        width: Math.round(finalDimensions.width),
        height: Math.round(finalDimensions.height)
    };
}

function createConfiguredCanvas(p, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Canvas container not found:', containerId);
        return null;
    }

    // Calculate actual canvas dimensions
    const dimensions = calculateCanvasDimensions(container);
    console.log('Creating canvas with dimensions:', dimensions.width, 'x', dimensions.height);

    // Create canvas with calculated dimensions
    const canvas = p.createCanvas(dimensions.width, dimensions.height, p.SVG);
    
    // Center the canvas in its container
    canvas.style('display', 'block');
    canvas.style('margin', 'auto');
    
    return canvas;
}

// Wait for DOM to be fully loaded before initializing the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application...');
    
    // Initialize the p5.js sketch
    shapeSketch = new p5(createShapeSketch, 'shape-canvas');
    console.log('Shape sketch initialized');

    // Setup control listeners
    setupControlListeners();
    console.log('Control listeners set up');
});

/**
 * Creates the shape sketch with all functionality
 * @param {p5} p - The p5 instance
 */
function createShapeSketch(p) {
    // Shape parameters
    let strokeColor = '#000000'; // Outline color
    let fillColor = '#000000';   // Fill color
    let strokeWeight = 2;        // Outline thickness
    let pointCount = 6;          // Number of points in each shape
    let distance = 50;           // Base size of shapes
    let randomness = 0.5;        // How random the point positions are
    let scale = 1;               // Overall scale factor (kept for compatibility but not exposed in UI)
    let spread = 100;            // How far shapes spread from center
    let placementRandomness = 0; // Random variation in shape placement
    let shapeCount = 10;         // Number of shapes to generate
    let cornerRadius = 0;        // Radius for rounded corners (stored as percentage 0-100)
    let rotation = 0;            // Global rotation angle in degrees
    let canvas;                  // Reference to the p5 canvas
    let stickers = [];           // Array to hold all shape positions
    let backgroundColor = '#ffffff'; // Background color
    let mainLayer;               // Graphics buffer for drawing shapes

    // Setup function - runs once when the sketch is created
    p.setup = function() {
        // Create and configure canvas
        canvas = createConfiguredCanvas(p, 'shape-canvas');
        
        // Create graphics buffer for drawing
        mainLayer = p.createGraphics(p.width, p.height, p.SVG);
        
        // Set frame rate for animation
        p.frameRate(FRAME_RATE);
        
        // Apply common p5.js settings
        applyCommonSettings(p);
        
        // Set default styles for shapes
        p.strokeWeight(strokeWeight);
        p.stroke(strokeColor);
        p.fill(fillColor);
        
        // Set a fixed random seed for consistent initial rendering
        p.randomSeed(42);
        
        // Generate initial shapes based on default parameters
        generateStickers();
        
        // Force a redraw to show the shapes
        p.redraw();
    };
    
    // Debounce function to limit the rate of function execution
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Draw function - called when redraw() is called
    p.draw = function() {
        if (isAnimating) {
            animateParameters();
        }

        // Clear all layers
        p.clear();
        mainLayer.clear();
        
        // Set background colors
        p.background(backgroundColor);
        mainLayer.background(backgroundColor);
        
        // Save the current transformation state
        mainLayer.push();
        
        // Move to center of canvas for rotation
        mainLayer.translate(p.width/2, p.height/2);
        
        // Apply global rotation
        mainLayer.rotate(p.radians(rotation));
        
        // Draw shapes on main layer
        stickers.forEach((sticker) => {
            mainLayer.push();
            mainLayer.translate(sticker.x, sticker.y);
            mainLayer.scale(scale);
            
            mainLayer.stroke(strokeColor);
            mainLayer.strokeWeight(strokeWeight);
            mainLayer.fill(fillColor);
            
            drawShape(mainLayer, 0, 0);
            mainLayer.pop();
        });
        
        // Restore the transformation state
        mainLayer.pop();
        
        // Draw the final result
        p.image(mainLayer, 0, 0);

        // If not animating, stop the draw loop
        if (!isAnimating) {
            p.noLoop();
        }
    };
    
    /**
     * Generates shape positions based on current parameters
     */
    function generateStickers() {
        // Clear existing shapes
        stickers = [];
        
        // Get the number of shapes to create
        let numShapes = shapeCount;
        
        // Create each shape
        for (let i = 0; i < numShapes; i++) {
            // Calculate angle for even distribution around a circle
            let angle = p.TWO_PI * (i / numShapes);
            
            // Set base distance from center (0 if only one shape)
            let baseDistance = numShapes > 1 ? spread : 0;
            
            // Calculate base position using polar coordinates
            let baseX = p.cos(angle) * baseDistance;
            let baseY = p.sin(angle) * baseDistance;
            
            // Calculate random offset based on placement randomness
            let randomOffset = spread * placementRandomness;
            
            // Apply random offset to position
            let x = baseX + p.random(-randomOffset, randomOffset);
            let y = baseY + p.random(-randomOffset, randomOffset);
            
            // Special case for single shape with randomness
            if (numShapes === 1 && placementRandomness > 0) {
                x = p.random(-randomOffset, randomOffset);
                y = p.random(-randomOffset, randomOffset);
            }
            
            // Add the shape position to our array
            stickers.push({ x, y });
        }
    }
    
    /**
     * Draws a single shape at the specified position
     * @param {p5.Graphics} g - The graphics object to draw on
     * @param {number} x - X coordinate center
     * @param {number} y - Y coordinate center
     * @returns {Array} Array of shape points for reference
     */
    function calculateShortestDistance(points) {
        // Find the shortest line segment between any two connected points in the shape
        // This is needed to make sure our corners don't overlap when we round them
        let minDistance = Infinity;
        for (let i = 0; i < points.length; i++) {
            let current = points[i];
            let next = points[(i + 1) % points.length];
            let distance = p5.Vector.dist(current, next);
            minDistance = Math.min(minDistance, distance);
        }
        return minDistance;
    }

    function drawShape(g, x, y) {
        // Get number of points for this shape
        let points = pointCount;
        
        // Get base radius (size) of the shape
        let radius = distance;
        
        // Array to store the generated points
        let shapePoints = [];
        
        // Generate points around a circle with randomness
        for (let i = 0; i < points; i++) {
            // Calculate angle for even distribution
            let angle = p.TWO_PI * (i / points);
            
            // Apply randomness to the radius
            let r = radius * (1 + p.random(-randomness, randomness));
            
            // Calculate point position using polar coordinates
            let px = x + p.cos(angle) * r;
            let py = y + p.sin(angle) * r;
            
            // Add point to our array
            shapePoints.push(p.createVector(px, py));
        }

        // Calculate the shortest distance between any two connected points: if points are too close the corner between them too round and will overlap
        let shortestDist = calculateShortestDistance(shapePoints);
        
        // The corner radius slider shows a percentage (must stay within these bounds)
        let cornerRadiusSlider = document.getElementById('corner-radius');
        if (cornerRadiusSlider && cornerRadiusSlider.max !== '100') {
            cornerRadiusSlider.max = 100;
            // If value > 100, convert to a percentage
            if (parseInt(cornerRadiusSlider.value) > 100) {
                let currentRadius = parseInt(cornerRadiusSlider.value);
                let percentage = Math.round((currentRadius / (shortestDist / 2)) * 100);
                cornerRadiusSlider.value = Math.min(100, percentage);
                cornerRadius = cornerRadiusSlider.value;
            }
        }
        
        // Convert percentage into pixel value for corner roundness: 50% of the shortest distance maximum
        let maxPossibleRadius = shortestDist / 2;
        let actualCornerRadius = (cornerRadius / 100) * maxPossibleRadius;
        
        g.beginShape();
        
        if (actualCornerRadius > 0) {
            // Looping through points to create rounded corners
            for (let i = 0; i < shapePoints.length; i++) {
                // Catalogue previous, current, and next points
                let prev = shapePoints[(i - 1 + shapePoints.length) % shapePoints.length];
                let current = shapePoints[i];
                let next = shapePoints[(i + 1) % shapePoints.length];

                // Calculate how far the current point is from its neighbors
                let distToPrev = p5.Vector.dist(current, prev);
                let distToNext = p5.Vector.dist(current, next);
                
                // The corner can't be more rounded than half the distance to either neighbor
                let effectiveRadius = Math.min(actualCornerRadius, Math.min(distToPrev, distToNext) / 2);

                // Calculate points where the rounded corner should start and end
                let prevToCurrent = p5.Vector.sub(current, prev).normalize().mult(effectiveRadius);
                let currentToNext = p5.Vector.sub(next, current).normalize().mult(effectiveRadius);
                
                // Calculate the actual points where the curve starts and ends
                let start = p5.Vector.sub(current, prevToCurrent);
                let end = p5.Vector.add(current, currentToNext);

                // Draw the curved corner using these points
                g.vertex(start.x, start.y);
                g.bezierVertex(current.x, current.y, current.x, current.y, end.x, end.y);
            }
        } else {
            // If we don't want rounded corners, just draw straight lines between points
            g.vertex(shapePoints[0].x, shapePoints[0].y);
            for (let i = 1; i < shapePoints.length; i++) {
                let current = shapePoints[i];
                g.vertex(current.x, current.y);
            }
        }
        
        g.endShape(g.CLOSE);
        
        return shapePoints;
    }
    
    /**
     * Updates parameters from HTML controls
     * @param {Object} params - The parameters object with new values
     */
    p.updateParams = function(params) {
        // Set random seed for consistent rendering when parameters change
        p.randomSeed(params.seed || 42);
        
        // Update all shape parameters from the controls
        shapeCount = parseInt(params.shapeCount);
        distance = parseInt(params.shapeSize);
        cornerRadius = parseInt(params.cornerRadius);
        strokeWeight = parseInt(params.strokeWeight);
        rotation = parseInt(params.rotation);
        
        // Update colors
        fillColor = params.fillColor;
        strokeColor = params.strokeColor;
        backgroundColor = params.backgroundColor;
        
        pointCount = parseInt(params.pointCount);
        randomness = 1 - parseFloat(params.pointRandomness);
        spread = parseInt(params.spread);
        placementRandomness = parseFloat(params.placementRandomness);
        
        // Regenerate shapes with new parameters
        generateStickers();
        
        // Redraw the canvas with updated shapes
        p.redraw();
    };
    
    /**
     * Saves the canvas as a high-quality PNG image
     */
    p.saveImage = function() {
        const paddedCounter = String(saveCounter).padStart(3, '0');
        saveCanvasAsImage(p, `PAPAsShape#${paddedCounter}`);
    };

    // Update the canvas with debounced smoothness changes
    const debouncedUpdateCanvas = debounce(updateCanvas, 100);

    // Animation function to interpolate parameters
    function animateParameters() {
        if (!isAnimating || !originalParams) return;

        const currentTime = Date.now() - animationStartTime;
        const progress = (currentTime % ANIMATION_DURATION) / ANIMATION_DURATION;
        const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);

        // Interpolate parameters
        const params = {
            strokeWeight: Math.round(originalParams.strokeWeight + easeProgress * 2),
            pointRandomness: (1 - (originalParams.randomness - easeProgress * 0.15)).toFixed(2),
            shapeSize: Math.round(originalParams.distance + easeProgress * 10),
            spread: Math.round(originalParams.spread - easeProgress * 50),
            rotation: Math.round(originalParams.rotation - easeProgress * 15)
        };

        // Update UI controls
        document.getElementById('stroke-weight').value = params.strokeWeight;
        document.getElementById('point-randomness').value = params.pointRandomness;
        document.getElementById('shape-size').value = params.shapeSize;
        document.getElementById('shape-spread').value = params.spread;
        document.getElementById('shape-rotation').value = params.rotation;

        // Update UI displays
        updateValueDisplay(document.getElementById('stroke-weight'));
        updateValueDisplay(document.getElementById('point-randomness'));
        updateValueDisplay(document.getElementById('shape-size'));
        updateValueDisplay(document.getElementById('shape-spread'));
        updateValueDisplay(document.getElementById('shape-rotation'));

        // Update canvas with new parameters
        updateCanvas();

        // Check if animation duration is complete
        if (currentTime >= ANIMATION_DURATION && gifRecording) {
            stopAnimation();
        }
    }

    // Add saveGif method to the p5 instance
    p.saveGif = function(filename, duration) {
        console.log('Initializing GIF capture process...');
        const frameCount = duration * FRAME_RATE;
        const frames = [];
        let currentFrame = 0;

        // Create a temporary canvas for capturing
        console.log('Creating temporary canvas for capture...');
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = p.width;
        tempCanvas.height = p.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Function to convert SVG to image
        const convertSVGToImage = () => {
            return new Promise((resolve, reject) => {
                try {
                    // Get the SVG content directly from the p5.js canvas
                    const svgElement = canvas.elt;
                    console.log('Getting SVG content...');
                    
                    // Create a serialized SVG string with proper dimensions
                    const svgString = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="${p.width}" height="${p.height}">
                            <rect width="100%" height="100%" fill="${backgroundColor}"/>
                            ${svgElement.innerHTML}
                        </svg>
                    `;
                    
                    // Create blob from SVG string
                    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);

                    // Create image from SVG
                    const img = new Image();
                    img.onload = () => {
                        URL.revokeObjectURL(url);
                        resolve(img);
                    };
                    img.onerror = (err) => {
                        console.error('Error loading SVG image:', err);
                        URL.revokeObjectURL(url);
                        reject(new Error('Failed to load SVG image'));
                    };
                    img.src = url;
                } catch (error) {
                    console.error('Error in SVG conversion:', error);
                    reject(error);
                }
            });
        };

        // Function to capture a single frame
        const captureFrame = async () => {
            if (currentFrame < frameCount) {
                try {
                    console.log('Capturing frame', currentFrame + 1, 'of', frameCount);
                    
                    // Convert SVG to image and draw to temp canvas
                    const img = await convertSVGToImage();
                    tempCtx.fillStyle = backgroundColor;
                    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                    tempCtx.drawImage(img, 0, 0);
                    
                    // Add frame to collection
                    frames.push(tempCanvas.toDataURL('image/png'));
                    
                    currentFrame++;
                    // Update animation
                    if (isAnimating) {
                        animateParameters();
                        p.redraw(); // Force redraw to update SVG content
                    }
                    requestAnimationFrame(() => captureFrame());
                } catch (error) {
                    console.error('Error capturing frame:', error);
                    stopAnimation();
                }
            } else {
                console.log('All frames captured, creating GIF...');
                const gif = new GIF({
                    workers: 2,
                    quality: 10,
                    width: p.width,
                    height: p.height,
                    workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
                });

                let framesAdded = 0;
                frames.forEach((frame, index) => {
                    const img = new Image();
                    img.onload = () => {
                        console.log('Adding frame', index + 1, 'to GIF');
                        gif.addFrame(img, { delay: 1000 / FRAME_RATE });
                        framesAdded++;
                        
                        if (framesAdded === frames.length) {
                            console.log('All frames added, rendering GIF...');
                            gif.render();
                        }
                    };
                    img.src = frame;
                });

                gif.on('finished', function(blob) {
                    console.log('GIF rendering finished, preparing download...');
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `${filename}.gif`;
                    document.body.appendChild(link);
                    console.log('Initiating download for', `${filename}.gif`);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                    console.log('GIF downloaded as', `${filename}.gif`);
                    stopAnimation();
                });
            }
        };

        // Start the capture process
        captureFrame().catch(error => {
            console.error('Error in capture process:', error);
            stopAnimation();
        });
    };

    // Add savePngSequence method to the p5 instance
    p.savePngSequence = function(filename, duration) {
        const frameCount = duration * FRAME_RATE;
        const frames = [];
        let currentFrame = 0;
        const zip = new JSZip();

        console.log('Starting PNG sequence capture for', frameCount, 'frames');

        // Start capturing frames
        const captureFrame = () => {
            if (currentFrame < frameCount) {
                // Get the current canvas and convert it to a base64 image
                const dataUrl = canvas.elt.toDataURL('image/png');
                frames.push(dataUrl);
                console.log('Captured frame', currentFrame + 1);
                currentFrame++;
                
                // Request the next frame
                requestAnimationFrame(captureFrame);
            } else {
                console.log('All frames captured, creating ZIP');
                // Add all frames to the ZIP
                frames.forEach((frame, index) => {
                    const base64Data = frame.split(',')[1];
                    zip.file(`frame_${String(index + 1).padStart(3, '0')}.png`, base64Data, {base64: true});
                });

                // Generate the ZIP file
                zip.generateAsync({type: 'blob'}).then(function(content) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = `${filename}.zip`;
                    document.body.appendChild(link);
                    console.log('Initiating download for', `${filename}.zip`);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                    console.log('PNG sequence downloaded as', `${filename}.zip`);
                });
            }
        };

        // Start the capture process
        captureFrame();
    };
}

// Global function to update value displays
function updateValueDisplay(control) {
    const valueDisplay = control.parentElement.querySelector('.value-display');
    if (valueDisplay) {
        let value = control.value;
        // Add units or formatting based on the control
        if (control.id === 'corner-radius') {
            value = value + '%';
        } else if (control.id === 'shape-rotation') {
            value = value + '°';
        } else if (control.id === 'point-randomness' || control.id === 'placement-randomness') {
            value = parseFloat(value).toFixed(2);
        }
        valueDisplay.textContent = value;
    }
}

function randomizeControls() {
    // Get all control elements
    const pointCount = document.getElementById('point-count');
    const cornerRadius = document.getElementById('corner-radius');
    const strokeWeight = document.getElementById('stroke-weight');
    const pointRandomness = document.getElementById('point-randomness');
    const shapeSize = document.getElementById('shape-size');
    const shapeCount = document.getElementById('shape-count');
    const shapeSpread = document.getElementById('shape-spread');
    const rotation = document.getElementById('shape-rotation');
    const placementRandomness = document.getElementById('placement-randomness');

    // Set random values for each control
    if (pointCount) {
        pointCount.value = Math.floor(Math.random() * (24 - 3) + 3); // 3 to 24
        updateValueDisplay(pointCount);
    }
    
    if (cornerRadius) {
        cornerRadius.value = Math.floor(Math.random() * 101); // 0 to 100
        updateValueDisplay(cornerRadius);
    }
    
    if (strokeWeight) {
        strokeWeight.value = Math.floor(Math.random() * 41); // 0 to 40
        updateValueDisplay(strokeWeight);
    }
    
    if (pointRandomness) {
        pointRandomness.value = (Math.random() * 0.75).toFixed(2); // 0 to 0.75
        updateValueDisplay(pointRandomness);
    }
    
    if (shapeSize) {
        shapeSize.value = Math.floor(Math.random() * (330 - 90) + 90); // 90 to 330
        updateValueDisplay(shapeSize);
    }
    
    if (shapeCount) {
        shapeCount.value = Math.floor(Math.random() * 12 + 1); // 1 to 12
        updateValueDisplay(shapeCount);
    }
    
    if (shapeSpread) {
        shapeSpread.value = Math.floor(Math.random() * (400 - 100) + 100); // 100 to 400
        updateValueDisplay(shapeSpread);
    }
    
    if (rotation) {
        rotation.value = Math.floor(Math.random() * 361); // 0 to 360
        updateValueDisplay(rotation);
    }
    
    if (placementRandomness) {
        placementRandomness.value = (Math.random() * 2).toFixed(2); // 0 to 2
        updateValueDisplay(placementRandomness);
    }

    // Randomly select colors ensuring they are all different
    const colorSections = ['fill-colors', 'stroke-colors', 'background-colors'];
    let selectedColors = new Set();
    
    // Function to get a random color option that hasn't been used
    const getRandomColor = (options) => {
        const availableOptions = Array.from(options).filter(option => 
            !selectedColors.has(option.dataset.color)
        );
        return availableOptions[Math.floor(Math.random() * availableOptions.length)];
    };

    // Select different colors for each section
    colorSections.forEach(section => {
        const options = document.querySelectorAll(`.${section} .color-option`);
        if (options.length > 0) {
            let randomOption;
            // Keep trying until we get a different color
            do {
                randomOption = getRandomColor(options);
            } while (!randomOption && selectedColors.size < options.length);

            // If we couldn't find a different color, just pick any (fallback)
            if (!randomOption) {
                randomOption = options[Math.floor(Math.random() * options.length)];
            }

            // Update selection and UI
            options.forEach(btn => btn.classList.remove('selected'));
            randomOption.classList.add('selected');
            selectedColors.add(randomOption.dataset.color);
            
            // Update the hidden input and value display
            const container = randomOption.closest('.control-group');
            const hiddenInput = container.querySelector('input[type="hidden"]');
            const valueDisplay = container.querySelector('.value-display');
            const color = randomOption.dataset.color;
            
            if (hiddenInput) hiddenInput.value = color;
            if (valueDisplay) valueDisplay.textContent = color;
        }
    });

    // Update the canvas with new values and a new random seed
    updateCanvas(Date.now());
}

function getAllParameters() {
    return {
        shapeCount: document.getElementById('shape-count').value,
        shapeSize: document.getElementById('shape-size').value,
        pointCount: document.getElementById('point-count').value,
        pointRandomness: document.getElementById('point-randomness').value,
        cornerRadius: document.getElementById('corner-radius').value,
        strokeWeight: document.getElementById('stroke-weight').value,
        spread: document.getElementById('shape-spread').value,
        rotation: document.getElementById('shape-rotation').value,
        placementRandomness: document.getElementById('placement-randomness').value,
        fillColor: document.getElementById('fill-color').value,
        strokeColor: document.getElementById('stroke-color').value,
        backgroundColor: document.getElementById('background-color').value,
        canvasSize: document.getElementById('canvas-size').value
    };
}

function setAllParameters(params) {
    // Update slider values
    const sliders = {
        'shape-count': params.shapeCount,
        'shape-size': params.shapeSize,
        'point-count': params.pointCount,
        'point-randomness': params.pointRandomness,
        'corner-radius': params.cornerRadius,
        'stroke-weight': params.strokeWeight,
        'shape-spread': params.spread,
        'shape-rotation': params.rotation,
        'placement-randomness': params.placementRandomness
    };

    // Update all sliders and their displays
    Object.entries(sliders).forEach(([id, value]) => {
        const slider = document.getElementById(id);
        if (slider) {
            slider.value = value;
            updateValueDisplay(slider);
        }
    });

    // Update color selections
    const colors = {
        'fill-colors': params.fillColor,
        'stroke-colors': params.strokeColor,
        'background-colors': params.backgroundColor
    };

    // Update color buttons and hidden inputs
    Object.entries(colors).forEach(([containerClass, color]) => {
        const options = document.querySelectorAll(`.${containerClass} .color-option`);
        const container = options[0]?.closest('.control-group');
        const hiddenInput = container?.querySelector('input[type="hidden"]');
        const valueDisplay = container?.querySelector('.value-display');

        // Update hidden input and value display
        if (hiddenInput) hiddenInput.value = color;
        if (valueDisplay) valueDisplay.textContent = color;

        // Update selected state of color buttons
        options.forEach(option => {
            option.classList.toggle('selected', option.dataset.color === color);
        });
    });

    // Update canvas size
    if (params.canvasSize) {
        const options = document.querySelectorAll('.canvas-option');
        const sizeInput = document.getElementById('canvas-size');
        const valueDisplay = document.querySelector('.canvas-options').parentElement.querySelector('.value-display');
        
        options.forEach(option => {
            if (option.textContent === params.canvasSize) {
                option.click();
            }
        });
    }

    // Update the canvas with new parameters
    updateCanvas();
}

function saveParameters() {
    const params = getAllParameters();
    const filename = `PAPAsParams#${String(saveCounter).padStart(3, '0')}.json`;
    const blob = new Blob([JSON.stringify(params, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    console.log('Initiating download for', filename);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function loadParameters() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const params = JSON.parse(event.target.result);
                    setAllParameters(params);
                } catch (error) {
                    console.error('Error loading parameters:', error);
                    alert('Error loading parameters. Please ensure you selected a valid parameter file.');
                }
            };
            reader.readAsText(file);
        }
    };
    
    // Trigger file selection
    input.click();
}

function startAnimation(shouldRecord = false) {
    if (!isAnimating) {
        // Store original parameters
        originalParams = {
            strokeWeight: parseInt(document.getElementById('stroke-weight').value),
            randomness: 1 - parseFloat(document.getElementById('point-randomness').value),
            distance: parseInt(document.getElementById('shape-size').value),
            spread: parseInt(document.getElementById('shape-spread').value),
            rotation: parseInt(document.getElementById('shape-rotation').value)
        };

        // Start animation
        isAnimating = true;
        animationStartTime = Date.now();
        gifRecording = shouldRecord;
        
        // Make sure p5 is looping
        if (shapeSketch) {
            shapeSketch.loop();
            
            // Start recording GIF if needed
            if (shouldRecord) {
                shapeSketch.savePngSequence(`PAPAsPNG#${String(saveCounter).padStart(3, '0')}`, 5);
            }
        }

        // Update play button state
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.textContent = '⏸️';
            isPlaying = true;
        }

        // Stop animation after duration if not recording
        if (!shouldRecord) {
            setTimeout(() => {
                if (isAnimating) {
                    stopAnimation();
                }
            }, ANIMATION_DURATION);
        }
    }
}

function stopAnimation() {
    if (isAnimating) {
        isAnimating = false;
        gifRecording = false;
        isPlaying = false;
        
        // Restore original parameters
        if (originalParams) {
            document.getElementById('stroke-weight').value = originalParams.strokeWeight;
            document.getElementById('point-randomness').value = (1 - originalParams.randomness).toFixed(2);
            document.getElementById('shape-size').value = originalParams.distance;
            document.getElementById('shape-spread').value = originalParams.spread;
            document.getElementById('shape-rotation').value = originalParams.rotation;
            
            // Update UI displays
            updateValueDisplay(document.getElementById('stroke-weight'));
            updateValueDisplay(document.getElementById('point-randomness'));
            updateValueDisplay(document.getElementById('shape-size'));
            updateValueDisplay(document.getElementById('shape-spread'));
            updateValueDisplay(document.getElementById('shape-rotation'));
            
            // Update canvas with original parameters
            updateCanvas();
            
            originalParams = null;
        }
        
        // Update play button state
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.textContent = '▶️';
        }
        
        if (shapeSketch) {
            shapeSketch.noLoop();
        }
    }
}

function setupControlListeners() {
    // Get references to all control elements
    const shapeCountSlider = document.getElementById('shape-count');
    const shapeSizeSlider = document.getElementById('shape-size');
    const pointCountSlider = document.getElementById('point-count');
    const pointRandomnessSlider = document.getElementById('point-randomness');
    const cornerRadiusSlider = document.getElementById('corner-radius');
    const strokeWeightSlider = document.getElementById('stroke-weight');
    const spreadSlider = document.getElementById('shape-spread');
    const rotationSlider = document.getElementById('shape-rotation');
    const placementRandomnessSlider = document.getElementById('placement-randomness');
    const randomiseBtn = document.getElementById('randomise-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const saveBtn = document.getElementById('save-btn');
    
    // Color inputs
    const fillColorInput = document.getElementById('fill-color');
    const strokeColorInput = document.getElementById('stroke-color');
    const backgroundColorInput = document.getElementById('background-color');
    
    // Add event listeners to color options
    const setupColorOptions = (containerClass, inputElement) => {
        const options = document.querySelectorAll(`.${containerClass} .color-option`);
        const valueDisplay = options[0]?.parentElement.previousElementSibling.querySelector('.value-display');
        
        options.forEach(option => {
            if (option) {
                option.style.backgroundColor = option.dataset.color;
                option.addEventListener('click', () => {
                    const color = option.dataset.color;
                    if (inputElement) {
                        inputElement.value = color;
                    }
                    if (valueDisplay) {
                        valueDisplay.textContent = color;
                    }
                    options.forEach(btn => btn.classList.remove('selected'));
                    option.classList.add('selected');
                    updateCanvas();
                });
            }
        });
    };

    // Setup color options for each color control
    setupColorOptions('fill-colors', fillColorInput);
    setupColorOptions('stroke-colors', strokeColorInput);
    setupColorOptions('background-colors', backgroundColorInput);
    
    // Add event listener to save button
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Save SVG with updated naming
            shapeSketch.save(`PAPAsSVG#${String(saveCounter).padStart(3, '0')}.svg`);
            
            // Save parameters
            saveParameters();
            
            saveCounter++;
        });
    }
    
    // Add event listener to play button
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!isPlaying) {
                startAnimation(false); // Start animation without recording
            } else {
                stopAnimation();
            }
        });
    }
    
    // Add event listener to regenerate button
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', () => {
            if (shapeSketch) {
                // Get current values
                const shapeCount = document.getElementById('shape-count');
                const pointCount = document.getElementById('point-count');
                const shapeSize = document.getElementById('shape-size');
                const shapeSpread = document.getElementById('shape-spread');
                const rotation = document.getElementById('shape-rotation');

                // Randomly adjust shape count by -1, 0, or +1
                if (shapeCount) {
                    const currentCount = parseInt(shapeCount.value);
                    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                    const newCount = Math.max(1, Math.min(24, currentCount + change)); // Ensure within bounds
                    shapeCount.value = newCount;
                    updateValueDisplay(shapeCount);
                }

                // Randomly adjust point count by -1, 0, or +1
                if (pointCount) {
                    const currentPoints = parseInt(pointCount.value);
                    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                    const newPoints = Math.max(3, Math.min(24, currentPoints + change)); // Ensure within bounds
                    pointCount.value = newPoints;
                    updateValueDisplay(pointCount);
                }

                // Randomly adjust shape size by -20 to +20
                if (shapeSize) {
                    const currentSize = parseInt(shapeSize.value);
                    const change = Math.floor(Math.random() * 41) - 20; // -20 to +20
                    const newSize = Math.max(10, Math.min(500, currentSize + change)); // Ensure within bounds
                    shapeSize.value = newSize;
                    updateValueDisplay(shapeSize);
                }

                // Randomly adjust shape spread by -20 to +20
                if (shapeSpread) {
                    const currentSpread = parseInt(shapeSpread.value);
                    const change = Math.floor(Math.random() * 41) - 20; // -20 to +20
                    const newSpread = Math.max(0, Math.min(500, currentSpread + change)); // Ensure within bounds
                    shapeSpread.value = newSpread;
                    updateValueDisplay(shapeSpread);
                }

                // Completely randomize rotation
                if (rotation) {
                    rotation.value = Math.floor(Math.random() * 361); // 0 to 360
                    updateValueDisplay(rotation);
                }

                // Update canvas with new values and a new random seed
                updateCanvas(Date.now());
            }
        });
    }
    
    // Add event listener to randomise button
    if (randomiseBtn) {
        randomiseBtn.addEventListener('click', randomizeControls);
    }
    
    // Collect all slider controls in an array for batch event listener assignment
    const controls = [
        shapeCountSlider, shapeSizeSlider,
        pointCountSlider, pointRandomnessSlider, cornerRadiusSlider,
        strokeWeightSlider, spreadSlider, rotationSlider, placementRandomnessSlider
    ];
    
    // Add input event listeners to all slider controls
    controls.forEach(control => {
        if (control) {
            // Update value display initially
            updateValueDisplay(control);
            
            // Add input event listener
            control.addEventListener('input', (e) => {
                updateValueDisplay(e.target);
                updateCanvas();
            });
        }
    });

    const loadParamsBtn = document.getElementById('load-params-btn');

    // Add event listener to load parameters button
    if (loadParamsBtn) {
        loadParamsBtn.addEventListener('click', loadParameters);
    }

    // Setup canvas size options
    const setupCanvasOptions = () => {
        const options = document.querySelectorAll('.canvas-option');
        const sizeInput = document.getElementById('canvas-size');
        const valueDisplay = document.querySelector('.canvas-options').closest('.control-group').querySelector('.value-display');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                const width = parseInt(option.dataset.width);
                const height = parseInt(option.dataset.height);
                const ratio = option.textContent;
                
                // Update UI
                options.forEach(btn => btn.classList.remove('selected'));
                option.classList.add('selected');
                
                if (sizeInput) sizeInput.value = ratio;
                if (valueDisplay) valueDisplay.textContent = ratio;
                
                // Update canvas dimensions
                canvasWidth = width;
                canvasHeight = height;
                
                // Recreate canvas with new dimensions
                if (shapeSketch) {
                    const container = document.getElementById('shape-canvas');
                    if (container) {
                        // Clear the container
                        container.innerHTML = '';
                        
                        // Reinitialize the sketch
                        shapeSketch = new p5(createShapeSketch, 'shape-canvas');
                        
                        // Update the canvas with current parameters
                        updateCanvas();
                    }
                }
            });
        });
    };

    setupCanvasOptions();
    
    // Trigger randomise on initial load
    if (randomiseBtn) {
        randomiseBtn.click();
    }

    // Add event listeners to all controls that should stop the animation when changed
    const allControls = document.querySelectorAll('input[type="range"], .color-option, .canvas-option');
    allControls.forEach(control => {
        control.addEventListener('change', () => {
            if (isPlaying) {
                stopAnimation();
            }
        });
        
        // For immediate response on sliders
        if (control.type === 'range') {
            control.addEventListener('input', () => {
                if (isPlaying) {
                    stopAnimation();
                }
            });
        }
    });

    // Add event listener to save GIF button
    const saveGifBtn = document.getElementById('save-gif-btn');
    if (saveGifBtn) {
        saveGifBtn.addEventListener('click', () => {
            console.log('Save GIF button clicked');
            // Start animation and GIF recording
            isAnimating = true;
            shapeSketch.loop();
            shapeSketch.saveGif(`PAPAsGIF#${String(saveCounter).padStart(3, '0')}`, 5);
            saveCounter++;
        });
    }

    // Add event listener to save PNG sequence button
    const savePngBtn = document.getElementById('save-png-btn');
    if (savePngBtn) {
        savePngBtn.addEventListener('click', () => {
            console.log('Save PNG sequence button clicked');
            // Start animation and PNG sequence recording
            isAnimating = true;
            shapeSketch.loop();
            shapeSketch.savePngSequence(`PAPAsPNG#${String(saveCounter).padStart(3, '0')}`, 5);
            saveCounter++;
        });
    }
}

/**
 * Updates the canvas with current control values
 * @param {number} [seed] - Optional random seed to use
 */
function updateCanvas(seed) {
    if (shapeSketch) {
        const fillColorInput = document.getElementById('fill-color');
        const strokeColorInput = document.getElementById('stroke-color');
        const backgroundColorInput = document.getElementById('background-color');
        
        shapeSketch.updateParams({
            shapeCount: document.getElementById('shape-count').value,
            shapeSize: document.getElementById('shape-size').value,
            pointCount: document.getElementById('point-count').value,
            pointRandomness: document.getElementById('point-randomness').value,
            cornerRadius: document.getElementById('corner-radius').value,
            strokeWeight: document.getElementById('stroke-weight').value,
            spread: document.getElementById('shape-spread').value,
            rotation: document.getElementById('shape-rotation').value,
            placementRandomness: document.getElementById('placement-randomness').value,
            fillColor: fillColorInput.value,
            strokeColor: strokeColorInput.value,
            backgroundColor: backgroundColorInput.value,
            seed: seed
        });
    }
}

// Advanced options toggle
document.getElementById('advanced-options-btn').addEventListener('click', function() {
    const advancedControls = document.getElementById('advanced-controls');
    const isHidden = advancedControls.style.display === 'none';
    advancedControls.style.display = isHidden ? 'block' : 'none';
    this.textContent = isHidden ? 'Hide Advanced Options' : 'Advanced Options';
});

// Weather parameter presets with ranges
const weatherPresets = {
    sunny: {
        fillColor: '#fff603',
        strokeColor: '#fff603',
        backgroundColor: '#0058c5',
        pointCount: {min: 7, max: 18},
        cornerRadius: 100,
        strokeWeight: 0,
        pointRandomness: {min: 0.6, max: 0.85},
        shapeSize: {min: 150, max: 350},
        shapeCount: 1,
        shapeSpread: {min: 0, max: 500},
        rotation: {min: 0, max: 360},
        placementRandomness: {min: 0, max: 1}
    },
    rainy: {
        fillColor: '#0058c5',
        strokeColor: '#0058c5',
        backgroundColor: '#ffffff',
        pointCount: {min: 3, max: 6},
        cornerRadius: {min: 30, max: 100},
        strokeWeight: {min: 4, max: 12},
        pointRandomness: {min: 0, max: 0.3},
        shapeSize: {min: 40, max: 90},
        shapeCount: {min: 5, max: 20},
        shapeSpread: {min: 300, max: 500},
        rotation: {min: 0, max: 360},
        placementRandomness: {min: 0.8, max: 2}
    },
    storm: {
        fillColor: '#000000',
        strokeColor: '#fff603',
        backgroundColor: '#000000',
        pointCount: {min: 20, max: 24},
        cornerRadius: 0,
        strokeWeight: {min: 10, max: 40},
        pointRandomness: {min: 0, max: 0.6},
        shapeSize: {min: 140, max: 400},
        shapeCount: {min: 1, max: 7},
        shapeSpread: {min: 0, max: 500},
        rotation: {min: 0, max: 360},
        placementRandomness: {min: 0, max: 2}
    },
    snow: {
        fillColor: '#ffffff',      // White
        strokeColor: '#0058c5',    // Blue
        backgroundColor: '#ffffff', // White
        pointCount: {min: 18, max: 24},
        cornerRadius: 0,
        strokeWeight: {min: 2, max: 8},
        pointRandomness: {min: 0, max: 0.5},
        shapeSize: {min: 80, max: 230},
        shapeCount: {min: 4, max: 10},
        shapeSpread: {min: 180, max: 400},
        rotation: {min: 0, max: 360},
        placementRandomness: {min: 0, max: 2}
    }
};

// Helper function to get random value within a range
function getRandomInRange(range) {
    if (typeof range === 'object' && range.min !== undefined && range.max !== undefined) {
        return Math.random() * (range.max - range.min) + range.min;
    }
    return range; // Return the value as is if it's not a range
}

// Update weather option click handlers
document.querySelectorAll('.weather-option').forEach(button => {
    button.addEventListener('click', function() {
        const preset = weatherPresets[this.dataset.preset];
        if (!preset) return;

        // Remove selected class from all weather options
        document.querySelectorAll('.weather-option').forEach(btn => btn.classList.remove('selected'));
        // Add selected class to clicked button
        this.classList.add('selected');

        // Update the value display
        const valueDisplay = this.closest('.control-group').querySelector('.value-display');
        if (valueDisplay) {
            valueDisplay.textContent = this.textContent;
        }

        // Update colors
        document.getElementById('fill-color').value = preset.fillColor;
        document.getElementById('stroke-color').value = preset.strokeColor;
        document.getElementById('background-color').value = preset.backgroundColor;

        // Update color buttons
        document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('selected'));
        document.querySelector(`.fill-colors [data-color="${preset.fillColor}"]`)?.classList.add('selected');
        document.querySelector(`.stroke-colors [data-color="${preset.strokeColor}"]`)?.classList.add('selected');
        document.querySelector(`.background-colors [data-color="${preset.backgroundColor}"]`)?.classList.add('selected');

        // Update all controls with random values within their ranges
        const controls = {
            'point-count': Math.round(getRandomInRange(preset.pointCount)),
            'point-randomness': getRandomInRange(preset.pointRandomness).toFixed(2),
            'corner-radius': Math.round(getRandomInRange(preset.cornerRadius)),
            'stroke-weight': Math.round(getRandomInRange(preset.strokeWeight)),
            'shape-size': Math.round(getRandomInRange(preset.shapeSize)),
            'shape-count': Math.round(getRandomInRange(preset.shapeCount)),
            'shape-spread': Math.round(getRandomInRange(preset.shapeSpread)),
            'shape-rotation': Math.round(getRandomInRange(preset.rotation)),
            'placement-randomness': getRandomInRange(preset.placementRandomness).toFixed(2)
        };

        Object.entries(controls).forEach(([id, value]) => {
            const control = document.getElementById(id);
            if (control) {
                control.value = value;
                updateValueDisplay(control);
            }
        });

        // Immediately update the canvas with new parameters
        updateCanvas();
    });
});

// Add automatic refresh for color options
document.querySelectorAll('.color-option').forEach(button => {
    button.addEventListener('click', function() {
        // Existing color selection logic
        const colorOptions = this.parentElement;
        const input = document.getElementById(colorOptions.classList.contains('fill-colors') ? 'fill-color' :
            colorOptions.classList.contains('stroke-colors') ? 'stroke-color' : 'background-color');
        
        // Remove selected class from all buttons in this group
        colorOptions.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('selected'));
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Update the hidden input value
        input.value = this.dataset.color;
        
        // Update the value display
        const valueDisplay = this.closest('.control-group').querySelector('.value-display');
        if (valueDisplay) {
            valueDisplay.textContent = this.dataset.color;
        }

        // Automatically refresh the canvas
        regenerateShape();
    });
});

// Add automatic refresh for range inputs
document.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', function() {
        // Update value display
        const valueDisplay = this.parentElement.querySelector('.value-display');
        if (valueDisplay) {
            let displayValue = this.value;
            if (this.id === 'shape-rotation') {
                displayValue += '°';
            } else if (this.id === 'corner-radius') {
                displayValue += '%';
            }
            valueDisplay.textContent = displayValue;
        }

        // Automatically refresh the canvas
        regenerateShape();
    });
});

// Add automatic refresh for canvas size options
document.querySelectorAll('.canvas-option').forEach(button => {
    button.addEventListener('click', function() {
        // Remove selected class from all buttons
        document.querySelectorAll('.canvas-option').forEach(btn => btn.classList.remove('selected'));
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Update the hidden input value
        const input = document.getElementById('canvas-size');
        const width = this.dataset.width;
        const height = this.dataset.height;
        input.value = `${width}:${height}`;
        
        // Update the value display
        const valueDisplay = this.closest('.control-group').querySelector('.value-display');
        if (valueDisplay) {
            const ratio = Math.round((width / height) * 100) / 100;
            valueDisplay.textContent = ratio === 1 ? '1:1' : ratio > 1 ? '16:9' : ratio < 0.6 ? '9:16' : '4:5';
        }

        // Automatically refresh the canvas
        regenerateShape();
    });
});