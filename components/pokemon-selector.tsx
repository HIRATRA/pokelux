"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface Pokemon {
  id: number;
  name: string;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  base_experience: number;
}

interface PokemonSelectorProps {
  selectedPokemon: Pokemon | null;
  onPokemonSelect: (pokemon: Pokemon | null) => void;
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export default function PokemonSelector({
  selectedPokemon,
  onPokemonSelect,
}: PokemonSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`
      );
      if (response.ok) {
        const pokemon = await response.json();
        onPokemonSelect(pokemon);
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Error searching Pokemon:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const clearSelection = () => {
    onPokemonSelect(null);
  };

  if (selectedPokemon) {
    return (
      <div className="text-center space-y-4">
        <div className="relative">
          <img
            src={
              selectedPokemon.sprites.other["official-artwork"].front_default ||
              "/placeholder.svg?height=150&width=150" ||
              "/placeholder.svg"
            }
            alt={selectedPokemon.name}
            className="w-32 h-32 mx-auto object-contain"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="absolute top-0 right-0 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {capitalizeFirst(selectedPokemon.name)}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            #{selectedPokemon.id.toString().padStart(3, "0")}
          </p>

          <div className="flex justify-center gap-2">
            {selectedPokemon.types.map((type) => (
              <Badge
                key={type.type.name}
                className={`${
                  typeColors[type.type.name]
                } text-white border-0 text-xs`}
              >
                {capitalizeFirst(type.type.name)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border rounded-full"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="px-6 bg-primary hover:bg-primary/90 rounded-full"
        >
          {isLoading ? "..." : "Select"}
        </Button>
      </form>

      <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
        <div className="text-4xl mb-2">🔍</div>
        <p className="text-muted-foreground text-sm">
          Search for a Pokémon to select
        </p>
      </div>
    </div>
  );
}
