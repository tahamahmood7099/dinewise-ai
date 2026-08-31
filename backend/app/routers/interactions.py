import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Interaction, Favorite, Restaurant, User
from ..schemas import InteractionCreate, FavoriteCreate, RestaurantOut
from ..config import settings

router = APIRouter(tags=["Interactions & Favorites"])

@router.post("/interactions")
def log_interaction(
    payload: InteractionCreate,
    db: Session = Depends(get_db)
):
    # Determine weight by interaction type
    w = settings.WEIGHT_VIEW
    t = payload.interaction_type.lower()
    if t == "click":
        w = settings.WEIGHT_CLICK
    elif t == "search":
        w = settings.WEIGHT_SEARCH
    elif t == "recommendation_click":
        w = settings.WEIGHT_RECOMMENDATION_CLICK
    elif t == "favorite":
        w = settings.WEIGHT_FAVORITE
    elif t == "rating":
        w = settings.WEIGHT_RATING
    elif t == "like":
        w = settings.WEIGHT_FEEDBACK_POSITIVE
    elif t == "dislike":
        w = settings.WEIGHT_FEEDBACK_NEGATIVE

    interaction = Interaction(
        user_id=payload.user_id,
        session_id=payload.session_id,
        restaurant_id=payload.restaurant_id,
        interaction_type=t,
        weight=w,
        metadata_info=json.dumps(payload.metadata_info or {})
    )
    db.add(interaction)
    db.commit()

    return {"status": "logged", "type": t, "weight": w}

@router.post("/favorites")
def toggle_favorite(
    payload: FavoriteCreate,
    db: Session = Depends(get_db)
):
    query = db.query(Favorite).filter(Favorite.restaurant_id == payload.restaurant_id)
    if payload.user_id:
        query = query.filter(Favorite.user_id == payload.user_id)
    elif payload.session_id:
        query = query.filter(Favorite.session_id == payload.session_id)
    
    existing = query.first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"action": "removed", "is_favorite": False}
    else:
        new_fav = Favorite(
            user_id=payload.user_id,
            session_id=payload.session_id,
            restaurant_id=payload.restaurant_id
        )
        db.add(new_fav)
        
        # Also log high-weight interaction for collaborative filtering
        db.add(Interaction(
            user_id=payload.user_id,
            session_id=payload.session_id,
            restaurant_id=payload.restaurant_id,
            interaction_type="favorite",
            weight=settings.WEIGHT_FAVORITE
        ))
        db.commit()
        return {"action": "added", "is_favorite": True}

@router.get("/favorites", response_model=List[RestaurantOut])
def get_favorites(
    user_id: Optional[int] = Query(None),
    session_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Favorite)
    if user_id:
        query = query.filter(Favorite.user_id == user_id)
    elif session_id:
        query = query.filter(Favorite.session_id == session_id)
    else:
        return []

    favs = query.order_by(Favorite.created_at.desc()).all()
    results = []
    for f in favs:
        r = f.restaurant
        if r:
            results.append(RestaurantOut(
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
                match_score=96,
                recommendation_reason="Saved in your personal favorites list.",
                is_favorite=True
            ))
    return results

@router.delete("/favorites/{restaurant_id}")
def remove_favorite(
    restaurant_id: int,
    user_id: Optional[int] = Query(None),
    session_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Favorite).filter(Favorite.restaurant_id == restaurant_id)
    if user_id:
        query = query.filter(Favorite.user_id == user_id)
    elif session_id:
        query = query.filter(Favorite.session_id == session_id)

    fav = query.first()
    if fav:
        db.delete(fav)
        db.commit()
        return {"status": "removed"}
    return {"status": "not_found"}

@router.get("/recently-viewed", response_model=List[RestaurantOut])
def get_recently_viewed(
    user_id: Optional[int] = Query(None),
    session_id: Optional[str] = Query(None),
    limit: int = Query(6),
    db: Session = Depends(get_db)
):
    query = db.query(Interaction).filter(Interaction.interaction_type.in_(["view", "click"]))
    if user_id:
        query = query.filter(Interaction.user_id == user_id)
    elif session_id:
        query = query.filter(Interaction.session_id == session_id)
    else:
        return []

    recent_inters = query.order_by(Interaction.created_at.desc()).limit(20).all()
    
    seen_ids = set()
    results = []
    user_fav_ids = set()
    if user_id:
        favs = db.query(Favorite).filter(Favorite.user_id == user_id).all()
        user_fav_ids = {f.restaurant_id for f in favs}

    for inter in recent_inters:
        r_id = inter.restaurant_id
        if r_id not in seen_ids:
            seen_ids.add(r_id)
            r = inter.restaurant
            if r:
                results.append(RestaurantOut(
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
                    match_score=90,
                    recommendation_reason="Recently explored by you in Hyderabad.",
                    is_favorite=r.id in user_fav_ids
                ))
            if len(results) >= limit:
                break

    return results
