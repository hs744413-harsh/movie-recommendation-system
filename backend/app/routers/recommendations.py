import asyncio
import logging

from fastapi import APIRouter, HTTPException, Query

from app.services import recommendation as rec_service
from app.services import tmdb as tmdb_service
from app.models.schemas import MovieResponse, RecommendationResponse, SearchResult

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["recommendations"])


@router.get("/recommendations/{title}", response_model=RecommendationResponse)
async def get_recommendations(title: str, n: int = Query(default=10, ge=1, le=30)):
    """Get movie recommendations based on cosine similarity."""
    # Lowercase to match normalized titles in the service
    results = rec_service.get_recommendations(title.lower().strip(), n)

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"Movie '{title}' not found. Please check the title and try again.",
        )

    # results are already plain dicts — enrich with TMDB data in parallel
    enriched = await asyncio.gather(
        *[tmdb_service.enrich_with_tmdb(m) for m in results]
    )

    return RecommendationResponse(
        query=title,
        recommendations=[MovieResponse(**m) for m in enriched],
    )


@router.get("/search", response_model=SearchResult)
async def search_movies(
    query: str = Query(..., min_length=1),
    limit: int = Query(default=20, ge=1, le=50),
):
    """Search movies by title substring."""
    if not query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty.")

    results = rec_service.search_movies_local(query, limit)

    # Enrich top 10 with TMDB posters for speed
    enrich_count = min(len(results), 10)
    enriched_top = await asyncio.gather(
        *[tmdb_service.enrich_with_tmdb(m) for m in results[:enrich_count]]
    )
    remaining = results[enrich_count:]

    all_results = list(enriched_top) + remaining

    return SearchResult(
        results=[MovieResponse(**m) for m in all_results],
        total=len(all_results),
    )


@router.get("/movies/{title}", response_model=MovieResponse)
async def get_movie(title: str):
    """Get a single movie by exact or fuzzy title match."""
    movie = rec_service.get_movie_by_title(title.lower().strip())

    if not movie:
        raise HTTPException(
            status_code=404,
            detail=f"Movie '{title}' not found.",
        )

    enriched = await tmdb_service.enrich_with_tmdb(movie)
    return MovieResponse(**enriched)


@router.get("/top-rated")
async def get_top_rated(n: int = Query(default=20, ge=1, le=50)):
    """Get top-rated movies from local database."""
    results = rec_service.get_top_rated(n)

    enrich_count = min(len(results), 10)
    enriched_top = await asyncio.gather(
        *[tmdb_service.enrich_with_tmdb(m) for m in results[:enrich_count]]
    )
    remaining = results[enrich_count:]

    all_results = list(enriched_top) + remaining
    return [MovieResponse(**m) for m in all_results]
