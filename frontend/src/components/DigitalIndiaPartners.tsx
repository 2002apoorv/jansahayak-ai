import React from 'react';
import { ShieldCheck, Share2, Compass, Layers, Activity, Rocket } from 'lucide-react';

export const DigitalIndiaPartners: React.FC = () => {
  const partners = [
    {
      name: 'DigiLocker',
      sub: '100% Verified',
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      name: 'API Setu',
      sub: 'Data Exchange',
      icon: <Share2 className="w-4 h-4 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
    },
    {
      name: 'myScheme',
      sub: 'Discovery Hub',
      icon: <Compass className="w-4 h-4 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      name: 'UMANG',
      sub: 'One App',
      icon: <Layers className="w-4 h-4 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-200',
    },
    {
      name: 'Poshan Tracker',
      sub: 'Nutrition Hub',
      icon: <Activity className="w-4 h-4 text-rose-600" />,
      bg: 'bg-rose-50 border-rose-200',
    },
    {
      name: 'Startup India',
      sub: 'Seed Grants',
      icon: <Rocket className="w-4 h-4 text-orange-600" />,
      bg: 'bg-orange-50 border-orange-200',
    },
  ];

  return (
    <section className="py-8 bg-slate-100 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              INTEGRATED DIGITAL INDIA ECOSYSTEM INITIATIVES
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Interoperable Sovereign APIs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border ${p.bg} shadow-2xs flex items-center space-x-3 transition-smooth hover:shadow-xs`}
            >
              <div className="p-1.5 rounded-lg bg-white shadow-2xs shrink-0">
                {p.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 truncate">
                  {p.name}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 truncate">
                  {p.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
