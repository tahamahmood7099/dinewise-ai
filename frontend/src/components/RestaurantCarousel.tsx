"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { Restaurant } from "../types";
import RestaurantCard from "./RestaurantCard";

interface RestaurantCarouselProps {
  title: string;
  subtitle?: string;
  badge?: string;
  items: Restaurant[];
  viewAllLink?: string;
  showAiMatch?: boolean;
  isRestaurant?: boolean; // backwards compatible
}

export default function RestaurantCarousel({
  title,
  subtitle,
  badge,
  items,
  viewAllLink,
  showAiMatch = true,
}: RestaurantCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 font-bold text-[11px] uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline whitespace-nowrap"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => handleScroll("left")}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Snap Scroll Grid */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((restaurant) => (
          <div
            key={restaurant.id}
            className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
          >
            <RestaurantCard
              restaurant={restaurant}
              showAiMatch={showAiMatch}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
