/**
 * SketchPad - Interactive Drawing Board
 * A fun drawing application for beginner/intermediate JavaScript learners
 */

// Wait for the DOM to fully load before executing code
document.addEventListener("DOMContentLoaded", function () {
  // ================= SETUP VARIABLES =================

  // Get DOM elements we'll be working with
  const canvas = document.getElementById("drawing-board");
  const context = canvas.getContext("2d");
  const brushSizeSlider = document.getElementById("brush-size");
  const sizeDisplay = document.getElementById("size-display");
  const clearBtn = document.getElementById("clear-btn");
  const saveBtn = document.getElementById("save-btn");
  const eraserBtn = document.getElementById("eraser-btn");
  const colorPicker = document.getElementById("color-picker");
  const colorOptions = document.querySelectorAll(".color-option");
  const messageElement = document.getElementById("message");
  const messageText = document.getElementById("message-text");
  const galleryItems = document.getElementById("gallery-items");

  // Set up drawing variables
  let isDrawing = false;
  let brushSize = 10;
  let currentColor = "#000000";
  let lastX = 0;
  let lastY = 0;
  let isEraser = false;

  // Store gallery items (for recent sketches)
  let galleryArray = [];

  // ================= INITIALIZE APP =================

  // Set the current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // Set canvas size based on screen size
  function initializeCanvas() {
    // Make the canvas responsive
    const containerWidth = canvas.parentElement.clientWidth;

    // Set canvas dimensions (with a max width/height)
    const canvasWidth = Math.min(800, containerWidth);
    const canvasHeight = Math.min(600, window.innerHeight * 0.6);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Set canvas background
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Load saved gallery items from localStorage
  function loadGallery() {
    const savedGallery = localStorage.getItem("sketchpad-gallery");
    if (savedGallery) {
      galleryArray = JSON.parse(savedGallery);
      renderGallery();
    }
  }

  // Initialize the app
  function init() {
    initializeCanvas();
    loadGallery();

    // Display current brush size
    sizeDisplay.textContent = brushSize + "px";
  }

  // Call initialization
  init();

  // ================= DRAWING FUNCTIONS =================

  // Start drawing when mouse is pressed down
  function startDrawing(e) {
    isDrawing = true;

    // Get current position
    [lastX, lastY] = getPointerPosition(e);
  }

  // Draw as mouse moves
  function draw(e) {
    // Don't draw if not in drawing mode
    if (!isDrawing) return;

    // Prevent scrolling on touch devices
    e.preventDefault();

    // Get current position
    const [x, y] = getPointerPosition(e);

    // Set up the brush style
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = brushSize;

    // Set color based on eraser or drawing mode
    if (isEraser) {
      context.strokeStyle = "#ffffff";
      context.globalCompositeOperation = "destination-out";
    } else {
      context.strokeStyle = currentColor;
      context.globalCompositeOperation = "source-over";
    }

    // Draw line from last position to current position
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();

    // Update last position
    [lastX, lastY] = [x, y];
  }

  // Stop drawing when mouse is released or leaves canvas
  function stopDrawing() {
    isDrawing = false;
  }

  // Helper function to get pointer position for both mouse and touch
  function getPointerPosition(e) {
    let x, y;

    // Check if it's a touch event
    if (e.touches && e.touches[0]) {
      // Get touch coordinates
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Get mouse coordinates
      x = e.offsetX;
      y = e.offsetY;
    }

    return [x, y];
  }

  // Clear the canvas
  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    showMessage("Canvas cleared");
  }

  // Save the drawing as an image
  function saveDrawing() {
    // Convert canvas to data URL
    const dataURL = canvas.toDataURL("image/png");

    // Create a new gallery item
    const newItem = {
      id: Date.now(),
      image: dataURL,
      date: new Date().toLocaleDateString(),
    };

    // Add to gallery array (at the beginning)
    galleryArray.unshift(newItem);

    // Limit to 6 most recent drawings
    if (galleryArray.length > 6) {
      galleryArray = galleryArray.slice(0, 6);
    }

    // Save to local storage
    localStorage.setItem("sketchpad-gallery", JSON.stringify(galleryArray));

    // Update gallery display
    renderGallery();

    // Show success message
    showMessage("Drawing saved to gallery");
  }

  // ================= UI INTERACTION =================

  // Change brush size
  function changeBrushSize() {
    brushSize = parseInt(brushSizeSlider.value);
    sizeDisplay.textContent = brushSize + "px";
  }

  // Change color
  function changeColor(newColor) {
    currentColor = newColor;
    colorPicker.value = newColor;

    // Turn off eraser mode
    isEraser = false;
    eraserBtn.classList.remove("active");

    // Update active color
    colorOptions.forEach((option) => {
      if (option.dataset.color === newColor) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });
  }

  // Toggle eraser mode
  function toggleEraser() {
    isEraser = !isEraser;

    if (isEraser) {
      eraserBtn.classList.add("active");
    } else {
      eraserBtn.classList.remove("active");
    }
  }

  // Show message notification
  function showMessage(text) {
    messageText.textContent = text;
    messageElement.classList.add("show");

    // Hide message after 2 seconds
    setTimeout(() => {
      messageElement.classList.remove("show");
    }, 2000);
  }

  // Render gallery items
  function renderGallery() {
    if (galleryArray.length === 0) {
      galleryItems.innerHTML =
        '<p class="empty-gallery">Your saved sketches will appear here</p>';
      return;
    }

    // Clear gallery container
    galleryItems.innerHTML = "";

    // Add each gallery item
    galleryArray.forEach((item) => {
      const galleryItem = document.createElement("div");
      galleryItem.className = "gallery-item";
      galleryItem.innerHTML = `
                <img src="${item.image}" alt="Sketch" loading="lazy">
                <button class="delete-sketch" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;

      galleryItems.appendChild(galleryItem);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-sketch").forEach((btn) => {
      btn.addEventListener("click", deleteGalleryItem);
    });
  }

  // Delete gallery item
  function deleteGalleryItem(e) {
    const id = parseInt(e.currentTarget.dataset.id);

    // Filter out the item with matching id
    galleryArray = galleryArray.filter((item) => item.id !== id);

    // Save updated gallery to local storage
    localStorage.setItem("sketchpad-gallery", JSON.stringify(galleryArray));

    // Update gallery display
    renderGallery();

    // Show message
    showMessage("Sketch deleted");
  }

  // ================= EVENT LISTENERS =================

  // Mouse events for drawing
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  // Touch events for mobile devices
  canvas.addEventListener("touchstart", startDrawing);
  canvas.addEventListener("touchmove", draw);
  canvas.addEventListener("touchend", stopDrawing);

  // UI Control events
  brushSizeSlider.addEventListener("input", changeBrushSize);
  clearBtn.addEventListener("click", clearCanvas);
  saveBtn.addEventListener("click", saveDrawing);
  eraserBtn.addEventListener("click", toggleEraser);

  // Color selection events
  colorPicker.addEventListener("input", (e) => {
    const newColor = e.target.value;
    changeColor(newColor);

    // Remove active class from preset colors
    colorOptions.forEach((option) => {
      option.classList.remove("active");
    });
  });

  // Preset color selection
  colorOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const newColor = option.dataset.color;
      changeColor(newColor);
    });
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    // Save the current drawing
    const currentDrawing = canvas.toDataURL();

    // Resize canvas
    initializeCanvas();

    // Restore drawing
    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = currentDrawing;
  });
});
