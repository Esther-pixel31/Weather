function fetchWeather(city) {
    console.log("Fetching weather for:", city);

    // Fetch latitude & longitude from Open-Meteo Geocoding API
    let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    axios.get(geoUrl)
        .then((geoResponse) => {
            console.log("Geo Data:", geoResponse.data);

            if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
                alert("City not found. Please try again.");
                return;
            }

            const { latitude, longitude } = geoResponse.data.results[0];

            // Fetch current weather & 5-day forecast
            let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

            return axios.get(weatherUrl);
        })
        .then((weatherResponse) => {
            if (!weatherResponse || !weatherResponse.data.current || !weatherResponse.data.daily) {
                alert("Weather data unavailable. Try another city.");
                return;
            }

            console.log("Weather Data:", weatherResponse.data);
            updateWeatherUI(weatherResponse.data.current, city);
            updateForecastUI(weatherResponse.data.daily);
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            alert("Failed to retrieve weather data. Please try again later.");
        });
}
// Function to update the current weather UI
function updateWeatherUI(data, city) {
    // Ensure elements exist before updating
    const cityElement = document.querySelector("#current-city");
    const temperatureElement = document.querySelector("#current-temperature");
    const humidityElement = document.querySelector("#humidity");
    const windElement = document.querySelector("#wind");
    const weatherIconElement = document.querySelector("#weather-icon-img");
    const dateElement = document.querySelector("#current-date");

    if (!cityElement || !temperatureElement || !humidityElement || !windElement || !weatherIconElement || !dateElement) {
        console.error("One or more elements are missing from the DOM.");
        return;
    }

    // Convert temperature to whole number
    const roundedTemp = Math.round(data.temperature_2m);

    // Update text content
    cityElement.textContent = city;
    temperatureElement.textContent = `${roundedTemp}`;  
    humidityElement.innerHTML = `Humidity: <strong>${data.relative_humidity_2m}%</strong>`;
    windElement.innerHTML = `Wind: <strong>${data.windspeed_10m} km/h</strong>`;
    
    // Get and update weather icon
    const weatherIconUrl = getWeatherIcon(data.weathercode);
    weatherIconElement.src = weatherIconUrl;
    weatherIconElement.alt = "Weather Icon";

    // Update date & time
    dateElement.textContent = formatDate(new Date());
}

// Function to update the 5-day forecast UI
function updateForecastUI(dailyData) {
    const forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = ""; // Clear previous forecast

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    dailyData.time.forEach((date, index) => {
        if (index >= 5) return; // Only show 5 days

        const day = new Date(date).getDay();
        const maxTemp = Math.round(dailyData.temperature_2m_max[index]);
        const minTemp = Math.round(dailyData.temperature_2m_min[index]);
        const weatherCode = dailyData.weathercode[index];

        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");

        forecastCard.innerHTML = `
            <p class="forecast-day">${days[day]}</p>
            <img src="${getWeatherIcon(weatherCode)}" alt="Weather Icon" class="forecast-icon">
            <p class="forecast-temp">${maxTemp}°C / ${minTemp}°C</p>
        `;

        forecastElement.appendChild(forecastCard);
    });
}

