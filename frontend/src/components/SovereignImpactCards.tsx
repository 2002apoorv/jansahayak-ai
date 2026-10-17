import React from 'react';
import { Fingerprint, IndianRupee, Radio, Store, FolderLock } from 'lucide-react';

export const SovereignImpactCards: React.FC = () => {
  const cards = [
    {
      title: 'TOTAL AADHAAR',
      value: '144+ Cr',
      hindiSub: 'डिजिटल पहचान पत्र (डीएल)',
      tag: '100% Saturation Level',
      bgColor: 'bg-[#F5F3FF]',
      borderColor: 'border-[#DDD6FE]',
      textColor: 'text-[#6D28D9]',
      tagBg: 'bg-[#EDE9FE]',
      icon: <Fingerprint className="w-5 h-5 text-[#8B5CF6]" />,
    },
    {
      title: 'DBT TRANSFERS',
      value: '₹36+ Lakh Cr',
      hindiSub: 'सीधे बैंक खाते में लाभ',
      tag: 'Zero Middlemen',
      bgColor: 'bg-[#FFF1F2]',
      borderColor: 'border-[#FECDD3]',
      textColor: 'text-[#BE123C]',
      tagBg: 'bg-[#FFE4E6]',
      icon: <IndianRupee className="w-5 h-5 text-[#F43F5E]" />,
    },
    {
      title: 'VILLAGES CONNECTED',
      value: '3.88 Lakh',
      hindiSub: 'भारतनेट ऑप्टिकल फाइबर',
      tag: 'BharatNet High Speed',
      bgColor: 'bg-[#ECFDF5]',
      borderColor: 'border-[#A7F3D0]',
      textColor: 'text-[#047857]',
      tagBg: 'bg-[#D1FAE5]',
      icon: <Radio className="w-5 h-5 text-[#10B981]" />,
    },
    {
      title: 'CSC SEVA KENDRAS',
      value: '5.2+ Lakh',
      hindiSub: 'ग्रामीण आइटी केंद्र (वीएलई)',
      tag: 'Every Gram Panchayat',
      bgColor: 'bg-[#FEFCE8]',
      borderColor: 'border-[#FEF08A]',
      textColor: 'text-[#B45309]',
      tagBg: 'bg-[#FEF9C3]',
      icon: <Store className="w-5 h-5 text-[#F59E0B]" />,
    },
    {
      title: 'DIGILOCKER USERS',
      value: '25+ Crore',
      hindiSub: 'डिजिटल दस्तावेज़ धारक',
      tag: 'Paperless Governance',
      bgColor: 'bg-[#F0F9FF]',
      borderColor: 'border-[#BAE6FD]',
      textColor: 'text-[#0369A1]',
      tagBg: 'bg-[#E0F2FE]',
      icon: <FolderLock className="w-5 h-5 text-[#0EA5E9]" />,
    },
  ];

  return (
    <section className="py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-2 mb-6">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              OUR SOVEREIGN IMPACT • <span className="font-bold text-slate-700">डिजिटल भारत की शक्ति</span>
            </h2>
          </div>
          <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 w-fit">
            Source: Digital India / NIC Dashboard 2026
          </div>
        </div>

        {/* 5 Impact Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${card.borderColor} ${card.bgColor} shadow-xs flex flex-col justify-between transition-smooth hover:shadow-md hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                    {card.title}
                  </span>
                  <div className="p-1 rounded-lg bg-white/70 shadow-2xs">
                    {card.icon}
                  </div>
                </div>

                <div className={`mt-3 text-xl sm:text-2xl font-black ${card.textColor} tracking-tight`}>
                  {card.value}
                </div>

                <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                  {card.hindiSub}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/40">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${card.tagBg} ${card.textColor}`}>
                  {card.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
