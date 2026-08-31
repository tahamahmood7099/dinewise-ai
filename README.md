# BharatKart AI — Intelligent Indian E-Commerce & Customer Behavior Intelligence System
**Final Year CSE Major Project**

BharatKart AI is a production-grade, AI-powered e-commerce recommendation and behavioral intelligence platform engineered specifically for the Indian market.

---

## 🇮🇳 Key Highlights & Indian Context
* **Indian Rupee (₹ INR) Pricing & GST:** All products, carts, discounts, and invoices are styled in Indian currency format.
* **100% Authentic Indian Categories & Products:** 
  * Ethnic & Handloom Wear (Manyavar Kurtas, FabIndia Banarasi Silk Sarees, Biba Suits)
  * Electronics & Audio (boAt Airdopes ANC, Noise Smartwatches, OnePlus Buds)
  * Footwear (Red Tape Sports Sneakers, Bata Leather Mojaris, Woodland Trekking Shoes)
  * Regional Delicacies & Indian Sweets (Authentic Hyderabadi Biryani, Haldiram's Desi Ghee Gulab Jamun, Bikaji Kaju Katli)
  * Groceries & Spices (Amul Cow Ghee, Everest Biryani Masala, Tata Tea Gold)
  * Beauty & Ayurveda (Forest Essentials Kumkumadi Saffron Serum, Bombay Shaving Charcoal Kit)
  * Home & Kitchen (Prestige Pressure Cooker, Brass Peacock Diya Urli Set)
  * Watches & Accessories (Titan Neo Watches, Hidesign Tanned Leather Wallets)
* **Indian Address & Pin Code Support:** Validated across 19,000+ PIN codes with Indian state selectors.
* **Simulated Checkout:** UPI (GPay / PhonePe / Paytm), Cash on Delivery, and RuPay Card simulations.

---

## 🤖 AI / ML Architecture & Recommendation Engines

1. **Content-Based Filtering (TF-IDF + Cosine Similarity):**
   * Vectorizes product titles, descriptions, categories, brands, colors, and feature tags using Scikit-Learn's `TfidfVectorizer`.
   * Computes pairwise semantic cosine similarity for catalog items and builds weighted user profile vectors from browsing interactions.
2. **Collaborative Filtering (User-Item Interaction Matrix):**
   * Constructs user-item interaction matrices weighted by behavior telemetry:
     * `View` = 1.0, `Click` = 2.0, `Search` = 3.0, `Wishlist` = 5.0, `Cart` = 7.0, `Purchase` = 10.0, `Like` = +8.0, `Dislike` = -10.0
   * Calculates User-User similarity and Item-Item co-occurrence matrices.
3. **Hybrid Recommendation Engine:**
   * Formula: $$\text{Hybrid Score}(u, i) = \alpha \cdot \text{Content}(u, i) + \beta \cdot \text{Collab}(u, i)$$ with configurable weights ($\alpha = 0.6, \beta = 0.4$).
   * Features diversity penalties to avoid category clustering and negative feedback suppression.
4. **Explainable AI (XAI):**
   * Every single recommendation attaches a data-grounded rationale (e.g., *"Curated for your interest in Footwear & popular among similar shoppers"*).
5. **Lightweight NLP & Typo-Tolerant Search Parser:**
   * Extracts constraints: Category, Brand, Color, Min/Max Price from natural language queries and Hinglish patterns (e.g., *"black shoes under 2000"*, *"2000 ke andar black shoes"*, *"biriyani"* $\rightarrow$ *"biryani"*).
6. **AI Shopping Assistant:**
   * Floating conversational assistant strictly grounded in the database catalog.
7. **Customer Behavioral Segmentation:**
   * Classifies shoppers into `Budget Shopper`, `Premium Buyer`, `Frequent Buyer`, and `Window Shopper` profiles.
8. **Demand Intelligence & Zero-Result Search Analytics:**
   * Flags *"High Interest, Low Conversion"* inventory and logs unmet consumer search demand.
9. **Algorithmic Evaluation Module:**
   * Evaluates and benchmarks `Popularity Baseline`, `Content-Based`, `Collaborative Filtering`, and `Hybrid Engine` using **Precision@K**, **Recall@K**, **F1-Score**, and **NDCG@K**.

---

## 🚀 Quick Start Guide

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### 1. Launch with One Click
Double click `start_project.bat` in the project root directory.

### 2. Manual Startup
**Backend (FastAPI):**
```bash
cd backend
python run.py
```
*Backend runs on `http://127.0.0.1:8000` (Swagger UI at `/docs`)*

**Frontend (Next.js):**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 👥 Demo User Personas for Evaluation & Presentation

Switch personas directly from the Navbar profile dropdown:
1. **Aarav Sharma** (`aarav.sharma@example.in` / `password123`): Tech and Footwear enthusiast.
2. **Priya Patel** (`priya.patel@example.in` / `password123`): Ethnic Fashion and Ayurvedic Beauty shopper.
3. **Ananya Mukherjee** (`ananya.m@example.in` / `password123`): Food and Indian Sweets buyer.
4. **Admin Nadeem** (`admin@bharatkart.in` / `adminpassword`): Full access to Admin BI Telemetry & Model Evaluation.
