import {
  Restaurant, CuisineCategory, HomepageFeed, SearchResponse,
  RatingItem, OverviewStats, CustomerSegmentItem, ModelEvaluationMetrics
} from "../types";

const API_BASE = (() => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`;
  }
  return "https://dinewise-ai.onrender.com/api";
})();

export function getSessionId(): string {
  if (typeof window === "undefined") return "server_session";
  let sid = localStorage.getItem("dinewise_session_id");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem("dinewise_session_id", sid);
  }
  return sid;
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errData.detail || "API Request Failed");
  }

  return response.json();
}

// ================= RECOMMENDATIONS & HOMEPAGE =================
export async function fetchHomepageFeed(userId?: number): Promise<HomepageFeed> {
  const sid = getSessionId();
  const query = userId ? `?user_id=${userId}&session_id=${sid}` : `?session_id=${sid}`;
  return fetchApi<HomepageFeed>(`/recommendations/feed${query}`);
}

export async function submitRecommendationFeedback(restaurantId: number, feedbackType: "like" | "dislike", userId?: number) {
  const sid = getSessionId();
  return fetchApi("/recommendations/feedback", {
    method: "POST",
    body: JSON.stringify({
      restaurant_id: restaurantId,
      feedback_type: feedbackType,
      user_id: userId,
      session_id: sid,
      recommendation_source: "hybrid"
    })
  });
}

// ================= RESTAURANTS =================
export async function fetchRestaurants(params?: {
  cuisine?: string;
  area?: string;
  vegType?: string;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  limit?: number;
  userId?: number;
}): Promise<Restaurant[]> {
  const queryParams = new URLSearchParams();
  if (params?.cuisine && params.cuisine !== "All") queryParams.append("cuisine", params.cuisine);
  if (params?.area && params.area !== "All") queryParams.append("area", params.area);
  if (params?.vegType && params.vegType !== "all") queryParams.append("veg_type", params.vegType);
  if (params?.maxPrice) queryParams.append("max_price", params.maxPrice.toString());
  if (params?.minRating) queryParams.append("min_rating", params.minRating.toString());
  if (params?.sortBy) queryParams.append("sort_by", params.sortBy);
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.userId) queryParams.append("user_id", params.userId.toString());

  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
  return fetchApi<Restaurant[]>(`/restaurants${queryStr}`);
}

export async function fetchRestaurantById(id: number, userId?: number): Promise<Restaurant> {
  const query = userId ? `?user_id=${userId}` : "";
  return fetchApi<Restaurant>(`/restaurants/${id}${query}`);
}

export async function fetchSimilarRestaurants(id: number, limit: number = 4, userId?: number): Promise<Restaurant[]> {
  const queryParams = new URLSearchParams({ limit: limit.toString() });
  if (userId) queryParams.append("user_id", userId.toString());
  return fetchApi<Restaurant[]>(`/restaurants/${id}/similar?${queryParams.toString()}`);
}

export async function fetchCategories(): Promise<CuisineCategory[]> {
  return fetchApi<CuisineCategory[]>("/restaurants/categories");
}

export async function fetchHyderabadAreas(): Promise<string[]> {
  return fetchApi<string[]>("/restaurants/areas");
}

export async function submitRestaurantRating(restaurantId: number, ratingScore: number, reviewText?: string, userId?: number) {
  return fetchApi(`/restaurants/${restaurantId}/ratings`, {
    method: "POST",
    body: JSON.stringify({
      restaurant_id: restaurantId,
      rating_score: ratingScore,
      review_text: reviewText || "",
      user_id: userId
    })
  });
}

export async function fetchRestaurantRatings(restaurantId: number): Promise<RatingItem[]> {
  return fetchApi<RatingItem[]>(`/restaurants/${restaurantId}/ratings`);
}

// ================= SEARCH =================
export async function searchRestaurants(query: string, userId?: number): Promise<SearchResponse> {
  const sid = getSessionId();
  const queryParams = new URLSearchParams({ q: query, session_id: sid });
  if (userId) queryParams.append("user_id", userId.toString());
  return fetchApi<SearchResponse>(`/search?${queryParams.toString()}`);
}

// ================= INTERACTIONS & FAVORITES =================
export async function logInteraction(restaurantId: number, interactionType: string, userId?: number, metadata?: Record<string, any>) {
  const sid = getSessionId();
  return fetchApi("/interactions", {
    method: "POST",
    body: JSON.stringify({
      restaurant_id: restaurantId,
      interaction_type: interactionType,
      user_id: userId,
      session_id: sid,
      metadata_info: metadata || {}
    })
  }).catch(() => {});
}

export async function toggleFavorite(restaurantId: number, userId?: number) {
  const sid = getSessionId();
  return fetchApi<{ action: string; is_favorite: boolean }>("/favorites", {
    method: "POST",
    body: JSON.stringify({
      restaurant_id: restaurantId,
      user_id: userId,
      session_id: sid
    })
  });
}

export async function fetchFavorites(userId?: number): Promise<Restaurant[]> {
  const sid = getSessionId();
  const query = userId ? `?user_id=${userId}` : `?session_id=${sid}`;
  return fetchApi<Restaurant[]>(`/favorites${query}`);
}

export async function fetchRecentlyViewed(userId?: number, limit: number = 6): Promise<Restaurant[]> {
  const sid = getSessionId();
  const queryParams = new URLSearchParams({ limit: limit.toString(), session_id: sid });
  if (userId) queryParams.append("user_id", userId.toString());
  return fetchApi<Restaurant[]>(`/recently-viewed?${queryParams.toString()}`);
}

// ================= AI ASSISTANT =================
export async function sendAssistantMessage(message: string, history: any[] = [], userId?: number) {
  const sid = getSessionId();
  return fetchApi<{
    reply: string;
    restaurants: Restaurant[];
    extracted_filters: Record<string, any>;
    suggestions: string[];
  }>("/assistant", {
    method: "POST",
    body: JSON.stringify({
      message,
      history,
      user_id: userId,
      session_id: sid
    })
  });
}

// ================= ADMIN & ANALYTICS =================
export async function fetchAdminOverview(): Promise<OverviewStats> {
  return fetchApi<OverviewStats>("/admin/overview");
}

export async function fetchCustomerSegments(): Promise<CustomerSegmentItem[]> {
  return fetchApi<CustomerSegmentItem[]>("/admin/segments");
}

export async function fetchSearchAnalytics(): Promise<{
  popular_searches: Array<{ query: string; count: number }>;
  zero_result_searches: Array<{ query: string; count: number }>;
}> {
  return fetchApi("/admin/searches");
}

export async function fetchEvaluationMetrics(): Promise<ModelEvaluationMetrics[]> {
  return fetchApi<ModelEvaluationMetrics[]>("/admin/evaluation");
}

export async function fetchAnalyticsCharts(): Promise<{
  cuisines: Array<{ name: string; count: number; share: number }>;
  hourly_traffic: Array<{ hour: string; views: number }>;
}> {
  return fetchApi("/admin/analytics");
}
