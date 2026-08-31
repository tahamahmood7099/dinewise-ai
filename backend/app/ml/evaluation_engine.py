import numpy as np
from sqlalchemy.orm import Session
from ..models import Restaurant, User, Interaction, Favorite, Rating
from .content_engine import restaurant_content_engine
from .collaborative_engine import restaurant_collab_engine
from .hybrid_engine import restaurant_hybrid_engine

class RecommendationEvaluationEngine:
    def evaluate_models(self, db: Session, k: int = 5):
        restaurants = db.query(Restaurant).all()
        users = db.query(User).filter(User.role == "user").all()

        if not restaurants or not users:
            return []

        all_r_ids = set([r.id for r in restaurants])
        
        # Ground-truth: restaurants the user has positively engaged with (favorite, high rating, or >= 2 views)
        ground_truth = {}
        for u in users:
            favs = set([f.restaurant_id for f in db.query(Favorite).filter(Favorite.user_id == u.id).all()])
            rats = set([r.restaurant_id for r in db.query(Rating).filter(Rating.user_id == u.id, Rating.rating_score >= 4.0).all()])
            inters = db.query(Interaction).filter(Interaction.user_id == u.id).all()
            inter_counts = {}
            for i in inters:
                inter_counts[i.restaurant_id] = inter_counts.get(i.restaurant_id, 0) + 1
            high_views = set([r_id for r_id, count in inter_counts.items() if count >= 1])

            engaged = favs.union(rats).union(high_views)
            if not engaged:
                # Fallback to top-rated restaurant as baseline ground-truth
                engaged = set([restaurants[0].id])
            ground_truth[u.id] = engaged

        # Evaluate 4 models: Popularity Baseline, Content-Based, Collaborative, Hybrid
        models = [
            ("Popularity Baseline", self._recommend_popularity),
            ("Content-Based Filtering (TF-IDF)", self._recommend_content),
            ("Collaborative Filtering (Interaction Matrix)", self._recommend_collaborative),
            ("Hybrid Engine (alpha=0.6, beta=0.4)", self._recommend_hybrid)
        ]

        metrics_results = []
        for name, rec_fn in models:
            precisions = []
            recalls = []
            ndcgs = []
            recommended_universe = set()

            for u in users:
                actual = ground_truth[u.id]
                predicted = rec_fn(u.id, db, k)
                recommended_universe.update(predicted)

                # Precision@K = |Predicted ∩ Actual| / K
                hits = len(set(predicted).intersection(actual))
                p_k = hits / float(k)
                precisions.append(p_k)

                # Recall@K = |Predicted ∩ Actual| / |Actual|
                r_k = hits / float(len(actual)) if len(actual) > 0 else 0.0
                recalls.append(r_k)

                # NDCG@K
                dcg = 0.0
                for idx, r_id in enumerate(predicted):
                    rel = 1.0 if r_id in actual else 0.0
                    dcg += rel / np.log2(idx + 2)

                idcg = sum(1.0 / np.log2(i + 2) for i in range(min(k, len(actual))))
                ndcg = (dcg / idcg) if idcg > 0 else 0.0
                ndcgs.append(ndcg)

            mean_p = float(np.mean(precisions))
            mean_r = float(np.mean(recalls))
            mean_ndcg = float(np.mean(ndcgs))
            f1 = (2 * mean_p * mean_r / (mean_p + mean_r)) if (mean_p + mean_r) > 0 else 0.0
            coverage = len(recommended_universe) / float(len(all_r_ids))

            metrics_results.append({
                "model_name": name,
                "precision_at_k": round(mean_p, 4),
                "recall_at_k": round(mean_r, 4),
                "f1_score": round(f1, 4),
                "ndcg_at_k": round(mean_ndcg, 4),
                "coverage_rate": round(coverage, 4),
                "sample_size": len(users)
            })

        return metrics_results

    def _recommend_popularity(self, user_id: int, db: Session, k: int):
        top = db.query(Restaurant).order_by(Restaurant.rating.desc(), Restaurant.review_count.desc()).limit(k).all()
        return [r.id for r in top]

    def _recommend_content(self, user_id: int, db: Session, k: int):
        scores = restaurant_content_engine.get_user_content_scores(user_id, db)
        sorted_ids = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)
        return sorted_ids[:k]

    def _recommend_collaborative(self, user_id: int, db: Session, k: int):
        scores = restaurant_collab_engine.get_user_collaborative_scores(user_id, db)
        sorted_ids = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)
        return sorted_ids[:k]

    def _recommend_hybrid(self, user_id: int, db: Session, k: int):
        recs = restaurant_hybrid_engine.get_hybrid_recommendations(db, user_id=user_id, limit=k)
        return [item["restaurant"].id for item in recs]

recommendation_eval_engine = RecommendationEvaluationEngine()
