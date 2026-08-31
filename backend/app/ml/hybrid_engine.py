import json
import numpy as np
from sqlalchemy.orm import Session
from ..models import Restaurant, User, Favorite, RecommendationFeedback
from ..config import settings
from .content_engine import restaurant_content_engine
from .collaborative_engine import restaurant_collab_engine

class RestaurantHybridEngine:
    def __init__(self, alpha: float = None, beta: float = None):
        self.alpha = alpha if alpha is not None else settings.ALPHA_CONTENT_WEIGHT
        self.beta = beta if beta is not None else settings.BETA_COLLAB_WEIGHT

    def get_hybrid_recommendations(
        self,
        db: Session,
        user_id: int = None,
        session_id: str = None,
        limit: int = 10,
        cuisine: str = None,
        area: str = None,
        max_price: float = None,
        veg_only: bool = False
    ):
        restaurants = db.query(Restaurant).all()
        if not restaurants:
            return []

        user = db.query(User).filter(User.id == user_id).first() if user_id else None
        
        # 1. Fetch Content & Collab Scores
        if user_id:
            content_scores = restaurant_content_engine.get_user_content_scores(user_id, db)
            collab_scores = restaurant_collab_engine.get_user_collaborative_scores(user_id, db)
        else:
            # Cold-start fallback
            content_scores = {r.id: 0.5 for r in restaurants}
            collab_scores = {r.id: float(r.rating / 5.0) for r in restaurants}

        # 2. Fetch User Negative Feedback to down-weight
        disliked_ids = set()
        if user_id:
            dislikes = db.query(RecommendationFeedback).filter(
                RecommendationFeedback.user_id == user_id,
                RecommendationFeedback.feedback_type == "dislike"
            ).all()
            disliked_ids = {d.restaurant_id for d in dislikes}

        user_favorites = set()
        if user_id:
            favs = db.query(Favorite).filter(Favorite.user_id == user_id).all()
            user_favorites = {f.restaurant_id for f in favs}

        # 3. Combine scores with formula: Hybrid = alpha * Content + beta * Collab
        scored_restaurants = []
        for r in restaurants:
            # Apply hard filters if requested
            if cuisine and cuisine.lower() not in r.cuisine.lower() and cuisine.lower() not in (r.cuisines_list or "").lower():
                continue
            if area and area.lower() not in r.area.lower():
                continue
            if max_price and r.price_for_two > max_price:
                continue
            if veg_only and r.veg_type != "veg":
                continue

            c_score = content_scores.get(r.id, 0.5)
            cf_score = collab_scores.get(r.id, 0.5)
            
            raw_hybrid = (self.alpha * c_score) + (self.beta * cf_score)
            
            # Penalize disliked restaurants
            if r.id in disliked_ids:
                raw_hybrid *= 0.3

            # Scale to % match (60% to 98% range for realistic human display)
            match_pct = int(np.clip(raw_hybrid * 100, 60, 98))

            reason = self._generate_explanation(r, user, c_score, cf_score, r.id in user_favorites)

            scored_restaurants.append({
                "restaurant": r,
                "score": raw_hybrid,
                "match_score": match_pct,
                "reason": reason,
                "is_favorite": r.id in user_favorites
            })

        # 4. Sort by Hybrid score descending
        scored_restaurants.sort(key=lambda x: x["score"], reverse=True)

        # 5. Apply Diversity Penalty (limit consecutive restaurants of the exact same cuisine)
        diverse_results = []
        cuisine_count = {}
        for item in scored_restaurants:
            r_cuis = item["restaurant"].cuisine
            if cuisine_count.get(r_cuis, 0) < 2 or len(diverse_results) >= limit:
                diverse_results.append(item)
                cuisine_count[r_cuis] = cuisine_count.get(r_cuis, 0) + 1

        # Fallback if diversity filtered too many
        if len(diverse_results) < limit:
            for item in scored_restaurants:
                if item not in diverse_results:
                    diverse_results.append(item)
                if len(diverse_results) >= limit:
                    break

        return diverse_results[:limit]

    def _generate_explanation(self, restaurant: Restaurant, user: User, c_score: float, cf_score: float, is_fav: bool) -> str:
        if is_fav:
            return f"One of your saved favorite destinations in {restaurant.area}."

        if user:
            user_cuisines = json.loads(user.preferred_cuisines or "[]")
            user_areas = json.loads(user.preferred_areas or "[]")
            
            if restaurant.cuisine in user_cuisines:
                return f"Matches your preferred craving for authentic {restaurant.cuisine} cuisine."
            if restaurant.area in user_areas:
                return f"Top-rated {restaurant.cuisine} dining spot in your preferred location ({restaurant.area})."
            if user.dietary_pref == "Pure Veg" and restaurant.veg_type == "veg":
                return f"Pure vegetarian haven matching your dietary preference."
            if cf_score > 0.7:
                return f"Highly loved by Hyderabad foodies with dining tastes similar to yours."
            if restaurant.price_for_two <= 500:
                return f"Pocket-friendly {restaurant.cuisine} feast under ₹500 for two."
            if restaurant.rating >= 4.8:
                return f"Celebrated culinary landmark with an outstanding {restaurant.rating}⭐ foodie rating."

        # General data-grounded cold-start reasons
        if restaurant.rating >= 4.8:
            return f"Legendary Hyderabad dining spot rated {restaurant.rating}⭐ with {restaurant.review_count}+ verified reviews."
        if restaurant.cost_category == "Budget Friendly":
            return f"Great value dining option in {restaurant.area} with authentic flavors."
        
        return f"Curated for you: Popular {restaurant.cuisine} restaurant in {restaurant.area}."

restaurant_hybrid_engine = RestaurantHybridEngine()
