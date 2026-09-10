// Centralized Server Data & Engine for DineWise AI
export const CUISINE_CATEGORIES = [
  {
    id: 1,
    name: "Biryani",
    slug: "biryani",
    description: "Authentic Hyderabadi slow dum-cooked aromatic rice delicacies",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Mughlai",
    slug: "mughlai",
    description: "Royal Nizami curries, slow-simmered Haleem, and succulent tandoor kebabs",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "South Indian",
    slug: "south-indian",
    description: "Crispy desi ghee dosas, fluffy button idlis, and traditional chutneys",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "North Indian",
    slug: "north-indian",
    description: "Rich creamy butter chicken, paneer gravies, and hot butter garlic naans",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Chinese",
    slug: "chinese",
    description: "Fiery Indo-Chinese schezwan noodles, dim sums, and manchurian gravies",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Italian & Pizza",
    slug: "italian-pizza",
    description: "Woodfired sourdough pizzas, creamy truffle pastas, and artisanal gelato",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    name: "Cafe & Bistro",
    slug: "cafe-bistro",
    description: "Aesthetic specialty coffee, continental breakfasts, and relaxing vibes",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    name: "Bakery & Desserts",
    slug: "bakery-desserts",
    description: "Iconic Osmania biscuits, Irani Chai, Qubani Ka Meetha, and pastries",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    name: "Street Food",
    slug: "street-food",
    description: "Spicy chicken 65, shawarma rolls, mirchi bajji, and chaat platters",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 10,
    name: "Healthy Food",
    slug: "healthy-food",
    description: "Nutritious grain bowls, high-protein keto meals, and fresh cold-pressed juices",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
  }
];

