const fontPreview = document.getElementById("fontPreview");
const sliderContainer = document.getElementById("sliderContainer");
const fontInfo = document.getElementById("fontInfo");

// Define the default font axes for YZEVF.ttf
let fontAxes = [
    { name: "Weight", tag: "wght", min: 0, max: 100, default: 0 },
    { name: "Contrast", tag: "cont", min: 0, max: 100, default: 0 },
    { name: "Smooth/Sharp", tag: "smoo", min: 0, max: 100, default: 0 },
];

// Generate sliders dynamically based on font axes
function createSliders(axes) {
    sliderContainer.innerHTML = ""; // Clear previous sliders
    axes.forEach((axis) => {
        const sliderWrapper = document.createElement("div");
        sliderWrapper.className = "slider-container";

        const label = document.createElement("label");
        label.innerText = `${axis.name} (${axis.tag})`;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = axis.min;
        slider.max = axis.max;
        slider.value = axis.default;
        slider.step = axis.tag === "ital" ? "0.1" : "1";
        slider.id = axis.tag;

        const numberInput = document.createElement("input");
        numberInput.type = "number";
        numberInput.min = axis.min;
        numberInput.max = axis.max;
        numberInput.value = axis.default;
        numberInput.step = axis.tag === "ital" ? "0.1" : "1";

        // Sync slider and number input
        slider.addEventListener("input", () => {
            numberInput.value = slider.value;
            updateFontSettings();
        });
        numberInput.addEventListener("input", () => {
            slider.value = numberInput.value;
            updateFontSettings();
        });

        sliderWrapper.appendChild(label);
        sliderWrapper.appendChild(slider);
        sliderWrapper.appendChild(numberInput);

        sliderContainer.appendChild(sliderWrapper);
    });
    updateFontSettings();
}

// Update font settings dynamically
function updateFontSettings() {
    const settings = fontAxes
        .map((axis) => {
            const slider = document.getElementById(axis.tag);
            if (!slider) return '';
            return `'${axis.tag}' ${slider.value}`;
        })
        .filter(Boolean)
        .join(", ");
    
    fontPreview.style.fontVariationSettings = settings;

    fontInfo.innerHTML = `
        <h3>Font Axes Information</h3>
        ${fontAxes
            .map((axis) => {
                const slider = document.getElementById(axis.tag);
                return slider
                    ? `<p><strong>${axis.name} (${axis.tag}):</strong> ${slider.value}</p>`
                    : '';
            })
            .join("")}
    `;
}

// Initialize sliders for default axes
createSliders(fontAxes);

// Apply the YZEVF font
const style = document.createElement("style");
style.innerHTML = `
    @font-face {
        font-family: 'YZEVF';
        src: url('YZEVF.ttf') format('truetype');
    }
`;
document.head.appendChild(style);
fontPreview.style.fontFamily = 'YZEVF';