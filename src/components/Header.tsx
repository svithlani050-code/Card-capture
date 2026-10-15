import React from 'react';
import { Scan, History, Sparkles, Building2, Globe2 } from 'lucide-react';

export type UILang = 'en' | 'hi' | 'gu' | 'mr';

interface HeaderProps {
  currentTab: 'scan' | 'log';
  onTabChange: (tab: 'scan' | 'log') => void;
  visitorCount: number;
  uiLang: UILang;
  onLangChange: (lang: UILang) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  visitorCount,
  uiLang,
  onLangChange,
}) => {
  const titles: Record<UILang, { title: string; subtitle: string; scanTab: string; logTab: string }> = {
    en: {
      title: 'SmartCard Desk',
      subtitle: 'Multilingual AI Card Scanner & Visitor Entry',
      scanTab: 'Card Scanner',
      logTab: 'Visitor Log',
    },
    hi: {
      title: 'स्मार्टकार्ड डेस्क',
      subtitle: 'बहुभाषी एआई कार्ड स्कैनर एवं आगंतुक प्रविष्टि',
      scanTab: 'कार्ड स्कैनर',
      logTab: 'आगंतुक रजिस्टर',
    },
    gu: {
      title: 'સ્માર્ટકાર્ડ ડેસ્ક',
      subtitle: 'બહુભાષી AI કાર્ડ સ્કેનર અને મુલાકાતી એન્ટ્રી',
      scanTab: 'કાર્ડ સ્કેનર',
      logTab: 'મુલાકાતી લોગ',
    },
    mr: {
      title: 'स्मार्टकार्ड डेस्क',
      subtitle: 'बहुभाषिक AI कार्ड स्कॅनर आणि अभ्यागत नोंदणी',
      scanTab: 'कार्ड स्कॅनर',
      logTab: 'अभ्यागत यादी',
    },
  };

  const currentCopy = titles[uiLang] || titles.en;

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Scan className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                {currentCopy.title}
                <span className="text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                  Gemini AI
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {currentCopy.subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onTabChange('scan')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'scan'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>{currentCopy.scanTab}</span>
            </button>
            <button
              onClick={() => onTabChange('log')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'log'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{currentCopy.logTab}</span>
              {visitorCount > 0 && (
                <span className="ml-1 bg-indigo-400/20 text-indigo-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {visitorCount}
                </span>
              )}
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
            <Globe2 className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={uiLang}
              onChange={(e) => onLangChange(e.target.value as UILang)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer font-medium"
            >
              <option value="en" className="bg-slate-900 text-slate-200">English</option>
              <option value="hi" className="bg-slate-900 text-slate-200">हिंदी (Hindi)</option>
              <option value="gu" className="bg-slate-900 text-slate-200">ગુજરાતી (Gujarati)</option>
              <option value="mr" className="bg-slate-900 text-slate-200">मराठी (Marathi)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
