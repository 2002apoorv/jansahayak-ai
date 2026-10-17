from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class EvaluationStatus(str, Enum):
    SATISFIED = "satisfied"
    NOT_SATISFIED = "not_satisfied"
    UNKNOWN = "unknown"


class OverallMatchStatus(str, Enum):
    POTENTIALLY_ELIGIBLE = "potentially_eligible"
    CONDITIONALLY_ELIGIBLE = "conditionally_eligible"
    NOT_ELIGIBLE = "not_eligible"
    UNKNOWN_MISSING_INFO = "unknown_missing_info"


class UserProfile(BaseModel):
    state: Optional[str] = Field(None, description="State or Union Territory of residence (e.g. Maharashtra, Uttar Pradesh)")
    age: Optional[int] = Field(None, ge=0, le=125, description="Age in completed years")
    gender: Optional[str] = Field(None, description="Gender: male, female, transgender, other")
    annual_family_income: Optional[float] = Field(None, ge=0, description="Annual family income in INR")
    occupation: Optional[str] = Field(None, description="farmer, student, artisan, small_business, self_employed, unemployed, salaried")
    is_student: Optional[bool] = Field(None, description="Whether currently enrolled in school, college, or university")
    education_level: Optional[str] = Field(None, description="Current education level: primary, secondary, higher_secondary, graduate, post_graduate, vocational")
    social_category: Optional[str] = Field(None, description="Category: General, OBC, SC, ST, EWS")
    is_differently_abled: Optional[bool] = Field(None, description="Whether certified with disability (PwD)")
    owns_agricultural_land: Optional[bool] = Field(None, description="Whether family owns cultivable agricultural land")
    owns_pucca_house: Optional[bool] = Field(None, description="Whether the applicant or family owns a permanent/pucca house")
    is_taxpayer: Optional[bool] = Field(None, description="Whether any family member pays institutional income tax")


class CriterionEvaluation(BaseModel):
    criterion_id: str
    description: str
    status: EvaluationStatus
    explanation: str
    source_ref: Optional[str] = None


class SchemeEligibilityResult(BaseModel):
    scheme_id: str
    scheme_name: str
    category: str
    government_level: str
    status: OverallMatchStatus
    satisfied_count: int
    not_satisfied_count: int
    unknown_count: int
    criteria_evaluations: List[CriterionEvaluation]
    missing_information: List[str]
    match_score: float = Field(0.0, description="Confidence ratio of satisfied over known required criteria")
    source_url: str


class EligibilityEvaluationRequest(BaseModel):
    profile: UserProfile
    scheme_ids: Optional[List[str]] = Field(None, description="Optional list of specific scheme IDs to evaluate; evaluates all if empty")


class EligibilityEvaluationResponse(BaseModel):
    results: List[SchemeEligibilityResult]
    evaluated_schemes_count: int
    potentially_eligible_count: int
    unknown_info_count: int
    not_eligible_count: int
    disclaimer: str
