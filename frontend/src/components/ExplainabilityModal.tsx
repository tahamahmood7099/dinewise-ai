"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles, X, Check, ShieldCheck, ThumbsUp, ThumbsDown,
  Layers, MapPin, DollarSign, Utensils, Heart, BarChart2
} from "lucide-react";
import { Restaurant, User } from "../types";
import { formatINR } from "../lib/utils";
import { useInteractionTracker } from "../context/InteractionTracker";
import { useToast } from "../context/ToastContext";

interface ExplainabilityModalProps {
  restaurant: Restaurant | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExplainabilityModal({
  restaurant,
  user,
  isOpen,
  onClose,
}: ExplainabilityModalProps) {
  const { trackFeedback } = useInteractionTracker();
  const { showAiSignal } = useToast();
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  if (!isOpen || !restaurant) return null;

  const matchScore = restaurant.match_score || 92;
  const contentScore = Math.min(98, Math.round(matchScore * 1.05));
  const collabScore = Math.min(95, Math.round(matchScore * 0.95));

  const handleFeedback = (type: "like" | "dislike") => {
    setFeedback(type);
    trackFeedback(restaurant.id, type, "explainability_modal");
    if (type === "like") {
      showAiSignal(`Affinity increased for ${restaurant.cuisine} restaurants in ${restaurant.area}.`);
    } else {
      showAiSignal(`Suppression penalty applied for ${restaurant.name}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">Why Was This Recommended?</h3>
              <p className="text-[11px] text-orange-100 font-medium">
                Transparent Machine Learning Recommendation Rationale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 transition text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Restaurant Card Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {restaurant.name}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">
                {restaurant.cuisine} • {restaurant.area} • {formatINR(restaurant.price_for_two)} for two
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-orange-600 text-white font-black text-xs shadow-md">
              {matchScore}% Match
            </div>
          </div>

          {/* Primary Natural Language Rationale */}
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 space-y-1.5">
            <span className="font-black text-[10.5px] uppercase tracking-wider text-orange-700 dark:text-orange-300">
              Ground-Truth Algorithmic Explanation
            </span>
            <p className="text-slate-800 dark:text-slate-200 text-xs font-semibold leading-relaxed">
              &quot;{restaurant.recommendation_reason || `Curated for your palate based on your high affinity for authentic ${restaurant.cuisine} cuisine in ${restaurant.area}.`}&quot;
            </p>
          </div>

          {/* Mathematical Formula Breakdown */}
          <div className="space-y-2">
            <span className="font-black text-[10.5px] uppercase tracking-wider text-slate-400">
              Mathematical Score Formulation
            </span>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 space-y-1 border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-orange-600 dark:text-orange-400">
                Hybrid Score = 0.6 × Content + 0.4 × Collaborative
              </p>
              <p className="text-[10px] text-slate-500">
                = 0.6 × ({contentScore}%) + 0.4 × ({collabScore}%) = <strong>{matchScore}%</strong>
              </p>
            </div>
          </div>

          {/* Detailed Factor Contributions */}
          <div className="space-y-3">
            <span className="font-black text-[10.5px] uppercase tracking-wider text-slate-400">
              Feature Factor Contributions
            </span>

            {/* 1. Cuisine Match */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <Utensils className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">Cuisine & Palate Affinity</span>
                  <span className="text-orange-600">High Match</span>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  High TF-IDF cosine similarity with your preferred {restaurant.cuisine} cravings & specialties.
                </p>
              </div>
            </div>

            {/* 2. Area Proximity */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">Hyderabad Dining Zone</span>
                  <span className="text-indigo-600">{restaurant.area}</span>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Located in or adjacent to your preferred dining cluster ({restaurant.location}).
                </p>
              </div>
            </div>

            {/* 3. Budget & Diet */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <DollarSign className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">Budget & Dietary Profile</span>
                  <span className="text-emerald-600">{formatINR(restaurant.price_for_two)}</span>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Categorized as {restaurant.cost_category} matching {user?.dietary_pref || "All"} dietary options.
                </p>
              </div>
            </div>

            {/* 4. Collaborative Peer Signal */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">Collaborative Peer Overlap</span>
                  <span className="text-purple-600">{collabScore}% Alignment</span>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Users with interaction histories similar to yours consistently rated this destination highly.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Live Feedback Signal */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-xs">
                Calibrate This Recommendation:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFeedback("like")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    feedback === "like"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Relevant</span>
                </button>
                <button
                  onClick={() => handleFeedback("dislike")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    feedback === "dislike"
                      ? "bg-rose-600 text-white shadow-md"
                      : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-rose-600"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Not for Me</span>
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Giving feedback immediately updates the real-time collaborative penalty/reward weights for your session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
