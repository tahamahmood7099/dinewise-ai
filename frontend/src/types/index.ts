export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  city?: string;
  preferences?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  original_price: number;
  discount: number;
  rating: number;
  review_count: number;
  image: string;
  additional_images?: string;
  tags?: string;
  colors?: string;
  stock: number;
  features?: string;
  created_at: string;
  match_score?: number;
  recommendation_reason?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  product: Product;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  total_amount: number;
  discount_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  created_at: string;
  items: OrderItem[];
}

export interface ParsedNLPIntent {
  original_query: string;
  detected_category?: string;
  detected_brand?: string;
  detected_color?: string;
  detected_keywords: string[];
  min_price?: number;
  max_price?: number;
  intent_type: string;
}

export interface SearchResult {
  query: string;
  corrected_query?: string;
  parsed_intent: ParsedNLPIntent;
  total_results: number;
  products: Product[];
  suggested_categories: string[];
  suggested_brands: string[];
}

export interface OverviewStats {
  total_users: number;
  total_products: number;
  total_interactions: number;
  total_orders: number;
  total_revenue: number;
  recommendation_ctr: number;
  avg_order_value: number;
}

export interface CustomerSegmentItem {
  user_id: number;
  name: string;
  email: string;
  total_spend: number;
  total_orders: number;
  total_interactions: number;
  segment: string;
  preferred_category: string;
}

export interface DemandIntelligenceItem {
  product_id: number;
  product_name: string;
  category: string;
  price: number;
  image: string;
  views: number;
  cart_adds: number;
  purchases: number;
  conversion_rate: number;
  label: string;
}

export interface ZeroResultSearchItem {
  query: string;
  count: number;
  last_searched: string;
}

export interface EvaluationMetrics {
  model_name: string;
  precision_at_k: number;
  recall_at_k: number;
  f1_score: number;
  ndcg_at_k: number;
  coverage_rate: number;
  sample_size: number;
}

export interface HomepageFeed {
  trending_now: Product[];
  picked_for_you: Product[];
  matches_budget: Product[];
  festive_specials: Product[];
  recently_viewed: Product[];
}
