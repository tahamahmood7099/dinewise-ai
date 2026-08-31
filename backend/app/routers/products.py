from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from ..database import get_db
from ..models import Product, Category
from ..schemas import ProductResponse, CategoryResponse

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = "relevance", # 'price_asc', 'price_desc', 'rating', 'newest', 'relevance'
    limit: int = 40,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category and category != "All":
        query = query.filter(Product.category == category)
    if brand:
        query = query.filter(Product.brand == brand)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if min_rating is not None:
        query = query.filter(Product.rating >= min_rating)

    if sort_by == "price_asc":
        query = query.order_by(asc(Product.price))
    elif sort_by == "price_desc":
        query = query.order_by(desc(Product.price))
    elif sort_by == "rating":
        query = query.order_by(desc(Product.rating))
    elif sort_by == "newest":
        query = query.order_by(desc(Product.created_at))
    else:
        query = query.order_by(desc(Product.rating * Product.review_count))

    return query.offset(offset).limit(limit).all()

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("/brands", response_model=List[str])
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(Product.brand).distinct().all()
    return sorted([b[0] for b in brands if b[0]])

@router.get("/compare", response_model=List[ProductResponse])
def compare_products(
    ids: str = Query(..., description="Comma-separated product IDs (max 3)"),
    db: Session = Depends(get_db)
):
    try:
        id_list = [int(i.strip()) for i in ids.split(",") if i.strip()][:3]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid product IDs format")

    products = db.query(Product).filter(Product.id.in_(id_list)).all()
    if not products:
        raise HTTPException(status_code=404, detail="No matching products found for comparison")

    # Compute best value indicator based on rating-to-price efficiency
    # Higher rating per unit price * discount bonus
    best_product = max(products, key=lambda p: (p.rating / max(100.0, p.price)) * (1 + p.discount / 100.0))

    response_items = []
    for p in products:
        p_dict = ProductResponse.from_orm(p)
        if p.id == best_product.id:
            p_dict.recommendation_reason = "Best Value Choice: Highest rating & discount balance"
        else:
            p_dict.recommendation_reason = f"Alternative: {p.brand} ({p.rating}★)"
        response_items.append(p_dict)

    return response_items

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
