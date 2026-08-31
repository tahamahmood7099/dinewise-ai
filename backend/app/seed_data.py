import json
from sqlalchemy.orm import Session
from .models import User, Product, Category, Interaction, Order, OrderItem, RecommendationFeedback, SearchLog
from .utils.security import get_password_hash

CATEGORIES_DATA = [
    {
        "name": "Ethnic & Fashion",
        "slug": "fashion",
        "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        "description": "Premium Indian ethnic wear, sarees, kurtas, and modern apparel"
    },
    {
        "name": "Electronics & Audio",
        "slug": "electronics",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        "description": "Smartphones, wireless earbuds, smartwatches, and soundbars"
    },
    {
        "name": "Footwear",
        "slug": "footwear",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        "description": "Sports shoes, ethnic juttis, formal shoes, and sneakers"
    },
    {
        "name": "Indian Delicacies & Sweets",
        "slug": "food",
        "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
        "description": "Authentic Biryani, Gulab Jamun, Rasgulla, and regional delights"
    },
    {
        "name": "Groceries & Spices",
        "slug": "groceries",
        "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
        "description": "Pure desi ghee, organic spices, basmati rice, and Ayurvedic teas"
    },
    {
        "name": "Beauty & Ayurveda",
        "slug": "beauty",
        "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
        "description": "Herbal skincare, Ayurvedic oils, saffron serums, and grooming"
    },
    {
        "name": "Home & Kitchen",
        "slug": "home-living",
        "image": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
        "description": "Brass cookware, Rajasthani bedsheets, diyas, and appliances"
    },
    {
        "name": "Watches & Accessories",
        "slug": "accessories",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        "description": "Titan watches, leather wallets, sunglasses, and jewelry"
    }
]

