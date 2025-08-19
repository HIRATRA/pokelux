"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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
  base_experience?: number;
}

interface FavoritesContextType {
  favorites: Pokemon[];
  addToFavorites: (pokemon: Pokemon) => void;
  removeFromFavorites: (pokemonId: number) => void;
  isFavorite: (pokemonId: number) => boolean;
  toggleFavorite: (pokemon: Pokemon) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("pokemon-favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("pokemon-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addToFavorites = (pokemon: Pokemon) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === pokemon.id)) {
        return prev;
      }
      return [...prev, pokemon];
    });
  };

  const removeFromFavorites = (pokemonId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== pokemonId));
  };

  const isFavorite = (pokemonId: number) => {
    return favorites.some((fav) => fav.id === pokemonId);
  };

  const toggleFavorite = (pokemon: Pokemon) => {
    if (isFavorite(pokemon.id)) {
      removeFromFavorites(pokemon.id);
    } else {
      addToFavorites(pokemon);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
