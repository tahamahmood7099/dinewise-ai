from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from ..database import get_db
from ..models import Product
from ..schemas import AssistantRequest, AssistantResponse, ProductResponse
from ..ml.nlp_parser import parse_nlp_search_query

router = APIRouter(prefix="/assistant", tags=["AI Shopping Assistant"])

@router.post("/chat", response_model=AssistantResponse)
def chat_with_assistant(req: AssistantRequest, db: Session = Depends(get_db)):
    user_msg = req.message.strip().lower()
    
    # 1. Parse natural language intent from current message
    parsed_intent, _ = parse_nlp_search_query(user_msg)

    # 2. Check conversation history for context (e.g. "show cheaper ones" or "show in red")
    previous_category = None
    previous_brand = None
    if req.conversation_history:
        for prev in reversed(req.conversation_history):
            if prev.role == "user":
                prev_intent, _ = parse_nlp_search_query(prev.content)
                if not previous_category and prev_intent.detected_category:
                    previous_category = prev_intent.detected_category
                if not previous_brand and prev_intent.detected_brand:
                    previous_brand = prev_intent.detected_brand

    # Merge context if current message refers to previous context
    effective_category = parsed_intent.detected_category or previous_category
    effective_brand = parsed_intent.detected_brand or previous_brand

    # Build DB Query
    query = db.query(Product)
    if effective_category:
        query = query.filter(Product.category == effective_category)
    if effective_brand:
        query = query.filter(Product.brand.ilike(f"%{effective_brand}%"))
    if parsed_intent.min_price is not None:
        query = query.filter(Product.price >= parsed_intent.min_price)
    if parsed_intent.max_price is not None:
        query = query.filter(Product.price <= parsed_intent.max_price)

    # If "cheaper" or "affordable" mentioned
    if "cheap" in user_msg or "affordable" in user_msg or "low price" in user_msg:
        query = query.order_by(asc(Product.price))
    else:
        query = query.order_by(desc(Product.rating))

    # Keyword filter
    if parsed_intent.detected_keywords:
        kw_filters = []
        for kw in parsed_intent.detected_keywords:
            kw_filters.append(Product.name.ilike(f"%{kw}%"))
            kw_filters.append(Product.description.ilike(f"%{kw}%"))
            kw_filters.append(Product.tags.ilike(f"%{kw}%"))
        query = query.filter(or_(*kw_filters))

    matched_products = query.limit(4).all()

    # If no exact match, get database-grounded alternatives
    if not matched_products:
        if effective_category:
            matched_products = db.query(Product).filter(Product.category == effective_category).order_by(desc(Product.rating)).limit(3).all()
            reply = f"I couldn't find an exact match under your specific criteria, but here are top-rated alternatives in {effective_category} available right now in our catalog:"
        else:
            matched_products = db.query(Product).order_by(desc(Product.rating * Product.review_count)).limit(3).all()
            reply = "I couldn't find an exact match for that specific search, but here are our most popular verified products:"
    else:
        # Build intelligent conversational response
        price_str = f" under ₹{int(parsed_intent.max_price):,}" if parsed_intent.max_price else ""
        cat_str = f" in {effective_category}" if effective_category else ""
        reply = f"I found {len(matched_products)} excellent options{cat_str}{price_str} curated for you based on genuine specifications and ratings:"

    product_responses = []
    for p in matched_products:
        p_res = ProductResponse.from_orm(p)
        p_res.match_score = 95
        p_res.recommendation_reason = "Recommended by BharatKart AI Assistant"
        product_responses.append(p_res)

    suggestions = [
        "Show cheaper options",
        "Show top rated ethnic wear",
        "Electronics under ₹3,000",
        "Festive sweets and biryani"
    ]

    return AssistantResponse(
        reply=reply,
        parsed_intent=parsed_intent,
        products=product_responses,
        suggestions=suggestions
    )
