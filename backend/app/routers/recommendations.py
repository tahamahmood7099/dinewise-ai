import json
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Restaurant, CuisineCategory, User, Favorite, RecommendationFeedback
from ..schemas import HomepageFeed, RestaurantOut, CuisineOut
from ..ml.hybrid_engine import restaurant_hybrid_engine

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/feed", response_model=HomepageFeed)
def get_recommendations_feed(
    user_id: Optional[int] = Query(None),
    session_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    # 1. AI Picks For You (Hybrid Scoring)
    hybrid_items = restaurant_hybrid_engine.get_hybrid_recommendations(
        db=db,
        user_id=user_id,
        session_id=session_id,
        limit=6
    )
    picked_for_you = [_to_restaurant_out(item) for item in hybrid_items]

    # 2. Trending in Hyderabad (High ratings & review counts)
    trending_db = db.query(Restaurant).order_by(Restaurant.review_count.desc(), Restaurant.rating.desc()).limit(6).all()
    user_fav_ids = _get_user_favs(user_id, db)
    trending_hyderabad = [
        _to_restaurant_out_from_db(
            r,
            match_score=92,
            reason=f"Trending right now with {r.review_count}+ foodie reviews in {r.area}.",
            is_fav=r.id in user_fav_ids
        )
        for r in trending_db
    ]

    # 3. Top Rated Restaurants (4.8+ Stars)
    top_db = db.query(Restaurant).filter(Restaurant.rating >= 4.7).order_by(Restaurant.rating.desc()).limit(6).all()
    top_rated = [
        _to_restaurant_out_from_db(
            r,
            match_score=96,
            reason=f"Top-rated {r.cuisine} destination ({r.rating}⭐) in {r.area}.",
            is_fav=r.id in user_fav_ids
        )
        for r in top_db
    ]

    # 4. Budget Friendly (Under ₹500 for two)
    budget_db = db.query(Restaurant).filter(Restaurant.price_for_two <= 550.0).order_by(Restaurant.rating.desc()).limit(6).all()
    budget_friendly = [
        _to_restaurant_out_from_db(
            r,
            match_score=88,
            reason=f"Great value feast under ₹{int(r.price_for_two)} for two.",
            is_fav=r.id in user_fav_ids
        )
        for r in budget_db
    ]

    # 5. Near Preferred Location (Banjara Hills / Jubilee Hills / Gachibowli)
    pref_area = "Banjara Hills"
    if user_id:
        u = db.query(User).filter(User.id == user_id).first()
        if u and u.preferred_areas:
            pref_areas_list = json.loads(u.preferred_areas or "[]")
            if pref_areas_list:
                pref_area = pref_areas_list[0]

    near_db = db.query(Restaurant).filter(Restaurant.area.ilike(f"%{pref_area}%")).limit(6).all()
    if not near_db:
        near_db = db.query(Restaurant).limit(6).all()
    
    near_location = [
        _to_restaurant_out_from_db(
            r,
            match_score=90,
            reason=f"Conveniently located in your preferred dining zone ({r.area}).",
            is_fav=r.id in user_fav_ids
        )
        for r in near_db
    ]

    # 6. Explore Something New (Diverse discovery)
    explore_db = db.query(Restaurant).order_by(Restaurant.id.desc()).limit(6).all()
    explore_new = [
        _to_restaurant_out_from_db(
            r,
            match_score=84,
            reason=f"Discover unique {r.cuisine} flavors in {r.area}.",
            is_fav=r.id in user_fav_ids
        )
        for r in explore_db
    ]

    # 7. Categories
    cats = db.query(CuisineCategory).all()
    cuisines_out = [CuisineOut.from_orm(c) for c in cats]

    return HomepageFeed(
        picked_for_you=picked_for_you,
        trending_hyderabad=trending_hyderabad,
        top_rated=top_rated,
        budget_friendly=budget_friendly,
        near_location=near_location,
        explore_new=explore_new,
        cuisines=cuisines_out
    )

@router.post("/feedback")
def submit_recommendation_feedback(
    payload: dict,
    db: Session = Depends(get_db)
):
    r_id = payload.get("restaurant_id")
    fb_type = payload.get("feedback_type", "like")
    user_id = payload.get("user_id")
    session_id = payload.get("session_id")
    source = payload.get("recommendation_source", "hybrid")

    if not r_id:
        return {"error": "restaurant_id required"}

    feedback = RecommendationFeedback(
        restaurant_id=r_id,
        user_id=user_id,
        session_id=session_id,
        feedback_type=fb_type,
        recommendation_source=source
    )
    db.add(feedback)
    db.commit()

    return {"message": "Feedback recorded", "status": "success"}

def _get_user_favs(user_id: Optional[int], db: Session):
    if not user_id:
        return set()
    favs = db.query(Favorite).filter(Favorite.user_id == user_id).all()
    return {f.restaurant_id for f in favs}

def _to_restaurant_out(item: dict) -> RestaurantOut:
    r = item["restaurant"]
    return RestaurantOut(
        id=r.id,
        name=r.name,
        description=r.description,
        cuisine=r.cuisine,
        cuisines_list=json.loads(r.cuisines_list or "[]"),
        location=r.location,
        area=r.area,
        city=r.city,
        rating=r.rating,
        review_count=r.review_count,
        price_for_two=r.price_for_two,
        cost_category=r.cost_category,
        veg_type=r.veg_type,
        specialty_dishes=json.loads(r.specialty_dishes or "[]"),
        opening_status=r.opening_status,
        image=r.image,
        food_gallery=json.loads(r.food_gallery or "[]"),
        tags=json.loads(r.tags or "[]"),
        match_score=item["match_score"],
        recommendation_reason=item["reason"],
        is_favorite=item.get("is_favorite", False)
    )

def _to_restaurant_out_from_db(r: Restaurant, match_score: int, reason: str, is_fav: bool) -> RestaurantOut:
    return RestaurantOut(
        id=r.id,
        name=r.name,
        description=r.description,
        cuisine=r.cuisine,
        cuisines_list=json.loads(r.cuisines_list or "[]"),
        location=r.location,
        area=r.area,
        city=r.city,
        rating=r.rating,
        review_count=r.review_count,
        price_for_two=r.price_for_two,
        cost_category=r.cost_category,
        veg_type=r.veg_type,
        specialty_dishes=json.loads(r.specialty_dishes or "[]"),
        opening_status=r.opening_status,
        image=r.image,
        food_gallery=json.loads(r.food_gallery or "[]"),
        tags=json.loads(r.tags or "[]"),
        match_score=match_score,
        recommendation_reason=reason,
        is_favorite=is_fav
    )
