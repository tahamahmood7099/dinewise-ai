"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles, TrendingUp, Flame, Tag, Compass,
  ArrowRight, ShieldCheck, Zap, Heart, Gift
} from "lucide-react";
import { getHomepageFeed, getCategories } from "../lib/api";
import { HomepageFeed, Category, Product } from "../types";
import { useAuth } from "../context/AuthContext";
import ProductCarousel from "../components/ProductCarousel";
import SkeletonCard from "../components/SkeletonCard";

export default function HomePage() {
  const { user } = useAuth();
  const [feed, setFeed] = useState<HomepageFeed | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [feedData, catsData] = await Promise.all([
          getHomepageFeed(user?.id).catch(() => null),
          getCategories().catch(() => []),
        ]);
        if (feedData) setFeed(feedData);
        setCategories(catsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  const getIndianGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Namaste";
    if (hour < 12) timeGreeting = "Shubh Prabhat";
    else if (hour < 17) timeGreeting = "Shubh Dopahar";
    else timeGreeting = "Shubh Sandhya";

    const userName = user?.name ? user.name.split(" ")[0] : "Shopper";
    return `${timeGreeting}, ${userName} 🙏`;
  };

  return (
    <div className="min-h-screen space-y-8 pb-16">
      {/* Top Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-amber-600 dark:from-orange-950 dark:via-slate-900 dark:to-slate-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-orange-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>{getIndianGreeting()}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              India's Most Intelligent <br className="hidden sm:inline" />
              <span className="text-amber-200">AI-Powered</span> Shopping Experience
            </h1>

            <p className="text-sm sm:text-base text-orange-50 dark:text-slate-300 max-w-xl leading-relaxed">
              Tailored for authentic Indian tastes. Powered by real-time TF-IDF content similarity, collaborative behavior matrix, and explainable AI.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-6 py-3 bg-white text-orange-600 dark:bg-orange-500 dark:text-white font-bold text-sm rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-600 transition-all shadow-lg flex items-center gap-2"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin"
                className="px-5 py-3 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white border border-white/30 font-semibold text-sm rounded-2xl transition-all flex items-center gap-2"
              >
                <span>📊 View AI Intelligence Portal</span>
              </Link>
            </div>
          </div>

          {/* Quick Highlight Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="bg-white/10 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold mb-2">
                🇮🇳
              </div>
              <h4 className="font-bold text-sm">100% Indian Context</h4>
              <p className="text-[11px] text-orange-100 dark:text-slate-400 mt-0.5">
                Authentic Biryani, Festive Sarees, boAt Audio, & Desi Ghee
              </p>
            </div>

            <div className="bg-white/10 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-emerald-400 text-slate-900 flex items-center justify-center font-bold mb-2">
                ⚡
              </div>
              <h4 className="font-bold text-sm">Hybrid Engine</h4>
              <p className="text-[11px] text-orange-100 dark:text-slate-400 mt-0.5">
                60% Content TF-IDF + 40% Collaborative Matrix
              </p>
            </div>

            <div className="bg-white/10 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-orange-400 text-slate-900 flex items-center justify-center font-bold mb-2">
                🔍
              </div>
              <h4 className="font-bold text-sm">Typo & NLP Search</h4>
              <p className="text-[11px] text-orange-100 dark:text-slate-400 mt-0.5">
                Handles "2000 ke andar black shoes" & fuzzy typos
              </p>
            </div>

            <div className="bg-white/10 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-purple-400 text-slate-900 flex items-center justify-center font-bold mb-2">
                💡
              </div>
              <h4 className="font-bold text-sm">Explainable AI</h4>
              <p className="text-[11px] text-orange-100 dark:text-slate-400 mt-0.5">
                Every recommendation clearly explains WHY it was picked
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category Explorer Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-orange-600" />
                <span>Explore Indian Categories</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Discover curated handlooms, electronics, regional sweets, and daily essentials
              </p>
            </div>
            <Link href="/products" className="text-xs sm:text-sm text-orange-600 font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden mb-2 bg-slate-100 dark:bg-slate-700 group-hover:scale-110 transition-transform">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-2 leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* SECTION 1: ✨ Picked For You (Hybrid Recommendation) */}
        {feed?.picked_for_you && feed.picked_for_you.length > 0 && (
          <ProductCarousel
            title="✨ Picked For You"
            subtitle={`AI Personalized for ${user?.name || "Your Profile"} based on browsing & taste vectors`}
            products={feed.picked_for_you}
            icon={<Sparkles className="w-5 h-5" />}
            badge="Hybrid AI Engine"
          />
        )}

        {/* SECTION 2: 🔥 Trending Now Across India */}
        {feed?.trending_now && feed.trending_now.length > 0 && (
          <ProductCarousel
            title="🔥 Trending Now Across India"
            subtitle="Top verified customer reviews, orders, and highest interaction velocity"
            products={feed.trending_now}
            icon={<Flame className="w-5 h-5" />}
            badge="Bestsellers"
          />
        )}

        {/* SECTION 3: 👀 Because You Recently Viewed */}
        {feed?.recently_viewed && feed.recently_viewed.length > 0 && (
          <ProductCarousel
            title="👀 Based on Your Recent Activity"
            subtitle="Items semantically similar to your recent interactions and cart actions"
            products={feed.recently_viewed}
            icon={<TrendingUp className="w-5 h-5" />}
            badge="Session Vectors"
          />
        )}

        {/* SECTION 4: 🪔 Indian Festive Specials & Regional Delights */}
        {feed?.festive_specials && feed.festive_specials.length > 0 && (
          <ProductCarousel
            title="🪔 Festive Celebrations & Traditional Delights"
            subtitle="Curated authentic Indian sweets, Banarasi sarees, Manyavar kurtas, & Brass Urli"
            products={feed.festive_specials}
            icon={<Gift className="w-5 h-5" />}
            badge="Indian Festive Curation"
          />
        )}

        {/* SECTION 5: 💰 Festive Deals & Budget Matches */}
        {feed?.matches_budget && feed.matches_budget.length > 0 && (
          <ProductCarousel
            title="💰 Festive Deals & High Value Discounts"
            subtitle="Biggest savings with over 30% OFF on verified brands"
            products={feed.matches_budget}
            icon={<Tag className="w-5 h-5" />}
            badge="Value Deals"
          />
        )}
      </div>
    </div>
  );
}
