"""
JanSahayak AI — Retrieval Evaluation Benchmark
Compares Semantic Vector Retrieval (FAISS + all-MiniLM-L6-v2)
against Lexical Keyword Baseline across Recall@k, Precision@k, and MRR.
"""

import json
from pathlib import Path
from typing import Any, Dict, List
from app.services.retrieval_service import retrieval_service

# Labelled test set with realistic citizen queries and ground-truth scheme IDs
EVAL_DATASET = [
    {
        "query": "How much annual cash assistance do farmers get under DBT?",
        "expected_scheme_ids": ["PM-KISAN"],
        "category": "agriculture"
    },
    {
        "query": "Free health card for 5 lakh hospital surgery and treatment",
        "expected_scheme_ids": ["AB-PMJAY"],
        "category": "health"
    },
    {
        "query": "Government subsidy to build pucca concrete house for urban EWS family",
        "expected_scheme_ids": ["PMAY-U"],
        "category": "housing"
    },
    {
        "query": "Collateral free loan up to 10 lakh to start or expand small shop business",
        "expected_scheme_ids": ["PMMY-MUDRA"],
        "category": "business"
    },
    {
        "query": "College tuition fee waiver and maintenance allowance for SC student",
        "expected_scheme_ids": ["NSP-PMS-SC"],
        "category": "education"
    },
    {
        "query": "Urban street vendor 10000 working capital loan with 7 percent interest subsidy",
        "expected_scheme_ids": ["PM-SVANidhi"],
        "category": "business"
    },
    {
        "query": "Post office high interest savings scheme for girl child education",
        "expected_scheme_ids": ["SUKANYA-SAMRIDDHI"],
        "category": "women_child"
    },
    {
        "query": "Madhya Pradesh monthly 1250 rupees DBT transfer for women",
        "expected_scheme_ids": ["MP-LADLI-BEHNA"],
        "category": "women_child"
    },
    {
        "query": "Cashless hospitalization for poor families secondary tertiary care",
        "expected_scheme_ids": ["AB-PMJAY"],
        "category": "health"
    },
    {
        "query": "Kisan Samman Nidhi registration documents and 6000 rupees",
        "expected_scheme_ids": ["PM-KISAN"],
        "category": "agriculture"
    }
]


def evaluate_retriever(method_name: str, k: int = 3) -> Dict[str, float]:
    """Runs evaluation over the labelled dataset for a specific retrieval method."""
    hits_at_1 = 0
    total_recall = 0.0
    total_precision = 0.0
    reciprocal_ranks = []

    for item in EVAL_DATASET:
        query = item["query"]
        expected = set(item["expected_scheme_ids"])

        if method_name == "semantic":
            chunks = retrieval_service.search_semantic(query, top_k=k, threshold=0.15)
        else:
            chunks = retrieval_service.search_lexical(query, top_k=k)

        # Unique schemes retrieved in order
        retrieved_scheme_ids = []
        for c in chunks:
            if c.scheme_id not in retrieved_scheme_ids:
                retrieved_scheme_ids.append(c.scheme_id)

        # Hits@1
        if retrieved_scheme_ids and retrieved_scheme_ids[0] in expected:
            hits_at_1 += 1

        # Recall@k
        matching_retrieved = [s for s in retrieved_scheme_ids if s in expected]
        recall = len(matching_retrieved) / len(expected) if expected else 0.0
        total_recall += recall

        # Precision@k
        precision = len(matching_retrieved) / len(retrieved_scheme_ids) if retrieved_scheme_ids else 0.0
        total_precision += precision

        # Reciprocal Rank (MRR)
        rr = 0.0
        for rank, s_id in enumerate(retrieved_scheme_ids, start=1):
            if s_id in expected:
                rr = 1.0 / rank
                break
        reciprocal_ranks.append(rr)

    n = len(EVAL_DATASET)
    return {
        "top_1_accuracy": round(hits_at_1 / n, 4),
        f"recall_at_{k}": round(total_recall / n, 4),
        f"precision_at_{k}": round(total_precision / n, 4),
        "mrr": round(sum(reciprocal_ranks) / n, 4)
    }


