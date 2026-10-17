from typing import Any, Dict, List, Optional
from app.data.schemes_data import VERIFIED_SCHEMES, get_all_schemes, get_scheme_by_id
from app.schemas.scheme import Scheme, SchemeSummary


class SchemeService:
    """Provides querying, searching, filtering, and category metadata for schemes."""

    @staticmethod
    def get_all(
        category: Optional[str] = None,
        state: Optional[str] = None,
        government_level: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[SchemeSummary]:
        results = []
        schemes = get_all_schemes()

        for s in schemes:
            if category and s.category.lower() != category.lower():
                continue
            if government_level and s.government_level.lower() != government_level.lower():
                continue
            if state and s.state and s.state.lower() != state.lower():
                continue
            if search:
                term = search.lower()
                matches = (
                    term in s.name.lower() or
                    (s.short_name and term in s.short_name.lower()) or
                    term in s.description.lower() or
                    any(term in tag.lower() for tag in s.tags)
                )
                if not matches:
                    continue

            summary = SchemeSummary(
                id=s.id,
                name=s.name,
                short_name=s.short_name,
                category=s.category,
                government_level=s.government_level,
                state=s.state,
                description=s.description,
                benefits_summary=s.benefits[0].description if s.benefits else None,
                application_url=s.application_url,
                source_title=s.source_title,
                source_url=s.source_url,
                verified=s.verified,
                tags=s.tags
            )
            results.append(summary)

        return results[offset : offset + limit]

    @staticmethod
    def get_by_id(scheme_id: str) -> Optional[Scheme]:
        return get_scheme_by_id(scheme_id)

    @staticmethod
    def get_categories() -> List[Dict[str, Any]]:
        category_meta = {
            "agriculture": {"label": "Agriculture & Rural", "icon": "Sprout", "description": "Support for farmers, landholders, and cultivators"},
            "health": {"label": "Healthcare & Wellness", "icon": "HeartPulse", "description": "Cashless hospitalization and family health assurance"},
            "housing": {"label": "Housing & Urban", "icon": "Home", "description": "Affordable shelter and permanent pucca houses for all"},
            "education": {"label": "Education & Scholarships", "icon": "GraduationCap", "description": "Tuition grants and academic maintenance support"},
            "business": {"label": "Business & Micro-Credit", "icon": "Briefcase", "description": "Collateral-free loans for MSMEs and street vendors"},
            "women_child": {"label": "Women & Child Care", "icon": "Users", "description": "Financial empowerment, girl child savings, and nutrition"}
        }

        counts: Dict[str, int] = {}
        for s in VERIFIED_SCHEMES:
            counts[s.category] = counts.get(s.category, 0) + 1

        output = []
        for cat_id, meta in category_meta.items():
            output.append({
                "id": cat_id,
                "label": meta["label"],
                "icon": meta["icon"],
                "description": meta["description"],
                "scheme_count": counts.get(cat_id, 0)
            })
        return output


scheme_service = SchemeService()
