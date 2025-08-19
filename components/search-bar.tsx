"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

export default function SearchBar({
  onSearch,
  value,
  onChange,
  isLoading,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search Pokémon by name or ID..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-4 py-3 bg-card border-border rounded-full text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-full font-semibold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Search
      </Button>
    </form>
  );
}
