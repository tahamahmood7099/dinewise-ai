import json
from .database import SessionLocal, engine, Base
from .models import User, Restaurant, CuisineCategory, Interaction, Favorite, Rating
from .utils.security import get_password_hash
from .config import settings

CUISINE_CATEGORIES = [
    {
        "name": "Biryani",
        "slug": "biryani",
        "description": "Authentic Hyderabadi slow dum-cooked aromatic rice delicacies",
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
    },
    {
        "name": "Mughlai",
        "slug": "mughlai",
        "description": "Royal Nizami curries, slow-simmered Haleem, and succulent tandoor kebabs",
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
    },
    {
        "name": "South Indian",
        "slug": "south-indian",
        "description": "Crispy desi ghee dosas, fluffy button idlis, and traditional chutneys",
        "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"
    },
    {
        "name": "North Indian",
        "slug": "north-indian",
        "description": "Rich creamy butter chicken, paneer gravies, and hot butter garlic naans",
        "image": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80"
    },
    {
        "name": "Chinese",
        "slug": "chinese",
        "description": "Fiery Indo-Chinese schezwan noodles, dim sums, and manchurian gravies",
        "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80"
    },
    {
        "name": "Italian & Pizza",
        "slug": "italian-pizza",
        "description": "Woodfired sourdough pizzas, creamy truffle pastas, and artisanal gelato",
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
    },
    {
        "name": "Cafe & Bistro",
        "slug": "cafe-bistro",
        "description": "Aesthetic specialty coffee, continental breakfasts, and relaxing vibes",
        "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80"
    },
    {
        "name": "Bakery & Desserts",
        "slug": "bakery-desserts",
        "description": "Iconic Osmania biscuits, Irani Chai, Qubani Ka Meetha, and pastries",
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
    },
    {
        "name": "Street Food",
        "slug": "street-food",
        "description": "Spicy chicken 65, shawarma rolls, mirchi bajji, and chaat platters",
        "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80"
    },
    {
        "name": "Healthy Food",
        "slug": "healthy-food",
        "description": "Nutritious grain bowls, high-protein keto meals, and fresh cold-pressed juices",
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
    }
]

