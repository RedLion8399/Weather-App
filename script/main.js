"use strict";
const weatherDisplay = document.getElementById("weather-display");
fetch("secrets.json")
    .then((response) => response.json())
    .then((data) => {
    let key = data.apiKey.trim();
    if (!key) {
        throw new Error("API Key not found. Please save OpenWeatherMap-API Key to secrets.txt");
    }
    getWeather(key);
})
    .catch((err) => {
    console.error(`${err} Please save OpenWeatherMap-API Key to secrets.txt in root directory.`);
    return;
});
function displayWeather(weatherData) {
    weatherDisplay.innerHTML = weatherData;
}
function getWeather(apiKey) {
    let lat, lon;
    lat = 52.52;
    lon = 13.41;
    const RequestUrl = new URL("https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={ApiKey}");
    // The free plan offers three different APIs:
    // - https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    // - api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
    // - api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    RequestUrl.searchParams.set("lat", lat.toString());
    RequestUrl.searchParams.set("lon", lon.toString());
    RequestUrl.searchParams.set("appid", apiKey);
    RequestUrl.searchParams.set("units", "metric");
    RequestUrl.searchParams.set("lang", "de");
    let response;
    fetch(RequestUrl)
        .then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
        .then((data) => {
        response = data;
        console.log(response);
        displayWeather(JSON.stringify(response));
    })
        .catch((err) => {
        console.log(err);
    });
}
