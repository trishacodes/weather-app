import { Droplets, Wind, Thermometer, Gauge, Eye, Sunrise, Sunset } from "lucide-react";
import type { WeatherData } from "@/lib/weather";

interface Props {
  data: WeatherData;
}

function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export default function WeatherDetails({ data }: Props) {
  const items = [
    { icon: Droplets, label: "Humidity", value: `${data.humidity}%` },
    { icon: Wind, label: "Wind", value: `${data.windSpeed} km/h` },
    { icon: Thermometer, label: "Feels Like", value: `${data.feelsLike}°` },
    { icon: Gauge, label: "Pressure", value: `${data.pressure} hPa` },
    { icon: Eye, label: "Visibility", value: `${data.visibility} km` },
    { icon: Sunrise, label: "Sunrise", value: formatTime(data.sunrise, data.timezone) },
    { icon: Sunset, label: "Sunset", value: formatTime(data.sunset, data.timezone) },
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
