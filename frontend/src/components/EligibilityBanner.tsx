import React from 'react';
import { CheckSquare, MessageSquare, ArrowRight } from 'lucide-react';

interface EligibilityBannerProps {
  onStartAssessment: () => void;
  onAskJanSahayak: () => void;
}

export const EligibilityBanner: React.FC<EligibilityBannerProps> = ({
  onStartAssessment,
  onAskJanSahayak,
}) => {
  return (
    <section className="py-6 bg-[#FAF5FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#ea580c] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Title and Information */}
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                पात्रता जाँच शुरू करें / Check Eligibility Now
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium">
                2-minute confidential assessment • Zero documents required to discover schemes
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={onStartAssessment}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm shadow-md transition-smooth flex items-center space-x-2"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4 text-orange-600" />
            </button>

            <button
              onClick={onAskJanSahayak}
              className="px-5 py-3 rounded-xl bg-[#0b1528] hover:bg-[#16274a] text-white font-extrabold text-xs sm:text-sm shadow-md transition-smooth flex items-center space-x-2 border border-slate-700"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Ask JanSahayak</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
