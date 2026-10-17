# JanSahayak AI — Data Sources & Verification Policy

## 1. Provenance Policy

JanSahayak AI maintains a strict evidence-first data policy. Fictional demo records are completely eliminated from production knowledge indices. Every scheme indexed in the application must satisfy:
1. **Primary Origin:** Curated directly from official Union Ministry gazettes, State Government notifications, or designated portals (`.gov.in` and `.nic.in` domains).
2. **Deterministic Extractability:** Eligibility conditions must be expressible as discrete, verifiable logical rules.
3. **Official Actionability:** Must include a valid, live public portal URL for citizen enrollment or clear physical camp instructions.

---

## 2. Verified Schemes Knowledge Base

| Scheme ID | Scheme Name | Level / State | Administering Ministry / Dept | Primary Source URL |
| :--- | :--- | :--- | :--- | :--- |
| **PM-KISAN** | Pradhan Mantri Kisan Samman Nidhi | Central | Ministry of Agriculture & Farmers Welfare | [pmkisan.gov.in](https://pmkisan.gov.in/) |
| **AB-PMJAY** | Ayushman Bharat PM Jan Arogya Yojana | Central | National Health Authority / MoHFW | [pmjay.gov.in](https://pmjay.gov.in/) |
| **PMAY-U** | Pradhan Mantri Awas Yojana (Urban) | Central | Ministry of Housing & Urban Affairs | [pmaymis.gov.in](https://pmaymis.gov.in/) |
| **PMMY-MUDRA** | Pradhan Mantri Mudra Yojana | Central | Department of Financial Services, MoF | [mudra.org.in](https://www.mudra.org.in/) |
| **NSP-PMS-SC** | Post-Matric Scholarship for SC Students | Central | Ministry of Social Justice & Empowerment | [scholarships.gov.in](https://scholarships.gov.in/) |
| **PM-SVANIDHI** | PM Street Vendor's AtmaNirbhar Nidhi | Central | Ministry of Housing & Urban Affairs | [pmsvanidhi.mohua.gov.in](https://pmsvanidhi.mohua.gov.in/) |
| **SUKANYA-SAMRIDDHI** | Sukanya Samriddhi Yojana (SSA) | Central | Department of Posts / Ministry of Finance | [indiapost.gov.in](https://www.indiapost.gov.in/) |
| **MP-LADLI-BEHNA** | Mukhyamantri Ladli Behna Yojana | State (MP) | Dept of Women & Child Development, MP | [cmladlibehna.mp.gov.in](https://cmladlibehna.mp.gov.in/) |

---

## 3. Adding New Schemes

To incorporate a new Central or State scheme into JanSahayak AI:

1. **Add Structured Schema in `app/data/schemes_data.py`:**
   ```python
   Scheme(
       id="STATE-XYZ",
       name="Official Scheme Name",
       category="agriculture",  # education, health, housing, business, women_child
       government_level="state", # or "central"
       state="State Name",
       benefits=[...],
       eligibility_rules=[
           CriterionRule(id="XYZ-01", field="age", operator="gte", value=18, description="..."),
           CriterionRule(id="XYZ-02", field="annual_family_income", operator="lte", value=300000, description="...")
       ],
       required_documents=[...],
       application_steps=[...],
       source_title="Official Gazette Title",
       source_url="https://...",
       verified=True
   )
   ```

2. **Add Raw Reference Text in `data/raw/`:**
   Save the plain-text operational guidelines or PDF in `data/raw/scheme_name_guidelines.txt`.

3. **Rebuild Knowledge Base & Vector Index:**
   ```powershell
   python -m app.ingest
   ```
   The ingestion CLI automatically extracts text, chunks with overlap, attaches metadata, and updates the FAISS vector index.
