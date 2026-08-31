from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import User, Order, Interaction, Product
from ..schemas import CustomerSegmentItem

def compute_customer_segments(db: Session) -> List[CustomerSegmentItem]:
    """
    Segment users based on their spending, order volume, interaction patterns, and category preference.
    """
    users = db.query(User).all()
    results = []

    for user in users:
        # Calculate total spend and order count
        orders = db.query(Order).filter(Order.user_id == user.id).all()
        total_spend = sum(o.total_amount for o in orders)
        order_count = len(orders)

        # Calculate interactions
        interactions = db.query(Interaction).filter(Interaction.user_id == user.id).all()
        interaction_count = len(interactions)
        
        # Determine preferred category
        cat_counts: Dict[str, int] = {}
        for inter in interactions:
            if inter.product and inter.product.category:
                c = inter.product.category
                cat_counts[c] = cat_counts.get(c, 0) + 1
        
        preferred_cat = max(cat_counts.items(), key=lambda x: x[1])[0] if cat_counts else "Ethnic & Fashion"

        # Segmentation Logic
        if order_count >= 2 and total_spend >= 5000:
            segment = "Premium Buyer"
        elif order_count >= 2:
            segment = "Frequent Buyer"
        elif interaction_count >= 4 and total_spend > 0 and (total_spend / max(1, order_count)) < 2500:
            segment = "Budget Shopper"
        elif interaction_count >= 3 and order_count == 0:
            segment = "Window Shopper"
        elif total_spend >= 4000:
            segment = "Premium Buyer"
        else:
            segment = "Budget Shopper"

        results.append(CustomerSegmentItem(
            user_id=user.id,
            name=user.name,
            email=user.email,
            total_spend=round(total_spend, 2),
            total_orders=order_count,
            total_interactions=interaction_count,
            segment=segment,
            preferred_category=preferred_cat
        ))

    return results
