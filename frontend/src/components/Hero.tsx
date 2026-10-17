import React, { useState } from 'react';
import { Search, Shield } from 'lucide-react';

interface HeroProps {
  onSearch: (query: string) => void;
  onNavigateToEligibility?: () => void;
  onNavigateToAssistant?: (prompt?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const quickChips = [
    { label: 'कृषि / PM-KISAN', query: 'PM-KISAN ₹6,000 direct cash farmer benefit' },
    { label: 'आयुष्मान / ₹5L Health', query: 'Ayushman Bharat 5 lakh hospital cover senior citizens' },
    { label: 'ऋण / SVANIDHI', query: 'PM SVANidhi street vendor collateral free loan' },
    { label: 'सुकन्या / Girls', query: 'Sukanya Samriddhi Yojana small savings for girl child' },
  ];

  return (
    <div className="relative bg-[#091326] text-white pt-10 pb-16 overflow-hidden border-b border-slate-800">
      {/* Background Cybernetic & Sovereign Motifs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl"></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        ></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-orange-400" />
          <span>CYBERSECURITY & CITIZEN EMPOWERMENT</span>
        </div>

        {/* Main Bilingual Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          सशक्त नागरिक • सुरक्षित डिजिटल भारत
        </h1>

        {/* English Subhead */}
        <div className="mt-3 text-lg sm:text-2xl font-bold text-amber-400 tracking-wide">
          100% Deterministic Civic Discovery • Zero Hallucination
        </div>

        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
          One-stop sovereign gateway to 1,420+ central and state government entitlements.
        </p>

        {/* Big White Floating Search Bar */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-2xl p-1.5 shadow-2xl shadow-black/50 border border-slate-200">
            <div className="flex items-center flex-1 px-4 py-2 text-slate-400">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="उदा: 2 एकड़ किसान, 70+ सीनियर सिटीजन, स्ट्रीट वेंडर ऋण..."
                className="w-full text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="mt-2 sm:mt-0 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm sm:text-base shadow-md transition-smooth flex items-center justify-center space-x-2 shrink-0"
            >
              <Search className="w-4 h-4 text-white" />
              <span>खोजें / Search</span>
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-bold uppercase tracking-wider text-[11px] border border-slate-700">
            QUICK:
          </span>

          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchInput(chip.query);
                onSearch(chip.query);
              }}
              className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 transition-smooth font-medium shadow-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
