"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3, Users, AlertTriangle, Cpu, TrendingUp,
  ShoppingBag, DollarSign, ArrowUpRight, Sparkles, RefreshCw, Eye
} from "lucide-react";
import {
  getAdminOverview, getCustomerSegments, getDemandIntelligence,
  getZeroResultSearches, getCategoryDistribution, getModelEvaluation
} from "../../lib/api";
import {
  OverviewStats, CustomerSegmentItem, DemandIntelligenceItem,
  ZeroResultSearchItem, EvaluationMetrics
} from "../../types";
import { formatINR } from "../../lib/utils";
import AnalyticsCharts from "../../components/Admin/AnalyticsCharts";
import SegmentationView from "../../components/Admin/SegmentationView";
import DemandIntelligence from "../../components/Admin/DemandIntelligence";
import ModelEvaluationView from "../../components/Admin/ModelEvaluationView";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "segments" | "demand" | "evaluation">("overview");
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [segments, setSegments] = useState<CustomerSegmentItem[]>([]);
  const [demandItems, setDemandItems] = useState<DemandIntelligenceItem[]>([]);
  const [zeroSearches, setZeroSearches] = useState<ZeroResultSearchItem[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<{ category: string; product_count: number; interactions: number }[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [ov, segs, dem, zs, cats, evals] = await Promise.all([
        getAdminOverview(),
        getCustomerSegments(),
        getDemandIntelligence(),
        getZeroResultSearches(),
        getCategoryDistribution(),
        getModelEvaluation(5),
      ]);
      setOverview(ov);
      setSegments(segs || []);
      setDemandItems(dem || []);
      setZeroSearches(zs || []);
      setCategoryDistribution(cats || []);
      setEvaluations(evals || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              AI Admin & Analytics Portal
            </h1>
            <span className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
              Live BI Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time behavioral telemetry, segmentation clusters, demand signals, and ML evaluation benchmarks
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      {overview && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {formatINR(overview.total_revenue)}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> Orders ({overview.total_orders})
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
              Rec. CTR %
            </span>
            <div className="text-xl font-black text-orange-600 dark:text-orange-400 mt-1">
              {overview.recommendation_ctr}%
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">
              Positive Feedback / Clicks
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
              Interactions Logged
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {overview.total_interactions}
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">
              Views, Carts, Purchases
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
              Registered Users
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {overview.total_users}
            </div>
            <span className="text-[10px] text-purple-600 font-semibold block mt-1">
              Personalized Profiles
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
              Catalog Items
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {overview.total_products}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              Across 8 Categories
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
              Avg Order Value
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {formatINR(overview.avg_order_value)}
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">
              Per Completed Order
            </span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-orange-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Category & Telemetry Visualizer</span>
        </button>

        <button
          onClick={() => setActiveTab("segments")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "segments"
              ? "bg-orange-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Segmentation</span>
        </button>

        <button
          onClick={() => setActiveTab("demand")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "demand"
              ? "bg-orange-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Demand & Zero-Search Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab("evaluation")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "evaluation"
              ? "bg-orange-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>ML Model Evaluation Benchmark</span>
        </button>
      </div>

      {/* Tab Panels */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400">Loading AI telemetry...</div>
      ) : (
        <div className="space-y-6">
          {activeTab === "overview" && (
            <AnalyticsCharts categoryData={categoryDistribution} />
          )}

          {activeTab === "segments" && (
            <SegmentationView segments={segments} />
          )}

          {activeTab === "demand" && (
            <DemandIntelligence demandData={demandItems} zeroSearches={zeroSearches} />
          )}

          {activeTab === "evaluation" && (
            <ModelEvaluationView evaluations={evaluations} />
          )}
        </div>
      )}
    </div>
  );
}
