document.addEventListener("DOMContentLoaded", function() {
    const svg = document.getElementById('mySVG');
    const fillColorInput = document.getElementById('fillColor');
    const strokeColorInput = document.getElementById('strokeColor');
    const strokeWidthInput = document.getElementById('strokeWidth');
    let selectedPath = null;

    fillColorInput.addEventListener('input', function() {
        const color = this.value;
        if (selectedPath) {
            selectedPath.setAttribute('fill', color);
        }
    });

    strokeColorInput.addEventListener('input', function() {
        const color = this.value;
        if (selectedPath) {
            selectedPath.setAttribute('stroke', color);
        }
    });

    strokeWidthInput.addEventListener('input', function() {
        const strokeWidth = this.value;
        if (selectedPath) {
            selectedPath.setAttribute('stroke-width', strokeWidth);
        }
    });

    // Select the first path element by default
    const paths = svg.querySelectorAll('path');
    if (paths.length > 0) {
        selectedPath = paths[0];
        fillColorInput.value = selectedPath.getAttribute('fill');
        strokeColorInput.value = selectedPath.getAttribute('stroke');
        strokeWidthInput.value = selectedPath.getAttribute('stroke-width');
    }

    // Add event listener to each path element to handle click event
    paths.forEach(path => {
        path.style.cssText = `cursor: pointer;`;
        path.addEventListener('click', function() {
            // Log the clicked path
            console.log("Clicked element:", this);

            // Store the clicked path
            selectedPath = this;

            // Set the color input values to the fill color and stroke color of the selected path
            fillColorInput.value = selectedPath.getAttribute('fill');
            strokeColorInput.value = selectedPath.getAttribute('stroke');
        });
    });
});
