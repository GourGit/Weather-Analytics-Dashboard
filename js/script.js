// js/script.js

const isLoggedIn =
  localStorage.getItem("weatherUserLoggedIn") === "true" ||
  sessionStorage.getItem("weatherUserLoggedIn") === "true";

if (!isLoggedIn) {
  window.location.href = "index.html";
}

async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const city = cityInput.value.trim();

  if (!city) {
    showMessage("Please enter a city name");
    cityInput.focus();
    return;
  }

  setLoadingState(true);

  try {
    const weather = await fetchWeather(city);
    const forecast = await fetchForecast(city);

    updateWeatherUI(weather);
    createTemperatureChart(forecast);

    const aqi = await fetchAQI(weather.coord.lat, weather.coord.lon);
    updateAQI(aqi);

    generateInsight(weather, aqi);

    cityInput.value = "";

  } catch (err) {
    showMessage(err.message || "Something went wrong. Please try again.");
  } finally {
    setLoadingState(false);
  }
}

function updateWeatherUI(weather) {
  document.getElementById("temp").innerText =
    Math.round(weather.main.temp) + "°C";

  document.getElementById("humidity").innerText =
    weather.main.humidity + "%";

  document.getElementById("wind").innerText =
    Math.round(weather.wind.speed) + " km/h";

  document.getElementById("cityName").innerText =
    weather.name;

  document.getElementById("description").innerText =
    weather.weather[0].description;

  updateWeatherIcon(weather.weather[0].main);

  updateDynamicBackground(weather);
}

function updateAQI(aqi) {
  const level = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  const aqiValue = aqi.list[0].main.aqi;

  document.getElementById("aqi").innerText = level[aqiValue - 1];
}

function generateInsight(weather, aqi) {
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;
  const condition = weather.weather[0].main;
  const aqiValue = aqi.list[0].main.aqi;

  let insight = "";

  if (condition === "Rain" || condition === "Drizzle") {
    insight = "Rainy weather detected. Carry an umbrella and avoid unnecessary outdoor travel.";
  } else if (condition === "Thunderstorm") {
    insight = "Thunderstorm conditions detected. Stay indoors and avoid open areas.";
  } else if (temp >= 35) {
    insight = "High temperature detected. Stay hydrated and avoid direct sunlight for long hours.";
  } else if (humidity > 80) {
    insight = "Humidity is very high, so rain or discomfort may occur soon.";
  } else if (wind > 10) {
    insight = "Wind speed is slightly high. Outdoor movement may feel breezy.";
  } else {
    insight = "Weather conditions look stable and comfortable right now.";
  }

  if (aqiValue >= 4) {
    insight += " Air quality is poor, so wearing a mask outdoors is recommended.";
  } else if (aqiValue === 1) {
    insight += " Air quality is good today.";
  }

  document.getElementById("insight").innerText = insight;
}

function updateWeatherIcon(condition) {
  const weatherGraphic = document.querySelector(".weather-graphic i");
  const descIcon = document.querySelector(".desc-icon i");

  if (!weatherGraphic || !descIcon) return;

  let iconClass = "fa-solid fa-cloud-sun";

  if (condition === "Clear") {
    iconClass = "fa-solid fa-sun";
  } else if (condition === "Clouds") {
    iconClass = "fa-solid fa-cloud";
  } else if (condition === "Rain" || condition === "Drizzle") {
    iconClass = "fa-solid fa-cloud-rain";
  } else if (condition === "Thunderstorm") {
    iconClass = "fa-solid fa-cloud-bolt";
  } else if (condition === "Snow") {
    iconClass = "fa-solid fa-snowflake";
  } else if (
    condition === "Mist" ||
    condition === "Fog" ||
    condition === "Haze" ||
    condition === "Smoke"
  ) {
    iconClass = "fa-solid fa-smog";
  }

  weatherGraphic.className = iconClass;
  descIcon.className = iconClass;
}

