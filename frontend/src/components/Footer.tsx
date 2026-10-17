import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050b14] text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-slate-800">
          {/* Column 1: National Portals */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>NATIONAL PORTALS</span>
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <a
                  href="https://www.india.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 inline-flex items-center space-x-1.5 transition-colors"
                >
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.myscheme.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 inline-flex items-center space-x-1.5 transition-colors"
                >
                  <span>myScheme Sovereign Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://digitalindia.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 inline-flex items-center space-x-1.5 transition-colors"
                >
                  <span>Digital India Programme</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li className="pt-2 text-slate-400 font-mono text-[11px]">
                Citizen Assistance Toll: <span className="text-white font-bold">1800-11-0031 / 14443</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Architecture & Citizen Privacy Notice */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>ARCHITECTURE & CITIZEN PRIVACY NOTICE</span>
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px] mb-4">
              JanSahayak AI operates strictly on deterministic 3-valued rule-logic with dense FAISS vector embeddings
              derived directly from published statutory Gazette notifications. All criteria evaluation is performed locally.
              No personal biometrics or Aadhaar data is collected on central servers.
            </p>

            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
              <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-300 border border-amber-500/30">
                GIGW 3.0 COMPLIANT
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-emerald-300 border border-emerald-500/30">
                WCAG 2.1 AAA
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-blue-300 border border-blue-500/30">
                ZERO CENTRAL PII
              </span>
            </div>
          </div>

          {/* Column 3: Portal Custodian */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-4 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>PORTAL CUSTODIAN</span>
            </h4>
            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="font-bold text-white text-xs">National Informatics Centre (NIC)</div>
              <div>Ministry of Electronics and Information Technology</div>
              <div>Government of India, New Delhi - 110003</div>
              <div className="pt-3">
                <span className="inline-block px-2.5 py-1 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700 text-[10px]">
                  Portal Release: v3.2 (Digital India Ed.)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
          <div>
            © 2026 Content Owned & Maintained by JanSahayak AI Consortium / Ministry of Electronics & IT.
          </div>
          <div className="text-slate-400 flex items-center space-x-2">
            <span>Last Updated: 20 Oct 2026</span>
            <span>|</span>
            <span className="text-emerald-400 font-semibold">Designed for Digital India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
