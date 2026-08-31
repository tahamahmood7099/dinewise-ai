"use client";

import React from "react";
import { AlertTriangle, TrendingUp, Search, Eye, ShoppingCart } from "lucide-react";
import { DemandIntelligenceItem, ZeroResultSearchItem } from "../../types";
import { formatINR } from "../../lib/utils";

interface DemandIntelligenceProps {
  demandData: DemandIntelligenceItem[];
  zeroSearches: ZeroResultSearchItem[];
}

export default function DemandIntelligence({ demandData, zeroSearches }: DemandIntelligenceProps) {
  return (
    <div className="space-y-6">
      {/* 1. High Interest, Low Conversion Demand Intelligence */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Demand Intelligence: Interest vs Conversion Analysis</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies products with strong browsing engagement but pricing/friction barriers
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Views</th>
                <th className="pb-3 font-semibold">Cart Adds</th>
                <th className="pb-3 font-semibold">Purchases</th>
                <th className="pb-3 font-semibold">Conversion Rate</th>
                <th className="pb-3 font-semibold">Intelligence Label</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {demandData.map((d) => (
                <tr key={d.product_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={d.image} alt={d.product_name} className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{d.product_name}</div>
                        <div className="text-[11px] text-slate-400">{d.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{formatINR(d.price)}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{d.views}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{d.cart_adds}</td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{d.purchases}</td>
                  <td className="py-3 font-bold text-slate-700 dark:text-slate-300">{d.conversion_rate}%</td>
                  <td className="py-3">
                    {d.label === "High Interest, Low Conversion" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse">
                        ⚠️ High Interest, Low Conv.
                      </span>
                    ) : d.label === "High Performer" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        ⚡ High Performer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Moderate Interest
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Zero-Result Search Intelligence (Unmet Demand) */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-600" />
              <span>Zero-Result Search Intelligence (Unmet Market Demand)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer search terms that returned 0 products in our catalog, revealing inventory expansion opportunities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {zeroSearches.map((zs, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white capitalize">
                  "{zs.query}"
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Opportunity demand signal
                </p>
              </div>
              <span className="bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-black px-2.5 py-1 rounded-lg">
                {zs.count} {zs.count === 1 ? "search" : "searches"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
