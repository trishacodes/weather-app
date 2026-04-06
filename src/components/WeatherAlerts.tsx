import { AlertTriangle, CloudLightning, CloudRain, Snowflake, Wind, Thermometer, Eye } from "lucide-react";
import type { WeatherData } from "@/lib/weather";

interface Props {
  data: WeatherData;
}

interface Alert {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  severity: "warning" | "danger" | "info";
}

function getAlerts(data: WeatherData): Alert[] {
  const alerts: Alert[] = [];

  // Thunderstorm alert
  if (data.condition === "Thunderstorm") {
    alerts.push({
      icon: CloudLightning,
      title: "Thunderstorm Warning",
      description: "Severe thunderstorm in your area. Stay indoors and avoid open spaces.",
      severity: "danger",
    });
  }

  // Heavy rain
  if (data.condition === "Rain" || data.condition === "Drizzle") {
    alerts.push({
      icon: CloudRain,
      title: "Rain Advisory",
      description: "Rainfall expected. Carry an umbrella and drive carefully.",
      severity: "warning",
    });
  }

  // Snow
  if (data.condition === "Snow") {
    alerts.push({
      icon: Snowflake,
      title: "Snow Alert",
      description: "Snowfall in progress. Roads may be slippery, drive with caution.",
      severity: "warning",
    });
  }

  // High wind
  if (data.windSpeed > 40) {
    alerts.push({
      icon: Wind,
      title: "High Wind Warning",
      description: `Wind speeds at ${data.windSpeed} km/h. Secure loose objects outdoors.`,
      severity: "danger",
    });
  } else if (data.windSpeed > 25) {
    alerts.push({
      icon: Wind,
      title: "Wind Advisory",
      description: `Moderate winds at ${data.windSpeed} km/h expected in your area.`,
      severity: "info",
    });
  }

  // Extreme heat
  if (data.temp > 40) {
    alerts.push({
      icon: Thermometer,
      title: "Extreme Heat Warning",
      description: "Dangerously high temperatures. Stay hydrated and avoid sun exposure.",
      severity: "danger",
    });
  } else if (data.temp > 35) {
    alerts.push({
      icon: Thermometer,
      title: "Heat Advisory",
      description: "High temperatures expected. Drink plenty of water and stay cool.",
      severity: "warning",
    });
  }

  // Extreme cold
  if (data.temp < -10) {
    alerts.push({
      icon: Thermometer,
      title: "Extreme Cold Warning",
      description: "Dangerously low temperatures. Limit time outdoors and dress warmly.",
      severity: "danger",
    });
  } else if (data.temp < 0) {
    alerts.push({
      icon: Thermometer,
      title: "Frost Advisory",
      description: "Freezing temperatures expected. Protect plants and exposed pipes.",
      severity: "warning",
    });
  }

  // Low visibility (fog)
  if (data.condition === "Fog" || data.condition === "Mist" || data.condition === "Haze") {
    alerts.push({
      icon: Eye,
      title: "Low Visibility",
      description: "Reduced visibility due to fog. Use low-beam headlights while driving.",
      severity: "info",
    });
  }

  return alerts;
}

const severityStyles: Record<string, string> = {
  danger: "border-l-4 border-l-red-500 bg-red-500/10",
  warning: "border-l-4 border-l-amber-400 bg-amber-400/10",
  info: "border-l-4 border-l-blue-400 bg-blue-400/10",
};

const severityIconColor: Record<string, string> = {
  danger: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

export default function WeatherAlerts({ data }: Props) {
  const alerts = getAlerts(data);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3 animate-float-up" style={{ animationDelay: "0.15s" }}>
      <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Weather Alerts
      </h3>
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`glass-card p-4 ${severityStyles[alert.severity]} transition-all duration-300 hover:scale-[1.02]`}
        >
          <div className="flex items-start gap-3">
            <alert.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${severityIconColor[alert.severity]}`} />
            <div>
              <p className="text-sm font-semibold text-foreground/90">{alert.title}</p>
              <p className="text-xs text-foreground/60 mt-1 leading-relaxed">{alert.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
