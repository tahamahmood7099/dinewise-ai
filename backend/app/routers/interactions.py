import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Interaction, RecommendationFeedback, Product
from ..schemas import InteractionCreate, InteractionResponse, FeedbackCreate
from ..config import settings

router = APIRouter(prefix="/interactions", tags=["Interactions & Behavior Tracking"])

INTERACTION_WEIGHT_MAP = {
    "view": settings.WEIGHT_VIEW,
    "click": settings.WEIGHT_CLICK,
    "search": settings.WEIGHT_SEARCH,
    "wishlist": settings.WEIGHT_WISHLIST,
    "cart": settings.WEIGHT_CART,
    "purchase": settings.WEIGHT_PURCHASE,
    "feedback_like": settings.WEIGHT_FEEDBACK_POSITIVE,
    "feedback_dislike": settings.WEIGHT_FEEDBACK_NEGATIVE,
}

@router.post("", response_model=InteractionResponse)
def log_interaction(interaction_in: InteractionCreate, db: Session = Depends(get_db)):
    # Verify product exists
    product = db.query(Product).filter(Product.id == interaction_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    weight = INTERACTION_WEIGHT_MAP.get(interaction_in.interaction_type.lower(), 1.0)

    interaction = Interaction(
        user_id=interaction_in.user_id,
        session_id=interaction_in.session_id,
        product_id=interaction_in.product_id,
        interaction_type=interaction_in.interaction_type.lower(),
        weight=weight,
        metadata_info=json.dumps(interaction_in.metadata_info or {})
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return interaction

@router.post("/feedback")
def submit_recommendation_feedback(feedback_in: FeedbackCreate, db: Session = Depends(get_db)):
    """Log user feedback (like/dislike) on recommended products."""
    feedback = RecommendationFeedback(
        user_id=feedback_in.user_id,
        session_id=feedback_in.session_id,
        product_id=feedback_in.product_id,
        feedback_type=feedback_in.feedback_type.lower(),
        recommendation_source=feedback_in.recommendation_source
    )
    db.add(feedback)

    # Also log as weighted interaction
    weight = settings.WEIGHT_FEEDBACK_POSITIVE if feedback_in.feedback_type.lower() == "like" else settings.WEIGHT_FEEDBACK_NEGATIVE
    interaction = Interaction(
        user_id=feedback_in.user_id,
        session_id=feedback_in.session_id,
        product_id=feedback_in.product_id,
        interaction_type=f"feedback_{feedback_in.feedback_type.lower()}",
        weight=weight,
        metadata_info=json.dumps({"source": feedback_in.recommendation_source})
    )
    db.add(interaction)
    db.commit()

    return {"status": "success", "message": f"Feedback '{feedback_in.feedback_type}' recorded successfully."}