PRODUCTS_DATA = [
    # Fashion & Ethnic Wear
    {
        "name": "Manyavar Royal Silk Blend Embroidered Kurta Set",
        "description": "Handcrafted royal silk blend kurta pyjama set with subtle mandarin collar zari embroidery. Perfect for Diwali, Eid, and Indian wedding celebrations.",
        "category": "Ethnic & Fashion",
        "brand": "Manyavar",
        "price": 2999.0,
        "original_price": 4999.0,
        "discount": 40,
        "rating": 4.8,
        "review_count": 342,
        "image": "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
        "additional_images": json.dumps([
            "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80"
        ]),
        "tags": "kurta, ethnic, festive, manyavar, wedding, diwali, eid, traditional, mens kurta",
        "colors": "Maroon, Cream, Royal Blue",
        "stock": 45,
        "features": json.dumps(["Pure Silk Blend Fabric", "Mandarin Collar with Zari Work", "Dry Clean Recommended", "Comfortable Regular Fit"])
    },
    {
        "name": "FabIndia Handwoven Banarasi Silk Zari Saree",
        "description": "Authentic Varanasi woven Banarasi pure silk saree with heavy gold zari pallu and intricate floral motifs. Includes unstitched blouse piece.",
        "category": "Ethnic & Fashion",
        "brand": "FabIndia",
        "price": 5499.0,
        "original_price": 8999.0,
        "discount": 39,
        "rating": 4.9,
        "review_count": 512,
        "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        "additional_images": json.dumps([]),
        "tags": "saree, banarasi, silk saree, wedding wear, festive, fabindia, traditional, gold zari",
        "colors": "Crimson Red, Royal Emerald, Mustard Gold",
        "stock": 25,
        "features": json.dumps(["100% Pure Banarasi Silk", "6.3m length with Blouse Piece", "Rich Gold Zari Border", "Handloom Certified"])
    },
    {
        "name": "Raymond Tailored Fit Formal Linen Cotton Shirt",
        "description": "Breathable 100% natural linen cotton blend formal shirt designed for tropical Indian climates. Crisp styling for office and conferences.",
        "category": "Ethnic & Fashion",
        "brand": "Raymond",
        "price": 1799.0,
        "original_price": 2799.0,
        "discount": 35,
        "rating": 4.6,
        "review_count": 210,
        "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
        "tags": "shirt, formal shirt, raymond, linen shirt, office wear, white shirt",
        "colors": "Sky Blue, Classic White, Light Pink",
        "stock": 60,
        "features": json.dumps(["100% Breathable Linen Cotton", "Slim Tailored Fit", "Machine Washable", "Wrinkle Resistant"])
    },
    {
        "name": "Biba Printed Anarkali Kurti with Dupatta",
        "description": "Elegant cotton flared Anarkali suit set with Gotta Patti work along neckline and hemline, paired with matching Chanderi dupatta.",
        "category": "Ethnic & Fashion",
        "brand": "Biba",
        "price": 2499.0,
        "original_price": 4199.0,
        "discount": 40,
        "rating": 4.7,
        "review_count": 189,
        "image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        "tags": "anarkali, kurti, biba, ethnic suit, dupatta, womens wear, floral print",
        "colors": "Indigo Blue, Pastel Peach, Mint Green",
        "stock": 35,
        "features": json.dumps(["100% Fine Cotton", "Includes 2.5m Dupatta", "Gotta Patti Detailing", "Calf Length Flare"])
    },

    # Electronics & Audio
    {
        "name": "boAt Airdopes 441 Pro True Wireless Earbuds",
        "description": "Experience boAt signature sound with 150 hours total playback time, ASAP fast charging, IWP instant pairing, and IPX7 sweat resistance.",
        "category": "Electronics & Audio",
        "brand": "boAt",
        "price": 1899.0,
        "original_price": 5990.0,
        "discount": 68,
        "rating": 4.6,
        "review_count": 1240,
        "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
        "tags": "earbuds, wireless, bluetooth, boat, airdopes, audio, bass, gym earphones",
        "colors": "Raging Black, Spirit Lime, Active Blue",
        "stock": 100,
        "features": json.dumps(["Up to 150 Hours Playtime Case", "IPX7 Water & Sweat Resistant", "ENx Noise Cancellation Tech", "Type-C Fast Charging"])
    },
    {
        "name": "Noise ColorFit Pro 4 Max 1.80 AMOLED Smartwatch",
        "description": "Advanced Bluetooth calling smartwatch with vibrant AMOLED display, 100+ Indian sports modes, SpO2 blood oxygen monitor, and 7-day battery life.",
        "category": "Electronics & Audio",
        "brand": "Noise",
        "price": 2799.0,
        "original_price": 5999.0,
        "discount": 53,
        "rating": 4.5,
        "review_count": 890,
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
        "tags": "smartwatch, noise, fitness tracker, bluetooth calling, amoled, heart rate",
        "colors": "Jet Black, Deep Wine, Silver Grey",
        "stock": 80,
        "features": json.dumps(["1.80-inch AMOLED Display", "Single-Chip Bluetooth Calling", "24x7 Heart Rate & SpO2", "Noise Health Suite Integration"])
    },
    {
        "name": "OnePlus Nord Buds 2 with Active Noise Cancellation",
        "description": "12.4mm dynamic bass drivers, 25dB Active Noise Cancellation, Dolby Atmos support, and BassWave bass enhancement algorithm.",
        "category": "Electronics & Audio",
        "brand": "OnePlus",
        "price": 2499.0,
        "original_price": 3299.0,
        "discount": 24,
        "rating": 4.7,
        "review_count": 720,
        "image": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
        "tags": "oneplus, earbuds, anc, active noise cancellation, dolby atmos, wireless audio",
        "colors": "Thunder Gray, Lightning White",
        "stock": 65,
        "features": json.dumps(["25dB Active Noise Cancellation", "12.4mm Titanium Drivers", "36 Hours Total Battery", "Fast Pairing OxygenOS"])
    },
    {
        "name": "Mi 20000mAh 18W Fast Charging Power Bank 3i",
        "description": "High-density lithium polymer battery with triple port output, dual input micro-USB and Type-C, and advanced 12-layer circuit protection.",
        "category": "Electronics & Audio",
        "brand": "Xiaomi",
        "price": 1699.0,
        "original_price": 2199.0,
        "discount": 22,
        "rating": 4.6,
        "review_count": 2300,
        "image": "https://images.unsplash.com/photo-1609592424368-24204856f6e5?auto=format&fit=crop&w=800&q=80",
        "tags": "powerbank, xiaomi, fast charging, 20000mah, travel, phone charger",
        "colors": "Midnight Black, Sandstone Blue",
        "stock": 120,
        "features": json.dumps(["20000mAh Capacity", "18W Two-Way Fast Charge", "Triple USB Output Ports", "Smart Power Management"])
    },

    # Footwear
    {
        "name": "Red Tape Men's Breathable Mesh Running Shoes",
        "description": "Ultra-lightweight high-cushion EVA foam sole running sneaker designed for Indian morning jogs, gym workouts, and all-day walking.",
        "category": "Footwear",
        "brand": "Red Tape",
        "price": 1499.0,
        "original_price": 4999.0,
        "discount": 70,
        "rating": 4.5,
        "review_count": 950,
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "tags": "running shoes, red tape, sports shoes, sneakers, black shoes, gym shoes, lightweight",
        "colors": "Black & Red, Grey & White, Navy Blue",
        "stock": 75,
        "features": json.dumps(["Memory Foam Insole", "Breathable Mesh Upper", "Shock-Absorbing EVA Sole", "Slip-Resistant Grip"])
    },
    {
        "name": "Bata Royal Mojari Leather Ethnic Juttis",
        "description": "Handcrafted genuine leather Mojari Jutti with intricate thread work. Traditional footwear that matches sherwanis, kurtas, and festive outfits.",
        "category": "Footwear",
        "brand": "Bata",
        "price": 1299.0,
        "original_price": 2199.0,
        "discount": 40,
        "rating": 4.4,
        "review_count": 310,
        "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
        "tags": "jutti, mojari, ethnic shoes, bata, wedding shoes, traditional footwear",
        "colors": "Tan Brown, Classic Black, Maroon",
        "stock": 40,
        "features": json.dumps(["100% Genuine Leather", "Padded Cushion Footbed", "Handcrafted Embroidery", "Durable Rubber Outsole"])
    },
    {
        "name": "Woodland Rugged Oiled Nubuck Leather Outdoor Shoes",
        "description": "Durable all-terrain outdoor trekking and casual shoe with deeply grooved rubber sole for tough Indian terrain and monsoon conditions.",
        "category": "Footwear",
        "brand": "Woodland",
        "price": 3899.0,
        "original_price": 5495.0,
        "discount": 29,
        "rating": 4.8,
        "review_count": 640,
        "image": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
        "tags": "woodland, trekking shoes, leather shoes, boots, outdoor, rugged",
        "colors": "Khaki Camel, Dark Brown, Olive",
        "stock": 35,
        "features": json.dumps(["Oiled Nubuck Leather", "Anti-Skid Deep Lug Rubber Sole", "Water-Resistant Coating", "Reinforced Heel"])
    },

    # Indian Delicacies & Sweets (Food)
    {
        "name": "Authentic Hyderabadi Dum Mutton Biryani Feast Pack (1kg)",
        "description": "Slow-cooked authentic Kachchi Dum Biryani with tender marinated mutton pieces, aged aromatic long-grain Daawat Basmati rice, saffron, and desi ghee. Includes Mirchi ka Salan and Raita.",
        "category": "Indian Delicacies & Sweets",
        "brand": "Paradise Kitchens",
        "price": 649.0,
        "original_price": 850.0,
        "discount": 23,
        "rating": 4.9,
        "review_count": 1420,
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        "tags": "biryani, hyderabadi biryani, mutton biryani, dum biryani, paradise, food, feast",
        "colors": "Standard",
        "stock": 50,
        "features": json.dumps(["Traditional Slow Dum Cooked", "Pure Desi Ghee & Saffron", "Includes Mirchi Salan & Raita", "Serves 3-4 Adults"])
    },
    {
        "name": "Haldiram's Desi Ghee Gulab Jamun Tin (1kg)",
        "description": "Soft and melt-in-mouth soft mawa Gulab Jamuns soaked in rose and cardamom infused sugar syrup, made with 100% pure desi cow ghee.",
        "category": "Indian Delicacies & Sweets",
        "brand": "Haldiram's",
        "price": 320.0,
        "original_price": 400.0,
        "discount": 20,
        "rating": 4.8,
        "review_count": 870,
        "image": "https://images.unsplash.com/photo-1667994464166-508535a39626?auto=format&fit=crop&w=800&q=80",
        "tags": "gulab jamun, sweets, haldirams, indian sweets, mithai, desi ghee, festive",
        "colors": "Golden Brown",
        "stock": 100,
        "features": json.dumps(["Made with Pure Desi Ghee", "No Added Artificial Preservatives", "Sealed 1kg Fresh Pack", "Rose & Cardamom Flavored"])
    },
    {
        "name": "Bikaji Kaju Katli Premium Royal Sweet Box (500g)",
        "description": "Rich diamond-shaped cashew fudge made with premium selected Goan cashews and edible pure silver leaf (vark). An Indian festival favorite.",
        "category": "Indian Delicacies & Sweets",
        "brand": "Bikaji",
        "price": 599.0,
        "original_price": 799.0,
        "discount": 25,
        "rating": 4.7,
        "review_count": 460,
        "image": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
        "tags": "kaju katli, sweets, mithai, bikaji, cashews, diwali sweets, gift box",
        "colors": "Silver White",
        "stock": 80,
        "features": json.dumps(["100% Premium Goan Cashews", "Pure Silver Vark", "Hygienically Vacuum Packed", "Rich Melt-in-Mouth Texture"])
    },

    # Groceries & Spices
    {
        "name": "Amul Pure Cow Desi Ghee Bilona Method (1 Litre)",
        "description": "Traditional granular aromatic cow ghee produced from fresh sweet cream of grass-fed cows. Enriched with natural vitamins A & D.",
        "category": "Groceries & Spices",
        "brand": "Amul",
        "price": 640.0,
        "original_price": 720.0,
        "discount": 11,
        "rating": 4.9,
        "review_count": 3100,
        "image": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
        "tags": "ghee, amul, desi ghee, cow ghee, cooking oil, organic, pure ghee",
        "colors": "Golden Yellow",
        "stock": 150,
        "features": json.dumps(["Pure Cow Milk Fat", "Traditional Danedar Texture", "Rich in Natural Antioxidants", "Agmark Special Grade"])
    },
    {
        "name": "Everest Royal Garam Masala & Biryani Spice Combo (Pack of 3)",
        "description": "Master blend of 13 hand-selected whole spices including green cardamom, clove, cinnamon, star anise, and mace for rich royal Indian aroma.",
        "category": "Groceries & Spices",
        "brand": "Everest",
        "price": 285.0,
        "original_price": 350.0,
        "discount": 18,
        "rating": 4.7,
        "review_count": 1200,
        "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
        "tags": "spices, masala, everest, garam masala, biryani masala, indian cooking, organic",
        "colors": "Rich Brown",
        "stock": 110,
        "features": json.dumps(["Cryogenic Grinding Technology", "13 Whole Aromatic Spices", "No Artificial Colors", "Preserves Natural Essential Oils"])
    },
    {
        "name": "Tata Tea Gold Assam Orthodox Leaf & CTC Tea (1kg)",
        "description": "Exquisite blend of strong CTC tea grains and gently rolled aromatic Assam long orthodox leaves for unmatched flavor and golden hue.",
        "category": "Groceries & Spices",
        "brand": "Tata Tea",
        "price": 490.0,
        "original_price": 575.0,
        "discount": 15,
        "rating": 4.8,
        "review_count": 1850,
        "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
        "tags": "chai, tea, tata tea, assam tea, masala chai, morning beverage",
        "colors": "Golden Amber",
        "stock": 130,
        "features": json.dumps(["15% Long Orthodox Leaves", "85% Rich Assam CTC", "Rich Amber Color", "Vacuum Sealed Foil Pack"])
    },

    # Beauty & Ayurveda
    {
        "name": "Forest Essentials Ayurvedic Kumkumadi Night Serum (30ml)",
        "description": "Miraculous Ayurvedic night beauty fluid crafted with pure Kashmiri Saffron, 26 potent herbs, and cold-pressed sweet almond oil for radiant skin.",
        "category": "Beauty & Ayurveda",
        "brand": "Forest Essentials",
        "price": 2895.0,
        "original_price": 3495.0,
        "discount": 17,
        "rating": 4.9,
        "review_count": 620,
        "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        "tags": "kumkumadi, serum, saffron, forest essentials, ayurveda, night serum, glow skincare",
        "colors": "Golden Saffron",
        "stock": 45,
        "features": json.dumps(["Pure Kashmiri Saffron Infusion", "Reduces Dark Spots & Pigmentation", "100% Ayurvedic Formulation", "Non-Greasy Rapid Absorption"])
    },
    {
        "name": "Bombay Shaving Company Charcoal Beard Grooming Kit",
        "description": "Complete 4-in-1 mens grooming combo with Activated Bamboo Charcoal face wash, beard growth oil, cedarwood beard wash, and shea butter wax.",
        "category": "Beauty & Ayurveda",
        "brand": "Bombay Shaving Co",
        "price": 1199.0,
        "original_price": 1999.0,
        "discount": 40,
        "rating": 4.6,
        "review_count": 480,
        "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
        "tags": "grooming, beard kit, charcoal, bombay shaving company, men skincare, beard oil",
        "colors": "Matte Black",
        "stock": 60,
        "features": json.dumps(["Enriched with Activated Charcoal", "Natural Cedarwood Essential Oil", "Sulphate & Paraben Free", "Includes Wooden Beard Comb"])
    },

    # Home & Kitchen
    {
        "name": "Prestige Deluxe Alpha Stainless Steel Pressure Cooker (5 Litre)",
        "description": "Heavy-gauge stainless steel gas and induction compatible pressure cooker with unique Alpha base for even heat distribution and controlled Gasket Release System.",
        "category": "Home & Kitchen",
        "brand": "Prestige",
        "price": 2299.0,
        "original_price": 3195.0,
        "discount": 28,
        "rating": 4.7,
        "review_count": 1400,
        "image": "https://images.unsplash.com/photo-1584990347449-389f417f7b1a?auto=format&fit=crop&w=800&q=80",
        "tags": "pressure cooker, prestige, kitchen, cookware, steel cooker, induction",
        "colors": "Polished Silver",
        "stock": 55,
        "features": json.dumps(["Alpha Base for Induction & Gas", "Durable 304 Grade Stainless Steel", "Controlled GRS Safety Valve", "5-Year Manufacturer Warranty"])
    },
    {
        "name": "Pure Handcrafted Brass Peacock Diya Urli Set",
        "description": "Artisan engraved solid brass Urli bowl with floating diya lamps and majestic peacock figurine. Authentic traditional decor for Diwali and festive homes.",
        "category": "Home & Kitchen",
        "brand": "Pooja Crafts",
        "price": 1699.0,
        "original_price": 2800.0,
        "discount": 39,
        "rating": 4.8,
        "review_count": 290,
        "image": "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80",
        "tags": "brass urli, diya, diwali decor, puja, brassware, indian home, peacock diya",
        "colors": "Antique Brass Gold",
        "stock": 30,
        "features": json.dumps(["100% Solid Heavy Brass", "Handcrafted by Moradabad Artisans", "Rust-Proof Lacquer Finish", "Dimensions: 12 inch diameter"])
    },

    # Watches & Accessories
    {
        "name": "Titan Neo Analog Blue Dial Men's Quartz Watch",
        "description": "Classic contemporary timepiece featuring sunray textured navy dial, rose gold indices, genuine stitched brown leather strap, and 50m water resistance.",
        "category": "Watches & Accessories",
        "brand": "Titan",
        "price": 3495.0,
        "original_price": 4995.0,
        "discount": 30,
        "rating": 4.8,
        "review_count": 910,
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        "tags": "watch, titan watch, leather watch, analog, mens watch, accessories, blue dial",
        "colors": "Rose Gold & Navy Blue, Silver & Black",
        "stock": 40,
        "features": json.dumps(["Mineral Glass Crystal", "Genuine Padded Leather Strap", "50m Water Resistance (5 ATM)", "2-Year International Warranty"])
    },
    {
        "name": "Hidesign Handcrafted Genuine Vegetable Tanned Leather Wallet",
        "description": "Sleek bifold pocket wallet made from top-grain vegetable tanned ranch leather with RFID protection shield, 8 card slots, and currency compartments.",
        "category": "Watches & Accessories",
        "brand": "Hidesign",
        "price": 1895.0,
        "original_price": 2695.0,
        "discount": 30,
        "rating": 4.7,
        "review_count": 420,
        "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
        "tags": "wallet, hidesign, leather wallet, rfid, mens accessories, brown wallet",
        "colors": "Cognac Brown, Classic Black",
        "stock": 60,
        "features": json.dumps(["100% Top-Grain Vegetable Tanned Leather", "Built-in RFID Theft Blocking", "8 Card Slots + ID Window", "Signature Hidesign Logo Emboss"])
    }
]

