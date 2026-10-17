import React from 'react';
import { Smartphone, Store, ArrowRight, MapPin } from 'lucide-react';

interface CitizenTouchpointsProps {
  onOpenSelfCheck: () => void;
  onOpenCscModal: () => void;
}

export const CitizenTouchpoints: React.FC<CitizenTouchpointsProps> = ({
  onOpenSelfCheck,
  onOpenCscModal,
}) => {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase tracking-tight">
            CITIZEN TOUCHPOINTS & ASSISTED ACCESS
          </h2>
        </div>

        {/* 2 Split Touchpoint Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Self-Service Mobile Portal */}
          <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-smooth flex flex-col sm:flex-row">
            <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-slate-200 shrink-0">
              <img
                src="/images/mobile_citizen.jpg"
                alt="स्वयं सेवा मोबाइल पोर्टल - भारतीय नागरिक"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white uppercase tracking-wider">
                  MOBILE CITIZEN APP
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 uppercase tracking-wide">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>INSTANT MOBILE CHECK</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mt-1">
                  स्वयं सेवा मोबाइल पोर्टल
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Check 1,420+ scheme qualifications directly from your mobile device in 2 minutes. Available in 12 Indian languages.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                  100% Free Service
                </span>

                <button
                  onClick={onOpenSelfCheck}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0b1528] hover:bg-[#16274a] text-white shadow-xs transition-smooth flex items-center space-x-1.5"
                >
                  <span>Open Check</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Digital Seva / CSC Kiosk */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-smooth flex flex-col sm:flex-row">
            <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-slate-200 shrink-0">
              <img
                src="/images/csc_kiosk.jpg"
                alt="डिजिटल सेवा केंद्र - ग्राम पंचायत वीएलई"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white uppercase tracking-wider">
                  CSC DIGITAL SEVA
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  <Store className="w-3.5 h-3.5" />
                  <span>ASSISTED ACCESS</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mt-1">
                  डिजिटल सेवा केंद्र (CSC Kiosk)
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  5,20,000+ VLEs nationwide ready to assist farmers, elders, and women with e-KYC and scheme enrollment dossier prints.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Near You: In 15 Mins</span>
                </span>

                <button
                  onClick={onOpenCscModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#047857] hover:bg-[#065f46] text-white shadow-xs transition-smooth flex items-center space-x-1.5"
                >
                  <span>Find CSC</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
