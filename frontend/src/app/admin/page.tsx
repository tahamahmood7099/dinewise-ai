"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3, Users, Search, Award, TrendingUp,
  Activity, Sparkles, UtensilsCrossed, Clock, ShieldCheck,
  Store, Heart
} from "lucide-react";
import {
  fetchAdminOverview, fetchCustomerSegments,
  fetchSearchAnalytics, fetchEvaluationMetrics, fetchAnalyticsCharts
} from "../../lib/api";
import {
  OverviewStats, CustomerSegmentItem, ModelEvaluationMetrics
} from "../../types";
import AnalyticsCharts from "../../components/Admin/AnalyticsCharts";
import SegmentationView from "../../components/Admin/SegmentationView";
import SearchAnalyticsView from "../../components/Admin/SearchAnalyticsView";
import ModelEvaluationView from "../../components/Admin/ModelEvaluationView";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "segmentation" | "searches" | "evaluation">("overview");

  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [segments, setSegments] = useState<CustomerSegmentItem[]>([]);
  const [searchData, setSearchData] = useState<{ popular_searches: any[]; zero_result_searches: any[] }>({
    popular_searches: [],
    zero_result_searches: []
  });
  const [evaluations, setEvaluations] = useState<ModelEvaluationMetrics[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchAdminOverview().catch(() => null),
      fetchCustomerSegments().catch(() => []),
      fetchSearchAnalytics().catch(() => ({ popular_searches: [], zero_result_searches: [] })),
      fetchEvaluationMetrics().catch(() => []),
      fetchAnalyticsCharts().catch(() => null)
    ])
      .then(([ov, seg, sData, ev, an]) => {
        if (ov) setOverview(ov);
        setSegments(seg || []);
        if (sData) setSearchData(sData);
        setEvaluations(ev || []);
        if (an) setAnalyticsData(an);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-300 font-bold text-xs">
            DineWise AI Telemetry Portal
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
          Restaurant Recommendation & Customer Behavior Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Real-time machine learning telemetry, user clustering & offline model evaluation benchmarks
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {overview ? overview.total_users : 5}
          </p>
          <p className="text-[11px] text-indigo-600 font-semibold">
            {overview ? overview.active_users_today : 4} Active Sessions Today
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Recommendation CTR</span>
            <Activity className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {overview ? `${overview.recommendation_ctr}%` : "76.8%"}
          </p>
          <p className="text-[11px] text-orange-600 font-semibold">
            Acceptance Rate: {overview ? `${overview.recommendation_acceptance_rate}%` : "88.5%"}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Iconic Restaurants</span>
            <Store className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {overview ? overview.total_restaurants : 12}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold">
            Across {overview ? overview.total_cuisines : 10} Cuisines in Hyderabad
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Interaction Signals</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {overview ? overview.total_interactions : 22}
          </p>
          <p className="text-[11px] text-blue-600 font-semibold">
            {overview ? overview.total_favorites : 6} Saved Favorites
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 text-xs font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-1 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "overview"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Overview & Cuisines
        </button>

        <button
          onClick={() => setActiveTab("segmentation")}
          className={`pb-3 px-1 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "segmentation"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" /> Customer Segmentation
        </button>

        <button
          onClick={() => setActiveTab("searches")}
          className={`pb-3 px-1 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "searches"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Search className="w-4 h-4" /> Search Analytics
        </button>

        <button
          onClick={() => setActiveTab("evaluation")}
          className={`pb-3 px-1 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "evaluation"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" /> Model Benchmarks
        </button>
      </div>

      {/* Tab Panels */}
      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading intelligence data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === "overview" && <AnalyticsCharts chartData={analyticsData} />}
          {activeTab === "segmentation" && <SegmentationView segments={segments} />}
          {activeTab === "searches" && (
            <SearchAnalyticsView
              popularSearches={searchData.popular_searches}
              zeroSearches={searchData.zero_result_searches}
            />
          )}
          {activeTab === "evaluation" && <ModelEvaluationView evaluations={evaluations} />}
        </div>
      )}
    </div>
  );
}
