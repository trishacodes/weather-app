const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// WMO Weather interpretation codes → condition string
function wmoToCondition(code: number): { condition: string; description: string } {
  if (code === 0) return { condition: "Clear", description: "clear sky" };
  if (code === 1) return { condition: "Clear", description: "mainly clear" };
  if (code === 2) return { condition: "Clouds", description: "partly cloudy" };
  if (code === 3) return { condition: "Clouds", description: "overcast" };
  if (code === 45 || code === 48) return { condition: "Fog", description: "fog" };
  if (code >= 51 && code <= 55) return { condition: "Drizzle", description: "drizzle" };
  if (code >= 56 && code <= 57) return { condition: "Drizzle", description: "freezing drizzle" };
  if (code >= 61 && code <= 65) return { condition: "Rain", description: "rain" };
  if (code >= 66 && code <= 67) return { condition: "Rain", description: "freezing rain" };
  if (code >= 71 && code <= 77) return { condition: "Snow", description: "snowfall" };
  if (code >= 80 && code <= 82) return { condition: "Rain", description: "rain showers" };
  if (code >= 85 && code <= 86) return { condition: "Snow", description: "snow showers" };
  if (code >= 95 && code <= 99) return { condition: "Thunderstorm", description: "thunderstorm" };
  return { condition: "Clear", description: "unknown" };
}

async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string; country: string }> {
  const res = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en`);
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("City not found");
  const r = data.results[0];
  return { lat: r.latitude, lon: r.longitude, name: r.name, country: r.country_code || "" };
}

async function fetchWeatherData(lat: number, lon: number): Promise<{
  current: any;
  hourly: any;
  daily: any;
  utc_offset_seconds: number;
}> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,is_day",
    hourly: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}

function parseCurrentWeather(data: any, cityName: string, country: string, lat?: number, lon?: number): WeatherData {
  const c = data.current;
  const d = data.daily;
  const { condition, description } = wmoToCondition(c.weather_code);

  const sunriseUnix = Math.floor(new Date(d.sunrise[0]).getTime() / 1000);
  const sunsetUnix = Math.floor(new Date(d.sunset[0]).getTime() / 1000);
  const dtUnix = Math.floor(new Date(c.time).getTime() / 1000);

  return {
    city: cityName,
    country,
    lat: lat ?? data.latitude,
    lon: lon ?? data.longitude,
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: Math.round(c.relative_humidity_2m),
    windSpeed: Math.round(c.wind_speed_10m),
    pressure: Math.round(c.surface_pressure),
    visibility: 10,
    condition,
    conditionId: c.weather_code,
    description,
    icon: c.is_day ? "d" : "n",
    sunrise: sunriseUnix,
    sunset: sunsetUnix,
    dt: dtUnix,
    timezone: data.utc_offset_seconds,
  };
}

function parseHourlyForecast(data: any): HourlyForecast[] {
  const h = data.hourly;
  const now = new Date();
  const items: HourlyForecast[] = [];

  for (let i = 0; i < h.time.length && items.length < 12; i++) {
    const t = new Date(h.time[i]);
    if (t < now) continue;
    const { condition } = wmoToCondition(h.weather_code[i]);
    items.push({
      time: Math.floor(t.getTime() / 1000),
      temp: Math.round(h.temperature_2m[i]),
      icon: "",
      condition,
    });
  }
  return items;
}

function parseDailyForecast(data: any): DailyForecast[] {
  const d = data.daily;
  return d.time.slice(0, 7).map((t: string, i: number) => {
    const { condition } = wmoToCondition(d.weather_code[i]);
    return {
      date: Math.floor(new Date(t).getTime() / 1000),
      tempMin: Math.round(d.temperature_2m_min[i]),
      tempMax: Math.round(d.temperature_2m_max[i]),
      icon: "",
      condition,
    };
  });
}

// --- Public API (same interface as before) ---

export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  const geo = await geocodeCity(city);
  const data = await fetchWeatherData(geo.lat, geo.lon);
  return parseCurrentWeather(data, geo.name, geo.country, geo.lat, geo.lon);
}

export async function fetchForecast(city: string): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> {
  const geo = await geocodeCity(city);
  const data = await fetchWeatherData(geo.lat, geo.lon);
  return { hourly: parseHourlyForecast(data), daily: parseDailyForecast(data) };
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  let cityName = "Your Location";
  let country = "";
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (res.ok) {
      const geo = await res.json();
      cityName = geo.city || geo.locality || "Your Location";
      country = geo.countryCode || "";
    }
  } catch {
    // fallback name
  }
  const data = await fetchWeatherData(lat, lon);
  return parseCurrentWeather(data, cityName, country, lat, lon);
}

export async function fetchForecastByCoords(lat: number, lon: number): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> {
  const data = await fetchWeatherData(lat, lon);
  return { hourly: parseHourlyForecast(data), daily: parseDailyForecast(data) };
}

// --- Types ---

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  condition: string;
  conditionId: number;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  dt: number;
  timezone: number;
}

export interface HourlyForecast {
  time: number;
  temp: number;
  icon: string;
  condition: string;
}

export interface DailyForecast {
  date: number;
  tempMin: number;
  tempMax: number;
  icon: string;
  condition: string;
}

export function getWeatherEmoji(condition: string): string {
  const map: Record<string, string> = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Haze: "🌫️",
    Fog: "🌫️",
    Smoke: "🌫️",
    Dust: "🌫️",
    Tornado: "🌪️",
  };
  return map[condition] || "🌤️";
}

export type TimeOfDay = "sunrise" | "day" | "sunset" | "night";

export function getTimeOfDay(dt: number, sunrise: number, sunset: number): TimeOfDay {
  const sunriseStart = sunrise - 1800;
  const sunriseEnd = sunrise + 3600;
  const sunsetStart = sunset - 1800;
  const sunsetEnd = sunset + 3600;

  if (dt >= sunriseStart && dt <= sunriseEnd) return "sunrise";
  if (dt >= sunsetStart && dt <= sunsetEnd) return "sunset";
  if (dt > sunriseEnd && dt < sunsetStart) return "day";
  return "night";
}
