from typing import List, Optional
from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=2000, description="Citizen's inquiry regarding schemes, criteria, or documents")
    language: Optional[str] = Field("en", description="Preferred language code: en, hi")
    category_filter: Optional[str] = Field(None, description="Optional category filter (e.g. agriculture, health, education)")
    state_filter: Optional[str] = Field(None, description="Optional state filter")


class RetrievedChunk(BaseModel):
    chunk_id: str
    scheme_id: str
    scheme_name: str
    category: str
    content: str
    source_title: str
    source_url: str
    similarity_score: float
    verified: bool
    retrieval_method: str = "semantic_faiss"


class ValidatedCitation(BaseModel):
    citation_label: str = Field(..., description="E.g. [S1], [S2]")
    scheme_id: str
    scheme_name: str
    source_title: str
    source_url: str
    relevance_snippet: Optional[str] = None


class AskResponse(BaseModel):
    question: str
    answer: str
    citations: List[ValidatedCitation]
    retrieved_sources: List[RetrievedChunk]
    model_used: str
    degraded_mode: bool = False
    confidence_warning: Optional[str] = None
    disclaimer: str


class AIHealthCheck(BaseModel):
    configured: bool
    active_model: str
    status: str
    live_verification_ok: bool
    message: str


class SystemHealthResponse(BaseModel):
    status: str
    version: str
    total_schemes: int
    vector_index_ready: bool
    ai_status: AIHealthCheck
