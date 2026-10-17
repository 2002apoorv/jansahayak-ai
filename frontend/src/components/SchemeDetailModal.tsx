import { useState } from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  Square,
  ListOrdered,
  Building2,
  Calendar,
} from 'lucide-react';
import type { Scheme } from '../types';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  onCheckMyEligibility?: (schemeId: string) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  onClose,
}) => {
  if (!scheme) return null;

  // Local storage checklist tracker
  const storageKey = `jansahayak_docs_${scheme.id}`;
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleDoc = (docId: string) => {
    setCheckedDocs((prev) => {
      const updated = { ...prev, [docId]: !prev[docId] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save checklist state locally', e);
      }
      return updated;
    });
  };

  const totalDocs = scheme.required_documents.length;
  const completedDocs = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 uppercase tracking-wide">
              {scheme.category.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
              {scheme.government_level === 'central' ? 'Central Government' : `State: ${scheme.state}`}
            </span>
            {scheme.verified && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Verified Source
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Title and ministry */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {scheme.name}
            </h2>
            {scheme.ministry && (
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Administered by {scheme.ministry}</span>
              </div>
            )}
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              {scheme.description}
            </p>
          </div>

          {/* Benefits section */}
          {scheme.benefits && scheme.benefits.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs mb-3 flex items-center space-x-1.5">
                <span>Verified Financial & Welfare Benefits</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scheme.benefits.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-amber-950">{b.title}</h4>
                      {b.amount && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200/60 text-amber-900">
                          {b.amount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility criteria breakdown */}
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs mb-3">
              Official Eligibility Rules
            </h3>
            <div className="space-y-2.5">
              {scheme.eligibility_rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start space-x-3"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{rule.description}</p>
                    {rule.source_ref && (
                      <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                        Source Ref: {rule.source_ref}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Document Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Required Application Documents
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track documents locally on your device before applying
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {completedDocs} / {totalDocs} Prepared
              </span>
            </div>

            <div className="space-y-2.5">
              {scheme.required_documents.map((doc) => {
                const isChecked = !!checkedDocs[doc.id];
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`p-3.5 rounded-xl border transition-smooth cursor-pointer flex items-start space-x-3 ${
                      isChecked
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <button type="button" className="mt-0.5 text-slate-400 hover:text-slate-600">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                          {doc.name}
                        </span>
                        {doc.mandatory ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{doc.description}</p>
                      {doc.issuing_authority && (
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          Issuing Authority: {doc.issuing_authority}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 italic mt-2">
              Note: Checklist status is saved privately in your local browser only. No data is stored on external servers.
            </p>
          </div>

          {/* Application steps */}
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs mb-3 flex items-center space-x-1.5">
              <ListOrdered className="w-4 h-4 text-slate-600" />
              <span>Step-by-Step Official Application Process</span>
            </h3>
            <ol className="space-y-3">
              {scheme.application_steps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Provenance & official source */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800">Source Provenance & Verification:</div>
            <div>
              <strong>Primary Document:</strong> {scheme.source_title}
            </div>
            {scheme.last_checked_at && (
              <div className="flex items-center space-x-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last verified against government portal on: {scheme.last_checked_at}</span>
              </div>
            )}
            <div className="pt-1">
              <a
                href={scheme.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:text-amber-800 font-semibold underline inline-flex items-center space-x-1"
              >
                <span>Read verified source document</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>

          <div className="flex items-center space-x-3">
            {scheme.application_url ? (
              <a
                href={scheme.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-xs transition-smooth"
              >
                <span>Open Official Application Portal</span>
                <ExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            ) : (
              <span className="text-xs text-slate-500 italic">
                In-person or physical camp application only
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
