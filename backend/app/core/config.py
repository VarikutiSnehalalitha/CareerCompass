import os
import json
from typing import List

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "CareerCompass")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "careercompass_production_secret_key_2026_super_secure")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./careercompass.db")
    SQLITE_FALLBACK_URL: str = os.getenv("SQLITE_FALLBACK_URL", "sqlite:///./careercompass.db")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "")
    
    # AI Settings
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "builtin") # builtin, gemini, openai
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "gemini-1.5-pro")
    
    # S3
    S3_ENDPOINT_URL: str = os.getenv("S3_ENDPOINT_URL", "")
    S3_ACCESS_KEY: str = os.getenv("S3_ACCESS_KEY", "")
    S3_SECRET_KEY: str = os.getenv("S3_SECRET_KEY", "")
    S3_BUCKET_NAME: str = os.getenv("S3_BUCKET_NAME", "careercompass-docs")
    
    # CORS
    @property
    def CORS_ORIGINS(self) -> List[str]:
        raw = os.getenv("CORS_ORIGINS", '["http://localhost:3000","http://127.0.0.1:3000","http://localhost:3001"]')
        try:
            return json.loads(raw)
        except Exception:
            return ["*"]

settings = Settings()
