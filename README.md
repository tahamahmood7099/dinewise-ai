# BharatBite AI — AI-Based Food Recommendation & Customer Behavior Intelligence System
**Final Year CSE Major Project • Osmania University / NSAKCET**

BharatBite AI is an authentic, India-first, Hyderabad-focused food discovery and recommendation intelligence platform powered by hybrid machine learning.

---

## 🍽️ Key Highlights & Indian Food Context
* **Hyderabad-Centric & Pan-Indian Delicacies:**
  * Authentic Hyderabadi Mutton & Chicken Dum Biryanis (Paradise, Shah Ghouse, Bawarchi)
  * GI-Tagged Royal Mutton Haleem (Pista House)
  * Fiery Andhra Chicken 65
  * Middle-Eastern Charcoal Grilled Chicken Shawarma Rolls
  * Pure-Veg Ghee Babai Butter Dosa & Steamed Button Idlis (Chutneys)
  * Historic Charminar Irani Dum Chai & Osmania Biscuits (Nimrah Cafe & Bakery)
  * Royal Qubani Ka Meetha with Fresh Cream, Double Ka Meetha & Desi Ghee Gulab Jamun (Dadu's Mithai Vatika)
  * Murgh Makhani Butter Chicken, Paneer Butter Masala & Garlic Naans (Punjabi Grill)
  * Artisanal Sourdough Cheese Burst Pizzas & Smash Burgers (Slice & Crust)
* **Indian Currency (₹ INR) & Hyderabad Logistics:** Pricing, cart totals, delivery fees (₹30 / FREE over ₹400), platform fees (₹5), and Indian addresses with PIN codes.
* **Simulated Indian Checkout:** UPI (GPay / PhonePe / Paytm / BHIM) and Cash on Delivery simulation.

---

## 🤖 AI / ML Architecture & Recommendation Engines

1. **Content-Based Filtering (TF-IDF + Cosine Similarity):**
   * Computes semantic cosine similarity over dish textual signals: cuisine, category, ingredients, spice level, and veg/non-veg status.
2. **Collaborative Filtering (User-Dish Interaction Matrix):**
   * Weights user behavior telemetry: `View` = 1.0, `Click` = 2.0, `Search` = 3.0, `Favorite` = 5.0, `Cart` = 7.0, `Order` = 10.0, `Like` = +8.0, `Dislike` = -10.0.
   * Computes User-User taste similarity and Item-Item co-occurrence (for complementary pairings like Biryani + Mirchi Salan/Gulab Jamun).
3. **Hybrid Recommendation Engine:**
   * Formula: $$\text{Hybrid Score}(u, d) = \alpha \cdot \text{Content}(u, d) + \beta \cdot \text{Collab}(u, d)$$ with configured weights ($\alpha = 0.6, \beta = 0.4$).
   * Features diversity penalties to prevent category repetition and negative feedback down-weighting.
4. **Explainable AI (XAI):**
   * Every single recommendation attaches a data-grounded rationale (e.g., *"Personalized for you: Matches your frequent craving for Biryani & loved by foodies with similar taste"*).
5. **Food NLP & Typo-Tolerant Search Parser:**
   * Extracts constraints: Category, Cuisine, Spice preference ('Mild', 'Medium', 'Spicy', 'Extra Spicy'), Veg/Non-Veg, and Budget Caps from English and Hinglish queries (e.g., *"biryani under 300"*, *"200 ke andar biryani"*, *"spicy chicken"*, *"biriyani"* $\rightarrow$ *"biryani"*).
6. **AI Food Concierge:**
   * Floating shopping assistant grounded in the food database.
7. **Food Customer Behavioral Segmentation:**
   * Segments: `Biryani Lovers`, `Budget Foodies`, `Premium Diners`, `Dessert Lovers`, `Healthy Food Seekers`, and `Explorer / Variety Seekers`.
8. **Recommendation Model Evaluation Benchmarks:**
   * Evaluates `Popularity Baseline`, `Content-Based`, `Collaborative Filtering`, and `Hybrid Engine` using **Precision@K**, **Recall@K**, **F1-Score**, and **NDCG@K**.

---

## 🚀 Quick Start Guide

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### 1. Launch with One Click
Double-click `start_project.bat` in the project root directory.

### 2. Manual Startup
**Backend (FastAPI):**
```bash
cd backend
python run.py
```
*Backend runs on `http://127.0.0.1:8000` (Interactive API docs at `http://127.0.0.1:8000/docs`)*

**Frontend (Next.js):**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 👥 Demo Foodie Personas for Presentation
Switch personas instantly from the Navbar user menu:
1. **Aarav Sharma** (`aarav.sharma@example.in` / `password123`): High affinity for Biryani & Spicy Non-Veg.
2. **Priya Patel** (`priya.patel@example.in` / `password123`): High affinity for Pure Veg, Ghee Dosas & Sweets.
3. **Ananya Mukherjee** (`ananya.m@example.in` / `password123`): High affinity for Mutton Haleem & Qubani Ka Meetha.
4. **Admin Nadeem** (`admin@bharatbite.in` / `adminpassword`): Full access to Admin BI Telemetry & Model Evaluation.
