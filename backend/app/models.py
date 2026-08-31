from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user") # 'user' or 'admin'
    city = Column(String(100), default="Hyderabad")
    dietary_pref = Column(String(50), default="All") # 'All', 'Pure Veg', 'Non-Veg', 'Halal'
    preferred_budget = Column(String(50), default="Moderate") # 'Budget', 'Moderate', 'Fine Dining'
    preferred_cuisines = Column(Text, default="[]") # JSON list of cuisines
    preferred_areas = Column(Text, default="[]") # JSON list of areas in Hyderabad
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interactions = relationship("Interaction", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="user", cascade="all, delete-orphan")

class Restaurant(Base):
    __tablename__ = "restaurants"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=False)
    cuisine = Column(String(100), nullable=False, index=True) # Primary cuisine
    cuisines_list = Column(Text, default="[]") # JSON list of multiple cuisine tags
    location = Column(String(200), nullable=False) # e.g. "Road No 36, Jubilee Hills"
    area = Column(String(100), nullable=False, index=True) # "Jubilee Hills", "Banjara Hills", "Madhapur", "Gachibowli", "Charminar", "Tolichowki", "Secunderabad", "Hitech City", "Kukatpally"
    city = Column(String(100), default="Hyderabad")
    rating = Column(Float, default=4.5)
    review_count = Column(Integer, default=150)
    price_for_two = Column(Float, nullable=False) # In INR ₹
    cost_category = Column(String(50), default="Moderate") # 'Budget Friendly', 'Moderate', 'Premium / Fine Dining'
    veg_type = Column(String(50), default="both") # 'veg', 'non_veg', 'both'
    specialty_dishes = Column(Text, default="[]") # JSON list of famous dishes
    opening_status = Column(String(50), default="Open Now (11:00 AM - 11:30 PM)")
    image = Column(String(500), nullable=False) # Primary restaurant photo
    food_gallery = Column(Text, default="[]") # JSON list of authentic food photos
    tags = Column(Text, default="[]") # JSON list of tags e.g. ["Rooftop", "Biryani", "Romantic", "Family Dining", "Late Night"]
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interactions = relationship("Interaction", back_populates="restaurant", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="restaurant", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="restaurant", cascade="all, delete-orphan")

class CuisineCategory(Base):
    __tablename__ = "cuisine_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), default="")
    image = Column(String(500), default="")

class Interaction(Base):
    __tablename__ = "interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False, index=True)
    interaction_type = Column(String(50), nullable=False) # 'view', 'click', 'search', 'favorite', 'rating', 'recommendation_click', 'like', 'dislike'
    weight = Column(Float, default=1.0)
    metadata_info = Column(Text, default="{}") # JSON metadata (e.g. search term, duration, source)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="interactions")
    restaurant = relationship("Restaurant", back_populates="interactions")

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="favorites")
    restaurant = relationship("Restaurant", back_populates="favorites")

class Rating(Base):
    __tablename__ = "ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False, index=True)
    rating_score = Column(Float, nullable=False) # 1.0 - 5.0
    review_text = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="ratings")
    restaurant = relationship("Restaurant", back_populates="ratings")

class SearchLog(Base):
    __tablename__ = "search_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    session_id = Column(String(100), nullable=True)
    query = Column(String(255), nullable=False)
    parsed_intent = Column(Text, default="{}") # JSON extracted criteria
    result_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class RecommendationFeedback(Base):
    __tablename__ = "recommendation_feedbacks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    session_id = Column(String(100), nullable=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    feedback_type = Column(String(20), nullable=False) # 'like', 'dislike'
    recommendation_source = Column(String(50), default="hybrid")
    created_at = Column(DateTime, default=datetime.utcnow)
