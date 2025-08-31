"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, Zap } from "lucide-react";
import PokemonNavbar from "@/components/pokemon-navbar";
import PokemonSelector from "@/components/pokemon-selector";
import PokemonComparison from "@/components/pokemon-comparison";

interface Pokemon {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: {
    other: {
      "official-artwork": { front_default: string };
    };
  };
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  height: number;
  weight: number;
  base_experience: number;
}

export default function ComparisonPage() {
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs pour animations
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const randomButtonRef = useRef<HTMLButtonElement>(null);

  // Animation d'entrée générale
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
    if (buttonsRef.current) {
      gsap.fromTo(
        buttonsRef.current.children,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
        }
      );
    }
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }
  }, []);

  // Animation du comparateur quand les deux Pokémon sont sélectionnés
  useEffect(() => {
    if (pokemon1 && pokemon2 && comparisonRef.current) {
      gsap.fromTo(
        comparisonRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [pokemon1, pokemon2]);

  // Animation hover pour Random Battle
  useEffect(() => {
    if (!randomButtonRef.current) return;

    const button = randomButtonRef.current;

    const hoverEnter = () => {
      gsap.to(button, { scale: 1.05, duration: 0.2, ease: "power2.out" });
    };
    const hoverLeave = () => {
      gsap.to(button, { scale: 1, duration: 0.2, ease: "power2.out" });
    };

    button.addEventListener("mouseenter", hoverEnter);
    button.addEventListener("mouseleave", hoverLeave);

    return () => {
      button.removeEventListener("mouseenter", hoverEnter);
      button.removeEventListener("mouseleave", hoverLeave);
    };
  }, []);

  // Animation click
  const animateButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    gsap.fromTo(
      target,
      { scale: 0.9 },
      { scale: 1, duration: 0.2, ease: "back.out(2)" }
    );
  };

  const fetchPokemon = async (id: number): Promise<Pokemon | null> => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!response.ok)
        throw new Error(`Failed to fetch Pokémon with id ${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Comparaison aléatoire
  const handleRandomComparison = async (
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e) animateButtonClick(e);
    setIsLoading(true);
    try {
      const randomId1 = Math.floor(Math.random() * 1010) + 1;
      let randomId2;
      do {
        randomId2 = Math.floor(Math.random() * 1010) + 1;
      } while (randomId2 === randomId1);

      const [data1, data2] = await Promise.all([
        fetchPokemon(randomId1),
        fetchPokemon(randomId2),
      ]);

      if (data1 && data2) {
        setPokemon1(data1);
        setPokemon2(data2);
      }
    } catch (error) {
      console.error("Error fetching random Pokémon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser
  const clearComparison = () => {
    setPokemon1(null);
    setPokemon2(null);
  };

  // Swap
  const swapPokemon = () => {
    if (pokemon1 && pokemon2) {
      const temp = pokemon1;
      setPokemon1(pokemon2);
      setPokemon2(temp);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PokemonNavbar />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent">
              Pokémon Comparison
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare two Pokémon side-by-side to see their strengths and
              weaknesses
            </p>
          </div>

          {/* Action Buttons */}
          <div
            ref={buttonsRef}
            className="flex justify-center gap-4 mb-8 flex-wrap"
          >
            <Button
              ref={randomButtonRef}
              onClick={handleRandomComparison}
              disabled={isLoading}
              className="px-6 py-3 bg-accent hover:bg-accent/90 glow-primary rounded-full font-semibold"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Random Battle
            </Button>

            {(pokemon1 || pokemon2) && (
              <Button
                onClick={clearComparison}
                variant="outline"
                className="px-6 py-3 rounded-full font-semibold bg-transparent"
              >
                Clear All
              </Button>
            )}

            {pokemon1 && pokemon2 && (
              <Button
                onClick={swapPokemon}
                variant="outline"
                className="px-6 py-3 rounded-full font-semibold bg-transparent"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Swap
              </Button>
            )}
          </div>

          {/* Pokémon Selectors */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-center">
                  <Zap className="w-5 h-5 inline mr-2 text-primary" />
                  Fighter 1
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PokemonSelector
                  selectedPokemon={pokemon1}
                  onPokemonSelect={(p) =>
                    !p || p?.id !== pokemon2?.id ? setPokemon1(p) : null
                  }
                />
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-center">
                  <Zap className="w-5 h-5 inline mr-2 text-accent" />
                  Fighter 2
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PokemonSelector
                  selectedPokemon={pokemon2}
                  onPokemonSelect={(p) =>
                    !p || p?.id !== pokemon1?.id ? setPokemon2(p) : null
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-4 h-4 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-4 h-4 bg-chart-1 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )}

          {/* Comparison Display */}
          {pokemon1 && pokemon2 && !isLoading && (
            <div ref={comparisonRef}>
              <PokemonComparison pokemon1={pokemon1} pokemon2={pokemon2} />
            </div>
          )}

          {/* Empty State */}
          {!pokemon1 && !pokemon2 && !isLoading && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⚔️</div>
              <h3 className="text-2xl font-bold mb-2">Ready for Battle?</h3>
              <p className="text-muted-foreground mb-6">
                Select two Pokémon to compare their stats and abilities
              </p>
              <Button
                ref={randomButtonRef}
                onClick={handleRandomComparison}
                className="px-8 py-3 bg-primary hover:bg-primary/90 glow-primary rounded-full font-semibold"
              >
                Start Random Battle
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
