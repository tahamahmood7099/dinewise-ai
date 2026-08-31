import os

class Settings:
    PROJECT_NAME: str = "DineWise AI - AI-Based Restaurant Recommendation & Customer Behavior Analysis System"
    API_V1_STR: str = "/api"
    
    _raw_db_url = os.environ.get("DATABASE_URL", "sqlite:///./dinewise.db")
    if _raw_db_url.startswith("postgres://"):
        _raw_db_url = _raw_db_url.replace("postgres://", "postgresql://", 1)
    DATABASE_URL: str = _raw_db_url
    
    PORT: int = int(os.environ.get("PORT", 8000))
    JWT_SECRET: str = os.environ.get("JWT_SECRET", "dinewise_ai_secret_key_2026_cse_major_project")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Recommendation Weights (Configurable α + β = 1)
    ALPHA_CONTENT_WEIGHT: float = float(os.environ.get("ALPHA_CONTENT_WEIGHT", 0.6))
    BETA_COLLAB_WEIGHT: float = float(os.environ.get("BETA_COLLAB_WEIGHT", 0.4))
    
    # Restaurant Behavior Telemetry Weights
    WEIGHT_VIEW: float = 1.0
    WEIGHT_CLICK: float = 2.0
    WEIGHT_SEARCH: float = 3.0
    WEIGHT_RECOMMENDATION_CLICK: float = 4.0
    WEIGHT_FAVORITE: float = 6.0
    WEIGHT_RATING: float = 8.0
    WEIGHT_FEEDBACK_POSITIVE: float = 5.0
    WEIGHT_FEEDBACK_NEGATIVE: float = -8.0

settings = Settings()
