// Store the original SVG paths for resetting
const originalSVG = {};
const svgElements = {};
let currentUniformity = 0;
// Store randomized points for consistent transitions
const randomizedPoints = {};

// DOM elements
const slider = document.getElementById('uniformitySlider');
const uniformityValue = document.getElementById('uniformityValue');
const resetButton = document.getElementById('resetButton');
const svgGraphic = document.getElementById('svgGraphic');
const container = document.querySelector('.container');
const colorOptions = document.querySelectorAll('.color-option');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Get all SVG elements we want to manipulate
  const paths = svgGraphic.querySelectorAll('path');
  const polygons = svgGraphic.querySelectorAll('polygon');
  
  // Store original path data
  paths.forEach((path, index) => {
    originalSVG[`path-${index}`] = {
      element: path,
      originalD: path.getAttribute('d'),
      type: 'path'
    };
    svgElements[`path-${index}`] = path;
    // Initialize randomized points for this path
    randomizedPoints[`path-${index}`] = generateRandomizedPath(path.getAttribute('d'));
  });
  
  // Store original polygon data
  polygons.forEach((polygon, index) => {
    originalSVG[`polygon-${index}`] = {
      element: polygon,
      originalPoints: polygon.getAttribute('points'),
      type: 'polygon'
    };
    svgElements[`polygon-${index}`] = polygon;
    // Initialize randomized points for this polygon
    randomizedPoints[`polygon-${index}`] = generateRandomizedPolygon(polygon.getAttribute('points'));
  });
  
  // Set up event listeners
  slider.addEventListener('input', handleSliderChange);
  resetButton.addEventListener('click', resetSVG);
  
  // Add event listeners for color options
  colorOptions.forEach(option => {
    option.addEventListener('click', handleColorChange);
  });
}

// Generate randomized path data once at initialization
function generateRandomizedPath(pathData) {
  const pathCommandRegex = /([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g;
  const numberRegex = /-?[0-9]*\.?[0-9]+/g;
  
  const randomizedCommands = [];
  let match;
  
  // Process each command in the path
  while ((match = pathCommandRegex.exec(pathData)) !== null) {
    const [, command, paramsStr] = match;
    
    // Extract numbers from the parameters
    const originalNumbers = [];
    const randomizedNumbers = [];
    let numMatch;
    
    while ((numMatch = numberRegex.exec(paramsStr)) !== null) {
      const originalValue = parseFloat(numMatch[0]);
      originalNumbers.push(originalValue);
      // Generate random displacement with increased range (maximum 8 units in any direction)
      const displacement = (Math.random() * 16 - 8);
      randomizedNumbers.push(originalValue + displacement);
    }
    
    randomizedCommands.push({
      command,
      originalNumbers,
      randomizedNumbers
    });
  }
  
  return randomizedCommands;
}

// Generate randomized polygon points once at initialization
function generateRandomizedPolygon(pointsData) {
  const pointPairs = [];
  const randomizedPairs = [];
  const pointRegex = /(-?[0-9]*\.?[0-9]+)[,\s]+(-?[0-9]*\.?[0-9]+)/g;
  
  let match;
  while ((match = pointRegex.exec(pointsData)) !== null) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    
    pointPairs.push({ x, y });
    
    // Generate random displacement with increased range (maximum 8 units in any direction)
    const xDisplacement = (Math.random() * 16 - 8);
    const yDisplacement = (Math.random() * 16 - 8);
    
    randomizedPairs.push({
      x: x + xDisplacement,
      y: y + yDisplacement
    });
  }
  
  return {
    original: pointPairs,
    randomized: randomizedPairs
  };
}

// Handle slider changes
function handleSliderChange() {
  currentUniformity = parseFloat(slider.value);
  uniformityValue.textContent = currentUniformity.toFixed(1);
  
  // Apply manipulation based on uniformity value
  applyUniformityChange(currentUniformity);
}

// Apply uniformity changes to SVG
function applyUniformityChange(uniformityValue) {
  // Loop through all SVG elements and apply displacement
  Object.keys(originalSVG).forEach(key => {
    const item = originalSVG[key];
    const element = svgElements[key];
    
    if (item.type === 'path') {
      // Handle path elements by manipulating the d attribute
      const manipulatedPath = interpolatePath(key, uniformityValue);
      element.setAttribute('d', manipulatedPath);
    } else if (item.type === 'polygon') {
      // Handle polygon elements by manipulating the points attribute
      const manipulatedPoints = interpolatePolygon(key, uniformityValue);
      element.setAttribute('points', manipulatedPoints);
    }
  });
}

// Interpolate between original and randomized path based on uniformity
function interpolatePath(key, uniformityValue) {
  // Higher uniformity = less displacement
  // uniformityValue goes from 0 to 2 where 2 = original, 0 = fully randomized
  const pathData = randomizedPoints[key];
  let result = '';
  
  pathData.forEach(commandData => {
    const { command, originalNumbers, randomizedNumbers } = commandData;
    
    // Add the command to the result
    result += command;
    
    // Interpolate between original and randomized numbers based on uniformity
    for (let i = 0; i < originalNumbers.length; i++) {
      const original = originalNumbers[i];
      const randomized = randomizedNumbers[i];
      
      // Calculate interpolated value
      // uniformityValue/2 gives us a ratio from 0 to 1
      const ratio = Math.min(uniformityValue / 2, 1);
      const interpolated = randomized + (original - randomized) * ratio;
      
      // Add to the result with proper formatting
      result += (i > 0 ? ' ' : '') + interpolated.toFixed(2);
    }
  });
  
  return result;
}

// Interpolate between original and randomized polygon points based on uniformity
function interpolatePolygon(key, uniformityValue) {
  // Higher uniformity = less displacement
  // uniformityValue goes from 0 to 2 where 2 = original, 0 = fully randomized
  const { original, randomized } = randomizedPoints[key];
  
  // Calculate the ratio for interpolation (0 to 1)
  const ratio = Math.min(uniformityValue / 2, 1);
  
  // Interpolate between original and randomized points
  const interpolatedPoints = original.map((originalPoint, index) => {
    const randomizedPoint = randomized[index];
    
    return {
      x: randomizedPoint.x + (originalPoint.x - randomizedPoint.x) * ratio,
      y: randomizedPoint.y + (originalPoint.y - randomizedPoint.y) * ratio
    };
  });
  
  // Convert back to string format
  return interpolatedPoints
    .map(point => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
}

// Handle color change
function handleColorChange(e) {
  const selectedColor = e.target.getAttribute('data-color');
  
  // Update selected state for color options
  colorOptions.forEach(option => {
    option.classList.remove('selected');
  });
  e.target.classList.add('selected');
  
  // Change SVG fill color
  svgGraphic.style.fill = selectedColor;
  
  // Toggle dark mode for white color
  if (selectedColor === '#ffffff') {
    container.classList.add('dark');
  } else {
    container.classList.remove('dark');
  }
}

// Reset SVG to original state
function resetSVG() {
  // Reset slider value
  slider.value = 2;
  currentUniformity = 2;
  uniformityValue.textContent = '2.0';
  
  // Reset all SVG elements to their original state
  Object.keys(originalSVG).forEach(key => {
    const item = originalSVG[key];
    const element = svgElements[key];
    
    if (item.type === 'path') {
      element.setAttribute('d', item.originalD);
    } else if (item.type === 'polygon') {
      element.setAttribute('points', item.originalPoints);
    }
  });
} 