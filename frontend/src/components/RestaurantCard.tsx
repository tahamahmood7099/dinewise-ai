"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, Heart, Sparkles, MapPin, DollarSign,
  ThumbsUp, ThumbsDown, Info, Store, Utensils, ExternalLink
} from "lucide-react";
import { Restaurant } from "../types";
import { formatINR } from "../lib/utils";
import { useFavorites } from "../context/FavoritesContext";
import { useInteractionTracker } from "../context/InteractionTracker";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import ExplainabilityModal from "./ExplainabilityModal";

interface RestaurantCardProps {
  restaurant: Restaurant;
  showAiMatch?: boolean;
}

export default function RestaurantCard({
  restaurant,
  showAiMatch = true,
}: RestaurantCardProps) {
  const { isFavorite, toggleFav } = useFavorites();
  const { trackClick, trackFeedback } = useInteractionTracker();
  const { showAiSignal, showToast } = useToast();
  const { user } = useAuth();

  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const favorited = isFavorite(restaurant.id);

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFav(restaurant);
    if (!favorited) {
      showAiSignal(`Saved ${restaurant.name} to favorites. Collaborative taste score calibrated.`);
    } else {
      showToast(`Removed from favorites`, restaurant.name, "info");
    }
  };

  const handleFeedback = (type: "like" | "dislike", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFeedback(type);
    trackFeedback(restaurant.id, type, "card");
    if (type === "like") {
      showAiSignal(`Affinity increased for ${restaurant.cuisine} in ${restaurant.area}.`);
    } else {
      showAiSignal(`Suppression penalty applied for ${restaurant.name}.`);
    }
  };

  const handleCardClick = () => {
    trackClick(restaurant.id, { source: "card_click" });
  };

  const openExplainModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExplainModalOpen(true);
  };

  // Fallback image if remote host fails
  const imgSrc = imgError
    ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
    : restaurant.image;

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 flex flex-col overflow-hidden"
      >
        {/* Media Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={imgSrc}
            alt={restaurant.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Veg / Non-Veg Indicator */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700/60">
            <div
              className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${
                restaurant.veg_type === "veg"
                  ? "border-emerald-600"
                  : restaurant.veg_type === "non_veg"
                  ? "border-rose-600"
                  : "border-amber-600"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  restaurant.veg_type === "veg"
                    ? "bg-emerald-600"
                    : restaurant.veg_type === "non_veg"
                    ? "bg-rose-600"
                    : "bg-amber-600"
                }`}
              />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {restaurant.veg_type === "veg"
                ? "Pure Veg"
                : restaurant.veg_type === "non_veg"
                ? "Non-Veg"
                : "Veg & Non-Veg"}
            </span>
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={handleToggleFav}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
              favorited
                ? "bg-rose-500 text-white shadow-rose-500/30"
                : "bg-white/85 dark:bg-slate-900/85 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white"
            }`}
            title={favorited ? "Remove from favorites" : "Save to favorites"}
            aria-label="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
          </button>

          {/* AI Match % Badge with Modal Trigger */}
          {showAiMatch && restaurant.match_score && (
            <button
              onClick={openExplainModal}
              className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-2.5 py-1 rounded-xl text-[11px] font-black shadow-lg transition-transform active:scale-95"
              title="Click to view full mathematical explainability breakdown"
            >
              <Sparkles className="w-3 h-3 text-amber-200 animate-pulse" />
              <span>{restaurant.match_score}% Match</span>
              <Info className="w-3 h-3 text-white/80 ml-0.5" />
            </button>
          )}

          {/* Cost Category Badge */}
          <div className="absolute bottom-3 right-3 z-10 bg-slate-950/80 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded-lg text-[10.5px] font-bold border border-white/10">
            {restaurant.cost_category}
          </div>
        </div>

        {/* Info Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Header Row: Name & Rating */}
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/restaurants/${restaurant.id}`}
                className="font-black text-base text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1"
              >
                {restaurant.name}
              </Link>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs flex-shrink-0 shadow-sm">
                <span>{restaurant.rating.toFixed(1)}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
            </div>

            {/* Area & Location */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{restaurant.area}</span>
              <span>•</span>
              <span className="truncate">{restaurant.location}</span>
            </div>

            {/* Cuisines Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {restaurant.cuisines_list.slice(0, 3).map((cuis) => (
                <span
                  key={cuis}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10.5px] font-semibold border border-slate-200/60 dark:border-slate-700/60"
                >
                  {cuis}
                </span>
              ))}
            </div>

            {/* Price for Two */}
            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Price for two</span>
              <span className="font-black text-sm text-slate-900 dark:text-white">
                {formatINR(restaurant.price_for_two)}
              </span>
            </div>
          </div>

          {/* Explainable AI Banner */}
          {restaurant.recommendation_reason && (
            <div className="relative pt-1">
              <div
                onClick={openExplainModal}
                className="p-2.5 rounded-2xl bg-orange-50/90 dark:bg-orange-950/40 border border-orange-200/70 dark:border-orange-800/50 flex items-start gap-2 cursor-pointer hover:border-orange-500 transition group/xai"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/xai:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug font-medium line-clamp-2">
                    {restaurant.recommendation_reason}
                  </p>
                  <span className="text-[9.5px] font-bold text-orange-600 dark:text-orange-400 group-hover/xai:underline inline-flex items-center gap-0.5 mt-0.5">
                    Why recommended? →
                  </span>
                </div>

                {/* Feedback Like/Dislike */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => handleFeedback("like", e)}
                    className={`p-1.5 rounded-lg transition ${
                      feedback === "like"
                        ? "text-emerald-600 font-bold bg-white dark:bg-slate-800 shadow-sm"
                        : "text-slate-400 hover:text-emerald-600"
                    }`}
                    title="Relevant recommendation"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleFeedback("dislike", e)}
                    className={`p-1.5 rounded-lg transition ${
                      feedback === "dislike"
                        ? "text-rose-600 font-bold bg-white dark:bg-slate-800 shadow-sm"
                        : "text-slate-400 hover:text-rose-600"
                    }`}
                    title="Not for me"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Details Link */}
          <Link
            href={`/restaurants/${restaurant.id}`}
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 hover:bg-orange-600 dark:hover:bg-orange-600 font-bold text-xs text-center transition-colors shadow-sm block"
          >
            View Restaurant & Menu →
          </Link>
        </div>
      </div>

      {/* Full Explainable AI Mathematical Breakdown Modal */}
      <ExplainabilityModal
        restaurant={restaurant}
        user={user}
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />
    </>
  );
}
