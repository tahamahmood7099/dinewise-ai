import { NextRequest, NextResponse } from "next/server";
import { RESTAURANTS } from "../../../lib/server-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();

  if (!q) {
    return NextResponse.json({
      query: "",
      intent: { is_restaurant_query: false },
      results: RESTAURANTS,
      total: RESTAURANTS.length
    });
  }

  // NLP Entity Extraction
  let detectedCuisine: string | null = null;
  let detectedArea: string | null = null;
  let detectedMaxPrice: number | null = null;
  let isVegOnly = false;

  const CUISINES = ["biryani", "mughlai", "south indian", "north indian", "chinese", "italian", "cafe", "bakery", "street food", "healthy"];
  for (const c of CUISINES) {
    if (q.includes(c) || (c === "biryani" && q.includes("biriyani"))) {
      detectedCuisine = c === "biriyani" ? "Biryani" : c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  const AREAS = ["banjara hills", "jubilee hills", "madhapur", "gachibowli", "charminar", "tolichowki", "secunderabad", "hitech city", "kukatpally"];
  for (const a of AREAS) {
    if (q.includes(a) || (a === "tolichowki" && (q.includes("tolichoki") || q.includes("toli chowki")))) {
      detectedArea = a === "tolichoki" || a === "toli chowki" ? "Tolichowki" : a.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      break;
    }
  }

  if (q.includes("under 500") || q.includes("below 500") || q.includes("500")) {
    detectedMaxPrice = 500;
  } else if (q.includes("under 1000") || q.includes("below 1000")) {
    detectedMaxPrice = 1000;
  }

  if (q.includes("pure veg") || q.includes("vegetarian") || q.includes("veg only")) {
    isVegOnly = true;
  }

  let results = RESTAURANTS.filter((r) => {
    let matches = true;

    if (detectedCuisine && !r.cuisine.toLowerCase().includes(detectedCuisine.toLowerCase()) && !r.cuisines_list.some(c => c.toLowerCase().includes(detectedCuisine!.toLowerCase()))) {
      matches = false;
    }
    if (detectedArea && r.area.toLowerCase() !== detectedArea.toLowerCase()) {
      matches = false;
    }
    if (detectedMaxPrice && r.price_for_two > detectedMaxPrice + 100) {
      matches = false;
    }
    if (isVegOnly && r.veg_type !== "pure_veg") {
      matches = false;
    }

    // Keyword fallback match if no strict entities matched
    if (!detectedCuisine && !detectedArea) {
      const qWords = q.split(/\s+/);
      const matchesName = qWords.some(w => r.name.toLowerCase().includes(w));
      const matchesDish = r.specialty_dishes.some(d => qWords.some(w => d.toLowerCase().includes(w)));
      const matchesTag = r.tags.some(t => qWords.some(w => t.toLowerCase().includes(w)));
      if (!matchesName && !matchesDish && !matchesTag) {
        matches = false;
      }
    }

    return matches;
  });

  if (results.length === 0) {
    results = RESTAURANTS.slice(0, 4);
  }

  return NextResponse.json({
    query: q,
    intent: {
      is_restaurant_query: true,
      cuisine: detectedCuisine,
      area: detectedArea,
      max_price: detectedMaxPrice,
      is_veg_only: isVegOnly
    },
    results: results,
    total: results.length
  });
}
