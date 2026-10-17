import type {
  AskResponse,
  CategoryMeta,
  EligibilityEvaluationResponse,
  Scheme,
  SchemeSummary,
  UserProfile,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = 'API request failed';
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = `HTTP ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  async getSchemes(params?: {
    category?: string;
    state?: string;
    level?: string;
    search?: string;
  }): Promise<SchemeSummary[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.state) query.append('state', params.state);
    if (params?.level) query.append('level', params.level);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE_URL}/api/schemes?${query.toString()}`);
    return handleResponse<SchemeSummary[]>(res);
  },

  async getSchemeDetail(id: string): Promise<Scheme> {
    const res = await fetch(`${API_BASE_URL}/api/schemes/${encodeURIComponent(id)}`);
    return handleResponse<Scheme>(res);
  },

  async getCategories(): Promise<CategoryMeta[]> {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    return handleResponse<CategoryMeta[]>(res);
  },

  async searchSchemes(query: string, category?: string, state?: string): Promise<{
    query: string;
    results_count: number;
    results: Array<{
      scheme: Scheme;
      top_relevance_score: number;
      retrieval_method: string;
      matched_passages: string[];
    }>;
  }> {
    const res = await fetch(`${API_BASE_URL}/api/schemes/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, category, state, top_k: 6 }),
    });
    return handleResponse(res);
  },

  async evaluateEligibility(profile: UserProfile, schemeIds?: string[]): Promise<EligibilityEvaluationResponse> {
    const res = await fetch(`${API_BASE_URL}/api/eligibility/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, scheme_ids: schemeIds }),
    });
    return handleResponse<EligibilityEvaluationResponse>(res);
  },

  async matchSchemes(profile: UserProfile, category?: string): Promise<{
    profile_summary: Record<string, any>;
    matches_count: number;
    matches: Array<{
      scheme: Scheme;
      eligibility_result: any;
      match_reasons: string[];
      status: string;
      match_score: number;
    }>;
  }> {
    const res = await fetch(`${API_BASE_URL}/api/schemes/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, category }),
    });
    return handleResponse(res);
  },

  async askQuestion(question: string, language: string = 'en', categoryFilter?: string): Promise<AskResponse> {
    const res = await fetch(`${API_BASE_URL}/api/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        language,
        category_filter: categoryFilter,
      }),
    });
    return handleResponse<AskResponse>(res);
  },

  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(res);
  },
};
