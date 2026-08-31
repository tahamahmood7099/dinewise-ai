"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, Store } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";
import RestaurantCard from "../../components/RestaurantCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Your Saved Favorites List is Empty
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Save your favorite Hyderabadi biryani hotspots, pure-veg cafes, and fine dining destinations to calibrate your AI recommendations!
        </p>
        <Link
          href="/restaurants"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md"
        >
          <span>Explore Hyderabad Restaurants</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          <span>My Saved Favorite Restaurants ({favorites.length} Places)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your saved dining destinations actively weighting your personalized recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {favorites.map((rest) => (
          <RestaurantCard key={rest.id} restaurant={rest} />
        ))}
      </div>
    </div>
  );
}
