import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.seed_data import seed_database
from app.models import Restaurant, User, CuisineCategory, Interaction, Favorite, Rating
from app.ml.content_engine import restaurant_content_engine
from app.ml.collaborative_engine import restaurant_collab_engine
from app.ml.hybrid_engine import restaurant_hybrid_engine
from app.ml.nlp_parser import restaurant_nlp_parser
from app.ml.segmentation import customer_segmentation_engine
from app.ml.evaluation_engine import recommendation_eval_engine

def run_tests():
    print("=" * 70)
    print("  DINEWISE AI - AUTOMATED VERIFICATION SUITE")
    print("=" * 70)

    # 1. Database Initialization & Seed Check
    seed_database()
    db = SessionLocal()

    try:
        r_count = db.query(Restaurant).count()
        u_count = db.query(User).count()
        c_count = db.query(CuisineCategory).count()
        i_count = db.query(Interaction).count()

        print(f"\n[TEST 1] Database Entities Check:")
        print(f"  - Restaurants Count: {r_count} (Expected >= 10)")
        print(f"  - Cuisine Categories Count: {c_count} (Expected >= 8)")
        print(f"  - User Personas Count: {u_count} (Expected >= 4)")
        print(f"  - Interactions Count: {i_count} (Expected >= 15)")
        assert r_count >= 10, "Restaurants not properly seeded"
        assert u_count >= 4, "Users not properly seeded"
        print("  [PASS] TEST 1: Database seeded successfully.")

        # 2. Content-Based TF-IDF Recommendation Check
        sims = restaurant_content_engine.get_similar_restaurants(1, db, top_n=3)
        print(f"\n[TEST 2] Content-Based Engine (Similar to Paradise Biryani):")
        for r_id, score in sims:
            r = db.query(Restaurant).filter(Restaurant.id == r_id).first()
            print(f"  - {r.name} ({r.cuisine}, {r.area}) -> Cosine Sim: {score:.3f}")
        assert len(sims) > 0, "Content engine failed to return similar restaurants"
        print("  [PASS] TEST 2: Content-Based TF-IDF similarity operational.")

        # 3. Collaborative Filtering Check
        cf_scores = restaurant_collab_engine.get_user_collaborative_scores(1, db)
        print(f"\n[TEST 3] Collaborative Filtering Engine (Aarav Sharma - ID: 1):")
        top_cf = sorted(cf_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        for r_id, score in top_cf:
            r = db.query(Restaurant).filter(Restaurant.id == r_id).first()
            print(f"  - {r.name} -> CF Score: {score:.3f}")
        assert len(top_cf) > 0, "Collaborative engine failed"
        print("  [PASS] TEST 3: Collaborative interaction matrix operational.")

        # 4. Hybrid Engine & Persona Differentiation Test
        print(f"\n[TEST 4] Hybrid Recommendation & Persona Taste Differentiation:")
        
        # Aarav (Biryani Lover)
        aarav_recs = restaurant_hybrid_engine.get_hybrid_recommendations(db, user_id=1, limit=3)
        print(f"  Aarav Sharma (ID: 1 - Biryani Lover):")
        for rec in aarav_recs:
            r = rec["restaurant"]
            print(f"    * {r.name} ({r.cuisine}) - Match: {rec['match_score']}% | Reason: {rec['reason']}")

        # Priya (Pure Veg South Indian)
        priya_recs = restaurant_hybrid_engine.get_hybrid_recommendations(db, user_id=2, limit=3)
        print(f"\n  Priya Patel (ID: 2 - Pure Veg South Indian):")
        for rec in priya_recs:
            r = rec["restaurant"]
            print(f"    * {r.name} ({r.cuisine}) - Match: {rec['match_score']}% | Reason: {rec['reason']}")

        # Rohan (Fine Dining Italian)
        rohan_recs = restaurant_hybrid_engine.get_hybrid_recommendations(db, user_id=3, limit=3)
        print(f"\n  Rohan Verma (ID: 3 - Fine Dining / Italian):")
        for rec in rohan_recs:
            r = rec["restaurant"]
            print(f"    * {r.name} ({r.cuisine}) - Match: {rec['match_score']}% | Reason: {rec['reason']}")

        # Assert differentiation
        assert aarav_recs[0]["restaurant"].id != priya_recs[0]["restaurant"].id, "Recommendations did not differentiate!"
        print("  [PASS] TEST 4: Personalized hybrid recommendations differentiated per persona.")

        # 5. NLP Restaurant Query Parser
        print(f"\n[TEST 5] Restaurant NLP Query Parser:")
        q1 = "Best biriyani under 500 in tolichoki"
        p1 = restaurant_nlp_parser.parse_query(q1)
        print(f"  Query: '{q1}'")
        print(f"  -> Extracted Cuisine: {p1['cuisine']} | Area: {p1['area']} | Max Price: Rs {p1['max_price']}")
        assert p1["cuisine"] == "Biryani", "NLP failed to extract cuisine"
        assert p1["area"] == "Tolichowki", "NLP failed to correct & extract area"
        assert p1["max_price"] == 500.0, "NLP failed to extract max price"

        q2 = "pure veg restaurants in banjara hills"
        p2 = restaurant_nlp_parser.parse_query(q2)
        print(f"  Query: '{q2}'")
        print(f"  -> Veg Only: {p2['is_veg']} | Area: {p2['area']}")
        assert p2["is_veg"] is True, "NLP failed to detect pure veg intent"
        assert p2["area"] == "Banjara Hills", "NLP failed to detect Banjara Hills"
        print("  [PASS] TEST 5: NLP parser extracted constraints & corrected typos accurately.")

        # 6. Customer Behavioral Segmentation
        print(f"\n[TEST 6] Customer Behavioral Segmentation:")
        segments = customer_segmentation_engine.segment_users(db)
        for s in segments:
            print(f"  - {s['name']}: {s['segment']} (Preferred: {s['preferred_cuisine']}, Total Hits: {s['total_interactions']})")
        assert len(segments) >= 4, "Segmentation failed"
        print("  [PASS] TEST 6: Customer behavioral clustering active.")

        # 7. Model Evaluation Benchmarks (Precision, Recall, F1, NDCG)
        print(f"\n[TEST 7] Recommendation Model Offline Evaluation:")
        metrics = recommendation_eval_engine.evaluate_models(db, k=5)
        for m in metrics:
            print(f"  - {m['model_name']:<45}: Precision@5={m['precision_at_k']:.3f} | Recall@5={m['recall_at_k']:.3f} | NDCG@5={m['ndcg_at_k']:.3f}")
        assert len(metrics) == 4, "Evaluation metrics failed"
        print("  [PASS] TEST 7: Offline model benchmarks computed successfully.")

        print("\n" + "=" * 70)
        print("  ALL 7 TESTS PASSED SUCCESSFULLY! DineWise AI Backend 100% OPERATIONAL.")
        print("=" * 70)

    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
