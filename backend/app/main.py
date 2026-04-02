import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.services.recommendation import load_models
from app.routers import recommendations, movies

# ── Logging setup ────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan: load ML models once at startup ────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting up — loading ML models...")
    load_models()
    logger.info("✅ ML models loaded successfully!")
    yield
    logger.info("👋 Shutting down...")


# ── FastAPI App ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="🎬 Movie Recommendation API",
    description="Netflix-style movie recommendation engine powered by TF-IDF + Cosine Similarity",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS Middleware ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ────────────────────────────────────────────────────────
app.include_router(recommendations.router)
app.include_router(movies.router)


@app.get("/")
async def root():
    return {
        "message": "🎬 Movie Recommendation API",
        "docs": "/docs",
        "endpoints": {
            "recommendations": "/api/recommendations/{title}",
            "search": "/api/search?query={query}",
            "movie_details": "/api/movies/{title}",
            "trending": "/api/trending",
            "popular": "/api/popular",
            "top_rated": "/api/top-rated",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "tmdb_configured": bool(settings.TMDB_API_KEY)}