RESTAURANTS_DATA = [
    {
        "id": 1,
        "name": "Paradise Heritage Biryani",
        "description": "Legendary culinary destination founded in 1953, globally famous for slow dum-cooked long-grain Basmati mutton and chicken biryanis served with mirchi ka salan.",
        "cuisine": "Biryani",
        "cuisines_list": ["Biryani", "Mughlai", "North Indian"],
        "location": "MG Road, Secunderabad",
        "area": "Secunderabad",
        "city": "Hyderabad",
        "rating": 4.8,
        "review_count": 3420,
        "price_for_two": 650.0,
        "cost_category": "Moderate",
        "veg_type": "both",
        "specialty_dishes": ["Royal Mutton Dum Biryani", "Special Chicken Biryani", "Mutton Seekh Kebab", "Double Ka Meetha"],
        "opening_status": "Open Now (11:00 AM - 11:30 PM)",
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Iconic", "Biryani", "Family Dining", "Hyderabadi Heritage"]
    },
    {
        "id": 2,
        "name": "Shah Ghouse Grand Dining",
        "description": "Beloved destination for fiery spice lovers and late-night foodies in Old City and Tolichowki, renowned for rich mutton haleem, spicy biryani, and tandoori grills.",
        "cuisine": "Biryani",
        "cuisines_list": ["Biryani", "Mughlai", "Street Food"],
        "location": "Near Tolichowki Flyover, Tolichowki",
        "area": "Tolichowki",
        "city": "Hyderabad",
        "rating": 4.7,
        "review_count": 2890,
        "price_for_two": 550.0,
        "cost_category": "Budget Friendly",
        "veg_type": "both",
        "specialty_dishes": ["Special Spicy Chicken Biryani", "Shahi Mutton Haleem", "Tangdi Kebab", "Boti Kebab"],
        "opening_status": "Open Now (12:00 PM - 01:00 AM)",
        "image": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Spicy", "Late Night", "Crowd Favorite", "Budget Friendly"]
    },
    {
        "id": 3,
        "name": "Pista House Royale",
        "description": "GI-tagged world ambassador of authentic Hyderabadi Mutton Haleem, premium dry fruit sweets, and grilled Middle-Eastern chicken shawarma.",
        "cuisine": "Mughlai",
        "cuisines_list": ["Mughlai", "Bakery & Desserts", "Street Food"],
        "location": "Old Mumbai Highway, Gachibowli",
        "area": "Gachibowli",
        "city": "Hyderabad",
        "rating": 4.9,
        "review_count": 4120,
        "price_for_two": 600.0,
        "cost_category": "Moderate",
        "veg_type": "both",
        "specialty_dishes": ["GI-Tagged Royal Mutton Haleem", "Grilled Chicken Shawarma", "Qubani Ka Meetha", "Baklava"],
        "opening_status": "Open Now (11:00 AM - 12:00 AM)",
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Award Winning", "Haleem", "Desserts", "Shawarma"]
    },
    {
        "id": 4,
        "name": "Chutneys Vegetarian Haven",
        "description": "Pioneering pure vegetarian culinary institution famed for serving crispy Ghee Babai Dosas, button idlis, and steaming South Indian filter coffee with 6 distinct signature chutneys.",
        "cuisine": "South Indian",
        "cuisines_list": ["South Indian", "Healthy Food"],
        "location": "Road No 3, Banjara Hills",
        "area": "Banjara Hills",
        "city": "Hyderabad",
        "rating": 4.7,
        "review_count": 2150,
        "price_for_two": 450.0,
        "cost_category": "Budget Friendly",
        "veg_type": "veg",
        "specialty_dishes": ["Ghee Babai Butter Dosa", "Steamed Button Idli (with 6 Chutneys)", "MLA Pesarattu", "Filter Coffee"],
        "opening_status": "Open Now (07:00 AM - 11:00 PM)",
        "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Pure Veg", "South Indian", "Breakfast", "Family Friendly"]
    },
    {
        "id": 5,
        "name": "Nimrah Heritage Cafe & Bakery",
        "description": "Historic landmark directly facing the monumental Charminar arches, celebrated for authentic Irani Dum Chai, fresh hot Osmania Biscuits, and tie biscuits since 1993.",
        "cuisine": "Bakery & Desserts",
        "cuisines_list": ["Bakery & Desserts", "Cafe & Bistro", "Street Food"],
        "location": "Beside Mecca Masjid, Charminar",
        "area": "Charminar",
        "city": "Hyderabad",
        "rating": 4.9,
        "review_count": 5200,
        "price_for_two": 180.0,
        "cost_category": "Budget Friendly",
        "veg_type": "veg",
        "specialty_dishes": ["Irani Dum Chai", "Osmania Biscuits", "Chand Biscuits", "Khari Puff"],
        "opening_status": "Open Now (04:00 AM - 11:30 PM)",
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Historic", "Irani Chai", "Budget Friendly", "Charminar View"]
    },
    {
        "id": 6,
        "name": "Little Italy Ristorante",
        "description": "Upscale fine-dining Italian bistro crafting authentic woodfired sourdough pizzas, creamy wild mushroom risotto, and classic tiramisu in an elegant ambiance.",
        "cuisine": "Italian & Pizza",
        "cuisines_list": ["Italian & Pizza", "Cafe & Bistro"],
        "location": "Road No 36, Jubilee Hills",
        "area": "Jubilee Hills",
        "city": "Hyderabad",
        "rating": 4.8,
        "review_count": 1840,
        "price_for_two": 1400.0,
        "cost_category": "Premium / Fine Dining",
        "veg_type": "veg",
        "specialty_dishes": ["Truffle Sourdough Pizza", "Pasta Al Forno", "Risotto Funghi", "Classic Tiramisu"],
        "opening_status": "Open Now (12:00 PM - 11:00 PM)",
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Fine Dining", "Romantic", "Italian", "Gourmet Pizza"]
    },
    {
        "id": 7,
        "name": "Bawarchi Iconic Restaurant",
        "description": "The quintessential Hyderabad RTC X Roads destination for extra spicy, flavor-packed Chicken Biryani, fiery Andhra Chicken 65, and Boti kebabs.",
        "cuisine": "Biryani",
        "cuisines_list": ["Biryani", "Street Food", "North Indian"],
        "location": "RTC X Roads, Himayatnagar",
        "area": "Kukatpally",
        "city": "Hyderabad",
        "rating": 4.6,
        "review_count": 3100,
        "price_for_two": 500.0,
        "cost_category": "Budget Friendly",
        "veg_type": "both",
        "specialty_dishes": ["Bawarchi Special Chicken Biryani", "Fiery Andhra Chicken 65", "Mutton Boti Kebab"],
        "opening_status": "Open Now (11:30 AM - 11:30 PM)",
        "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Fiery Spice", "Biryani Lovers", "Budget Friendly"]
    },
    {
        "id": 8,
        "name": "The Roastery Coffee House",
        "description": "Tranquil colonial-style bungalow cafe in Banjara Hills, famous for artisanal single-origin brews, fresh cheesecakes, and sourdough brunch.",
        "cuisine": "Cafe & Bistro",
        "cuisines_list": ["Cafe & Bistro", "Bakery & Desserts", "Healthy Food"],
        "location": "Road No 14, Banjara Hills",
        "area": "Banjara Hills",
        "city": "Hyderabad",
        "rating": 4.9,
        "review_count": 2400,
        "price_for_two": 900.0,
        "cost_category": "Moderate",
        "veg_type": "both",
        "specialty_dishes": ["Cascara Cold Brew", "Avocado Sourdough Toast", "Belgian Waffles", "Baked Cheesecake"],
        "opening_status": "Open Now (08:00 AM - 11:00 PM)",
        "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Specialty Coffee", "Aesthetic", "Work Friendly", "Brunch"]
    },
    {
        "id": 9,
        "name": "Mamagoto Pan-Asian Bistro",
        "description": "Vibrant and chic Asian eatery in Madhapur serving sizzling wok-tossed noodles, handcrafted dim sums, Thai curries, and crispy chili garlic prawns.",
        "cuisine": "Chinese",
        "cuisines_list": ["Chinese", "Street Food"],
        "location": "Cyber Pearl, Madhapur",
        "area": "Madhapur",
        "city": "Hyderabad",
        "rating": 4.7,
        "review_count": 1650,
        "price_for_two": 1100.0,
        "cost_category": "Moderate",
        "veg_type": "both",
        "specialty_dishes": ["Crispy Chili Garlic Dimsums", "Spicy Schezwan Ramen", "Thai Green Curry", "Chili Basil Fish"],
        "opening_status": "Open Now (12:00 PM - 11:00 PM)",
        "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Pan Asian", "Dimsums", "Tech Park Hotspot", "Chic"]
    },
    {
        "id": 10,
        "name": "Dadu's Mithai Vatika & Sweets",
        "description": "Royal Hyderabadi sweet house and pure vegetarian thali center, renowned for authentic Qubani Ka Meetha with cream, Double Ka Meetha, and Kaju Katli.",
        "cuisine": "Bakery & Desserts",
        "cuisines_list": ["Bakery & Desserts", "South Indian", "North Indian"],
        "location": "Himayatnagar Main Road",
        "area": "Hitech City",
        "city": "Hyderabad",
        "rating": 4.8,
        "review_count": 2750,
        "price_for_two": 400.0,
        "cost_category": "Budget Friendly",
        "veg_type": "veg",
        "specialty_dishes": ["Qubani Ka Meetha with Fresh Cream", "Shahi Double Ka Meetha", "Desi Ghee Gulab Jamun", "Rasmalai"],
        "opening_status": "Open Now (09:00 AM - 10:30 PM)",
        "image": "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Sweets & Desserts", "Pure Veg", "Royal Heritage", "Festive"]
    },
    {
        "id": 11,
        "name": "Punjabi Grill Dhaba & Curries",
        "description": "Hearty North Indian restaurant in Hitech City celebrated for velvety Murgh Makhani Butter Chicken, rich Dal Makhani, and soft tandoori rotis.",
        "cuisine": "North Indian",
        "cuisines_list": ["North Indian", "Mughlai"],
        "location": "Mindspace Tech Park, Hitech City",
        "area": "Hitech City",
        "city": "Hyderabad",
        "rating": 4.6,
        "review_count": 1920,
        "price_for_two": 750.0,
        "cost_category": "Moderate",
        "veg_type": "both",
        "specialty_dishes": ["Murgh Makhani Butter Chicken", "Dal Makhani 24-Hr Simmered", "Paneer Tikka Lababdar", "Garlic Naan"],
        "opening_status": "Open Now (12:00 PM - 11:30 PM)",
        "image": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["North Indian", "Butter Chicken", "Corporate Favorite", "Family Dining"]
    },
    {
        "id": 12,
        "name": "FitGreen Organic & Bowls",
        "description": "Contemporary wellness eatery in Jubilee Hills curating cold-pressed juices, protein keto grain bowls, fresh Greek salads, and avocado toasts.",
        "cuisine": "Healthy Food",
        "cuisines_list": ["Healthy Food", "Cafe & Bistro"],
        "location": "Road No 45, Jubilee Hills",
        "area": "Jubilee Hills",
        "city": "Hyderabad",
        "rating": 4.7,
        "review_count": 1210,
        "price_for_two": 850.0,
        "cost_category": "Moderate",
        "veg_type": "both",
        "specialty_dishes": ["Avocado Quinoa Salad Bowl", "Smoked Chicken Protein Platter", "Cold-Pressed Beet Juice", "Chia Seed Pudding"],
        "opening_status": "Open Now (08:00 AM - 10:00 PM)",
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
        "food_gallery": [
            "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80"
        ],
        "tags": ["Health & Fitness", "Organic", "Keto & Vegan", "Clean Eating"]
    }
]

