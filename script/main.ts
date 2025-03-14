let weatherKey: string;
let locationKey: string;

const weatherDisplay = document.getElementById("weather-display")!;

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

async function buildRequestUrl(): Promise<URL> {
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

async function getWeather(): Promise<string> {
  let requestUrl: URL = await buildRequestUrl();

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

loadApiKey();
getWeather().then((weatherData: string) => displayWeather(weatherData));
