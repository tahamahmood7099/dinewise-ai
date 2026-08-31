import re
from typing import Dict, Any

TYPO_MAP = {
    "biriyani": "biryani",
    "briyani": "biryani",
    "resturant": "restaurant",
    "restuarent": "restaurant",
    "vegitable": "veg",
    "vegitarian": "veg",
    "chines": "chinese",
    "chinse": "chinese",
    "italy": "italian",
    "jubliee": "jubilee hills",
    "banjara": "banjara hills",
    "gachiboli": "gachibowli",
    "madhpur": "madhapur",
    "secundrabad": "secunderabad",
    "secunderbad": "secunderabad",
    "tolichoki": "tolichowki",
    "charminr": "charminar",
    "hitec": "hitech city",
    "deserts": "desserts",
    "sweet": "bakery & desserts",
    "sweets": "bakery & desserts"
}

HYDERABAD_AREAS = [
    "Banjara Hills", "Jubilee Hills", "Madhapur", "Gachibowli",
    "Charminar", "Tolichowki", "Secunderabad", "Hitech City", "Kukatpally"
]

CUISINES = [
    "Biryani", "Mughlai", "South Indian", "North Indian", "Chinese",
    "Italian & Pizza", "Cafe & Bistro", "Bakery & Desserts", "Street Food", "Healthy Food"
]

class RestaurantNLPParser:
    def parse_query(self, raw_query: str) -> Dict[str, Any]:
        if not raw_query:
            return {
                "cleaned_query": "",
                "cuisine": None,
                "area": None,
                "max_price": None,
                "is_veg": False,
                "is_top_rated": False,
                "corrected_query": ""
            }

        text = raw_query.lower().strip()

        # 1. Apply typo correction
        words = text.split()
        corrected_words = [TYPO_MAP.get(w, w) for w in words]
        corrected_text = " ".join(corrected_words)

        # 2. Extract Budget Constraint (e.g. "under 500", "below 1000", "< 600", "500 ke andar")
        max_price = None
        price_match = re.search(r'(?:under|below|<|within|less than|upto|ke andar)\s*(?:₹|rs\.?|inr)?\s*(\d+)', corrected_text)
        if not price_match:
            price_match = re.search(r'(\d+)\s*(?:₹|rs\.?|inr)?\s*(?:under|below|budget|ke andar)', corrected_text)

        if price_match:
            max_price = float(price_match.group(1))

        # 3. Extract Area
        matched_area = None
        for area in HYDERABAD_AREAS:
            if area.lower() in corrected_text:
                matched_area = area
                break
        if not matched_area:
            # Check singular tokens
            if "banjara" in corrected_text:
                matched_area = "Banjara Hills"
            elif "jubilee" in corrected_text:
                matched_area = "Jubilee Hills"
            elif "gachibowli" in corrected_text:
                matched_area = "Gachibowli"
            elif "madhapur" in corrected_text:
                matched_area = "Madhapur"
            elif "charminar" in corrected_text:
                matched_area = "Charminar"
            elif "tolichowki" in corrected_text:
                matched_area = "Tolichowki"
            elif "secunderabad" in corrected_text:
                matched_area = "Secunderabad"
            elif "hitech" in corrected_text or "hitec" in corrected_text:
                matched_area = "Hitech City"
            elif "kukatpally" in corrected_text:
                matched_area = "Kukatpally"

        # 4. Extract Cuisine
        matched_cuisine = None
        if "biryani" in corrected_text:
            matched_cuisine = "Biryani"
        elif "haleem" in corrected_text or "mughlai" in corrected_text or "kebab" in corrected_text:
            matched_cuisine = "Mughlai"
        elif "dosa" in corrected_text or "idli" in corrected_text or "south indian" in corrected_text:
            matched_cuisine = "South Indian"
        elif "butter chicken" in corrected_text or "north indian" in corrected_text:
            matched_cuisine = "North Indian"
        elif "chinese" in corrected_text or "noodles" in corrected_text or "dimsum" in corrected_text:
            matched_cuisine = "Chinese"
        elif "pizza" in corrected_text or "italian" in corrected_text or "pasta" in corrected_text:
            matched_cuisine = "Italian & Pizza"
        elif "coffee" in corrected_text or "cafe" in corrected_text:
            matched_cuisine = "Cafe & Bistro"
        elif "chai" in corrected_text or "dessert" in corrected_text or "sweet" in corrected_text:
            matched_cuisine = "Bakery & Desserts"
        elif "shawarma" in corrected_text or "street food" in corrected_text or "chicken 65" in corrected_text:
            matched_cuisine = "Street Food"
        elif "healthy" in corrected_text or "salad" in corrected_text or "keto" in corrected_text:
            matched_cuisine = "Healthy Food"

        # 5. Extract Dietary Preference
        is_veg = False
        if "pure veg" in corrected_text or "veg only" in corrected_text or "vegetarian" in corrected_text:
            is_veg = True
        elif " veg" in corrected_text and "non-veg" not in corrected_text and "non veg" not in corrected_text:
            is_veg = True

        # 6. Extract Quality / Rating Intent
        is_top_rated = any(word in corrected_text for word in ["best", "top", "famous", "iconic", "popular", "highest rated"])

        return {
            "cleaned_query": raw_query.strip(),
            "corrected_query": corrected_text,
            "cuisine": matched_cuisine,
            "area": matched_area,
            "max_price": max_price,
            "is_veg": is_veg,
            "is_top_rated": is_top_rated
        }

restaurant_nlp_parser = RestaurantNLPParser()
