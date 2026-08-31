import json
from collections import Counter
from sqlalchemy.orm import Session
from ..models import User, Interaction, Favorite, Rating, Restaurant

class CustomerSegmentationEngine:
    def segment_users(self, db: Session):
        users = db.query(User).all()
        segments = []

        for u in users:
            interactions = db.query(Interaction).filter(Interaction.user_id == u.id).all()
            favorites = db.query(Favorite).filter(Favorite.user_id == u.id).all()
            ratings = db.query(Rating).filter(Rating.user_id == u.id).all()

            # Gather restaurant details for all interactions
            interacted_restaurant_ids = [i.restaurant_id for i in interactions] + [f.restaurant_id for f in favorites]
            
            cuisines = []
            areas = []
            prices = []
            veg_flags = []

            for r_id in interacted_restaurant_ids:
                r = db.query(Restaurant).filter(Restaurant.id == r_id).first()
                if r:
                    cuisines.append(r.cuisine)
                    areas.append(r.area)
                    prices.append(r.price_for_two)
                    veg_flags.append(r.veg_type)

            total_hits = len(interactions) + len(favorites) + len(ratings)
            avg_budget = float(sum(prices) / len(prices)) if prices else 600.0

            cuisine_counter = Counter(cuisines)
            area_counter = Counter(areas)

            top_cuisine = cuisine_counter.most_common(1)[0][0] if cuisine_counter else (json.loads(u.preferred_cuisines or "[\"Biryani\"]")[0] if u.preferred_cuisines else "Biryani")
            top_area = area_counter.most_common(1)[0][0] if area_counter else "Banjara Hills"

            # Behavioral Rules for Clustering
            if u.dietary_pref == "Pure Veg" or (veg_flags and all(v == "veg" for v in veg_flags)):
                segment_label = "Vegetarian Explorer"
            elif top_cuisine in ["Biryani", "Mughlai"] and cuisine_counter.get("Biryani", 0) + cuisine_counter.get("Mughlai", 0) >= 2:
                segment_label = "Biryani Enthusiast"
            elif avg_budget >= 1000.0 or top_cuisine in ["Italian & Pizza", "Cafe & Bistro"]:
                segment_label = "Premium Diner"
            elif avg_budget <= 500.0:
                segment_label = "Budget Explorer"
            elif len(cuisine_counter) >= 3:
                segment_label = "Cuisine Explorer"
            else:
                segment_label = "Frequent Restaurant Browser"

            segments.append({
                "user_id": u.id,
                "name": u.name,
                "email": u.email,
                "segment": segment_label,
                "preferred_cuisine": top_cuisine,
                "preferred_area": top_area,
                "total_interactions": len(interactions),
                "total_favorites": len(favorites),
                "avg_budget_affinity": round(avg_budget, 1)
            })

        return segments

customer_segmentation_engine = CustomerSegmentationEngine()
