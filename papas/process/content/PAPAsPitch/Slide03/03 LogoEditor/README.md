# SVG Uniformity Manipulator

A simple interactive tool to manipulate SVG paths by adjusting their "uniformity" - the displacement of points from their original positions.

## Features

- Interactive slider to control the displacement of SVG points
- Real-time manipulation of SVG paths and polygons
- Reset button to restore the original SVG
- Visual feedback when the SVG is being manipulated

## How It Works

The application allows you to manipulate an SVG by adjusting a "Uniformity" slider:

1. When the slider value is 0, the SVG appears in its original form.
2. As you increase the slider value, the points in the SVG paths are displaced randomly.
3. The higher the value, the more displacement is applied, making the shape look less uniform.
4. The Reset button returns the SVG to its original state.

## Technical Implementation

- **HTML**: Provides the structure including the SVG and slider controls
- **CSS**: Styles the interface and provides visual feedback
- **JavaScript**: 
  - Parses SVG path data and polygon points
  - Stores original SVG data for restoration
  - Applies random displacement to coordinates based on the slider value
  - Updates the SVG in real-time as the slider changes

## How to Use

1. Open `index.html` in a web browser
2. Move the "Uniformity" slider to adjust the displacement of points in the SVG
3. Click the "Reset" button to restore the original SVG

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## Customization

To use your own SVG:
1. Replace the SVG content in the `index.html` file
2. The script automatically detects path and polygon elements

## License

This project is open source and available under the MIT License. 