const API_KEY = "111e65a32f7b7344b3e4191d818dea12";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Location not found");
  const data = await res.json();
  return parseWeatherResponse(data);
}

export async function fetchForecastByCoords(lat: number, lon: number): Promise<{
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}> {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Forecast not found");
  const data = await res.json();
  return parseForecastData(data);
}

function parseForecastData(data: any): { hourly: HourlyForecast[]; daily: DailyForecast[] } {
  const hourly: HourlyForecast[] = data.list.slice(0, 12).map((item: any) => ({
    time: item.dt,
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    condition: item.weather[0].main,
  }));

  const dailyMap = new Map<string, { temps: number[]; icons: string[]; conditions: string[]; date: number }>();
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, { temps: [], icons: [], conditions: [], date: item.dt });
    }
    const entry = dailyMap.get(date)!;
    entry.temps.push(item.main.temp);
    entry.icons.push(item.weather[0].icon);
    entry.conditions.push(item.weather[0].main);
  });

  const daily: DailyForecast[] = Array.from(dailyMap.values())
    .slice(0, 7)
    .map((entry) => ({
      date: entry.date,
      tempMin: Math.round(Math.min(...entry.temps)),
      tempMax: Math.round(Math.max(...entry.temps)),
      icon: entry.icons[Math.floor(entry.icons.length / 2)],
      condition: entry.conditions[Math.floor(entry.conditions.length / 2)],
    }));

  return { hourly, daily };
}

export interface WeatherData {
  city: string;
  country: string;
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

export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  const res = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("City not found");
  const data = await res.json();
  return parseWeatherResponse(data);
}

export async function fetchForecast(city: string): Promise<{
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}> {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Forecast not found");
  const data = await res.json();
  return parseForecastData(data);
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
