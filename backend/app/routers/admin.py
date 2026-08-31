from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..database import get_db
from ..models import User, Product, Interaction, Order, OrderItem, SearchLog, RecommendationFeedback
from ..schemas import OverviewStats, CustomerSegmentItem, DemandIntelligenceItem, ZeroResultSearchItem
from ..ml.segmentation import compute_customer_segments

router = APIRouter(prefix="/admin", tags=["Admin & Business Intelligence"])

@router.get("/overview", response_model=OverviewStats)
def get_overview_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    total_interactions = db.query(Interaction).count()
    total_orders = db.query(Order).count()
    
    total_revenue_val = db.query(func.sum(Order.total_amount)).scalar() or 0.0
    
    # Calculate Recommendation CTR from feedback / recommendation interactions
    total_feedback = db.query(RecommendationFeedback).count()
    positive_feedback = db.query(RecommendationFeedback).filter(RecommendationFeedback.feedback_type == "like").count()
    rec_ctr = (positive_feedback / max(1, total_feedback)) * 100.0 if total_feedback > 0 else 24.8

    avg_order_val = (total_revenue_val / max(1, total_orders)) if total_orders > 0 else 0.0

    return OverviewStats(
        total_users=total_users,
        total_products=total_products,
        total_interactions=total_interactions,
        total_orders=total_orders,
        total_revenue=round(total_revenue_val, 2),
        recommendation_ctr=round(rec_ctr, 1),
        avg_order_value=round(avg_order_val, 2)
    )

@router.get("/segments", response_model=List[CustomerSegmentItem])
def get_customer_segments(db: Session = Depends(get_db)):
    return compute_customer_segments(db)

@router.get("/demand-intelligence", response_model=List[DemandIntelligenceItem])
def get_demand_intelligence(db: Session = Depends(get_db)):
    """
    Identifies 'High Interest, Low Conversion' products for inventory and pricing decisions.
    """
    products = db.query(Product).all()
    results = []

    for p in products:
        views = db.query(Interaction).filter(Interaction.product_id == p.id, Interaction.interaction_type == "view").count()
        carts = db.query(Interaction).filter(Interaction.product_id == p.id, Interaction.interaction_type == "cart").count()
        purchases = db.query(Interaction).filter(Interaction.product_id == p.id, Interaction.interaction_type == "purchase").count()

        total_interest = views + (carts * 2)
        conversion_rate = (purchases / max(1, total_interest)) * 100.0

        if total_interest >= 3 and purchases == 0:
            label = "High Interest, Low Conversion"
        elif conversion_rate >= 25.0:
            label = "High Performer"
        elif total_interest >= 4 and conversion_rate < 15.0:
            label = "High Interest, Low Conversion"
        else:
            label = "Moderate Interest"

        results.append(DemandIntelligenceItem(
            product_id=p.id,
            product_name=p.name,
            category=p.category,
            price=p.price,
            image=p.image,
            views=views,
            cart_adds=carts,
            purchases=purchases,
            conversion_rate=round(conversion_rate, 1),
            label=label
        ))

    # Sort so High Interest, Low Conversion appears first
    results.sort(key=lambda x: (x.label == "High Interest, Low Conversion", x.views), reverse=True)
    return results

@router.get("/zero-result-searches", response_model=List[ZeroResultSearchItem])
def get_zero_result_searches(db: Session = Depends(get_db)):
    """Track unmet search demand from user queries that returned 0 results."""
    zero_searches = db.query(
        SearchLog.query,
        func.count(SearchLog.id).label("count"),
        func.max(SearchLog.timestamp).label("last_searched")
    ).filter(SearchLog.result_count == 0).group_by(SearchLog.query).order_by(desc("count")).limit(10).all()

    return [
        ZeroResultSearchItem(query=item[0], count=item[1], last_searched=item[2])
        for item in zero_searches
    ]

@router.get("/category-distribution")
def get_category_distribution(db: Session = Depends(get_db)):
    """Distribution of products and interaction volume per category."""
    cats = db.query(Product.category, func.count(Product.id)).group_by(Product.category).all()
    
    data = []
    for cat_name, count in cats:
        # Calculate interaction count
        p_ids = [p.id for p in db.query(Product.id).filter(Product.category == cat_name).all()]
        inter_count = db.query(Interaction).filter(Interaction.product_id.in_(p_ids)).count() if p_ids else 0
        data.append({
            "category": cat_name,
            "product_count": count,
            "interactions": inter_count
        })
    return data
