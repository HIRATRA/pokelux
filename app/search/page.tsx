"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
      "official-artwork": { front_default: string };
    };
  };
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
}

interface PokemonListItem {
  name: string;
  url: string;
}

export default function SearchPage() {
  const [allPokemonList, setAllPokemonList] = useState<PokemonListItem[]>([]);
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  // Refs pour animations
  const headerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Charger la liste complète des Pokémon au montage
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1010"
        );
        const data = await response.json();
        setAllPokemonList(data.results);
      } catch (error) {
        console.error("Error fetching all Pokémon list:", error);
      }
    };
    fetchAllPokemon();
  }, []);

  // Animations
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    }
    if (searchBarRef.current) {
      gsap.fromTo(
        searchBarRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current.children,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: 0.6,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)",
        }
      );
    }
  }, []);

  // Recherche locale + fetch détails des résultats
  const searchPokemon = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Filtrer la liste des noms
        const matched = allPokemonList
          .filter((p) => p.name.toLowerCase().startsWith(query.toLowerCase()))
          .slice(0, 12); // Limiter à 12 pour éviter trop de fetch

        // Fetch des détails pour chaque Pokémon
        const detailed = await Promise.all(
          matched.map(async (p) => {
            const res = await fetch(p.url);
            return res.json() as Promise<Pokemon>;
          })
        );

        setSearchResults(detailed);
        animateResults();
      } catch (error) {
        console.error("Error searching Pokémon:", error);
        setSearchResults([]);
      }
      setIsLoading(false);
    },
    [allPokemonList]
  );

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => searchPokemon(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchPokemon]);

  const getRandomPokemon = async () => {
    setIsLoading(true);
    const randomIds = Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 1010) + 1
    );

    try {
      const results = await Promise.all(
        randomIds.map((id) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
            res.json()
          )
        )
      );
      setSearchResults(results);
      animateResults();
    } catch (error) {
      console.error("Error fetching random Pokémon:", error);
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

  // Filtrage dynamique
  const filteredResults = searchResults.filter((pokemon) => {
    if (selectedTypes.length === 0) return true;
    return pokemon.types.some((typeObj: { type: { name: string } }) =>
      selectedTypes.includes(typeObj.type.name)
    );
  });

  const availableTypes = Array.from(
    new Set(
      searchResults.flatMap((pokemon) =>
        pokemon.types.map((t: { type: { name: string } }) => t.type.name)
      )
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <PokemonNavbar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12" ref={headerRef}>
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

          {/* Search & Random */}
          <div
            className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8"
            ref={searchBarRef}
          >
            <SearchBar
              onSearch={searchPokemon}
              value={searchQuery}
              onChange={setSearchQuery}
              isLoading={isLoading}
            />
            <div ref={buttonRef} className="flex gap-4">
              <Button
                onClick={getRandomPokemon}
                disabled={isLoading}
                className="px-8 py-3 bg-accent hover:bg-accent/90 glow-primary rounded-full font-semibold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Random 12
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            types={availableTypes}
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
          />

          {/* Loading */}
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

          {/* Results */}
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

          {/* No results */}
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
