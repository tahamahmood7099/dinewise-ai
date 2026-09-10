import { NextRequest, NextResponse } from "next/server";
import { RESTAURANTS } from "../../../../lib/server-data";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const restaurant = RESTAURANTS.find((r) => r.id === id);
  if (!restaurant) {
    return NextResponse.json({ detail: "Restaurant not found" }, { status: 404 });
  }

  // Similar restaurants based on cuisine and area
  const similar = RESTAURANTS.filter(
    (r) => r.id !== id && (r.cuisine === restaurant.cuisine || r.area === restaurant.area)
  ).slice(0, 4);

  return NextResponse.json({
    ...restaurant,
    similar_restaurants: similar,
    reviews: [
      {
        id: 101,
        user_name: "Aarav Sharma",
        rating: 5.0,
        comment: "Exceptional authentic flavor and spice balance! One of the finest in Hyderabad.",
        created_at: "2026-08-28"
      },
      {
        id: 102,
        user_name: "Priya Patel",
        rating: 4.8,
        comment: "Great dining ambiance and very courteous staff. Highly recommended.",
        created_at: "2026-08-25"
      }
    ]
  });
}
