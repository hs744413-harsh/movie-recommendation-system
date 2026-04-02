import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "")
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"
    TMDB_IMAGE_BASE: str = "https://image.tmdb.org/t/p"
    PICKLE_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "..")
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]


settings = Settings()
