# apps/api/app/config.py
"""
Configuration management for Evijnar API.
Follows 12-factor app principles for environment-based config.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Core application settings"""

    # Application
    app_name: str = "Evijnar API"
    app_version: str = "0.1.0"
    app_env: str = "development"

    # Server
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_version: str = "v1"
    debug: bool = True

    # Database
    database_url: str

    # Security
    secret_key: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    jwt_refresh_expiration_days: int = 7

    # Encryption
    encryption_key_patient_data: str
    encryption_key_pharma_data: str

    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]

    # External APIs
    google_maps_api_key: Optional[str] = None
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None

    # HIPAA Compliance
    hipaa_audit_log_enabled: bool = True
    hipaa_audit_webhook_url: Optional[str] = None

    # Feature Flags
    feature_recovery_bridge_enabled: bool = True
    feature_rural_financing_enabled: bool = True

    # Data Ingestion (Claude API & Caching)
    llm_provider: str = "anthropic"  # anthropic | groq
    anthropic_api_key: Optional[str] = None  # For Claude-powered data mapping
    groq_api_key: Optional[str] = None
    groq_model: str = "llama-3.1-70b-versatile"
    # Cache for LLM responses
    redis_url: Optional[str] = "redis://localhost:6379"
    ingest_batch_size: int = 100
    ingest_max_concurrent_llm: int = 5

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
