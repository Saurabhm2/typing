import React from 'react';
import { Keyboard, Plus, FileText, Info, Award } from 'lucide-react';

interface HeaderProps {
  onOpenCustomPassage: () => void;
  onOpenKeyboardChart: () => void;
  onOpenExamRules: () => void;
  activeTab: 'test' | 'passages' | 'results';
  setActiveTab: (tab: 'test' | 'passages' | 'results') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCustomPassage,
  onOpenKeyboardChart,
  onOpenExamRules,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
            म
          </div>
          <button
            onClick={() => setActiveTab('test')}
            className="text-left group cursor-pointer"
          >
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
              मराठी Remington टायपिंग
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('test')}
            className={`cursor-pointer transition-colors pb-0.5 border-b-2 ${
              activeTab === 'test'
                ? 'text-amber-700 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            टायपिंग टेस्ट (Test)
          </button>
          <button
            onClick={() => setActiveTab('passages')}
            className={`cursor-pointer transition-colors pb-0.5 border-b-2 ${
              activeTab === 'passages'
                ? 'text-amber-700 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            पॅसेज निवडा (Library)
          </button>
          <button
            onClick={onOpenKeyboardChart}
            className="cursor-pointer transition-colors pb-0.5 border-b-2 border-transparent hover:text-slate-900 hover:border-slate-300 flex items-center gap-1.5"
          >
            <Keyboard className="w-4 h-4 text-slate-500" />
            <span>Remington लेआउट व Alt कोड्स</span>
          </button>
          <button
            onClick={onOpenExamRules}
            className="cursor-pointer transition-colors pb-0.5 border-b-2 border-transparent hover:text-slate-900 hover:border-slate-300 flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-slate-500" />
            <span>GCC-TBC परीक्षा नियम</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCustomPassage}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 active:scale-[0.98] rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>कस्टम पॅसेज (Custom Passage)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
