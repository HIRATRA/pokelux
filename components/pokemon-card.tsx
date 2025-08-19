"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";

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
}

interface PokemonCardProps {
  pokemon: Pokemon;
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

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showStats, setShowStats] = useState(false);

  const handleToggleFavorite = () => {
    toggleFavorite(pokemon);
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Card className="group bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 overflow-hidden">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative bg-gradient-to-br from-muted/20 to-muted/40 p-6 text-center">
          <img
            src={
              pokemon.sprites.other["official-artwork"].front_default ||
              "/placeholder.svg?height=150&width=150"
            }
            alt={pokemon.name}
            className="w-32 h-32 mx-auto object-contain group-hover:scale-110 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isFavorite(pokemon.id)
                ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                isFavorite(pokemon.id) ? "fill-current scale-110" : ""
              }`}
            />
          </Button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-xl font-bold text-card-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {capitalizeFirst(pokemon.name)}
            </h3>
            <span className="text-sm text-muted-foreground">
              #{pokemon.id.toString().padStart(3, "0")}
            </span>
          </div>

          {/* Types */}
          <div className="flex gap-2 mb-4">
            {pokemon.types.map((type) => (
              <Badge
                key={type.type.name}
                className={`${
                  typeColors[type.type.name]
                } text-white border-0 text-xs font-medium`}
              >
                {capitalizeFirst(type.type.name)}
              </Badge>
            ))}
          </div>

          {/* Stats Toggle */}
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="w-full flex items-center gap-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              {showStats ? "Hide Stats" : "Show Stats"}
            </Button>

            {showStats && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>Height: {pokemon.height / 10}m</div>
                  <div>Weight: {pokemon.weight / 10}kg</div>
                </div>
                <div className="space-y-1">
                  {pokemon.stats.slice(0, 3).map((stat) => (
                    <div key={stat.stat.name} className="flex justify-between">
                      <span className="capitalize">
                        {stat.stat.name.replace("-", " ")}:
                      </span>
                      <span className="font-semibold">{stat.base_stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link href={`/pokemon/${pokemon.id}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 glow-primary">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
