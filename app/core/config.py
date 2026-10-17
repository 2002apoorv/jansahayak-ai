import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Canonical project root directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env file from project root or current directory
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()


class Settings:
    PROJECT_NAME: str = "JanSahayak AI"
    PROJECT_VERSION: str = "1.0.0"
    DESCRIPTION: str = "Official Indian Government Scheme Navigator with Grounded AI and Deterministic Eligibility Evaluation"

    # API Keys & Models
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    # Configured model with default to the verified available model
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
    # Supported fallback models in order of priority when experiencing 503 / 404
    GEMINI_FALLBACK_MODELS: List[str] = [
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
        "gemini-3.5-flash",
    ]

    # CORS settings
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    ALLOWED_ORIGINS: List[str] = [
        FRONTEND_ORIGIN,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Directory Paths
    DATA_DIR: Path = Path(os.getenv("DATA_DIR", str(BASE_DIR / "data")))
    RAW_DATA_DIR: Path = DATA_DIR / "raw"
    PROCESSED_DATA_DIR: Path = DATA_DIR / "processed"
    VECTOR_INDEX_DIR: Path = Path(os.getenv("VECTOR_INDEX_DIR", str(DATA_DIR / "vector_index")))

    # Embedding Model for Semantic Search
    EMBEDDING_MODEL_NAME: str = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.25"))
    TOP_K_RETRIEVAL: int = int(os.getenv("TOP_K_RETRIEVAL", "4"))

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

    @property
    def is_gemini_configured(self) -> bool:
        return bool(self.GEMINI_API_KEY and len(self.GEMINI_API_KEY.strip()) > 0)


settings = Settings()

# Ensure standard data directories exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.VECTOR_INDEX_DIR.mkdir(parents=True, exist_ok=True)