export const RESTAURANTS = [
  {
    id: 1,
    name: "Paradise Heritage Biryani",
    description: "Legendary culinary destination founded in 1953, globally famous for slow dum-cooked long-grain Basmati mutton and chicken biryanis served with mirchi ka salan.",
    cuisine: "Biryani",
    cuisines_list: ["Biryani", "Mughlai", "North Indian"],
    location: "MG Road, Secunderabad",
    area: "Secunderabad",
    city: "Hyderabad",
    rating: 4.8,
    review_count: 3420,
    price_for_two: 650.0,
    cost_category: "Moderate",
    veg_type: "both",
    specialty_dishes: ["Royal Mutton Dum Biryani", "Special Chicken Biryani", "Mutton Seekh Kebab", "Double Ka Meetha"],
    opening_status: "Open Now (11:00 AM - 11:30 PM)",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Iconic", "Biryani", "Family Dining", "Hyderabadi Heritage"]
  },
  {
    id: 2,
    name: "Shah Ghouse Grand Dining",
    description: "Beloved destination for fiery spice lovers and late-night foodies in Old City and Tolichowki, renowned for rich mutton haleem, spicy biryani, and tandoori grills.",
    cuisine: "Biryani",
    cuisines_list: ["Biryani", "Mughlai", "Street Food"],
    location: "Tolichowki Main Road, Hyderabad",
    area: "Tolichowki",
    city: "Hyderabad",
    rating: 4.7,
    review_count: 2850,
    price_for_two: 500.0,
    cost_category: "Budget Friendly",
    veg_type: "both",
    specialty_dishes: ["Special Mutton Haleem", "Fiery Chicken 65", "Shah Ghouse Special Biryani", "Tangdi Kebab"],
    opening_status: "Open Now (12:00 PM - 01:30 AM)",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Late Night", "Spicy", "Haleem", "Biryani Special"]
  },
  {
    id: 3,
    name: "Bawarchi Iconic Restaurant",
    description: "The gold standard of Hyderabadi Dum Biryani near RTC X Roads. Slow-cooked in copper degs with saffron and rich Nizami spices.",
    cuisine: "Biryani",
    cuisines_list: ["Biryani", "North Indian", "Mughlai"],
    location: "RTC X Roads, Himayatnagar",
    area: "Kukatpally",
    city: "Hyderabad",
    rating: 4.9,
    review_count: 4890,
    price_for_two: 550.0,
    cost_category: "Budget Friendly",
    veg_type: "both",
    specialty_dishes: ["Bawarchi Mutton Dum Biryani", "Chicken Boti Kebab", "Paneer Butter Masala", "Rumali Roti"],
    opening_status: "Open Now (11:30 AM - 11:00 PM)",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Authentic Dum", "Crowd Favorite", "Iconic RTC X Roads"]
  },
  {
    id: 4,
    name: "Chutneys Vegetarian Haven",
    description: "Famous upscale pure vegetarian restaurant celebrated for its signature 6 varieties of handcrafted house chutneys and crispy Guntur Idlis.",
    cuisine: "South Indian",
    cuisines_list: ["South Indian", "North Indian", "Healthy Food"],
    location: "Road No. 3, Banjara Hills",
    area: "Banjara Hills",
    city: "Hyderabad",
    rating: 4.6,
    review_count: 1980,
    price_for_two: 600.0,
    cost_category: "Moderate",
    veg_type: "pure_veg",
    specialty_dishes: ["Guntur Steamed Idli", "Babai Ghee Dosa", "MLA Pesarattu", "Filter Coffee"],
    opening_status: "Open Now (07:00 AM - 10:30 PM)",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Pure Veg", "South Indian Breakfast", "Ghee Dosa", "Banjara Hills"]
  },
  {
    id: 5,
    name: "Pista House Royale",
    description: "World-renowned GI-certified Hyderabadi Haleem and royal Zafrani Biryani specialist, with artisanal baked Osmania cookies and sweet treats.",
    cuisine: "Mughlai",
    cuisines_list: ["Mughlai", "Biryani", "Bakery & Desserts"],
    location: "Charminar Heritage Plaza",
    area: "Charminar",
    city: "Hyderabad",
    rating: 4.8,
    review_count: 3120,
    price_for_two: 500.0,
    cost_category: "Budget Friendly",
    veg_type: "both",
    specialty_dishes: ["GI Certified Mutton Haleem", "Zafrani Mutton Biryani", "Baklava", "Badam Milk"],
    opening_status: "Open Now (11:00 AM - 12:00 AM)",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["GI Haleem", "Charminar Legend", "Mughlai Delights"]
  },
  {
    id: 6,
    name: "Little Italy Ristorante",
    description: "Premium fine-dining gourmet vegetarian Italian bistro serving stone-baked woodfired pizzas, al dente handmade pasta, and decadent tiramisu.",
    cuisine: "Italian & Pizza",
    cuisines_list: ["Italian & Pizza", "Healthy Food"],
    location: "Road No. 36, Jubilee Hills",
    area: "Jubilee Hills",
    city: "Hyderabad",
    rating: 4.7,
    review_count: 1450,
    price_for_two: 1400.0,
    cost_category: "Premium / Fine Dining",
    veg_type: "pure_veg",
    specialty_dishes: ["Pizza Sicilia Woodfired", "Pasta Barbaresca", "Gnocchi alla Sorrentina", "Classic Tiramisu"],
    opening_status: "Open Now (12:00 PM - 11:00 PM)",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Fine Dining", "Pure Veg Italian", "Romantic Ambiance", "Jubilee Hills"]
  },
  {
    id: 7,
    name: "The Roastery Coffee House",
    description: "Serene heritage bungalow cafe serving artisanal pour-overs, cold brews, and continental cafe platters in lush open-air greenery.",
    cuisine: "Cafe & Bistro",
    cuisines_list: ["Cafe & Bistro", "Italian & Pizza", "Healthy Food"],
    location: "Road No. 14, Banjara Hills",
    area: "Banjara Hills",
    city: "Hyderabad",
    rating: 4.8,
    review_count: 2240,
    price_for_two: 900.0,
    cost_category: "Moderate",
    veg_type: "both",
    specialty_dishes: ["Cascara Specialty Brew", "Grilled Peri Peri Chicken", "Onion Rings Platter", "Cheesecake"],
    opening_status: "Open Now (08:00 AM - 11:00 PM)",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Aesthetic Cafe", "Specialty Coffee", "Outdoor Seating", "Work Friendly"]
  },
  {
    id: 8,
    name: "Nimrah Heritage Cafe & Bakery",
    description: "Historic tea stall and bakery overlooking the magnificent arches of Charminar. The cultural heartbeat of Hyderabad's Irani Chai tradition.",
    cuisine: "Bakery & Desserts",
    cuisines_list: ["Bakery & Desserts", "Street Food", "Cafe & Bistro"],
    location: "Beside Mecca Masjid, Charminar",
    area: "Charminar",
    city: "Hyderabad",
    rating: 4.9,
    review_count: 5120,
    price_for_two: 150.0,
    cost_category: "Budget Friendly",
    veg_type: "pure_veg",
    specialty_dishes: ["Special Irani Chai", "Warm Osmania Biscuits", "Chand Biscuits", "Cream Rolls"],
    opening_status: "Open Now (04:00 AM - 11:30 PM)",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Historic Irani Chai", "Charminar Landmark", "Osmania Biscuits", "Pocket Friendly"]
  },
  {
    id: 9,
    name: "Mamagoto Pan-Asian Bistro",
    description: "Vibrant Asian cafe serving mouthwatering dumplings, wok bowls, Thai curries, and sushi platters in an electric Tokyo pop-art setting.",
    cuisine: "Chinese",
    cuisines_list: ["Chinese", "Healthy Food"],
    location: "Cyber City Cyber Towers Road, Madhapur",
    area: "Madhapur",
    city: "Hyderabad",
    rating: 4.7,
    review_count: 1670,
    price_for_two: 1200.0,
    cost_category: "Premium / Fine Dining",
    veg_type: "both",
    specialty_dishes: ["Street Style Spicy Dumplings", "Soggy Thai Basil Fried Rice", "Khao Suey", "Crispy Lotus Stem"],
    opening_status: "Open Now (12:30 PM - 11:30 PM)",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Pan-Asian", "Sushi & Dim Sum", "Cocktails & Dining", "Hitech Vibes"]
  },
  {
    id: 10,
    name: "Dadu's Mithai Vatika & Sweets",
    description: "Iconic royal Indian confectionery and vegetarian restaurant specializing in Kaju Katli, Motichoor Ladoos, and North Indian chaats.",
    cuisine: "Bakery & Desserts",
    cuisines_list: ["Bakery & Desserts", "North Indian", "Street Food"],
    location: "Mindspace Road, Hitech City",
    area: "Hitech City",
    city: "Hyderabad",
    rating: 4.8,
    review_count: 2410,
    price_for_two: 450.0,
    cost_category: "Budget Friendly",
    veg_type: "pure_veg",
    specialty_dishes: ["Special Raj Kachori", "Desi Ghee Jalebi with Rabdi", "Kaju Pista Roll", "Dahi Puri"],
    opening_status: "Open Now (09:00 AM - 10:30 PM)",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Pure Veg Sweets", "Chaat Paradise", "Desi Ghee Delicacies"]
  },
  {
    id: 11,
    name: "Cafe Bahar Heritage",
    description: "Iconic Hyderabadi restaurant known for its robust Mutton Biryani, rich spicy curries, and traditional Nizami hospitality since decades.",
    cuisine: "Biryani",
    cuisines_list: ["Biryani", "Mughlai", "North Indian"],
    location: "Old MLA Quarters Rd, Hyderguda",
    area: "Tolichowki",
    city: "Hyderabad",
    rating: 4.6,
    review_count: 2780,
    price_for_two: 500.0,
    cost_category: "Budget Friendly",
    veg_type: "both",
    specialty_dishes: ["Special Mutton Biryani", "Chicken 65 Gravy", "Tandoori Roti", "Kubani Ka Meetha"],
    opening_status: "Open Now (11:00 AM - 11:30 PM)",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Heritage Biryani", "Hyderguda Legend", "Spicy Nizami Flavors"]
  },
  {
    id: 12,
    name: "Terrassen Cafe - Plant Based Haven",
    description: "Cozy artisanal plant-based cafe serving organic salads, sourdough sandwiches, vegan cheese pizzas, and refreshing hibiscus kombucha.",
    cuisine: "Healthy Food",
    cuisines_list: ["Healthy Food", "Cafe & Bistro", "Italian & Pizza"],
    location: "Filmnagar, Jubilee Hills",
    area: "Jubilee Hills",
    city: "Hyderabad",
    rating: 4.7,
    review_count: 980,
    price_for_two: 800.0,
    cost_category: "Moderate",
    veg_type: "pure_veg",
    specialty_dishes: ["Zucchini Noodles Bowl", "Avocado Sourdough Toast", "Raw Vegan Cheesecake", "Hibiscus Kombucha"],
    opening_status: "Open Now (11:00 AM - 10:00 PM)",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    food_gallery: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["Plant Based", "Organic & Vegan", "Healthy Bowls", "Jubilee Hills"]
  }
];

