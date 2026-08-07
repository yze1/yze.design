const output = document.querySelector("#type-tester-output");
const size = document.querySelector("#tester-size");
const tracking = document.querySelector("#tester-tracking");
const leading = document.querySelector("#tester-leading");
const alignment = document.querySelector("#tester-align");

function updateTester() {
    output.style.fontSize = `${size.value}px`;
    output.style.letterSpacing = `${tracking.value / 100}em`;
    output.style.lineHeight = leading.value / 10;
    output.style.textAlign = alignment.value;
    document.querySelector("#tester-size-value").textContent = `${size.value}px`;
    document.querySelector("#tester-tracking-value").textContent = `${tracking.value / 100}em`;
    document.querySelector("#tester-leading-value").textContent = leading.value / 10;
}

[size, tracking, leading, alignment].forEach(control =>
    control.addEventListener("input", updateTester)
);
document.querySelector("#tester-theme").addEventListener("click", () =>
    output.classList.toggle("dark")
);
