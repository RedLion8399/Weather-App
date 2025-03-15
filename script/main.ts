let weatherKey: string;
let locationKey: string;

const weatherDisplay = document.getElementById("weather-display")!;
const locationDisplay = document.getElementById("location-display")!;
const locationTemplate: HTMLTemplateElement = document.getElementById(
  "location-template"
) as HTMLTemplateElement;
const cityInput = document.getElementById("city-input")!;

// Get API Keys
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

// Get and process Weather Data
function displayWeather(
  currentWeatherData: CurrentWeather,
  forecastWeatherData?: ForecastWeather
): void {
  weatherDisplay.innerHTML = JSON.stringify(currentWeatherData);
}

async function buildWeatherRequestUrl(
  lat: number = 51.44488,
  lon: number = 8.34851,
  current: boolean = true
): Promise<URL> {
  if (!weatherKey) {
    await loadApiKey();
  }

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

  if (current) {
    requestUrl.pathname = "data/2.5/weather";
  } else {
    requestUrl.pathname = "data/2.5/forecast";
  }

  return requestUrl;
}

interface CurrentWeather {
  weather: [main: string, description: string, icon: string];

  main: [
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number,
    sea_level: number,
    grnd_level: number
  ];

  visibility: number;
  wind: [speed: number, deg: number, gust: number];
  rain: { "1h": number };
  clouds: { all: number };
  sys: [sunrise: number, sunset: number];
  timezone: number;
  name: string;
}

interface ForecastWeather {
  cnt: number;
  list: [
    dt: number,
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
    },
    weather: [main: string, description: string, icon: string],
    clouds: { all: number },
    wind: { speed: number; deg: number; gust: number },
    visibility: number,
    pop: number,
    rain: { "3h": number },
    sys: { pod: string },
    dt_txt: string
  ];

  city: {
    name: string;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

async function getWeather(
  lat: number = 51.44488,
  lon: number = 8.34851,
  current: boolean = true
): Promise<CurrentWeather | ForecastWeather> {
  let requestUrl: URL = await buildWeatherRequestUrl(lat, lon, current);

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
  return data;
}

// Get and process Location Data
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
  if (response.status == 404) {
    alert("City not found");
    throw new Error("City not found");
  } else if (!response.ok) {
    throw new Error(response.statusText);
  }
  let data: Array<Location> = await response.json();
  return data;
}

async function processLocation(locations: Array<Location>): Promise<void> {
  locationDisplay.innerHTML = "";

  if (locations.length == 1) {
    let location: Location = locations[0];
    let lat: number = location.lat;
    let lon: number = location.lon;

    let weatherData: CurrentWeather = (await getWeather(
      lat,
      lon
    )) as CurrentWeather;

    displayWeather(weatherData);
  } else {
    locations.forEach((location) => {
      let locationCard: Node = locationTemplate.content.cloneNode(true);
      const locationContent = (locationCard as HTMLElement).querySelector(
        "div"
      )!;
      locationContent.textContent = location.display_name;
      locationContent.addEventListener("click", async () => {
        let lat: number = location.lat;
        let lon: number = location.lon;
        let weatherData: CurrentWeather = (await getWeather(
          lat,
          lon
        )) as CurrentWeather;
        displayWeather(weatherData);
        locationDisplay.innerHTML = "";
      });

      locationDisplay.appendChild(locationCard);
    });
  }
}

async function displayWeatherFromLocation(event: Event): Promise<void> {
  event.preventDefault();

  let city: string = cityInput.querySelector("input")!.value;
  let locations: Array<Location> = await getLocationCoordinates(city);

  await processLocation(locations);
}

loadApiKey();

cityInput.addEventListener("submit", displayWeatherFromLocation);
