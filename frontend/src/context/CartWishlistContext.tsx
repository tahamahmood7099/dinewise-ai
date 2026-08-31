"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, WishlistItem, Product } from "../types";
import {
  getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart, getWishlist, addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist, moveWishlistToCart as apiMoveToCart
} from "../lib/api";
import { useAuth } from "./AuthContext";

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addItemToCart: (product: Product, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItemFromCart: (itemId: number) => Promise<void>;
  addItemToWishlist: (product: Product) => Promise<void>;
  removeItemFromWishlist: (itemId: number) => Promise<void>;
  moveItemToCart: (wishlistItemId: number, product: Product) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  isInCart: (productId: number) => boolean;
  refreshCartAndWishlist: () => Promise<void>;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const refreshCartAndWishlist = async () => {
    try {
      const [c, w] = await Promise.all([
        getCart(user?.id),
        getWishlist(user?.id),
      ]);
      setCart(c || []);
      setWishlist(w || []);
    } catch (e) {
      console.error("Failed to load cart/wishlist", e);
    }
  };

  useEffect(() => {
    refreshCartAndWishlist();
  }, [user?.id]);

  const addItemToCart = async (product: Product, quantity: number = 1) => {
    try {
      // Optimistic update
      const existing = cart.find((i) => i.product_id === product.id);
      if (existing) {
        setCart(cart.map((i) => i.product_id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      } else {
        const tempItem: CartItem = { id: Date.now(), product_id: product.id, quantity, product };
        setCart([...cart, tempItem]);
      }
      setIsCartDrawerOpen(true);
      await apiAddToCart(product.id, quantity, user?.id);
      await refreshCartAndWishlist();
    } catch (e) {
      console.error(e);
      await refreshCartAndWishlist();
    }
  };

  const updateItemQuantity = async (itemId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        setCart(cart.filter((i) => i.id !== itemId));
        await apiRemoveFromCart(itemId);
      } else {
        setCart(cart.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
        await apiUpdateCartItem(itemId, quantity);
      }
      await refreshCartAndWishlist();
    } catch (e) {
      console.error(e);
      await refreshCartAndWishlist();
    }
  };

  const removeItemFromCart = async (itemId: number) => {
    try {
      setCart(cart.filter((i) => i.id !== itemId));
      await apiRemoveFromCart(itemId);
      await refreshCartAndWishlist();
    } catch (e) {
      console.error(e);
      await refreshCartAndWishlist();
    }
  };

  const addItemToWishlist = async (product: Product) => {
    try {
      const existing = wishlist.find((i) => i.product_id === product.id);
      if (!existing) {
        const tempItem: WishlistItem = { id: Date.now(), product_id: product.id, product };
        setWishlist([...wishlist, tempItem]);
        await apiAddToWishlist(product.id, user?.id);
        await refreshCartAndWishlist();
      }
    } catch (e) {
      console.error(e);
      await refreshCartAndWishlist();
    }
  };

  const removeItemFromWishlist = async (itemId: number) => {
    try {
      setWishlist(wishlist.filter((i) => i.id !== itemId));
      await apiRemoveFromWishlist(itemId);
      await refreshCartAndWishlist();
    } catch (e) {
      console.error(e);
      await refreshCartAndWishlist();
    }
  };

  const moveItemToCart = async (wishlistItemId: number, product: Product) => {
    try {
      setWishlist(wishlist.filter((i) => i.id !== wishlistItemId));
      await addItemToCart(product, 1);
      await apiMoveToCart(wishlistItemId);
      await refreshCartAndWishlist();
    } catch (e) {
      console.error(e);
      await refreshCartAndWishlist();
    }
  };

  const isInWishlist = (productId: number) => wishlist.some((i) => i.product_id === productId);
  const isInCart = (productId: number) => cart.some((i) => i.product_id === productId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const cartTotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        wishlistCount,
        cartTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        addItemToWishlist,
        removeItemFromWishlist,
        moveItemToCart,
        isInWishlist,
        isInCart,
        refreshCartAndWishlist,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) throw new Error("useCartWishlist must be used within a CartWishlistProvider");
  return context;
};
