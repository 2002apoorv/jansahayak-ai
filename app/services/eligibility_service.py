import logging
from typing import Any, List, Optional, Tuple

from app.data.schemes_data import VERIFIED_SCHEMES, get_all_schemes, get_scheme_by_id
from app.schemas.eligibility import (
    CriterionEvaluation,
    EligibilityEvaluationRequest,
    EligibilityEvaluationResponse,
    EvaluationStatus,
    OverallMatchStatus,
    SchemeEligibilityResult,
    UserProfile,
)
from app.schemas.scheme import CriterionRule, Scheme

logger = logging.getLogger(__name__)

DISCLAIMER_TEXT = (
    "JanSahayak AI provides preliminary indicative assessments based solely on self-reported inputs "
    "and verified public guidelines. It DOES NOT constitute an official government eligibility decision, "
    "legal entitlement, or benefit approval. Official verification occurs through designated portal or physical authorities."
)


class EligibilityEngine:
    """
    Deterministic three-valued logic (SATISFIED, NOT_SATISFIED, UNKNOWN) eligibility engine.
    Independent of LLM inference to eliminate hallucinations in civic benefit qualifications.
    """

    @staticmethod
    def evaluate_criterion(
        rule: CriterionRule,
        profile: UserProfile,
        scheme: Scheme
    ) -> CriterionEvaluation:
        """Evaluates a single criterion rule against citizen profile attributes."""
        field_name = rule.field
        user_val = getattr(profile, field_name, None)

        # 1. Missing information returns UNKNOWN (Three-valued logic)
        if user_val is None:
            return CriterionEvaluation(
                criterion_id=rule.id,
                description=rule.description,
                status=EvaluationStatus.UNKNOWN,
                explanation=f"Required detail '{field_name.replace('_', ' ').title()}' was not provided in profile.",
                source_ref=rule.source_ref
            )

        # 2. Evaluate operator
        op = rule.operator.lower()
        expected = rule.value

        try:
            if op == "eq":
                if isinstance(user_val, str) and isinstance(expected, str):
                    is_match = user_val.strip().lower() == expected.strip().lower()
                else:
                    is_match = user_val == expected

                if is_match:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.SATISFIED,
                        explanation=f"Satisfied: {field_name.replace('_', ' ').title()} matches required value '{expected}'.",
                        source_ref=rule.source_ref
                    )
                else:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.NOT_SATISFIED,
                        explanation=f"Condition not met: Current value '{user_val}' does not match required '{expected}'.",
                        source_ref=rule.source_ref
                    )

            elif op == "lte":
                user_num = float(user_val)
                expected_num = float(expected)
                if user_num <= expected_num:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.SATISFIED,
                        explanation=f"Satisfied: Value ({user_num:,.0f}) is within qualifying ceiling of {expected_num:,.0f}.",
                        source_ref=rule.source_ref
                    )
                else:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.NOT_SATISFIED,
                        explanation=f"Condition not met: Value ({user_num:,.0f}) exceeds maximum threshold of {expected_num:,.0f}.",
                        source_ref=rule.source_ref
                    )

            elif op == "gte":
                user_num = float(user_val)
                expected_num = float(expected)
                if user_num >= expected_num:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.SATISFIED,
                        explanation=f"Satisfied: Value ({user_num:,.0f}) meets or exceeds minimum requirement of {expected_num:,.0f}.",
                        source_ref=rule.source_ref
                    )
                else:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.NOT_SATISFIED,
                        explanation=f"Condition not met: Value ({user_num:,.0f}) is below minimum requirement of {expected_num:,.0f}.",
                        source_ref=rule.source_ref
                    )

            elif op == "range":
                user_num = float(user_val)
                min_v, max_v = float(expected[0]), float(expected[1])
                if min_v <= user_num <= max_v:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.SATISFIED,
                        explanation=f"Satisfied: Value ({user_num:,.0f}) is within eligible range ({min_v:,.0f} to {max_v:,.0f}).",
                        source_ref=rule.source_ref
                    )
                else:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.NOT_SATISFIED,
                        explanation=f"Condition not met: Value ({user_num:,.0f}) falls outside eligible range ({min_v:,.0f} to {max_v:,.0f}).",
                        source_ref=rule.source_ref
                    )

            elif op == "in":
                # List membership check
                expected_list = [str(x).strip().lower() for x in expected]
                user_str = str(user_val).strip().lower()
                if user_str in expected_list:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.SATISFIED,
                        explanation=f"Satisfied: '{user_val}' is in eligible target groups.",
                        source_ref=rule.source_ref
                    )
                else:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.NOT_SATISFIED,
                        explanation=f"Condition not met: '{user_val}' is not in eligible target groups ({', '.join(expected)}).",
                        source_ref=rule.source_ref
                    )

            elif op == "boolean_true":
                if bool(user_val) is True:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.SATISFIED,
                        explanation=f"Satisfied: Confirmed '{field_name.replace('_', ' ').title()}' is applicable.",
                        source_ref=rule.source_ref
                    )
                else:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.NOT_SATISFIED,
                        explanation=f"Condition not met: Requirement '{rule.description}' was indicated as False.",
                        source_ref=rule.source_ref
                    )

            elif op == "boolean_false":
                # Exclusion rule (must NOT be true)
                if bool(user_val) is False:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.SATISFIED,
                        explanation=f"Satisfied: Confirmed non-applicability of exclusion factor ({field_name.replace('_', ' ')}).",
                        source_ref=rule.source_ref
                    )
                else:
                    return CriterionEvaluation(
                        criterion_id=rule.id,
                        description=rule.description,
                        status=EvaluationStatus.NOT_SATISFIED,
                        explanation=f"Exclusion triggered: '{rule.description}'.",
                        source_ref=rule.source_ref
                    )

            else:
                return CriterionEvaluation(
                    criterion_id=rule.id,
                    description=rule.description,
                    status=EvaluationStatus.UNKNOWN,
                    explanation=f"Unsupported evaluation operator: {op}",
                    source_ref=rule.source_ref
                )

        except (ValueError, TypeError) as ex:
            logger.warning(f"Error evaluating rule {rule.id}: {ex}")
            return CriterionEvaluation(
                criterion_id=rule.id,
                description=rule.description,
                status=EvaluationStatus.UNKNOWN,
                explanation=f"Input type incompatibility for '{field_name}'.",
                source_ref=rule.source_ref
            )

    def evaluate_scheme(self, scheme: Scheme, profile: UserProfile) -> SchemeEligibilityResult:
        """Evaluates all rules for a given scheme and determines aggregate match status."""
        evaluations: List[CriterionEvaluation] = []
        missing_fields: List[str] = []

        # 1. State jurisdiction check if scheme is state-specific
        if scheme.government_level == "state" and scheme.state:
            state_rule = CriterionRule(
                id=f"{scheme.id}-STATE",
                field="state",
                operator="eq",
                value=scheme.state,
                description=f"Applicant must be a permanent resident of {scheme.state}.",
                source_ref="State Domicile Requirement"
            )
            state_eval = self.evaluate_criterion(state_rule, profile, scheme)
            evaluations.append(state_eval)
            if state_eval.status == EvaluationStatus.UNKNOWN:
                missing_fields.append("State of Residence")

        # 2. Evaluate all scheme specific rules
        for rule in scheme.eligibility_rules:
            # Skip duplicate state rule if already evaluated above
            if scheme.government_level == "state" and rule.field == "state":
                continue

            ev = self.evaluate_criterion(rule, profile, scheme)
            evaluations.append(ev)
            if ev.status == EvaluationStatus.UNKNOWN:
                missing_fields.append(rule.field.replace("_", " ").title())

        # 3. Aggregate tally
        satisfied_count = sum(1 for e in evaluations if e.status == EvaluationStatus.SATISFIED)
        not_satisfied_count = sum(1 for e in evaluations if e.status == EvaluationStatus.NOT_SATISFIED)
        unknown_count = sum(1 for e in evaluations if e.status == EvaluationStatus.UNKNOWN)
        total = len(evaluations)

        # 4. Deterministic status classification
        if not_satisfied_count > 0:
            status = OverallMatchStatus.NOT_ELIGIBLE
            match_score = 0.0
        elif unknown_count > 0:
            if satisfied_count > 0:
                status = OverallMatchStatus.CONDITIONALLY_ELIGIBLE
                match_score = round(satisfied_count / total, 2)
            else:
                status = OverallMatchStatus.UNKNOWN_MISSING_INFO
                match_score = 0.0
        else:
            status = OverallMatchStatus.POTENTIALLY_ELIGIBLE
            match_score = 1.0

        return SchemeEligibilityResult(
            scheme_id=scheme.id,
            scheme_name=scheme.name,
            category=scheme.category,
            government_level=scheme.government_level,
            status=status,
            satisfied_count=satisfied_count,
            not_satisfied_count=not_satisfied_count,
            unknown_count=unknown_count,
            criteria_evaluations=evaluations,
            missing_information=list(dict.fromkeys(missing_fields)),
            match_score=match_score,
            source_url=scheme.source_url
        )

    def evaluate_all(
        self,
        profile: UserProfile,
        scheme_ids: Optional[List[str]] = None
    ) -> EligibilityEvaluationResponse:
        """Evaluates citizen profile against all or selected schemes."""
        all_schemes = get_all_schemes()
        if scheme_ids:
            target_ids = {s.lower() for s in scheme_ids}
            schemes_to_eval = [s for s in all_schemes if s.id.lower() in target_ids]
        else:
            schemes_to_eval = all_schemes

        results: List[SchemeEligibilityResult] = []
        for scheme in schemes_to_eval:
            res = self.evaluate_scheme(scheme, profile)
            results.append(res)

        # Sort: Potentially eligible first, then conditionally eligible, then unknown, then not eligible
        order = {
            OverallMatchStatus.POTENTIALLY_ELIGIBLE: 0,
            OverallMatchStatus.CONDITIONALLY_ELIGIBLE: 1,
            OverallMatchStatus.UNKNOWN_MISSING_INFO: 2,
            OverallMatchStatus.NOT_ELIGIBLE: 3,
        }
        results.sort(key=lambda r: (order[r.status], -r.match_score))

        pot_count = sum(1 for r in results if r.status == OverallMatchStatus.POTENTIALLY_ELIGIBLE)
        cond_count = sum(1 for r in results if r.status == OverallMatchStatus.CONDITIONALLY_ELIGIBLE)
        unk_count = sum(1 for r in results if r.status == OverallMatchStatus.UNKNOWN_MISSING_INFO)
        not_count = sum(1 for r in results if r.status == OverallMatchStatus.NOT_ELIGIBLE)

        return EligibilityEvaluationResponse(
            results=results,
            evaluated_schemes_count=len(results),
            potentially_eligible_count=pot_count + cond_count,
            unknown_info_count=unk_count,
            not_eligible_count=not_count,
            disclaimer=DISCLAIMER_TEXT
        )


eligibility_engine = EligibilityEngine()
