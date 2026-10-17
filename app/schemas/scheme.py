from typing import Any, List, Optional
from pydantic import BaseModel, Field


class CriterionRule(BaseModel):
    id: str = Field(..., description="Unique identifier for this criterion rule")
    field: str = Field(..., description="Profile field being checked (e.g. age, income, state, student_status)")
    operator: str = Field(..., description="Comparison operator: eq, lte, gte, in, range, boolean_true, boolean_false")
    value: Any = Field(..., description="Threshold or target value(s) for comparison")
    description: str = Field(..., description="Human-readable condition description")
    source_ref: Optional[str] = Field(None, description="Official section or guideline citation reference")


class SchemeBenefit(BaseModel):
    title: str
    description: str
    amount: Optional[str] = None


class RequiredDocument(BaseModel):
    id: str
    name: str
    description: str
    mandatory: bool = True
    issuing_authority: Optional[str] = None
    alternatives: Optional[List[str]] = None


class Scheme(BaseModel):
    id: str = Field(..., description="Stable scheme identifier")
    name: str = Field(..., description="Official scheme name")
    short_name: Optional[str] = Field(None, description="Popular abbreviation or acronym")
    description: str = Field(..., description="Verified plain-language summary")
    category: str = Field(..., description="Category: agriculture, health, housing, education, business, social_security, women_child")
    government_level: str = Field("central", description="central or state")
    state: Optional[str] = Field(None, description="Specific Indian state/UT or null/all for nationwide")
    ministry: Optional[str] = Field(None, description="Administering Ministry or Department")
    benefits: List[SchemeBenefit] = Field(default_factory=list)
    eligibility_rules: List[CriterionRule] = Field(default_factory=list)
    required_documents: List[RequiredDocument] = Field(default_factory=list)
    application_steps: List[str] = Field(default_factory=list)
    application_url: Optional[str] = Field(None, description="Official portal application URL")
    source_title: str = Field(..., description="Official portal or gazette title")
    source_url: str = Field(..., description="Direct link to official government portal")
    source_published_date: Optional[str] = None
    last_checked_at: Optional[str] = None
    verified: bool = Field(True, description="True if verified from official government portals")
    tags: List[str] = Field(default_factory=list)


class SchemeSummary(BaseModel):
    id: str
    name: str
    short_name: Optional[str] = None
    category: str
    government_level: str
    state: Optional[str] = None
    description: str
    benefits_summary: Optional[str] = None
    application_url: Optional[str] = None
    source_title: str
    source_url: str
    verified: bool
    tags: List[str] = []
