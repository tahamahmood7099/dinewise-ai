import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hybrid_weights: {
      alpha_content: 0.6,
      beta_collaborative: 0.4
    },
    metrics: [
      {
        model: "Popularity Baseline",
        precision_at_5: 0.400,
        recall_at_5: 0.583,
        f1_score: 0.475,
        ndcg_at_5: 0.534,
        catalog_coverage: "100%"
      },
      {
        model: "Content-Based (TF-IDF)",
        precision_at_5: 0.700,
        recall_at_5: 1.000,
        f1_score: 0.824,
        ndcg_at_5: 0.981,
        catalog_coverage: "100%"
      },
      {
        model: "Collaborative Filtering (Interaction Matrix)",
        precision_at_5: 0.450,
        recall_at_5: 0.646,
        f1_score: 0.530,
        ndcg_at_5: 0.596,
        catalog_coverage: "83.3%"
      },
      {
        model: "Hybrid Engine (α=0.6, β=0.4)",
        precision_at_5: 0.600,
        recall_at_5: 0.875,
        f1_score: 0.712,
        ndcg_at_5: 0.873,
        catalog_coverage: "100%"
      }
    ]
  });
}
