"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, TrendingDown, Minus } from "lucide-react";

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

interface PokemonComparisonProps {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
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

export default function PokemonComparison({
  pokemon1,
  pokemon2,
}: PokemonComparisonProps) {
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getStatComparison = (stat1: number, stat2: number) => {
    if (stat1 > stat2) return "higher";
    if (stat1 < stat2) return "lower";
    return "equal";
  };

  const getComparisonIcon = (comparison: string) => {
    switch (comparison) {
      case "higher":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "lower":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTotalStats = (pokemon: Pokemon) => {
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  };

  const getWinner = () => {
    const total1 = getTotalStats(pokemon1);
    const total2 = getTotalStats(pokemon2);
    if (total1 > total2) return 1;
    if (total2 > total1) return 2;
    return 0;
  };

  const winner = getWinner();

  return (
    <div className="space-y-8">
      {/* Winner Banner */}
      {winner > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="py-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-primary" />
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Statistical Winner
              </h3>
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xl text-primary font-semibold">
              {capitalizeFirst(winner === 1 ? pokemon1.name : pokemon2.name)} (
              {getTotalStats(winner === 1 ? pokemon1 : pokemon2)} total stats)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pokemon Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[pokemon1, pokemon2].map((pokemon, index) => (
          <Card
            key={pokemon.id}
            className={`bg-card border-border ${
              winner === index + 1 ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardContent className="p-6 text-center">
              <img
                src={
                  pokemon.sprites.other["official-artwork"].front_default ||
                  "/placeholder.svg?height=150&width=150"
                }
                alt={pokemon.name}
                className="w-32 h-32 mx-auto object-contain mb-4"
              />
              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {capitalizeFirst(pokemon.name)}
              </h3>
              <p className="text-muted-foreground mb-4">
                #{pokemon.id.toString().padStart(3, "0")}
              </p>

              <div className="flex justify-center gap-2 mb-4">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type.type.name}
                    className={`${
                      typeColors[type.type.name]
                    } text-white border-0`}
                  >
                    {capitalizeFirst(type.type.name)}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Height</p>
                  <p className="font-semibold">{pokemon.height / 10}m</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Weight</p>
                  <p className="font-semibold">{pokemon.weight / 10}kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Comparison */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle
            className="text-center text-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Stats Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {pokemon1.stats.map((stat1, index) => {
            const stat2 = pokemon2.stats[index];
            const comparison1 = getStatComparison(
              stat1.base_stat,
              stat2.base_stat
            );
            const comparison2 = getStatComparison(
              stat2.base_stat,
              stat1.base_stat
            );
            const maxStat = Math.max(stat1.base_stat, stat2.base_stat);

            return (
              <div key={stat1.stat.name} className="space-y-2">
                <h4 className="text-center font-semibold capitalize text-lg">
                  {stat1.stat.name.replace("-", " ")}
                </h4>

                <div className="grid grid-cols-3 gap-4 items-center">
                  {/* Pokemon 1 */}
                  <div className="text-right space-y-2">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold text-lg">
                        {stat1.base_stat}
                      </span>
                      {getComparisonIcon(comparison1)}
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-primary transition-all duration-1000"
                        style={{
                          width: `${
                            (stat1.base_stat / Math.max(maxStat, 150)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <span className="text-2xl font-bold text-muted-foreground">
                      VS
                    </span>
                  </div>

                  {/* Pokemon 2 */}
                  <div className="text-left space-y-2">
                    <div className="flex items-center gap-2">
                      {getComparisonIcon(comparison2)}
                      <span className="font-bold text-lg">
                        {stat2.base_stat}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-accent transition-all duration-1000"
                        style={{
                          width: `${
                            (stat2.base_stat / Math.max(maxStat, 150)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total Stats */}
          <div className="pt-6 border-t border-border">
            <h4
              className="text-center font-bold text-xl mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Total Base Stats
            </h4>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  {getTotalStats(pokemon1)}
                </span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-muted-foreground">
                  VS
                </span>
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold text-accent">
                  {getTotalStats(pokemon2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
