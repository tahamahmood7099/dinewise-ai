import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from ..database import get_db
from ..models import Product, SearchLog, Interaction
from ..schemas import SearchResultResponse, ProductResponse, ParsedNLPIntent
from ..ml.nlp_parser import parse_nlp_search_query, TYPO_CORRECTIONS
from ..ml.content_engine import content_engine

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("", response_model=SearchResultResponse)
def search_products(
    q: str = Query(..., min_length=1),
    user_id: Optional[int] = None,
    session_id: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "relevance",
    db: Session = Depends(get_db)
):
    # 1. Parse NLP and correct typos
    parsed_intent, corrected_query = parse_nlp_search_query(q)
    has_typo_correction = (corrected_query.lower() != q.lower())

    # Build DB Query
    query_builder = db.query(Product)

    # Apply category: explicit parameter overrides detected intent
    effective_category = category if (category and category != "All") else parsed_intent.detected_category
    if effective_category:
        query_builder = query_builder.filter(Product.category == effective_category)

    # Apply brand
    effective_brand = brand or parsed_intent.detected_brand
    if effective_brand:
        query_builder = query_builder.filter(Product.brand.ilike(f"%{effective_brand}%"))

    # Apply prices
    effective_min_price = min_price if min_price is not None else parsed_intent.min_price
    effective_max_price = max_price if max_price is not None else parsed_intent.max_price
    if effective_min_price is not None:
        query_builder = query_builder.filter(Product.price >= effective_min_price)
    if effective_max_price is not None:
        query_builder = query_builder.filter(Product.price <= effective_max_price)

    # Apply keyword filtering if detected keywords exist
    if parsed_intent.detected_keywords:
        keyword_filters = []
        for kw in parsed_intent.detected_keywords:
            keyword_filters.append(Product.name.ilike(f"%{kw}%"))
            keyword_filters.append(Product.description.ilike(f"%{kw}%"))
            keyword_filters.append(Product.tags.ilike(f"%{kw}%"))
            keyword_filters.append(Product.category.ilike(f"%{kw}%"))
            keyword_filters.append(Product.brand.ilike(f"%{kw}%"))
        query_builder = query_builder.filter(or_(*keyword_filters))

    # Sorting
    if sort_by == "price_asc":
        query_builder = query_builder.order_by(asc(Product.price))
    elif sort_by == "price_desc":
        query_builder = query_builder.order_by(desc(Product.price))
    elif sort_by == "rating":
        query_builder = query_builder.order_by(desc(Product.rating))
    elif sort_by == "newest":
        query_builder = query_builder.order_by(desc(Product.created_at))
    else:
        query_builder = query_builder.order_by(desc(Product.rating))

    matched_products = query_builder.all()

    # 2. If no exact match found, fall back to TF-IDF semantic database match or popular products
    fallback_used = False
    if not matched_products:
        # Grounded semantic fallback
        all_prods = db.query(Product).all()
        content_engine.fit(all_prods)
        
        # Search by closest category if detected
        if parsed_intent.detected_category:
            matched_products = db.query(Product).filter(Product.category == parsed_intent.detected_category).limit(8).all()
        else:
            # Return top rated products
            matched_products = db.query(Product).order_by(desc(Product.rating * Product.review_count)).limit(8).all()
        
        fallback_used = True

    # 3. Log search query to database
    search_log = SearchLog(
        user_id=user_id,
        session_id=session_id,
        query=q,
        parsed_intent=json.dumps(parsed_intent.dict()),
        result_count=len(matched_products) if not fallback_used else 0
    )
    db.add(search_log)

    # Also log search interaction for behavior personalization
    if matched_products:
        first_p = matched_products[0]
        interaction = Interaction(
            user_id=user_id,
            session_id=session_id,
            product_id=first_p.id,
            interaction_type="search",
            weight=3.0,
            metadata_info=json.dumps({"query": q})
        )
        db.add(interaction)
    db.commit()

    # 4. Generate dynamic suggested categories & brands
    suggested_cats = list(set([p.category for p in matched_products]))[:4]
    suggested_brands = list(set([p.brand for p in matched_products]))[:4]

    product_responses = []
    for p in matched_products:
        p_res = ProductResponse.from_orm(p)
        if fallback_used:
            p_res.recommendation_reason = "Alternative recommendation based on popular interest"
        elif parsed_intent.max_price and p.price <= parsed_intent.max_price:
            p_res.recommendation_reason = f"Fits your budget under ₹{int(parsed_intent.max_price):,}"
        else:
            p_res.recommendation_reason = f"Direct match for '{q}'"
        product_responses.append(p_res)

    return SearchResultResponse(
        query=q,
        corrected_query=corrected_query if has_typo_correction else None,
        parsed_intent=parsed_intent,
        total_results=len(matched_products) if not fallback_used else 0,
        products=product_responses,
        suggested_categories=suggested_cats,
        suggested_brands=suggested_brands
    )

@router.get("/suggestions", response_model=List[str])
def get_search_suggestions(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    """Instant search suggestions autocomplete."""
    q_clean = q.lower().strip()
    products = db.query(Product).filter(
        or_(
            Product.name.ilike(f"%{q_clean}%"),
            Product.category.ilike(f"%{q_clean}%"),
            Product.brand.ilike(f"%{q_clean}%"),
            Product.tags.ilike(f"%{q_clean}%")
        )
    ).limit(6).all()

    suggestions = set()
    for p in products:
        if q_clean in p.name.lower():
            suggestions.add(p.name)
        if q_clean in p.brand.lower():
            suggestions.add(f"{p.brand} Products")
        if q_clean in p.category.lower():
            suggestions.add(p.category)

    # Add quick popular suggestions if query matches common items
    if not suggestions:
        popular_defaults = ["Kurta", "Biryani", "Wireless Earbuds", "Smartwatch", "Banarasi Saree", "Running Shoes", "Desi Ghee"]
        for pdef in popular_defaults:
            if q_clean in pdef.lower():
                suggestions.add(pdef)

    return list(suggestions)[:6]
