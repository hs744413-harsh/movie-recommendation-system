import asyncio
import logging

from fastapi import APIRouter, Query

from app.services import tmdb as tmdb_service
from app.services import recommendation as rec_service
from app.models.schemas import MovieResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["movies"])


@router.get("/trending")
async def get_trending(page: int = Query(default=1, ge=1, le=10)):
    """Get trending movies from TMDB (falls back to local popular)."""
    movies = await tmdb_service.get_trending_movies(page)

    if not movies:
        logger.info("TMDB trending unavailable, falling back to local data")
        local_movies = rec_service.get_popular_local(20)
        enriched = await asyncio.gather(
            *[tmdb_service.enrich_with_tmdb(m) for m in local_movies[:10]]
        )
        movies = list(enriched) + local_movies[10:]

    return [MovieResponse(**m) for m in movies]


@router.get("/popular")
async def get_popular(page: int = Query(default=1, ge=1, le=10)):
    """Get popular movies from TMDB (falls back to local popular)."""
    movies = await tmdb_service.get_popular_movies(page)

    if not movies:
        logger.info("TMDB popular unavailable, falling back to local data")
        local_movies = rec_service.get_popular_local(20)
        enriched = await asyncio.gather(
            *[tmdb_service.enrich_with_tmdb(m) for m in local_movies[:10]]
        )
        movies = list(enriched) + local_movies[10:]

    return [MovieResponse(**m) for m in movies]
