// Global variables
let apiKey = "YOUR_OPENWEATHER_API_KEY"; // Replace with your API key
let currentUnit = "metric"; // 'metric' for Celsius, 'imperial' for Fahrenheit
let currentCity = "New York";
let weatherData = null;
let forecastData = null;

// DOM elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const settingsBtn = document.getElementById("settings-btn");
const locationBtn = document.getElementById("location-btn");
const settingsPanel = document.getElementById("settings-panel");
const unitsToggle = document.getElementById("units-toggle");
const animationToggle = document.getElementById("animation-toggle");
const qualityBtns = document.querySelectorAll(".quality-btn");
const loadingOverlay = document.getElementById("loading-overlay");

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Event listeners
  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
  settingsBtn.addEventListener("click", toggleSettingsPanel);
  locationBtn.addEventListener("click", getUserLocation);
  unitsToggle.addEventListener("change", toggleUnits);
  animationToggle.addEventListener("change", toggleAnimations);

  // Initialize quality buttons
  qualityBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setQuality(btn.dataset.quality);
      // Update active button
      qualityBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Get initial weather data
  getWeatherData(currentCity);

  // Initialize date
  updateDate();
});

// Handle search functionality
function handleSearch() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    showLoading();
    getWeatherData(searchTerm);
  }
}

// Get user's location
function getUserLocation() {
  if (navigator.geolocation) {
    showLoading();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        hideLoading();
        alert(`Couldn't get your location: ${error.message}`);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Toggle settings panel
function toggleSettingsPanel() {
  settingsPanel.classList.toggle("active");
}

// Toggle temperature units
function toggleUnits() {
  currentUnit = unitsToggle.checked ? "imperial" : "metric";
  if (weatherData) {
    updateWeatherUI(weatherData, forecastData);
  }
}

// Toggle animations
function toggleAnimations() {
  const isEnabled = animationToggle.checked;
  window.weatherScene.toggleAnimations(isEnabled);
}

// Set render quality
function setQuality(quality) {
  window.weatherScene.setQuality(quality);
}

// Get weather data from API
async function getWeatherData(city) {
  try {
    // Get current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`
    );

    if (!weatherResponse.ok) {
      throw new Error("City not found");
    }

    weatherData = await weatherResponse.json();

    // Get forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude=minutely,hourly,alerts&units=${currentUnit}&appid=${apiKey}`
    );

    if (!forecastResponse.ok) {
      throw new Error("Forecast data not available");
    }

    forecastData = await forecastResponse.json();

    // Update UI
    updateWeatherUI(weatherData, forecastData);

    // Update 3D scene
    window.weatherScene.updateWeatherScene(
      weatherData.weather[0].main,
      weatherData.weather[0].id
    );

    // Update current city
    currentCity = weatherData.name;

    hideLoading();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    hideLoading();
    alert(`Couldn't find weather data for "${city}". Please try another location.`);
  }
}

// Get weather by coordinates
async function getWeatherByCoords(lat, lon) {
  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`
    );

    if (!weatherResponse.ok) {
      throw new Error("Weather data not available");
    }

    weatherData = await weatherResponse.json();

    // Get forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${currentUnit}&appid=${apiKey}`
    );

    if (!forecastResponse.ok) {
      throw new Error("Forecast data not available");
    }

    forecastData = await forecastResponse.json();

    // Update UI
    updateWeatherUI(weatherData, forecastData);

    // Update 3D scene
    window.weatherScene.updateWeatherScene(
      weatherData.weather[0].main,
      weatherData.weather[0].id
    );

    // Update current city
    currentCity = weatherData.name;
    searchInput.value = currentCity;

    hideLoading();
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    hideLoading();
    alert("Couldn't fetch weather data for your location. Please try again.");
  }
}

// Update weather UI
function updateWeatherUI(weather, forecast) {
  // Update current weather
  document.getElementById("city").textContent = weather.name;
  document.getElementById("condition").textContent = weather.weather[0].main;
  document.getElementById("temperature").textContent = `${Math.round(
    weather.main.temp
  )}°`;
  document.getElementById("temp-high").textContent = `High: ${Math.round(
    weather.main.temp_max
  )}°`;
  document.getElementById("temp-low").textContent = `Low: ${Math.round(
    weather.main.temp_min
  )}°`;

  // Update weather details
  document.getElementById("wind").textContent =
    currentUnit === "metric"
      ? `${Math.round(weather.wind.speed * 3.6)} km/h` // Convert m/s to km/h
      : `${Math.round(weather.wind.speed)} mph`;
  document.getElementById("humidity").textContent = `${weather.main.humidity}%`;
  document.getElementById("pressure").textContent = `${weather.main.pressure} hPa`;
  document.getElementById("uv-index").textContent =
    forecast?.current?.uvi?.toFixed(1) || "N/A";

  // Update forecast
  if (forecast && forecast.daily) {
    updateForecast(forecast.daily);
  }
}

// Update forecast section
function updateForecast(dailyForecast) {
  const forecastContainer = document.getElementById("forecast-list");
  forecastContainer.innerHTML = "";

  // Only use 7 days
  const forecastDays = dailyForecast.slice(0, 7);

  forecastDays.forEach((day, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";

    const dayName = index === 0 ? "Today" : getDayName(date);

    const weatherIcon = getWeatherIcon(day.weather[0].id);

    forecastItem.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="forecast-icon">${weatherIcon}</div>
            <div class="forecast-temp">${Math.round(day.temp.day)}°</div>
        `;

    forecastContainer.appendChild(forecastItem);
  });
}

// Get day name
function getDayName(date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

// Update date display
function updateDate() {
  const date = new Date();
  const options = { weekday: "long", day: "numeric", month: "long" };
  document.getElementById("date").textContent = date.toLocaleDateString("en-US", options);
}

// Get weather icon based on condition code
function getWeatherIcon(conditionCode) {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (conditionCode >= 200 && conditionCode < 300) {
    return '<i class="fas fa-bolt"></i>'; // Thunderstorm
  } else if (conditionCode >= 300 && conditionCode < 400) {
    return '<i class="fas fa-cloud-rain"></i>'; // Drizzle
  } else if (conditionCode >= 500 && conditionCode < 600) {
    return '<i class="fas fa-cloud-showers-heavy"></i>'; // Rain
  } else if (conditionCode >= 600 && conditionCode < 700) {
    return '<i class="fas fa-snowflake"></i>'; // Snow
  } else if (conditionCode >= 700 && conditionCode < 800) {
    return '<i class="fas fa-smog"></i>'; // Atmosphere (fog, haze, etc)
  } else if (conditionCode === 800) {
    return '<i class="fas fa-sun"></i>'; // Clear
  } else {
    return '<i class="fas fa-cloud"></i>'; // Clouds
  }
}

// Show loading overlay
function showLoading() {
  loadingOverlay.classList.add("active");
}

// Hide loading overlay
function hideLoading() {
  loadingOverlay.classList.remove("active");
}
