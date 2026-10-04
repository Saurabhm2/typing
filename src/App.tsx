import React, { useState, useEffect } from 'react';
import { Passage, TestSettings, TestResult } from './types/typing';
import { DEFAULT_PASSAGES, getAllPassages } from './data/passages';
import { fetchBlogPassages } from './data/blogPassages';
import { Header } from './components/Header';
import { TypingTestArea } from './components/TypingTestArea';
import { PassageSelector } from './components/PassageSelector';
import { CustomPassageModal } from './components/CustomPassageModal';
import { TestResultsModal } from './components/TestResultsModal';
import { RemingtonChartModal } from './components/RemingtonChartModal';
import { ExamRulesModal } from './components/ExamRulesModal';
import { Keyboard, Plus, History } from 'lucide-react';
import heroImage from './assets/images/remington_marathi_hero_1790436447556.jpg';

const SETTINGS_STORAGE_KEY = 'marathi_remington_user_settings';
const RESULTS_HISTORY_KEY = 'marathi_remington_results_history';

const DEFAULT_SETTINGS: TestSettings = {
  durationSeconds: 300, // 5 minutes standard test
  backspace: 'full',
  inputMode: 'remington',
  fontSize: 'base',
  soundEnabled: true,
  showKeyboard: true,
  highlightNextKey: true,
  fingerGuide: true,
  theme: 'paper',
};

export default function App() {
  // Passages
  const [passages, setPassages] = useState<Passage[]>(DEFAULT_PASSAGES);
  const [selectedPassage, setSelectedPassage] = useState<Passage>(DEFAULT_PASSAGES[0]);

  // Settings
  const [settings, setSettings] = useState<TestSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'test' | 'passages' | 'results'>('test');

  // Modals
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isKeyboardModalOpen, setIsKeyboardModalOpen] = useState(false);
  const [isExamRulesOpen, setIsExamRulesOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  // Past test results history
  const [resultsHistory, setResultsHistory] = useState<TestResult[]>(() => {
    try {
      const stored = localStorage.getItem(RESULTS_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Reload passages on mount or when custom passage is saved
  const refreshPassages = () => {
    const all = getAllPassages();
    setPassages(all);
  };

  useEffect(() => {
    refreshPassages();
  }, []);

  // Pull fresh practice passages from the blog feed. Failures are silent so a
  // blog outage never blocks the built-in passage library.
  useEffect(() => {
    let cancelled = false;
    fetchBlogPassages()
      .then((blogPassages) => {
        if (cancelled || blogPassages.length === 0) return;
        setPassages((prev) => {
          const blogIds = new Set(blogPassages.map((p) => p.id));
          const kept = prev.filter((p) => !blogIds.has(p.id));
          return [...blogPassages, ...kept];
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpdateSettings = (newSettings: Partial<TestSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const handleSelectPassage = (passage: Passage) => {
    setSelectedPassage(passage);
    setActiveTab('test');
  };

  const handleTestComplete = (result: TestResult) => {
    setCurrentResult(result);
    setIsResultsModalOpen(true);
    setResultsHistory((prev) => {
      const updated = [result, ...prev.slice(0, 19)];
      try {
        localStorage.setItem(RESULTS_HISTORY_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 3-Zone Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCustomPassage={() => setIsCustomModalOpen(true)}
        onOpenKeyboardChart={() => setIsKeyboardModalOpen(true)}
        onOpenExamRules={() => setIsExamRulesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Editorial Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
          <div className="absolute inset-0 z-0 opacity-25">
            <img
              src={heroImage}
              alt="मराठी टंकलेखन Remington कीबोर्ड"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Resilient CSS gradient fallback per zero-broken-image policy
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/70" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium tracking-wide">
                <span>GCC-TBC महाराष्ट्र शासन परीक्षा मानक</span>
                <span aria-hidden="true">·</span>
                <span>Remington Gail Layout</span>
                <span aria-hidden="true">·</span>
                <span>३० व ४० WPM सराव</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                मराठी Remington टायपिंग टेस्ट व सराव पोर्टल
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                कोणतेही सॉफ्टवेअर इन्स्टॉल न करता थेट कॉम्प्युटर कीबोर्डवरून अस्सल Remington टायपिंग करा. अचूक गती (Net WPM), अचूकता टक्केवारी आणि चुकांचे सविस्तर विश्लेषण.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsCustomModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-slate-900" />
                <span>कस्टम पॅसेज जोडा (Custom)</span>
              </button>
              <button
                onClick={() => setIsKeyboardModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <Keyboard className="w-4 h-4 text-amber-400" />
                <span>Alt कोड्स चार्ट</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab View: Test Mode */}
        {activeTab === 'test' && (
          <TypingTestArea
            passage={selectedPassage}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onTestComplete={handleTestComplete}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
          />
        )}

        {/* Tab View: Passage Library */}
        {activeTab === 'passages' && (
          <PassageSelector
            passages={passages}
            selectedPassage={selectedPassage}
            onSelectPassage={handleSelectPassage}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
          />
        )}

        {/* Quick Recent Tests Strip */}
        {resultsHistory.length > 0 && activeTab === 'test' && (
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <History className="w-4 h-4 text-amber-700" />
                <span>अलीकडील चाचण्यांचा इतिहास (Recent Practice Tests)</span>
              </div>
              <span className="text-slate-400">एकूण {resultsHistory.length} चाचण्या</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {resultsHistory.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  onClick={() => {
                    setCurrentResult(res);
                    setIsResultsModalOpen(true);
                  }}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-amber-400 transition-colors cursor-pointer text-xs flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-slate-900 truncate">
                      {res.passageTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {res.date} · {res.durationSeconds > 0 ? `${res.durationSeconds / 60} मि.` : 'सराव'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold font-mono text-emerald-700 text-sm">
                      {res.netWpm} WPM
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {res.accuracy}% अचूकता
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">मराठी Remington टायपिंग टेस्ट</span>
            <span>·</span>
            <span>TypingWale पॅटर्न व GCC-TBC ३०/४० मानक</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsExamRulesOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              परीक्षेचे नियम
            </button>
            <button
              onClick={() => setIsKeyboardModalOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Remington कीबोर्ड चार्ट
            </button>
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              कस्टम पॅसेज
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CustomPassageModal
        isOpen={isCustomModalOpen}
        onClose={() => {
          setIsCustomModalOpen(false);
          refreshPassages();
        }}
        onSelectPassage={(p) => {
          refreshPassages();
          handleSelectPassage(p);
        }}
      />

      <RemingtonChartModal
        isOpen={isKeyboardModalOpen}
        onClose={() => setIsKeyboardModalOpen(false)}
      />

      <ExamRulesModal
        isOpen={isExamRulesOpen}
        onClose={() => setIsExamRulesOpen(false)}
      />

      <TestResultsModal
        isOpen={isResultsModalOpen}
        result={currentResult}
        onClose={() => setIsResultsModalOpen(false)}
        onRetry={() => {
          setIsResultsModalOpen(false);
          // Test will reset automatically
        }}
        onSelectAnother={() => {
          setIsResultsModalOpen(false);
          setActiveTab('passages');
        }}
      />
    </div>
  );
}
