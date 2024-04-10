const inreamentBtn = document.querySelector(".increament");
const decreamentBtn = document.querySelector(".decreament");
const valDiv = document.querySelector(".val");
const alignmentSelect = document.getElementById("alignmentSelect");
const buttons = document.querySelectorAll(".valbtn");
console.log("val btn ", buttons);
let val = 0;

const svgs = {
  left: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32.0039 40L16.0039 24L32.0039 8" stroke="white" stroke-width="3" stroke-linecap="round"
      stroke-linejoin="round" />
</svg>`,
  right: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.9961 8L31.9961 24L15.9961 40" stroke="white" stroke-width="3" stroke-linecap="round"
    stroke-linejoin="round" />
</svg>`,
  top: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 32.0039L24 16.0039L40 32.0039" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  bottom: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M40 15.9961L24 31.9961L8 15.9961" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
};

function updateVal(value) {
  val = Math.max(0, Math.min(100, value));
  valDiv.innerHTML = `${val} %`;
  updateButtonsState();
}

inreamentBtn.addEventListener("click", () => {
  updateVal(val + 1);
  updateButtonsState();
});

decreamentBtn.addEventListener("click", () => {
  updateVal(val - 1);
  updateButtonsState();
});

alignmentSelect.addEventListener("change", () => {
  const selectedValue = alignmentSelect.value;
  document.querySelector(".box").classList.remove("horizontal", "vertical");
  document.querySelector(".box").classList.add(selectedValue);
  updateSVGs(selectedValue);
  updateButtonsState();
});

function updateValueFromButton(buttonValue) {
    val = parseInt(buttonValue, 10); 
    console.log("val : ", buttonValue);
    updateVal(val);
    updateButtonsState();
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
      console.log("insdw");
        updateValueFromButton(button.textContent);
        updateVal(val);
    });
});

function updateSVGs(selectedValue) {
  if (selectedValue === "horizontal") {
    decreamentBtn.innerHTML = svgs.left;
    inreamentBtn.innerHTML = svgs.right;
  } else {
    decreamentBtn.innerHTML = svgs.top;
    inreamentBtn.innerHTML = svgs.bottom;
  }
}

function updateButtonsState() {
  decreamentBtn.disabled = val === 0;
  inreamentBtn.disabled = val === 100;
}

alignmentSelect.value = "horizontal";
alignmentSelect.dispatchEvent(new Event("change"));

updateVal(val);
updateButtonsState();
