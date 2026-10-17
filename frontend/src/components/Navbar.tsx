import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'schemes' | 'eligibility' | 'assistant' | 'about' | 'csc';
  setActiveTab: (tab: 'home' | 'schemes' | 'eligibility' | 'assistant' | 'about' | 'csc') => void;
  onOpenPiiModal?: () => void;
  onOpenCscModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPiiModal,
  onOpenCscModal
}) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);

  const handleFontSize = (delta: number) => {
    const newLevel = Math.max(-1, Math.min(2, fontSizeLevel + delta));
    setFontSizeLevel(newLevel);
    const html = document.documentElement;
    if (newLevel === -1) html.style.fontSize = '90%';
    else if (newLevel === 0) html.style.fontSize = '100%';
    else if (newLevel === 1) html.style.fontSize = '110%';
    else if (newLevel === 2) html.style.fontSize = '120%';
  };

  return (
    <header className="w-full bg-[#0a1120] text-white border-b border-slate-800 shadow-md">
      {/* 1. Sovereign Government of India Utility Bar */}
      <div className="bg-[#050b14] border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Ministry & Country Attribution */}
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-medium">
            <span className="inline-block w-3.5 h-2.5 bg-gradient-to-b from-[#FF9933] via-white to-[#138808] rounded-xs shadow-xs border border-white/20"></span>
            <span className="font-semibold text-white tracking-wide">भारत सरकार</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Government of India</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">Ministry of Electronics & IT (MeitY)</span>
          </div>

          {/* Right: Accessibility Controls & Sovereign Compliance */}
          <div className="flex items-center space-x-3 text-[11px]">
            <a
              href="#main-content"
              className="hidden lg:inline hover:text-amber-400 transition-colors text-slate-400"
            >
              Skip to Main Content
            </a>
            <span className="hidden lg:inline text-slate-700">|</span>

            {/* Font Size Adjusters */}
            <div className="hidden sm:flex items-center space-x-1 font-mono text-[10px] text-slate-300 bg-slate-800/60 rounded px-1.5 py-0.5 border border-slate-700/60">
              <button
                onClick={() => handleFontSize(-1)}
                className={`px-1 hover:text-white ${fontSizeLevel === -1 ? 'text-amber-400 font-bold' : ''}`}
                title="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => handleFontSize(0)}
                className={`px-1 hover:text-white ${fontSizeLevel === 0 ? 'text-amber-400 font-bold' : ''}`}
                title="Normal font size"
              >
                A
              </button>
              <button
                onClick={() => handleFontSize(1)}
                className={`px-1 hover:text-white ${fontSizeLevel >= 1 ? 'text-amber-400 font-bold' : ''}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo & Sovereign Title */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3.5 cursor-pointer group select-none"
          >
            {/* National Emblem Style Crest */}
            <img
              src="/favicon.svg"
              alt="JanSahayak AI Sovereign Crest"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-smooth"
            />

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center">
                  JanSahayak <span className="text-[#FF9933] ml-1">AI</span>
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide">
                Digital India Civic Empowerment & Sovereign Scheme Gateway
              </p>
            </div>
          </div>

          {/* Right Statistics & Zero PII Shield */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs">
              <div className="text-right">
                <div className="text-amber-400 font-extrabold leading-none text-sm">1,420+ SCHEMES</div>
                <div className="text-[10px] text-slate-400 font-medium">Central & State Verified</div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Zero PII Sovereign Guarantee Button */}
            <button
              onClick={() => {
                if (onOpenPiiModal) onOpenPiiModal();
                else alert("JanSahayak AI Citizen Privacy Enclave: No Aadhaar, biometrics, or personal identifiers are stored on servers. Evaluation executes via deterministic client-side logic.");
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border border-amber-400/30 shadow-md shadow-orange-950/40 transition-smooth"
            >
              <Lock className="w-3.5 h-3.5 text-white/90" />
              <span>Zero PII Stored</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Bar */}
      <div className="bg-[#0e192f] border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Navigation Tabs */}
            <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-smooth whitespace-nowrap ${
                  activeTab === 'home'
                    ? 'text-white bg-[#192b4f] border border-amber-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>मुख्य पृष्ठ / Home</span>
                {activeTab === 'home' && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('schemes')}
                className={`relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-smooth whitespace-nowrap ${
                  activeTab === 'schemes'
                    ? 'text-white bg-[#192b4f] border border-amber-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>योजनाएँ / Schemes (1,420+)</span>
                {activeTab === 'schemes' && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('eligibility')}
                className={`relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-smooth whitespace-nowrap ${
                  activeTab === 'eligibility'
                    ? 'text-white bg-[#192b4f] border border-amber-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>पात्रता जाँच / Eligibility</span>
                {activeTab === 'eligibility' && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('assistant')}
                className={`relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-smooth whitespace-nowrap ${
                  activeTab === 'assistant'
                    ? 'text-white bg-[#192b4f] border border-amber-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>AI सहायक / Assistant</span>
                {activeTab === 'assistant' && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => {
                  if (onOpenCscModal) onOpenCscModal();
                  else setActiveTab('csc');
                }}
                className={`relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-smooth whitespace-nowrap ${
                  activeTab === 'csc'
                    ? 'text-white bg-[#192b4f] border border-amber-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>CSC केंद्र / Digital Seva</span>
                {activeTab === 'csc' && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full"></span>
                )}
              </button>
            </nav>

            {/* Quick Instant Search Button */}
            <div className="hidden sm:block shrink-0">
              <button
                onClick={() => setActiveTab('eligibility')}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-smooth"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>तुरंत खोजें (2 Mins)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Live Gazette Ticker Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-medium text-xs py-1.5 px-4 overflow-hidden border-b border-orange-600 shadow-inner flex items-center">
        <div className="shrink-0 flex items-center space-x-1.5 bg-[#0b1528] text-amber-400 px-2.5 py-0.5 rounded-md font-bold text-[10px] tracking-wider uppercase mr-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>LIVE GAZETTE</span>
        </div>

        <div className="overflow-hidden relative w-full flex items-center">
          <div className="animate-marquee text-slate-950 font-bold text-xs space-x-8">
            <span className="inline-flex items-center space-x-1">
              <span className="text-red-950">★</span>
              <span>PM-KISAN: 17th Installment ₹2,000 Live — eKYC Mandate Active</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="text-red-950">★</span>
              <span>Ayushman Bharat: Free ₹5 Lakh Hospital Cover for ALL 70+ Seniors Notified</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="text-red-950">★</span>
              <span>PM SVANidhi: 3rd Tranche ₹50,000 Collateral-free Working Capital Launched</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="text-red-950">★</span>
              <span>100+ More Central & State Gazette Schemes Synchronized</span>
            </span>
            {/* Duplicated for smooth infinite loop */}
            <span className="inline-flex items-center space-x-1">
              <span className="text-red-950">★</span>
              <span>PM-KISAN: 17th Installment ₹2,000 Live — eKYC Mandate Active</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="text-red-950">★</span>
              <span>Ayushman Bharat: Free ₹5 Lakh Hospital Cover for ALL 70+ Seniors Notified</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
