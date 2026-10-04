import React from 'react';
import { KEYBOARD_ROWS, KeyDefinition } from '../utils/remingtonEngine';

interface OnscreenKeyboardProps {
  isShiftActive: boolean;
  onToggleShift: () => void;
  activeKeyCode?: string;
  nextTargetKey?: { key: string; shift: boolean; label: string } | null;
  showFingerGuide?: boolean;
  onVirtualKeyPress?: (char: string) => void;
}

const FINGER_COLORS: Record<KeyDefinition['finger'], string> = {
  'l-pinky': 'border-b-pink-400',
  'l-ring': 'border-b-purple-400',
  'l-middle': 'border-b-blue-400',
  'l-index': 'border-b-emerald-400',
  'thumb': 'border-b-amber-400',
  'r-index': 'border-b-teal-400',
  'r-middle': 'border-b-sky-400',
  'r-ring': 'border-b-indigo-400',
  'r-pinky': 'border-b-rose-400',
};

export const OnscreenKeyboard: React.FC<OnscreenKeyboardProps> = ({
  isShiftActive,
  onToggleShift,
  activeKeyCode,
  nextTargetKey,
  showFingerGuide = false,
  onVirtualKeyPress,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 select-none overflow-x-auto">
      {/* Keyboard Status Bar */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">मराठी Remington कीबोर्ड लेआउट (ISM / Gail)</span>
          {nextTargetKey && (
            <div className="flex items-center gap-1.5 text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded text-[11px]">
              <span>पुढील अक्षर:</span>
              <span className="font-bold text-amber-200 text-sm">{nextTargetKey.label}</span>
              <span className="text-slate-400">
                (दाबा: {nextTargetKey.shift ? 'Shift + ' : ''}&apos;{nextTargetKey.key}&apos;)
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleShift}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
              isShiftActive
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Shift: {isShiftActive ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 min-w-[720px]">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5 justify-center">
            {/* Row 2 Tab Key */}
            {rowIdx === 1 && (
              <div className="w-14 h-11 bg-slate-800/80 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
                Tab
              </div>
            )}
            {/* Row 3 CapsLock Key */}
            {rowIdx === 2 && (
              <div className="w-16 h-11 bg-slate-800/80 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
                Caps
              </div>
            )}
            {/* Row 4 Left Shift Key */}
            {rowIdx === 3 && (
              <button
                type="button"
                onClick={onToggleShift}
                className={`w-20 h-11 rounded-md flex items-center justify-center text-xs font-mono font-semibold cursor-pointer transition-colors ${
                  isShiftActive ? 'bg-amber-600 text-white' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Shift ⇧
              </button>
            )}

            {/* Individual Keys */}
            {row.map((k) => {
              const isPressed = activeKeyCode === k.code;
              const isNextTarget =
                nextTargetKey &&
                (nextTargetKey.key.toLowerCase() === k.keyNormal.toLowerCase() ||
                  nextTargetKey.key === k.keyShift);

              const activeChar = isShiftActive ? k.charShift : k.charNormal;
              const secondaryChar = isShiftActive ? k.charNormal : k.charShift;

              return (
                <button
                  type="button"
                  key={k.code}
                  onClick={() => onVirtualKeyPress?.(activeChar)}
                  className={`relative flex-1 min-w-[42px] max-w-[54px] h-11 rounded-md flex flex-col items-center justify-between p-1 transition-all text-left cursor-pointer ${
                    isPressed
                      ? 'bg-amber-500 text-slate-950 scale-95 shadow-inner'
                      : isNextTarget
                      ? 'bg-amber-950/80 border-2 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700/80 text-slate-100 border border-slate-700/60'
                  } ${showFingerGuide ? `border-b-2 ${FINGER_COLORS[k.finger]}` : ''}`}
                >
                  {/* Top secondary indicator */}
                  <div className="w-full flex justify-between items-center text-[10px] text-slate-400 font-mono leading-none">
                    <span>{isShiftActive ? k.keyNormal : k.keyShift}</span>
                    <span className="text-[11px] opacity-70">{secondaryChar}</span>
                  </div>

                  {/* Main Devanagari Character */}
                  <div className="text-base font-semibold font-serif text-center leading-none my-auto">
                    {activeChar}
                  </div>

                  {/* Physical English key */}
                  <div className="w-full text-right text-[9px] text-slate-500 font-mono uppercase leading-none">
                    {isShiftActive ? k.keyShift : k.keyNormal}
                  </div>
                </button>
              );
            })}

            {/* Row 1 Backspace */}
            {rowIdx === 0 && (
              <div className="w-18 h-11 bg-slate-800/80 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
                Backspace
              </div>
            )}
            {/* Row 2 Enter top */}
            {rowIdx === 1 && (
              <div className="w-12 h-11 bg-slate-800/80 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
                \ |
              </div>
            )}
            {/* Row 3 Enter */}
            {rowIdx === 2 && (
              <div className="w-20 h-11 bg-slate-800/80 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
                Enter ↵
              </div>
            )}
            {/* Row 4 Right Shift */}
            {rowIdx === 3 && (
              <button
                type="button"
                onClick={onToggleShift}
                className={`w-24 h-11 rounded-md flex items-center justify-center text-xs font-mono font-semibold cursor-pointer transition-colors ${
                  isShiftActive ? 'bg-amber-600 text-white' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Shift ⇧
              </button>
            )}
          </div>
        ))}

        {/* Spacebar Row */}
        <div className="flex gap-1.5 justify-center mt-1">
          <div className="w-16 h-10 bg-slate-800/70 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
            Ctrl
          </div>
          <div className="w-16 h-10 bg-slate-800/70 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
            Alt
          </div>
          <button
            type="button"
            onClick={() => onVirtualKeyPress?.(' ')}
            className={`w-[360px] h-10 rounded-md flex items-center justify-center text-xs text-slate-400 font-mono cursor-pointer transition-all ${
              activeKeyCode === 'Space'
                ? 'bg-amber-500 text-slate-950 scale-[0.99]'
                : 'bg-slate-800 hover:bg-slate-700/80 border border-slate-700'
            }`}
          >
            Space (पुढील शब्द)
          </button>
          <div className="w-16 h-10 bg-slate-800/70 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
            Alt Gr
          </div>
          <div className="w-16 h-10 bg-slate-800/70 text-slate-400 rounded-md flex items-center justify-center text-xs font-mono">
            Ctrl
          </div>
        </div>
      </div>

      {/* Finger Guide Legend */}
      {showFingerGuide && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-center gap-4 text-[11px] text-slate-400 flex-wrap">
          <span className="font-medium text-slate-300">बोटांचे मार्गदर्शन (Finger Guide):</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block" />
            <span>करंगळी (Pinky)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
            <span>अनामिका (Ring)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
            <span>मध्यमा (Middle)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>तर्जनी (Index)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>अंगठा (Thumb - Space)</span>
          </div>
        </div>
      )}
    </div>
  );
};
