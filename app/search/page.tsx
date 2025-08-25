"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import PokemonNavbar from "@/components/pokemon-navbar";
import SearchBar from "@/components/search-bar";
import PokemonCard from "@/components/pokemon-card";
import FilterPanel from "@/components/filter-panel";
import { Button } from "@/components/ui/button";

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
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

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const pokemonTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  const searchPokemon = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      if (response.ok) {
        const pokemon = await response.json();
        setSearchResults([pokemon]);
        animateResults();
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching Pokemon:", error);
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  const getRandomPokemon = async () => {
    setIsLoading(true);
    const randomIds = Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 1010) + 1
    );

    try {
      const promises = randomIds.map((id) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
          res.json()
        )
      );
      const results = await Promise.all(promises);
      setSearchResults(results);
      animateResults();
    } catch (error) {
      console.error("Error fetching random Pokemon:", error);
    }
    setIsLoading(false);
  };

  const animateResults = () => {
    if (resultsRef.current) {
      gsap.fromTo(
        resultsRef.current.children,
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
  };

  const filteredResults = searchResults.filter((pokemon) => {
    if (selectedTypes.length === 0) return true;
    return pokemon.types.some((typeObj) =>
      selectedTypes.includes(typeObj.type.name)
    );
  });

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
              Discover Pokémon
            </h1>
            <p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Search for your favorite Pokémon or discover new ones with our
              elegant interface
            </p>
          </div>

          {/* Search and Random Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
            <SearchBar
              onSearch={searchPokemon}
              value={searchQuery}
              onChange={setSearchQuery}
              isLoading={isLoading}
            />
            <Button
              onClick={getRandomPokemon}
              disabled={isLoading}
              className="px-8 py-3 bg-accent hover:bg-accent/90 glow-primary rounded-full font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Random 12
            </Button>
          </div>

          {/* Filters */}
          <FilterPanel
            types={pokemonTypes}
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
          />

          {/* Results */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-chart-1 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )}

          {!isLoading && filteredResults.length > 0 && (
            <div
              ref={resultsRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {filteredResults.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          )}

          {!isLoading &&
            searchQuery &&
            filteredResults.length === 0 &&
            searchResults.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  No Pokémon found. Try a different search term.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
