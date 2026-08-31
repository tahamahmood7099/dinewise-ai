import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from ..models import Interaction, Favorite, Rating, Restaurant, User

class RestaurantCollaborativeEngine:
    def __init__(self):
        self.user_item_matrix = None
        self.user_ids = []
        self.restaurant_ids = []
        self.user_similarity_df = None
        self.item_similarity_df = None

    def build_interaction_matrix(self, db: Session):
        interactions = db.query(Interaction).all()
        favorites = db.query(Favorite).all()
        ratings = db.query(Rating).all()
        restaurants = db.query(Restaurant).all()
        users = db.query(User).all()

        if not restaurants or not users:
            return

        all_r_ids = [r.id for r in restaurants]
        all_u_ids = [u.id for u in users]

        # Accumulate interactions
        data_records = []
        for inter in interactions:
            if inter.user_id:
                data_records.append({
                    "user_id": inter.user_id,
                    "restaurant_id": inter.restaurant_id,
                    "weight": inter.weight
                })

        for fav in favorites:
            if fav.user_id:
                data_records.append({
                    "user_id": fav.user_id,
                    "restaurant_id": fav.restaurant_id,
                    "weight": 6.0
                })

        for rat in ratings:
            if rat.user_id:
                data_records.append({
                    "user_id": rat.user_id,
                    "restaurant_id": rat.restaurant_id,
                    "weight": rat.rating_score * 1.5
                })

        if not data_records:
            # Fallback zero matrix
            self.user_ids = all_u_ids
            self.restaurant_ids = all_r_ids
            self.user_item_matrix = pd.DataFrame(0.0, index=all_u_ids, columns=all_r_ids)
            return

        df = pd.DataFrame(data_records)
        grouped = df.groupby(["user_id", "restaurant_id"])["weight"].sum().reset_index()

        # Pivot to create User x Restaurant matrix
        matrix = grouped.pivot(index="user_id", columns="restaurant_id", values="weight").fillna(0.0)

        # Reindex to ensure all users and restaurants are present
        matrix = matrix.reindex(index=all_u_ids, columns=all_r_ids, fill_value=0.0)

        self.user_item_matrix = matrix
        self.user_ids = matrix.index.tolist()
        self.restaurant_ids = matrix.columns.tolist()

        # Compute User Similarity
        if matrix.shape[0] > 1 and np.sum(matrix.values) > 0:
            user_sim = cosine_similarity(matrix.values)
            self.user_similarity_df = pd.DataFrame(user_sim, index=self.user_ids, columns=self.user_ids)
        else:
            self.user_similarity_df = pd.DataFrame(np.eye(len(self.user_ids)), index=self.user_ids, columns=self.user_ids)

        # Compute Item Similarity (for complementary/similar restaurants)
        if matrix.shape[1] > 1 and np.sum(matrix.values) > 0:
            item_sim = cosine_similarity(matrix.values.T)
            self.item_similarity_df = pd.DataFrame(item_sim, index=self.restaurant_ids, columns=self.restaurant_ids)
        else:
            self.item_similarity_df = pd.DataFrame(np.eye(len(self.restaurant_ids)), index=self.restaurant_ids, columns=self.restaurant_ids)

    def get_user_collaborative_scores(self, user_id: int, db: Session) -> dict:
        if self.user_item_matrix is None or user_id not in self.user_ids:
            self.build_interaction_matrix(db)

        if self.user_item_matrix is None or user_id not in self.user_ids:
            return {r_id: 0.5 for r_id in self.restaurant_ids}

        user_vector = self.user_item_matrix.loc[user_id].values
        
        # If user has no interaction history, return baseline popularity
        if np.sum(user_vector) == 0.0:
            pop_scores = self.user_item_matrix.sum(axis=0)
            max_pop = pop_scores.max() if pop_scores.max() > 0 else 1.0
            return {r_id: float(pop_scores[r_id] / max_pop) for r_id in self.restaurant_ids}

        # User-based CF: predict ratings based on similar users
        sim_series = self.user_similarity_df.loc[user_id]
        
        # Exclude self
        other_sims = sim_series.drop(user_id)
        other_ratings = self.user_item_matrix.drop(user_id)

        sim_sum = np.sum(np.abs(other_sims.values))
        if sim_sum > 0:
            predicted_scores = np.dot(other_sims.values, other_ratings.values) / sim_sum
        else:
            predicted_scores = user_vector

        # Min-max normalization
        min_v, max_v = np.min(predicted_scores), np.max(predicted_scores)
        if max_v > min_v:
            norm_scores = (predicted_scores - min_v) / (max_v - min_v)
        else:
            norm_scores = np.full(len(self.restaurant_ids), 0.5)

        scores_dict = {}
        for idx, r_id in enumerate(self.restaurant_ids):
            scores_dict[r_id] = float(np.clip(norm_scores[idx], 0.0, 1.0))

        return scores_dict

restaurant_collab_engine = RestaurantCollaborativeEngine()