USERS_DATA = [
    {
        "name": "Aarav Sharma",
        "email": "aarav.sharma@example.in",
        "password": "password123",
        "role": "user",
        "city": "Bengaluru",
        "preferences": json.dumps({"categories": ["Electronics & Audio", "Footwear"], "budget_pref": "medium_high"})
    },
    {
        "name": "Priya Patel",
        "email": "priya.patel@example.in",
        "password": "password123",
        "role": "user",
        "city": "Ahmedabad",
        "preferences": json.dumps({"categories": ["Ethnic & Fashion", "Beauty & Ayurveda"], "budget_pref": "high"})
    },
    {
        "name": "Rohan Verma",
        "email": "rohan.verma@example.in",
        "password": "password123",
        "role": "user",
        "city": "Delhi NCR",
        "preferences": json.dumps({"categories": ["Electronics & Audio", "Watches & Accessories"], "budget_pref": "medium"})
    },
    {
        "name": "Ananya Mukherjee",
        "email": "ananya.m@example.in",
        "password": "password123",
        "role": "user",
        "city": "Kolkata",
        "preferences": json.dumps({"categories": ["Ethnic & Fashion", "Indian Delicacies & Sweets"], "budget_pref": "medium"})
    },
    {
        "name": "Admin Nadeem",
        "email": "admin@bharatkart.in",
        "password": "adminpassword",
        "role": "admin",
        "city": "Hyderabad",
        "preferences": json.dumps({"categories": ["Indian Delicacies & Sweets", "Electronics & Audio"], "budget_pref": "high"})
    }
]

