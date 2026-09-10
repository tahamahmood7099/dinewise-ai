import { NextResponse } from "next/server";
import { RESTAURANTS, DEMO_USERS } from "../../../../lib/server-data";

export async function GET() {
  return NextResponse.json({
    total_users: DEMO_USERS.length,
    total_restaurants: RESTAURANTS.length,
    total_interactions: 320,
    total_searches: 145,
    active_sessions_today: 18,
    top_cuisines: [
      { name: "Biryani", count: 142 },
      { name: "Mughlai", count: 88 },
      { name: "South Indian", count: 64 },
      { name: "Italian & Pizza", count: 45 },
      { name: "Bakery & Desserts", count: 39 }
    ],
    popular_areas: [
      { name: "Tolichowki", count: 96 },
      { name: "Banjara Hills", count: 84 },
      { name: "Charminar", count: 72 },
      { name: "Secunderabad", count: 65 },
      { name: "Jubilee Hills", count: 58 }
    ],
    hourly_traffic: [
      { hour: "12 PM - Lunch Peak", count: 54 },
      { hour: "02 PM - Afternoon", count: 28 },
      { hour: "08 PM - Dinner Peak", count: 86 },
      { hour: "10 PM - Late Night", count: 62 }
    ]
  });
}
