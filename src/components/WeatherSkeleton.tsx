export default function WeatherSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="text-center space-y-3">
        <div className="h-5 w-32 bg-foreground/10 rounded-full mx-auto" />
        <div className="h-3 w-24 bg-foreground/10 rounded-full mx-auto" />
        <div className="h-24 w-40 bg-foreground/10 rounded-3xl mx-auto mt-6" />
        <div className="h-4 w-28 bg-foreground/10 rounded-full mx-auto" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4 h-20" />
        ))}
      </div>
      <div className="glass-card p-4 h-24" />
      <div className="glass-card p-4 h-48" />
    </div>
  );
}
