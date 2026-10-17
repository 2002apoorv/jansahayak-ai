import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface PiiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PiiModal: React.FC<PiiModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-[#0b1528] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Zero PII Citizen Privacy Enclave
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-600">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>100% Client-Side Privacy Guarantee (GIGW 3.0 Standard)</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">No Aadhaar or Biometrics Collected:</strong> JanSahayak AI never prompts for, reads, or records 12-digit Aadhaar numbers, biometric fingerprints, or Iris scans.
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Deterministic Mathematical Evaluation:</strong> Qualification criteria are calculated against published statutory rules in-browser without storing identifying records on backend servers.
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Local Checklist Storage:</strong> Document preparation checkboxes are saved exclusively in your device's browser <code>localStorage</code>.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-smooth"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
