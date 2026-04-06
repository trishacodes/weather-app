import type { DailyForecast as DF } from "@/lib/weather";
import { getWeatherEmoji } from "@/lib/weather";

interface Props {
  data: DF[];
}

export default function DailyForecast({ data }: Props) {
  return (
    <div className="glass-card p-4 animate-float-up" style={{ animationDelay: "0.5s" }}>
      <h3 className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-3">
        7-Day Forecast
      </h3>
      <div className="space-y-3">
        {data.map((d, i) => {
          const day = new Date(d.date * 1000).toLocaleDateString("en-US", {
            weekday: "short",
          });
          return (
            <div
              key={i}
              className="flex items-center justify-between hover:bg-foreground/5 rounded-xl px-2 py-1.5 transition-colors duration-200"
            >
              <span className="text-sm font-light w-12">{i === 0 ? "Today" : day}</span>
              <span className="text-lg">{getWeatherEmoji(d.condition)}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground/40 w-8 text-right">{d.tempMin}°</span>
                <div className="w-24 h-1 rounded-full bg-foreground/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${((d.tempMax - d.tempMin) / 30) * 100}%`,
                      marginLeft: `${(d.tempMin / 40) * 100}%`,
                      background: "linear-gradient(90deg, #4a9eff, #ff9a56)",
                    }}
                  />
                </div>
                <span className="text-xs font-medium w-8">{d.tempMax}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
