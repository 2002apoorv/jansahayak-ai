import type {
  AskResponse,
  CategoryMeta,
  EligibilityEvaluationResponse,
  Scheme,
  SchemeSummary,
  UserProfile,
} from '../types';

const RAW_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();
// Strip trailing slashes and any inadvertent trailing '/api' from the base URL
export const API_BASE_URL = RAW_BASE_URL
  ? RAW_BASE_URL.replace(/\/+$/, '').replace(/\/api$/, '')
  : '';

function endpoint(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = '';
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || '';
    } catch {
      // Body is not JSON
    }

    if (!errorDetail) {
      if (res.status === 404) {
        const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
        if (!API_BASE_URL && !isLocal) {
          errorDetail = 'Backend URL (VITE_API_BASE_URL) is not configured in Vercel project environment variables.';
        } else {
          errorDetail = `Endpoint not found (HTTP 404). Please ensure the backend is running and the route exists.`;
        }
      } else if (res.status === 502 || res.status === 503 || res.status === 504) {
        errorDetail = 'Backend is waking up (Render free tier spin-up takes ~30-45s) or temporarily unavailable. Please retry in a few seconds.';
      } else {
        errorDetail = `HTTP ${res.status}: ${res.statusText || 'Request failed'}`;
      }
    } else if (errorDetail === 'Not Found') {
      errorDetail = 'Backend service returned 404 Not Found. Please verify the backend URL format and route.';
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

    const qs = query.toString();
    const res = await fetch(endpoint(`/api/schemes${qs ? `?${qs}` : ''}`));
    return handleResponse<SchemeSummary[]>(res);
  },

  async getSchemeDetail(id: string): Promise<Scheme> {
    const res = await fetch(endpoint(`/api/schemes/${encodeURIComponent(id)}`));
    return handleResponse<Scheme>(res);
  },

  async getCategories(): Promise<CategoryMeta[]> {
    const res = await fetch(endpoint('/api/categories'));
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
    const res = await fetch(endpoint('/api/schemes/search'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, category, state, top_k: 6 }),
    });
    return handleResponse(res);
  },

  async evaluateEligibility(profile: UserProfile, schemeIds?: string[]): Promise<EligibilityEvaluationResponse> {
    const res = await fetch(endpoint('/api/eligibility/evaluate'), {
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
    const res = await fetch(endpoint('/api/schemes/match'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, category }),
    });
    return handleResponse(res);
  },

  async askQuestion(question: string, language: string = 'en', categoryFilter?: string): Promise<AskResponse> {
    const res = await fetch(endpoint('/api/ask'), {
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
    const res = await fetch(endpoint('/health'));
    return handleResponse(res);
  },
};
