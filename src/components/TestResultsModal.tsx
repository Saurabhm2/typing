import React, { useState } from 'react';
import { X, Award, RotateCcw, Printer, CheckCircle, AlertOctagon, TrendingUp, Check, ArrowRight } from 'lucide-react';
import { TestResult } from '../types/typing';

interface TestResultsModalProps {
  result: TestResult | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onSelectAnother: () => void;
}

export const TestResultsModal: React.FC<TestResultsModalProps> = ({
  result,
  isOpen,
  onClose,
  onRetry,
  onSelectAnother,
}) => {
  const [candidateName, setCandidateName] = useState('उमेदवार (Candidate)');

  if (!isOpen || !result) return null;

  const isPassed = result.grade !== 'Fail';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden print:m-0 print:border-none print:shadow-none">
        {/* Top Header */}
        <div className={`p-6 text-white ${isPassed ? 'bg-gradient-to-r from-emerald-800 to-teal-900' : 'bg-gradient-to-r from-slate-800 to-slate-900'} print:bg-white print:text-black print:border-b-2 print:border-slate-800`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold ${isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                {isPassed ? <Award className="w-7 h-7" /> : <AlertOctagon className="w-7 h-7" />}
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider opacity-80 block">
                  महाराष्ट्र टंकलेखन परीक्षा निकाल पत्रक (GCC-TBC Evaluation)
                </span>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {isPassed ? 'अभिनंदन! तुम्ही उत्तीर्ण झाला आहात' : 'चाचणी समाप्त - अधिक सराव आवश्यक'}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate / Candidate Strip */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">परीक्षार्थी नाव:</span>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="font-medium text-slate-900 border-b border-slate-300 hover:border-slate-500 focus:outline-none focus:border-amber-600 bg-transparent px-1 py-0.5 print:border-none"
            />
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>दिनांक: {result.date}</span>
            <span>·</span>
            <span className="text-amber-800 font-semibold">{result.passageTitle}</span>
          </div>
        </div>

        {/* Core Result Cards */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Net Speed */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-center">
              <span className="text-xs font-semibold text-emerald-800 block mb-1">
                निव्वळ गती (Net Speed)
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-800 tabular-nums">
                {result.netWpm}
              </div>
              <span className="text-[11px] text-emerald-600 mt-1 block">
                शब्द प्रति मिनिट (WPM)
              </span>
            </div>

            {/* Accuracy */}
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 text-center">
              <span className="text-xs font-semibold text-indigo-800 block mb-1">
                अचूकता (Accuracy)
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-800 tabular-nums">
                {result.accuracy}%
              </div>
              <span className="text-[11px] text-indigo-600 mt-1 block">
                मानक परीक्षा निकष
              </span>
            </div>

            {/* Gross Speed */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs font-semibold text-slate-600 block mb-1">
                एकूण गती (Gross)
              </span>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-slate-900 tabular-nums">
                {result.grossWpm}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                कच्ची गती (WPM)
              </span>
            </div>

            {/* Exam Grade */}
            <div className={`rounded-xl p-4 text-center border ${
              result.grade === 'A' ? 'bg-amber-50 border-amber-300 text-amber-900' :
              result.grade === 'B' ? 'bg-blue-50 border-blue-300 text-blue-900' :
              result.grade === 'C' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' :
              'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <span className="text-xs font-semibold block mb-1">
                श्रेणी (Result Grade)
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono">
                {result.grade === 'Fail' ? 'अनुत्तीर्ण' : `ग्रेड '${result.grade}'`}
              </div>
              <span className="text-[11px] mt-1 block font-medium">
                {result.gradeTitle}
              </span>
            </div>
          </div>

          {/* Granular Breakdown Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100/80 px-4 py-2.5 font-bold text-slate-700 border-b border-slate-200">
              सविस्तर आकडेवारी व कीस्ट्रोक विश्लेषण (Detailed Analysis)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-4">
              <div className="p-2">
                <span className="text-slate-400 block mb-0.5">एकूण टाईप केलेले शब्द</span>
                <span className="text-lg font-bold font-mono text-slate-900">{result.totalWords}</span>
              </div>
              <div className="p-2">
                <span className="text-slate-400 block mb-0.5">अचूक शब्द (Correct)</span>
                <span className="text-lg font-bold font-mono text-emerald-600">{result.correctWordsCount}</span>
              </div>
              <div className="p-2">
                <span className="text-slate-400 block mb-0.5">चुकीचे शब्द (Errors)</span>
                <span className="text-lg font-bold font-mono text-rose-600">{result.wrongWordsCount}</span>
              </div>
              <div className="p-2">
                <span className="text-slate-400 block mb-0.5">बॅकस्पेस वापर</span>
                <span className="text-lg font-bold font-mono text-slate-700">{result.backspaceCount} वेळा</span>
              </div>
            </div>
          </div>

          {/* Word Mistakes Review */}
          {result.wordsReview.filter((w) => !w.isCorrect).length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>झालेल्या चुकांचे पुनरावलोकन (Mistakes Review)</span>
                <span className="text-slate-400 font-normal">
                  (अपेक्षित शब्द विरुद्ध टाईप केलेला शब्द)
                </span>
              </h4>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {result.wordsReview
                  .filter((w) => !w.isCorrect)
                  .map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between bg-rose-50/40 font-serif">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-slate-500 text-[10px] block font-sans">अपेक्षित (Expected):</span>
                          <span className="font-semibold text-slate-900 text-sm">{item.targetWord}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 text-[10px] block font-sans">टाईप केलेला (Typed):</span>
                        <span className="font-semibold text-rose-700 text-sm line-through">
                          {item.typedWord || '(गाळलेला / सोडून दिला)'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>गुणपत्रिका प्रिंट करा (Print Certificate)</span>
          </button>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onSelectAnother}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              दुसरा पॅसेज निवडा
            </button>
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>पुन्हा चाचणी द्या (Retry)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
