from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# ================= USER SCHEMAS =================
class UserBase(BaseModel):
    name: str
    email: str
    city: Optional[str] = "Hyderabad"
    dietary_pref: Optional[str] = "All"
    preferred_budget: Optional[str] = "Moderate"
    preferred_cuisines: Optional[List[str]] = []
    preferred_areas: Optional[List[str]] = []

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ================= RESTAURANT SCHEMAS =================
class RestaurantBase(BaseModel):
    name: str
    description: str
    cuisine: str
    cuisines_list: List[str] = []
    location: str
    area: str
    city: str = "Hyderabad"
    rating: float = 4.5
    review_count: int = 150
    price_for_two: float
    cost_category: str = "Moderate" # 'Budget Friendly', 'Moderate', 'Premium / Fine Dining'
    veg_type: str = "both" # 'veg', 'non_veg', 'both'
    specialty_dishes: List[str] = []
    opening_status: str = "Open Now (11:00 AM - 11:30 PM)"
    image: str
    food_gallery: List[str] = []
    tags: List[str] = []

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantOut(RestaurantBase):
    id: int
    match_score: Optional[int] = 85
    recommendation_reason: Optional[str] = None
    is_favorite: Optional[bool] = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CuisineOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = ""
    image: Optional[str] = ""

    class Config:
        from_attributes = True

# ================= INTERACTION & FAVORITES =================
class InteractionCreate(BaseModel):
    restaurant_id: int
    interaction_type: str # 'view', 'click', 'search', 'favorite', 'rating', 'recommendation_click', 'like', 'dislike'
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    metadata_info: Optional[Dict[str, Any]] = {}

class FavoriteCreate(BaseModel):
    restaurant_id: int
    user_id: Optional[int] = None
    session_id: Optional[str] = None

class RatingCreate(BaseModel):
    restaurant_id: int
    rating_score: float # 1.0 - 5.0
    review_text: Optional[str] = ""
    user_id: Optional[int] = None

class RatingOut(BaseModel):
    id: int
    restaurant_id: int
    user_id: Optional[int]
    user_name: Optional[str] = "Foodie"
    rating_score: float
    review_text: str
    created_at: datetime

    class Config:
        from_attributes = True

# ================= SEARCH & NLP =================
class SearchResponse(BaseModel):
    query: str
    nlp_intent: Dict[str, Any]
    restaurants: List[RestaurantOut]
    total_count: int

# ================= RECOMMENDATIONS FEED =================
class HomepageFeed(BaseModel):
    picked_for_you: List[RestaurantOut]
    trending_hyderabad: List[RestaurantOut]
    top_rated: List[RestaurantOut]
    budget_friendly: List[RestaurantOut]
    near_location: List[RestaurantOut]
    explore_new: List[RestaurantOut]
    cuisines: List[CuisineOut]

# ================= AI ASSISTANT =================
class AssistantHistoryItem(BaseModel):
    role: str
    content: str

class AssistantRequest(BaseModel):
    message: str
    history: Optional[List[AssistantHistoryItem]] = []
    user_id: Optional[int] = None
    session_id: Optional[str] = None

class AssistantResponse(BaseModel):
    reply: str
    restaurants: List[RestaurantOut] = []
    extracted_filters: Dict[str, Any] = {}
    suggestions: List[str] = []

# ================= ADMIN & ANALYTICS =================
class OverviewStats(BaseModel):
    total_users: int
    active_users_today: int
    total_restaurants: int
    total_cuisines: int
    total_interactions: int
    total_favorites: int
    total_searches: int
    recommendation_impressions: int
    recommendation_ctr: float
    recommendation_acceptance_rate: float

class CustomerSegmentItem(BaseModel):
    user_id: int
    name: str
    email: str
    segment: str
    preferred_cuisine: str
    preferred_area: str
    total_interactions: int
    total_favorites: int
    avg_budget_affinity: float

class ModelEvaluationMetrics(BaseModel):
    model_name: str
    precision_at_k: float
    recall_at_k: float
    f1_score: float
    ndcg_at_k: float
    coverage_rate: float
    sample_size: int
