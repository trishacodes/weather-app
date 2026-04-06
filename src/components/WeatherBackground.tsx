import { useMemo } from "react";
import type { TimeOfDay } from "@/lib/weather";

interface Props {
  condition: string;
  timeOfDay: TimeOfDay;
}

const gradients: Record<string, Record<TimeOfDay, string>> = {
  default: {
    sunrise: "linear-gradient(180deg, #ff9a56 0%, #e86b8a 35%, #7b6ba5 70%, #4a90d9 100%)",
    day: "linear-gradient(180deg, #1a8fe3 0%, #47b4f5 40%, #87ceeb 80%, #b5e3f5 100%)",
    sunset: "linear-gradient(180deg, #e8532c 0%, #c44569 30%, #6b3fa0 65%, #1a1a4e 100%)",
    night: "linear-gradient(180deg, #0a0a2e 0%, #16163a 40%, #1a1a4e 70%, #0d0d26 100%)",
  },
  Rain: {
    sunrise: "linear-gradient(180deg, #8a9bae 0%, #6b7d8e 50%, #4a5e6e 100%)",
    day: "linear-gradient(180deg, #5a6b7c 0%, #4a5a6a 40%, #3d4d5c 100%)",
    sunset: "linear-gradient(180deg, #5a4a6b 0%, #4a3d5c 50%, #2d2440 100%)",
    night: "linear-gradient(180deg, #0d1117 0%, #161b22 50%, #0d1117 100%)",
  },
  Thunderstorm: {
    sunrise: "linear-gradient(180deg, #3d3d5c 0%, #2a2a4a 50%, #1a1a3a 100%)",
    day: "linear-gradient(180deg, #2d2d4a 0%, #1f1f3a 50%, #14142a 100%)",
    sunset: "linear-gradient(180deg, #2d1f3a 0%, #1f142a 50%, #0d0a1a 100%)",
    night: "linear-gradient(180deg, #0a0a1a 0%, #0f0f2a 50%, #050510 100%)",
  },
  Snow: {
    sunrise: "linear-gradient(180deg, #c8d6e5 0%, #a8c0d8 50%, #8faabe 100%)",
    day: "linear-gradient(180deg, #dfe6ed 0%, #c8d6e5 40%, #a8bdd0 100%)",
    sunset: "linear-gradient(180deg, #a8a0c0 0%, #8880a8 50%, #5a5080 100%)",
    night: "linear-gradient(180deg, #1a1a3a 0%, #2a2a4e 50%, #1a1a3a 100%)",
  },
};

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 60,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })),
    []
  );
  return (
    <>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: "white",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      {/* Moon */}
      <div
        className="absolute rounded-full"
        style={{
          top: "8%",
          right: "15%",
          width: 60,
          height: 60,
          background: "radial-gradient(circle, #f0e6d3 0%, #d4c5a9 60%, transparent 100%)",
          boxShadow: "0 0 40px 15px rgba(240,230,211,0.25), 0 0 80px 30px rgba(240,230,211,0.1)",
        }}
      />
    </>
  );
}

function RainDrops() {
  const drops = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: Math.random() * 0.5 + 0.6,
        opacity: Math.random() * 0.4 + 0.3,
      })),
    []
  );
  return (
    <>
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute animate-rain"
          style={{
            left: `${d.x}%`,
            top: -20,
            width: 1.5,
            height: 20,
            background: `linear-gradient(180deg, transparent, rgba(174,194,224,${d.opacity}))`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            borderRadius: 2,
          }}
        />
      ))}
    </>
  );
}

function SnowFlakes() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 5 + 5,
        size: Math.random() * 4 + 2,
      })),
    []
  );
  return (
    <>
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full animate-snow"
          style={{
            left: `${f.x}%`,
            width: f.size,
            height: f.size,
            background: "rgba(255,255,255,0.8)",
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </>
  );
}

function Lightning() {
  return (
    <div
      className="absolute inset-0 animate-lightning pointer-events-none"
      style={{ background: "rgba(255,255,255,0.15)" }}
    />
  );
}

function Clouds() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        top: Math.random() * 30 + 5,
        duration: Math.random() * 30 + 40,
        delay: Math.random() * 20,
        opacity: Math.random() * 0.3 + 0.15,
        scale: Math.random() * 0.5 + 0.8,
      })),
    []
  );
  return (
    <>
      {clouds.map((c) => (
        <div
          key={c.id}
          className="absolute animate-cloud"
          style={{
            top: `${c.top}%`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
            opacity: c.opacity,
            transform: `scale(${c.scale})`,
          }}
        >
          <div
            style={{
              width: 200,
              height: 60,
              background: "radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(8px)",
            }}
          />
        </div>
      ))}
    </>
  );
}

function SunRays() {
  return (
    <div
      className="absolute animate-sun-rays"
      style={{
        top: "-10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 400,
        height: 400,
        background: "radial-gradient(circle, rgba(255,220,100,0.3) 0%, rgba(255,180,50,0.1) 40%, transparent 70%)",
        borderRadius: "50%",
      }}
    />
  );
}

export default function WeatherBackground({ condition, timeOfDay }: Props) {
  const condGradients = gradients[condition] || gradients.default;
  const bg = condGradients[timeOfDay];

  const isNight = timeOfDay === "night";
  const isRain = condition === "Rain" || condition === "Drizzle";
  const isThunder = condition === "Thunderstorm";
  const isSnow = condition === "Snow";
  const isCloudy = condition === "Clouds";
  const isClear = condition === "Clear";
  const isDay = timeOfDay === "day";

  return (
    <div className="fixed inset-0 overflow-hidden transition-all duration-[2000ms]" style={{ background: bg }}>
      {isNight && <Stars />}
      {isDay && isClear && <SunRays />}
      {(isCloudy || isRain || isThunder) && <Clouds />}
      {isRain && <RainDrops />}
      {isThunder && (
        <>
          <RainDrops />
          <Lightning />
        </>
      )}
      {isSnow && <SnowFlakes />}
    </div>
  );
}
