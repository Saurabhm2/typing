import { Passage } from '../types/typing';

interface BlogPassage {
  id: string;
  title: string;
  url: string;
  published: string;
  text: string;
  wordCount: number;
}

const DEVA = '\\u0900-\\u097F';
const LATIN = 'A-Za-z';

const countDevanagari = (text: string) =>
  (text.match(new RegExp(`[${DEVA}]`, 'g')) ?? []).length;
const countLatin = (text: string) =>
  (text.match(new RegExp(`[${LATIN}]`, 'g')) ?? []).length;

/**
 * Blog posts are mixed: Devanagari exam notices and English study-material
 * articles. A Marathi Remington keyboard cannot reproduce Latin text, so
 * English posts are dropped and only Devanagari posts become passages.
 */
function detectDifficulty(text: string): Passage['difficulty'] {
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words > 450) return 'exam40';
  if (words > 250) return 'exam30';
  return 'medium';
}

function toPassage(raw: BlogPassage): Passage | null {
  const text = raw.text.trim();
  if (!text) return null;

  const deva = countDevanagari(text);
  const latin = countLatin(text);

  // Require genuine Devanagari prose, not a stray digit or headline.
  if (deva < 400) return null;
  // Reject posts that are mostly English even if a Marathi line is present.
  if (latin / (deva + latin) > 0.2) return null;
  if (raw.wordCount < 60) return null;

  const words = text.split(/\s+/).filter(Boolean);

  return {
    id: raw.id,
    title: raw.title,
    category: 'सराव',
    difficulty: detectDifficulty(text),
    text,
    wordCount: words.length,
    charCount: text.length,
    description: 'तुमच्या ब्लॉगवरील ताज्या लेखावरून तयार केलेला सराव परिच्छेद.',
  };
}

export async function fetchBlogPassages(): Promise<Passage[]> {
  const response = await fetch('/api/passages');
  if (!response.ok) {
    throw new Error(`Passage request failed: ${response.status}`);
  }
  const data = await response.json();
  const raw: BlogPassage[] = data.passages ?? [];
  return raw.map(toPassage).filter((p): p is Passage => p !== null);
}
