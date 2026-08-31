"use client";

import React, { useState } from "react";
import { Award, ShieldCheck, Zap, BarChart2 } from "lucide-react";
import { ModelEvaluationMetrics } from "../../types";

interface ModelEvaluationViewProps {
  evaluations: ModelEvaluationMetrics[];
}

export default function ModelEvaluationView({ evaluations }: ModelEvaluationViewProps) {
  const [selectedK, setSelectedK] = useState(5);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Restaurant Recommendation Model Evaluation & Offline Benchmarks
          </h3>
          <p className="text-xs text-slate-500">
            Precision@K, Recall@K, F1-Score, and Normalized Discounted Cumulative Gain (NDCG@K)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Top-K Metric:</span>
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            {[3, 5, 10].map((k) => (
              <button
                key={k}
                onClick={() => setSelectedK(k)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedK === k
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                K = {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {evaluations.map((ev) => {
          const isHybrid = ev.model_name.includes("Hybrid");
          return (
            <div
              key={ev.model_name}
              className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                isHybrid
                  ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30"
                  : "bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/80"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Algorithm Engine
                  </span>
                  {isHybrid && (
                    <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" /> Best Model
                    </span>
                  )}
                </div>

                <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                  {ev.model_name}
                </h4>

                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span>Precision@{selectedK}</span>
                      <strong className="text-slate-900 dark:text-white">{(ev.precision_at_k * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHybrid ? "bg-indigo-600" : "bg-slate-400"}`}
                        style={{ width: `${Math.min(100, ev.precision_at_k * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span>Recall@{selectedK}</span>
                      <strong className="text-slate-900 dark:text-white">{(ev.recall_at_k * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHybrid ? "bg-indigo-600" : "bg-slate-400"}`}
                        style={{ width: `${Math.min(100, ev.recall_at_k * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span>F1-Score</span>
                      <strong className="text-slate-900 dark:text-white">{(ev.f1_score * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHybrid ? "bg-indigo-600" : "bg-slate-400"}`}
                        style={{ width: `${Math.min(100, ev.f1_score * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span>NDCG@{selectedK} (Ranking)</span>
                      <strong className="text-slate-900 dark:text-white">{(ev.ndcg_at_k * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHybrid ? "bg-indigo-600" : "bg-slate-400"}`}
                        style={{ width: `${Math.min(100, ev.ndcg_at_k * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700/60 flex justify-between items-center text-[10.5px] text-slate-400">
                <span>Coverage: {(ev.coverage_rate * 100).toFixed(0)}%</span>
                <span>N = {ev.sample_size} evals</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Algorithmic Explanation note for CSE major project viva */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
        <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Algorithmic Formulation Summary
        </p>
        <p>
          • <strong>Hybrid Recommendation Engine Formula:</strong> Hybrid Score(u, r) = α × Content Score(u, r) + β × Collaborative Score(u, r), where α = 0.6 and β = 0.4.
        </p>
        <p>
          • <strong>Discounted Cumulative Gain (NDCG@K):</strong> Evaluates position relevance with logarithmic discount: NDCG@K = DCG@K / IDCG@K.
        </p>
      </div>
    </div>
  );
}