def seed_database(db: Session):
    # 1. Seed Categories if empty
    if db.query(Category).count() == 0:
        for cat in CATEGORIES_DATA:
            category_obj = Category(**cat)
            db.add(category_obj)
        db.commit()
        print("Categories seeded successfully.")

    # 2. Seed Products if empty
    if db.query(Product).count() == 0:
        for p in PRODUCTS_DATA:
            product_obj = Product(**p)
            db.add(product_obj)
        db.commit()
        print("Products seeded successfully.")

    # 3. Seed Users if empty
    if db.query(User).count() == 0:
        for u in USERS_DATA:
            hashed_pwd = get_password_hash(u["password"])
            user_obj = User(
                name=u["name"],
                email=u["email"],
                password_hash=hashed_pwd,
                role=u["role"],
                city=u["city"],
                preferences=u["preferences"]
            )
            db.add(user_obj)
        db.commit()
        print("Users seeded successfully.")

    # 4. Seed Interactions for Collaborative Filtering & Analytics
    if db.query(Interaction).count() == 0:
        products = db.query(Product).all()
        users = db.query(User).all()
        
        if products and users:
            # Synthetic realistic interactions with weights
            interaction_patterns = [
                # Aarav (Electronics & Footwear fan)
                (users[0].id, 5, "view", 1.0),
                (users[0].id, 5, "cart", 7.0),
                (users[0].id, 5, "purchase", 10.0),
                (users[0].id, 6, "view", 1.0),
                (users[0].id, 6, "wishlist", 5.0),
                (users[0].id, 9, "view", 1.0),
                (users[0].id, 9, "cart", 7.0),
                (users[0].id, 9, "purchase", 10.0),
                (users[0].id, 10, "view", 1.0),

                # Priya (Fashion & Beauty fan)
                (users[1].id, 1, "view", 1.0),
                (users[1].id, 1, "cart", 7.0),
                (users[1].id, 2, "view", 1.0),
                (users[1].id, 2, "wishlist", 5.0),
                (users[1].id, 2, "purchase", 10.0),
                (users[1].id, 17, "view", 1.0),
                (users[1].id, 17, "cart", 7.0),
                (users[1].id, 17, "purchase", 10.0),

                # Rohan (Audio, Watches, Running Shoes)
                (users[2].id, 5, "view", 1.0),
                (users[2].id, 5, "cart", 7.0),
                (users[2].id, 7, "view", 1.0),
                (users[2].id, 7, "wishlist", 5.0),
                (users[2].id, 9, "view", 1.0),
                (users[2].id, 9, "purchase", 10.0),
                (users[2].id, 21, "view", 1.0),
                (users[2].id, 21, "cart", 7.0),

                # Ananya (Sweets, Biryani, Ethnic Suits)
                (users[3].id, 12, "view", 1.0),
                (users[3].id, 12, "purchase", 10.0),
                (users[3].id, 13, "view", 1.0),
                (users[3].id, 13, "cart", 7.0),
                (users[3].id, 14, "view", 1.0),
                (users[3].id, 4, "view", 1.0),
                (users[3].id, 4, "wishlist", 5.0),

                # Admin/General activity
                (users[4].id, 12, "view", 1.0),
                (users[4].id, 12, "cart", 7.0),
                (users[4].id, 12, "purchase", 10.0),
                (users[4].id, 6, "view", 1.0),
                (users[4].id, 6, "purchase", 10.0),
            ]

            for u_id, p_idx, itype, wt in interaction_patterns:
                # clamp product id safely
                actual_p = products[min(p_idx - 1, len(products) - 1)]
                inter = Interaction(
                    user_id=u_id,
                    product_id=actual_p.id,
                    interaction_type=itype,
                    weight=wt,
                    metadata_info=json.dumps({"source": "seed_data"})
                )
                db.add(inter)
            
            db.commit()
            print("Initial interactions seeded successfully.")

    # 5. Seed Initial Orders
    if db.query(Order).count() == 0:
        users = db.query(User).all()
        products = db.query(Product).all()
        if users and len(products) >= 12:
            sample_order1 = Order(
                order_number="BK-IND-984321",
                user_id=users[0].id,
                total_amount=3398.0,
                discount_amount=400.0,
                payment_method="UPI",
                payment_status="Completed",
                order_status="Delivered",
                shipping_name=users[0].name,
                shipping_phone="9876543210",
                shipping_address="Flat 402, Green Glen Layout, Bellandur",
                shipping_city="Bengaluru",
                shipping_state="Karnataka",
                shipping_pincode="560103"
            )
            db.add(sample_order1)
            db.commit()

            item1 = OrderItem(
                order_id=sample_order1.id,
                product_id=products[4].id, # boAt
                product_name=products[4].name,
                price=products[4].price,
                quantity=1,
                image=products[4].image
            )
            item2 = OrderItem(
                order_id=sample_order1.id,
                product_id=products[8].id, # Red tape shoes
                product_name=products[8].name,
                price=products[8].price,
                quantity=1,
                image=products[8].image
            )
            db.add(item1)
            db.add(item2)

            sample_order2 = Order(
                order_number="BK-IND-765432",
                user_id=users[1].id,
                total_amount=8394.0,
                discount_amount=800.0,
                payment_method="UPI",
                payment_status="Completed",
                order_status="Shipped",
                shipping_name=users[1].name,
                shipping_phone="9823456789",
                shipping_address="B-12, Satellite Heights, SG Highway",
                shipping_city="Ahmedabad",
                shipping_state="Gujarat",
                shipping_pincode="380015"
            )
            db.add(sample_order2)
            db.commit()

            item3 = OrderItem(
                order_id=sample_order2.id,
                product_id=products[1].id, # Banarasi Saree
                product_name=products[1].name,
                price=products[1].price,
                quantity=1,
                image=products[1].image
            )
            item4 = OrderItem(
                order_id=sample_order2.id,
                product_id=products[16].id, # Kumkumadi Serum
                product_name=products[16].name,
                price=products[16].price,
                quantity=1,
                image=products[16].image
            )
            db.add(item3)
            db.add(item4)
            db.commit()
            print("Initial sample orders seeded.")

    # 6. Seed Search Logs for Zero-result and NLP Analytics
    if db.query(SearchLog).count() == 0:
        sample_searches = [
            ("black shoes under 2000", json.dumps({"category": "Footwear", "color": "black", "max_price": 2000}), 4),
            ("hyderabadi biryani", json.dumps({"category": "Indian Delicacies & Sweets", "keyword": "biryani"}), 1),
            ("kurta for diwali under 3000", json.dumps({"category": "Ethnic & Fashion", "max_price": 3000}), 3),
            ("noise smartwatch", json.dumps({"brand": "Noise"}), 1),
            ("wireless noise cancelling headphones", json.dumps({"category": "Electronics & Audio"}), 2),
            ("pure banarasi silk saree", json.dumps({"category": "Ethnic & Fashion"}), 1),
            ("ps5 gaming console", json.dumps({"keyword": "ps5"}), 0), # Zero-result search example!
            ("drone with 4k camera", json.dumps({"keyword": "drone"}), 0), # Zero-result search example!
            ("apple macbook m3 pro", json.dumps({"keyword": "macbook"}), 0), # Zero-result search example!
        ]
        for q, parsed, count in sample_searches:
            slog = SearchLog(query=q, parsed_intent=parsed, result_count=count)
            db.add(slog)
        db.commit()
        print("Sample search logs seeded.")
