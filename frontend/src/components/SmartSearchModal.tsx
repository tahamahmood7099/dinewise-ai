"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, X, ArrowRight, Tag, CornerDownLeft, AlertCircle } from "lucide-react";
import { searchProducts, getSearchSuggestions } from "../lib/api";
import { SearchResult, Product } from "../types";
import { formatINR } from "../lib/utils";
import VoiceSearchButton from "./VoiceSearchButton";

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartSearchModal({ isOpen, onClose }: SmartSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSearchResult(null);
      setSuggestions([]);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live search debounce
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setSearchResult(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [suggs, res] = await Promise.all([
          getSearchSuggestions(query).catch(() => []),
          searchProducts(query).catch(() => null),
        ]);
        setSuggestions(suggs || []);
        if (res) setSearchResult(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleExecuteSearch = (q: string) => {
    if (!q.trim()) return;
    onClose();
    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-orange-50 dark:bg-orange-950/60 rounded-xl text-orange-600 dark:text-orange-400">
            <Sparkles className="w-5 h-5" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteSearch(query);
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, natural language, or Hinglish (e.g. black shoes under 2000)..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-lg font-medium focus:outline-none"
            />
          </form>

          <VoiceSearchButton onSearch={(transcript) => setQuery(transcript)} />

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NLP Intent Extractor Breakdown Badge */}
        {searchResult?.parsed_intent && (
          <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" /> NLP Parsed Intent:
            </span>

            {searchResult.corrected_query && (
              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium border border-amber-300 dark:border-amber-700">
                Typo auto-corrected: <strong>{searchResult.corrected_query}</strong>
              </span>
            )}

            {searchResult.parsed_intent.detected_category && (
              <span className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium">
                Category: <strong>{searchResult.parsed_intent.detected_category}</strong>
              </span>
            )}

            {searchResult.parsed_intent.max_price && (
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                Max Budget: <strong>₹{searchResult.parsed_intent.max_price.toLocaleString("en-IN")}</strong>
              </span>
            )}

            {searchResult.parsed_intent.detected_brand && (
              <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                Brand: <strong>{searchResult.parsed_intent.detected_brand}</strong>
              </span>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="overflow-y-auto p-5 space-y-6 flex-1">
          {/* Live Suggestions Chips */}
          {suggestions.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Suggestions & Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(sug);
                      handleExecuteSearch(sug);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/50 dark:hover:text-orange-300 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full transition-colors"
                  >
                    <Search className="w-3 h-3 text-slate-400" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Preview */}
          {searchResult && searchResult.products.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Database Grounded Results ({searchResult.total_results || searchResult.products.length})
                </p>
                <button
                  onClick={() => handleExecuteSearch(query)}
                  className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1"
                >
                  View all in catalog <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResult.products.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onClose();
                      router.push(`/products/${product.id}`);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-orange-600">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {product.brand} • {product.category}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {formatINR(product.price)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          ★ {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zero results / Quick Indian queries when empty */}
          {!query && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Popular Indian Searches & Filters
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { label: "👞 Black shoes under ₹2000", query: "black shoes under 2000" },
                  { label: "🍛 Authentic Hyderabadi Biryani", query: "hyderabadi biryani" },
                  { label: "✨ Silk Saree for wedding", query: "silk saree for wedding" },
                  { label: "🎧 Noise ANC Earbuds", query: "noise cancelling earbuds" },
                  { label: "🍯 Pure Amul Desi Ghee", query: "amul desi ghee" },
                  { label: "⌚ Titan Men's Leather Watch", query: "titan analog watch" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item.query);
                      handleExecuteSearch(item.query);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-600 text-left text-slate-700 dark:text-slate-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <span>Press <strong>Enter</strong> to search • <strong>ESC</strong> to close</span>
          <span className="text-orange-600 dark:text-orange-400 font-semibold">⚡ BharatKart NLP Search</span>
        </div>
      </div>
    </div>
  );
}
