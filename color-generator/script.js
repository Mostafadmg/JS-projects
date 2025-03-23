/**
 * Palette Genie - Color Palette Generator
 * A beautiful interactive tool for creating and saving color palettes
 * Perfect for beginner to intermediate JavaScript learners
 */

// Wait for the DOM to be fully loaded before running our code
document.addEventListener("DOMContentLoaded", () => {
  // --------------- GLOBAL VARIABLES ---------------

  // DOM Elements - storing references to important elements we'll use often
  const paletteContainer = document.querySelector(".palette-container");
  const generateBtn = document.getElementById("generate-btn");
  const saveBtn = document.getElementById("save-btn");
  const colorCountInput = document.getElementById("color-count-input");
  const modeToggleInput = document.getElementById("mode-toggle-input");
  const modeLabel = document.getElementById("mode-label");
  const savedPalettesList = document.getElementById("saved-palettes-list");
  const toast = document.getElementById("toast");
  const toastMessage = document.querySelector(".toast-message");

  // Application state
  let currentPalette = []; // Stores current color values
  let isHarmonyMode = false; // Toggle between random and harmony mode
  let savedPalettes = []; // Will store saved palettes

  // --------------- HELPER FUNCTIONS ---------------

  /**
   * Generates a random hexadecimal color code
   * @returns {string} A hex color like '#FF5733'
   */
  const generateRandomColor = () => {
    // Create a random hex color by generating a random number and converting to base 16
    const letters = "0123456789ABCDEF";
    let color = "#";

    // A hex color has 6 digits after the #
    for (let i = 0; i < 6; i++) {
      // Randomly select a character from our letters string
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  /**
   * Converts a hex color to HSL (Hue, Saturation, Lightness)
   * This helps us create harmonious color schemes
   * @param {string} hex - Hex color code
   * @returns {Object} HSL values {h, s, l}
   */
  const hexToHSL = (hex) => {
    // Remove the # if present
    hex = hex.replace("#", "");

    // Convert hex to RGB first
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b);
    let delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    // Calculate hue
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Convert to percentages
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
  };

  /**
   * Converts HSL color values to hex
   * @param {number} h - Hue (0-360)
   * @param {number} s - Saturation (0-100)
   * @param {number} l - Lightness (0-100)
   * @returns {string} Hex color code
   */
  const HSLToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    // Convert RGB to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Add zero if length is 1
    if (r.length === 1) r = "0" + r;
    if (g.length === 1) g = "0" + g;
    if (b.length === 1) b = "0" + b;

    return "#" + r + g + b;
  };

  /**
   * Creates a harmonious color palette based on a base color
   * @param {string} baseColor - Starting hex color
   * @param {number} count - Number of colors to generate
   * @returns {Array} Array of hex color codes
   */
  const generateHarmoniousPalette = (baseColor, count) => {
    const colors = [baseColor];
    const hsl = hexToHSL(baseColor);

    // Golden angle approximation (137.5°) creates visually pleasing distribution
    const goldenAngle = 137.5;

    for (let i = 1; i < count; i++) {
      // Rotate the hue around the color wheel using the golden angle
      let newHue = (hsl.h + goldenAngle * i) % 360;

      // Vary the saturation and lightness slightly for visual interest
      let newSat = Math.max(30, Math.min(95, hsl.s + (Math.random() * 20 - 10)));
      let newLight = Math.max(35, Math.min(75, hsl.l + (Math.random() * 20 - 10)));

      // Generate new color and add to array
      colors.push(HSLToHex(newHue, newSat, newLight));
    }

    return colors;
  };

  /**
   * Shows a toast notification with a message
   * @param {string} message - The message to display
   */
  const showToast = (message) => {
    toastMessage.textContent = message;
    toast.classList.add("active");

    // Hide the toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("active");
    }, 3000);
  };

  /**
   * Copies text to clipboard
   * @param {string} text - Text to copy
   */
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
      showToast("Failed to copy. Try again!");
      console.error("Failed to copy: ", err);
    }
  };

  /**
   * Checks if a color is light or dark to determine text color
   * @param {string} color - Hex color code
   * @returns {boolean} True if color is light
   */
  const isLightColor = (color) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Using relative luminance formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6; // If luminance > 0.6, it's a light color
  };

  // --------------- MAIN FUNCTIONS ---------------

  /**
   * Generates a new color palette
   */
  const generatePalette = () => {
    const colorCount = parseInt(colorCountInput.value) || 5;
    currentPalette = [];

    if (isHarmonyMode) {
      // In harmony mode, start with one random color and create related colors
      const baseColor = generateRandomColor();
      currentPalette = generateHarmoniousPalette(baseColor, colorCount);
    } else {
      // In random mode, all colors are completely random
      for (let i = 0; i < colorCount; i++) {
        currentPalette.push(generateRandomColor());
      }
    }

    renderPalette();
  };

  /**
   * Renders the current palette to the DOM
   */
  const renderPalette = () => {
    // Clear existing palette
    paletteContainer.innerHTML = "";

    // Create a panel for each color
    currentPalette.forEach((color) => {
      const panel = document.createElement("div");
      panel.className = "color-panel";
      panel.style.backgroundColor = color;

      // Determine if we should use black or white text based on background color
      const textColor = isLightColor(color) ? "#333" : "#fff";

      // Add color code and instructions
      panel.innerHTML = `
                <div class="color-code" style="color: ${textColor}">${color}</div>
                <div class="color-copy" style="color: ${textColor}">Click to copy</div>
            `;

      // Add click event to copy color code
      panel.addEventListener("click", () => {
        copyToClipboard(color);
      });

      // Add animation class
      panel.style.animation = "fadeIn 0.6s ease-in-out forwards";

      paletteContainer.appendChild(panel);
    });
  };

  /**
   * Saves the current palette
   */
  const savePalette = () => {
    if (currentPalette.length === 0) {
      showToast("Generate a palette first!");
      return;
    }

    // Create a new palette object with unique ID and timestamp
    const newPalette = {
      id: Date.now(),
      colors: [...currentPalette],
      date: new Date().toLocaleDateString(),
    };

    // Add to saved palettes array
    savedPalettes.push(newPalette);

    // Save to local storage
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));

    // Update the display
    renderSavedPalettes();

    showToast("Palette saved successfully!");
  };

  /**
   * Renders all saved palettes to the DOM
   */
  const renderSavedPalettes = () => {
    // If there are no saved palettes, show a message
    if (savedPalettes.length === 0) {
      savedPalettesList.innerHTML = `
                <p class="empty-message">No saved palettes yet. Generate and save some!</p>
            `;
      return;
    }

    // Clear the container
    savedPalettesList.innerHTML = "";

    // Create elements for each saved palette
    savedPalettes.forEach((palette) => {
      const paletteElement = document.createElement("div");
      paletteElement.className = "saved-palette";
      paletteElement.setAttribute("data-id", palette.id);

      // Create the color bar
      const colorsElement = document.createElement("div");
      colorsElement.className = "saved-palette-colors";

      // Add each color in the palette
      palette.colors.forEach((color) => {
        const colorElement = document.createElement("div");
        colorElement.className = "saved-palette-color";
        colorElement.style.backgroundColor = color;
        colorElement.setAttribute("data-color", color);

        // Click to copy color
        colorElement.addEventListener("click", () => {
          copyToClipboard(color);
        });

        colorsElement.appendChild(colorElement);
      });

      // Add footer with date and delete button
      const footer = document.createElement("div");
      footer.className = "saved-palette-footer";
      footer.innerHTML = `
                <div class="saved-palette-date">${palette.date}</div>
                <button class="delete-palette" data-id="${palette.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;

      // Append all elements together
      paletteElement.appendChild(colorsElement);
      paletteElement.appendChild(footer);

      // Add click handler for delete button
      paletteElement.querySelector(".delete-palette").addEventListener("click", (e) => {
        e.stopPropagation();
        deletePalette(palette.id);
      });

      // Click on palette to load it
      colorsElement.addEventListener("click", (e) => {
        // Only load if we clicked on the container, not a specific color
        if (e.target === colorsElement) {
          loadPalette(palette.id);
        }
      });

      savedPalettesList.appendChild(paletteElement);
    });
  };

  /**
   * Deletes a saved palette
   * @param {number} id - Palette ID to delete
   */
  const deletePalette = (id) => {
    // Filter out the palette with matching id
    savedPalettes = savedPalettes.filter((palette) => palette.id !== id);

    // Update localStorage
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));

    // Update the display
    renderSavedPalettes();

    showToast("Palette deleted!");
  };

  /**
   * Loads a saved palette as the current palette
   * @param {number} id - ID of palette to load
   */
  const loadPalette = (id) => {
    const palette = savedPalettes.find((p) => p.id === id);
    if (palette) {
      currentPalette = [...palette.colors];
      renderPalette();
      showToast("Palette loaded!");

      // Update the color count input to match
      colorCountInput.value = palette.colors.length;
    }
  };

  /**
   * Initializes the application
   */
  const init = () => {
    // Set the current year in the footer
    document.getElementById("current-year").textContent = new Date().getFullYear();

    // Load saved palettes from localStorage
    const savedPalettesData = localStorage.getItem("savedPalettes");
    if (savedPalettesData) {
      savedPalettes = JSON.parse(savedPalettesData);
      renderSavedPalettes();
    }

    // Generate initial palette
    generatePalette();

    // Set up event listeners
    generateBtn.addEventListener("click", generatePalette);
    saveBtn.addEventListener("click", savePalette);

    colorCountInput.addEventListener("change", () => {
      // Limit color count between 2 and 8
      const value = parseInt(colorCountInput.value);
      colorCountInput.value = Math.min(8, Math.max(2, value));
      generatePalette();
    });

    modeToggleInput.addEventListener("change", () => {
      isHarmonyMode = modeToggleInput.checked;
      modeLabel.textContent = isHarmonyMode ? "Harmony Mode" : "Random Mode";
      generatePalette();
    });
  };

  // Initialize the app
  init();
});
