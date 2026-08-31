import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user") # 'user' or 'admin'
    preferences = Column(Text, default="{}") # JSON string of preferences (e.g. favorite categories, budget range)
    city = Column(String(100), default="Mumbai")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    interactions = relationship("Interaction", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    image = Column(String(500), nullable=True)
    description = Column(String(255), nullable=True)


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    brand = Column(String(100), index=True, nullable=False)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=False)
    discount = Column(Integer, default=0) # Percentage
    rating = Column(Float, default=4.5)
    review_count = Column(Integer, default=0)
    image = Column(String(500), nullable=False)
    additional_images = Column(Text, default="[]") # JSON list of URLs
    tags = Column(String(255), default="") # Comma-separated tags
    colors = Column(String(150), default="Standard") # Comma-separated colors
    stock = Column(Integer, default=50)
    features = Column(Text, default="[]") # JSON list of key feature bullet points
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    interactions = relationship("Interaction", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    interaction_type = Column(String(50), nullable=False) # 'view', 'click', 'search', 'wishlist', 'cart', 'purchase', 'feedback'
    weight = Column(Float, default=1.0)
    metadata_info = Column(Text, default="{}") # Context info (e.g. search query, source page)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="interactions")
    product = relationship("Product", back_populates="interactions")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="cart_items")
    product = relationship("Product")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=True)
    total_amount = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    payment_method = Column(String(50), default="UPI") # 'UPI', 'COD', 'Card'
    payment_status = Column(String(50), default="Completed") # 'Completed', 'Pending'
    order_status = Column(String(50), default="Confirmed") # 'Confirmed', 'Shipped', 'Delivered'
    
    # India-specific shipping fields
    shipping_name = Column(String(100), nullable=False)
    shipping_phone = Column(String(20), nullable=False)
    shipping_address = Column(String(255), nullable=False)
    shipping_city = Column(String(100), nullable=False)
    shipping_state = Column(String(100), nullable=False)
    shipping_pincode = Column(String(10), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    image = Column(String(500), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class RecommendationFeedback(Base):
    __tablename__ = "recommendation_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    session_id = Column(String(100), index=True, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    recommendation_source = Column(String(100), default="hybrid") # 'content', 'collaborative', 'hybrid', 'trending'
    feedback_type = Column(String(20), nullable=False) # 'like', 'dislike'
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class SearchLog(Base):
    __tablename__ = "search_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(100), index=True, nullable=True)
    query = Column(String(255), nullable=False, index=True)
    parsed_intent = Column(Text, default="{}") # JSON string
    result_count = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
