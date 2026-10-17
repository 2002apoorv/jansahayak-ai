from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.schemas.eligibility import (
    EligibilityEvaluationRequest,
    EligibilityEvaluationResponse,
    UserProfile,
)
from app.schemas.rag import AIHealthCheck, AskRequest, AskResponse, SystemHealthResponse
from app.schemas.scheme import Scheme, SchemeSummary
from app.services.eligibility_service import eligibility_engine
from app.services.gemini_service import gemini_service
from app.services.matching_service import matching_service
from app.services.retrieval_service import retrieval_service
from app.services.scheme_service import scheme_service

router = APIRouter(prefix="/api", tags=["JanSahayak API"])


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=500)
    category: Optional[str] = None
    state: Optional[str] = None
    top_k: int = Field(5, ge=1, le=20)


class ProfileMatchRequest(BaseModel):
    profile: UserProfile
    category: Optional[str] = None


@router.get("/schemes", response_model=List[SchemeSummary])
def list_schemes(
    category: Optional[str] = Query(None, description="Filter by category"),
    state: Optional[str] = Query(None, description="Filter by state (e.g. Madhya Pradesh)"),
    level: Optional[str] = Query(None, description="central or state"),
    search: Optional[str] = Query(None, description="Search term for scheme name or description"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Lists verified government schemes with filtering and pagination."""
    return scheme_service.get_all(
        category=category,
        state=state,
        government_level=level,
        search=search,
        limit=limit,
        offset=offset
    )


@router.get("/schemes/{scheme_id}", response_model=Scheme)
def get_scheme_detail(scheme_id: str):
    """Returns full details, verified benefits, criteria rules, and required documents for a scheme."""
    scheme = scheme_service.get_by_id(scheme_id)
    if not scheme:
        raise HTTPException(
            status_code=404,
            detail=f"Scheme with ID '{scheme_id}' was not found in the verified database."
        )
    return scheme


@router.get("/categories")
def get_categories():
    """Returns scheme categories with descriptions and current count of verified schemes."""
    return scheme_service.get_categories()


@router.post("/schemes/search")
def search_schemes(request: SearchRequest):
    """
    Performs hybrid retrieval (semantic FAISS vector search + lexical fallback)
    to discover relevant schemes based on natural language citizen queries.
    """
    chunks = retrieval_service.search(
        query=request.query,
        top_k=request.top_k,
        category=request.category,
        state=request.state
    )

    # Aggregate by scheme
    schemes_dict = {}
    for c in chunks:
        if c.scheme_id not in schemes_dict:
            full_scheme = scheme_service.get_by_id(c.scheme_id)
            if full_scheme:
                schemes_dict[c.scheme_id] = {
                    "scheme": full_scheme.model_dump(),
                    "top_relevance_score": c.similarity_score,
                    "retrieval_method": c.retrieval_method,
                    "matched_passages": [c.content]
                }
            else:
                schemes_dict[c.scheme_id] = {
                    "scheme": {"id": c.scheme_id, "name": c.scheme_name, "category": c.category},
                    "top_relevance_score": c.similarity_score,
                    "retrieval_method": c.retrieval_method,
                    "matched_passages": [c.content]
                }
        else:
            schemes_dict[c.scheme_id]["matched_passages"].append(c.content)

    results = list(schemes_dict.values())
    results.sort(key=lambda x: x["top_relevance_score"], reverse=True)

    return {
        "query": request.query,
        "results_count": len(results),
        "results": results,
        "retrieval_method": chunks[0].retrieval_method if chunks else "none"
    }


@router.post("/eligibility/evaluate", response_model=EligibilityEvaluationResponse)
def evaluate_eligibility(request: EligibilityEvaluationRequest):
    """
    Evaluates citizen profile against verified deterministic criteria rules.
    Operates using 3-valued logic (satisfied, not_satisfied, unknown).
    Zero LLM hallucination of civic benefit qualification.
    """
    return eligibility_engine.evaluate_all(
        profile=request.profile,
        scheme_ids=request.scheme_ids
    )


@router.post("/schemes/match")
def match_schemes_for_profile(request: ProfileMatchRequest):
    """
    Matches citizen profile to relevant schemes transparently,
    combining jurisdiction, target demographics, and deterministic eligibility evaluation.
    """
    matches = matching_service.match_schemes(
        profile=request.profile,
        category_filter=request.category
    )
    return {
        "profile_summary": request.profile.model_dump(exclude_none=True),
        "matches_count": len(matches),
        "matches": matches
    }


@router.post("/ask", response_model=AskResponse)
def ask_question(request: AskRequest):
    """
    Grounds citizen inquiry in verified official source passages.
    Retrieves semantic passages via FAISS, passes them to Gemini with strict citation constraints,
    validates [S1] citations against source records, and falls back gracefully to degraded mode if AI is offline.
    """
    # 1. Retrieve relevant passages
    chunks = retrieval_service.search(
        query=request.question,
        top_k=4,
        category=request.category_filter,
        state=request.state_filter
    )

    # 2. Grounded generation
    response = gemini_service.generate_grounded_answer(
        question=request.question,
        retrieved_chunks=chunks,
        language=request.language or "en"
    )

    return response


@router.get("/health/ai", response_model=AIHealthCheck)
def check_ai_health():
    """
    Diagnostic endpoint that distinguishes application health from external Gemini AI availability.
    Safely tests live connectivity without exposing credentials.
    """
    is_live, active_m, msg = gemini_service.check_live_status()
    return AIHealthCheck(
        configured=gemini_service.is_available,
        active_model=active_m,
        status="operational" if is_live else ("degraded" if gemini_service.is_available else "unconfigured"),
        live_verification_ok=is_live,
        message=msg
    )
