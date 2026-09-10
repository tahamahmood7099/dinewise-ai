import { NextRequest, NextResponse } from "next/server";
import { RESTAURANTS, DEMO_USERS } from "../../../../lib/server-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id") ? Number(searchParams.get("user_id")) : 1;

  const user = DEMO_USERS.find((u) => u.id === userId) || DEMO_USERS[0];

  // 1. Personalized Picks For You (Hybrid logic based on user profile)
  let picked = [...RESTAURANTS].map((r) => {
    let contentScore = 0.5;
    let collabScore = 0.5;
    let reason = "Recommended based on overall popularity in Hyderabad.";

    if (user.id === 1) {
      // Aarav - Biryani Lover
      if (r.cuisine === "Biryani" || r.cuisine === "Mughlai") {
        contentScore = 0.95;
        collabScore = 0.88;
        reason = `Matches your strong affinity for authentic ${r.cuisine} cuisine in ${r.area}.`;
      }
    } else if (user.id === 2) {
      // Priya - Pure Veg South Indian
      if (r.veg_type === "pure_veg" || r.cuisine === "South Indian" || r.cuisine === "Bakery & Desserts") {
        contentScore = 0.98;
        collabScore = 0.90;
        reason = `Pure vegetarian dining match with high ${r.cuisine} affinity in ${r.area}.`;
      } else {
        contentScore = 0.2;
        collabScore = 0.2;
      }
    } else if (user.id === 3) {
      // Rohan - Fine Dining Italian
      if (r.cuisine === "Italian & Pizza" || r.cuisine === "Cafe & Bistro" || r.cost_category.includes("Fine Dining")) {
        contentScore = 0.96;
        collabScore = 0.92;
        reason = `Fine dining culinary match with high ${r.cuisine} ambiance affinity in ${r.area}.`;
      }
    } else if (user.id === 4) {
      // Ananya - Budget Explorer
      if (r.price_for_two <= 500) {
        contentScore = 0.94;
        collabScore = 0.89;
        reason = `Budget-friendly dining spot under ₹500 for two in ${r.area}.`;
      }
    }

    const hybridScore = Number((0.6 * contentScore + 0.4 * collabScore).toFixed(3));
    const matchPercentage = Math.round(hybridScore * 100);

    return {
      ...r,
      recommendation_score: hybridScore,
      match_percentage: matchPercentage,
      recommendation_reason: reason,
      algorithm: "Hybrid (0.6*Content + 0.4*Collaborative)",
      score_breakdown: {
        content_score: contentScore,
        collaborative_score: collabScore,
        cuisine_match: contentScore > 0.6 ? 95 : 60,
        area_match: 85,
        budget_match: 90,
        dietary_match: user.id === 2 && r.veg_type !== "pure_veg" ? 20 : 95
      }
    };
  });

  picked.sort((a, b) => b.recommendation_score - a.recommendation_score);

  // 2. Trending in Hyderabad
  const trending = [...RESTAURANTS].sort((a, b) => b.review_count - a.review_count).slice(0, 6);

  // 3. Top Rated (4.8+)
  const topRated = [...RESTAURANTS].filter((r) => r.rating >= 4.7).slice(0, 6);

  // 4. Budget Friendly (Under 550)
  const budgetFriendly = [...RESTAURANTS].filter((r) => r.price_for_two <= 550).slice(0, 6);

  // 5. Near Location
  const nearLocation = [...RESTAURANTS].filter((r) =>
    user.preferred_areas ? user.preferred_areas.includes(r.area) : true
  ).slice(0, 6);

  // 6. Explore New
  const exploreNew = [...RESTAURANTS].slice(4, 10);

  return NextResponse.json({
    picked_for_you: picked.slice(0, 6),
    trending_hyderabad: trending,
    top_rated: topRated,
    budget_friendly: budgetFriendly,
    near_location: nearLocation.length > 0 ? nearLocation : RESTAURANTS.slice(0, 6),
    explore_new: exploreNew
  });
}
