"use client";

import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, PieChart, Pie, Cell, CartesianGrid
} from "recharts";

interface AnalyticsChartsProps {
  categoryData: { category: string; product_count: number; interactions: number }[];
}

const COLORS = ["#ea580c", "#d97706", "#059669", "#2563eb", "#7c3aed", "#db2777", "#0d9488", "#4f46e5"];

export default function AnalyticsCharts({ categoryData }: AnalyticsChartsProps) {
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
        Loading analytics charts...
      </div>
    );
  }

  // Format short category names for X-Axis
  const chartFormatted = categoryData.map((c) => ({
    name: c.category.replace(" & ", "\n& "),
    products: c.product_count,
    interactions: c.interactions,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Interaction Volume Bar Chart */}
      <div className="p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
          📊 Customer Interactions per Category
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking total views, clicks, cart adds, and purchases across product domains
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartFormatted} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar dataKey="interactions" name="Total Interactions" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="products" name="Catalog Products" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Catalog Distribution Donut Chart */}
      <div className="p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
          🥧 Category Inventory Share
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Proportion of authentic Indian inventory across catalog departments
        </p>

        <div className="h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="product_count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
