"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import PokemonNavbar from "@/components/pokemon-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Scale, Ruler } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import Image from "next/image";

interface PokemonDetails {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    other: {
      "official-artwork": { front_default: string };
      home: { front_default: string };
    };
  };
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  height: number;
  weight: number;
  base_experience: number;
  species: { url: string };
}

interface Species {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  evolution_chain: { url: string };
  varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
}

interface EvolutionChain {
  species: { name: string; url: string };
  evolves_to: EvolutionChain[];
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

export default function PokemonDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [species, setSpecies] = useState<Species | null>(null);
  const [evolutions, setEvolutions] = useState<{ name: string; url: string }[]>(
    []
  );
  const [megaForms, setMegaForms] = useState<
    { name: string; sprite: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!params.id) return;

      try {
        setIsLoading(true);

        const pokemonResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${params.id}`
        );
        const pokemonData: PokemonDetails = await pokemonResponse.json();
        setPokemon(pokemonData);

        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData: Species = await speciesResponse.json();
        setSpecies(speciesData);

        // Evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData: { chain: EvolutionChain } =
          await evolutionResponse.json();
        setEvolutions(extractEvolutions(evolutionData.chain));

        // Mega Evolutions
        const megaCandidates = speciesData.varieties.filter((v) =>
          v.pokemon.name.includes("mega")
        );
        const megaData = await Promise.all(
          megaCandidates.map(async (v) => {
            const res = await fetch(v.pokemon.url);
            const data = await res.json();
            return {
              name: v.pokemon.name,
              sprite: data.sprites.other["home"].front_default,
            };
          })
        );
        setMegaForms(megaData);

        setTimeout(() => animatePageEntrance(), 100);
      } catch (error) {
        console.error("Error fetching Pokemon details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [params.id]);

  const extractEvolutions = (
    chain: EvolutionChain
  ): { name: string; url: string }[] => {
    const evoArr: { name: string; url: string }[] = [];
    let current: EvolutionChain | null = chain;
    while (current) {
      evoArr.push(current.species);
      current = current.evolves_to.length > 0 ? current.evolves_to[0] : null;
    }
    return evoArr;
  };

  const animatePageEntrance = () => {
    const tl = gsap.timeline();
    tl.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.5, rotation: -10 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    ).fromTo(
      ".detail-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      "-=0.4"
    );
  };

  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getStatColor = (statValue: number) => {
    if (statValue >= 100) return "bg-green-500";
    if (statValue >= 70) return "bg-yellow-500";
    if (statValue >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getDescription = () => {
    if (!species) return "";
    const englishEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    return englishEntry?.flavor_text.replace(/\f/g, " ") || "";
  };

  const handleToggleFavorite = () => {
    if (pokemon) toggleFavorite(pokemon);
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-background">
        <PokemonNavbar />
        <div className="pt-24 flex justify-center items-center min-h-[60vh]">
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
      </div>
    );

  if (!pokemon)
    return (
      <div className="min-h-screen bg-background">
        <PokemonNavbar />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Pokémon not found
          </h1>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PokemonNavbar />
      <div className="pt-24 pb-12 flex-1">
        <div className="max-w-6xl mx-auto px-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
          </Button>

          <div
            ref={containerRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full"
          >
            {/* Left Column */}
            <div className="space-y-6">
              <Card className="detail-card bg-card border-border overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="relative">
                    <Image
                      ref={imageRef}
                      src={
                        pokemon.sprites.other["home"].front_default ||
                        "/placeholder.svg"
                      }
                      alt={pokemon.name}
                      width={280}
                      height={280}
                      className="mx-auto object-contain"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleFavorite}
                      className={`absolute top-0 right-0 p-2 rounded-full transition-all duration-200 ${
                        isFavorite(pokemon.id)
                          ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                          : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-200 ${
                          isFavorite(pokemon.id) ? "fill-current scale-110" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="mt-6">
                    <h1
                      className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {capitalizeFirst(pokemon.name)}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      #{pokemon.id.toString().padStart(3, "0")}
                    </p>
                    <div className="flex justify-center gap-2 mt-4 flex-wrap">
                      {pokemon.types.map((t) => (
                        <Badge
                          key={t.type.name}
                          className={`${
                            typeColors[t.type.name]
                          } text-white border-0 text-sm font-medium px-4 py-1`}
                        >
                          {capitalizeFirst(t.type.name)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mega Evolutions */}
              {megaForms.length > 0 && (
                <Card className="detail-card bg-card border-border">
                  <CardHeader>
                    <CardTitle style={{ fontFamily: "var(--font-heading)" }}>
                      Mega Evolutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap justify-center gap-8">
                      {megaForms.map((mega) => (
                        <div
                          key={mega.name}
                          className="flex flex-col items-center"
                        >
                          <Image
                            src={mega.sprite}
                            alt={mega.name}
                            width={150}
                            height={150}
                            className="object-contain"
                          />
                          <p className="text-sm mt-1 font-medium">
                            {capitalizeFirst(
                              mega.name.replace("mega-", "Mega ")
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Physical Stats */}
              <Card className="detail-card bg-card border-border">
                <CardHeader>
                  <CardTitle
                    className="flex items-center gap-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <Scale className="w-5 h-5 text-primary" /> Physical Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Ruler className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="font-semibold">{pokemon.height / 10}m</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Scale className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-semibold">{pokemon.weight / 10}kg</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Base Experience
                    </p>
                    <p className="font-semibold text-lg">
                      {pokemon.base_experience}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-6 h-full">
              {/* Description */}
              {species && (
                <Card className="detail-card bg-card border-border">
                  <CardHeader>
                    <CardTitle style={{ fontFamily: "var(--font-heading)" }}>
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-muted-foreground leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {getDescription()}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Base Stats */}
              <Card className="detail-card bg-card border-border">
                <CardHeader>
                  <CardTitle style={{ fontFamily: "var(--font-heading)" }}>
                    Base Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">
                          {stat.stat.name.replace("-", " ")}
                        </span>
                        <span className="font-bold">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 ${getStatColor(
                            stat.base_stat
                          )}`}
                          style={{
                            width: `${Math.min(
                              (stat.base_stat / 150) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Abilities */}
              <Card className="detail-card bg-card border-border">
                <CardHeader>
                  <CardTitle style={{ fontFamily: "var(--font-heading)" }}>
                    Abilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {pokemon.abilities.map((ability, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge
                        variant={ability.is_hidden ? "secondary" : "outline"}
                      >
                        {capitalizeFirst(
                          ability.ability.name.replace("-", " ")
                        )}
                      </Badge>
                      {ability.is_hidden && (
                        <span className="text-xs text-muted-foreground">
                          (Hidden)
                        </span>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Evolution Chain */}
              {evolutions.length > 1 && (
                <Card className="detail-card bg-card border-border mt-auto">
                  <CardHeader>
                    <CardTitle style={{ fontFamily: "var(--font-heading)" }}>
                      Evolution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap justify-center items-center gap-8 w-full">
                      {evolutions.map((evo, index) => (
                        <div
                          key={evo.name}
                          className="flex flex-col items-center relative"
                        >
                          <div className="bg-card/80 border border-border rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 w-[120px] h-[120px] flex items-center justify-center">
                            <Image
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
                                evo.url.split("/")[6]
                              }.png`}
                              alt={evo.name}
                              width={100}
                              height={100}
                              className="object-contain"
                            />
                          </div>
                          <p className="mt-2 font-medium text-center">
                            {capitalizeFirst(evo.name)}
                          </p>
                          {/* {index < evolutions.length - 1 && (
                            <div className="absolute right-[-2.5rem] top-1/2 transform -translate-y-1/2 text-2xl text-muted-foreground hidden sm:block">
                              ➡️
                            </div>
                          )} */}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
