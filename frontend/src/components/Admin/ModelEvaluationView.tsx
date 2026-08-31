"use client";

import React, { useState } from "react";
import { Cpu, CheckCircle2, BarChart2, ShieldCheck, Sparkles } from "lucide-react";
import { EvaluationMetrics } from "../../types";

interface ModelEvaluationViewProps {
  evaluations: EvaluationMetrics[];
}

export default function ModelEvaluationView({ evaluations }: ModelEvaluationViewProps) {
  const [selectedK, setSelectedK] = useState(5);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-orange-600" />
            <span>Recommendation Engine Algorithmic Benchmark (Evaluation Module)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculated from real user interactions using Hold-out Ground Truth Evaluation (Top-K = {selectedK})
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400">Metric Depth:</span>
          <span className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-lg border border-orange-200 dark:border-orange-800">
            Top @ K = 5
          </span>
        </div>
      </div>

      {/* Benchmark Metric Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {evaluations.map((ev, idx) => {
          const isHybrid = ev.model_name.includes("Hybrid");
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                isHybrid
                  ? "bg-gradient-to-br from-orange-50/80 to-amber-50/50 dark:from-orange-950/40 dark:to-amber-950/20 border-orange-300 dark:border-orange-600 shadow-md ring-1 ring-orange-500/20"
                  : "bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {ev.model_name}
                  </span>
                  {isHybrid && (
                    <span className="bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> Best
                    </span>
                  )}
                </div>

                <div className="space-y-2 mt-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span>Precision@5</span>
                      <strong className="text-slate-900 dark:text-white">{(ev.precision_at_k * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHybrid ? "bg-orange-500" : "bg-slate-400"}`}
                        style={{ width: `${Math.min(100, ev.precision_at_k * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span>Recall@5</span>
                      <strong className="text-slate-900 dark:text-white">{(ev.recall_at_k * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHybrid ? "bg-amber-500" : "bg-slate-400"}`}
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
                        className={`h-full rounded-full ${isHybrid ? "bg-emerald-500" : "bg-slate-400"}`}
                        style={{ width: `${Math.min(100, ev.f1_score * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span>NDCG@5 (Ranking)</span>
                      <strong className="text-slate-900 dark:text-white">{(ev.ndcg_at_k * 100).toFixed(1)}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHybrid ? "bg-indigo-500" : "bg-slate-400"}`}
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

      {/* Algorithmic Explanation note for major project viva */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
        <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Algorithmic Formulation Summary
        </p>
        <p>
          • <strong>Hybrid Recommendation Engine Formula:</strong> Hybrid Score(u, i) = α × TF-IDF Cosine Score(u, i) + β × Collaborative Score(u, i), where α = 0.6 and β = 0.4.
        </p>
        <p>
          • <strong>Discounted Cumulative Gain (NDCG@K):</strong> Measures the ranking relevance of recommended items with logarithmic position discount: NDCG@K = DCG@K / IDCG@K.
        </p>
      </div>
    </div>
  );
}
