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

            // Fetch weather data
            let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode`;

            return axios.get(weatherUrl);
        })
        .then((weatherResponse) => {
            if (!weatherResponse || !weatherResponse.data.current) {
                alert("Weather data unavailable. Try another city.");
                return;
            }

            console.log("Weather Data:", weatherResponse.data);
            updateWeatherUI(weatherResponse.data.current, city);
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            alert("Failed to retrieve weather data. Please try again later.");
        });
}

// Function to update the UI dynamically
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
    temperatureElement.textContent = `${roundedTemp}°C`;  // Added °C for clarity
    humidityElement.innerHTML = `Humidity: <strong>${data.relative_humidity_2m}%</strong>`;
    windElement.innerHTML = `Wind: <strong>${data.windspeed_10m} km/h</strong>`;
    
    // Get and update weather icon
    const weatherIconUrl = getWeatherIcon(data.weathercode);
    weatherIconElement.src = weatherIconUrl;
    weatherIconElement.alt = "Weather Icon";

    // Update date & time
    dateElement.textContent = formatDate(new Date());
}

// Function to get weather icons from Icons8 based on Open-Meteo weather codes
function getWeatherIcon(code) {
    const icons = {
        0: "https://img.icons8.com/color/96/000000/sun.png",
        1: "https://img.icons8.com/color/96/000000/partly-cloudy-day.png",
        2: "https://img.icons8.com/color/96/000000/clouds.png",
        3: "https://img.icons8.com/color/96/000000/clouds.png",
        45: "https://img.icons8.com/color/96/000000/fog-day.png",
        48: "https://img.icons8.com/color/96/000000/fog.png",
        51: "https://img.icons8.com/color/96/000000/light-rain.png",
        53: "https://img.icons8.com/color/96/000000/rain.png",
        55: "https://img.icons8.com/color/96/000000/rain.png",
        61: "https://img.icons8.com/color/96/000000/rain.png",
        63: "https://img.icons8.com/color/96/000000/rain.png",
        65: "https://img.icons8.com/color/96/000000/rain.png",
        71: "https://img.icons8.com/color/96/000000/snow.png",
        73: "https://img.icons8.com/color/96/000000/snow.png",
        75: "https://img.icons8.com/color/96/000000/snow.png",
        95: "https://img.icons8.com/color/96/000000/storm.png",
        96: "https://img.icons8.com/color/96/000000/storm.png",
        99: "https://img.icons8.com/color/96/000000/storm.png"
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
