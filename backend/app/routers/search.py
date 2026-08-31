import json
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Restaurant, SearchLog, Favorite
from ..schemas import SearchResponse, RestaurantOut
from ..ml.nlp_parser import restaurant_nlp_parser

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=SearchResponse)
def search_restaurants(
    q: str = Query(..., description="Search query string"),
    user_id: Optional[int] = Query(None),
    session_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    nlp_res = restaurant_nlp_parser.parse_query(q)
    
    query = db.query(Restaurant)

    # 1. Apply NLP Filter Constraints if detected
    if nlp_res["cuisine"]:
        query = query.filter(
            (Restaurant.cuisine.ilike(f"%{nlp_res['cuisine']}%")) |
            (Restaurant.cuisines_list.ilike(f"%{nlp_res['cuisine']}%")) |
            (Restaurant.description.ilike(f"%{nlp_res['cuisine']}%"))
        )

    if nlp_res["area"]:
        query = query.filter(Restaurant.area.ilike(f"%{nlp_res['area']}%"))

    if nlp_res["max_price"]:
        query = query.filter(Restaurant.price_for_two <= nlp_res["max_price"])

    if nlp_res["is_veg"]:
        query = query.filter(Restaurant.veg_type == "veg")

    # 2. General Text Match fallback if NLP was broad
    if not nlp_res["cuisine"] and not nlp_res["area"]:
        corrected = nlp_res["corrected_query"]
        terms = corrected.split()
        for term in terms:
            if len(term) >= 3:
                query = query.filter(
                    (Restaurant.name.ilike(f"%{term}%")) |
                    (Restaurant.cuisine.ilike(f"%{term}%")) |
                    (Restaurant.area.ilike(f"%{term}%")) |
                    (Restaurant.specialty_dishes.ilike(f"%{term}%")) |
                    (Restaurant.tags.ilike(f"%{term}%"))
                )

    if nlp_res["is_top_rated"]:
        query = query.order_by(Restaurant.rating.desc(), Restaurant.review_count.desc())
    else:
        query = query.order_by(Restaurant.rating.desc())

    matched_restaurants = query.limit(20).all()

    # Log the search
    log_entry = SearchLog(
        user_id=user_id,
        session_id=session_id,
        query=q,
        parsed_intent=json.dumps(nlp_res),
        result_count=len(matched_restaurants)
    )
    db.add(log_entry)
    db.commit()

    user_fav_ids = set()
    if user_id:
        favs = db.query(Favorite).filter(Favorite.user_id == user_id).all()
        user_fav_ids = {f.restaurant_id for f in favs}

    restaurant_outs = []
    for r in matched_restaurants:
        restaurant_outs.append(RestaurantOut(
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
            match_score=94,
            recommendation_reason=f"Matches your search criteria for {r.cuisine} in {r.area}.",
            is_favorite=r.id in user_fav_ids
        ))

    return SearchResponse(
        query=q,
        nlp_intent=nlp_res,
        restaurants=restaurant_outs,
        total_count=len(restaurant_outs)
    )
