"""
RAG retrieval adapter maintaining compatibility with existing interfaces
while leveraging the hybrid semantic-lexical retrieval service.
"""

from typing import Any, Dict, List
from app.services.retrieval_service import retrieval_service
from app.schemes import SCHEMES


def retrieve_schemes(query: str, limit: int = 3) -> List[Dict[str, Any]]:
    """
    Retrieves matching schemes for a query.
    Attempts semantic FAISS search first; falls back to lexical overlap.
    """
    retrieved_chunks = retrieval_service.search(query=query, top_k=limit)

    results = []
    seen_scheme_ids = set()

    # Map chunks back to full scheme records
    schemes_by_id = {s["id"]: s for s in SCHEMES}

    for chunk in retrieved_chunks:
        if chunk.scheme_id in seen_scheme_ids:
            continue
        seen_scheme_ids.add(chunk.scheme_id)

        scheme_dict = schemes_by_id.get(chunk.scheme_id)
        if scheme_dict:
            results.append({
                "scheme": scheme_dict,
                "score": chunk.similarity_score,
                "chunk": chunk.model_dump(),
            })

    # If no results from chunks, fallback to keyword search directly on SCHEMES
    if not results:
        lexical_chunks = retrieval_service.search_lexical(query=query, top_k=limit)
        for chunk in lexical_chunks:
            if chunk.scheme_id in seen_scheme_ids:
                continue
            seen_scheme_ids.add(chunk.scheme_id)
            scheme_dict = schemes_by_id.get(chunk.scheme_id)
            if scheme_dict:
                results.append({
                    "scheme": scheme_dict,
                    "score": chunk.similarity_score,
                    "chunk": chunk.model_dump(),
                })

    return results[:limit]