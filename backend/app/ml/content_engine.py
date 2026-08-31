import json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from ..models import Restaurant, User, Interaction, Favorite, Rating

class RestaurantContentEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.tfidf_matrix = None
        self.restaurant_ids = []
        self.restaurant_df = None

    def build_feature_corpus(self, db: Session):
        restaurants = db.query(Restaurant).all()
        if not restaurants:
            return

        records = []
        for r in restaurants:
            cuisines = " ".join(json.loads(r.cuisines_list or "[]"))
            specialties = " ".join(json.loads(r.specialty_dishes or "[]"))
            tags = " ".join(json.loads(r.tags or "[]"))
            veg_label = "pure vegetarian veg" if r.veg_type == "veg" else ("non-vegetarian non-veg" if r.veg_type == "non_veg" else "veg non-veg both")
            
            # Rich semantic document representing restaurant characteristics
            doc = f"{r.name} {r.cuisine} {cuisines} {r.area} {r.location} {r.city} {r.cost_category} {veg_label} {specialties} {tags} {r.description}"
            records.append({
                "id": r.id,
                "name": r.name,
                "cuisine": r.cuisine,
                "area": r.area,
                "cost_category": r.cost_category,
                "veg_type": r.veg_type,
                "document": doc
            })

        self.restaurant_df = pd.DataFrame(records)
        self.restaurant_ids = self.restaurant_df["id"].tolist()
        self.tfidf_matrix = self.vectorizer.fit_transform(self.restaurant_df["document"])

    def get_similar_restaurants(self, restaurant_id: int, db: Session, top_n: int = 5):
        if self.tfidf_matrix is None or len(self.restaurant_ids) == 0:
            self.build_feature_corpus(db)
        
        if restaurant_id not in self.restaurant_ids:
            return []

        idx = self.restaurant_ids.index(restaurant_id)
        cosine_sim = cosine_similarity(self.tfidf_matrix[idx], self.tfidf_matrix).flatten()
        
        # Sort indices excluding self
        similar_indices = np.argsort(cosine_sim)[::-1]
        results = []
        for sim_idx in similar_indices:
            r_id = self.restaurant_ids[sim_idx]
            if r_id != restaurant_id:
                score = float(cosine_sim[sim_idx])
                results.append((r_id, score))
                if len(results) >= top_n:
                    break
        return results

    def get_user_content_scores(self, user_id: int, db: Session) -> dict:
        """
        Builds a synthesized user profile vector based on the user's past
        interactions, favorites, ratings, and explicit onboarding preferences.
        """
        if self.tfidf_matrix is None or len(self.restaurant_ids) == 0:
            self.build_feature_corpus(db)

        if self.tfidf_matrix is None or len(self.restaurant_ids) == 0:
            return {}

        # 1. Fetch user's interactions & favorites
        interactions = db.query(Interaction).filter(Interaction.user_id == user_id).all()
        favorites = db.query(Favorite).filter(Favorite.user_id == user_id).all()
        ratings = db.query(Rating).filter(Rating.user_id == user_id).all()
        user_obj = db.query(User).filter(User.id == user_id).first()

        restaurant_weights = {}
        for inter in interactions:
            restaurant_weights[inter.restaurant_id] = restaurant_weights.get(inter.restaurant_id, 0.0) + inter.weight
        for fav in favorites:
            restaurant_weights[fav.restaurant_id] = restaurant_weights.get(fav.restaurant_id, 0.0) + 6.0
        for rat in ratings:
            restaurant_weights[rat.restaurant_id] = restaurant_weights.get(rat.restaurant_id, 0.0) + (rat.rating_score * 1.5)

        # Build weighted profile vector
        user_vector = np.zeros((1, self.tfidf_matrix.shape[1]))
        total_weight = 0.0

        for r_id, weight in restaurant_weights.items():
            if r_id in self.restaurant_ids:
                idx = self.restaurant_ids.index(r_id)
                user_vector += self.tfidf_matrix[idx].toarray() * weight
                total_weight += weight

        # Add explicit onboarding preferences if available
        if user_obj:
            pref_cuisines = json.loads(user_obj.preferred_cuisines or "[]")
            pref_areas = json.loads(user_obj.preferred_areas or "[]")
            diet = user_obj.dietary_pref or ""
            budget = user_obj.preferred_budget or ""
            
            pref_text = f"{' '.join(pref_cuisines)} {' '.join(pref_areas)} {diet} {budget}"
            if pref_text.strip():
                pref_vec = self.vectorizer.transform([pref_text]).toarray()
                user_vector += pref_vec * 4.0
                total_weight += 4.0

        if total_weight == 0.0:
            # Cold-start uniform profile
            return {r_id: 0.5 for r_id in self.restaurant_ids}

        user_vector = user_vector / total_weight
        sim_scores = cosine_similarity(user_vector, self.tfidf_matrix).flatten()

        scores_dict = {}
        for idx, r_id in enumerate(self.restaurant_ids):
            scores_dict[r_id] = float(np.clip(sim_scores[idx], 0.0, 1.0))

        return scores_dict

restaurant_content_engine = RestaurantContentEngine()
