// @ts-nocheck
/**
 * p5setup.js - Utility functions for p5.js setup and configuration.
 */

// Canvas dimensions for high-quality exports
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

/**
 * Creates a configured canvas with the specified dimensions
 * @param {Object} p - The p5 instance
 * @param {string} containerId - The ID of the container element
 * @returns {Object} The created canvas
 */
function createConfiguredCanvas(p, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return null;
    }
    
    // Create canvas with SVG renderer
    const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, p.SVG);
    canvas.parent(containerId);
    
    // Set pixel density
    p.pixelDensity(1);
    
    return canvas;
}

/**
 * Saves the canvas as an SVG file
 * @param {Object} p - The p5 instance
 * @param {string} filename - The filename to save as (without extension)
 */
function saveCanvasAsImage(p, filename = 'PAPAsShape') {
    p.save(filename + '.svg');
}

/**
 * Applies common settings to the p5 instance
 * @param {Object} p - The p5 instance
 * @param {boolean} loop - Whether to enable the animation loop
 */
function applyCommonSettings(p, loop = false) {
    if (!loop) p.noLoop();
}

function createShapeSketch(p) {
    console.log('Starting shape sketch creation');
    
    // Setup function runs once when the sketch is created
    p.setup = function() {
        console.log('Running p5.js setup function');
        const canvas = createConfiguredCanvas(p, 'shape-canvas');
        if (!canvas) {
            console.error('Failed to create canvas');
            return;
        }
        console.log('Canvas setup complete');
        
        // Set the random seed to ensure consistent randomization
        const seed = Date.now();
        p.randomSeed(seed);
        console.log('Random seed set:', seed);
        
        // Initial draw
        p.draw();
        console.log('Initial draw complete');
    };

    // Draw function - redraws when parameters change
    p.draw = function() {
        console.log('Starting draw function');
        
        // Get the current parameters
        const params = getCurrentParams();
        console.log('Current parameters:', params);
        
        // Clear the canvas and set background
        p.background(params.backgroundColor);
        console.log('Background set');
        
        // Set shape styles
        p.stroke(params.strokeColor);
        p.strokeWeight(params.strokeWeight);
        p.fill(params.fillColor);
        console.log('Shape styles set');
        
        // Draw the shapes
        drawShapes(p, params);
        console.log('Shapes drawn');
        
        // Stop the draw loop - we only need to draw when parameters change
        p.noLoop();
    };

    // Save canvas as image
    p.saveImage = function() {
        console.log('Saving image...');
        const paddedCounter = String(saveCounter).padStart(3, '0');
        saveCanvasAsImage(p, `PAPAsShape#${paddedCounter}`);
        console.log('Image saved as:', `PAPAsShape#${paddedCounter}`);
    };
}

// Function to draw shapes based on current parameters
function drawShapes(p, params) {
    console.log('Drawing shapes with parameters:', params);
    
    // Calculate center point for the shape arrangement
    const centerX = p.width / 2;
    const centerY = p.height / 2;
    console.log('Center point:', centerX, centerY);

    // Draw each shape
    for (let i = 0; i < params.shapeCount; i++) {
        console.log('Drawing shape', i + 1, 'of', params.shapeCount);
        
        // Calculate position with spread and randomness
        const angle = (i / params.shapeCount) * p.TWO_PI;
        const spreadDistance = params.spread * (1 - p.random() * params.placementRandomness);
        const x = centerX + p.cos(angle) * spreadDistance;
        const y = centerY + p.sin(angle) * spreadDistance;
        
        // Draw the shape
        drawShape(p, x, y, params);
    }
} 