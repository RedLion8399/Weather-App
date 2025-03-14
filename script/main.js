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
function displayWeather(weatherData) {
    weatherDisplay.innerHTML = weatherData;
}
function buildWeatherRequestUrl() {
    return __awaiter(this, arguments, void 0, function* (lat = 51.44488, lon = 8.34851) {
        if (!weatherKey) {
            yield loadApiKey();
        }
        let baseUrl = "https://api.openweathermap.org";
        const requestUrl = new URL(baseUrl);
        // The free plan offers three different APIs:
        // - https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
        // - api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
        // - api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
        requestUrl.searchParams.set("lat", lat.toString());
        requestUrl.searchParams.set("lon", lon.toString());
        requestUrl.searchParams.set("appid", weatherKey);
        requestUrl.searchParams.set("units", "metric");
        requestUrl.searchParams.set("lang", "de");
        requestUrl.pathname = "data/2.5/weather";
        // requestUrl.pathname = "data/2.5/forecast/daily";
        // requestUrl.pathname = "data/2.5/forecast";
        return requestUrl;
    });
}
function getWeather() {
    return __awaiter(this, arguments, void 0, function* (lat = 51.44488, lon = 8.34851) {
        let requestUrl = yield buildWeatherRequestUrl(lat, lon);
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
        return JSON.stringify(data);
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
            let weatherData = yield getWeather(lat, lon);
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
                    let weatherData = yield getWeather(lat, lon);
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
