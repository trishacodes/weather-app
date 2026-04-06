import type { HourlyForecast as HF } from "@/lib/weather";
import { getWeatherEmoji } from "@/lib/weather";

interface Props {
  data: HF[];
}

export default function HourlyForecast({ data }: Props) {
  return (
    <div className="glass-card p-4 animate-float-up" style={{ animationDelay: "0.4s" }}>
      <h3 className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-3">
        Hourly Forecast
      </h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
        {data.map((h, i) => {
          const time = new Date(h.time * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
          });
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 min-w-[52px] hover:scale-110 transition-transform duration-200"
            >
              <span className="text-[10px] text-foreground/40 font-light">
                {i === 0 ? "Now" : time}
              </span>
              <span className="text-lg">{getWeatherEmoji(h.condition)}</span>
              <span className="text-sm font-medium">{h.temp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
