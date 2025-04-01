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
const clothingSpace = document.getElementById("clothing-recommendation");
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
function displayClothingRecommendation(currentWeatherData) {
    clothingSpace.innerHTML = "";
    let temp = Math.round(currentWeatherData.main.temp);
    let id = currentWeatherData.weather[0].id;
    let windspeed = Math.round(currentWeatherData.wind.speed);
    // Optional fields
    if (300 <= id && id < 600 && windspeed < 19) {
        // Regenschirm
        const umbrella = document.createElement("img");
        umbrella.src = "img/clothing-recommendations/Regenschirm.png";
        umbrella.alt = "Regenschirm";
        clothingSpace.appendChild(umbrella);
    }
    if ((id === 800 || id === 801) && temp >= 20) {
        // Sonnenhut
        const sunhat = document.createElement("img");
        sunhat.src = "img/clothing-recommendations/Sommerhut.png";
        sunhat.alt = "Sonnenhut";
        clothingSpace.appendChild(sunhat);
    }
    // Clothing up non-optional
    if (800 <= id && id <= 804 && temp >= 20) {
        // T-Shirt
        const TShirt = document.createElement("img");
        TShirt.src = "img/clothing-recommendations/T-Shirt.png";
        TShirt.alt = "T-Shirt";
        clothingSpace.appendChild(TShirt);
    }
    else if (800 <= id && id <= 804 && temp <= 20 && windspeed > 7) {
        // Herbstjacke
        const jacket = document.createElement("img");
        jacket.src = "img/clothing-recommendations/Herbstjacke.png";
        jacket.alt = "Herbstjacke";
        clothingSpace.appendChild(jacket);
    }
    else if (200 <= id && id < 600 && temp <= 20) {
        // Regenjacke
        const rainjacket = document.createElement("img");
        rainjacket.src = "img/clothing-recommendations/Regenjacke.png";
        rainjacket.alt = "Regenjacke";
        clothingSpace.appendChild(rainjacket);
    }
    else if (temp <= 0) {
        // Anorak
        const anorak = document.createElement("img");
        anorak.src = "img/clothing-recommendations/Anorak.png";
        anorak.alt = "Anorak";
        clothingSpace.appendChild(anorak);
    }
    else if (800 <= id && id <= 804 && 0 < temp && temp < 20 && windspeed < 8) {
        // Pullover
        const pullover = document.createElement("img");
        pullover.src = "img/clothing-recommendations/Pullover.png";
        pullover.alt = "Pullover";
        clothingSpace.appendChild(pullover);
    }
    else {
        const error = document.createElement("img");
        error.alt = "go naked";
        clothingSpace.appendChild(error);
    }
    // Clothing down non-optional
    if (800 <= id && id <= 804 && temp >= 25 && windspeed <= 7) {
        // kurze Sommerhose
        const shorts = document.createElement("img");
        shorts.src = "img/clothing-recommendations/Kurze-sommerhose.png";
        shorts.alt = "kurze Sommerhose";
        shorts.classList.add("cloth-down");
        clothingSpace.appendChild(shorts);
    }
    else if (800 <= id && id <= 804 && 15 <= temp && temp <= 30) {
        // lange Hose
        const longpants = document.createElement("img");
        longpants.src = "img/clothing-recommendations/Sommerhose.png";
        longpants.alt = "lange Hose";
        longpants.classList.add("cloth-down");
        clothingSpace.appendChild(longpants);
    }
    else {
        // Jeans
        const jeans = document.createElement("img");
        jeans.src = "img/clothing-recommendations/Jeans.png";
        jeans.alt = "Jeans";
        jeans.classList.add("cloth-down");
        clothingSpace.appendChild(jeans);
    }
}
function displayWeather(currentWeatherData, forecastWeatherData) {
    document.getElementById("city-name").textContent = currentWeatherData.name;
    document.getElementById("country").textContent =
        currentWeatherData.sys.country;
    document.getElementById("time").textContent = new Date((currentWeatherData.dt + currentWeatherData.timezone) * 1000).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
    document.getElementById("date").textContent = new Date((currentWeatherData.dt + currentWeatherData.timezone) * 1000).toLocaleDateString("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    document.getElementById("description").textContent =
        currentWeatherData.weather[0].description;
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
    document.getElementById("rain").textContent = Math.round(currentWeatherData.rain["1h"] || 0).toString();
    document.getElementById("clouds").textContent = Math.round(currentWeatherData.clouds.all || 0).toString();
    displayClothingRecommendation(currentWeatherData);
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
getWeather().then((data) => displayWeather(data));
