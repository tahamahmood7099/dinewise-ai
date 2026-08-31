"use client";

import React, { createContext, useContext } from "react";
import { useFavorites } from "./FavoritesContext";

interface CartWishlistContextType {
  cart: any[];
  wishlist: any[];
  cartCount: number;
  wishlistCount: number;
  cartSubtotal: number;
  addToCart: (item: any) => Promise<void>;
  updateQuantity: (id: number, qty: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  toggleWishlist: (item: any) => Promise<void>;
  isInWishlist: (id: number) => boolean;
  clearCart: () => void;
  refreshCartAndWishlist: () => Promise<void>;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { favorites, isFavorite, toggleFav, refreshFavorites } = useFavorites();

  return (
    <CartWishlistContext.Provider
      value={{
        cart: [],
        wishlist: favorites,
        cartCount: 0,
        wishlistCount: favorites.length,
        cartSubtotal: 0,
        addToCart: async () => {},
        updateQuantity: async () => {},
        removeFromCart: async () => {},
        toggleWishlist: async (item: any) => {
          await toggleFav(item);
        },
        isInWishlist: (id: number) => isFavorite(id),
        clearCart: () => {},
        refreshCartAndWishlist: refreshFavorites,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) return {
    cart: [],
    wishlist: [],
    cartCount: 0,
    wishlistCount: 0,
    cartSubtotal: 0,
    addToCart: async () => {},
    updateQuantity: async () => {},
    removeFromCart: async () => {},
    toggleWishlist: async () => {},
    isInWishlist: () => false,
    clearCart: () => {},
    refreshCartAndWishlist: async () => {},
  };
  return context;
};
