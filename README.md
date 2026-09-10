# DineWise AI — AI-Based Restaurant Recommendation & Customer Behavior Analysis System
**Final Year B.E. CSE Major Project • Osmania University / NSAKCET (Autonomous)**

**Live Public Demo:**
* **Frontend:** [https://dinewise-ai.vercel.app](https://dinewise-ai.vercel.app/)
* **Backend API & Swagger:** [https://dinewise-ai.onrender.com/docs](https://dinewise-ai.onrender.com/docs)
* **GitHub Repository:** [https://github.com/tahamahmood7099/dinewise-ai.git](https://github.com/tahamahmood7099/dinewise-ai.git)

---

## 👥 Project Team Members
1. **Nadeem** — B.E. Computer Science and Engineering
2. **Kamran** — B.E. Computer Science and Engineering
3. **Abdul Bari** — B.E. Computer Science and Engineering

*Department of Computer Science and Engineering*  
*Nawab Shah Alam Khan College of Engineering & Technology (Autonomous), Malakpet, Hyderabad*  
*Affiliated to Osmania University, Hyderabad (2026–2027)*

---

## 🍽️ Project Overview
**DineWise AI** is an intelligent restaurant recommendation and customer behavior intelligence system designed specifically for the diverse urban dining ecosystem of Hyderabad. 

Traditional platforms rely primarily on static popularity rankings, sponsored bids, and distance filters. DineWise AI introduces a personalized, transparent, and explainable recommendation engine combining:
1. **Content-Based Filtering (TF-IDF + Cosine Similarity):** Matches restaurant culinary attributes, specialty dishes, dining tags, and price categories with individual user taste profiles.
2. **Collaborative Filtering (Implicit Interaction Matrix):** Extracts latent community dining patterns across weighted user interactions (views, favorites, ratings, and recommendation feedback).
3. **Hybrid Recommendation Engine ($\alpha=0.6, \beta=0.4$):** Linearly fuses Content-Based (60%) and Collaborative (40%) scores to eliminate cold-start bottlenecks while maximizing discovery diversity.
4. **Explainable AI (XAI):** Provides interactive factor score breakdowns (Cuisine, Zone, Price, and Dietary match) to explain why each venue is recommended.
5. **Natural Language Query Parser:** Extracts multi-faceted constraints (cuisine, dining zone, budget ceiling, veg-only status) from unstructured freeform text with typo tolerance.
6. **Customer Behavioral Clustering:** Segment users into distinct dining personas (Biryani Enthusiast, Vegetarian Explorer, Premium Diner, Budget Explorer).
7. **Offline Model Evaluation Benchmarks:** Benchmarks algorithms on Precision@5 (0.600), Recall@5 (0.875), and NDCG@5 (0.873).

---

## 🚀 Quick Start Guide

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### 1. Launch with One Click (Windows)
Double-click `start_project.bat` in the project root directory.

### 2. Manual Startup

**Backend (FastAPI):**
```bash
cd backend
pip install -r requirements.txt
python run.py
```
*Backend runs on `http://127.0.0.1:8000` (Interactive API docs at `http://127.0.0.1:8000/docs`)*

**Frontend (Next.js):**
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📂 Academic Documentation Package
The `documentation_package/` directory contains complete academic deliverables formatted to university specifications:
* `DineWise_AI_Major_Project_Abstract_Synopsis.pdf`
* `DineWise_AI_Research_Base_Paper.pdf` (33-section IEEE format with 10 genuine citations)
* `DineWise_AI_Final_Presentation_Slides.pdf` (13-slide landscape presentation deck)
* `DineWise_AI_Complete_Major_Project_Report.pdf` (Full SRS, UML, ER, and Architecture report)
