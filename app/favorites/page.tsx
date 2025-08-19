"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import PokemonNavbar from "@/components/pokemon-navbar";
import PokemonCard from "@/components/pokemon-card";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (favorites.length > 0 && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [favorites.length]);

  return (
    <div className="min-h-screen bg-background">
      <PokemonNavbar />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              My Favorites
            </h1>
            <p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Your collection of favorite Pokémon, saved and ready for battle
            </p>
          </div>

          {/* Stats */}
          {favorites.length > 0 && (
            <div className="flex justify-center mb-8">
              <div className="bg-card border border-border rounded-full px-6 py-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-current" />
                <span
                  className="font-semibold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {favorites.length} Favorite{favorites.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}

          {/* Favorites Grid */}
          {favorites.length > 0 ? (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {favorites.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="text-8xl mb-4 opacity-20">💫</div>
                <Sparkles className="w-12 h-12 text-primary mx-auto animate-pulse" />
              </div>

              <h3
                className="text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                No Favorites Yet
              </h3>
              <p
                className="text-xl text-muted-foreground mb-8 max-w-md mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Start exploring and add Pokémon to your favorites by clicking
                the heart icon on any Pokémon card
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/search">
                  <Button
                    className="px-8 py-3 bg-primary hover:bg-primary/90 glow-primary rounded-full font-semibold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Discover Pokémon
                  </Button>
                </Link>
                <Link href="/comparison">
                  <Button
                    variant="outline"
                    className="px-8 py-3 rounded-full font-semibold bg-transparent"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Compare Pokémon
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
