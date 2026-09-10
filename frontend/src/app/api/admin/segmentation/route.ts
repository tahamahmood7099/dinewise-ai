import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      user_id: 1,
      user_name: "Aarav Sharma",
      email: "aarav.sharma@example.in",
      segment_name: "Biryani Enthusiast",
      dominant_cuisine: "Biryani",
      dining_zone: "Tolichowki / Secunderabad",
      avg_ticket_size: 550.0,
      total_interactions: 28,
      recommended_strategy: "Push seasonal Dum Biryani and Haleem specials with spicy tags"
    },
    {
      user_id: 2,
      user_name: "Priya Patel",
      email: "priya.patel@example.in",
      segment_name: "Vegetarian Explorer",
      dominant_cuisine: "South Indian",
      dining_zone: "Banjara Hills / Hitech City",
      avg_ticket_size: 500.0,
      total_interactions: 22,
      recommended_strategy: "Highlight pure veg tiffins, artisanal ghee dosas, and dessert bakeries"
    },
    {
      user_id: 3,
      user_name: "Rohan Verma",
      email: "rohan.verma@example.in",
      segment_name: "Premium Diner",
      dominant_cuisine: "Italian & Pizza",
      dining_zone: "Jubilee Hills / Madhapur",
      avg_ticket_size: 1300.0,
      total_interactions: 19,
      recommended_strategy: "Recommend fine dining chef tables, woodfired pizzerias, and aesthetic cafes"
    },
    {
      user_id: 4,
      user_name: "Ananya Mukherjee",
      email: "ananya.m@example.in",
      segment_name: "Budget Explorer",
      dominant_cuisine: "Mughlai",
      dining_zone: "Charminar / Old City",
      avg_ticket_size: 300.0,
      total_interactions: 15,
      recommended_strategy: "Promote pocket-friendly street food combos and historic Irani chai spots"
    }
  ]);
}
