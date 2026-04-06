import { useState, useEffect, useCallback } from "react";
import WeatherBackground from "@/components/WeatherBackground";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherDetails from "@/components/WeatherDetails";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import FavoriteCities from "@/components/FavoriteCities";
import WeatherAlerts from "@/components/WeatherAlerts";
import WeatherMap from "@/components/WeatherMap";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByCoords,
  fetchForecastByCoords,
  getTimeOfDay,
  type WeatherData,
  type HourlyForecast as HF,
  type DailyForecast as DF,
  type TimeOfDay,
} from "@/lib/weather";

export default function Index() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourly, setHourly] = useState<HF[]>([]);
  const [daily, setDaily] = useState<DF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  

  const loadWeather = useCallback(async (city: string) => {
    setLoading(true);
    setError("");
    try {
      const [current, forecast] = await Promise.all([fetchCurrentWeather(city), fetchForecast(city)]);
      setWeather(current);
      setHourly(forecast.hourly);
      setDaily(forecast.daily);
    } catch {
      setError("City not found. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError("");
    try {
      const [current, forecast] = await Promise.all([fetchWeatherByCoords(lat, lon), fetchForecastByCoords(lat, lon)]);
      setWeather(current);
      setHourly(forecast.hourly);
      setDaily(forecast.daily);
      setTimeOfDay(getTimeOfDay(current.dt, current.sunrise, current.sunset));
    } catch {
      setError("Could not fetch weather for your location.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocate = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => setError("Could not get your location."),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }
  }, [loadWeatherByCoords]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => loadWeather("London"),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      loadWeather("London");
    }
  }, [loadWeather, loadWeatherByCoords]);


  return (
    <div className="relative min-h-screen">
      <WeatherBackground condition={weather?.condition || "Clear"} timeOfDay={timeOfDay} />

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-md mx-auto px-5 py-8 space-y-6 pb-12">
            <div className="animate-float-up">
              <SearchBar onSearch={loadWeather} onLocate={handleLocate} isLoading={loading} />
            </div>

            {!loading && weather && (
              <FavoriteCities currentCity={weather.city} onSelectCity={loadWeather} />
            )}

            {error && (
              <div className="glass-card p-4 text-center animate-float-up">
                <p className="text-sm text-foreground/70">{error}</p>
              </div>
            )}

            {loading ? (
              <WeatherSkeleton />
            ) : weather ? (
              <>
                <CurrentWeather data={weather} />
                <WeatherAlerts data={weather} />
                <WeatherDetails data={weather} />
                {hourly.length > 0 && <HourlyForecast data={hourly} />}
                {daily.length > 0 && <DailyForecast data={daily} />}
                <WeatherMap lat={weather.lat} lon={weather.lon} city={weather.city} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
