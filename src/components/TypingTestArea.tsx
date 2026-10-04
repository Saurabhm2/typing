import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RotateCcw, Volume2, VolumeX, Eye, EyeOff, Settings, CheckCircle2, Play, Square, Award, Type } from 'lucide-react';
import { Passage, TestSettings, TypingStats, WordComparison, TestResult } from '../types/typing';
import { StatsBar } from './StatsBar';
import { OnscreenKeyboard } from './OnscreenKeyboard';
import { RemingtonTransliterationEngine, findRemingtonKeyForChar } from '../utils/remingtonEngine';
import { sound } from '../utils/sound';

interface TypingTestAreaProps {
  passage: Passage;
  settings: TestSettings;
  onUpdateSettings: (newSettings: Partial<TestSettings>) => void;
  onTestComplete: (result: TestResult) => void;
  onOpenCustomModal: () => void;
}

export const TypingTestArea: React.FC<TypingTestAreaProps> = ({
  passage,
  settings,
  onUpdateSettings,
  onTestComplete,
  onOpenCustomModal,
}) => {
  // Target words derived from passage
  const targetWords = useMemo(() => {
    return passage.text.trim().split(/\s+/).filter(Boolean);
  }, [passage.text]);

  // Test state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [wordResults, setWordResults] = useState<WordComparison[]>([]);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [wrongKeystrokes, setWrongKeystrokes] = useState(0);
  const [backspaceCount, setBackspaceCount] = useState(0);

  // Keyboard visualization state
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [activeKeyCode, setActiveKeyCode] = useState<string | undefined>(undefined);

  // References
  const inputRef = useRef<HTMLInputElement>(null);
  const passageContainerRef = useRef<HTMLDivElement>(null);
  const typedBoxRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const remingtonEngineRef = useRef(new RemingtonTransliterationEngine());

  // Reset test state whenever passage or duration changes
  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setWordResults([]);
    setIsTestStarted(false);
    setIsTestFinished(false);
    setElapsedSeconds(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setWrongKeystrokes(0);
    setBackspaceCount(0);
    setIsShiftActive(false);
    setActiveKeyCode(undefined);
    remingtonEngineRef.current.reset();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    resetTest();
  }, [passage.id, settings.durationSeconds, resetTest]);

  // Auto-scroll target passage view to keep the active word in view
  useEffect(() => {
    if (activeWordRef.current && passageContainerRef.current) {
      const container = passageContainerRef.current;
      const word = activeWordRef.current;
      const wordTop = word.offsetTop;
      const containerHeight = container.clientHeight;
      if (wordTop > container.scrollTop + containerHeight - 60 || wordTop < container.scrollTop + 20) {
        container.scrollTo({
          top: Math.max(0, wordTop - 40),
          behavior: 'smooth',
        });
      }
    }
  }, [currentWordIndex]);

  // Auto-scroll typed area to keep the current typed text and cursor in view
  useEffect(() => {
    if (typedBoxRef.current) {
      typedBoxRef.current.scrollTo({
        top: typedBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [wordResults.length, currentInput]);

  // Live Stats Calculation
  const stats: TypingStats = useMemo(() => {
    const elapsedMinutes = Math.max(elapsedSeconds / 60, 0.016); // at least 1 second
    const correctWords = wordResults.filter((w) => w.isCorrect).length;
    const wrongWords = wordResults.filter((w) => !w.isCorrect).length;
    const totalWords = wordResults.length;

    // Formula conforming to GCC-TBC standard:
    // Gross WPM = (Total Keystrokes / 5) / Elapsed Minutes
    const grossWpm = Math.round((totalKeystrokes / 5) / elapsedMinutes);
    // Net WPM = Gross WPM - (wrongWords / elapsedMinutes)
    const netWpm = Math.max(0, Math.round(grossWpm - (wrongWords / elapsedMinutes)));

    const accuracy = totalWords > 0
      ? Math.round((correctWords / totalWords) * 100)
      : totalKeystrokes > 0
      ? Math.max(0, Math.round((correctKeystrokes / totalKeystrokes) * 100))
      : 100;

    const remainingSeconds = settings.durationSeconds > 0
      ? Math.max(0, settings.durationSeconds - elapsedSeconds)
      : 0;

    return {
      elapsedSeconds,
      remainingSeconds,
      totalKeystrokes,
      correctKeystrokes,
      wrongKeystrokes,
      backspaceCount,
      grossWpm,
      netWpm,
      accuracy,
      wordsTyped: totalWords,
      correctWordsCount: correctWords,
      wrongWordsCount: wrongWords,
    };
  }, [
    elapsedSeconds,
    totalKeystrokes,
    correctKeystrokes,
    wrongKeystrokes,
    backspaceCount,
    wordResults,
    settings.durationSeconds,
  ]);

  // Complete test callback
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTestFinished(true);

    if (settings.soundEnabled) {
      sound.playBell();
    }

    // Determine GCC-TBC Exam Grade
    let grade: 'A' | 'B' | 'C' | 'Fail' = 'Fail';
    let gradeTitle = 'अनुत्तीर्ण (अधिक सराव आवश्यक)';

    if (stats.netWpm >= 40 && stats.accuracy >= 92) {
      grade = 'A';
      gradeTitle = 'विशेष प्रावीण्य (Grade A)';
    } else if (stats.netWpm >= 35 && stats.accuracy >= 88) {
      grade = 'B';
      gradeTitle = 'प्रथम श्रेणी (Grade B)';
    } else if (stats.netWpm >= 28 && stats.accuracy >= 82) {
      grade = 'C';
      gradeTitle = 'उत्तीर्ण (Grade C)';
    }

    const resultPayload: TestResult = {
      id: 'result-' + Date.now(),
      date: new Date().toLocaleDateString('mr-IN'),
      passageTitle: passage.title,
      passageCategory: passage.category,
      durationSeconds: settings.durationSeconds,
      timeSpentSeconds: elapsedSeconds,
      grossWpm: stats.grossWpm,
      netWpm: stats.netWpm,
      accuracy: stats.accuracy,
      totalKeystrokes,
      correctKeystrokes,
      wrongKeystrokes,
      backspaceCount,
      totalWords: wordResults.length,
      correctWordsCount: stats.correctWordsCount,
      wrongWordsCount: stats.wrongWordsCount,
      grade,
      gradeTitle,
      wordsReview: wordResults,
    };

    onTestComplete(resultPayload);
  }, [
    elapsedSeconds,
    stats,
    passage.title,
    passage.category,
    settings.durationSeconds,
    settings.soundEnabled,
    totalKeystrokes,
    correctKeystrokes,
    wrongKeystrokes,
    backspaceCount,
    wordResults,
    onTestComplete,
  ]);

  // Timer tick effect
  useEffect(() => {
    if (isTestStarted && !isTestFinished) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (settings.durationSeconds > 0 && next >= settings.durationSeconds) {
            finishTest();
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestStarted, isTestFinished, settings.durationSeconds, finishTest]);

  // Calculate Next Target Key on Remington layout for learner guidance
  const currentTargetWord = targetWords[currentWordIndex] || '';
  const nextTargetChar = currentTargetWord[currentInput.length] || '';
  const nextKeyHint = useMemo(() => {
    if (!settings.highlightNextKey || !nextTargetChar) return null;
    return findRemingtonKeyForChar(nextTargetChar);
  }, [nextTargetChar, settings.highlightNextKey]);

  // Keydown handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTestFinished) return;

    // Track Shift key
    if (e.key === 'Shift') {
      setIsShiftActive(true);
      return;
    }

    // Light up pressed key on virtual keyboard
    setActiveKeyCode(e.code);
    setTimeout(() => setActiveKeyCode(undefined), 150);

    // Start timer on first keypress
    if (!isTestStarted) {
      setIsTestStarted(true);
    }

    // Ignore Tab, Alt, Ctrl, etc.
    if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Tab' || e.key === 'Escape' || e.key === 'CapsLock') {
      return;
    }

    // Backspace handling
    if (e.key === 'Backspace') {
      if (settings.backspace === 'disabled') {
        e.preventDefault();
        if (settings.soundEnabled) sound.playError();
        return;
      }

      setBackspaceCount((prev) => prev + 1);

      if (currentInput.length > 0) {
        if (settings.inputMode === 'remington') {
          e.preventDefault();
          const updated = remingtonEngineRef.current.handleKey(currentInput, 'Backspace');
          setCurrentInput(updated);
          if (settings.soundEnabled) sound.playClick();
        }
      } else if (settings.backspace === 'full' && wordResults.length > 0) {
        // Full backspace: recall the previous word to allow editing
        e.preventDefault();
        const prevResults = [...wordResults];
        const lastWordObj = prevResults.pop();
        if (lastWordObj) {
          setWordResults(prevResults);
          setCurrentWordIndex((idx) => Math.max(0, idx - 1));
          setCurrentInput(lastWordObj.typedWord);
          if (settings.soundEnabled) sound.playClick();
        }
      }
      return;
    }

    // Spacebar pressed: Submit current word and advance!
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();

      if (!currentInput.trim()) {
        // Avoid skipping on empty spaces
        return;
      }

      const typedTrimmed = currentInput.trim();
      const targetTrimmed = (targetWords[currentWordIndex] || '').trim();
      const isWordCorrect = typedTrimmed === targetTrimmed;

      if (settings.soundEnabled) {
        sound.playClick(true);
      }

      // Record comparison
      setWordResults((prev) => [
        ...prev,
        {
          targetWord: targetTrimmed,
          typedWord: typedTrimmed,
          isCorrect: isWordCorrect,
          index: currentWordIndex,
        },
      ]);

      // Count strokes: the characters were already counted per-keystroke above,
      // so only the spacebar itself is added here to avoid double counting.
      setTotalKeystrokes((prev) => prev + 1);
      if (isWordCorrect) {
        setCorrectKeystrokes((prev) => prev + typedTrimmed.length + 1);
      } else {
        setWrongKeystrokes((prev) => prev + typedTrimmed.length + 1);
      }

      // Advance to next word
      const nextWordIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextWordIdx);
      setCurrentInput('');
      remingtonEngineRef.current.reset();

      // Check if all words completed
      if (nextWordIdx >= targetWords.length) {
        finishTest();
      }
      return;
    }

    // Regular typing in Remington mode
    if (settings.inputMode === 'remington') {
      e.preventDefault();
      const rawChar = e.key;
      const updated = remingtonEngineRef.current.handleKey(currentInput, rawChar);
      setCurrentInput(updated);

      setTotalKeystrokes((prev) => prev + 1);
      if (settings.soundEnabled) {
        sound.playClick();
      }
    } else {
      // In native IME Unicode mode, keypress will trigger onChange directly
      if (settings.soundEnabled) {
        sound.playClick();
      }
      setTotalKeystrokes((prev) => prev + 1);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Shift') {
      setIsShiftActive(false);
    }
  };

  // Virtual keyboard click handler
  const handleVirtualKeyPress = (char: string) => {
    if (isTestFinished) return;
    if (!isTestStarted) setIsTestStarted(true);

    if (char === ' ') {
      // Space
      const fakeEvent = {
        key: ' ',
        code: 'Space',
        preventDefault: () => {},
        ctrlKey: false,
        altKey: false,
        metaKey: false,
      } as unknown as React.KeyboardEvent<HTMLInputElement>;
      handleKeyDown(fakeEvent);
      return;
    }

    setCurrentInput((prev) => prev + char);
    setTotalKeystrokes((prev) => prev + 1);
    if (settings.soundEnabled) sound.playClick();
    inputRef.current?.focus();
  };

  const fontSizeClass = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg leading-loose',
    lg: 'text-lg sm:text-xl leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose',
  }[settings.fontSize];

  return (
    <div className="space-y-4">
      {/* Top Telemetry Stats Bar */}
      <StatsBar
        stats={stats}
        durationSeconds={settings.durationSeconds}
        isActive={isTestStarted && !isTestFinished}
      />

      {/* Control & Customization Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        {/* Left: Duration Selector */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">वेळ (Duration):</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            {[
              { sec: 60, label: '१ मि.' },
              { sec: 120, label: '२ मि.' },
              { sec: 300, label: '५ मि.' },
              { sec: 600, label: '१० मि. (GCC)' },
              { sec: 0, label: 'अमर्याद' },
            ].map((d) => (
              <button
                key={d.sec}
                onClick={() => {
                  onUpdateSettings({ durationSeconds: d.sec });
                  resetTest();
                }}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                  settings.durationSeconds === d.sec
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Input Mode (Remington vs Unicode) */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">कीबोर्ड मोड:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => onUpdateSettings({ inputMode: 'remington' })}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                settings.inputMode === 'remington'
                  ? 'bg-amber-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="इंग्रजी कीबोर्डवरून थेट Remington टायपिंग"
            >
              Remington इन-ब्राउझर (Auto)
            </button>
            <button
              onClick={() => onUpdateSettings({ inputMode: 'unicode' })}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                settings.inputMode === 'unicode'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Windows मधील Marathi Indic / ISM कीबोर्ड वापरण्यासाठी"
            >
              सिस्टीम IME (Direct)
            </button>
          </div>
        </div>

        {/* Right: Quick Toggles (Backspace, Sound, Keyboard, Font) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Backspace Mode */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">बॅकस्पेस:</span>
            <select
              value={settings.backspace}
              onChange={(e) => onUpdateSettings({ backspace: e.target.value as TestSettings['backspace'] })}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-amber-600 cursor-pointer"
            >
              <option value="full">नेहमी चालू (Full)</option>
              <option value="restricted">फक्त चालू शब्द (Restricted)</option>
              <option value="disabled">बंद (Exam Strict)</option>
            </select>
          </div>

          {/* Font Size Toggle */}
          <button
            onClick={() => {
              const sizes: TestSettings['fontSize'][] = ['sm', 'base', 'lg', 'xl'];
              const nextIdx = (sizes.indexOf(settings.fontSize) + 1) % sizes.length;
              onUpdateSettings({ fontSize: sizes[nextIdx] });
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="फॉन्ट आकार बदला"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              settings.soundEnabled ? 'text-amber-700 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'
            }`}
            title={settings.soundEnabled ? 'टाईपरायटर आवाज बंद करा' : 'टाईपरायटर आवाज सुरू करा'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* On-screen Keyboard Toggle */}
          <button
            onClick={() => onUpdateSettings({ showKeyboard: !settings.showKeyboard })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border ${
              settings.showKeyboard
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
            }`}
          >
            {settings.showKeyboard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>कीबोर्ड लेआउट</span>
          </button>
        </div>
      </div>

      {/* Main Target Passage Stage */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        {/* Active Passage Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-800 text-sm">{passage.title}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">{passage.category}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>शब्द क्रमांक: <strong className="font-mono text-slate-900">{currentWordIndex + 1}</strong> / {targetWords.length}</span>
            <button
              onClick={resetTest}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-900 cursor-pointer"
              title="चाचणी रीसेट करा"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>रीसेट</span>
            </button>
          </div>
        </div>

        {/* Passage Words Viewport with Auto-Scroll */}
        <div
          ref={passageContainerRef}
          className={`h-56 sm:h-64 overflow-y-auto pr-2 select-none font-serif tracking-normal text-slate-700 ${fontSizeClass}`}
        >
          {targetWords.map((word, idx) => {
            const isCurrent = idx === currentWordIndex;
            const pastResult = wordResults.find((r) => r.index === idx);

            let styleClass = 'text-slate-700';
            if (isCurrent) {
              styleClass = 'bg-amber-100 text-amber-950 font-bold px-1.5 py-0.5 rounded-md ring-2 ring-amber-400 shadow-xs inline-block';
            } else if (pastResult) {
              styleClass = pastResult.isCorrect
                ? 'text-emerald-700 font-medium'
                : 'text-rose-600 line-through opacity-80';
            }

            return (
              <React.Fragment key={idx}>
                <span
                  ref={isCurrent ? activeWordRef : undefined}
                  className={`transition-colors mr-2 inline-block ${styleClass}`}
                >
                  {word}
                </span>
                {' '}
              </React.Fragment>
            );
          })}
        </div>

        {/* SECTION 2: CANDIDATE'S TYPING AREA - ALL TYPED TEXT KEPT VISIBLE */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between pb-2 mb-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">टाईप केलेला मजकूर (Typing Area)</span>
              <span className="text-slate-300">·</span>
              <span className="text-amber-800 font-medium">येथे तुमचा सर्व टाईप केलेला मजकूर सतत दिसेल</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                टाईप केलेले शब्द: <strong className="text-slate-900">{wordResults.length + (currentInput ? 1 : 0)}</strong> / {targetWords.length}
              </span>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-amber-800 font-sans bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <span>{settings.inputMode === 'remington' ? 'Remington Gail' : 'Direct Unicode'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Document Typing Box where all typed text remains visible */}
          <div
            ref={typedBoxRef}
            onClick={() => inputRef.current?.focus()}
            className={`w-full min-h-[140px] max-h-[220px] overflow-y-auto p-4 bg-slate-50/70 border-2 border-amber-600/70 focus-within:border-amber-600 focus-within:bg-white rounded-xl shadow-inner font-serif cursor-text relative transition-all ${fontSizeClass}`}
          >
            {/* If test hasn't started and no text typed yet */}
            {wordResults.length === 0 && !currentInput && (
              <p className="text-slate-400 select-none font-sans text-sm italic">
                चाचणी सुरू करण्यासाठी येथे टाईप करा... तुम्ही टाईप केलेले सर्व शब्द येथे सतत दिसतील (All your typed text will remain visible here).
              </p>
            )}

            {/* All previously typed words remain completely visible */}
            {wordResults.map((res, i) => (
              <React.Fragment key={i}>
                <span
                  className={`inline-block mr-1.5 transition-colors ${
                    res.isCorrect
                      ? 'text-emerald-700 font-medium'
                      : 'text-rose-600 underline decoration-wavy font-medium'
                  }`}
                  title={res.isCorrect ? 'बरोबर' : `अपेक्षित: ${res.targetWord}`}
                >
                  {res.typedWord}
                </span>
                {' '}
              </React.Fragment>
            ))}

            {/* Currently typing word with blinking cursor */}
            {(currentInput || (wordResults.length > 0 && !isTestFinished)) && (
              <span className="inline-block bg-amber-100 text-amber-950 font-bold px-1 rounded ring-1 ring-amber-400/80">
                {currentInput}
                <span className="inline-block w-0.5 h-4 sm:h-5 bg-amber-700 animate-pulse align-middle ml-0.5" />
              </span>
            )}

            {/* Hidden real input capturing all Remington / IME keystrokes */}
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={currentInput}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onChange={(e) => {
                if (settings.inputMode === 'unicode') {
                  setCurrentInput(e.target.value);
                }
              }}
              className="opacity-0 absolute inset-0 w-full h-full cursor-text pointer-events-auto"
              aria-label="मराठी टायपिंग इनपुट"
            />
          </div>

          {/* Typing Controls & Helpers Strip */}
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                हिरवा = बरोबर
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                लाल = चूक
              </span>
              <span className="text-slate-300">·</span>
              <span>पुढील शब्दासाठी <strong>Space</strong> दाबा</span>
              <span className="text-slate-300">·</span>
              <span>बॅकस्पेस नियम: <strong>{settings.backspace}</strong></span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[11px] text-slate-400 hidden md:inline">
                चालू अपेक्षित शब्द: <strong className="text-slate-800 font-serif">{currentTargetWord}</strong>
              </span>
              <button
                onClick={finishTest}
                disabled={!isTestStarted && wordResults.length === 0}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                चाचणी पूर्ण करा (Submit)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onscreen Remington Keyboard Visualizer */}
      {settings.showKeyboard && (
        <div className="mt-4">
          <OnscreenKeyboard
            isShiftActive={isShiftActive}
            onToggleShift={() => setIsShiftActive((prev) => !prev)}
            activeKeyCode={activeKeyCode}
            nextTargetKey={nextKeyHint}
            showFingerGuide={settings.fingerGuide}
            onVirtualKeyPress={handleVirtualKeyPress}
          />
        </div>
      )}
    </div>
  );
};
