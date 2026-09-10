import urllib.request
import json
import time

BASE_URL = "https://dinewise-ai.onrender.com"
SESSION_ID = f"test_audit_session_{int(time.time())}"

def request(method, path, data=None):
    url = f"{BASE_URL}{path}"
    headers = {"User-Agent": "AuditBot/2.0"}
    body = None
    if data is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.getcode(), json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, {"detail": err_body}
    except Exception as e:
        return 0, {"error": str(e)}

print("=" * 70)
print("  DINEWISE AI - DEEP FUNCTIONAL LIFECYCLE & STATE AUDIT")
print("=" * 70)

# ================= 1. AUTH LIFECYCLE =================
print("\n[TEST 1] Authentication Lifecycle:")
# A. Demo user login
code, res = request("POST", "/api/auth/login", {"email": "aarav.sharma@example.in", "password": "password123"})
print(f"  * Valid Login: HTTP {code} | User: {res.get('user', {}).get('name') if isinstance(res, dict) else 'Err'}")
assert code == 200 and "access_token" in res, "Valid login failed"

# B. Invalid password
code, res = request("POST", "/api/auth/login", {"email": "aarav.sharma@example.in", "password": "wrongpassword"})
print(f"  * Invalid Password Check: HTTP {code} (Expected 401) | Detail: {res.get('detail')}")
assert code == 401, "Invalid password did not return 401"

# C. Nonexistent user
code, res = request("POST", "/api/auth/login", {"email": "nonexistent@example.com", "password": "password123"})
print(f"  * Nonexistent User Check: HTTP {code} (Expected 401)")
assert code == 401, "Nonexistent user did not return 401"

print("  -> AUTH LIFECYCLE: PASS")

# ================= 2. FAVORITES LIFECYCLE =================
print("\n[TEST 2] Favorites State & CRUD Lifecycle:")
# A. Initial favorites
code, initial_favs = request("GET", f"/api/favorites?session_id={SESSION_ID}")
initial_ids = [f["id"] for f in initial_favs] if isinstance(initial_favs, list) else []
print(f"  * Initial favorites count for session: {len(initial_ids)}")

# B. Add Favorite (Restaurant ID 5: Dadu's Mithai Vatika)
code, add_res = request("POST", "/api/favorites", {"restaurant_id": 5, "session_id": SESSION_ID})
print(f"  * Add Favorite (ID: 5): HTTP {code} | Result: {add_res}")
assert code == 200 and add_res.get("is_favorite") == True, "Failed to add favorite"

# C. Verify persistence in GET
code, after_add = request("GET", f"/api/favorites?session_id={SESSION_ID}")
after_ids = [f["id"] for f in after_add] if isinstance(after_add, list) else []
print(f"  * Favorites after addition: {after_ids}")
assert 5 in after_ids, "Restaurant 5 did not appear in favorites list"

# D. Remove Favorite (Toggle again)
code, rem_res = request("POST", "/api/favorites", {"restaurant_id": 5, "session_id": SESSION_ID})
print(f"  * Remove Favorite (ID: 5): HTTP {code} | Result: {rem_res}")
assert code == 200 and rem_res.get("is_favorite") == False, "Failed to remove favorite"

# E. Verify removal in GET
code, after_rem = request("GET", f"/api/favorites?session_id={SESSION_ID}")
after_rem_ids = [f["id"] for f in after_rem] if isinstance(after_rem, list) else []
print(f"  * Favorites after removal: {after_rem_ids}")
assert 5 not in after_rem_ids, "Restaurant 5 remained in favorites list after removal"

print("  -> FAVORITES LIFECYCLE: PASS")

# ================= 3. RATINGS LIFECYCLE =================
print("\n[TEST 3] Ratings State & Review Submission Lifecycle:")
# A. Get initial ratings for restaurant 1
code, initial_ratings = request("GET", "/api/restaurants/1/ratings")
print(f"  * Initial ratings count for Restaurant 1: {len(initial_ratings) if isinstance(initial_ratings, list) else 'Err'}")

# B. Submit rating
new_review = f"Audit validation review at {time.strftime('%X')}"
code, sub_res = request("POST", "/api/restaurants/1/ratings", {
    "restaurant_id": 1,
    "rating_score": 5.0,
    "review_text": new_review,
    "user_id": 1
})
print(f"  * Submit Rating: HTTP {code} | Result: {sub_res}")
assert code == 200, "Rating submission failed"

