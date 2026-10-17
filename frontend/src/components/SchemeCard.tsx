import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import type { SchemeSummary } from '../types';

interface SchemeCardProps {
  scheme: SchemeSummary;
  onViewDetails: (schemeId: string) => void;
  onCheckEligibility?: (schemeId: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-smooth">
      <div>
        {/* Top badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 uppercase tracking-wide">
            {scheme.category.replace('_', ' ')}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
            {scheme.government_level === 'central' ? 'Central Scheme' : `State (${scheme.state || 'State'})`}
          </span>
          {scheme.verified && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              Verified
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-smooth">
          {scheme.name}
        </h3>
        {scheme.short_name && scheme.short_name !== scheme.name && (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
            {scheme.short_name}
          </span>
        )}

        {/* Description */}
        <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {scheme.description}
        </p>

        {/* Key benefit snippet */}
        {scheme.benefits_summary && (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block mb-0.5">Key Benefit:</span>
            <p className="text-xs text-slate-600 line-clamp-2">
              {scheme.benefits_summary}
            </p>
          </div>
        )}
      </div>

      {/* Card actions */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => onViewDetails(scheme.id)}
          className="inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800 transition-smooth"
        >
          <span>Details & Checklist</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {scheme.source_url && (
          <a
            href={scheme.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-slate-500 hover:text-slate-700 transition-smooth"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
};
