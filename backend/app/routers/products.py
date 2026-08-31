from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Dish, Restaurant, Category
from ..schemas import DishResponse, CategoryResponse
from .dishes import get_dishes, get_dish

router = APIRouter(prefix="/products", tags=["Legacy Food Alias"])

# Alias /products to /dishes
@router.get("", response_model=List[DishResponse])
def get_products_alias(
    category: Optional[str] = None,
    cuisine: Optional[str] = None,
    is_veg: Optional[bool] = None,
    sort_by: Optional[str] = "popularity",
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return get_dishes(category=category, cuisine=cuisine, is_veg=is_veg, sort_by=sort_by, limit=limit, db=db)

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories_alias(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("/{product_id}", response_model=DishResponse)
def get_product_alias(product_id: int, db: Session = Depends(get_db)):
    return get_dish(dish_id=product_id, db=db)
