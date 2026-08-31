"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scale, Plus, X, Sparkles, Check,
  ShoppingCart, Star, ArrowRight
} from "lucide-react";
import { compareProducts, getProducts } from "../../lib/api";
import { Product } from "../../types";
import { formatINR } from "../../lib/utils";
import { useCartWishlist } from "../../context/CartWishlistContext";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItemToCart } = useCartWishlist();

  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([1, 2]); // Default compare Manyavar vs FabIndia
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rawIds = searchParams.get("ids");
    if (rawIds) {
      const parsed = rawIds.split(",").map((i) => Number(i.trim())).filter((i) => !isNaN(i) && i > 0);
      if (parsed.length > 0) setSelectedProductIds(parsed.slice(0, 3));
    }
  }, [searchParams]);

  useEffect(() => {
    const loadComparison = async () => {
      setIsLoading(true);
      try {
        const [allProds, compResult] = await Promise.all([
          getProducts({ limit: 40 }),
          compareProducts(selectedProductIds.length > 0 ? selectedProductIds : [1, 2]),
        ]);
        setAvailableProducts(allProds || []);
        setComparedProducts(compResult || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadComparison();
  }, [selectedProductIds]);

  const addProductToComparison = (pid: number) => {
    if (selectedProductIds.length < 3 && !selectedProductIds.includes(pid)) {
      const updated = [...selectedProductIds, pid];
      setSelectedProductIds(updated);
      router.push(`/compare?ids=${updated.join(",")}`);
    }
  };

  const removeProductFromComparison = (pid: number) => {
    const updated = selectedProductIds.filter((id) => id !== pid);
    setSelectedProductIds(updated);
    router.push(`/compare?ids=${updated.join(",")}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-7 h-7 text-orange-600" />
          <span>Product Comparison Matrix (Up to 3 Items)</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Side-by-side attribute comparison with grounded "Best Value Choice" intelligence
        </p>
      </div>

      {/* Add More Products Quick Bar */}
      {selectedProductIds.length < 3 && (
        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-600" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Add a {selectedProductIds.length === 1 ? "second" : "third"} product to compare:
            </span>
          </div>

          <select
            onChange={(e) => {
              if (e.target.value) addProductToComparison(Number(e.target.value));
            }}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-slate-900 dark:text-white"
            defaultValue=""
          >
            <option value="" disabled>Choose a product...</option>
            {availableProducts
              .filter((p) => !selectedProductIds.includes(p.id))
              .map((p) => (
                <option key={p.id} value={p.id}>{p.brand} — {p.name}</option>
              ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Loading comparison matrix...</div>
      ) : comparedProducts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border">
          <h3 className="font-bold text-base">Select products to compare</h3>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                <th className="p-5 font-bold text-slate-400 w-1/4 uppercase tracking-wider">
                  Product Attributes
                </th>
                {comparedProducts.map((p) => (
                  <th key={p.id} className="p-5 w-1/3 min-w-[240px] align-top">
                    <div className="relative space-y-3">
                      {/* Remove Button */}
                      {comparedProducts.length > 1 && (
                        <button
                          onClick={() => removeProductFromComparison(p.id)}
                          className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <img src={p.image} alt={p.name} className="w-full h-36 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800" />
                      
                      {p.recommendation_reason?.includes("Best Value") && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                          <Sparkles className="w-3 h-3" /> BEST VALUE CHOICE
                        </span>
                      )}

                      <div>
                        <span className="text-[10.5px] font-bold uppercase text-orange-600 dark:text-orange-400">
                          {p.brand}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                          {p.name}
                        </h4>
                      </div>

                      <button
                        onClick={() => addItemToCart(p, 1)}
                        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-900/30">Price (INR)</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-black text-sm text-slate-900 dark:text-white">
                    {formatINR(p.price)}
                    {p.discount > 0 && <span className="ml-1.5 text-xs text-rose-600 font-bold">({p.discount}% OFF)</span>}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-900/30">Customer Rating</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-slate-800 dark:text-slate-200">
                    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-[11px]">
                      {p.rating} <Star className="w-3 h-3 fill-white" />
                    </span>
                    <span className="text-slate-400 font-normal ml-1">({p.review_count} reviews)</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-900/30">Category</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-medium text-slate-700 dark:text-slate-300">
                    {p.category}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-900/30">Available Colors</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                    {p.colors || "Standard"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-900/30">Stock Availability</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-emerald-600">
                    In Stock ({p.stock} units available in India)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-900/30">Key Highlights</td>
                {comparedProducts.map((p) => {
                  const feats = p.features ? JSON.parse(p.features) : [];
                  return (
                    <td key={p.id} className="p-4 text-slate-600 dark:text-slate-300">
                      <ul className="space-y-1">
                        {feats.map((f: string, i: number) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8 text-center text-slate-400">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
