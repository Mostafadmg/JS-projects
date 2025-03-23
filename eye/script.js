// Step 1: Select all elements that have the "eye" class
const eyes = document.querySelectorAll(".eye");

// Step 2: Add a mousemove event listener to the document
document.addEventListener("mousemove", (event) => {
  // Get the current mouse cursor coordinates
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // For each eye, rotate its pupil to face the cursor
  eyes.forEach((eye) => {
    // Obtain the eye's size and position on the page
    const eyeRect = eye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    // Calculate the angle (in radians) between the eye center and the mouse position
    const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);

    // Convert the angle from radians to degrees
    const angleDeg = (angle * 180) / Math.PI;

    // Find the pupil inside this eye
    const pupil = eye.querySelector(".pupil");

    // Apply a rotation based on the angle, and move the pupil slightly outward (translateX)
    pupil.style.transform = `rotate(${angleDeg}deg) translateX(12px)`;
  });
});
