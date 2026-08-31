"use client";

import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar, Cell
} from "recharts";

interface AnalyticsChartsProps {
  chartData?: {
    cuisines: Array<{ name: string; count: number; share: number }>;
    hourly_traffic: Array<{ hour: string; views: number }>;
  };
}

const CUISINE_COLORS = ["#ea580c", "#d97706", "#059669", "#2563eb", "#9333ea", "#db2777", "#0284c7"];

export default function AnalyticsCharts({ chartData }: AnalyticsChartsProps) {
  const cuisines = chartData?.cuisines || [
    { name: "Biryani", count: 3, share: 25.0 },
    { name: "Mughlai", count: 2, share: 16.7 },
    { name: "South Indian", count: 2, share: 16.7 },
    { name: "North Indian", count: 1, share: 8.3 },
    { name: "Italian & Pizza", count: 1, share: 8.3 },
    { name: "Cafe & Bistro", count: 1, share: 8.3 },
    { name: "Bakery & Desserts", count: 2, share: 16.7 }
  ];

  const hourly = chartData?.hourly_traffic || [
    { hour: "12 PM (Lunch)", views: 42 },
    { hour: "1 PM (Peak Lunch)", views: 68 },
    { hour: "4 PM (Chai & Snacks)", views: 35 },
    { hour: "7 PM (Evening)", views: 48 },
    { hour: "8 PM (Peak Dinner)", views: 85 },
    { hour: "9 PM (Late Dinner)", views: 72 },
    { hour: "11 PM (Late Night)", views: 38 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hourly Dining Peak Views Heatmap */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Daily Hyderabad Dining Hourly Heatmap
          </h4>
          <p className="text-xs text-slate-500">
            Real-time traffic surge during Lunch (1 PM) and Dinner (8-9 PM)
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourly}>
              <defs>
                <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px"
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#ea580c"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#orderGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cuisine Distribution Breakdown */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Cuisine Representation & Preference Share
          </h4>
          <p className="text-xs text-slate-500">
            Hyderabadi Dum Biryani, South Indian & Mughlai lead user discovery
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cuisines}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px"
                }}
              />
              <Bar dataKey="count" name="Restaurants" radius={[6, 6, 0, 0]}>
                {cuisines.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CUISINE_COLORS[index % CUISINE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
