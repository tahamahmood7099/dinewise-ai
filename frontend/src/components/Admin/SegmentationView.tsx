"use client";

import React from "react";
import { Users, Sparkles, Utensils, MapPin } from "lucide-react";
import { CustomerSegmentItem } from "../../types";
import { formatINR } from "../../lib/utils";

interface SegmentationViewProps {
  segments: CustomerSegmentItem[];
}

export default function SegmentationView({ segments }: SegmentationViewProps) {
  const getSegmentBadge = (seg: string) => {
    switch (seg) {
      case "Biryani Enthusiast":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "Vegetarian Explorer":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Premium Diner":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Budget Explorer":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Cuisine Explorer":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Customer Behavioral Segmentation (Clustering)
          </h3>
          <p className="text-xs text-slate-500">
            Real-time user clustering based on interaction telemetry, cuisine preference, and spend affinity
          </p>
        </div>
        <span className="text-xs font-bold text-slate-400">
          {segments.length} Profiled Users
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="pb-3">Customer Persona</th>
              <th className="pb-3">Behavioral Cluster</th>
              <th className="pb-3">Top Cuisine</th>
              <th className="pb-3">Preferred Area</th>
              <th className="pb-3">Avg Spend Affinity</th>
              <th className="pb-3">Telemetry Signals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {segments.map((item) => (
              <tr key={item.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                <td className="py-3 font-semibold text-slate-900 dark:text-white">
                  {item.name}
                  <span className="block text-[10px] text-slate-400 font-normal">
                    {item.email}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getSegmentBadge(item.segment)}`}>
                    {item.segment}
                  </span>
                </td>
                <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                  {item.preferred_cuisine}
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-400">
                  {item.preferred_area}
                </td>
                <td className="py-3 font-bold text-slate-900 dark:text-white">
                  {formatINR(item.avg_budget_affinity)}
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    {item.total_interactions} hits • {item.total_favorites} favs
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