def main():
    print("=" * 60)
    print("  JanSahayak AI — Retrieval Benchmark (Semantic vs Lexical)")
    print("=" * 60)

    # Ensure index is loaded
    retrieval_service.load_index()

    k = 3
    semantic_metrics = evaluate_retriever("semantic", k=k)
    lexical_metrics = evaluate_retriever("lexical", k=k)

    print(f"\nBenchmark Results across {len(EVAL_DATASET)} queries (Top-{k}):")
    print(f"{'Metric':<20} | {'Semantic (FAISS)':<18} | {'Lexical Baseline':<18}")
    print("-" * 62)
    print(f"{'Top-1 Accuracy':<20} | {semantic_metrics['top_1_accuracy'] * 100:>16.1f}% | {lexical_metrics['top_1_accuracy'] * 100:>16.1f}%")
    print(f"{f'Recall@{k}':<20} | {semantic_metrics[f'recall_at_{k}'] * 100:>16.1f}% | {lexical_metrics[f'recall_at_{k}'] * 100:>16.1f}%")
    print(f"{f'Precision@{k}':<20} | {semantic_metrics[f'precision_at_{k}'] * 100:>16.1f}% | {lexical_metrics[f'precision_at_{k}'] * 100:>16.1f}%")
    print(f"{'MRR':<20} | {semantic_metrics['mrr']:>18.3f} | {lexical_metrics['mrr']:>18.3f}")
    print("=" * 60)

    # Save to docs/evaluation.md
    docs_dir = Path(__file__).resolve().parent.parent / "docs"
    docs_dir.mkdir(exist_ok=True)
    eval_md = docs_dir / "evaluation.md"

    content = f"""# JanSahayak AI — System Evaluation & Retrieval Benchmark

This report documents the measurable retrieval performance and deterministic eligibility validation for JanSahayak AI.

## 1. Retrieval Benchmark Methodology
- **Labelled Dataset:** {len(EVAL_DATASET)} realistic citizen queries encompassing agriculture, health, housing, education, business, and women welfare.
- **Retriever 1 (Semantic):** Dense vectors generated using `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional) indexed via FAISS `IndexFlatIP` with L2-normalized cosine similarity.
- **Retriever 2 (Lexical Baseline):** Token-overlap keyword matching filtered with stopword removal.
- **Evaluation Cutoff:** Top-3 ($k=3$).

### Benchmark Results

| Metric | Semantic Retriever (FAISS) | Lexical Baseline (Token Overlap) | Difference |
| :--- | :---: | :---: | :---: |
| **Top-1 Accuracy** | **{semantic_metrics['top_1_accuracy'] * 100:.1f}%** | {lexical_metrics['top_1_accuracy'] * 100:.1f}% | +{(semantic_metrics['top_1_accuracy'] - lexical_metrics['top_1_accuracy']) * 100:.1f}% |
| **Recall@3** | **{semantic_metrics[f'recall_at_{k}'] * 100:.1f}%** | {lexical_metrics[f'recall_at_{k}'] * 100:.1f}% | +{(semantic_metrics[f'recall_at_{k}'] - lexical_metrics[f'recall_at_{k}']) * 100:.1f}% |
| **Precision@3** | **{semantic_metrics[f'precision_at_{k}'] * 100:.1f}%** | {lexical_metrics[f'precision_at_{k}'] * 100:.1f}% | +{(semantic_metrics[f'precision_at_{k}'] - lexical_metrics[f'precision_at_{k}']) * 100:.1f}% |
| **Mean Reciprocal Rank (MRR)** | **{semantic_metrics['mrr']:.3f}** | {lexical_metrics['mrr']:.3f} | +{(semantic_metrics['mrr'] - lexical_metrics['mrr']):.3f} |

## 2. Deterministic Eligibility Evaluation
Automated tests in `tests/test_backend.py` verified the 3-valued deterministic engine:
1. **Satisfied Conditions:** Evaluated rules where user attributes satisfy threshold (e.g. farmer with land and no tax -> `POTENTIALLY_ELIGIBLE`).
2. **Exclusion Criteria:** Evaluated negative constraints (e.g. farmer who pays income tax is classified as `NOT_ELIGIBLE` with 0.0 match score).
3. **Unknown Information:** When non-sensitive profile attributes are omitted, the engine returns `UNKNOWN` status and provides a transparent list of required missing fields without assuming pass/fail.
4. **Boundary Values:** Tested boundary values (e.g., family income of exactly ₹2,50,000 for Post-Matric SC scholarship passes `<= 250000`, while ₹2,50,001 fails).
5. **State Jurisdiction:** Tested domicile rules (e.g., MP Ladli Behna rejects non-residents and accepts MP residents).

## 3. Grounding and Citation Verification
- Grounded prompts enforce citing source labels (`[S1]`, `[S2]`).
- Citation validation intercepts the model output, matches labels against the retrieved chunks, strips unverified citations, and returns clickable official source URLs.
- In degraded mode, the system emits synthesized summaries directly from the verified records.
"""
    eval_md.write_text(content, encoding="utf-8")
    print(f"\nReport written to {eval_md}")


if __name__ == "__main__":
    main()
