export interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine: string;
  cuisines_list: string[];
  location: string;
  area: string;
  city: string;
  rating: number;
  review_count: number;
  price_for_two: number;
  cost_category: string; // 'Budget Friendly', 'Moderate', 'Premium / Fine Dining'
  veg_type: "veg" | "non_veg" | "both";
  specialty_dishes: string[];
  opening_status: string;
  image: string;
  food_gallery: string[];
  tags: string[];
  match_score?: number;
  recommendation_reason?: string;
  is_favorite?: boolean;
}

export interface CuisineCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  city: string;
  dietary_pref?: string;
  preferred_budget?: string;
  preferred_cuisines?: string[];
  preferred_areas?: string[];
  created_at?: string;
}

export interface RatingItem {
  id: number;
  restaurant_id: number;
  user_id?: number;
  user_name?: string;
  rating_score: number;
  review_text: string;
  created_at: string;
}

export interface HomepageFeed {
  picked_for_you: Restaurant[];
  trending_hyderabad: Restaurant[];
  top_rated: Restaurant[];
  budget_friendly: Restaurant[];
  near_location: Restaurant[];
  explore_new: Restaurant[];
  cuisines: CuisineCategory[];
}

export interface SearchResponse {
  query: string;
  nlp_intent: {
    cleaned_query: string;
    corrected_query: string;
    cuisine?: string;
    area?: string;
    max_price?: number;
    is_veg?: boolean;
    is_top_rated?: boolean;
  };
  restaurants: Restaurant[];
  total_count: number;
}

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
  restaurants?: Restaurant[];
  suggestions?: string[];
}

export interface OverviewStats {
  total_users: number;
  active_users_today: number;
  total_restaurants: number;
  total_cuisines: number;
  total_interactions: number;
  total_favorites: number;
  total_searches: number;
  recommendation_impressions: number;
  recommendation_ctr: number;
  recommendation_acceptance_rate: number;
}

export interface CustomerSegmentItem {
  user_id: number;
  name: string;
  email: string;
  segment: string;
  preferred_cuisine: string;
  preferred_area: string;
  total_interactions: number;
  total_favorites: number;
  avg_budget_affinity: number;
}

export interface ModelEvaluationMetrics {
  model_name: string;
  precision_at_k: number;
  recall_at_k: number;
  f1_score: number;
  ndcg_at_k: number;
  coverage_rate: number;
  sample_size: number;
}
