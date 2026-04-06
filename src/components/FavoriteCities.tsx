import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";

interface Props {
  currentCity: string;
  onSelectCity: (city: string) => void;
}

const STORAGE_KEY = "weather-favorites";

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(cities: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

export default function FavoriteCities({ currentCity, onSelectCity }: Props) {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const isFavorited = favorites.some((c) => c.toLowerCase() === currentCity.toLowerCase());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = () => {
    if (isFavorited) {
      setFavorites((prev) => prev.filter((c) => c.toLowerCase() !== currentCity.toLowerCase()));
    } else if (currentCity) {
      setFavorites((prev) => [...prev, currentCity]);
    }
  };

  const removeCity = (city: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => prev.filter((c) => c !== city));
  };

  return (
    <div className="animate-float-up" style={{ animationDelay: "0.05s" }}>
      {/* Add/remove current city */}
      <button
        onClick={toggleFavorite}
        className="glass-card px-4 py-2 flex items-center gap-2 mx-auto mb-3 hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        <Star
          className={`w-4 h-4 transition-colors duration-300 ${
            isFavorited ? "fill-yellow-400 text-yellow-400" : "text-foreground/50"
          }`}
        />
        <span className="text-xs font-light text-foreground/70">
          {isFavorited ? "Saved" : "Save city"}
        </span>
      </button>

      {/* Favorites list */}
      {favorites.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {favorites.map((city) => {
            const isActive = city.toLowerCase() === currentCity.toLowerCase();
            return (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className={`glass-card px-3 py-1.5 flex items-center gap-1.5 text-xs font-light transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isActive
                    ? "border-foreground/30 text-foreground"
                    : "text-foreground/60 hover:text-foreground/80"
                }`}
              >
                <span>{city}</span>
                <X
                  className="w-3 h-3 text-foreground/40 hover:text-foreground/70 transition-colors"
                  onClick={(e) => removeCity(city, e)}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
