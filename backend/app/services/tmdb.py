import logging
import time
from typing import Optional

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# ── Simple TTL-based in-memory cache ─────────────────────────────────────────
_cache: dict[str, tuple[float, any]] = {}
CACHE_TTL = 300  # 5 minutes


def _get_cached(key: str):
    if key in _cache:
        timestamp, data = _cache[key]
        if time.time() - timestamp < CACHE_TTL:
            return data
        del _cache[key]
    return None


def _set_cache(key: str, data):
    _cache[key] = (time.time(), data)


# ── TMDB image URL helpers ───────────────────────────────────────────────────
def get_poster_url(poster_path: str | None, size: str = "w500") -> str | None:
    if not poster_path:
        return None
    return f"{settings.TMDB_IMAGE_BASE}/{size}{poster_path}"


def get_backdrop_url(backdrop_path: str | None, size: str = "original") -> str | None:
    if not backdrop_path:
        return None
    return f"{settings.TMDB_IMAGE_BASE}/{size}{backdrop_path}"


# ── TMDB API calls ──────────────────────────────────────────────────────────
async def search_tmdb_movie(query: str) -> dict | None:
    """Search TMDB for a movie by title and return the first result."""
    if not settings.TMDB_API_KEY:
        return None

    cache_key = f"search:{query.lower()}"
    cached = _get_cached(cache_key)
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"{settings.TMDB_BASE_URL}/search/movie",
                params={"api_key": settings.TMDB_API_KEY, "query": query, "page": 1},
            )
            response.raise_for_status()
            data = response.json()

            if data.get("results"):
                result = data["results"][0]
                movie_data = {
                    "tmdb_id": result.get("id"),
                    "poster_url": get_poster_url(result.get("poster_path")),
                    "backdrop_url": get_backdrop_url(result.get("backdrop_path")),
                    "tmdb_rating": result.get("vote_average"),
                    "release_date": result.get("release_date", ""),
                    "tmdb_overview": result.get("overview", ""),
                }
                _set_cache(cache_key, movie_data)
                return movie_data
    except httpx.HTTPStatusError as e:
        logger.warning(f"TMDB API error for '{query}': {e.response.status_code}")
    except httpx.RequestError as e:
        logger.warning(f"TMDB request error for '{query}': {e}")
    except Exception as e:
        logger.warning(f"Unexpected TMDB error for '{query}': {e}")

    return None


async def get_trending_movies(page: int = 1) -> list[dict]:
    """Fetch trending movies from TMDB."""
    if not settings.TMDB_API_KEY:
        return []

    cache_key = f"trending:{page}"
    cached = _get_cached(cache_key)
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"{settings.TMDB_BASE_URL}/trending/movie/week",
                params={"api_key": settings.TMDB_API_KEY, "page": page},
            )
            response.raise_for_status()
            data = response.json()

            movies = []
            for item in data.get("results", []):
                movies.append({
                    "title": item.get("title", ""),
                    "overview": item.get("overview", ""),
                    "poster_url": get_poster_url(item.get("poster_path")),
                    "backdrop_url": get_backdrop_url(item.get("backdrop_path")),
                    "tmdb_id": item.get("id"),
                    "tmdb_rating": item.get("vote_average", 0),
                    "release_date": item.get("release_date", ""),
                    "popularity": item.get("popularity", 0),
                    "vote_average": item.get("vote_average", 0),
                    "vote_count": item.get("vote_count", 0),
                    "genres": "",
                    "production_companies": "",
                })
            _set_cache(cache_key, movies)
            return movies
    except Exception as e:
        logger.warning(f"Error fetching trending movies: {e}")
        return []


async def get_popular_movies(page: int = 1) -> list[dict]:
    """Fetch popular movies from TMDB."""
    if not settings.TMDB_API_KEY:
        return []

    cache_key = f"popular:{page}"
    cached = _get_cached(cache_key)
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"{settings.TMDB_BASE_URL}/movie/popular",
                params={"api_key": settings.TMDB_API_KEY, "page": page},
            )
            response.raise_for_status()
            data = response.json()

            movies = []
            for item in data.get("results", []):
                movies.append({
                    "title": item.get("title", ""),
                    "overview": item.get("overview", ""),
                    "poster_url": get_poster_url(item.get("poster_path")),
                    "backdrop_url": get_backdrop_url(item.get("backdrop_path")),
                    "tmdb_id": item.get("id"),
                    "tmdb_rating": item.get("vote_average", 0),
                    "release_date": item.get("release_date", ""),
                    "popularity": item.get("popularity", 0),
                    "vote_average": item.get("vote_average", 0),
                    "vote_count": item.get("vote_count", 0),
                    "genres": "",
                    "production_companies": "",
                })
            _set_cache(cache_key, movies)
            return movies
    except Exception as e:
        logger.warning(f"Error fetching popular movies: {e}")
        return []


async def get_movie_details_tmdb(tmdb_id: int) -> dict | None:
    """Fetch full movie details from TMDB by ID."""
    if not settings.TMDB_API_KEY:
        return None

    cache_key = f"details:{tmdb_id}"
    cached = _get_cached(cache_key)
    if cached is not None:
        return cached

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"{settings.TMDB_BASE_URL}/movie/{tmdb_id}",
                params={"api_key": settings.TMDB_API_KEY},
            )
            response.raise_for_status()
            data = response.json()

            movie_data = {
                "tmdb_id": data.get("id"),
                "title": data.get("title", ""),
                "overview": data.get("overview", ""),
                "poster_url": get_poster_url(data.get("poster_path")),
                "backdrop_url": get_backdrop_url(data.get("backdrop_path")),
                "tmdb_rating": data.get("vote_average", 0),
                "release_date": data.get("release_date", ""),
                "popularity": data.get("popularity", 0),
                "vote_average": data.get("vote_average", 0),
                "vote_count": data.get("vote_count", 0),
                "genres": ", ".join(g["name"] for g in data.get("genres", [])),
                "production_companies": ", ".join(
                    c["name"] for c in data.get("production_companies", [])
                ),
                "runtime": data.get("runtime"),
                "tagline": data.get("tagline", ""),
                "budget": data.get("budget", 0),
                "revenue": data.get("revenue", 0),
            }
            _set_cache(cache_key, movie_data)
            return movie_data
    except Exception as e:
        logger.warning(f"Error fetching TMDB details for {tmdb_id}: {e}")
        return None


async def enrich_with_tmdb(movie: dict) -> dict:
    """Add TMDB poster/backdrop data to a local movie dict."""
    tmdb_data = await search_tmdb_movie(movie.get("title", ""))
    if tmdb_data:
        movie["poster_url"] = tmdb_data.get("poster_url")
        movie["backdrop_url"] = tmdb_data.get("backdrop_url")
        movie["tmdb_id"] = tmdb_data.get("tmdb_id")
        movie["tmdb_rating"] = tmdb_data.get("tmdb_rating")
        movie["release_date"] = tmdb_data.get("release_date", "")
    return movie
