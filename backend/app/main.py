"""
FastAPI Main Application Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# We use a lazy import for the predictor so FastAPI can still start
# even if the ONNX model doesn't exist yet (useful during development)
_predictor = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup/shutdown lifecycle manager.
    Pre-loads the ONNX model into memory once at startup so every
    incoming request can reuse the same inference session instantly.
    """
    global _predictor
    try:
        from app.ml.predictor import get_predictor
        _predictor = get_predictor()
        print("[LumbrScan API] ONNX model loaded and ready for inference.")
    except FileNotFoundError as e:
        print(f"[LumbrScan API] WARNING: {e}")
        print("[LumbrScan API] API will start but /scan endpoint will return errors.")
        print("[LumbrScan API] Run: python scripts/train.py && python scripts/export_onnx.py")

    yield  # API is running here

    print("[LumbrScan API] Shutting down.")


# ============================================================
# FastAPI Application
# ============================================================
app = FastAPI(
    title="LumbrScan AI Backend",
    description=(
        "Philippine Timber Species Identification, Defect Detection, "
        "and Construction Suitability Recommendation API.\n\n"
        "**Supports:** 11 target Philippine timber species | "
        "FPRDI Strength Groups I–IV | DENR DAO 2026-20 permit status."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Allow React Native app (running on any local IP) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to specific IPs in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Import & Register Routers
# ============================================================
from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.species import router as species_router
from app.api.v1.endpoints.scan import router as scan_router
from app.api.v1.endpoints.interim_species_scan import router as interim_species_scan_router
from app.api.v1.endpoints.recommend import router as recommend_router

app.include_router(health_router,   prefix="/api/v1", tags=["Health"])
app.include_router(species_router,  prefix="/api/v1", tags=["Species"])
app.include_router(scan_router,     prefix="/api/v1", tags=["Scan"])
app.include_router(interim_species_scan_router, prefix="/api/v1", tags=["Interim Research"])
app.include_router(recommend_router, prefix="/api/v1", tags=["Recommend"])


@app.get("/", include_in_schema=False)
async def root():
    return {
        "service": "LumbrScan AI Backend",
        "version": "1.0.0",
        "docs":    "/docs",
        "status":  "running",
    }
