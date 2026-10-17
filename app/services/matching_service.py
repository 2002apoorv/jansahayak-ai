from typing import Any, Dict, List, Optional
from app.data.schemes_data import VERIFIED_SCHEMES
from app.schemas.eligibility import OverallMatchStatus, SchemeEligibilityResult, UserProfile
from app.schemas.scheme import Scheme
from app.services.eligibility_service import eligibility_engine


class SchemeMatchingService:
    """Matches citizen profiles to schemes transparently without opaque LLM scoring."""

    @staticmethod
    def match_schemes(profile: UserProfile, category_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        matched = []

        for scheme in VERIFIED_SCHEMES:
            # 1. Category filter
            if category_filter and scheme.category.lower() != category_filter.lower():
                continue

            # 2. Jurisdiction filter: State schemes must match user state if provided
            jurisdiction_match = True
            if scheme.government_level == "state" and scheme.state:
                if profile.state and profile.state.strip().lower() != scheme.state.strip().lower():
                    jurisdiction_match = False

            if not jurisdiction_match:
                continue

            # 3. Evaluate deterministic rules
            eval_result: SchemeEligibilityResult = eligibility_engine.evaluate_scheme(scheme, profile)

            # 4. Generate transparent match explanations
            reasons = []
            if profile.occupation and any(rule.field == "occupation" for rule in scheme.eligibility_rules):
                reasons.append(f"Targeted at your stated occupation ({profile.occupation.replace('_', ' ').title()})")
            if profile.is_student is True and scheme.category == "education":
                reasons.append("Matches your active student enrolment")
            if profile.gender == "female" and scheme.category == "women_child":
                reasons.append("Directly benefits women and female children")
            if scheme.government_level == "central":
                reasons.append("Nationwide Central Government Scheme")
            elif scheme.state and profile.state and profile.state.lower() == scheme.state.lower():
                reasons.append(f"Exclusive state initiative for residents of {scheme.state}")

            matched.append({
                "scheme": scheme.model_dump(),
                "eligibility_result": eval_result.model_dump(),
                "match_reasons": reasons,
                "status": eval_result.status,
                "match_score": eval_result.match_score
            })

        # Rank: Potentially eligible, then conditionally eligible, then unknown, then not eligible
        priority = {
            OverallMatchStatus.POTENTIALLY_ELIGIBLE: 0,
            OverallMatchStatus.CONDITIONALLY_ELIGIBLE: 1,
            OverallMatchStatus.UNKNOWN_MISSING_INFO: 2,
            OverallMatchStatus.NOT_ELIGIBLE: 3,
        }
        matched.sort(key=lambda m: (priority[m["status"]], -m["match_score"]))
        return matched


matching_service = SchemeMatchingService()
