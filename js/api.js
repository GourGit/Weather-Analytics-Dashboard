const apiKey = "913afb564b551887620e8b28754d1400";
const base = "https://api.openweathermap.org/data/2.5";

/* Common API fetch function */
async function fetchData(url, errorMessage) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      const data = await res.json();

      if (res.status === 401) {
        throw new Error("Invalid API key. Please check your OpenWeather API key.");
      }

      if (res.status === 404) {
        throw new Error("City not found. Please enter a valid city name.");
      }

      throw new Error(data.message || errorMessage);
    }

    return await res.json();

  } catch (error) {
    if (error.name === "TypeError") {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw error;
  }
}

/* Current weather */
async function fetchWeather(city) {
  if (!apiKey || apiKey === "PASTE_YOUR_OPENWEATHER_API_KEY_HERE") {
    throw new Error("Please add your OpenWeather API key in api.js.");
  }

  const url = `${base}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  return await fetchData(url, "Unable to fetch weather data.");
}

/* Forecast */
async function fetchForecast(city) {
  if (!apiKey || apiKey === "PASTE_YOUR_OPENWEATHER_API_KEY_HERE") {
    throw new Error("Please add your OpenWeather API key in api.js.");
  }

  const url = `${base}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  return await fetchData(url, "Unable to fetch forecast data.");
}

/* Air quality */
async function fetchAQI(lat, lon) {
  if (!apiKey || apiKey === "PASTE_YOUR_OPENWEATHER_API_KEY_HERE") {
    throw new Error("Please add your OpenWeather API key in api.js.");
  }

  const url = `${base}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  return await fetchData(url, "Unable to fetch air quality data.");
}