import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  Loader2,
} from 'lucide-react';
import type { CategoryMeta, Scheme, SchemeSummary } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SovereignImpactCards } from './components/SovereignImpactCards';
import { WelfarePortfolios } from './components/WelfarePortfolios';
import { EvaluationProcess } from './components/EvaluationProcess';
import { CitizenTouchpoints } from './components/CitizenTouchpoints';
import { EligibilityBanner } from './components/EligibilityBanner';
import { DigitalIndiaPartners } from './components/DigitalIndiaPartners';
import { SchemeCard } from './components/SchemeCard';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { ProfileForm } from './components/ProfileForm';
import { AssistantPanel } from './components/AssistantPanel';
import { Footer } from './components/Footer';
import { CscModal } from './components/CscModal';
import { PiiModal } from './components/PiiModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'schemes' | 'eligibility' | 'assistant' | 'about' | 'csc'>('home');
  const [categories, setCategories] = useState<CategoryMeta[]>([]);
  const [schemes, setSchemes] = useState<SchemeSummary[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState<boolean>(false);
  const [errorSchemes, setErrorSchemes] = useState<string | null>(null);

  // Filters for Explore Schemes
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState<Scheme | null>(null);
  const [isCscModalOpen, setIsCscModalOpen] = useState<boolean>(false);
  const [isPiiModalOpen, setIsPiiModalOpen] = useState<boolean>(false);

  // Prompt passed to assistant
  const [assistantPrompt, setAssistantPrompt] = useState<string>('');

  // Fetch categories on mount
  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch schemes whenever category, state, or search changes
  useEffect(() => {
    setLoadingSchemes(true);
    setErrorSchemes(null);

    api.getSchemes({
      category: selectedCategory,
      state: selectedState,
      search: searchQuery || undefined,
    })
      .then(setSchemes)
      .catch((err) => {
        console.error('Failed to load schemes', err);
        setErrorSchemes('Failed to load schemes. Make sure backend is running.');
      })
      .finally(() => setLoadingSchemes(false));
  }, [selectedCategory, selectedState, searchQuery]);

  // Handler to open scheme detail
  const handleOpenDetail = async (schemeId: string) => {
    try {
      const full = await api.getSchemeDetail(schemeId);
      setSelectedSchemeDetail(full);
    } catch (err) {
      console.error('Failed to load scheme details', err);
    }
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('schemes');
  };

  const handleSelectCategoryFromHome = (categoryId?: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('schemes');
  };

  const handleTabChange = (tab: 'home' | 'schemes' | 'eligibility' | 'assistant' | 'about' | 'csc') => {
    if (tab === 'csc') {
      setIsCscModalOpen(true);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* 1. Sovereign Government Navbar with Topbar & Live Gazette Marquee */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenPiiModal={() => setIsPiiModalOpen(true)}
        onOpenCscModal={() => setIsCscModalOpen(true)}
      />

      <main id="main-content" className="flex-1">
        {/* ==================== VIEW 1: HOME ==================== */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero
              onSearch={handleHeroSearch}
              onNavigateToEligibility={() => setActiveTab('eligibility')}
              onNavigateToAssistant={(prompt) => {
                if (prompt) setAssistantPrompt(prompt);
                setActiveTab('assistant');
              }}
            />

            {/* Sovereign Impact Metrics */}
            <SovereignImpactCards />

            {/* Welfare Portfolios (6 Visual Category Cards) */}
            <WelfarePortfolios
              onSelectCategory={handleSelectCategoryFromHome}
              onCheckEligibility={() => setActiveTab('eligibility')}
              onViewAll={() => setActiveTab('schemes')}
            />

            {/* How JanSahayak Evaluates (3-step Navy Section) */}
            <EvaluationProcess />

            {/* Citizen Touchpoints & Assisted Access (Mobile App & CSC Kiosks) */}
            <CitizenTouchpoints
              onOpenSelfCheck={() => setActiveTab('eligibility')}
              onOpenCscModal={() => setIsCscModalOpen(true)}
            />

            {/* Orange Call-to-Action Ribbon */}
            <EligibilityBanner
              onStartAssessment={() => setActiveTab('eligibility')}
              onAskJanSahayak={() => setActiveTab('assistant')}
            />

            {/* Digital India Ecosystem Partners Bar */}
            <DigitalIndiaPartners />
          </div>
        )}

        {/* ==================== VIEW 2: EXPLORE SCHEMES ==================== */}
        {activeTab === 'schemes' && (
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    Sovereign Welfare Repository
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                  Government Scheme Directory
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Showing {schemes.length} verified programs grounded in statutory gazettes & portal rules
                </p>
              </div>

              {/* Filters toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Filter by title or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 w-56 sm:w-64"
                  />
                </div>

                {/* Category dropdown */}
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || undefined)}
                  className="px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>

                {/* State dropdown */}
                <select
                  value={selectedState || ''}
                  onChange={(e) => setSelectedState(e.target.value || undefined)}
                  className="px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Jurisdictions</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>

                {(selectedCategory || selectedState || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(undefined);
                      setSelectedState(undefined);
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 underline px-1"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Scheme Cards Grid */}
            {loadingSchemes ? (
              <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-600 mb-2" />
                <p className="text-sm font-semibold text-slate-500">Querying verified scheme database...</p>
              </div>
            ) : errorSchemes ? (
              <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-center">
                <p className="font-semibold">{errorSchemes}</p>
              </div>
            ) : schemes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
                <Compass className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No schemes found matching criteria</h3>
                <p className="text-sm mt-1">Try clearing filters or searching for terms like "farmer", "hospital", or "loan".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    onViewDetails={handleOpenDetail}
                    onCheckEligibility={() => setActiveTab('eligibility')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== VIEW 3: CHECK ELIGIBILITY ==================== */}
        {activeTab === 'eligibility' && (
          <div className="py-6">
            <ProfileForm onViewSchemeDetails={handleOpenDetail} />
          </div>
        )}

        {/* ==================== VIEW 4: AI NAVIGATOR ASSISTANT ==================== */}
        {activeTab === 'assistant' && (
          <div className="py-6">
            <AssistantPanel initialPrompt={assistantPrompt} />
          </div>
        )}

        {/* ==================== VIEW 5: ABOUT & SOURCES ==================== */}
        {activeTab === 'about' && (
          <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Integrity & Sovereign Governance
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                Data Sources & Technical Methodology
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                How JanSahayak AI guarantees source grounding and prevents hallucination in civic discovery.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
                1. Knowledge Base & Grounding Policy
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All schemes indexed in JanSahayak AI are curated exclusively from primary government portals and statutory gazettes:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1.5">
                <li><strong>myScheme Portal:</strong> Unified Indian citizen scheme discovery repository (<a href="https://myscheme.gov.in" target="_blank" rel="noreferrer" className="text-amber-700 underline">myscheme.gov.in</a>).</li>
                <li><strong>National Health Authority (NHA):</strong> AB-PMJAY guidelines and SECC deprivation matrices (<a href="https://pmjay.gov.in" target="_blank" rel="noreferrer" className="text-amber-700 underline">pmjay.gov.in</a>).</li>
                <li><strong>Ministry of Agriculture:</strong> PM-KISAN operational framework & exclusion criteria (<a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="text-amber-700 underline">pmkisan.gov.in</a>).</li>
                <li><strong>Ministry of Housing & Urban Affairs:</strong> PMAY Urban guidelines and PM SVANidhi charter.</li>
                <li><strong>National Scholarship Portal:</strong> Central Sector Post-Matric SC/ST student guidelines (<a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="text-amber-700 underline">scholarships.gov.in</a>).</li>
                <li><strong>State Government Gazettes:</strong> Official state schemes such as MP Mukhyamantri Ladli Behna Yojana.</li>
              </ul>

              <h3 className="text-lg font-bold text-slate-900 border-b pb-2 pt-4">
                2. Deterministic Eligibility Engine (Three-Valued Logic)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Determining whether an Indian citizen qualifies for a welfare grant should never be left to probabilistic LLM guesswork. Our backend employs a strict deterministic rule engine evaluating criteria into:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <strong className="text-emerald-800 block text-sm mb-1">Satisfied</strong>
                  <span>User input meets or satisfies verified income, age, landholding, or occupation thresholds.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                  <strong className="text-rose-800 block text-sm mb-1">Not Satisfied</strong>
                  <span>Input explicitly breaches a statutory ceiling or triggers an exclusion rule.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <strong className="text-amber-800 block text-sm mb-1">Unknown</strong>
                  <span>Missing profile attributes remain unknown. Missing data is never treated as passing.</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 border-b pb-2 pt-4">
                3. Semantic Retrieval & Citation Validation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Passages are embedded via <code>all-MiniLM-L6-v2</code> and queried against a dense FAISS vector index using
                L2-normalized cosine similarity. When the LLM generates an answer, an output interceptor verifies all
                <code>[S1]</code>, <code>[S2]</code> citations against the retrieved passages and removes any hallucinated links.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Scheme Detail Modal with Local Checklist */}
      {selectedSchemeDetail && (
        <SchemeDetailModal
          scheme={selectedSchemeDetail}
          onClose={() => setSelectedSchemeDetail(null)}
          onCheckMyEligibility={() => {
            setSelectedSchemeDetail(null);
            setActiveTab('eligibility');
          }}
        />
      )}

      {/* CSC Digital Seva Kiosk Locator Modal */}
      <CscModal
        isOpen={isCscModalOpen}
        onClose={() => setIsCscModalOpen(false)}
      />

      {/* Zero PII Sovereign Privacy Guarantee Modal */}
      <PiiModal
        isOpen={isPiiModalOpen}
        onClose={() => setIsPiiModalOpen(false)}
      />

      {/* Sovereign 3-Column Footer */}
      <Footer />
    </div>
  );
};

export default App;
