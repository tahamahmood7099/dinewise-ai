import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Restaurant, CuisineCategory, Rating, Favorite, User
from ..schemas import RestaurantOut, CuisineOut, RatingCreate, RatingOut
from ..ml.content_engine import restaurant_content_engine

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])

@router.get("", response_model=List[RestaurantOut])
def get_restaurants(
    cuisine: Optional[str] = Query(None),
    area: Optional[str] = Query(None),
    veg_type: Optional[str] = Query(None),
    max_price: Optional[float] = Query(None),
    min_rating: Optional[float] = Query(None),
    sort_by: Optional[str] = Query("rating"),
    limit: int = Query(50),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Restaurant)

    if cuisine and cuisine != "All":
        query = query.filter(
            (Restaurant.cuisine.ilike(f"%{cuisine}%")) | 
            (Restaurant.cuisines_list.ilike(f"%{cuisine}%"))
        )

    if area and area != "All":
        query = query.filter(Restaurant.area.ilike(f"%{area}%"))

    if veg_type and veg_type != "all":
        if veg_type == "veg":
            query = query.filter(Restaurant.veg_type == "veg")
        elif veg_type == "non_veg":
            query = query.filter(Restaurant.veg_type.in_(["non_veg", "both"]))

    if max_price:
        query = query.filter(Restaurant.price_for_two <= max_price)

    if min_rating:
        query = query.filter(Restaurant.rating >= min_rating)

    if sort_by == "rating":
        query = query.order_by(Restaurant.rating.desc(), Restaurant.review_count.desc())
    elif sort_by == "price_asc":
        query = query.order_by(Restaurant.price_for_two.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Restaurant.price_for_two.desc())
    elif sort_by == "reviews":
        query = query.order_by(Restaurant.review_count.desc())
    else:
        query = query.order_by(Restaurant.rating.desc())

    restaurants = query.limit(limit).all()

    user_fav_ids = set()
    if user_id:
        favs = db.query(Favorite).filter(Favorite.user_id == user_id).all()
        user_fav_ids = {f.restaurant_id for f in favs}

    results = []
    for r in restaurants:
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
            match_score=88,
            recommendation_reason=f"Popular {r.cuisine} destination in {r.area}.",
            is_favorite=r.id in user_fav_ids
        ))

    return results

@router.get("/categories", response_model=List[CuisineOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(CuisineCategory).all()

@router.get("/areas")
def get_hyderabad_areas(db: Session = Depends(get_db)):
    areas = db.query(Restaurant.area).distinct().all()
    return [a[0] for a in areas if a[0]]

@router.get("/{id}", response_model=RestaurantOut)
def get_restaurant_detail(
    id: int,
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    r = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    is_fav = False
    if user_id:
        is_fav = db.query(Favorite).filter(Favorite.user_id == user_id, Favorite.restaurant_id == id).first() is not None

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
        match_score=92,
        recommendation_reason=f"Top-rated {r.cuisine} dining experience in {r.area}.",
        is_favorite=is_fav
    )

@router.get("/{id}/similar", response_model=List[RestaurantOut])
def get_similar_restaurants(
    id: int,
    limit: int = Query(4),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    sim_pairs = restaurant_content_engine.get_similar_restaurants(id, db, top_n=limit)
    if not sim_pairs:
        # Fallback to same cuisine
        target = db.query(Restaurant).filter(Restaurant.id == id).first()
        if target:
            sims = db.query(Restaurant).filter(Restaurant.id != id, Restaurant.cuisine == target.cuisine).limit(limit).all()
            sim_pairs = [(s.id, 0.85) for s in sims]

    user_fav_ids = set()
    if user_id:
        favs = db.query(Favorite).filter(Favorite.user_id == user_id).all()
        user_fav_ids = {f.restaurant_id for f in favs}

    results = []
    for r_id, score in sim_pairs:
        r = db.query(Restaurant).filter(Restaurant.id == r_id).first()
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
                match_score=int(score * 100),
                recommendation_reason=f"Similar {r.cuisine} flavor profile and ambiance to your selection.",
                is_favorite=r.id in user_fav_ids
            ))

    return results

@router.post("/{id}/ratings")
def add_restaurant_rating(
    id: int,
    payload: RatingCreate,
    db: Session = Depends(get_db)
):
    r = db.query(Restaurant).filter(Restaurant.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    new_rating = Rating(
        restaurant_id=id,
        user_id=payload.user_id,
        rating_score=payload.rating_score,
        review_text=payload.review_text or ""
    )
    db.add(new_rating)

    # Recalculate average rating
    all_ratings = db.query(Rating).filter(Rating.restaurant_id == id).all()
    avg_score = (sum(rat.rating_score for rat in all_ratings) + payload.rating_score) / (len(all_ratings) + 1)
    r.rating = round(avg_score, 1)
    r.review_count += 1
    db.commit()

    return {"message": "Rating submitted successfully", "new_rating": r.rating, "review_count": r.review_count}

@router.get("/{id}/ratings", response_model=List[RatingOut])
def get_restaurant_ratings(id: int, db: Session = Depends(get_db)):
    ratings = db.query(Rating).filter(Rating.restaurant_id == id).order_by(Rating.created_at.desc()).all()
    results = []
    for rat in ratings:
        user_name = "Hyderabad Foodie"
        if rat.user_id:
            u = db.query(User).filter(User.id == rat.user_id).first()
            if u:
                user_name = u.name
        results.append(RatingOut(
            id=rat.id,
            restaurant_id=rat.restaurant_id,
            user_id=rat.user_id,
            user_name=user_name,
            rating_score=rat.rating_score,
            review_text=rat.review_text,
            created_at=rat.created_at
        ))
    return results
