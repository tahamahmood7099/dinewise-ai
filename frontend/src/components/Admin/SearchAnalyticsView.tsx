"use client";

import React from "react";
import { Search, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

interface SearchAnalyticsViewProps {
  popularSearches: Array<{ query: string; count: number }>;
  zeroSearches: Array<{ query: string; count: number }>;
}

export default function SearchAnalyticsView({ popularSearches, zeroSearches }: SearchAnalyticsViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Popular Search Trends */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Top Searched Cuisines & Locations
          </h3>
          <p className="text-xs text-slate-500">
            Most frequent user queries and intent extractions in Hyderabad
          </p>
        </div>

        <div className="space-y-2">
          {popularSearches.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  &quot;{item.query}&quot;
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                {item.count} queries
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Zero-Result Search Intelligence */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Unmet Food & Restaurant Inquiries
          </h3>
          <p className="text-xs text-slate-500">
            Real-time logs of user searches that returned zero restaurant results
          </p>
        </div>

        <div className="space-y-2">
          {zeroSearches.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  &quot;{item.query}&quot;
                </p>
                <p className="text-[10.5px] text-slate-400">
                  Opportunity for new Hyderabad restaurant listings
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs">
                {item.count} queries
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
