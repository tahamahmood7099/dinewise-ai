import re
from typing import Dict, Any, List, Optional, Tuple
from ..schemas import ParsedNLPIntent

# Indian & Standard Typos Dictionary for instant fuzzy normalization
TYPO_CORRECTIONS = {
    "biriyani": "biryani",
    "biryaani": "biryani",
    "bryani": "biryani",
    "shooes": "shoes",
    "shose": "shoes",
    "sheos": "shoes",
    "iphonne": "iphone",
    "earbud": "earbuds",
    "earphon": "earphones",
    "earphone": "earbuds",
    "headphon": "headphones",
    "smartwach": "smartwatch",
    "smart wtach": "smartwatch",
    "sari": "saree",
    "sariis": "saree",
    "sarees": "saree",
    "kurtha": "kurta",
    "kurtis": "kurti",
    "anarkaly": "anarkali",
    "ghe": "ghee",
    "massala": "masala",
    "chay": "tea",
    "chaye": "tea",
    "chai": "tea",
    "sweats": "sweets",
    "mithay": "mithai",
    "gulabjamun": "gulab jamun",
    "kajukatli": "kaju katli",
    "wallat": "wallet",
    "coker": "cooker"
}

CATEGORY_KEYWORDS = {
    "Ethnic & Fashion": ["kurta", "saree", "shirt", "anarkali", "suit", "cloth", "dress", "fashion", "ethnic", "linen", "silk"],
    "Electronics & Audio": ["earbuds", "earphone", "audio", "headphone", "smartwatch", "watch", "powerbank", "charger", "bluetooth", "wireless"],
    "Footwear": ["shoes", "running shoes", "sneakers", "jutti", "mojari", "boots", "footwear", "sandals"],
    "Indian Delicacies & Sweets": ["biryani", "gulab jamun", "kaju katli", "sweets", "mithai", "food", "feast", "mutton"],
    "Groceries & Spices": ["ghee", "masala", "spices", "tea", "chai", "assam", "organic", "grocery"],
    "Beauty & Ayurveda": ["serum", "kumkumadi", "saffron", "grooming", "beard", "skincare", "ayurveda", "face wash"],
    "Home & Kitchen": ["cooker", "pressure cooker", "urli", "diya", "brass", "kitchen", "pooja"],
    "Watches & Accessories": ["watch", "wallet", "leather wallet", "accessories", "analog"]
}

BRAND_KEYWORDS = [
    "Manyavar", "FabIndia", "Raymond", "Biba", "boAt", "Noise", 
    "OnePlus", "Xiaomi", "Red Tape", "Bata", "Woodland", 
    "Paradise Kitchens", "Haldiram's", "Bikaji", "Amul", "Everest", 
    "Tata Tea", "Forest Essentials", "Bombay Shaving Co", "Prestige", 
    "Pooja Crafts", "Titan", "Hidesign"
]

COLOR_KEYWORDS = [
    "black", "white", "red", "blue", "green", "yellow", "gold", "golden", 
    "silver", "brown", "maroon", "cream", "navy", "pink", "peach", "indigo", "tan", "khaki"
]

def correct_typos(text: str) -> Tuple[str, bool]:
    """Correct known typos and return corrected text and whether any typo was fixed."""
    words = text.lower().split()
    corrected_words = []
    is_corrected = False
    for word in words:
        # strip punctuation
        clean_w = re.sub(r'[^\w\s]', '', word)
        if clean_w in TYPO_CORRECTIONS:
            corrected_words.append(TYPO_CORRECTIONS[clean_w])
            is_corrected = True
        else:
            corrected_words.append(word)
    return " ".join(corrected_words), is_corrected

def parse_nlp_search_query(query: str) -> Tuple[ParsedNLPIntent, str]:
    """
    Parse natural language and Hinglish queries into structured search parameters.
    Examples:
    - 'black shoes under 2000'
    - '2000 ke andar black shoes'
    - 'red dress below 3000'
    - 'saree under 5000'
    - 'boat wireless earbuds'
    """
    corrected_q, has_typo = correct_typos(query)
    q_lower = corrected_q.lower()

    detected_category = None
    detected_brand = None
    detected_color = None
    min_price = None
    max_price = None

    # 1. Price pattern extraction (English & Hinglish)
    # Patterns like: "under 2000", "below 3000", "less than 1500", "< 2000", "2000 ke andar", "2000 se kam", "budget 2000"
    max_price_match = re.search(r'(?:under|below|less than|<|budget|ke andar|se kam)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)?)', q_lower)
    if not max_price_match:
        # Check inverted pattern: "2000 ke andar", "1500 se kam"
        max_price_match = re.search(r'(\d+(?:,\d+)?)\s*(?:₹|rs\.?|inr)?\s*(?:ke andar|se kam|ke niche|below)', q_lower)

    if max_price_match:
        try:
            max_price = float(max_price_match.group(1).replace(",", ""))
        except Exception:
            pass

    # Patterns like: "above 1000", "more than 2000", "> 1000", "1000 se jyada", "1000 se upar"
    min_price_match = re.search(r'(?:above|more than|>|over|se jyada|se upar)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)?)', q_lower)
    if not min_price_match:
        min_price_match = re.search(r'(\d+(?:,\d+)?)\s*(?:₹|rs\.?|inr)?\s*(?:se jyada|se upar|above)', q_lower)

    if min_price_match:
        try:
            min_price = float(min_price_match.group(1).replace(",", ""))
        except Exception:
            pass

    # Range patterns: "between 1000 and 3000", "1000 to 3000"
    range_match = re.search(r'(?:between|range)?\s*(\d+)\s*(?:to|-|and)\s*(\d+)', q_lower)
    if range_match and not max_price and not min_price:
        try:
            min_price = float(range_match.group(1))
            max_price = float(range_match.group(2))
        except Exception:
            pass

    # 2. Color extraction
    for col in COLOR_KEYWORDS:
        if re.search(r'\b' + re.escape(col) + r'\b', q_lower):
            detected_color = col
            break

    # 3. Brand extraction
    for b in BRAND_KEYWORDS:
        if re.search(r'\b' + re.escape(b.lower()) + r'\b', q_lower):
            detected_brand = b
            break

    # 4. Category extraction
    for cat, kws in CATEGORY_KEYWORDS.items():
        for kw in kws:
            if re.search(r'\b' + re.escape(kw) + r'\b', q_lower):
                detected_category = cat
                break
        if detected_category:
            break

    # 5. Extract core clean keywords for database search
    clean_kw = q_lower
    # Remove price phrases
    clean_kw = re.sub(r'(?:under|below|less than|above|more than|between|range|to|ke andar|se kam|se jyada|se upar)\s*(?:₹|rs\.?|inr)?\s*\d+', '', clean_kw)
    clean_kw = re.sub(r'\d+\s*(?:ke andar|se kam|se jyada|se upar|below|above)', '', clean_kw)
    clean_kw = re.sub(r'[^\w\s]', ' ', clean_kw)
    keywords_list = [w for w in clean_kw.split() if len(w) > 2 and w not in ["the", "for", "and", "with", "show", "give", "need", "want", "find", "best", "good", "cheap"]]

    parsed = ParsedNLPIntent(
        original_query=query,
        detected_category=detected_category,
        detected_brand=detected_brand,
        detected_color=detected_color,
        detected_keywords=keywords_list,
        min_price=min_price,
        max_price=max_price,
        intent_type="product_search"
    )

    return parsed, corrected_q
