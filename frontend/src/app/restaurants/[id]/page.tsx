"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star, Heart, Sparkles, MapPin, Clock, Store,
  ShieldCheck, ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Send, Check, Info, Utensils, DollarSign, Layers
} from "lucide-react";
import {
  fetchRestaurantById, fetchSimilarRestaurants,
  submitRestaurantRating, fetchRestaurantRatings,
  submitRecommendationFeedback
} from "../../../lib/api";
import { Restaurant, RatingItem } from "../../../types";
import { formatINR } from "../../../lib/utils";
import { useFavorites } from "../../../context/FavoritesContext";
import { useAuth } from "../../../context/AuthContext";
import { useInteractionTracker } from "../../../context/InteractionTracker";
import { useToast } from "../../../context/ToastContext";
import RestaurantCarousel from "../../../components/RestaurantCarousel";
import ExplainabilityModal from "../../../components/ExplainabilityModal";

export default function RestaurantDetailPage() {
  const params = useParams();
  const id = Number(params?.id);

  const { isFavorite, toggleFav } = useFavorites();
  const { user } = useAuth();
  const { trackView, trackFeedback } = useInteractionTracker();
  const { showAiSignal, showToast } = useToast();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [similarRestaurants, setSimilarRestaurants] = useState<Restaurant[]>([]);
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [userRatingScore, setUserRatingScore] = useState(5.0);
  const [userReviewText, setUserReviewText] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    trackView(id, { source: "detail_page" });

    Promise.all([
      fetchRestaurantById(id, user?.id),
      fetchSimilarRestaurants(id, 4, user?.id),
      fetchRestaurantRatings(id)
    ])
      .then(([restData, simData, ratingsData]) => {
        setRestaurant(restData);
        setSimilarRestaurants(simData || []);
        setRatings(ratingsData || []);
      })
      .catch((err) => console.error("Error loading restaurant details", err))
      .finally(() => setIsLoading(false));
  }, [id, user?.id, trackView]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Computing hybrid similarities & restaurant details...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto">
        <h3 className="text-base font-bold">Restaurant Not Found</h3>
        <p className="text-xs text-slate-400">The requested Hyderabad restaurant profile is unavailable.</p>
        <Link href="/restaurants" className="inline-block px-4 py-2 bg-orange-600 text-white rounded-xl font-semibold text-xs shadow">
          ← Back to All Restaurants
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(restaurant.id);

  const handleToggleFav = async () => {
    await toggleFav(restaurant);
    if (!favorited) {
      showAiSignal(`Saved ${restaurant.name} to favorites. Collaborative taste profile updated.`);
    } else {
      showToast(`Removed from favorites`, restaurant.name, "info");
    }
  };

  const handleFeedback = (type: "like" | "dislike") => {
    setFeedback(type);
    trackFeedback(restaurant.id, type, "detail_page");
    if (type === "like") {
      showAiSignal(`Affinity score increased for ${restaurant.cuisine} in ${restaurant.area}.`);
    } else {
      showAiSignal(`Suppression penalty applied for ${restaurant.name}.`);
    }
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReviewText.trim()) return;

    setIsSubmittingRating(true);
    try {
      await submitRestaurantRating(restaurant.id, userRatingScore, userReviewText, user?.id);
      setRatingSuccess(true);
      setUserReviewText("");
      const updatedRatings = await fetchRestaurantRatings(restaurant.id);
      setRatings(updatedRatings);
      showAiSignal(`Rating recorded (${userRatingScore}★). Interaction matrix re-calibrated.`);
      setTimeout(() => setRatingSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to submit rating", err);
      showToast("Submission Failed", "Could not record review. Please retry.", "error");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const imgSrc = imgError
    ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
    : restaurant.image;

  return (
    <div className="space-y-8 pb-16">
      {/* Back Link */}
      <Link
        href="/restaurants"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Restaurants Directory
      </Link>

      {/* Main Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white border border-slate-800 shadow-2xl">
        <div className="relative aspect-[21/9] sm:aspect-[24/8] w-full bg-slate-950">
          <Image
            src={imgSrc}
            alt={restaurant.name}
            fill
            priority
            onError={() => setImgError(true)}
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center gap-1 shadow-md">
                <span>{restaurant.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="text-xs text-slate-300">
                ({restaurant.review_count}+ verified reviews)
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-orange-600/90 text-white text-xs font-bold shadow">
                {restaurant.cuisine}
              </span>
              {restaurant.veg_type === "veg" && (
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-700/90 text-emerald-100 text-xs font-bold shadow">
                  Pure Vegetarian
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleFav}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md font-bold text-xs transition shadow-lg active:scale-95 ${
                favorited
                  ? "bg-rose-500 text-white shadow-rose-500/30"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
              <span>{favorited ? "Saved in Favorites" : "Add to Favorites"}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {restaurant.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {restaurant.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{restaurant.location} ({restaurant.area})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{restaurant.opening_status}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-orange-500" />
              <span>{formatINR(restaurant.price_for_two)} for two ({restaurant.cost_category})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Details & AI Explainability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: AI Explainability, Specialties & Food Gallery */}
        <div className="lg:col-span-8 space-y-6">
          {/* Grounded AI Explainability Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 border border-orange-200/80 dark:border-orange-800/60 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-orange-700 dark:text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
                DineWise AI Recommendation Engine Rationale
              </span>
              <button
                onClick={() => setIsExplainModalOpen(true)}
                className="px-3 py-1 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md transition flex items-center gap-1"
              >
                <span>{restaurant.match_score || 94}% Taste Match</span>
                <Info className="w-3 h-3 text-amber-200" />
              </button>
            </div>

            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
              &quot;{restaurant.recommendation_reason ||
                `Personalized for your palate: Matches authentic ${restaurant.cuisine} cuisine in ${restaurant.area}.`}&quot;
            </p>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-orange-200/50 dark:border-orange-800/40">
              <span>Is this recommendation relevant to your dining craving?</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFeedback("like")}
                  className={`px-2.5 py-1 rounded-lg border transition text-xs font-bold flex items-center gap-1 ${
                    feedback === "like"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "border-slate-300 dark:border-slate-700 hover:text-emerald-600"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Relevant</span>
                </button>
                <button
                  onClick={() => handleFeedback("dislike")}
                  className={`px-2.5 py-1 rounded-lg border transition text-xs font-bold flex items-center gap-1 ${
                    feedback === "dislike"
                      ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                      : "border-slate-300 dark:border-slate-700 hover:text-rose-600"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Not for Me</span>
                </button>
              </div>
            </div>
          </div>

          {/* Specialty Dishes */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Signature Delicacies & Specialties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {restaurant.specialty_dishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-2.5 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {dish}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Food Photo Gallery */}
          {restaurant.food_gallery.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Food & Ambiance Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {restaurant.food_gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <Image
                      src={img}
                      alt={`${restaurant.name} photo ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Reviews & Ratings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Write a Review Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              Rate & Review
            </h3>

            {ratingSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Review submitted! Updated collaborative profile.</span>
              </div>
            )}

            <form onSubmit={handleRatingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Rating Score:
                </label>
                <div className="flex gap-2">
                  {[5.0, 4.0, 3.0, 2.0, 1.0].map((score) => (
                    <button
                      type="button"
                      key={score}
                      onClick={() => setUserRatingScore(score)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${
                        userRatingScore === score
                          ? "bg-amber-500 text-white shadow-md"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {score}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Dining Experience:
                </label>
                <textarea
                  rows={3}
                  required
                  value={userReviewText}
                  onChange={(e) => setUserReviewText(e.target.value)}
                  placeholder="Share your feedback on the flavor, ambiance, and specialty dishes..."
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRating}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition shadow-md flex items-center justify-center gap-2"
              >
                <span>{isSubmittingRating ? "Submitting..." : "Submit Foodie Review"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Foodie Reviews ({ratings.length})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-none text-xs">
              {ratings.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {r.user_name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10.5px]">
                      {r.rating_score}★
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-snug">
                    {r.review_text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Content-Based Recommendations */}
      {similarRestaurants.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <RestaurantCarousel
            title="🍲 Similar Hyderabad Restaurants You May Like"
            subtitle="Calculated using TF-IDF cuisine & ambiance cosine similarities"
            items={similarRestaurants}
            badge="Content Similar"
          />
        </div>
      )}

      {/* Detailed XAI Modal */}
      <ExplainabilityModal
        restaurant={restaurant}
        user={user}
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />
    </div>
  );
}