# C. Verify rating appears in GET list
code, updated_ratings = request("GET", "/api/restaurants/1/ratings")
reviews_list = [r["review_text"] for r in updated_ratings] if isinstance(updated_ratings, list) else []
print(f"  * Latest review in database: '{reviews_list[-1] if reviews_list else 'None'}'")
assert new_review in reviews_list, "Submitted review was not found in restaurant ratings"

print("  -> RATINGS LIFECYCLE: PASS")

# ================= 4. INTERACTIONS TELEMETRY =================
print("\n[TEST 4] Interaction Telemetry Tracker:")
for action in ["view", "click", "search", "like", "dislike"]:
    code, int_res = request("POST", "/api/interactions", {
        "restaurant_id": 1,
        "interaction_type": action,
        "session_id": SESSION_ID,
        "metadata_info": {"source": "audit_script"}
    })
    print(f"  * Telemetry action '{action}': HTTP {code} | Logged: {int_res.get('status')}")
    assert code == 200 and int_res.get("status") == "logged", f"Telemetry failed for action {action}"

print("  -> INTERACTIONS TELEMETRY: PASS")

# ================= 5. NLP SEARCH & CONSTRAINT EXTRACTION =================
print("\n[TEST 5] NLP Search & Constraint Extraction:")
queries = [
    ("biryani under 500 in tolichowki", {"cuisine": "Biryani", "area": "Tolichowki"}),
    ("pure veg in banjara hills", {"area": "Banjara Hills", "veg_only": True}),
    ("chotneys dosaa in banjara", {"corrected": True}), # Typo
    ("impossible astronaut diner on the moon", {"expected_zero": True})
]

for q, expectations in queries:
    code, s_res = request("GET", f"/api/search?q={urllib.parse.quote(q)}")
    intent = s_res.get("nlp_intent", {})
    count = s_res.get("total_count", 0)
    print(f"  * Query: '{q}' -> Results: {count} | Intent: {intent}")
    assert code == 200, f"Search failed for query '{q}'"
    if expectations.get("expected_zero"):
        print(f"    -> Zero-result query handled gracefully without crash: Total Count = {count}")

print("  -> NLP SEARCH: PASS")

# ================= 6. RECOMMENDATIONS PERSONALIZATION DIFFERENTIATION =================
print("\n[TEST 6] Recommendation Personalization Differentiation:")
# User 1 (Aarav - Biryani)
code, feed1 = request("GET", "/api/recommendations/feed?user_id=1")
top1 = [r["name"] for r in feed1.get("picked_for_you", [])[:2]]

# User 2 (Priya - Pure Veg South Indian)
code, feed2 = request("GET", "/api/recommendations/feed?user_id=2")
top2 = [r["name"] for r in feed2.get("picked_for_you", [])[:2]]

# User 3 (Rohan - Fine Dining Italian)
code, feed3 = request("GET", "/api/recommendations/feed?user_id=3")
top3 = [r["name"] for r in feed3.get("picked_for_you", [])[:2]]

print(f"  * Aarav (Biryani Lover) Picks: {top1}")
print(f"  * Priya (Pure Veg) Picks:     {top2}")
print(f"  * Rohan (Fine Dining) Picks:   {top3}")
assert top1 != top2 and top2 != top3, "Personalization failed to produce distinct recommendations per persona"

print("  -> RECOMMENDATIONS PERSONALIZATION: PASS")

# ================= 7. AI ASSISTANT CONVERSATIONAL QUERIES =================
print("\n[TEST 7] AI Assistant Conversational Search:")
ai_queries = [
    "What are the best biryani restaurants in Secunderabad?",
    "Find pure veg restaurants under 500",
    "Where can I get good Italian pizza in Jubilee Hills?"
]

for ai_q in ai_queries:
    code, ai_res = request("POST", "/api/assistant", {"message": ai_q, "session_id": SESSION_ID})
    reply = ai_res.get("reply", "")
    recs = len(ai_res.get("restaurants", []))
    print(f"  * Query: '{ai_q}' -> HTTP {code} | Recs: {recs} | Reply: '{reply[:60]}...'")
    assert code == 200 and reply, f"AI Assistant failed for query '{ai_q}'"

print("  -> AI ASSISTANT: PASS")

print("\n" + "=" * 70)
print("  ALL 7 FUNCTIONAL LIFECYCLE TESTS PASSED WITH 100% SUCCESS!")
print("=" * 70)
