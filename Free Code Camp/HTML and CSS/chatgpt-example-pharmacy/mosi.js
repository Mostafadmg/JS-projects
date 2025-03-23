// JavaScript for Enhanced Interactivity and Animations

// Smooth Scroll for Internal Links
document.querySelectorAll("a.nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").slice(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Dropdown Menu Animation
const dropdown = document.querySelector(".dropdown");
const dropdownContent = document.querySelector(".dropdown-content");

dropdown.addEventListener("mouseenter", () => {
  dropdownContent.style.display = "block";
  dropdownContent.style.opacity = 0;
  dropdownContent.style.transition = "opacity 0.5s ease-in-out";
  setTimeout(() => (dropdownContent.style.opacity = 1), 50);
});

dropdown.addEventListener("mouseleave", () => {
  dropdownContent.style.opacity = 0;
  setTimeout(() => (dropdownContent.style.display = "none"), 500);
});

// Hero Section Text Animation
const heroText = document.querySelector(".hero-content h2");
const heroSubText = document.querySelector(".hero-content p");

window.addEventListener("load", () => {
  heroText.style.opacity = 0;
  heroSubText.style.opacity = 0;
  heroText.style.transition = "opacity 1s ease-in-out";
  heroSubText.style.transition = "opacity 1.5s ease-in-out";
  setTimeout(() => (heroText.style.opacity = 1), 500);
  setTimeout(() => (heroSubText.style.opacity = 1), 1000);
});

// Scroll-triggered Animations for Services Section
const serviceCards = document.querySelectorAll(".service-card");

window.addEventListener("scroll", () => {
  serviceCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      card.style.transform = "translateY(0)";
      card.style.opacity = 1;
      card.style.transition = "transform 0.7s ease-out, opacity 0.7s ease-out";
    }
  });
});

// Initialize service cards off-screen
serviceCards.forEach((card) => {
  card.style.transform = "translateY(100px)";
  card.style.opacity = 0;
});

// Back-to-top Button
const backToTop = document.createElement("button");
backToTop.textContent = "⬆️";
backToTop.classList.add("back-to-top");
document.body.appendChild(backToTop);

backToTop.style.position = "fixed";
backToTop.style.bottom = "20px";
backToTop.style.right = "20px";
backToTop.style.padding = "10px 15px";
backToTop.style.fontSize = "1.5rem";
backToTop.style.border = "none";
backToTop.style.backgroundColor = "#4CAF50";
backToTop.style.color = "#fff";
backToTop.style.borderRadius = "50%";
backToTop.style.cursor = "pointer";
backToTop.style.display = "none";
backToTop.style.transition = "opacity 0.5s";

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    backToTop.style.display = "block";
    backToTop.style.opacity = 1;
  } else {
    backToTop.style.opacity = 0;
    setTimeout(() => (backToTop.style.display = "none"), 500);
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
