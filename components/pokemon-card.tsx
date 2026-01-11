import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";

interface Pokemon {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: { other: { "official-artwork": { front_default: string } } };
  stats: Array<{ base_stat: number; stat: { name: string } }>;
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

// Couleurs pour les lumières de fond
const typeGlowColors: Record<string, string> = {
  normal: "rgba(156, 163, 175, 0.4)",
  fire: "rgba(239, 68, 68, 0.5)",
  water: "rgba(59, 130, 246, 0.5)",
  electric: "rgba(250, 204, 21, 0.6)",
  grass: "rgba(34, 197, 94, 0.5)",
  ice: "rgba(147, 197, 253, 0.5)",
  fighting: "rgba(185, 28, 28, 0.5)",
  poison: "rgba(168, 85, 247, 0.5)",
  ground: "rgba(202, 138, 4, 0.5)",
  flying: "rgba(129, 140, 248, 0.5)",
  psychic: "rgba(236, 72, 153, 0.5)",
  bug: "rgba(74, 222, 128, 0.5)",
  rock: "rgba(146, 64, 14, 0.5)",
  ghost: "rgba(126, 34, 206, 0.5)",
  dragon: "rgba(67, 56, 202, 0.6)",
  dark: "rgba(31, 41, 55, 0.6)",
  steel: "rgba(107, 114, 128, 0.5)",
  fairy: "rgba(249, 168, 212, 0.5)",
};

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showStats, setShowStats] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleToggleFavorite = () => {
    toggleFavorite(pokemon);
  };

  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // Obtenir la couleur principale du type
  const primaryTypeColor = typeGlowColors[pokemon.types[0].type.name];

  return (
    <Card
      className="group bg-card border-border transition-all duration-300 overflow-hidden"
      style={{
        borderColor: "var(--border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = primaryTypeColor;
        e.currentTarget.style.boxShadow = `0 10px 40px -10px ${primaryTypeColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative bg-gradient-to-br from-muted/20 to-muted/40 p-6 text-center overflow-hidden">
          {/* Lumière de fond basée sur le type */}
          <div
            className="absolute inset-0 blur-3xl opacity-30 transition-opacity duration-300 group-hover:opacity-80"
            style={{
              background: `radial-gradient(circle at center, ${primaryTypeColor} 0%, transparent 70%)`,
            }}
          />

          {!imageLoaded && (
            <div className="absolute inset-0 flex justify-center items-center z-10">
              <div className="w-10 h-10 border-4 border-t-primary border-b-accent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="relative z-10">
            <Image
              src={
                pokemon.sprites.other["official-artwork"].front_default ||
                "/placeholder.svg?height=150&width=150"
              }
              alt={pokemon.name}
              width={128}
              height={128}
              className={`mx-auto object-contain transition-transform duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } group-hover:scale-110 drop-shadow-2xl`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 z-20 ${
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
              className="w-full !bg-[#0F172A] flex items-center gap-2 text-sm"
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
// aaa
