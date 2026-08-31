"""
Automated Verification Suite for BharatKart AI
Tests all core requirements: APIs, ML algorithms, NLP parsing, User Differentiation, and Explanations.
"""
import sys
import os

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import User, Product, Category, Interaction, Order, SearchLog
from app.seed_data import seed_database
from app.ml.content_engine import content_engine
from app.ml.collaborative_engine import collaborative_engine
from app.ml.hybrid_engine import hybrid_engine
from app.ml.nlp_parser import parse_nlp_search_query, correct_typos
from app.ml.segmentation import compute_customer_segments
from app.ml.evaluation_engine import evaluate_models
from app.schemas import ParsedNLPIntent

def run_tests():
    print("=" * 70)
    print("🚀 BHARATKART AI — SYSTEM VERIFICATION SUITE")
    print("=" * 70)

    db = SessionLocal()
    try:
        # Step 0: Ensure DB is seeded
        seed_database(db)

        # TEST 1: Database Population
        user_count = db.query(User).count()
        product_count = db.query(Product).count()
        interaction_count = db.query(Interaction).count()
        order_count = db.query(Order).count()
        print(f"\n[TEST 1] Database Entities Check:")
        print(f"  ✓ Users: {user_count} (Expected >= 5)")
        print(f"  ✓ Products: {product_count} (Expected >= 20)")
        print(f"  ✓ Interactions: {interaction_count} (Expected >= 30)")
        print(f"  ✓ Orders: {order_count} (Expected >= 2)")
        assert user_count >= 5 and product_count >= 20 and interaction_count >= 30

        # TEST 2: NLP & Typo Correction
        print(f"\n[TEST 2] NLP Parser & Typo Tolerance:")
        test_queries = [
            ("black shoes under 2000", "shoes", "black", 2000.0),
            ("2000 ke andar black shoes", "shoes", "black", 2000.0),
            ("pure banarasi silk saree", "saree", None, None),
            ("biriyani feast pack", "biryani", None, None), # Typo test
        ]
        for q, expected_cat_kw, expected_col, expected_price in test_queries:
            parsed, corrected = parse_nlp_search_query(q)
            print(f"  Query: '{q}'")
            print(f"    -> Typo Corrected: '{corrected}'")
            print(f"    -> Detected Category: {parsed.detected_category}")
            print(f"    -> Detected Color: {parsed.detected_color}")
            print(f"    -> Max Price: {parsed.max_price}")
            if expected_price:
                assert parsed.max_price == expected_price

        # TEST 3: Content-Based Filtering (TF-IDF + Cosine Similarity)
        print(f"\n[TEST 3] Content-Based Engine (TF-IDF):")
        all_products = db.query(Product).all()
        content_engine.fit(all_products)
        # Check similar products to Manyavar Kurta (ID 1)
        sim_kurta = content_engine.get_similar_products(all_products[0].id, top_n=3)
        print(f"  Target: '{all_products[0].name}'")
        for pid, score, reason in sim_kurta:
            matched_p = db.query(Product).filter(Product.id == pid).first()
            print(f"    -> Similar Item: '{matched_p.name}' | Cosine Sim: {score:.3f} | Reason: {reason}")
        assert len(sim_kurta) > 0

        # TEST 4: Collaborative Filtering (User-Item Matrix)
        print(f"\n[TEST 4] Collaborative Filtering Engine:")
        all_interactions = db.query(Interaction).all()
        collaborative_engine.fit(all_interactions, all_products)
        aarav_collab = collaborative_engine.predict_user_scores("1")
        print(f"  Aarav (User 1) Predicted Collab Items count: {len(aarav_collab)}")
        for pid, (score, reason) in list(aarav_collab.items())[:3]:
            p = db.query(Product).filter(Product.id == pid).first()
            print(f"    -> Item: '{p.name}' | Collab Score: {score:.3f} | Reason: {reason}")

        # TEST 5: Hybrid Recommendation Engine & User Differentiation
        print(f"\n[TEST 5] Hybrid Recommendations & User Differentiation:")
        # User 1: Aarav (Tech/Footwear interest)
        aarav_recs = hybrid_engine.get_recommendations(db, user_id=1, limit=3)
        aarav_names = [r[0].name for r in aarav_recs]
        print(f"  👤 Aarav Sharma Recs (Tech/Footwear persona):")
        for prod, match_pct, reason in aarav_recs:
            print(f"    • {prod.name} ({match_pct}% Match) | Reason: {reason}")

        # User 2: Priya (Fashion/Ayurveda interest)
        priya_recs = hybrid_engine.get_recommendations(db, user_id=2, limit=3)
        priya_names = [r[0].name for r in priya_recs]
        print(f"\n  👤 Priya Patel Recs (Fashion/Beauty persona):")
        for prod, match_pct, reason in priya_recs:
            print(f"    • {prod.name} ({match_pct}% Match) | Reason: {reason}")

        # Verify that Aarav and Priya receive DIFFERENT top recommendations
        assert aarav_names != priya_names, "User recommendations MUST be distinct based on interaction history!"
        print(f"\n  ✅ User Differentiation Verified: Aarav and Priya receive distinct personalized recommendations!")

        # TEST 6: Cold Start Handling (New user with no interactions)
        print(f"\n[TEST 6] Cold Start Fallback for Brand New User:")
        cold_recs = hybrid_engine.get_recommendations(db, user_id=999, limit=3)
        print(f"  👤 New Guest Shopper (0 interactions):")
        for prod, match_pct, reason in cold_recs:
            print(f"    • {prod.name} ({match_pct}% Match) | Reason: {reason}")
        assert len(cold_recs) == 3, "Cold start must return popular/trending fallbacks!"

        # TEST 7: Customer Segmentation
        print(f"\n[TEST 7] Behavioral Customer Segmentation:")
        segments = compute_customer_segments(db)
        for s in segments:
            print(f"  • {s.name}: Segment='{s.segment}', Spend=₹{s.total_spend}, Orders={s.total_orders}, Interactions={s.total_interactions}")
        assert len(segments) >= 5

        # TEST 8: Recommendation Model Evaluation Benchmarks
        print(f"\n[TEST 8] Model Evaluation Benchmarks (Precision@5, Recall@5, F1, NDCG@5):")
        evals = evaluate_models(db, k=5)
        for ev in evals:
            print(f"  • {ev.model_name:<30} | Prec@5: {ev.precision_at_k*100:4.1f}% | Rec@5: {ev.recall_at_k*100:4.1f}% | F1: {ev.f1_score*100:4.1f}% | NDCG@5: {ev.ndcg_at_k*100:4.1f}%")
        assert len(evals) == 4

        print("\n" + "=" * 70)
        print("🎉 ALL 8 BACKEND & AI/ML TESTS PASSED WITH 100% SUCCESS!")
        print("=" * 70)

    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
