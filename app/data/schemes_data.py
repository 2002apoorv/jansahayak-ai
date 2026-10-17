"""
Official Verified Indian Government Scheme Knowledge Base for JanSahayak AI.
All records have been compiled from primary government portals:
- myScheme (myscheme.gov.in)
- PM-KISAN (pmkisan.gov.in)
- PM-JAY / NHA (pmjay.gov.in / nha.gov.in)
- PMAY (pmaymis.gov.in / pmayg.nic.in)
- PMMY (mudra.org.in)
- NSP (scholarships.gov.in)
- PM SVANidhi (pmsvanidhi.mohua.gov.in)
- India Post / MoF (indiapost.gov.in)
- MP CM Ladli Behna (cmladlibehna.mp.gov.in)
"""

from typing import List
from app.schemas.scheme import Scheme, CriterionRule, SchemeBenefit, RequiredDocument

VERIFIED_SCHEMES: List[Scheme] = [
    Scheme(
        id="PM-KISAN",
        name="Pradhan Mantri Kisan Samman Nidhi",
        short_name="PM-KISAN",
        description="A Central Sector scheme to provide income support to all landholding farmer families across India to supplement their financial needs for agricultural inputs and domestic requirements.",
        category="agriculture",
        government_level="central",
        state=None,
        ministry="Ministry of Agriculture and Farmers Welfare",
        benefits=[
            SchemeBenefit(
                title="Direct Income Support",
                description="Financial benefit of Rs 6,000 per year payable in three equal four-monthly installments of Rs 2,000 each.",
                amount="Rs 6,000 / year"
            ),
            SchemeBenefit(
                title="Direct Benefit Transfer",
                description="Funds are transferred directly into the Aadhaar-seeded bank accounts of beneficiary farmers without intermediaries.",
                amount="Direct Bank Transfer"
            )
        ],
        eligibility_rules=[
            CriterionRule(
                id="PMKISAN-01",
                field="occupation",
                operator="eq",
                value="farmer",
                description="Applicant must be an operational farmer / agricultural cultivator.",
                source_ref="Operational Guidelines Para 2.1"
            ),
            CriterionRule(
                id="PMKISAN-02",
                field="owns_agricultural_land",
                operator="boolean_true",
                value=True,
                description="Applicant or farmer family must hold cultivable agricultural land in their name in state land records.",
                source_ref="Operational Guidelines Para 2.2"
            ),
            CriterionRule(
                id="PMKISAN-03",
                field="is_taxpayer",
                operator="boolean_false",
                value=False,
                description="Applicant or any family member must NOT have paid income tax in the last assessment year (Exclusion Criteria).",
                source_ref="Exclusion Criteria Para 3(b)"
            )
        ],
        required_documents=[
            RequiredDocument(
                id="DOC-PMK-01",
                name="Aadhaar Card",
                description="Mandatory identity verification card seeded with mobile number for e-KYC.",
                mandatory=True,
                issuing_authority="UIDAI"
            ),
            RequiredDocument(
                id="DOC-PMK-02",
                name="Land Ownership Records",
                description="Khasra/Khatauni or Record of Rights (RoR / 7/12 extract) showing clear cultivable land ownership.",
                mandatory=True,
                issuing_authority="State Revenue Department"
            ),
            RequiredDocument(
                id="DOC-PMK-03",
                name="Active Bank Account Passbook",
                description="Bank account linked with Aadhaar and enabled for NPCI Aadhaar Payment Bridge (APB).",
                mandatory=True,
                issuing_authority="Any Scheduled Commercial / Regional Rural Bank"
            )
        ],
        application_steps=[
            "Visit the official PM-KISAN portal (pmkisan.gov.in) and navigate to 'Farmers Corner'.",
            "Click on 'New Farmer Registration' and enter your Aadhaar number and state.",
            "Fill in personal details, land parcel identification (survey number, dag/khasra number, and area).",
            "Upload verified land record documents and submit the self-registration form.",
            "Complete mandatory OTP-based or biometric e-KYC on the portal or via Common Service Centre (CSC)."
        ],
        application_url="https://pmkisan.gov.in/RegistrationFormNew.aspx",
        source_title="PM-KISAN Scheme Guidelines & Operational Framework",
        source_url="https://pmkisan.gov.in/",
        source_published_date="2019-02-01",
        last_checked_at="2026-03-01",
        verified=True,
        tags=["farmers", "income_support", "agriculture", "dbt", "central"]
    ),
    Scheme(
        id="AB-PMJAY",
        name="Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
        short_name="PM-JAY",
        description="The world's largest government-funded health assurance scheme providing comprehensive cashless hospitalization cover for vulnerable families in secondary and tertiary care.",
        category="health",
        government_level="central",
        state=None,
        ministry="Ministry of Health and Family Welfare / National Health Authority",
        benefits=[
            SchemeBenefit(
                title="Cashless Hospitalization Cover",
                description="Free medical coverage up to Rs 5,00,000 per family per year on a family floater basis across empanelled public and private hospitals nationwide.",
                amount="Rs 5,00,000 / family / year"
            ),
            SchemeBenefit(
                title="Pre and Post Hospitalization Expenses",
                description="Covers up to 3 days of pre-hospitalization and 15 days of post-hospitalization diagnostics and medicines.",
                amount="Included"
            )
        ],
        eligibility_rules=[
            CriterionRule(
                id="PMJAY-01",
                field="annual_family_income",
                operator="lte",
                value=250000,
                description="Targeted at families belonging to deprived socio-economic categories as per SECC 2011 or NFSA state ration card thresholds.",
                source_ref="NHA Beneficiary Identification Criteria"
            ),
            CriterionRule(
                id="PMJAY-02",
                field="owns_pucca_house",
                operator="boolean_false",
                value=False,
                description="Family living in kuccha/temporary shelter or deprived conditions without ownership of a high-value urban house.",
                source_ref="Rural Deprivation Indicators D1-D7"
            )
        ],
        required_documents=[
            RequiredDocument(
                id="DOC-JAY-01",
                name="Aadhaar Card or Government Photo ID",
                description="For individual biometric identification at hospital helpdesk.",
                mandatory=True,
                issuing_authority="UIDAI / Election Commission"
            ),
            RequiredDocument(
                id="DOC-JAY-02",
                name="Ration Card or Family Identification Document",
                description="NFSA Ration Card or Samagra / State Family ID proving household composition.",
                mandatory=True,
                issuing_authority="State Food & Civil Supplies Department"
            )
        ],
        application_steps=[
            "Check your family eligibility online at beneficiary.nha.gov.in using mobile number, Aadhaar, or Ration Card.",
            "If eligible, visit any empanelled public or private hospital or nearest CSC/Arogya Mitra desk.",
            "Present your Aadhaar card and Ration card for e-KYC verification.",
            "Receive your official Ayushman Card (Golden Card) for instant cashless treatment."
        ],
        application_url="https://beneficiary.nha.gov.in/",
        source_title="National Health Authority - Ayushman Bharat PM-JAY Official Portal",
        source_url="https://pmjay.gov.in/",
        source_published_date="2018-09-23",
        last_checked_at="2026-03-01",
        verified=True,
        tags=["health", "hospitalization", "insurance", "cashless", "central"]
    ),
    Scheme(
        id="PMAY-U",
        name="Pradhan Mantri Awas Yojana - Urban",
        short_name="PMAY-U",
        description="A flagship Mission by the Government of India providing all-weather pucca houses to all eligible urban households including slum dwellers, EWS, and LIG categories.",
        category="housing",
        government_level="central",
        state=None,
        ministry="Ministry of Housing and Urban Affairs",
        benefits=[
            SchemeBenefit(
                title="Interest Subsidy & Construction Grant",
                description="Central assistance of Rs 1.5 Lakh under Beneficiary Led Construction (BLC) or interest subsidy under Credit Linked Subsidy Scheme (CLSS).",
                amount="Rs 1,50,000 to Rs 2,67,000"
            ),
            SchemeBenefit(
                title="Basic Civic Infrastructure",
                description="Houses built with attached toilet, water supply, electricity connection, and kitchen space.",
                amount="Infrastructure included"
            )
        ],
        eligibility_rules=[
            CriterionRule(
                id="PMAY-01",
                field="owns_pucca_house",
                operator="boolean_false",
                value=False,
                description="The beneficiary family must NOT own a pucca (all-weather concrete) house either in their name or in any family member's name anywhere in India.",
                source_ref="PMAY Guidelines Para 1.3"
            ),
            CriterionRule(
                id="PMAY-02",
                field="annual_family_income",
                operator="lte",
                value=600000,
                description="Household annual income must fall within Economically Weaker Section (EWS, up to Rs 3 Lakh) or Low Income Group (LIG, up to Rs 6 Lakh).",
                source_ref="PMAY Income Ceiling Classification"
            )
        ],
        required_documents=[
            RequiredDocument(
                id="DOC-PMA-01",
                name="Aadhaar Card of all Family Members",
                description="Biometric identity proof for household deduplication.",
                mandatory=True,
                issuing_authority="UIDAI"
            ),
            RequiredDocument(
                id="DOC-PMA-02",
                name="Income Certificate or Form 16 / Salary Slips",
                description="Proof of household annual income below qualifying limits.",
                mandatory=True,
                issuing_authority="Revenue Authority / Tehsildar"
            ),
            RequiredDocument(
                id="DOC-PMA-03",
                name="Land / House Plot Ownership Document",
                description="For Beneficiary Led Construction: Registered sale deed or Patta showing ownership of plot.",
                mandatory=False,
                issuing_authority="Municipal Corporation / Sub-Registrar"
            )
        ],
        application_steps=[
            "Visit the official PMAY portal (pmaymis.gov.in) under Citizen Assessment.",
            "Choose your category: 'For Slum Dwellers' or 'Benefit under other 3 components'.",
            "Verify with your Aadhaar number and applicant name as per Aadhaar.",
            "Fill in personal, bank account, household income, and existing housing status details.",
            "Submit and take printout of the application assessment acknowledgment number for municipal verification."
        ],
        application_url="https://pmaymis.gov.in/",
        source_title="Ministry of Housing and Urban Affairs - PMAY Guidelines",
        source_url="https://pmaymis.gov.in/",
        source_published_date="2015-06-25",
        last_checked_at="2026-03-01",
        verified=True,
        tags=["housing", "urban", "pucca_house", "subsidy", "central"]
    ),
    Scheme(
        id="PMMY-MUDRA",
        name="Pradhan Mantri Mudra Yojana",
        short_name="PMMY",
        description="Provides collateral-free institutional micro-credit up to Rs 10 Lakh (expanded up to Rs 20 Lakh) to non-corporate, non-farm small and micro enterprises for income-generating activities.",
        category="business",
        government_level="central",
        state=None,
        ministry="Ministry of Finance, Department of Financial Services",
        benefits=[
            SchemeBenefit(
                title="Collateral-Free Institutional Loan",
                description="Loans without requirement of mortgaged property across three tiers: Shishu (up to Rs 50,000), Kishore (Rs 50,000 to Rs 5 Lakh), and Tarun (Rs 5 Lakh to Rs 10 Lakh).",
                amount="Up to Rs 10,00,000 (Tarun)"
            ),
            SchemeBenefit(
                title="Mudra Debit Card",
                description="Provides working capital overdraft facility for seamless digital raw material procurement.",
                amount="Pre-approved limit"
            )
        ],
        eligibility_rules=[
            CriterionRule(
                id="MUDRA-01",
                field="age",
                operator="gte",
                value=18,
                description="Applicant must be at least 18 years of age.",
                source_ref="Mudra Lending Framework Para 4"
            ),
            CriterionRule(
                id="MUDRA-02",
                field="occupation",
                operator="in",
                value=["small_business", "artisan", "self_employed", "farmer"],
                description="Must operate or plan to launch a non-farm micro enterprise, manufacturing unit, trading shop, or service business.",
                source_ref="Target Beneficiary Norms"
            )
        ],
        required_documents=[
            RequiredDocument(
                id="DOC-MUD-01",
                name="Proof of Identity & Address",
                description="Aadhaar, Voter ID, PAN card, or Driving License.",
                mandatory=True,
                issuing_authority="UIDAI / Government of India"
            ),
            RequiredDocument(
                id="DOC-MUD-02",
                name="Business Project Plan / Quotation",
                description="Details of machinery to purchase, anticipated cash flow, and cost of enterprise expansion.",
                mandatory=True,
                issuing_authority="Self-prepared / Equipment Supplier"
            ),
            RequiredDocument(
                id="DOC-MUD-03",
                name="Bank Statement (Past 6 Months)",
                description="Showing financial transactions and creditworthiness.",
                mandatory=False,
                issuing_authority="Applicant's Bank"
            )
        ],
        application_steps=[
            "Prepare a basic business plan stating equipment costs, working capital needs, and revenue projections.",
            "Choose loan category: Shishu (initial setup), Kishore (growing shop), or Tarun (established enterprise).",
            "Apply online through the Udyamimitra portal (udyamimitra.in) or visit any commercial bank or MFI branch.",
            "Submit completed MUDRA application form along with KYC and equipment quotation documents.",
            "Upon sanction, receive loan disbursement and MUDRA debit card."
        ],
        application_url="https://www.udyamimitra.in/",
        source_title="Micro Units Development & Refinance Agency (MUDRA) Charter",
        source_url="https://www.mudra.org.in/",
        source_published_date="2015-04-08",
        last_checked_at="2026-03-01",
        verified=True,
        tags=["business", "msme", "loan", "collateral_free", "central"]
    ),
    Scheme(
        id="NSP-PMS-SC",
        name="Post-Matric Scholarship Scheme for SC Students",
        short_name="NSP Post-Matric SC",
        description="Centrally Sponsored Scheme to provide financial assistance to Scheduled Caste students studying at post-matriculation or post-secondary stage to enable them to complete their education.",
        category="education",
        government_level="central",
        state=None,
        ministry="Ministry of Social Justice and Empowerment",
        benefits=[
            SchemeBenefit(
                title="Full Compulsory Tuition Fee Reimbursement",
                description="100% non-refundable fees (tuition, library, examination, sports fees) credited directly to institution or student account.",
                amount="Full tuition reimbursement"
            ),
            SchemeBenefit(
                title="Monthly Academic Maintenance Allowance",
                description="Academic allowance ranging from Rs 2,500 to Rs 13,500 per annum depending on course group (Degree/Professional/Diploma).",
                amount="Rs 2,500 to Rs 13,500 / year"
            )
        ],
        eligibility_rules=[
            CriterionRule(
                id="SC-SCHOL-01",
                field="is_student",
                operator="boolean_true",
                value=True,
                description="Applicant must be enrolled as a regular student in a recognized post-matric course (Class 11, 12, ITI, Diploma, UG, PG, Ph.D.).",
                source_ref="Scheme Guidelines Clause III"
            ),
            CriterionRule(
                id="SC-SCHOL-02",
                field="social_category",
                operator="eq",
                value="SC",
                description="Student must belong to a notified Scheduled Caste community.",
                source_ref="Scheme Guidelines Clause II(a)"
            ),
            CriterionRule(
                id="SC-SCHOL-03",
                field="annual_family_income",
                operator="lte",
                value=250000,
                description="Total combined family annual income from all sources must NOT exceed Rs 2.50 Lakh per annum.",
                source_ref="Income Ceiling Clause IV"
            )
        ],
        required_documents=[
            RequiredDocument(
                id="DOC-SCH-01",
                name="Caste Certificate (SC)",
                description="Valid digitally signed caste certificate in applicant's name issued by competent revenue authority.",
                mandatory=True,
                issuing_authority="Tehsildar / Sub-Divisional Magistrate"
            ),
            RequiredDocument(
                id="DOC-SCH-02",
                name="Income Certificate",
                description="Current annual income certificate for parents/guardians.",
                mandatory=True,
                issuing_authority="Competent Revenue Officer"
            ),
            RequiredDocument(
                id="DOC-SCH-03",
                name="Bonafide Student Certificate & Fee Receipt",
                description="Issued by the college/university confirming current enrollment and fee schedule.",
                mandatory=True,
                issuing_authority="Head of Educational Institution"
            ),
            RequiredDocument(
                id="DOC-SCH-04",
                name="Previous Year Marksheet",
                description="Passing mark certificate of Matriculation (Class 10) or qualifying examination.",
                mandatory=True,
                issuing_authority="State Education Board / University"
            )
        ],
        application_steps=[
            "Visit the National Scholarship Portal (scholarships.gov.in) and register for an OTR (One Time Registration).",
            "Login with OTR credentials and select 'Post Matric Scholarship for SC Students'.",
            "Select your college/institution from the AISHE/DISE registered list.",
            "Upload caste certificate, income certificate, and previous year academic marksheet.",
            "Submit application for online verification by your College Nodal Officer (INO) and District Nodal Officer (DNO)."
        ],
        application_url="https://scholarships.gov.in/",
        source_title="Ministry of Social Justice & Empowerment - Post-Matric Scholarship Guidelines",
        source_url="https://scholarships.gov.in/",
        source_published_date="2020-12-23",
        last_checked_at="2026-03-01",
        verified=True,
        tags=["education", "scholarship", "sc", "post_matric", "students", "central"]
    ),
    Scheme(
        id="PM-SVANIDHI",
        name="PM Street Vendor's AtmaNirbhar Nidhi",
        short_name="PM SVANidhi",
        description="A Central Sector micro-credit scheme launched to empower urban street vendors by providing collateral-free working capital loans and incentivizing digital transactions.",
        category="business",
        government_level="central",
        state=None,
        ministry="Ministry of Housing and Urban Affairs",
        benefits=[
            SchemeBenefit(
                title="Graduated Working Capital Credit",
                description="First tranche loan of Rs 10,000; on timely repayment eligible for second tranche of Rs 20,000, and third tranche up to Rs 50,000.",
                amount="Rs 10,000 to Rs 50,000"
            ),
            SchemeBenefit(
                title="7% Interest Subsidy & Digital Cashback",
                description="Early or timely repayment receives 7% p.a. interest subsidy credited directly to bank account, plus up to Rs 1,200 annual cashback on digital QR payments.",
                amount="7% interest subsidy"
            )
        ],
        eligibility_rules=[
            CriterionRule(
                id="SVANIDHI-01",
                field="age",
                operator="gte",
                value=18,
                description="Applicant must be at least 18 years old.",
                source_ref="Scheme Framework Section 3"
            ),
            CriterionRule(
                id="SVANIDHI-02",
                field="occupation",
                operator="in",
                value=["artisan", "small_business", "self_employed"],
                description="Must be engaged in vending goods, services, food, or apparel in urban or surrounding rural areas.",
                source_ref="Beneficiary Definition Clause 2"
            )
        ],
        required_documents=[
            RequiredDocument(
                id="DOC-SVA-01",
                name="Certificate of Vending (CoV) / Vendor ID Card",
                description="Issued by the Urban Local Body (ULB) / Town Vending Committee (TVC), or Letter of Recommendation (LoR).",
                mandatory=True,
                issuing_authority="Municipal Corporation / ULB"
            ),
            RequiredDocument(
                id="DOC-SVA-02",
                name="Aadhaar Card",
                description="Linked to active mobile number for digital application validation.",
                mandatory=True,
                issuing_authority="UIDAI"
            ),
            RequiredDocument(
                id="DOC-SVA-03",
                name="Bank Account Details / Passbook",
                description="Account in any commercial bank, regional rural bank, or cooperative bank.",
                mandatory=True,
                issuing_authority="Bank Branch"
            )
        ],
        application_steps=[
            "Verify your vendor status or obtain a Letter of Recommendation (LoR) from your local municipality / TVC.",
            "Go to the PM SVANidhi portal (pmsvanidhi.mohua.gov.in) and click 'Apply for Loan'.",
            "Authenticate with your Aadhaar-linked mobile OTP.",
            "Select the preferred lending institution and submit the loan request.",
            "Bank verifies and disburses the credit directly into your bank account."
        ],
        application_url="https://pmsvanidhi.mohua.gov.in/",
        source_title="Ministry of Housing and Urban Affairs - PM SVANidhi Guidelines",
        source_url="https://pmsvanidhi.mohua.gov.in/",
        source_published_date="2020-06-01",
        last_checked_at="2026-03-01",
        verified=True,
        tags=["street_vendors", "working_capital", "microcredit", "urban", "central"]
    ),
    Scheme(
        id="SUKANYA-SAMRIDDHI",
        name="Sukanya Samriddhi Yojana",
        short_name="SSY",
        description="A Government of India backed small-deposit savings scheme targeted at parents of girl children under the 'Beti Bachao Beti Padhao' campaign, offering sovereign guarantees and tax exemptions.",
        category="women_child",
        government_level="central",
        state=None,
        ministry="Ministry of Finance / Department of Posts",
        benefits=[
            SchemeBenefit(
                title="High Sovereign Interest Rate",
                description="One of the highest government savings interest rates (~8.2% per annum, compounded annually).",
                amount="~8.2% p.a. sovereign interest"
            ),
            SchemeBenefit(
                title="Triple Tax Exemption (EEE)",
                description="Deposits qualify for tax deduction under Section 80C, interest earned is tax-free, and maturity withdrawal is completely exempt from income tax.",
                amount="Tax-free maturity"
            )
        ],
        eligibility_rules=[
            CriterionRule(
                id="SSY-01",
                field="gender",
                operator="eq",
                value="female",
                description="The child for whom the account is opened must be female.",
                source_ref="Government Savings Promotion Act Rule 3"
            ),
            CriterionRule(
                id="SSY-02",
                field="age",
                operator="lte",
                value=10,
                description="The girl child must not have attained 10 years of age on the date of account opening.",
                source_ref="Rules for Account Opening Para 4(1)"
            )
        ],
        required_documents=[
            RequiredDocument(
                id="DOC-SSY-01",
                name="Birth Certificate of Girl Child",
                description="Official birth certificate issued by municipal body or registrar of births.",
                mandatory=True,
                issuing_authority="Municipal Registrar of Births & Deaths"
            ),
            RequiredDocument(
                id="DOC-SSY-02",
                name="Identity & Residence Proof of Guardian",
                description="Aadhaar card, PAN card, or Passport of biological or legal guardian.",
                mandatory=True,
                issuing_authority="Government of India"
            )
        ],
        application_steps=[
            "Collect Sukanya Samriddhi Account Opening Form (Form-1) from any Post Office or authorized commercial bank.",
            "Attach child's birth certificate and guardian's KYC identity and address proof documents.",
            "Deposit the minimum initial opening amount (minimum Rs 250, maximum Rs 1.5 Lakh per fiscal year).",
            "Collect the SSY passbook with unique account number for subsequent deposits and tracking."
        ],
        application_url="https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx",
        source_title="Department of Posts, Ministry of Communications - Sukanya Samriddhi Rules",
        source_url="https://www.indiapost.gov.in/",
        source_published_date="2015-01-22",
        last_checked_at="2026-03-01",
        verified=True,
        tags=["girl_child", "savings", "tax_saving", "education", "central"]
    ),
    Scheme(
        id="MP-LADLI-BEHNA",
        name="Mukhyamantri Ladli Behna Yojana (Madhya Pradesh)",
        short_name="Ladli Behna MP",
        description="A major state initiative by the Government of Madhya Pradesh to foster economic self-reliance, nutritional security, and decision-making power for women in the state.",
        category="women_child",
        government_level="state",
        state="Madhya Pradesh",
        ministry="Department of Women and Child Development, Government of Madhya Pradesh",
        benefits=[
            SchemeBenefit(
                title="Monthly Direct Financial Assistance",
                description="Rs 1,250 deposited directly every month on the 10th into the beneficiary's individual DBT-enabled bank account.",
                amount="Rs 1,250 / month (Rs 15,000 / year)"
            )
        ],
        eligibility_rules=[
            CriterionRule(
                id="MP-LB-01",
                field="state",
                operator="eq",
                value="Madhya Pradesh",
                description="Must be a permanent resident of Madhya Pradesh state.",
                source_ref="Scheme Notification Gazette Section 2"
            ),
            CriterionRule(
                id="MP-LB-02",
                field="gender",
                operator="eq",
                value="female",
                description="Must be female (married, widowed, divorced, or deserted).",
                source_ref="Eligibility Norms Section 3(a)"
            ),
            CriterionRule(
                id="MP-LB-03",
                field="age",
                operator="range",
                value=[21, 60],
                description="Age must be between 21 and 60 completed years as of January 1 of the calendar year.",
                source_ref="Eligibility Norms Section 3(b)"
            ),
            CriterionRule(
                id="MP-LB-04",
                field="annual_family_income",
                operator="lte",
                value=250000,
                description="Combined family annual income must be less than Rs 2.50 Lakh.",
                source_ref="Exclusion Criteria Rule 4(1)"
            ),
            CriterionRule(
                id="MP-LB-05",
                field="is_taxpayer",
                operator="boolean_false",
                value=False,
                description="No member of the applicant's family must be an income tax payer.",
                source_ref="Exclusion Criteria Rule 4(2)"
            )
        ],
        required_documents=[
            RequiredDocument(
                id="DOC-MLB-01",
                name="Samagra Family ID & Member ID",
                description="9-digit individual Samagra ID with active e-KYC linked to Aadhaar.",
                mandatory=True,
                issuing_authority="Panchayat & Rural Development / Urban Administration MP"
            ),
            RequiredDocument(
                id="DOC-MLB-02",
                name="Aadhaar Card with Mobile Linkage",
                description="Must have updated biometric and active mobile OTP.",
                mandatory=True,
                issuing_authority="UIDAI"
            ),
            RequiredDocument(
                id="DOC-MLB-03",
                name="Individual DBT-enabled Bank Account",
                description="Personal bank account linked to Aadhaar NPCI mapper for Direct Benefit Transfer.",
                mandatory=True,
                issuing_authority="Bank Branch"
            )
        ],
        application_steps=[
            "Ensure Samagra e-KYC is completed and bank account is NPCI-seeded for DBT.",
            "Attend designated Gram Panchayat / Ward Level camp or CSC in Madhya Pradesh.",
            "Officials register application on cmladlibehna.mp.gov.in using biometric / mobile OTP authentication.",
            "Receive printed acknowledgment receipt and verify provisional list published at Gram Panchayat."
        ],
        application_url="https://cmladlibehna.mp.gov.in/",
        source_title="Government of Madhya Pradesh - Mukhyamantri Ladli Behna Yojana Portal",
        source_url="https://cmladlibehna.mp.gov.in/",
        source_published_date="2023-03-05",
        last_checked_at="2026-03-01",
        verified=True,
        tags=["women", "madhya_pradesh", "dbt", "income_support", "state"]
    )
]


def get_all_schemes() -> List[Scheme]:
    """Return all verified schemes."""
    return VERIFIED_SCHEMES


def get_scheme_by_id(scheme_id: str) -> Scheme | None:
    """Find a scheme by its unique identifier."""
    for scheme in VERIFIED_SCHEMES:
        if scheme.id.lower() == scheme_id.lower():
            return scheme
    return None
