from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    city: Optional[str] = "Mumbai"
    preferred_categories: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    city: Optional[str] = "Mumbai"
    preferences: Optional[str] = "{}"
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: str
    category: str
    brand: str
    price: float
    original_price: float
    discount: int = 0
    rating: float = 4.5
    review_count: int = 0
    image: str
    additional_images: Optional[str] = "[]"
    tags: Optional[str] = ""
    colors: Optional[str] = "Standard"
    stock: int = 50
    features: Optional[str] = "[]"

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    match_score: Optional[int] = None # Calculated on the fly (0-100%)
    recommendation_reason: Optional[str] = None # Explainable AI reason

    class Config:
        from_attributes = True

# Category Schema
class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    image: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

# Interaction Schemas
class InteractionCreate(BaseModel):
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    product_id: int
    interaction_type: str # 'view', 'click', 'search', 'wishlist', 'cart', 'purchase', 'feedback'
    metadata_info: Optional[Dict[str, Any]] = {}

class InteractionResponse(BaseModel):
    id: int
    user_id: Optional[int]
    session_id: Optional[str]
    product_id: int
    interaction_type: str
    weight: float
    timestamp: datetime

    class Config:
        from_attributes = True

# Cart & Wishlist Schemas
class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1
    session_id: Optional[str] = None

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductResponse

    class Config:
        from_attributes = True

class WishlistItemAdd(BaseModel):
    product_id: int
    session_id: Optional[str] = None

class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    product: ProductResponse

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    payment_method: str = "UPI" # 'UPI', 'COD', 'Card'
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_pincode: str
    session_id: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    price: float
    quantity: int
    image: str

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: Optional[int]
    total_amount: float
    discount_amount: float
    payment_method: str
    payment_status: str
    order_status: str
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_pincode: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

# Recommendation Schemas
class RecommendationRequest(BaseModel):
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    product_id: Optional[int] = None
    category: Optional[str] = None
    limit: int = 8
    diversity_penalty: float = 0.2

class FeedbackCreate(BaseModel):
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    product_id: int
    feedback_type: str # 'like' or 'dislike'
    recommendation_source: Optional[str] = "hybrid"

# Search & NLP Schemas
class SearchQuery(BaseModel):
    query: str
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    brand: Optional[str] = None
    sort_by: Optional[str] = "relevance" # 'relevance', 'price_asc', 'price_desc', 'rating', 'newest'
    limit: int = 24
    offset: int = 0

class ParsedNLPIntent(BaseModel):
    original_query: str
    detected_category: Optional[str] = None
    detected_brand: Optional[str] = None
    detected_color: Optional[str] = None
    detected_keywords: List[str] = []
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    intent_type: str = "product_search"

class SearchResultResponse(BaseModel):
    query: str
    corrected_query: Optional[str] = None
    parsed_intent: ParsedNLPIntent
    total_results: int
    products: List[ProductResponse]
    suggested_categories: List[str] = []
    suggested_brands: List[str] = []

# Assistant Schemas
class AssistantMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class AssistantRequest(BaseModel):
    message: str
    conversation_history: List[AssistantMessage] = []
    user_id: Optional[int] = None
    session_id: Optional[str] = None

class AssistantResponse(BaseModel):
    reply: str
    parsed_intent: Optional[ParsedNLPIntent] = None
    products: List[ProductResponse] = []
    suggestions: List[str] = []

# Admin & Analytics Schemas
class OverviewStats(BaseModel):
    total_users: int
    total_products: int
    total_interactions: int
    total_orders: int
    total_revenue: float
    recommendation_ctr: float
    avg_order_value: float

class CustomerSegmentItem(BaseModel):
    user_id: int
    name: str
    email: str
    total_spend: float
    total_orders: int
    total_interactions: int
    segment: str # 'Budget Shopper', 'Premium Buyer', 'Frequent Buyer', 'Window Shopper'
    preferred_category: str

class DemandIntelligenceItem(BaseModel):
    product_id: int
    product_name: str
    category: str
    price: float
    image: str
    views: int
    cart_adds: int
    purchases: int
    conversion_rate: float
    label: str # "High Interest, Low Conversion", "High Performer", "Underperforming"

class ZeroResultSearchItem(BaseModel):
    query: str
    count: int
    last_searched: datetime

# Model Evaluation Schemas
class EvaluationMetrics(BaseModel):
    model_name: str
    precision_at_k: float
    recall_at_k: float
    f1_score: float
    ndcg_at_k: float
    coverage_rate: float
    sample_size: int
