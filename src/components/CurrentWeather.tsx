import type { WeatherData } from "@/lib/weather";
import { getWeatherEmoji } from "@/lib/weather";

interface Props {
  data: WeatherData;
}

export default function CurrentWeather({ data }: Props) {
  const now = new Date((data.dt + data.timezone) * 1000);
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="text-center animate-float-up" style={{ animationDelay: "0.1s" }}>
      <h1 className="text-lg font-medium tracking-wide text-foreground/90">
        {data.city}, {data.country}
      </h1>
      <p className="text-xs font-light text-foreground/50 mt-1">{dateStr}</p>

      <div className="mt-6 mb-2">
        <span className="text-[7rem] leading-none font-extralight tracking-tighter temp-glow animate-pulse-glow">
          {data.temp}°
        </span>
      </div>

      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-2xl">{getWeatherEmoji(data.condition)}</span>
        <span className="text-base font-light capitalize text-foreground/80">
          {data.description}
        </span>
      </div>

      <p className="text-xs text-foreground/40 font-light">
        H:{data.temp + 2}° L:{data.temp - 3}°
      </p>
    </div>
  );
}
