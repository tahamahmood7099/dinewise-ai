"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { fetchRecentlyViewed } from "../../lib/api";
import { Restaurant } from "../../types";
import { useAuth } from "../../context/AuthContext";
import RestaurantCard from "../../components/RestaurantCard";

export default function RecentlyViewedPage() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchRecentlyViewed(user?.id)
      .then((res) => setRestaurants(res || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-7 h-7 text-orange-600" />
          <span>Recently Viewed Restaurants</span>
        </h1>
        <p className="text-xs text-slate-500">
          Dining spots you recently explored across Hyderabad
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading your history...</p>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No recently viewed restaurants yet.
          </p>
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow"
          >
            <span>Explore Restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {restaurants.map((rest) => (
            <RestaurantCard key={rest.id} restaurant={rest} />
          ))}
        </div>
      )}
    </div>
  );
}
