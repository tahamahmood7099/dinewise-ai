"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Restaurant } from "../types";
import { fetchFavorites, toggleFavorite as apiToggleFavorite } from "../lib/api";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: Restaurant[];
  favoritesCount: number;
  isFavorite: (restaurantId: number) => boolean;
  toggleFav: (restaurant: Restaurant) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Restaurant[]>([]);

  const refreshFavorites = async () => {
    try {
      const data = await fetchFavorites(user?.id);
      setFavorites(data || []);
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, [user?.id]);

  const isFavorite = (restaurantId: number) => {
    return favorites.some((r) => r.id === restaurantId);
  };

  const toggleFav = async (restaurant: Restaurant) => {
    const currentlyFav = isFavorite(restaurant.id);
    
    // Optimistic UI update
    if (currentlyFav) {
      setFavorites((prev) => prev.filter((r) => r.id !== restaurant.id));
    } else {
      setFavorites((prev) => [{ ...restaurant, is_favorite: true }, ...prev]);
    }

    try {
      await apiToggleFavorite(restaurant.id, user?.id);
    } catch (e) {
      console.error("Toggle favorite failed", e);
      await refreshFavorites();
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        toggleFav,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};
