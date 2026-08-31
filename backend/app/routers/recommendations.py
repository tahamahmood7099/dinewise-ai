from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import Product, Interaction
from ..schemas import ProductResponse
from ..ml.hybrid_engine import hybrid_engine
from ..ml.collaborative_engine import collaborative_engine
from ..ml.content_engine import content_engine

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/personalized", response_model=List[ProductResponse])
def get_personalized_recommendations(
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 8,
    db: Session = Depends(get_db)
):
    """
    Generate Hybrid Content-Collaborative Recommendations with explainable reasons.
    """
    recs = hybrid_engine.get_recommendations(
        db=db,
        user_id=user_id,
        session_id=session_id,
        category=category,
        limit=limit
    )

    results = []
    for prod, match_pct, reason in recs:
        p_res = ProductResponse.from_orm(prod)
        p_res.match_score = match_pct
        p_res.recommendation_reason = reason
        results.append(p_res)

    return results

@router.get("/similar/{product_id}", response_model=List[ProductResponse])
def get_similar_recommendations(
    product_id: int,
    limit: int = 6,
    db: Session = Depends(get_db)
):
    """
    Get similar products and explanation for product details page.
    """
    recs = hybrid_engine.get_recommendations(
        db=db,
        target_product_id=product_id,
        limit=limit
    )

    results = []
    for prod, match_pct, reason in recs:
        p_res = ProductResponse.from_orm(prod)
        p_res.match_score = match_pct
        p_res.recommendation_reason = reason
        results.append(p_res)

    return results

@router.get("/smart-cart", response_model=List[ProductResponse])
def get_smart_cart_recommendations(
    product_ids: str = Query(..., description="Comma-separated product IDs in cart"),
    limit: int = 4,
    db: Session = Depends(get_db)
):
    """
    Smart Cart complementary cross-sell recommendations based on items in cart.
    """
    try:
        cart_pids = [int(i.strip()) for i in product_ids.split(",") if i.strip()]
    except ValueError:
        return []

    if not cart_pids:
        return []

    all_products = db.query(Product).all()
    prod_map = {p.id: p for p in all_products}
    
    # 1. Check collaborative co-occurrence first
    suggested_pids = []
    for pid in cart_pids:
        fbt = collaborative_engine.get_frequently_bought_together(pid, top_n=2)
        for fbt_pid, score in fbt:
            if fbt_pid not in cart_pids and fbt_pid not in suggested_pids:
                suggested_pids.append(fbt_pid)

    # 2. Add complementary category items
    complementary_cat_map = {
        "Ethnic & Fashion": ["Watches & Accessories", "Footwear"],
        "Footwear": ["Watches & Accessories", "Electronics & Audio"],
        "Electronics & Audio": ["Watches & Accessories"],
        "Indian Delicacies & Sweets": ["Groceries & Spices"],
        "Groceries & Spices": ["Home & Kitchen"],
        "Beauty & Ayurveda": ["Watches & Accessories"],
        "Home & Kitchen": ["Groceries & Spices"],
        "Watches & Accessories": ["Ethnic & Fashion"]
    }

    cart_cats = [prod_map[pid].category for pid in cart_pids if pid in prod_map]
    target_cats = set()
    for c in cart_cats:
        for comp_c in complementary_cat_map.get(c, []):
            target_cats.add(comp_c)

    for p in all_products:
        if p.id not in cart_pids and p.id not in suggested_pids and p.category in target_cats:
            suggested_pids.append(p.id)
            if len(suggested_pids) >= limit:
                break

    results = []
    for pid in suggested_pids[:limit]:
        if pid in prod_map:
            prod = prod_map[pid]
            p_res = ProductResponse.from_orm(prod)
            p_res.match_score = 92
            p_res.recommendation_reason = f"Frequently paired with items in your cart"
            results.append(p_res)

    return results

@router.get("/feed")
def get_personalized_homepage_feed(
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns full personalized homepage multi-section data.
    """
    all_products = db.query(Product).all()
    if not all_products:
        return {}

    # 1. Trending Now (High rating & review volume)
    trending = sorted(all_products, key=lambda p: (p.rating * p.review_count), reverse=True)[:6]
    trending_res = [ProductResponse.from_orm(p) for p in trending]
    for p in trending_res:
        p.recommendation_reason = f"Trending across India ({p.review_count}+ orders)"
        p.match_score = 94

    # 2. Picked For You (Hybrid AI)
    picked_raw = hybrid_engine.get_recommendations(db=db, user_id=user_id, session_id=session_id, limit=6)
    picked_res = []
    for prod, match_pct, reason in picked_raw:
        p_res = ProductResponse.from_orm(prod)
        p_res.match_score = match_pct
        p_res.recommendation_reason = reason
        picked_res.append(p_res)

    # 3. Budget Deals (High discount > 35%)
    budget_items = sorted([p for p in all_products if p.discount >= 30], key=lambda p: p.discount, reverse=True)[:6]
    budget_res = [ProductResponse.from_orm(p) for p in budget_items]
    for p in budget_res:
        p.recommendation_reason = f"Festive Deal: {p.discount}% OFF"
        p.match_score = 88

    # 4. Festive Highlights (Indian Celebrations & Traditional Delights)
    festive_categories = ["Ethnic & Fashion", "Indian Delicacies & Sweets", "Home & Kitchen"]
    festive_items = [p for p in all_products if p.category in festive_categories][:6]
    festive_res = [ProductResponse.from_orm(p) for p in festive_items]
    for p in festive_res:
        p.recommendation_reason = "Curated for Festive Celebrations & Gifting"
        p.match_score = 91

    # 5. Recently Viewed / Session history based
    user_interactions = []
    if user_id:
        user_interactions = db.query(Interaction).filter(Interaction.user_id == user_id).order_by(desc(Interaction.timestamp)).limit(5).all()
    elif session_id:
        user_interactions = db.query(Interaction).filter(Interaction.session_id == session_id).order_by(desc(Interaction.timestamp)).limit(5).all()

    recently_viewed_res = []
    seen_pids = set()
    prod_dict = {p.id: p for p in all_products}
    for inter in user_interactions:
        if inter.product_id in prod_dict and inter.product_id not in seen_pids:
            p_obj = prod_dict[inter.product_id]
            p_res = ProductResponse.from_orm(p_obj)
            p_res.recommendation_reason = "From your recent browsing history"
            recently_viewed_res.append(p_res)
            seen_pids.add(inter.product_id)

    return {
        "trending_now": trending_res,
        "picked_for_you": picked_res,
        "matches_budget": budget_res,
        "festive_specials": festive_res,
        "recently_viewed": recently_viewed_res
    }
