import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Optional
from sklearn.metrics.pairwise import cosine_similarity
from ..models import Interaction, Product

class CollaborativeFilteringEngine:
    def __init__(self):
        self.user_item_matrix = None
        self.user_similarity_df = None
        self.item_similarity_df = None
        self.user_ids = []
        self.product_ids = []

    def fit(self, interactions: List[Interaction], all_products: List[Product]):
        """
        Build User-Item interaction matrix with interaction weights and compute similarity matrices.
        """
        if not interactions:
            return

        data = []
        for inter in interactions:
            # Handle user_id or session_id
            uid = inter.user_id if inter.user_id is not None else inter.session_id
            if uid is not None and inter.product_id is not None:
                data.append({
                    "user": str(uid),
                    "product_id": inter.product_id,
                    "weight": inter.weight
                })

        if not data:
            return

        df = pd.DataFrame(data)
        # Sum weights per user-item pair
        pivot = df.pivot_table(index="user", columns="product_id", values="weight", aggfunc="sum", fill_value=0.0)
        
        self.user_item_matrix = pivot
        self.user_ids = list(pivot.index)
        self.product_ids = list(pivot.columns)

        # Compute User-User similarity
        if len(self.user_ids) > 1:
            u_sim = cosine_similarity(self.user_item_matrix.values)
            self.user_similarity_df = pd.DataFrame(u_sim, index=self.user_ids, columns=self.user_ids)
        else:
            self.user_similarity_df = None

        # Compute Item-Item similarity (for co-occurrence / complementary items)
        if len(self.product_ids) > 1:
            i_sim = cosine_similarity(self.user_item_matrix.values.T)
            self.item_similarity_df = pd.DataFrame(i_sim, index=self.product_ids, columns=self.product_ids)
        else:
            self.item_similarity_df = None

    def predict_user_scores(self, user_identifier: str) -> Dict[int, Tuple[float, str]]:
        """
        Predict recommendation scores for a user using User-based Collaborative Filtering.
        """
        if self.user_item_matrix is None or self.user_similarity_df is None:
            return {}

        uid_str = str(user_identifier)
        if uid_str not in self.user_ids:
            return {}

        # Get similarities with other users
        user_similarities = self.user_similarity_df.loc[uid_str].drop(uid_str)
        
        # Filter only positive similarities
        positive_neighbors = user_similarities[user_similarities > 0]
        if positive_neighbors.empty:
            return {}

        # Weighted average of neighbor ratings
        neighbor_matrix = self.user_item_matrix.loc[positive_neighbors.index]
        weights = positive_neighbors.values.reshape(-1, 1)
        
        weighted_scores = np.sum(neighbor_matrix.values * weights, axis=0) / (np.sum(positive_neighbors.values) + 1e-9)
        
        # Normalize scores to 0-1 range
        max_score = np.max(weighted_scores) if np.max(weighted_scores) > 0 else 1.0
        normalized_scores = weighted_scores / max_score

        results = {}
        for idx, pid in enumerate(self.product_ids):
            score = float(normalized_scores[idx])
            if score > 0:
                reason = "Popular among shoppers with similar taste to you"
                results[pid] = (score, reason)

        return results

    def get_frequently_bought_together(self, product_id: int, top_n: int = 3) -> List[Tuple[int, float]]:
        """
        Get items frequently co-interacted or purchased with a given product.
        """
        if self.item_similarity_df is None or product_id not in self.product_ids:
            return []

        item_sims = self.item_similarity_df.loc[product_id].drop(product_id)
        top_items = item_sims.sort_values(ascending=False).head(top_n)
        
        return [(int(pid), float(score)) for pid, score in top_items.items() if score > 0]

collaborative_engine = CollaborativeFilteringEngine()
