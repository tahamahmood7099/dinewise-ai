"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, X, Sparkles, MapPin, DollarSign, Star,
  CheckCircle2, ArrowRight, CornerDownLeft, AlertCircle
} from "lucide-react";
import { searchRestaurants } from "../lib/api";
import { Restaurant, SearchResponse } from "../types";
import { formatINR } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import VoiceSearchButton from "./VoiceSearchButton";

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_TAGS = [
  "Biryani under 500",
  "Pure veg in Banjara Hills",
  "Fine dining Italian in Jubilee Hills",
  "Mutton Haleem in Gachibowli",
  "Historic Irani chai in Charminar",
  "Chinese in Madhapur"
];

export default function SmartSearchModal({ isOpen, onClose }: SmartSearchModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSearchResult(null);
      return;
    }
  }, [isOpen]);

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch !== undefined ? textToSearch : query;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const res = await searchRestaurants(q, user?.id);
      setSearchResult(res);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRestaurant = (id: number) => {
    onClose();
    router.push(`/restaurants/${id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ask anything: 'best biryani under 500 in tolichowki', 'pure veg dosa'..."
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <VoiceSearchButton
              onTranscript={(transcript) => {
                setQuery(transcript);
                handleSearch(transcript);
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold"
            >
              Esc
            </button>
          </div>
        </div>

        {/* NLP Extraction Badges */}
        {searchResult?.nlp_intent && (
          <div className="px-4 py-2.5 bg-orange-50/60 dark:bg-orange-950/30 border-b border-orange-200/50 dark:border-orange-800/40 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-orange-700 dark:text-orange-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>NLP Extracted Intent:</span>
            </div>

            {searchResult.nlp_intent.corrected_query !== searchResult.nlp_intent.cleaned_query && (
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-orange-300 text-orange-600 text-[11px] font-semibold">
                Auto-corrected &quot;{searchResult.nlp_intent.cleaned_query}&quot; → &quot;{searchResult.nlp_intent.corrected_query}&quot;
              </span>
            )}

            {searchResult.nlp_intent.cuisine && (
              <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white text-[11px] font-bold">
                Cuisine: {searchResult.nlp_intent.cuisine}
              </span>
            )}

            {searchResult.nlp_intent.area && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[11px] font-bold">
                Area: {searchResult.nlp_intent.area}
              </span>
            )}

            {searchResult.nlp_intent.max_price && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold">
                Budget: ≤ ₹{searchResult.nlp_intent.max_price}
              </span>
            )}

            {searchResult.nlp_intent.is_veg && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[11px] font-bold">
                Pure Veg Only
              </span>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {isLoading ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400">Parsing query and matching Hyderabad restaurants...</p>
            </div>
          ) : searchResult ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span>Matched {searchResult.total_count} Hyderabad Restaurants</span>
              </div>

              {searchResult.restaurants.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    No restaurants directly matched your query.
                  </p>
                  <p className="text-slate-400">
                    Try broadening your constraints or searching for &quot;Biryani&quot; or &quot;Banjara Hills&quot;.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResult.restaurants.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handleSelectRestaurant(r.id)}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-orange-50/60 dark:hover:bg-orange-950/40 border border-slate-200 dark:border-slate-700/80 cursor-pointer transition flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                          <Image
                            src={r.image}
                            alt={r.name}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {r.name}
                            </h4>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[10px] font-bold">
                              {r.rating.toFixed(1)}★
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {r.cuisine} • {r.area} • {formatINR(r.price_for_two)} for two
                          </p>
                          <p className="text-[10.5px] text-orange-600 dark:text-orange-400 font-medium truncate mt-0.5">
                            {r.recommendation_reason}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Popular Search Queries in Hyderabad
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        handleSearch(tag);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-orange-500 hover:text-orange-600 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/60 text-[11.5px] text-slate-600 dark:text-slate-300 space-y-1">
                <p className="font-bold text-orange-900 dark:text-orange-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  NLP Intelligence Tips:
                </p>
                <p>• Type budget constraints: &quot;under 500&quot;, &quot;below 1000&quot;</p>
                <p>• Specify Hyderabad areas: &quot;Banjara Hills&quot;, &quot;Jubilee Hills&quot;, &quot;Madhapur&quot;, &quot;Tolichowki&quot;</p>
                <p>• Typo tolerant: &quot;biriyani&quot;, &quot;resturant&quot; are automatically parsed</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
