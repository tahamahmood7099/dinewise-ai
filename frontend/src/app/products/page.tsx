"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Filter, Sparkles, SlidersHorizontal, ArrowUpDown,
  Search, X, Check, Star
} from "lucide-react";
import { getProducts, getCategories, getBrands, searchProducts } from "../../lib/api";
import { Product, Category, SearchResult } from "../../types";
import ProductCard from "../../components/ProductCard";
import SkeletonCard from "../../components/SkeletonCard";
import { formatINR } from "../../lib/utils";

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [searchResultInfo, setSearchResultInfo] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("relevance");

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
        setCategories(cats || []);
        setBrands(brs || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        if (initialQuery) {
          const res = await searchProducts(initialQuery, selectedCategory === "All" ? undefined : selectedCategory, sortBy);
          setSearchResultInfo(res);
          let list = res.products || [];
          if (selectedBrand) list = list.filter((p) => p.brand === selectedBrand);
          if (maxPrice) list = list.filter((p) => p.price <= maxPrice);
          if (minRating) list = list.filter((p) => p.rating >= minRating);
          setProducts(list);
        } else {
          setSearchResultInfo(null);
          const list = await getProducts({
            category: selectedCategory === "All" ? undefined : selectedCategory,
            brand: selectedBrand || undefined,
            max_price: maxPrice,
            min_rating: minRating || undefined,
            sort_by: sortBy,
            limit: 40,
          });
          setProducts(list || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, [initialQuery, selectedCategory, selectedBrand, maxPrice, minRating, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("");
    setMaxPrice(6000);
    setMinRating(0);
    setSortBy("relevance");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & NLP info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Product Catalog</span>
            {initialQuery && (
              <span className="text-sm font-semibold text-slate-500 font-normal">
                — Results for "{initialQuery}"
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {products.length} Indian verified products matching your preferences
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="relevance">Relevance & AI Match</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* NLP Intent Breakdown Banner if search was triggered */}
      {searchResultInfo?.parsed_intent && (
        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-orange-800 dark:text-orange-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" /> NLP Extracted Signals:
          </span>

          {searchResultInfo.corrected_query && (
            <span className="bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-lg border border-amber-300 font-semibold">
              Auto-corrected typo: <strong>{searchResultInfo.corrected_query}</strong>
            </span>
          )}

          {searchResultInfo.parsed_intent.detected_category && (
            <span className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
              Category: <strong>{searchResultInfo.parsed_intent.detected_category}</strong>
            </span>
          )}

          {searchResultInfo.parsed_intent.max_price && (
            <span className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
              Budget Cap: <strong>₹{searchResultInfo.parsed_intent.max_price.toLocaleString("en-IN")}</strong>
            </span>
          )}

          {searchResultInfo.parsed_intent.detected_brand && (
            <span className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
              Brand: <strong>{searchResultInfo.parsed_intent.detected_brand}</strong>
            </span>
          )}
        </div>
      )}

      {/* Main Content Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6 bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 h-fit shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2.5">
              Category
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium ${
                  selectedCategory === "All"
                    ? "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors font-medium flex items-center justify-between ${
                    selectedCategory === c.name
                      ? "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  {selectedCategory === c.name && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Max Price
              </h4>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {formatINR(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="6000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹300</span>
              <span>₹6,000</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              Minimum Rating
            </h4>
            <div className="space-y-1 text-xs">
              {[4.5, 4.0, 3.5, 0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setMinRating(rate)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    minRating === rate
                      ? "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {rate > 0 ? `${rate}★ & above` : "Any Rating"}
                  </span>
                  {minRating === rate && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              Brand
            </h4>
            <div className="space-y-1 text-xs max-h-48 overflow-y-auto pr-1 no-scrollbar">
              <button
                onClick={() => setSelectedBrand("")}
                className={`w-full text-left px-2 py-1 rounded ${!selectedBrand ? "font-bold text-orange-600" : "text-slate-600 dark:text-slate-300"}`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b === selectedBrand ? "" : b)}
                  className={`w-full text-left px-2 py-1 rounded flex justify-between items-center ${
                    selectedBrand === b
                      ? "font-bold text-orange-600 bg-orange-50 dark:bg-orange-950"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <span>{b}</span>
                  {selectedBrand === b && <Check className="w-3 h-3 text-orange-600" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find matches for your exact filter combination. Try adjusting your max price slider or category.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-3 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8 text-center text-slate-400">Loading catalog...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
