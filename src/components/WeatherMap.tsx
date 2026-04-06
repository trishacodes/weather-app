import { useState } from "react";
import { Map, Layers, X } from "lucide-react";

interface Props {
  lat: number;
  lon: number;
  city: string;
}

type MapLayer = "precipitation" | "clouds" | "temperature" | "wind";

const layerInfo: Record<MapLayer, { label: string; emoji: string }> = {
  precipitation: { label: "Rain", emoji: "🌧️" },
  clouds: { label: "Clouds", emoji: "☁️" },
  temperature: { label: "Temp", emoji: "🌡️" },
  wind: { label: "Wind", emoji: "💨" },
};

export default function WeatherMap({ lat, lon, city }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [layer, setLayer] = useState<MapLayer>("precipitation");

  // Use RainViewer for radar tiles (free, no API key)
  // Use OpenStreetMap as base map
  const zoom = 8;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 1.5},${lat - 1},${lon + 1.5},${lat + 1}&layer=mapnik&marker=${lat},${lon}`;

  // Windy.com embed for weather layers (free, no API key needed for embed)
  const windyUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=${zoom}&overlay=${layer}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&message=true`;

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="glass-card w-full p-4 flex items-center gap-3 hover:scale-[1.02] transition-all duration-300 animate-float-up"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Map className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-semibold text-foreground/90">Weather Map</p>
          <p className="text-xs text-foreground/50">Tap to view radar & satellite</p>
        </div>
        <Layers className="w-4 h-4 text-foreground/40" />
      </button>
    );
  }

  return (
    <div className="glass-card overflow-hidden animate-float-up" style={{ animationDelay: "0.1s" }}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-foreground/90">Weather Map — {city}</h3>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layer selector */}
      <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {(Object.keys(layerInfo) as MapLayer[]).map((l) => (
          <button
            key={l}
            onClick={() => setLayer(l)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              layer === l
                ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/30"
                : "bg-foreground/5 text-foreground/50 border border-transparent hover:bg-foreground/10"
            }`}
          >
            <span>{layerInfo[l].emoji}</span>
            {layerInfo[l].label}
          </button>
        ))}
      </div>

      {/* Map iframe */}
      <div className="relative w-full" style={{ height: 280 }}>
        <iframe
          src={windyUrl}
          className="w-full h-full border-0"
          title="Weather Map"
          loading="lazy"
          allow="fullscreen"
        />
      </div>

      <div className="px-4 py-2 flex items-center justify-between">
        <p className="text-[10px] text-foreground/30">
          📍 {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
        </p>
        <p className="text-[10px] text-foreground/30">Powered by Windy</p>
      </div>
    </div>
  );
}