USERS_SEED_DATA = [
    {
        "id": 1,
        "name": "Aarav Sharma",
        "email": "aarav.sharma@example.in",
        "password": "password123",
        "role": "user",
        "city": "Hyderabad",
        "dietary_pref": "Non-Veg",
        "preferred_budget": "Moderate",
        "preferred_cuisines": ["Biryani", "Mughlai", "Street Food"],
        "preferred_areas": ["Secunderabad", "Tolichowki", "Charminar"]
    },
    {
        "id": 2,
        "name": "Priya Patel",
        "email": "priya.patel@example.in",
        "password": "password123",
        "role": "user",
        "city": "Hyderabad",
        "dietary_pref": "Pure Veg",
        "preferred_budget": "Budget Friendly",
        "preferred_cuisines": ["South Indian", "Bakery & Desserts", "Healthy Food"],
        "preferred_areas": ["Banjara Hills", "Charminar"]
    },
    {
        "id": 3,
        "name": "Rohan Verma",
        "email": "rohan.verma@example.in",
        "password": "password123",
        "role": "user",
        "city": "Hyderabad",
        "dietary_pref": "All",
        "preferred_budget": "Premium / Fine Dining",
        "preferred_cuisines": ["Italian & Pizza", "Cafe & Bistro", "Chinese"],
        "preferred_areas": ["Jubilee Hills", "Madhapur"]
    },
    {
        "id": 4,
        "name": "Ananya Mukherjee",
        "email": "ananya.m@example.in",
        "password": "password123",
        "role": "user",
        "city": "Hyderabad",
        "dietary_pref": "Non-Veg",
        "preferred_budget": "Budget Friendly",
        "preferred_cuisines": ["Mughlai", "Street Food", "Bakery & Desserts"],
        "preferred_areas": ["Gachibowli", "Charminar"]
    },
    {
        "id": 5,
        "name": "Admin Nadeem",
        "email": "admin@dinewise.in",
        "password": "adminpassword",
        "role": "admin",
        "city": "Hyderabad",
        "dietary_pref": "All",
        "preferred_budget": "Moderate",
        "preferred_cuisines": ["Biryani", "Mughlai", "South Indian", "Italian & Pizza"],
        "preferred_areas": ["Banjara Hills", "Jubilee Hills", "Secunderabad"]
    }
]

