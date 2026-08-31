import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Restaurant, Favorite, User
from ..schemas import AssistantRequest, AssistantResponse, RestaurantOut
from ..ml.nlp_parser import restaurant_nlp_parser

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])

@router.post("", response_model=AssistantResponse)
def ask_assistant(
    payload: AssistantRequest,
    db: Session = Depends(get_db)
):
    query_text = payload.message.strip()
    nlp_intent = restaurant_nlp_parser.parse_query(query_text)

    # Search actual restaurant database
    query = db.query(Restaurant)

    if nlp_intent["cuisine"]:
        query = query.filter(
            (Restaurant.cuisine.ilike(f"%{nlp_intent['cuisine']}%")) |
            (Restaurant.cuisines_list.ilike(f"%{nlp_intent['cuisine']}%"))
        )

    if nlp_intent["area"]:
        query = query.filter(Restaurant.area.ilike(f"%{nlp_intent['area']}%"))

    if nlp_intent["max_price"]:
        query = query.filter(Restaurant.price_for_two <= nlp_intent["max_price"])

    if nlp_intent["is_veg"]:
        query = query.filter(Restaurant.veg_type == "veg")

    # Fallback keyword match if NLP didn't catch specifics
    if not nlp_intent["cuisine"] and not nlp_intent["area"]:
        for token in query_text.lower().split():
            if len(token) >= 4:
                query = query.filter(
                    (Restaurant.name.ilike(f"%{token}%")) |
                    (Restaurant.description.ilike(f"%{token}%")) |
                    (Restaurant.specialty_dishes.ilike(f"%{token}%"))
                )

    matched = query.order_by(Restaurant.rating.desc()).limit(3).all()

    if not matched:
        # Fallback to top rated Hyderabad restaurants
        matched = db.query(Restaurant).order_by(Restaurant.rating.desc()).limit(3).all()
        reply = (
            f"I couldn't find an exact match for '{query_text}', but here are Hyderabad's most acclaimed "
            f"culinary hotspots with exceptional ratings you might love exploring!"
        )
    else:
        details = []
        if nlp_intent["cuisine"]:
            details.append(f"{nlp_intent['cuisine']} cuisine")
        if nlp_intent["area"]:
            details.append(f"in {nlp_intent['area']}")
        if nlp_intent["max_price"]:
            details.append(f"under ₹{int(nlp_intent['max_price'])}")
        
        criteria_str = f" for {' '.join(details)}" if details else ""
        reply = (
            f"Here are my top data-grounded restaurant recommendations{criteria_str} curated for your palate:"
        )

    user_fav_ids = set()
    if payload.user_id:
        favs = db.query(Favorite).filter(Favorite.user_id == payload.user_id).all()
        user_fav_ids = {f.restaurant_id for f in favs}

    restaurant_outs = []
    for r in matched:
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
            match_score=95,
            recommendation_reason=f"Recommended: Rated {r.rating}⭐ with signature specialties: {', '.join(json.loads(r.specialty_dishes or '[]')[:2])}.",
            is_favorite=r.id in user_fav_ids
        ))

    suggestions = [
        "Best biryani under 500 in Tolichowki",
        "Pure veg dosas in Banjara Hills",
        "Fine dining Italian in Jubilee Hills",
        "Historic Irani chai in Charminar"
    ]

    return AssistantResponse(
        reply=reply,
        restaurants=restaurant_outs,
        extracted_filters=nlp_intent,
        suggestions=suggestions
    )