export const DEMO_USERS = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.in",
    role: "user",
    preferred_cuisines: ["Biryani", "Mughlai", "North Indian"],
    dietary_pref: "Non-Vegetarian",
    preferred_budget: "Moderate (₹500 - ₹800)",
    preferred_areas: ["Tolichowki", "Secunderabad"]
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@example.in",
    role: "user",
    preferred_cuisines: ["South Indian", "Italian & Pizza", "Bakery & Desserts"],
    dietary_pref: "Pure Vegetarian",
    preferred_budget: "Moderate (₹400 - ₹700)",
    preferred_areas: ["Banjara Hills", "Hitech City"]
  },
  {
    id: 3,
    name: "Rohan Verma",
    email: "rohan.verma@example.in",
    role: "user",
    preferred_cuisines: ["Italian & Pizza", "Cafe & Bistro", "Chinese"],
    dietary_pref: "Non-Vegetarian",
    preferred_budget: "Premium / Fine Dining (₹1000+)",
    preferred_areas: ["Jubilee Hills", "Madhapur"]
  },
  {
    id: 4,
    name: "Ananya Mukherjee",
    email: "ananya.m@example.in",
    role: "user",
    preferred_cuisines: ["Biryani", "Bakery & Desserts", "Street Food"],
    dietary_pref: "Non-Vegetarian",
    preferred_budget: "Budget Friendly (Under ₹500)",
    preferred_areas: ["Charminar", "Tolichowki"]
  },
  {
    id: 5,
    name: "Admin Nadeem",
    email: "admin@dinewise.in",
    role: "admin",
    preferred_cuisines: ["Biryani", "Mughlai"],
    dietary_pref: "Non-Vegetarian",
    preferred_budget: "Moderate",
    preferred_areas: ["All Hyderabad"]
  }
];
