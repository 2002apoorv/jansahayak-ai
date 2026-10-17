import React, { useState } from 'react';
import { X, Store, MapPin, Search, ExternalLink, Phone } from 'lucide-react';

interface CscModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CscModal: React.FC<CscModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  if (!isOpen) return null;

  const sampleCenters = [
    {
      id: 1,
      vleName: 'Rameshwar Sharma',
      centerName: 'CSC Seva Kendra - Bhopal South',
      address: 'Shop 14, Gram Panchayat Bhawan, Arera Hills, Bhopal, Madhya Pradesh',
      pin: '462011',
      state: 'Madhya Pradesh',
      phone: '+91 98260 XXXXX',
      timing: '9:00 AM - 6:00 PM',
      services: ['PM-KISAN eKYC', 'Ayushman Card Print', 'Mudra Dossier', 'PMAY Registry'],
    },
    {
      id: 2,
      vleName: 'Sunita Devi',
      centerName: 'Digital Seva Kendra - Varanasi Rural',
      address: 'Near Primary Health Centre, Shivpur, Varanasi, Uttar Pradesh',
      pin: '221003',
      state: 'Uttar Pradesh',
      phone: '+91 94152 XXXXX',
      timing: '8:30 AM - 7:00 PM',
      services: ['Kisan Credit Card', 'NSP Scholarship KYC', 'DigiLocker Verification'],
    },
    {
      id: 3,
      vleName: 'Ganesh Kadam',
      centerName: 'CSC Common Services - Pune Taluka',
      address: 'Plot 5, Main Market Road, Haveli, Pune, Maharashtra',
      pin: '411028',
      state: 'Maharashtra',
      phone: '+91 98811 XXXXX',
      timing: '9:30 AM - 6:30 PM',
      services: ['Street Vendor Loans (SVANidhi)', 'Sukanya Samriddhi Enrollment', 'Aadhaar eKYC'],
    },
  ];

  const filteredCenters = sampleCenters.filter((c) => {
    const matchesSearch =
      c.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pin.includes(searchTerm) ||
      c.vleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'All' || c.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#0b1528] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                डिजिटल सेवा केंद्र (CSC Kiosk Locator)
              </h3>
              <p className="text-xs text-slate-300">
                Find assisted scheme application kiosks near your village or town
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by District, PIN Code (e.g. 462011) or VLE name..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shrink-0"
          >
            <option value="All">All States</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>

        {/* Center Listings */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3.5">
          {filteredCenters.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-sm transition-smooth"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{c.centerName}</h4>
                  <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                    Certified VLE: {c.vleName}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Open: {c.timing}
                </span>
              </div>

              <div className="mt-2.5 flex items-start space-x-1.5 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{c.address} (PIN: {c.pin})</span>
              </div>

              <div className="mt-1 flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact: {c.phone}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.services.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span>Visit the National CSC Portal for GPS navigation:</span>
            <a
              href="https://locator.csccloud.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-amber-800 flex items-center space-x-1"
            >
              <span>locator.csccloud.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-smooth"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
