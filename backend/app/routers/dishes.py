from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from ..database import get_db
from ..models import Dish, Restaurant, Category
from ..schemas import DishResponse

router = APIRouter(prefix="/dishes", tags=["Dishes & Food Catalog"])

@router.get("", response_model=List[DishResponse])
def get_dishes(
    category: Optional[str] = None,
    cuisine: Optional[str] = None,
    is_veg: Optional[bool] = None,
    spice_level: Optional[str] = None, # 'Mild', 'Medium', 'Spicy', 'Extra Spicy'
    max_price: Optional[float] = None,
    min_price: Optional[float] = None,
    sort_by: Optional[str] = "popularity", # 'popularity', 'rating', 'price_asc', 'price_desc'
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Dish)

    if category and category != "All":
        query = query.filter(Dish.category == category)
    if cuisine and cuisine != "All":
        query = query.filter(Dish.cuisine == cuisine)
    if is_veg is not None:
        query = query.filter(Dish.is_veg == is_veg)
    if spice_level:
        query = query.filter(Dish.spice_level == spice_level)
    if max_price:
        query = query.filter(Dish.price <= max_price)
    if min_price:
        query = query.filter(Dish.price >= min_price)

    if sort_by == "price_asc":
        query = query.order_by(asc(Dish.price))
    elif sort_by == "price_desc":
        query = query.order_by(desc(Dish.price))
    elif sort_by == "rating":
        query = query.order_by(desc(Dish.rating))
    else:
        query = query.order_by(desc(Dish.popularity), desc(Dish.rating))

    dishes = query.limit(limit).all()
    results = []
    for d in dishes:
        d_res = DishResponse.from_orm(d)
        if d.restaurant:
            d_res.restaurant_name = d.restaurant.name
            d_res.restaurant_area = d.restaurant.area
        results.append(d_res)
    return results

@router.get("/{dish_id}", response_model=DishResponse)
def get_dish(dish_id: int, db: Session = Depends(get_db)):
    dish = db.query(Dish).filter(Dish.id == dish_id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found in menu")
    
    d_res = DishResponse.from_orm(dish)
    if dish.restaurant:
        d_res.restaurant_name = dish.restaurant.name
        d_res.restaurant_area = dish.restaurant.area
    return d_res