INTERACTIONS_SEED_DATA = [
    # Aarav Sharma interactions (Biryani & Mughlai focus)
    {"user_id": 1, "restaurant_id": 1, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},
    {"user_id": 1, "restaurant_id": 1, "interaction_type": "favorite", "weight": settings.WEIGHT_FAVORITE},
    {"user_id": 1, "restaurant_id": 1, "interaction_type": "rating", "weight": settings.WEIGHT_RATING},
    {"user_id": 1, "restaurant_id": 2, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},
    {"user_id": 1, "restaurant_id": 2, "interaction_type": "favorite", "weight": settings.WEIGHT_FAVORITE},
    {"user_id": 1, "restaurant_id": 7, "interaction_type": "click", "weight": settings.WEIGHT_CLICK},
    {"user_id": 1, "restaurant_id": 3, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},

    # Priya Patel interactions (Pure Veg & South Indian focus)
    {"user_id": 2, "restaurant_id": 4, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},
    {"user_id": 2, "restaurant_id": 4, "interaction_type": "favorite", "weight": settings.WEIGHT_FAVORITE},
    {"user_id": 2, "restaurant_id": 4, "interaction_type": "rating", "weight": settings.WEIGHT_RATING},
    {"user_id": 2, "restaurant_id": 5, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},
    {"user_id": 2, "restaurant_id": 10, "interaction_type": "favorite", "weight": settings.WEIGHT_FAVORITE},
    {"user_id": 2, "restaurant_id": 12, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},

    # Rohan Verma interactions (Fine Dining, Italian & Cafe focus)
    {"user_id": 3, "restaurant_id": 6, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},
    {"user_id": 3, "restaurant_id": 6, "interaction_type": "favorite", "weight": settings.WEIGHT_FAVORITE},
    {"user_id": 3, "restaurant_id": 8, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},
    {"user_id": 3, "restaurant_id": 8, "interaction_type": "rating", "weight": settings.WEIGHT_RATING},
    {"user_id": 3, "restaurant_id": 9, "interaction_type": "click", "weight": settings.WEIGHT_CLICK},

    # Ananya Mukherjee interactions (Haleem, Sweets & Street food)
    {"user_id": 4, "restaurant_id": 3, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},
    {"user_id": 4, "restaurant_id": 3, "interaction_type": "favorite", "weight": settings.WEIGHT_FAVORITE},
    {"user_id": 4, "restaurant_id": 5, "interaction_type": "rating", "weight": settings.WEIGHT_RATING},
    {"user_id": 4, "restaurant_id": 10, "interaction_type": "view", "weight": settings.WEIGHT_VIEW},
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if restaurants already seeded
        if db.query(Restaurant).count() == 0:
            print("Seeding DineWise AI Cuisine Categories...")
            for cat in CUISINE_CATEGORIES:
                db.add(CuisineCategory(**cat))
            db.commit()

            print("Seeding DineWise AI Restaurants Dataset...")
            for r_data in RESTAURANTS_DATA:
                r_obj = Restaurant(
                    id=r_data["id"],
                    name=r_data["name"],
                    description=r_data["description"],
                    cuisine=r_data["cuisine"],
                    cuisines_list=json.dumps(r_data["cuisines_list"]),
                    location=r_data["location"],
                    area=r_data["area"],
                    city=r_data["city"],
                    rating=r_data["rating"],
                    review_count=r_data["review_count"],
                    price_for_two=r_data["price_for_two"],
                    cost_category=r_data["cost_category"],
                    veg_type=r_data["veg_type"],
                    specialty_dishes=json.dumps(r_data["specialty_dishes"]),
                    opening_status=r_data["opening_status"],
                    image=r_data["image"],
                    food_gallery=json.dumps(r_data["food_gallery"]),
                    tags=json.dumps(r_data["tags"])
                )
                db.add(r_obj)
            db.commit()

            print("Seeding DineWise AI Personas & Users...")
            for u in USERS_SEED_DATA:
                user_obj = User(
                    id=u["id"],
                    name=u["name"],
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    role=u["role"],
                    city=u["city"],
                    dietary_pref=u["dietary_pref"],
                    preferred_budget=u["preferred_budget"],
                    preferred_cuisines=json.dumps(u["preferred_cuisines"]),
                    preferred_areas=json.dumps(u["preferred_areas"])
                )
                db.add(user_obj)
            db.commit()

            print("Seeding DineWise AI Interaction Telemetry...")
            for inter in INTERACTIONS_SEED_DATA:
                db.add(Interaction(**inter))
            db.commit()

            # Seed initial favorites for personas
            db.add(Favorite(user_id=1, restaurant_id=1))
            db.add(Favorite(user_id=1, restaurant_id=2))
            db.add(Favorite(user_id=2, restaurant_id=4))
            db.add(Favorite(user_id=2, restaurant_id=10))
            db.add(Favorite(user_id=3, restaurant_id=6))
            db.add(Favorite(user_id=4, restaurant_id=3))

            # Seed initial ratings
            db.add(Rating(user_id=1, restaurant_id=1, rating_score=5.0, review_text="Unmatched mutton dum biryani flavor in Hyderabad!"))
            db.add(Rating(user_id=2, restaurant_id=4, rating_score=5.0, review_text="Crispy Ghee Babai Dosa is heavenly with the 6 chutneys."))
            db.add(Rating(user_id=3, restaurant_id=6, rating_score=4.8, review_text="Finest woodfired truffle pizza and ambiance in Jubilee Hills."))
            db.commit()

            print("DineWise AI Database seeded successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
