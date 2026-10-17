import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface WelfarePortfoliosProps {
  onSelectCategory: (categoryId?: string) => void;
  onCheckEligibility: () => void;
  onViewAll: () => void;
}

export const WelfarePortfolios: React.FC<WelfarePortfoliosProps> = ({
  onSelectCategory,
  onCheckEligibility,
  onViewAll,
}) => {
  const portfolios = [
    {
      id: 'agriculture',
      badge: '482 SCHEMES',
      badgeColor: 'bg-emerald-700 text-white',
      ministry: 'कृषि मंत्रालय / Agriculture',
      title: 'किसान कल्याण / Farmer Support',
      benefit: '₹6,000/yr Direct Cash Benefit (PM-KISAN)',
      tags: ['PM Fasal Bima', 'Kisan Credit Card (4%)'],
      targetAudience: 'Small & Marginal',
      imageUrl: '/images/farmer_support.jpg',
    },
    {
      id: 'health',
      badge: '215 SCHEMES',
      badgeColor: 'bg-rose-700 text-white',
      ministry: 'स्वास्थ्य मंत्रालय / MoHFW',
      title: 'स्वास्थ्य सुरक्षा / Healthcare',
      benefit: '₹5 Lakh Free Cashless Hospital Cover',
      tags: ['Ayushman Bharat (70+ Free)', 'Jan Aushadhi (90% Off)'],
      targetAudience: 'All Senior Citizens',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'housing',
      badge: '158 SCHEMES',
      badgeColor: 'bg-amber-600 text-white',
      ministry: 'आवास मंत्रालय / MoHUA',
      title: 'अपना आवास / Housing for All',
      benefit: '₹1.2 - 2.5 Lakh Subsidy for Pucca House',
      tags: ['PMAY Gramin', 'PMAY Urban 2.0'],
      targetAudience: 'EWS / Low Income',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'business',
      badge: '184 SCHEMES',
      badgeColor: 'bg-cyan-700 text-white',
      ministry: 'MSME / सूक्ष्म उद्यम',
      title: 'सूक्ष्म ऋण / MSME Loans',
      benefit: '₹10,000 to ₹50,000 Collateral Free',
      tags: ['PM-SVANidhi', 'PM Mudra (Up to ₹20L)'],
      targetAudience: 'Street Vendors & Artisans',
      imageUrl: '/images/msme_vendor.jpg',
    },
    {
      id: 'women_child',
      badge: '260 SCHEMES',
      badgeColor: 'bg-purple-700 text-white',
      ministry: 'WCD मंत्रालय / Women & Child',
      title: 'महिला सशक्तिकरण / Women',
      benefit: '8.2% Sovereign Interest for Girl Child',
      tags: ['Sukanya Samriddhi', 'PMMVY (₹5,000 Maternity)'],
      targetAudience: 'Mothers & SHG Members',
      imageUrl: '/images/women_child.jpg',
    },
    {
      id: 'education',
      badge: '131 SCHEMES',
      badgeColor: 'bg-blue-700 text-white',
      ministry: 'शिक्षा / Higher Education',
      title: 'शिक्षा एवं छात्रवृत्ति / Scholarships',
      benefit: '100% Tuition DBT + Skill Stipend',
      tags: ['NSP Central Sector', 'PMKVY 4.0 Free Skills'],
      targetAudience: 'Students & Youth',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                मंत्रालय अनुसार श्रेणियाँ
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                1,420+ Live Gazetted Schemes
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Welfare Portfolios & Key Entitlements
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0b1528] hover:bg-[#16274a] text-white text-xs sm:text-sm font-bold shadow-sm transition-smooth shrink-0"
          >
            <span>सभी 1,420 योजनाएँ देखें / View All</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* 6 Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((item) => (
            <div
              key={item.id}
              className="group bg-[#0b162c] text-white rounded-2xl overflow-hidden shadow-lg border border-slate-700/60 flex flex-col justify-between transition-smooth hover:-translate-y-1 hover:shadow-2xl hover:border-amber-500/50"
            >
              <div>
                {/* Photo with Badge Overlay */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b162c] via-transparent to-black/30"></div>

                  {/* Top Schemes Count Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-md ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5">
                  <div className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wide">
                    {item.ministry}
                  </div>

                  <h3 className="text-lg font-black text-white mt-1 tracking-tight group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Primary Key Benefit */}
                  <div className="mt-3 flex items-start space-x-2 text-xs font-semibold text-emerald-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.benefit}</span>
                  </div>

                  {/* Secondary Tag Pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Target Audience & Orange CTA */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {item.targetAudience}
                </span>

                <button
                  onClick={() => {
                    onSelectCategory(item.id);
                    onCheckEligibility();
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm transition-smooth flex items-center space-x-1"
                >
                  <span>पात्रता जाँचें</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
