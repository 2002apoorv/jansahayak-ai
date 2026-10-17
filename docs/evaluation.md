# JanSahayak AI — System Evaluation & Retrieval Benchmark

This report documents the measurable retrieval performance and deterministic eligibility validation for JanSahayak AI.

## 1. Retrieval Benchmark Methodology
- **Labelled Dataset:** 10 realistic citizen queries encompassing agriculture, health, housing, education, business, and women welfare.
- **Retriever 1 (Semantic):** Dense vectors generated using `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional) indexed via FAISS `IndexFlatIP` with L2-normalized cosine similarity.
- **Retriever 2 (Lexical Baseline):** Token-overlap keyword matching filtered with stopword removal.
- **Evaluation Cutoff:** Top-3 ($k=3$).

### Benchmark Results

| Metric | Semantic Retriever (FAISS) | Lexical Baseline (Token Overlap) | Difference |
| :--- | :---: | :---: | :---: |
| **Top-1 Accuracy** | **90.0%** | 80.0% | +10.0% |
| **Recall@3** | **90.0%** | 90.0% | +0.0% |
| **Precision@3** | **45.0%** | 41.7% | +3.3% |
| **Mean Reciprocal Rank (MRR)** | **0.900** | 0.833 | +0.067 |

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
