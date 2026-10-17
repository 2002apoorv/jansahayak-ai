import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import type { EligibilityEvaluationResponse, SchemeEligibilityResult, UserProfile } from '../types';
import { api } from '../services/api';

interface ProfileFormProps {
  onViewSchemeDetails?: (schemeId: string) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onViewSchemeDetails }) => {
  const [profile, setProfile] = useState<UserProfile>({
    state: '',
    age: undefined,
    gender: '',
    annual_family_income: undefined,
    occupation: '',
    is_student: undefined,
    education_level: '',
    social_category: '',
    owns_agricultural_land: undefined,
    owns_pucca_house: undefined,
    is_taxpayer: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationResponse, setEvaluationResponse] = useState<EligibilityEvaluationResponse | null>(null);

  const indianStates = [
    'All India / Central',
    'Andhra Pradesh',
    'Assam',
    'Bihar',
    'Delhi',
    'Gujarat',
    'Haryana',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal',
  ];

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Clean undefined and empty strings
      const payload: UserProfile = {};
      if (profile.state && profile.state !== 'All India / Central') payload.state = profile.state;
      if (profile.age !== undefined && profile.age !== null) payload.age = Number(profile.age);
      if (profile.gender) payload.gender = profile.gender;
      if (profile.annual_family_income !== undefined && profile.annual_family_income !== null) {
        payload.annual_family_income = Number(profile.annual_family_income);
      }
      if (profile.occupation) payload.occupation = profile.occupation;
      if (profile.is_student !== undefined) payload.is_student = profile.is_student;
      if (profile.education_level) payload.education_level = profile.education_level;
      if (profile.social_category) payload.social_category = profile.social_category;
      if (profile.owns_agricultural_land !== undefined) payload.owns_agricultural_land = profile.owns_agricultural_land;
      if (profile.owns_pucca_house !== undefined) payload.owns_pucca_house = profile.owns_pucca_house;
      if (profile.is_taxpayer !== undefined) payload.is_taxpayer = profile.is_taxpayer;

      const res = await api.evaluateEligibility(payload);
      setEvaluationResponse(res);
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate eligibility. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfile({
      state: '',
      age: undefined,
      gender: '',
      annual_family_income: undefined,
      occupation: '',
      is_student: undefined,
      education_level: '',
      social_category: '',
      owns_agricultural_land: undefined,
      owns_pucca_house: undefined,
      is_taxpayer: undefined,
    });
    setEvaluationResponse(null);
    setError(null);
  };

  // Helper for status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'potentially_eligible':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />
            Potentially Eligible (All Criteria Satisfied)
          </span>
        );
      case 'conditionally_eligible':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-700" />
            Conditionally Eligible (Some Info Unknown)
          </span>
        );
      case 'unknown_missing_info':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-slate-600" />
            Unknown (Missing Information)
          </span>
        );
      case 'not_eligible':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-700" />
            Not Eligible (Exclusion Met)
          </span>
        );
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          Deterministic 3-Valued Logic Engine
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
          Citizen Eligibility Self-Check
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Provide your profile details below to see which government schemes you potentially qualify for.
          All rules are evaluated logically without AI hallucination.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form container */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <form onSubmit={handleEvaluate} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Your Basic Profile</h3>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* State selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                State / Union Territory
              </label>
              <select
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select your state (Optional)</option>
                {indianStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="e.g. 28"
                  value={profile.age ?? ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      age: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="transgender">Transgender</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Primary Occupation
              </label>
              <select
                value={profile.occupation}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select Occupation</option>
                <option value="farmer">Farmer / Agricultural Cultivator</option>
                <option value="small_business">Micro / Small Business Owner</option>
                <option value="artisan">Artisan / Street Vendor / Craftsman</option>
                <option value="student">Student</option>
                <option value="self_employed">Self Employed / Freelancer</option>
                <option value="salaried">Salaried Worker / Private Employee</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>

            {/* Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Annual Family Income (INR)
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                placeholder="e.g. 180000"
                value={profile.annual_family_income ?? ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    annual_family_income: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Total combined annual income of all family members.
              </span>
            </div>

            {/* Student & Education */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Enrolled Student?
                </label>
                <select
                  value={
                    profile.is_student === undefined
                      ? ''
                      : profile.is_student
                      ? 'true'
                      : 'false'
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      is_student:
                        e.target.value === ''
                          ? undefined
                          : e.target.value === 'true',
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Unknown / Skip</option>
                  <option value="true">Yes, Enrolled</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Social Category
                </label>
                <select
                  value={profile.social_category}
                  onChange={(e) => setProfile({ ...profile, social_category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>

            {/* Scheme specific flags */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Key Asset & Exclusion Attributes
              </span>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">Owns Cultivable Agricultural Land?</span>
                <select
                  value={
                    profile.owns_agricultural_land === undefined
                      ? ''
                      : profile.owns_agricultural_land
                      ? 'true'
                      : 'false'
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      owns_agricultural_land:
                        e.target.value === '' ? undefined : e.target.value === 'true',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-800"
                >
                  <option value="">Unspecified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">Owns a Pucca (Concrete) House?</span>
                <select
                  value={
                    profile.owns_pucca_house === undefined
                      ? ''
                      : profile.owns_pucca_house
                      ? 'true'
                      : 'false'
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      owns_pucca_house:
                        e.target.value === '' ? undefined : e.target.value === 'true',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-800"
                >
                  <option value="">Unspecified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700">Any Family Member Pays Income Tax?</span>
                <select
                  value={
                    profile.is_taxpayer === undefined
                      ? ''
                      : profile.is_taxpayer
                      ? 'true'
                      : 'false'
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      is_taxpayer:
                        e.target.value === '' ? undefined : e.target.value === 'true',
                    })
                  }
                  className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-800"
                >
                  <option value="">Unspecified</option>
                  <option value="true">Yes (Taxpayer)</option>
                  <option value="false">No (Non-Taxpayer)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-smooth flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {loading ? (
                <span>Evaluating Criteria...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Evaluate My Eligibility</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results container */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
              <XCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="block">Evaluation Error</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {!evaluationResponse && !loading && (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-500">
              <UserCheck className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">
                Awaiting Profile Input
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Fill in the self-check parameters on the left to see your personalized eligibility breakdown
                across all 8 verified schemes with full criteria transparency.
              </p>
            </div>
          )}

          {evaluationResponse && (
            <div className="space-y-6">
              {/* Summary count */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Evaluation Summary
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {evaluationResponse.potentially_eligible_count} Potentially Relevant Schemes
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {evaluationResponse.results.filter(r => r.status === 'potentially_eligible').length} Fully Satisfied
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                    {evaluationResponse.results.filter(r => r.status === 'conditionally_eligible').length} Conditional
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">
                    {evaluationResponse.not_eligible_count} Ineligible
                  </span>
                </div>
              </div>

              {/* Scheme Results List */}
              <div className="space-y-4">
                {evaluationResponse.results.map((res: SchemeEligibilityResult) => (
                  <div
                    key={res.scheme_id}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-smooth"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {res.category}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-medium text-slate-600">
                            {res.government_level === 'central' ? 'Central Scheme' : 'State Scheme'}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{res.scheme_name}</h4>
                      </div>
                      {renderStatusBadge(res.status)}
                    </div>

                    {/* Criteria breakdowns */}
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                      <span className="text-xs font-bold text-slate-700 block mb-1">
                        Evaluated Criteria Breakdown:
                      </span>
                      {res.criteria_evaluations.map((ev, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2.5 text-xs"
                        >
                          {ev.status === 'satisfied' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {ev.status === 'not_satisfied' && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          {ev.status === 'unknown' && (
                            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <span className="font-semibold text-slate-800">{ev.description}</span>
                            <p className="text-slate-500 mt-0.5">{ev.explanation}</p>
                          </div>
                          {ev.source_ref && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {ev.source_ref}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Missing fields alert */}
                    {res.missing_information && res.missing_information.length > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                        <strong>Missing Information needed to confirm:</strong>{' '}
                        {res.missing_information.join(', ')}.
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      {onViewSchemeDetails && (
                        <button
                          onClick={() => onViewSchemeDetails(res.scheme_id)}
                          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                        >
                          <span>View Full Document Checklist & Process</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <a
                        href={res.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center space-x-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