function updateDynamicBackground(weather) {
  const body = document.body;
  const animationBox = document.getElementById("weatherAnimation");

  body.classList.remove(
    "sunny-bg",
    "cloudy-bg",
    "rainy-bg",
    "storm-bg",
    "snow-bg",
    "mist-bg",
    "night-bg"
  );

  animationBox.className = "weather-animation";
  animationBox.innerHTML = "";

  const condition = weather.weather[0].main;
  const currentTime = weather.dt;
  const sunrise = weather.sys.sunrise;
  const sunset = weather.sys.sunset;

  const isNight = currentTime < sunrise || currentTime > sunset;

  if (isNight) {
    body.classList.add("night-bg");
    animationBox.classList.add("stars-animation");
    createStars(animationBox);
    return;
  }

  if (condition === "Clear") {
    body.classList.add("sunny-bg");
    animationBox.classList.add("sun-animation");
    animationBox.innerHTML = `<div class="sun"></div>`;
  }

  else if (condition === "Clouds") {
    body.classList.add("cloudy-bg");
    animationBox.classList.add("cloud-animation");
    animationBox.innerHTML = `
      <div class="cloud cloud1"></div>
      <div class="cloud cloud2"></div>
      <div class="cloud cloud3"></div>
    `;
  }

  else if (condition === "Rain" || condition === "Drizzle") {
    body.classList.add("rainy-bg");
    animationBox.classList.add("rain-animation");
    createRain(animationBox);
  }

  else if (condition === "Thunderstorm") {
    body.classList.add("storm-bg");
    animationBox.classList.add("storm-animation");
    createRain(animationBox);
  }

  else if (condition === "Snow") {
    body.classList.add("snow-bg");
    animationBox.classList.add("snow-animation");
    createSnow(animationBox);
  }

  else if (
    condition === "Mist" ||
    condition === "Fog" ||
    condition === "Haze" ||
    condition === "Smoke"
  ) {
    body.classList.add("mist-bg");
    animationBox.classList.add("mist-animation");
    animationBox.innerHTML = `
      <div class="fog fog1"></div>
      <div class="fog fog2"></div>
      <div class="fog fog3"></div>
    `;
  }

  else {
    body.classList.add("sunny-bg");
    animationBox.classList.add("sun-animation");
    animationBox.innerHTML = `<div class="sun"></div>`;
  }
}

function createRain(container) {
  for (let i = 0; i < 70; i++) {
    const drop = document.createElement("span");

    drop.className = "raindrop";
    drop.style.left = Math.random() * 100 + "vw";
    drop.style.animationDuration = 0.5 + Math.random() * 0.7 + "s";
    drop.style.animationDelay = Math.random() * 2 + "s";

    container.appendChild(drop);
  }
}

function createSnow(container) {
  for (let i = 0; i < 55; i++) {
    const snow = document.createElement("span");

    snow.className = "snowflake";
    snow.style.left = Math.random() * 100 + "vw";
    snow.style.animationDuration = 4 + Math.random() * 5 + "s";
    snow.style.animationDelay = Math.random() * 4 + "s";
    snow.style.opacity = Math.random();

    container.appendChild(snow);
  }
}

function createStars(container) {
  for (let i = 0; i < 80; i++) {
    const star = document.createElement("span");

    star.className = "star";
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = Math.random() * 3 + "s";

    container.appendChild(star);
  }
}

function setLoadingState(isLoading) {
  const button = document.querySelector(".search button");

  if (!button) return;

  if (isLoading) {
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Loading...`;
    button.disabled = true;

    document.getElementById("insight").innerText =
      "Fetching latest weather data...";
  } else {
    button.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Search`;
    button.disabled = false;
  }
}

function showMessage(message) {
  const oldToast = document.querySelector(".toast-message");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function logoutUser() {
  localStorage.removeItem("weatherUserLoggedIn");
  sessionStorage.removeItem("weatherUserLoggedIn");

  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");

  cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      getWeather();
    }
  });

  cityInput.value = "Kolkata";
  getWeather();
});