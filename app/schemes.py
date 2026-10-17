"""
Scheme catalog adapter for JanSahayak AI.
Maintains backward compatibility with legacy dictionary-based schemes,
backed by the verified Indian Government Scheme Knowledge Base.
"""

from typing import Any, Dict, List
from app.data.schemes_data import VERIFIED_SCHEMES, get_all_schemes, get_scheme_by_id

# Convert Pydantic scheme objects to legacy dictionary format for compatibility
SCHEMES: List[Dict[str, Any]] = [
    {
        "id": scheme.id,
        "name": scheme.name,
        "short_name": scheme.short_name,
        "category": scheme.category,
        "government_level": scheme.government_level,
        "state": scheme.state or "all",
        "ministry": scheme.ministry,
        "summary": scheme.description,
        "description": scheme.description,
        "eligibility": [rule.description for rule in scheme.eligibility_rules],
        "eligibility_rules": [rule.model_dump() for rule in scheme.eligibility_rules],
        "benefits": [b.model_dump() for b in scheme.benefits],
        "documents": [doc.name + ": " + doc.description for doc in scheme.required_documents],
        "required_documents": [doc.model_dump() for doc in scheme.required_documents],
        "application_steps": scheme.application_steps,
        "application_url": scheme.application_url,
        "source_title": scheme.source_title,
        "source_url": scheme.source_url,
        "source_published_date": scheme.source_published_date,
        "last_checked_at": scheme.last_checked_at,
        "verified": scheme.verified,
        "tags": scheme.tags,
    }
    for scheme in VERIFIED_SCHEMES
]

__all__ = ["SCHEMES", "VERIFIED_SCHEMES", "get_all_schemes", "get_scheme_by_id"]