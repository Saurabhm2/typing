import React from 'react';
import { Timer, Zap, Target, AlertTriangle, Delete } from 'lucide-react';
import { TypingStats } from '../types/typing';

interface StatsBarProps {
  stats: TypingStats;
  durationSeconds: number; // 0 for untimed
  isActive: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  stats,
  durationSeconds,
  isActive,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime = durationSeconds > 0
    ? formatTime(Math.max(0, stats.remainingSeconds))
    : formatTime(stats.elapsedSeconds);

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {/* Timer */}
        <div className="flex flex-col px-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
            <Timer className="w-3.5 h-3.5 text-amber-700" />
            <span>{durationSeconds > 0 ? 'शिल्लक वेळ (Time Left)' : 'वेळ (Time)'}</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
            {displayTime}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {durationSeconds > 0 ? `${durationSeconds / 60} मि. चाचणी` : 'अमर्याद सराव'}
          </span>
        </div>

        {/* Net Speed (WPM) */}
        <div className="flex flex-col px-2 pt-2 sm:pt-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>निव्वळ गती (Net WPM)</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 tracking-tight">
            {stats.netWpm}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            शब्द प्रति मिनिट (WPM)
          </span>
        </div>

        {/* Gross Speed */}
        <div className="flex flex-col px-2 pt-2 sm:pt-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
            <Zap className="w-3.5 h-3.5 text-sky-600" />
            <span>एकूण गती (Gross WPM)</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
            {stats.grossWpm}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {Math.round(stats.totalKeystrokes / Math.max(1, stats.elapsedSeconds / 60))} KPM कीस्ट्रोक
          </span>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col px-2 pt-2 sm:pt-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>अचूकता (Accuracy)</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-700 tracking-tight">
            {stats.accuracy}%
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {stats.correctWordsCount} बरोबर · {stats.wrongWordsCount} चुका
          </span>
        </div>

        {/* Mistakes & Backspace */}
        <div className="flex flex-col px-2 pt-2 sm:pt-0 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>त्रुटी / बॅकस्पेस</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 tracking-tight">
            {stats.wrongWordsCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {stats.backspaceCount} वेळा बॅकस्पेस
          </span>
        </div>
      </div>
    </div>
  );
};
