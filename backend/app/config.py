import os

class Settings:
    PROJECT_NAME: str = "BharatKart AI - Intelligent Recommendation Engine"
    API_V1_STR: str = "/api"
    
    # Read DATABASE_URL with Render/PostgreSQL/SQLite compatibility
    _raw_db_url = os.environ.get("DATABASE_URL", "sqlite:///./bharatkart.db")
    if _raw_db_url.startswith("postgres://"):
        _raw_db_url = _raw_db_url.replace("postgres://", "postgresql://", 1)
    DATABASE_URL: str = _raw_db_url
    
    PORT: int = int(os.environ.get("PORT", 8000))
    JWT_SECRET: str = os.environ.get("JWT_SECRET", "bharatkart_secret_key_2026_cse_major_project")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Recommendation Weights (Configurable)
    ALPHA_CONTENT_WEIGHT: float = float(os.environ.get("ALPHA_CONTENT_WEIGHT", 0.6))
    BETA_COLLAB_WEIGHT: float = float(os.environ.get("BETA_COLLAB_WEIGHT", 0.4))
    
    # Interaction Weights
    WEIGHT_VIEW: float = 1.0
    WEIGHT_CLICK: float = 2.0
    WEIGHT_SEARCH: float = 3.0
    WEIGHT_WISHLIST: float = 5.0
    WEIGHT_CART: float = 7.0
    WEIGHT_PURCHASE: float = 10.0
    WEIGHT_FEEDBACK_POSITIVE: float = 8.0
    WEIGHT_FEEDBACK_NEGATIVE: float = -10.0

settings = Settings()
