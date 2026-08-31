import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from ..models import Product, Interaction

class ContentBasedEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', token_pattern=r'(?u)\b\w+\b')
        self.tfidf_matrix = None
        self.product_ids = []
        self.product_df = None
        self.similarity_matrix = None

    def fit(self, products: List[Product]):
        """Train or update TF-IDF representation of the product catalog."""
        if not products:
            return
        
        data = []
        for p in products:
            # Combine textual signals for rich semantic representation
            text_corpus = f"{p.name} {p.category} {p.brand} {p.tags} {p.colors} {p.description}"
            data.append({
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "brand": p.brand,
                "price": p.price,
                "corpus": text_corpus
            })
        
        self.product_df = pd.DataFrame(data)
        self.product_ids = self.product_df["id"].tolist()
        
        # Compute TF-IDF matrix & pairwise cosine similarity
        self.tfidf_matrix = self.vectorizer.fit_transform(self.product_df["corpus"])
        self.similarity_matrix = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)

    def get_similar_products(self, product_id: int, top_n: int = 6) -> List[Tuple[int, float, str]]:
        """
        Return list of (product_id, similarity_score, reason) for a given product.
        """
        if self.similarity_matrix is None or product_id not in self.product_ids:
            return []
        
        idx = self.product_ids.index(product_id)
        sim_scores = list(enumerate(self.similarity_matrix[idx]))
        # Sort descending by score, skip the item itself
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = [s for s in sim_scores if s[0] != idx][:top_n]
        
        target_prod = self.product_df.iloc[idx]
        
        results = []
        for match_idx, score in sim_scores:
            matched_id = self.product_ids[match_idx]
            matched_prod = self.product_df.iloc[match_idx]
            
            # Grounded reason generation
            if matched_prod["brand"] == target_prod["brand"]:
                reason = f"Also from {matched_prod['brand']} in {matched_prod['category']}"
            elif matched_prod["category"] == target_prod["category"]:
                reason = f"Matches category {matched_prod['category']} similar to {target_prod['name'][:25]}..."
            else:
                reason = f"Features similar specifications & style profile"
                
            results.append((matched_id, float(score), reason))
            
        return results

    def get_user_content_scores(self, user_interactions: List[Interaction], all_products: List[Product]) -> Dict[int, Tuple[float, str]]:
        """
        Build a user profile vector from interacted products weighted by interaction weights,
        and calculate cosine similarity against all catalog items.
        """
        if self.similarity_matrix is None:
            self.fit(all_products)
            
        if self.similarity_matrix is None or not user_interactions:
            return {}

        # Aggregate weighted interactions per product
        interacted_product_weights: Dict[int, float] = {}
        for inter in user_interactions:
            interacted_product_weights[inter.product_id] = (
                interacted_product_weights.get(inter.product_id, 0.0) + inter.weight
            )

        # Build user profile as weighted combination of item TF-IDF vectors
        user_vector = np.zeros((1, self.tfidf_matrix.shape[1]))
        total_weight = 0.0
        
        last_viewed_category = None
        last_viewed_brand = None
        
        for pid, wt in interacted_product_weights.items():
            if pid in self.product_ids:
                idx = self.product_ids.index(pid)
                item_vec = self.tfidf_matrix[idx].toarray()
                user_vector += wt * item_vec
                total_weight += wt
                
                # capture context for explainability
                prod_row = self.product_df.iloc[idx]
                last_viewed_category = prod_row["category"]
                last_viewed_brand = prod_row["brand"]

        if total_weight == 0:
            return {}

        user_vector = user_vector / total_weight
        
        # Calculate similarity between user profile and all items
        user_sim = cosine_similarity(user_vector, self.tfidf_matrix)[0]
        
        scores_dict = {}
        for idx, score in enumerate(user_sim):
            pid = self.product_ids[idx]
            prod_row = self.product_df.iloc[idx]
            
            # Grounded explainability reason
            if last_viewed_brand and prod_row["brand"] == last_viewed_brand:
                reason = f"Matches your interest in {last_viewed_brand}"
            elif last_viewed_category and prod_row["category"] == last_viewed_category:
                reason = f"Curated for your interest in {last_viewed_category}"
            else:
                reason = "Matches your browsing & taste profile"
                
            scores_dict[pid] = (float(score), reason)
            
        return scores_dict

content_engine = ContentBasedEngine()
