import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    top_search_queries: [
      { query: "biryani in tolichowki", count: 48, conversion_rate: "78%" },
      { query: "pure veg in banjara hills", count: 36, conversion_rate: "84%" },
      { query: "haleem near charminar", count: 32, conversion_rate: "91%" },
      { query: "cafe jubilee hills under 1000", count: 26, conversion_rate: "73%" },
      { query: "irani chai and osmania biscuits", count: 21, conversion_rate: "89%" }
    ],
    unmet_demand_queries: [
      { query: "vegan sushi madhapur", count: 12, reason: "Low restaurant inventory in area" },
      { query: "midnight dessert buffet gachibowli", count: 9, reason: "Timing mismatch" }
    ]
  });
}
