import React, { useState, useEffect } from 'react';
import { Sparkles, Languages, Check, Loader2 } from 'lucide-react';
import { UILang } from './Header';

interface ScanningOverlayProps {
  cardImage: string;
  onCancel: () => void;
  uiLang: UILang;
}

const PARSING_STEPS = [
  'Detecting card boundaries and perspective correction...',
  'Recognizing Latin, Devanagari (Hindi/Marathi) & Gujarati scripts...',
  'Extracting Bengali, Punjabi, Malayalam & South Indian characters...',
  'Filtering phone numbers (+91), WhatsApp, emails & websites...',
  'Parsing address components: Street, City, State, Pincode...',
  'Extracting GSTIN, PAN, and corporate identity numbers...',
  'Formatting structured fields for desk operator inspection...',
];

export const ScanningOverlay: React.FC<ScanningOverlayProps> = ({
  cardImage,
  onCancel,
  uiLang,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % PARSING_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const headline = {
    en: 'Gemini AI Reading Card Details...',
    hi: 'एआई बहुभाषी कार्ड विवरण पढ़ रहा है...',
    gu: 'AI બહુભાષી કાર્ડની વિગતો વાંચી રહ્યું છે...',
    mr: 'AI बहुभाषिक कार्ड तपशील वाचत आहे...',
  }[uiLang];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-center">
        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            Step 2: Multilingual OCR Active
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {headline}
          </h3>
          <p className="text-xs text-slate-400">
            English, Hindi, Gujarati, Marathi, Punjabi, Malayalam, Bengali & more
          </p>
        </div>

        {/* Card Scanner Visual Frame */}
        <div className="relative aspect-[1.6/1] max-w-sm mx-auto rounded-xl overflow-hidden bg-slate-950 border-2 border-indigo-500/40 shadow-inner">
          <img
            src={cardImage}
            alt="Scanning card"
            className="w-full h-full object-cover filter brightness-90"
          />

          {/* Laser Scan Beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan-line pointer-events-none" />

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

          {/* Corner targets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
        </div>

        {/* Animated Progress & Step Indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-xs font-medium text-slate-300 bg-slate-950/70 py-2.5 px-4 rounded-xl border border-slate-800">
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
            <span className="truncate">{PARSING_STEPS[currentStepIdx]}</span>
          </div>

          {/* Script Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">English</span>
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-medium">हिंदी (Hindi)</span>
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-medium">ગુજરાતી (Gujarati)</span>
            <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 font-medium">मराठी (Marathi)</span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-medium">বাংলা (Bengali)</span>
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-medium">ਪੰਜਾਬੀ (Punjabi)</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Cancel and return
          </button>
        </div>
      </div>
    </div>
  );
};
