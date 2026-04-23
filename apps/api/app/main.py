# apps/api/app/main.py
"""
Evijnar API - Global Health Arbitrage Exchange
Main ASGI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.middleware import HIPAALoggingMiddleware, EncryptionHeaderMiddleware
from app.db import init_db, close_db
from app.routers import (
    auth,
    hospitals,
    pricing,
    bookings,
    recovery,
    patients,
    financing,
    health,
    admin,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for startup/shutdown"""
    # Startup
    print(f"🚀 Starting Evijnar API v{settings.app_version}")
    await init_db()
    print("✅ Database initialized")
    yield
    # Shutdown
    await close_db()
    print("🛑 Shutting down Evijnar API")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Decentralized global healthcare access platform",
    lifespan=lifespan,
)

# ============================================================================
# SECURITY MIDDLEWARE
# ============================================================================

# Trusted Host - prevent HTTP Host header attacks
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*.evijnar.io", "localhost", "127.0.0.1"],
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom HIPAA Logging Middleware (must be after CORS)
app.add_middleware(HIPAALoggingMiddleware)

# Encryption header middleware
app.add_middleware(EncryptionHeaderMiddleware)

# ============================================================================
# ROUTES
# ============================================================================

# Health check
app.include_router(health.router, tags=["Health"])

# Authentication
app.include_router(
    auth.router, prefix=f"/api/{settings.api_version}/auth", tags=["Auth"])

# Admin endpoints
app.include_router(admin.router, tags=["Admin"])

# Patients & Medical Records (Protected)
app.include_router(
    patients.router, prefix=f"/api/{settings.api_version}/patients", tags=["Patients"])

# Hospitals & Search
app.include_router(
    hospitals.router, prefix=f"/api/{settings.api_version}/hospitals", tags=["Hospitals"])

# Pricing & Procedures
app.include_router(
    pricing.router, prefix=f"/api/{settings.api_version}/pricing", tags=["Pricing"])

# Bookings & Reservations
app.include_router(
    bookings.router, prefix=f"/api/{settings.api_version}/bookings", tags=["Bookings"])

# Recovery Bridge (IoMT Monitoring)
app.include_router(
    recovery.router, prefix=f"/api/{settings.api_version}/recovery", tags=["Recovery Bridge"])

# Rural Financing (UPI & Health-EMI)
app.include_router(
    financing.router, prefix=f"/api/{settings.api_version}/financing", tags=["Financing"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "status": "online",
        "service": "Evijnar API",
        "version": settings.app_version,
        "docs": "/docs",
    }
