"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let weatherKey;
let locationKey;
const weatherDisplay = document.getElementById("weather-display");
const locationDisplay = document.getElementById("location-display");
const locationTemplate = document.getElementById("location-template");
const cityInput = document.getElementById("city-input");
// Get API Keys
function loadApiKey() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let response = yield fetch("secrets.json");
            let data = yield response.json();
            weatherKey = data.weatherKey.trim();
            locationKey = data.locationKey.trim();
        }
        catch (err) {
            throw new Error(`${err} - Please save API-Keys to secrets.txt in root directory.`);
        }
        if (!weatherKey) {
            throw new Error("API Key not found. Please save OpenWeatherMap-API Key to secrets.txt");
        }
        if (!locationKey) {
            throw new Error("API Key not found. Please save locationiq-API Key to secrets.txt");
        }
    });
}
// Get and process Weather Data
function displayWeather(currentWeatherData, forecastWeatherData) {
    document.getElementById("name").textContent = currentWeatherData.name;
    document.getElementById("description").textContent =
        currentWeatherData.weather[0].description;
    document.getElementById("country").textContent =
        currentWeatherData.sys.country;
    document.getElementById("icon").src = `https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`;
    document.getElementById("temp").textContent = Math.round(currentWeatherData.main.temp).toString();
    document.getElementById("feels-like").textContent = Math.round(currentWeatherData.main.feels_like).toString();
    document.getElementById("temp-min").textContent = Math.round(currentWeatherData.main.temp_min).toString();
    document.getElementById("temp-max").textContent = Math.round(currentWeatherData.main.temp_max).toString();
    document.getElementById("pressure").textContent = Math.round(currentWeatherData.main.pressure).toString();
    document.getElementById("humidity").textContent = Math.round(currentWeatherData.main.humidity).toString();
    document.getElementById("visibility").textContent = Math.round(currentWeatherData.visibility).toString();
    document.getElementById("wind-speed").textContent = Math.round(currentWeatherData.wind.speed).toString();
    document.getElementById("wind-deg").textContent = Math.round(currentWeatherData.wind.deg).toString();
    document.getElementById("wind-gust").textContent = Math.round(currentWeatherData.wind.gust).toString();
    document.getElementById("sunrise").textContent = new Date((currentWeatherData.sys.sunrise + currentWeatherData.timezone) * 1000).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
    document.getElementById("sunset").textContent = new Date((currentWeatherData.sys.sunset + currentWeatherData.timezone) * 1000).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
}
function buildWeatherRequestUrl() {
    return __awaiter(this, arguments, void 0, function* (lat = 51.44488, lon = 8.34851, current = true) {
        if (!weatherKey) {
            yield loadApiKey();
        }
        let baseUrl = "https://api.openweathermap.org";
        const requestUrl = new URL(baseUrl);
        // The free plan offers two different APIs:
        // - https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
        // - https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
        requestUrl.searchParams.set("lat", lat.toString());
        requestUrl.searchParams.set("lon", lon.toString());
        requestUrl.searchParams.set("appid", weatherKey);
        requestUrl.searchParams.set("units", "metric");
        requestUrl.searchParams.set("lang", "de");
        if (current) {
            requestUrl.pathname = "data/2.5/weather";
        }
        else {
            requestUrl.pathname = "data/2.5/forecast";
        }
        return requestUrl;
    });
}
function getWeather() {
    return __awaiter(this, arguments, void 0, function* (lat = 51.44488, lon = 8.34851, current = true) {
        let requestUrl = yield buildWeatherRequestUrl(lat, lon, current);
        let response;
        try {
            response = yield fetch(requestUrl);
        }
        catch (err) {
            throw new Error(`${err} - API Request failed`);
        }
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        let data = yield response.json();
        return data;
    });
}
// Get and process Location Data
function buildLocationRequestUrl(city) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!locationKey) {
            yield loadApiKey();
        }
        let baseUrl = "https://us1.locationiq.com/v1/search/structured";
        const requestUrl = new URL(baseUrl);
        requestUrl.searchParams.set("key", locationKey);
        requestUrl.searchParams.set("format", "json");
        requestUrl.searchParams.set("city", city);
        return requestUrl;
    });
}
function getLocationCoordinates(city) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestUrl = yield buildLocationRequestUrl(city);
        let response;
        try {
            response = yield fetch(requestUrl);
        }
        catch (err) {
            throw new Error(`${err} - API Request failed`);
        }
        if (response.status == 404) {
            alert("City not found");
            throw new Error("City not found");
        }
        else if (!response.ok) {
            throw new Error(response.statusText);
        }
        let data = yield response.json();
        return data;
    });
}
function processLocation(locations) {
    return __awaiter(this, void 0, void 0, function* () {
        locationDisplay.innerHTML = "";
        if (locations.length == 1) {
            let location = locations[0];
            let lat = location.lat;
            let lon = location.lon;
            let weatherData = (yield getWeather(lat, lon));
            displayWeather(weatherData);
        }
        else {
            locations.forEach((location) => {
                let locationCard = locationTemplate.content.cloneNode(true);
                const locationContent = locationCard.querySelector("div");
                locationContent.textContent = location.display_name;
                locationContent.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    let lat = location.lat;
                    let lon = location.lon;
                    let weatherData = (yield getWeather(lat, lon));
                    displayWeather(weatherData);
                    locationDisplay.innerHTML = "";
                }));
                locationDisplay.appendChild(locationCard);
            });
        }
    });
}
function displayWeatherFromLocation(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        let city = cityInput.querySelector("input").value;
        let locations = yield getLocationCoordinates(city);
        yield processLocation(locations);
    });
}
loadApiKey();
cityInput.addEventListener("submit", displayWeatherFromLocation);
