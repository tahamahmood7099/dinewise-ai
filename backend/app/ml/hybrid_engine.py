import json
from typing import List, Dict, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..models import Product, Interaction, RecommendationFeedback, User
from ..config import settings
from .content_engine import content_engine
from .collaborative_engine import collaborative_engine

class HybridRecommendationEngine:
    def __init__(self):
        self.alpha = settings.ALPHA_CONTENT_WEIGHT
        self.beta = settings.BETA_COLLAB_WEIGHT

    def get_recommendations(
        self,
        db: Session,
        user_id: Optional[int] = None,
        session_id: Optional[str] = None,
        target_product_id: Optional[int] = None,
        category: Optional[str] = None,
        limit: int = 8,
        diversity_penalty: float = 0.15
    ) -> List[Tuple[Product, int, str]]:
        """
        Generate hybrid recommendations.
        Returns list of (Product, match_percentage, explainable_reason).
        """
        all_products = db.query(Product).all()
        if not all_products:
            return []

        # Train / update models if needed
        all_interactions = db.query(Interaction).all()
        content_engine.fit(all_products)
        collaborative_engine.fit(all_interactions, all_products)

        user_ident = str(user_id) if user_id is not None else session_id

        # 1. Fetch user's interactions & feedback
        user_interactions = []
        if user_id is not None:
            user_interactions = db.query(Interaction).filter(Interaction.user_id == user_id).all()
        elif session_id:
            user_interactions = db.query(Interaction).filter(Interaction.session_id == session_id).all()

        # Fetch disliked product IDs
        disliked_product_ids = set()
        feedbacks = []
        if user_id is not None:
            feedbacks = db.query(RecommendationFeedback).filter(
                RecommendationFeedback.user_id == user_id,
                RecommendationFeedback.feedback_type == "dislike"
            ).all()
        elif session_id:
            feedbacks = db.query(RecommendationFeedback).filter(
                RecommendationFeedback.session_id == session_id,
                RecommendationFeedback.feedback_type == "dislike"
            ).all()
        
        for fb in feedbacks:
            disliked_product_ids.add(fb.product_id)

        # 2. Case A: Product-specific recommendations (e.g. on Product Detail Page)
        if target_product_id:
            return self._get_product_detail_recommendations(
                db, target_product_id, all_products, disliked_product_ids, limit
            )

        # 3. Case B: Cold start handling for brand new user / guest with no history
        if not user_interactions and not target_product_id:
            return self._get_cold_start_recommendations(
                db, user_id, all_products, category, disliked_product_ids, limit
            )

        # 4. Hybrid computation for users with history
        content_scores = content_engine.get_user_content_scores(user_interactions, all_products)
        collab_scores = collaborative_engine.predict_user_scores(user_ident) if user_ident else {}

        # Already purchased/carted items to avoid excessive repetition
        interacted_product_ids = set(i.product_id for i in user_interactions if i.interaction_type in ["purchase", "cart"])

        combined_scores = []
        category_counts: Dict[str, int] = {}

        for prod in all_products:
            if prod.id in disliked_product_ids:
                continue

            c_score, c_reason = content_scores.get(prod.id, (0.0, ""))
            cl_score, cl_reason = collab_scores.get(prod.id, (0.0, ""))

            # Hybrid weighted combination
            if c_score > 0 and cl_score > 0:
                hybrid_score = (self.alpha * c_score) + (self.beta * cl_score)
                reason = f"Personalized for you: {c_reason} & popular among similar shoppers"
            elif c_score > 0:
                hybrid_score = c_score
                reason = c_reason or "Curated based on your recent activity"
            elif cl_score > 0:
                hybrid_score = cl_score
                reason = cl_reason
            else:
                # Slight baseline popularity factor
                hybrid_score = (prod.rating / 5.0) * 0.2
                reason = f"Top rated with {prod.rating}★ rating"

            # Filter category if explicitly requested
            if category and prod.category != category:
                continue

            # Diversity adjustment: apply penalty if category is over-represented
            cat_count = category_counts.get(prod.category, 0)
            penalized_score = hybrid_score * (1.0 - (cat_count * diversity_penalty))

            # Calculate intuitive match percentage (e.g. 70% to 98%)
            match_pct = int(min(98, max(65, penalized_score * 100)))

            combined_scores.append((prod, penalized_score, match_pct, reason))

        # Sort descending by penalized score
        combined_scores.sort(key=lambda x: x[1], reverse=True)

        results = []
        for prod, score, match_pct, reason in combined_scores:
            results.append((prod, match_pct, reason))
            category_counts[prod.category] = category_counts.get(prod.category, 0) + 1
            if len(results) >= limit:
                break

        return results

    def _get_product_detail_recommendations(
        self,
        db: Session,
        target_product_id: int,
        all_products: List[Product],
        disliked_product_ids: set,
        limit: int
    ) -> List[Tuple[Product, int, str]]:
        """Recommendations when viewing a single product."""
        # 1. Content similarity
        sim_items = content_engine.get_similar_products(target_product_id, top_n=limit * 2)
        # 2. Frequently bought together
        fbt_items = collaborative_engine.get_frequently_bought_together(target_product_id, top_n=3)

        fbt_ids = {pid for pid, score in fbt_items}
        product_map = {p.id: p for p in all_products}

        results = []
        seen_ids = {target_product_id} | disliked_product_ids

        # First add frequently bought together if any
        for pid, score in fbt_items:
            if pid in product_map and pid not in seen_ids:
                prod = product_map[pid]
                match_pct = int(min(99, 85 + score * 14))
                results.append((prod, match_pct, "Frequently bought together with this item"))
                seen_ids.add(pid)

        # Then add content-similar items
        for pid, sim_score, reason in sim_items:
            if pid in product_map and pid not in seen_ids:
                prod = product_map[pid]
                match_pct = int(min(98, max(70, sim_score * 100)))
                results.append((prod, match_pct, reason))
                seen_ids.add(pid)
                if len(results) >= limit:
                    break

        return results

    def _get_cold_start_recommendations(
        self,
        db: Session,
        user_id: Optional[int],
        all_products: List[Product],
        category: Optional[str],
        disliked_product_ids: set,
        limit: int
    ) -> List[Tuple[Product, int, str]]:
        """Cold-start fallback for new users: Trending + Highest Rated + Selected Category preferences."""
        preferred_categories = []
        if user_id is not None:
            user = db.query(User).filter(User.id == user_id).first()
            if user and user.preferences:
                try:
                    prefs = json.loads(user.preferences)
                    preferred_categories = prefs.get("categories", [])
                except Exception:
                    pass

        # Sort products by a combination of rating, review_count, and discount
        def cold_start_score(p: Product):
            cat_bonus = 0.3 if p.category in preferred_categories else 0.0
            return (p.rating * 0.5) + (min(p.review_count, 2000) / 2000.0 * 0.3) + (p.discount / 100.0 * 0.2) + cat_bonus

        sorted_prods = sorted(all_products, key=cold_start_score, reverse=True)

        results = []
        category_counts = {}
        for prod in sorted_prods:
            if prod.id in disliked_product_ids:
                continue
            if category and prod.category != category:
                continue

            cat_count = category_counts.get(prod.category, 0)
            if cat_count >= 2 and len(sorted_prods) > limit:
                continue # Ensure diversity

            match_pct = int(min(95, max(75, (prod.rating / 5.0) * 100)))
            
            if prod.category in preferred_categories:
                reason = f"Based on your interest in {prod.category}"
            elif prod.review_count > 800:
                reason = f"Trending Bestseller with {prod.review_count}+ verified reviews"
            elif prod.discount >= 35:
                reason = f"Top Festive Value ({prod.discount}% OFF)"
            else:
                reason = f"Highly rated across India ({prod.rating}★)"

            results.append((prod, match_pct, reason))
            category_counts[prod.category] = cat_count + 1
            if len(results) >= limit:
                break

        return results

hybrid_engine = HybridRecommendationEngine()
