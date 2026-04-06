import { useState } from "react";
import { Search } from "lucide-react";

interface Props {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <div className="glass-card flex items-center gap-3 px-4 py-3 transition-all duration-300 focus-within:border-foreground/30">
        <Search className="w-4 h-4 text-foreground/50 shrink-0" />
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          className="bg-transparent outline-none w-full text-sm text-foreground placeholder:text-foreground/40 font-light"
        />
      </div>
    </form>
  );
}
