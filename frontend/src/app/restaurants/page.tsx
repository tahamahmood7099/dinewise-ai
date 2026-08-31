"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Sparkles, MapPin, Store, ArrowUpDown, Star, X, RotateCcw } from "lucide-react";
import { fetchRestaurants, fetchCategories } from "../../lib/api";
import { Restaurant, CuisineCategory } from "../../types";
import { useAuth } from "../../context/AuthContext";
import RestaurantCard from "../../components/RestaurantCard";
import SkeletonCard from "../../components/SkeletonCard";

const HYDERABAD_AREAS = [
  "All", "Banjara Hills", "Jubilee Hills", "Madhapur", "Gachibowli",
  "Charminar", "Tolichowki", "Secunderabad", "Hitech City", "Kukatpally"
];

function RestaurantsDirectoryContent() {
  const searchParams = useSearchParams();
  const initialArea = searchParams.get("area") || "All";
  const initialCuisine = searchParams.get("cuisine") || "All";
  const initialMaxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined;
  const initialMinRating = searchParams.get("min_rating") ? Number(searchParams.get("min_rating")) : undefined;

  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<CuisineCategory[]>([]);
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [vegType, setVegType] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialMaxPrice);
  const [minRating, setMinRating] = useState<number | undefined>(initialMinRating);
  const [sortBy, setSortBy] = useState("rating");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchRestaurants({
      area: selectedArea !== "All" ? selectedArea : undefined,
      cuisine: selectedCuisine !== "All" ? selectedCuisine : undefined,
      vegType: vegType !== "all" ? vegType : undefined,
      maxPrice: maxPrice,
      minRating: minRating,
      sortBy: sortBy,
      userId: user?.id
    })
      .then((res) => setRestaurants(res || []))
      .catch((err) => console.error("Error fetching restaurants", err))
      .finally(() => setIsLoading(false));
  }, [selectedArea, selectedCuisine, vegType, maxPrice, minRating, sortBy, user?.id]);

  const resetFilters = () => {
    setSelectedArea("All");
    setSelectedCuisine("All");
    setVegType("all");
    setMaxPrice(undefined);
    setMinRating(undefined);
    setSortBy("rating");
  };

  const hasActiveFilters =
    selectedArea !== "All" ||
    selectedCuisine !== "All" ||
    vegType !== "all" ||
    maxPrice !== undefined ||
    minRating !== undefined;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Hyderabad Restaurant Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Discover authentic culinary hotspots, heritage biryani legends & pure-veg havens across Hyderabad
        </p>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        {/* Area */}
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-500">Area:</span>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none"
          >
            {HYDERABAD_AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Cuisine */}
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-500">Cuisine:</span>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none"
          >
            <option value="All">All Cuisines</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Veg Type */}
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-500">Dietary:</span>
          <select
            value={vegType}
            onChange={(e) => setVegType(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none"
          >
            <option value="all">All Food Types</option>
            <option value="veg">Pure Veg Only</option>
            <option value="non_veg">Non-Vegetarian</option>
          </select>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-500">Budget:</span>
          <select
            value={maxPrice || "all"}
            onChange={(e) => setMaxPrice(e.target.value === "all" ? undefined : Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none"
          >
            <option value="all">Any Price</option>
            <option value="550">Under ₹550 for two</option>
            <option value="1000">Under ₹1000 for two</option>
            <option value="1500">Under ₹1500 for two</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none"
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="ml-auto text-orange-600 font-bold hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Restaurant Grid or Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No restaurants match your selected filter combination.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-xs shadow hover:bg-orange-700 transition"
          >
            Reset All Filters
          </button>
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

export default function RestaurantsDirectoryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading restaurants directory...</div>}>
      <RestaurantsDirectoryContent />
    </Suspense>
  );
}
