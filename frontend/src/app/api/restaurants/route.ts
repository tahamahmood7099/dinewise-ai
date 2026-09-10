import { NextRequest, NextResponse } from "next/server";
import { RESTAURANTS } from "../../../lib/server-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area");
  const cuisine = searchParams.get("cuisine");
  const vegType = searchParams.get("veg_type");
  const maxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : null;
  const minRating = searchParams.get("min_rating") ? Number(searchParams.get("min_rating")) : null;
  const sortBy = searchParams.get("sort_by") || "rating";

  let filtered = [...RESTAURANTS];

  if (area && area !== "All") {
    filtered = filtered.filter((r) => r.area.toLowerCase() === area.toLowerCase());
  }

  if (cuisine && cuisine !== "All") {
    filtered = filtered.filter((r) =>
      r.cuisine.toLowerCase() === cuisine.toLowerCase() ||
      r.cuisines_list.some((c) => c.toLowerCase() === cuisine.toLowerCase())
    );
  }

  if (vegType && vegType !== "all") {
    if (vegType === "veg") {
      filtered = filtered.filter((r) => r.veg_type === "pure_veg");
    } else if (vegType === "non_veg") {
      filtered = filtered.filter((r) => r.veg_type !== "pure_veg");
    }
  }

  if (maxPrice) {
    filtered = filtered.filter((r) => r.price_for_two <= maxPrice);
  }

  if (minRating) {
    filtered = filtered.filter((r) => r.rating >= minRating);
  }

  if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "reviews") {
    filtered.sort((a, b) => b.review_count - a.review_count);
  } else if (sortBy === "price_asc") {
    filtered.sort((a, b) => a.price_for_two - b.price_for_two);
  } else if (sortBy === "price_desc") {
    filtered.sort((a, b) => b.price_for_two - a.price_for_two);
  }

  return NextResponse.json(filtered);
}
