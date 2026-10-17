import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch

from app.main import app
from app.schemas.eligibility import EvaluationStatus, OverallMatchStatus, UserProfile
from app.services.eligibility_service import eligibility_engine
from app.data.schemes_data import get_scheme_by_id

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "JanSahayak AI"
    assert data["status"] == "operational"


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["total_schemes"] >= 8
    assert "ai_status" in data


def test_list_schemes():
    response = client.get("/api/schemes")
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) >= 8
    first = schemes[0]
    assert "id" in first
    assert "name" in first
    assert "category" in first
    assert "source_url" in first


def test_get_scheme_by_id():
    response = client.get("/api/schemes/PM-KISAN")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "PM-KISAN"
    assert len(data["benefits"]) > 0
    assert len(data["eligibility_rules"]) > 0
    assert len(data["required_documents"]) > 0


def test_get_nonexistent_scheme():
    response = client.get("/api/schemes/NONEXISTENT-XYZ")
    assert response.status_code == 404


def test_get_categories():
    response = client.get("/api/categories")
    assert response.status_code == 200
    cats = response.json()
    assert len(cats) >= 6
    cat_ids = [c["id"] for c in cats]
    assert "agriculture" in cat_ids
    assert "health" in cat_ids
    assert "business" in cat_ids


def test_search_schemes():
    response = client.post("/api/schemes/search", json={"query": "farmer crop income subsidy", "top_k": 3})
    assert response.status_code == 200
    data = response.json()
    assert data["results_count"] > 0
    scheme_ids = [r["scheme"]["id"] for r in data["results"]]
    assert "PM-KISAN" in scheme_ids


# -------------------------------------------------------------
# DETERMINISTIC ELIGIBILITY TESTS (Satisfied, Not Satisfied, Unknown)
# -------------------------------------------------------------

def test_eligibility_pm_kisan_satisfied():
    scheme = get_scheme_by_id("PM-KISAN")
    profile = UserProfile(
        occupation="farmer",
        owns_agricultural_land=True,
        is_taxpayer=False
    )
    result = eligibility_engine.evaluate_scheme(scheme, profile)
    assert result.status == OverallMatchStatus.POTENTIALLY_ELIGIBLE
    assert result.satisfied_count == 3
    assert result.not_satisfied_count == 0
    assert result.unknown_count == 0
    assert result.match_score == 1.0


def test_eligibility_pm_kisan_not_satisfied_exclusion():
    scheme = get_scheme_by_id("PM-KISAN")
    # Farmer who pays income tax (violates exclusion criterion)
    profile = UserProfile(
        occupation="farmer",
        owns_agricultural_land=True,
        is_taxpayer=True
    )
    result = eligibility_engine.evaluate_scheme(scheme, profile)
    assert result.status == OverallMatchStatus.NOT_ELIGIBLE
    assert result.not_satisfied_count >= 1
    assert result.match_score == 0.0


def test_eligibility_pm_kisan_unknown_missing_info():
    scheme = get_scheme_by_id("PM-KISAN")
    # Missing information: land ownership and tax status not provided
    profile = UserProfile(occupation="farmer")
    result = eligibility_engine.evaluate_scheme(scheme, profile)
    assert result.status == OverallMatchStatus.CONDITIONALLY_ELIGIBLE
    assert result.satisfied_count == 1
    assert result.unknown_count == 2
    assert "Owns Agricultural Land" in result.missing_information
    assert "Is Taxpayer" in result.missing_information


def test_eligibility_boundary_conditions():
    scheme = get_scheme_by_id("NSP-PMS-SC")
    # Ceiling is 250,000. Exactly 250,000 should be SATISFIED (lte)
    profile_boundary = UserProfile(
        is_student=True,
        social_category="SC",
        annual_family_income=250000
    )
    result_boundary = eligibility_engine.evaluate_scheme(scheme, profile_boundary)
    assert result_boundary.status == OverallMatchStatus.POTENTIALLY_ELIGIBLE

    # 250,001 should be NOT_SATISFIED
    profile_over = UserProfile(
        is_student=True,
        social_category="SC",
        annual_family_income=250001
    )
    result_over = eligibility_engine.evaluate_scheme(scheme, profile_over)
    assert result_over.status == OverallMatchStatus.NOT_ELIGIBLE


def test_eligibility_state_jurisdiction():
    scheme = get_scheme_by_id("MP-LADLI-BEHNA")
    # Resident of Maharashtra applying for MP state scheme
    profile_other_state = UserProfile(
        state="Maharashtra",
        gender="female",
        age=30,
        annual_family_income=150000,
        is_taxpayer=False
    )
    result = eligibility_engine.evaluate_scheme(scheme, profile_other_state)
    assert result.status == OverallMatchStatus.NOT_ELIGIBLE

    # Resident of Madhya Pradesh
    profile_mp = UserProfile(
        state="Madhya Pradesh",
        gender="female",
        age=30,
        annual_family_income=150000,
        is_taxpayer=False
    )
    result_mp = eligibility_engine.evaluate_scheme(scheme, profile_mp)
    assert result_mp.status == OverallMatchStatus.POTENTIALLY_ELIGIBLE


def test_api_evaluate_eligibility_endpoint():
    response = client.post(
        "/api/eligibility/evaluate",
        json={
            "profile": {
                "occupation": "farmer",
                "owns_agricultural_land": True,
                "is_taxpayer": False
            },
            "scheme_ids": ["PM-KISAN"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["evaluated_schemes_count"] == 1
    assert data["results"][0]["scheme_id"] == "PM-KISAN"
    assert data["results"][0]["status"] == "potentially_eligible"


def test_api_ask_endpoint():
    # Test grounded Q&A with live or degraded fallback
    response = client.post(
        "/api/ask",
        json={"question": "What is the annual financial support provided under PM-KISAN?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["answer"]) > 10
    assert len(data["citations"]) > 0
    assert data["disclaimer"] is not None
