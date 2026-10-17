import React from 'react';
import { Search, Cpu, ShieldCheck } from 'lucide-react';

export const EvaluationProcess: React.FC = () => {
  return (
    <section className="py-16 bg-[#071124] text-white border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Amber Tag */}
        <div className="inline-block text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
          3-STEP DETERMINISTIC RAG/DRX • ZERO HALLUCINATION
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          How JanSahayak AI Evaluates Your Entitlements
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Mathematical rule matching strictly grounded in gazetted notifications. No guessing.
        </p>

        {/* 3 Grid Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="bg-[#0c1833] rounded-2xl p-6 border border-blue-500/30 flex flex-col justify-between shadow-lg hover:border-blue-400 transition-smooth">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 font-black text-sm flex items-center justify-center">
                  01
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  FAISS + DENSE
                </span>
              </div>

              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Fast Vector Search</span>
              </h3>

              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Instant semantic search across 1,420+ official gazetted scheme rules.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-xs font-semibold text-emerald-400">
              <span>✓ Gazetted Corpus Embedded</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0c1833] rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between shadow-lg hover:border-amber-400 transition-smooth">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-amber-600/30 text-amber-400 border border-amber-500/40 font-black text-sm flex items-center justify-center">
                  02
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  3-VALUED LOGIC
                </span>
              </div>

              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Instant Rule Match</span>
              </h3>

              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Strict deterministic check: Eligible, Conditional, or Disqualified in &lt;1.2 seconds.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-xs font-semibold text-amber-400">
              <span>✓ Zero Probabilistic Guesswork</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0c1833] rounded-2xl p-6 border border-emerald-500/30 flex flex-col justify-between shadow-lg hover:border-emerald-400 transition-smooth">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-black text-sm flex items-center justify-center">
                  03
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  CLIENT ENCLAVE
                </span>
              </div>

              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero PII Stored</span>
              </h3>

              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                No Aadhaar, biometrics, or personal phone number collected or saved on servers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-xs font-semibold text-emerald-400">
              <span>✓ 100% Client-Side Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
