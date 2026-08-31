"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Sparkles, ThumbsUp, ThumbsDown, Eye, Check } from "lucide-react";
import { Product } from "../types";
import { formatINR } from "../lib/utils";
import { useCartWishlist } from "../context/CartWishlistContext";
import { useInteractionTracker } from "../context/InteractionTracker";

interface ProductCardProps {
  product: Product;
  showFeedback?: boolean;
}

export default function ProductCard({ product, showFeedback = true }: ProductCardProps) {
  const { addItemToCart, addItemToWishlist, removeItemFromWishlist, isInWishlist } = useCartWishlist();
  const { trackClick, trackFeedback } = useInteractionTracker();
  const [feedbackGiven, setFeedbackGiven] = useState<"like" | "dislike" | null>(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isLiked = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      // Find item in wishlist and remove
      // Or toggle
      addItemToWishlist(product);
    } else {
      addItemToWishlist(product);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItemToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleFeedback = async (e: React.MouseEvent, type: "like" | "dislike") => {
    e.preventDefault();
    e.stopPropagation();
    setFeedbackGiven(type);
    await trackFeedback(product.id, type, "card_recommendation");
  };

  return (
    <div
      onClick={() => trackClick(product.id)}
      className="group relative flex flex-col bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Product Image Container */}
      <div className="relative w-full pt-[90%] bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <Link href={`/products/${product.id}`} className="absolute inset-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges & Match Score */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discount > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          {product.match_score && product.match_score > 70 && (
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> {product.match_score}% Match
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Wishlist"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
            isLiked
              ? "bg-rose-50 dark:bg-rose-950 text-rose-500"
              : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-rose-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
        </button>

        {/* Quick Feedback Bar on Hover */}
        {showFeedback && (
          <div className="absolute bottom-2 inset-x-2 flex items-center justify-between px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <span className="truncate">Relevant recommendation?</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={(e) => handleFeedback(e, "like")}
                className={`p-1 rounded hover:bg-white/20 transition-colors ${feedbackGiven === "like" ? "text-emerald-400 font-bold" : ""}`}
                title="Relevant for me"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => handleFeedback(e, "dislike")}
                className={`p-1 rounded hover:bg-white/20 transition-colors ${feedbackGiven === "dislike" ? "text-rose-400 font-bold" : ""}`}
                title="Not interested"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1">
            <span className="uppercase tracking-wider font-semibold text-orange-600 dark:text-orange-400">
              {product.brand}
            </span>
            <span className="truncate max-w-[110px]">{product.category}</span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-xs text-slate-400 font-normal">
              ({product.review_count.toLocaleString("en-IN")})
            </span>
          </div>
        </div>

        {/* Explainable AI Reason Tag */}
        {product.recommendation_reason && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-[10.5px] px-2 py-1 rounded-md flex items-center gap-1 leading-tight">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="truncate font-medium">{product.recommendation_reason}</span>
          </div>
        )}

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 dark:text-white">
                {formatINR(product.price)}
              </span>
              {product.original_price > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.original_price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              addedAnimation
                ? "bg-emerald-600 text-white scale-105"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
