import { Droplets, Wind, Thermometer } from "lucide-react";
import type { WeatherData } from "@/lib/weather";

interface Props {
  data: WeatherData;
}

export default function WeatherDetails({ data }: Props) {
  const items = [
    { icon: Droplets, label: "Humidity", value: `${data.humidity}%` },
    { icon: Wind, label: "Wind", value: `${data.windSpeed} km/h` },
    { icon: Thermometer, label: "Feels Like", value: `${data.feelsLike}°` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 animate-float-up" style={{ animationDelay: "0.3s" }}>
      {items.map((item) => (
        <div key={item.label} className="glass-card p-4 text-center hover:scale-105 transition-transform duration-300">
          <item.icon className="w-5 h-5 mx-auto mb-2 text-foreground/60" />
          <p className="text-xs text-foreground/40 font-light mb-1">{item.label}</p>
          <p className="text-base font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
