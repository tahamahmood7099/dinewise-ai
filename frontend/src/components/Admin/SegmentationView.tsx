"use client";

import React from "react";
import { Users, Sparkles, TrendingUp, ShoppingBag, Eye } from "lucide-react";
import { CustomerSegmentItem } from "../../types";
import { formatINR } from "../../lib/utils";

interface SegmentationViewProps {
  segments: CustomerSegmentItem[];
}

export default function SegmentationView({ segments }: SegmentationViewProps) {
  const getBadgeStyle = (segment: string) => {
    switch (segment) {
      case "Premium Buyer":
        return "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700";
      case "Frequent Buyer":
        return "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700";
      case "Budget Shopper":
        return "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700";
      case "Window Shopper":
        return "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case "Premium Buyer":
        return "💎";
      case "Frequent Buyer":
        return "🛍️";
      case "Budget Shopper":
        return "🏷️";
      case "Window Shopper":
        return "👀";
      default:
        return "👤";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span>AI Customer Behavioral Segmentation</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Clustered based on purchase history, interaction density, and average order value
          </p>
        </div>

        <span className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
          {segments.length} Active Profiles
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 uppercase tracking-wider">
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Segment Cluster</th>
              <th className="pb-3 font-semibold">Preferred Category</th>
              <th className="pb-3 font-semibold">Orders</th>
              <th className="pb-3 font-semibold">Total Spend</th>
              <th className="pb-3 font-semibold">Interactions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {segments.map((s) => (
              <tr key={s.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3">
                  <div className="font-semibold text-slate-900 dark:text-white">{s.name}</div>
                  <div className="text-[11px] text-slate-400">{s.email}</div>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeStyle(s.segment)}`}>
                    <span>{getSegmentIcon(s.segment)}</span>
                    <span>{s.segment}</span>
                  </span>
                </td>
                <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                  {s.preferred_category}
                </td>
                <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                  {s.total_orders}
                </td>
                <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(s.total_spend)}
                </td>
                <td className="py-3 text-slate-500 dark:text-slate-400 font-semibold">
                  {s.total_interactions} logs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
