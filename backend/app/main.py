from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .seed_data import seed_database
from .routers import (
    restaurants,
    recommendations,
    search,
    interactions,
    assistant,
    admin,
    auth
)

# Initialize database schema and seed data
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    print("Database seeding notice:", e)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Restaurant Recommendation & Customer Behavior Analysis System for Hyderabad & India",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(restaurants.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)
app.include_router(interactions.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "online",
        "docs": "/docs",
        "region": "Hyderabad, Telangana, India"
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "2.0.0",
        "recommendation_engine": "Hybrid (0.6 * Content + 0.4 * Collaborative)",
        "region": "Hyderabad, Telangana, India"
    }
