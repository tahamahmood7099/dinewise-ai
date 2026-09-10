import { NextRequest, NextResponse } from "next/server";
import { RESTAURANTS } from "../../../../lib/server-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = (body.message || "").toLowerCase();

    let matched = RESTAURANTS.slice(0, 3);
    let reply = "I found some incredible dining spots in Hyderabad tailored for you!";

    if (query.includes("biryani") || query.includes("haleem")) {
      matched = RESTAURANTS.filter((r) => r.cuisine === "Biryani" || r.cuisine === "Mughlai");
      reply = "For authentic Hyderabadi Biryani and slow-cooked Haleem, here are the finest heritage culinary destinations:";
    } else if (query.includes("veg") || query.includes("south indian")) {
      matched = RESTAURANTS.filter((r) => r.veg_type === "pure_veg" || r.cuisine === "South Indian");
      reply = "For pure vegetarian dining and iconic South Indian tiffins, check out these top-rated spots:";
    } else if (query.includes("fine dining") || query.includes("italian") || query.includes("romantic")) {
      matched = RESTAURANTS.filter((r) => r.cuisine === "Italian & Pizza" || r.cost_category.includes("Fine Dining"));
      reply = "Here are curated gourmet fine-dining restaurants perfect for upscale dining:";
    }

    return NextResponse.json({
      reply: reply,
      suggested_restaurants: matched.slice(0, 3),
      suggested_followups: [
        "Show places under ₹500 for two",
        "Best biryani in Tolichowki",
        "Pure veg breakfast spots in Banjara Hills"
      ]
    });
  } catch (e) {
    return NextResponse.json({
      reply: "Hello! I am your DineWise AI Hyderabad Restaurant Concierge. How can I help you dine today?",
      suggested_restaurants: RESTAURANTS.slice(0, 3),
      suggested_followups: ["Best biryani in Hyderabad", "Pure veg restaurants"]
    });
  }
}
