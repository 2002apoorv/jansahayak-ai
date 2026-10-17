import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.endpoints import router as api_router
from app.core.config import settings
from app.data.schemes_data import VERIFIED_SCHEMES
from app.schemas.rag import SystemHealthResponse, AIHealthCheck
from app.services.gemini_service import gemini_service
from app.services.retrieval_service import retrieval_service

# Setup logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("jansahayak")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes search indices and verifies service readiness on startup."""
    logger.info("Initializing JanSahayak AI Application...")
    # Load or initialize vector index
    index_loaded = retrieval_service.load_index()
    if index_loaded:
        logger.info(f"Vector search ready with {len(retrieval_service.chunks_metadata)} indexed chunks.")
    else:
        logger.warning("Vector search index not yet created. Run 'python -m app.ingest' to build it.")

    yield
    logger.info("Shutting down JanSahayak AI Application.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

import re

# CORS Middleware allowing universal access for public civic portals
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def clean_double_slash_middleware(request: Request, call_next):
    """Normalize repeated slashes (e.g., //api/ask -> /api/ask) from misconfigured client base URLs."""
    raw_path = request.scope.get("path", "")
    if "//" in raw_path:
        request.scope["path"] = re.sub(r"/+", "/", raw_path)
    return await call_next(request)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Intercept unhandled exceptions to prevent exposing raw stack traces to citizens."""
    logger.exception(f"Unhandled exception on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Service Error",
            "message": "A temporary processing error occurred. Please try again or check backend logs.",
            "path": request.url.path
        }
    )


# Attach modular API router
app.include_router(api_router)


@app.get("/", tags=["General"])
def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "operational",
        "version": settings.PROJECT_VERSION,
        "docs": "/docs",
        "description": settings.DESCRIPTION
    }


@app.get("/health", response_model=SystemHealthResponse, tags=["General"])
def health_check():
    """
    Health check returning overall service status,
    total indexed schemes, vector index readiness, and external AI connectivity.
    """
    is_live, active_m, msg = gemini_service.check_live_status()
    return SystemHealthResponse(
        status="ok",
        version=settings.PROJECT_VERSION,
        total_schemes=len(VERIFIED_SCHEMES),
        vector_index_ready=retrieval_service.is_ready,
        ai_status=AIHealthCheck(
            configured=gemini_service.is_available,
            active_model=active_m,
            status="operational" if is_live else "degraded",
            live_verification_ok=is_live,
            message=msg
        )
    )