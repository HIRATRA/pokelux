"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { gsap } from "gsap";

interface FilterPanelProps {
  types: string[];
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400 hover:bg-gray-500",
  fire: "bg-red-500 hover:bg-red-600",
  water: "bg-blue-500 hover:bg-blue-600",
  electric: "bg-yellow-400 hover:bg-yellow-500",
  grass: "bg-green-500 hover:bg-green-600",
  ice: "bg-blue-300 hover:bg-blue-400",
  fighting: "bg-red-700 hover:bg-red-800",
  poison: "bg-purple-500 hover:bg-purple-600",
  ground: "bg-yellow-600 hover:bg-yellow-700",
  flying: "bg-indigo-400 hover:bg-indigo-500",
  psychic: "bg-pink-500 hover:bg-pink-600",
  bug: "bg-green-400 hover:bg-green-500",
  rock: "bg-yellow-800 hover:bg-yellow-900",
  ghost: "bg-purple-700 hover:bg-purple-800",
  dragon: "bg-indigo-700 hover:bg-indigo-800",
  dark: "bg-gray-800 hover:bg-gray-900",
  steel: "bg-gray-500 hover:bg-gray-600",
  fairy: "bg-pink-300 hover:bg-pink-400",
};

export default function FilterPanel({
  types,
  selectedTypes,
  onTypesChange,
}: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation du panel (scale fluide)
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }

    // Animation des badges en cascade avec scale
    if (badgesRef.current) {
      gsap.fromTo(
        badgesRef.current.children,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }
  }, []);

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    onTypesChange([]);
  };

  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      ref={panelRef}
      className="bg-card border border-border rounded-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold text-card-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Filter by Type
        </h3>
        {selectedTypes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2" ref={badgesRef}>
        {types.map((type) => (
          <Badge
            key={type}
            variant={selectedTypes.includes(type) ? "default" : "outline"}
            className={`cursor-pointer transition-all duration-200 ${
              selectedTypes.includes(type)
                ? `${typeColors[type]} text-white border-0`
                : "border-border hover:border-primary text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => toggleType(type)}
          >
            {capitalizeFirst(type)}
          </Badge>
        ))}
      </div>

      {selectedTypes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Filtering by: {selectedTypes.map(capitalizeFirst).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
