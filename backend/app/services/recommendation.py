import pickle
import os
import logging
from functools import lru_cache
from difflib import get_close_matches

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────
# Global state (loaded once at startup)
# ─────────────────────────────────────────
_df = None              # DataFrame with movie data (original titles kept)
_df_lower = None        # Same df but title column lowercased for lookup
_indices = None         # title (lowercase) → row index
_tfidf_matrix = None
_is_loaded = False


# ─────────────────────────────────────────
# Helper
# ─────────────────────────────────────────
def find_closest_title(title: str, all_titles) -> str | None:
    matches = get_close_matches(title, all_titles, n=1, cutoff=0.6)
    return matches[0] if matches else None


def _row_to_dict(row) -> dict:
    """Convert a DataFrame row to a clean dict with safe types."""
    return {
        "title": str(row.get("title", "")),
        "genres": str(row.get("genres", "") or ""),
        "overview": str(row.get("overview", "") or ""),
        "production_companies": str(row.get("production_companies", "") or ""),
        "vote_average": float(row.get("vote_average") or 0),
        "vote_count": float(row.get("vote_count") or 0),
        "popularity": float(row.get("popularity") or 0),
    }


# ─────────────────────────────────────────
# Load Models
# ─────────────────────────────────────────
def load_models():
    global _df, _df_lower, _indices, _tfidf_matrix, _is_loaded

    if _is_loaded:
        return

    base_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "..")
    )

    try:
        _df = pickle.load(open(os.path.join(base_path, "df.pkl"), "rb"))
        _indices = pickle.load(open(os.path.join(base_path, "indices.pkl"), "rb"))
        _tfidf_matrix = pickle.load(open(os.path.join(base_path, "tfidf_matrix.pkl"), "rb"))

        # Keep original titles in _df but build lowercase lookup index
        if isinstance(_indices, pd.Series):
            _indices.index = _indices.index.str.lower().str.strip()
        else:
            _indices = {k.lower().strip(): v for k, v in _indices.items()}

        _is_loaded = True
        logger.info(f"✅ Models loaded — {len(_df)} movies, matrix shape: {_tfidf_matrix.shape}")

    except Exception as e:
        raise RuntimeError(f"Error loading ML models: {e}")


# ─────────────────────────────────────────
# Movie Search (case-insensitive substring)
# ─────────────────────────────────────────
def search_movies_local(query: str, limit: int = 20) -> list[dict]:
    if not _is_loaded:
        load_models()

    query_lower = query.lower()
    mask = _df["title"].str.lower().str.contains(query_lower, na=False)
    results = _df[mask].head(limit)
    return [_row_to_dict(row) for _, row in results.iterrows()]


# ─────────────────────────────────────────
# Get single movie by title
# ─────────────────────────────────────────
def get_movie_by_title(title: str) -> dict | None:
    if not _is_loaded:
        load_models()

    title_lower = title.lower().strip()

    if title_lower not in _indices:
        closest = find_closest_title(title_lower, list(_indices.keys()))
        if closest:
            title_lower = closest
        else:
            return None

    idx = _indices[title_lower]
    row = _df.iloc[idx]
    return _row_to_dict(row)


# ─────────────────────────────────────────
# Recommendations (LRU-cached)
# ─────────────────────────────────────────
@lru_cache(maxsize=512)
def _compute_recommendations(title_lower: str, n: int = 10) -> tuple:
    """Must be called AFTER load_models(). LRU-cached by lowercase title."""
    if title_lower not in _indices:
        closest = find_closest_title(title_lower, list(_indices.keys()))
        if closest:
            title_lower = closest
        else:
            return ()

    idx = _indices[title_lower]
    sim_scores = cosine_similarity(_tfidf_matrix[idx], _tfidf_matrix).flatten()
    similar_indices = sim_scores.argsort()[::-1][1: n + 1]

    results = []
    for i in similar_indices:
        row = _df.iloc[i]
        movie = _row_to_dict(row)
        movie["similarity_score"] = float(sim_scores[i])
        results.append(movie)

    return tuple(results)


def get_recommendations(title: str, n: int = 10) -> list[dict]:
    if not _is_loaded:
        load_models()
    return list(_compute_recommendations(title.lower().strip(), n))


# ─────────────────────────────────────────
# Top Rated & Popular (from local DB)
# ─────────────────────────────────────────
def get_top_rated(n: int = 20) -> list[dict]:
    if not _is_loaded:
        load_models()
    rows = _df.nlargest(n, "vote_average")
    return [_row_to_dict(row) for _, row in rows.iterrows()]


def get_popular_local(n: int = 20) -> list[dict]:
    if not _is_loaded:
        load_models()
    rows = _df.nlargest(n, "popularity")
    return [_row_to_dict(row) for _, row in rows.iterrows()]