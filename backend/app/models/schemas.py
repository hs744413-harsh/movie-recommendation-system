from pydantic import BaseModel
from typing import Optional, Any


class MovieBase(BaseModel):
    model_config = {"extra": "ignore", "from_attributes": True}

    title: str
    genres: Optional[str] = ""
    overview: Optional[str] = ""
    production_companies: Optional[str] = ""
    vote_average: Optional[float] = 0.0
    vote_count: Optional[float] = 0.0
    popularity: Optional[float] = 0.0


class MovieResponse(MovieBase):
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    tmdb_id: Optional[int] = None
    tmdb_rating: Optional[float] = None
    release_date: Optional[str] = None


class RecommendationResponse(BaseModel):
    query: str
    recommendations: list[MovieResponse]


class SearchResult(BaseModel):
    results: list[MovieResponse]
    total: int


class TMDBMovie(BaseModel):
    id: int
    title: str
    overview: Optional[str] = ""
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    vote_average: Optional[float] = 0.0
    release_date: Optional[str] = ""
    popularity: Optional[float] = 0.0
    genre_ids: Optional[list[int]] = []
