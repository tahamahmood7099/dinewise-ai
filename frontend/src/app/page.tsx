"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, Sparkles, Flame, Clock, MapPin, ArrowRight,
  TrendingUp, Award, Utensils, Heart, CheckCircle2,
  DollarSign, Compass, Star, RefreshCw
} from "lucide-react";
import { fetchHomepageFeed, fetchCategories } from "../lib/api";
import { HomepageFeed, CuisineCategory } from "../types";
import { useAuth } from "../context/AuthContext";
import RestaurantCarousel from "../components/RestaurantCarousel";
import SmartSearchModal from "../components/SmartSearchModal";
import SkeletonCard from "../components/SkeletonCard";

export default function HomePage() {
  const { user } = useAuth();
  const [feed, setFeed] = useState<HomepageFeed | null>(null);
  const [categories, setCategories] = useState<CuisineCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const loadFeed = () => {
    setIsLoading(true);
    Promise.all([fetchHomepageFeed(user?.id), fetchCategories()])
      .then(([feedData, catsData]) => {
        setFeed(feedData);
        setCategories(catsData || []);
      })
      .catch((err) => console.error("Error loading homepage feed", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadFeed();
  }, [user?.id, user?.email]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section: DineWise AI Discovery */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white p-6 sm:p-12 border border-orange-500/20 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI-POWERED HYDERABAD RESTAURANT INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Discover Restaurants Made for Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              Taste & Palate
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed">
            {user
              ? `Namaste & Adaab, ${user.name}! DineWise AI recommendation engine is calibrated for your ${user.dietary_pref || "dining"} preferences (${user.preferred_cuisines ? user.preferred_cuisines.join(", ") : "Hyderabad cuisines"}).`
              : "Slow dum-cooked Biryanis in Secunderabad, pure-veg tiffins in Banjara Hills, and fine dining Italian in Jubilee Hills—curated by hybrid machine learning."}
          </p>

          {/* Large Interactive Smart Search Trigger */}
          <div className="pt-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full sm:w-auto min-w-[320px] sm:min-w-[480px] flex items-center justify-between px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-slate-200 transition-all text-sm shadow-2xl group"
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="text-slate-300 font-medium truncate">
                  Search &quot;Biryani under 500 in Tolichowki&quot;...
                </span>
              </div>
              <span className="px-3.5 py-1.5 bg-orange-600 text-white font-bold text-xs rounded-xl shadow">
                NLP Search
              </span>
            </button>
          </div>

          {/* Hyderabad Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Hyderabad-First Iconic Listings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Explainable Hybrid Match (α=0.6, β=0.4)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Customer Behavior Intelligence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Categories Pills Row */}
      {categories.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Browse by Cuisine
            </h3>
            <Link
              href="/restaurants"
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              View All Cuisines →
            </Link>
          </div>

          <div
            className="flex gap-3 overflow-x-auto scrollbar-none pb-2 pt-1"
            style={{ scrollbarWidth: "none" }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/restaurants?cuisine=${encodeURIComponent(cat.name)}`}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/60 hover:bg-orange-50/50 dark:hover:bg-orange-950/30 shadow-sm transition-all flex-shrink-0 group"
              >
                {cat.image && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                )}
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-orange-600">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Recommendation Feeds or Skeleton Loading */}
      {isLoading ? (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-48 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      ) : feed && (
        <div className="space-y-8">
          {/* 1. 🤖 AI Picks For You (Personalized Hybrid Engine) */}
          <RestaurantCarousel
            title="🤖 AI Picks For You"
            subtitle={`Personalized for ${user?.name || "You"} based on Hybrid scoring (0.6 × Content + 0.4 × Collaborative)`}
            items={feed.picked_for_you}
            badge="Personalized Hybrid"
            viewAllLink="/restaurants"
          />

          {/* 2. 🔥 Trending in Hyderabad */}
          <RestaurantCarousel
            title="🔥 Trending in Hyderabad"
            subtitle="Most visited and highly reviewed dining spots across the city"
            items={feed.trending_hyderabad}
            badge="Trending"
            viewAllLink="/restaurants"
          />

          {/* 3. ⭐ Top Rated Restaurants */}
          <RestaurantCarousel
            title="⭐ Top Rated (4.8+ Stars)"
            subtitle="Acclaimed culinary landmarks with exceptional foodie ratings"
            items={feed.top_rated}
            badge="Top Rated"
            viewAllLink="/restaurants?min_rating=4.7"
          />

          {/* 4. 💰 Great Places Under ₹500 */}
          <RestaurantCarousel
            title="💰 Great Places Under ₹500"
            subtitle="High quality, pocket-friendly meals for two in Hyderabad"
            items={feed.budget_friendly}
            badge="Budget Friendly"
            viewAllLink="/restaurants?max_price=550"
          />

          {/* 5. 📍 Near Your Preferred Area */}
          <RestaurantCarousel
            title="📍 Near Your Preferred Dining Zone"
            subtitle="Handpicked dining hotspots located near your preferred areas"
            items={feed.near_location}
            badge="Nearby"
            viewAllLink="/restaurants"
          />

          {/* 6. ✨ Explore Something New */}
          <RestaurantCarousel
            title="✨ Explore Something New"
            subtitle="Diverse cuisine recommendations to expand your culinary horizons"
            items={feed.explore_new}
            badge="Discovery"
            viewAllLink="/restaurants"
          />
        </div>
      )}

      {/* Smart Search Modal */}
      <SmartSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
