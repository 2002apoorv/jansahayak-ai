export interface SchemeBenefit {
  title: string;
  description: string;
  amount?: string;
}

export interface CriterionRule {
  id: string;
  field: string;
  operator: string;
  value: any;
  description: string;
  source_ref?: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  issuing_authority?: string;
  alternatives?: string[];
}

export interface Scheme {
  id: string;
  name: string;
  short_name?: string;
  description: string;
  category: string;
  government_level: 'central' | 'state';
  state?: string | null;
  ministry?: string;
  benefits: SchemeBenefit[];
  eligibility_rules: CriterionRule[];
  required_documents: RequiredDocument[];
  application_steps: string[];
  application_url?: string;
  source_title: string;
  source_url: string;
  source_published_date?: string;
  last_checked_at?: string;
  verified: boolean;
  tags: string[];
}

export interface SchemeSummary {
  id: string;
  name: string;
  short_name?: string;
  category: string;
  government_level: string;
  state?: string;
  description: string;
  benefits_summary?: string;
  application_url?: string;
  source_title: string;
  source_url: string;
  verified: boolean;
  tags: string[];
}

export interface UserProfile {
  state?: string;
  age?: number;
  gender?: string;
  annual_family_income?: number;
  occupation?: string;
  is_student?: boolean;
  education_level?: string;
  social_category?: string;
  is_differently_abled?: boolean;
  owns_agricultural_land?: boolean;
  owns_pucca_house?: boolean;
  is_taxpayer?: boolean;
}

export type EvaluationStatus = 'satisfied' | 'not_satisfied' | 'unknown';
export type OverallMatchStatus = 'potentially_eligible' | 'conditionally_eligible' | 'not_eligible' | 'unknown_missing_info';

export interface CriterionEvaluation {
  criterion_id: string;
  description: string;
  status: EvaluationStatus;
  explanation: string;
  source_ref?: string;
}

export interface SchemeEligibilityResult {
  scheme_id: string;
  scheme_name: string;
  category: string;
  government_level: string;
  status: OverallMatchStatus;
  satisfied_count: number;
  not_satisfied_count: number;
  unknown_count: number;
  criteria_evaluations: CriterionEvaluation[];
  missing_information: string[];
  match_score: number;
  source_url: string;
}

export interface EligibilityEvaluationResponse {
  results: SchemeEligibilityResult[];
  evaluated_schemes_count: number;
  potentially_eligible_count: number;
  unknown_info_count: number;
  not_eligible_count: number;
  disclaimer: string;
}

export interface ValidatedCitation {
  citation_label: string;
  scheme_id: string;
  scheme_name: string;
  source_title: string;
  source_url: string;
  relevance_snippet?: string;
}

export interface RetrievedChunk {
  chunk_id: string;
  scheme_id: string;
  scheme_name: string;
  category: string;
  content: string;
  source_title: string;
  source_url: string;
  similarity_score: number;
  verified: boolean;
  retrieval_method: string;
}

export interface AskResponse {
  question: string;
  answer: string;
  citations: ValidatedCitation[];
  retrieved_sources: RetrievedChunk[];
  model_used: string;
  degraded_mode: boolean;
  confidence_warning?: string;
  disclaimer: string;
}

export interface CategoryMeta {
  id: string;
  label: string;
  icon: string;
  description: string;
  scheme_count: number;
}
