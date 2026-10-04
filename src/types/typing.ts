export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'exam30' | 'exam40';

export interface Passage {
  id: string;
  title: string;
  category: 'GCC-TBC 30' | 'GCC-TBC 40' | 'MPSC' | 'इतिहास' | 'साहित्य' | 'तंत्रज्ञान' | 'सराव' | 'कस्टम (Custom)';
  difficulty: DifficultyLevel;
  text: string;
  wordCount: number;
  charCount: number;
  description?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export type BackspaceSetting = 'full' | 'restricted' | 'disabled';
export type InputMode = 'remington' | 'unicode';

export interface TestSettings {
  durationSeconds: number; // 60, 120, 300, 600, 900, 0 (unlimited)
  backspace: BackspaceSetting;
  inputMode: InputMode;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  soundEnabled: boolean;
  showKeyboard: boolean;
  highlightNextKey: boolean;
  fingerGuide: boolean;
  theme: 'paper' | 'modern' | 'dark' | 'contrast';
}

export interface TypingStats {
  elapsedSeconds: number;
  remainingSeconds: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  wrongKeystrokes: number;
  backspaceCount: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  wordsTyped: number;
  correctWordsCount: number;
  wrongWordsCount: number;
}

export interface WordComparison {
  targetWord: string;
  typedWord: string;
  isCorrect: boolean;
  index: number;
}

export interface TestResult {
  id: string;
  date: string;
  passageTitle: string;
  passageCategory: string;
  durationSeconds: number;
  timeSpentSeconds: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  wrongKeystrokes: number;
  backspaceCount: number;
  totalWords: number;
  correctWordsCount: number;
  wrongWordsCount: number;
  grade: 'A' | 'B' | 'C' | 'Fail';
  gradeTitle: string;
  wordsReview: WordComparison[];
  candidateName?: string;
}