// Function to get weather icons from Icons8 based on Open-Meteo weather codes
function getWeatherIcon(code) {
    const icons = {
        0: "https://img.icons8.com/color/96/000000/sun.png", // Clear sky
        1: "https://img.icons8.com/color/96/000000/partly-cloudy-day.png", // Partly cloudy
        2: "https://img.icons8.com/color/96/000000/clouds.png", // Cloudy
        3: "https://img.icons8.com/color/96/000000/clouds.png", // Overcast
        4: "https://img.icons8.com/color/96/000000/clouds.png", // Very cloudy
        5: "https://img.icons8.com/color/96/000000/fog-day.png", // Foggy
        6: "https://img.icons8.com/color/96/000000/fog-night.png", // Foggy night
        7: "https://img.icons8.com/color/96/000000/snow.png", // Snow falling
        8: "https://img.icons8.com/color/96/000000/snow-night.png", // Snow falling at night
        9: "https://img.icons8.com/color/96/000000/snow.png", // Snow, heavy
        10: "https://img.icons8.com/color/96/000000/partly-cloudy-night.png", // Partly cloudy at night
        11: "https://img.icons8.com/color/96/000000/thunderstorm.png", // Thunderstorm
        12: "https://img.icons8.com/color/96/000000/thunderstorm.png", // Thunderstorm with rain
        13: "https://img.icons8.com/color/96/000000/snow.png", // Snow with thunderstorms
        14: "https://img.icons8.com/color/96/000000/partly-cloudy-night.png", // Clear night
        15: "https://img.icons8.com/color/96/000000/sun.png", // Sun with clouds
        16: "https://img.icons8.com/color/96/000000/rain.png", // Heavy rain
        17: "https://img.icons8.com/color/96/000000/rain.png", // Light rain
        18: "https://img.icons8.com/color/96/000000/rain.png", // Showers
        19: "https://img.icons8.com/color/96/000000/rain.png", // Drizzle
        20: "https://img.icons8.com/color/96/000000/fog-day.png", // Mist
        21: "https://img.icons8.com/color/96/000000/fog-day.png", // Light fog
        22: "https://img.icons8.com/color/96/000000/fog-day.png", // Dense fog
        23: "https://img.icons8.com/color/96/000000/storm.png", // Violent storm
        24: "https://img.icons8.com/color/96/000000/storm.png", // Severe storm
        25: "https://img.icons8.com/color/96/000000/thunderstorm.png", // Thunderstorm (no rain)
        26: "https://img.icons8.com/color/96/000000/partly-cloudy-night.png", // Clear night with clouds
        27: "https://img.icons8.com/color/96/000000/partly-cloudy-night.png", // Partly cloudy night
        28: "https://img.icons8.com/color/96/000000/sun.png", // Sun
        29: "https://img.icons8.com/color/96/000000/sun.png", // Mostly sunny
        30: "https://img.icons8.com/color/96/000000/sun.png", // Sunny
        31: "https://img.icons8.com/color/96/000000/partly-cloudy-night.png", // Night with clear sky
        32: "https://img.icons8.com/color/96/000000/sun.png", // Clear sky with sun
        33: "https://img.icons8.com/color/96/000000/partly-cloudy-night.png", // Clear sky at night
        34: "https://img.icons8.com/color/96/000000/partly-cloudy-night.png", // Partly cloudy at night
        35: "https://img.icons8.com/color/96/000000/thunderstorm.png", // Thunderstorm with lightning
        36: "https://img.icons8.com/color/96/000000/fog-day.png", // Foggy weather
        37: "https://img.icons8.com/color/96/000000/fog-day.png", // Thick fog
        38: "https://img.icons8.com/color/96/000000/storm.png", // Storm
        39: "https://img.icons8.com/color/96/000000/storm.png", // Severe thunderstorms
        40: "https://img.icons8.com/color/96/000000/storm.png", // Thunderstorm with snow
        41: "https://img.icons8.com/color/96/000000/snow.png", // Snowfall with thunderstorm
        42: "https://img.icons8.com/color/96/000000/snow.png", // Snow with thunderstorm
        43: "https://img.icons8.com/color/96/000000/snow.png", // Snowstorm
        44: "https://img.icons8.com/color/96/000000/snow.png", // Snow with wind
        45: "https://img.icons8.com/color/96/000000/fog-day.png", // Dense fog with fog
        46: "https://img.icons8.com/color/96/000000/fog-day.png", // Foggy evening
        47: "https://img.icons8.com/color/96/000000/fog-day.png", // Foggy morning
        48: "https://img.icons8.com/color/96/000000/partly-cloudy-night.png", // Mostly clear sky at night
        49: "https://img.icons8.com/color/96/000000/partly-cloudy-night.png", // Nighttime clear sky
        50: "https://img.icons8.com/color/96/000000/unknown.png",  // Unknown weather
        51: "https://img.icons8.com/color/96/000000/light-rain.png", // Drizzle: Light
        53: "https://img.icons8.com/color/96/000000/rain.png", // Drizzle: Moderate
        55: "https://img.icons8.com/color/96/000000/heavy-rain.png", // Drizzle: Dense
        56: "https://img.icons8.com/color/96/000000/light-rain.png", // Freezing drizzle: Light
        57: "https://img.icons8.com/color/96/000000/heavy-rain.png", // Freezing drizzle: Dense
        61: "https://img.icons8.com/color/96/000000/rain.png", // Rain: Slight
        63: "https://img.icons8.com/color/96/000000/heavy-rain.png", // Rain: Moderate
        65: "https://img.icons8.com/color/96/000000/torrential-rain.png", // Rain: Heavy
        66: "https://img.icons8.com/color/96/000000/light-rain.png", // Freezing rain: Light
        67: "https://img.icons8.com/color/96/000000/heavy-rain.png", // Freezing rain: Heavy
        71: "https://img.icons8.com/color/96/000000/snow.png", // Snow: Slight
        73: "https://img.icons8.com/color/96/000000/snow.png", // Snow: Moderate
        75: "https://img.icons8.com/color/96/000000/snow-storm.png", // Snow: Heavy
        77: "https://img.icons8.com/color/96/000000/snow.png", // Snow grains
        80: "https://img.icons8.com/color/96/000000/rain.png", // Showers: Slight
        81: "https://img.icons8.com/color/96/000000/heavy-rain.png", // Showers: Moderate
        82: "https://img.icons8.com/color/96/000000/torrential-rain.png", // Showers: Heavy
        85: "https://img.icons8.com/color/96/000000/snow.png", // Snow showers: Slight
        86: "https://img.icons8.com/color/96/000000/snow-storm.png", // Snow showers: Heavy
        95: "https://img.icons8.com/color/96/000000/storm.png", // Thunderstorm: Slight/Moderate
        96: "https://img.icons8.com/color/96/000000/storm.png", // Thunderstorm with slight hail
        99: "https://img.icons8.com/color/96/000000/storm.png"  // Thunderstorm with heavy hail
    };

    return icons[code] || "https://img.icons8.com/color/96/000000/unknown.png";
}

// Function to format the date and time
function formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let day = date.getDay();

    if (minutes < 10) minutes = `0${minutes}`;
    if (hours < 10) hours = `0${hours}`;

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return `${days[day]} ${hours}:${minutes}`;
}

// Event listener for search form
document.querySelector("#search-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const city = document.querySelector("#search-input").value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Fetch default weather data when the page loads
fetchWeather("Paris");
