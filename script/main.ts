let weatherKey: string;
let locationKey: string;

const weatherDisplay = document.getElementById("weather-display")!;
const locationDisplay = document.getElementById("location-display")!;
const cityInput = document.getElementById("city-input")!;

async function loadApiKey(): Promise<void> {
  interface Secrets {
    weatherKey: string;
    locationKey: string;
  }

  try {
    let response: Response = await fetch("secrets.json");
    let data: Secrets = await response.json();
    weatherKey = data.weatherKey.trim();
    locationKey = data.locationKey.trim();
  } catch (err) {
    throw new Error(
      `${err} - Please save API-Keys to secrets.txt in root directory.`
    );
  }
  if (!weatherKey) {
    throw new Error(
      "API Key not found. Please save OpenWeatherMap-API Key to secrets.txt"
    );
  }
  if (!locationKey) {
    throw new Error(
      "API Key not found. Please save locationiq-API Key to secrets.txt"
    );
  }
}

function displayWeather(weatherData: string): void {
  weatherDisplay.innerHTML = weatherData;
}

async function buildWeatherRequestUrl(): Promise<URL> {
  if (!weatherKey) {
    await loadApiKey();
  }

  let lat: number;
  let lon: number;
  lat = 51.44488;
  lon = 8.34851;

  let baseUrl: string = "https://api.openweathermap.org";
  const requestUrl: URL = new URL(baseUrl);

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
}

async function buildLocationRequestUrl(city: string): Promise<URL> {
  if (!locationKey) {
    await loadApiKey();
  }

  let baseUrl: string = "https://us1.locationiq.com/v1/search/structured";
  const requestUrl: URL = new URL(baseUrl);

  requestUrl.searchParams.set("key", locationKey);
  requestUrl.searchParams.set("format", "json");
  requestUrl.searchParams.set("city", city);

  return requestUrl;
}

async function getWeather(): Promise<string> {
  let requestUrl: URL = await buildWeatherRequestUrl();

  let response: Response;
  try {
    response = await fetch(requestUrl);
  } catch (err) {
    throw new Error(`${err} - API Request failed`);
  }
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  let data = await response.json();
  return JSON.stringify(data);
}

interface Location {
  lat: number;
  lon: number;
  display_name: string;
}

async function getLocationCoordinates(city: string): Promise<Array<Location>> {
  let requestUrl: URL = await buildLocationRequestUrl(city);

  let response: Response;
  try {
    response = await fetch(requestUrl);
  } catch (err) {
    throw new Error(`${err} - API Request failed`);
  }
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  let data: Array<Location> = await response.json();
  return data;
}

async function displayWeatherFromInput(event: Event): Promise<void> {
  event.preventDefault();

  let city: string = cityInput.querySelector("input")!.value;
  console.log(city);
  let coordinates: Array<Location> = await getLocationCoordinates(city);

  locationDisplay.innerHTML = JSON.stringify(coordinates);
}

loadApiKey();

cityInput.addEventListener("submit", displayWeatherFromInput);

getWeather().then((weatherData: string) => displayWeather(weatherData));
