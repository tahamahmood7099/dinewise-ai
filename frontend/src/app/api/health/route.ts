import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "DineWise AI - AI-Based Restaurant Recommendation & Customer Behavior Analysis System",
    version: "2.0.0",
    recommendation_engine: "Hybrid (0.6 * Content + 0.4 * Collaborative)",
    region: "Hyderabad, Telangana, India"
  });
}
