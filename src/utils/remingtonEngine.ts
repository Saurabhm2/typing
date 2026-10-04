/**
 * Remington Marathi (Gail / ISM Typewriter) Mapping & Transliteration Engine
 * Conforms to standard Maharashtra GCC-TBC and MPSC Remington layout specs.
 */

export interface KeyDefinition {
  code: string;
  keyNormal: string;
  keyShift: string;
  charNormal: string;
  charShift: string;
  finger: 'l-pinky' | 'l-ring' | 'l-middle' | 'l-index' | 'thumb' | 'r-index' | 'r-middle' | 'r-ring' | 'r-pinky';
  row: number; // 1 to 5
}

// Remington character map for unshifted physical keys
export const REMINGTON_NORMAL_MAP: Record<string, string> = {
  '`': '़',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
  '0': '०',
  '-': 'ञ',
  '=': 'ृ',
  'q': 'ु',
  'w': 'ू',
  'e': 'म',
  'r': 'त',
  't': 'ज',
  'y': 'ल',
  'u': 'न',
  'i': 'प',
  'o': 'व',
  'p': 'च',
  '[': 'ख्',
  ']': ',',
  '\\': '.',
  'a': 'ं',
  's': 'े',
  'd': 'क',
  'f': 'ि',
  'g': 'ह',
  'h': 'ी',
  'j': 'र',
  'k': 'ा',
  'l': 'स',
  ';': 'य',
  "'": 'श्',
  'z': '्र',
  'x': 'ग',
  'c': 'ब',
  'v': 'अ',
  'b': 'इ',
  'n': 'द',
  'm': 'उ',
  ',': 'ए',
  '.': 'ण्',
  '/': 'ध्',
  ' ': ' ',
};

// Remington character map for Shift + physical keys
export const REMINGTON_SHIFT_MAP: Record<string, string> = {
  '~': 'द्य',
  '!': '।',
  '@': '/',
  '#': ':',
  '$': '₹',
  '%': '-',
  '^': '"',
  '&': "'",
  '*': 'द्ध',
  '(': 'त्र',
  ')': 'ऋ',
  '_': '.',
  '+': '्',
  'Q': 'फ',
  'W': 'ॅ',
  'E': 'म्',
  'R': 'त्',
  'T': 'ज्',
  'Y': 'ल्',
  'U': 'न्',
  'I': 'प्',
  'O': 'व्',
  'P': 'च्',
  '{': 'क्ष्',
  '}': 'द्व',
  '|': ':',
  'A': 'ा',
  'S': 'ै',
  'D': 'क्',
  'F': 'थ्',
  'G': 'ळ',
  'H': 'भ्',
  'J': 'श्र',
  'K': 'ज्ञ',
  'L': 'स्',
  ':': 'रू',
  '"': 'ष्',
  'Z': 'र्',
  'X': 'ग्',
  'C': 'ब्',
  'V': 'ट',
  'B': 'ठ',
  'N': 'छ',
  'M': 'ड',
  '<': 'ढ',
  '>': 'झ',
  '?': 'घ्',
};

// Complete keyboard layout description for the on-screen visualizer
export const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 1: Number row
  [
    { code: 'Backquote', keyNormal: '`', keyShift: '~', charNormal: '़', charShift: 'द्य', finger: 'l-pinky', row: 1 },
    { code: 'Digit1', keyNormal: '1', keyShift: '!', charNormal: '१', charShift: '।', finger: 'l-pinky', row: 1 },
    { code: 'Digit2', keyNormal: '2', keyShift: '@', charNormal: '२', charShift: '/', finger: 'l-ring', row: 1 },
    { code: 'Digit3', keyNormal: '3', keyShift: '#', charNormal: '३', charShift: ':', finger: 'l-middle', row: 1 },
    { code: 'Digit4', keyNormal: '4', keyShift: '$', charNormal: '४', charShift: '₹', finger: 'l-index', row: 1 },
    { code: 'Digit5', keyNormal: '5', keyShift: '%', charNormal: '५', charShift: '-', finger: 'l-index', row: 1 },
    { code: 'Digit6', keyNormal: '6', keyShift: '^', charNormal: '६', charShift: '"', finger: 'r-index', row: 1 },
    { code: 'Digit7', keyNormal: '7', keyShift: '&', charNormal: '७', charShift: "'", finger: 'r-index', row: 1 },
    { code: 'Digit8', keyNormal: '8', keyShift: '*', charNormal: '८', charShift: 'द्ध', finger: 'r-middle', row: 1 },
    { code: 'Digit9', keyNormal: '9', keyShift: '(', charNormal: '९', charShift: 'त्र', finger: 'r-ring', row: 1 },
    { code: 'Digit0', keyNormal: '0', keyShift: ')', charNormal: '०', charShift: 'ऋ', finger: 'r-pinky', row: 1 },
    { code: 'Minus', keyNormal: '-', keyShift: '_', charNormal: 'ञ', charShift: '.', finger: 'r-pinky', row: 1 },
    { code: 'Equal', keyNormal: '=', keyShift: '+', charNormal: 'ृ', charShift: '्', finger: 'r-pinky', row: 1 },
  ],
  // Row 2: QWERTY row
  [
    { code: 'KeyQ', keyNormal: 'q', keyShift: 'Q', charNormal: 'ु', charShift: 'फ', finger: 'l-pinky', row: 2 },
    { code: 'KeyW', keyNormal: 'w', keyShift: 'W', charNormal: 'ू', charShift: 'ॅ', finger: 'l-ring', row: 2 },
    { code: 'KeyE', keyNormal: 'e', keyShift: 'E', charNormal: 'म', charShift: 'म्', finger: 'l-middle', row: 2 },
    { code: 'KeyR', keyNormal: 'r', keyShift: 'R', charNormal: 'त', charShift: 'त्', finger: 'l-index', row: 2 },
    { code: 'KeyT', keyNormal: 't', keyShift: 'T', charNormal: 'ज', charShift: 'ज्', finger: 'l-index', row: 2 },
    { code: 'KeyY', keyNormal: 'y', keyShift: 'Y', charNormal: 'ल', charShift: 'ल्', finger: 'r-index', row: 2 },
    { code: 'KeyU', keyNormal: 'u', keyShift: 'U', charNormal: 'न', charShift: 'न्', finger: 'r-index', row: 2 },
    { code: 'KeyI', keyNormal: 'i', keyShift: 'I', charNormal: 'प', charShift: 'प्', finger: 'r-middle', row: 2 },
    { code: 'KeyO', keyNormal: 'o', keyShift: 'O', charNormal: 'व', charShift: 'व्', finger: 'r-ring', row: 2 },
    { code: 'KeyP', keyNormal: 'p', keyShift: 'P', charNormal: 'च', charShift: 'च्', finger: 'r-pinky', row: 2 },
    { code: 'BracketLeft', keyNormal: '[', keyShift: '{', charNormal: 'ख्', charShift: 'क्ष्', finger: 'r-pinky', row: 2 },
    { code: 'BracketRight', keyNormal: ']', keyShift: '}', charNormal: ',', charShift: 'द्व', finger: 'r-pinky', row: 2 },
    { code: 'Backslash', keyNormal: '\\', keyShift: '|', charNormal: '.', charShift: ':', finger: 'r-pinky', row: 2 },
  ],
  // Row 3: ASDF row
  [
    { code: 'KeyA', keyNormal: 'a', keyShift: 'A', charNormal: 'ं', charShift: 'ा', finger: 'l-pinky', row: 3 },
    { code: 'KeyS', keyNormal: 's', keyShift: 'S', charNormal: 'े', charShift: 'ै', finger: 'l-ring', row: 3 },
    { code: 'KeyD', keyNormal: 'd', keyShift: 'D', charNormal: 'क', charShift: 'क्', finger: 'l-middle', row: 3 },
    { code: 'KeyF', keyNormal: 'f', keyShift: 'F', charNormal: 'ि', charShift: 'थ्', finger: 'l-index', row: 3 },
    { code: 'KeyG', keyNormal: 'g', keyShift: 'G', charNormal: 'ह', charShift: 'ळ', finger: 'l-index', row: 3 },
    { code: 'KeyH', keyNormal: 'h', keyShift: 'H', charNormal: 'ी', charShift: 'भ्', finger: 'r-index', row: 3 },
    { code: 'KeyJ', keyNormal: 'j', keyShift: 'J', charNormal: 'र', charShift: 'श्र', finger: 'r-index', row: 3 },
    { code: 'KeyK', keyNormal: 'k', keyShift: 'K', charNormal: 'ा', charShift: 'ज्ञ', finger: 'r-middle', row: 3 },
    { code: 'KeyL', keyNormal: 'l', keyShift: 'L', charNormal: 'स', charShift: 'स्', finger: 'r-ring', row: 3 },
    { code: 'Semicolon', keyNormal: ';', keyShift: ':', charNormal: 'य', charShift: 'रू', finger: 'r-pinky', row: 3 },
    { code: 'Quote', keyNormal: "'", keyShift: '"', charNormal: 'श्', charShift: 'ष्', finger: 'r-pinky', row: 3 },
  ],
  // Row 4: ZXCV row
  [
    { code: 'KeyZ', keyNormal: 'z', keyShift: 'Z', charNormal: '्र', charShift: 'र्', finger: 'l-pinky', row: 4 },
    { code: 'KeyX', keyNormal: 'x', keyShift: 'X', charNormal: 'ग', charShift: 'ग्', finger: 'l-ring', row: 4 },
    { code: 'KeyC', keyNormal: 'c', keyShift: 'C', charNormal: 'ब', charShift: 'ब्', finger: 'l-middle', row: 4 },
    { code: 'KeyV', keyNormal: 'v', keyShift: 'V', charNormal: 'अ', charShift: 'ट', finger: 'l-index', row: 4 },
    { code: 'KeyB', keyNormal: 'b', keyShift: 'B', charNormal: 'इ', charShift: 'ठ', finger: 'l-index', row: 4 },
    { code: 'KeyN', keyNormal: 'n', keyShift: 'N', charNormal: 'द', charShift: 'छ', finger: 'r-index', row: 4 },
    { code: 'KeyM', keyNormal: 'm', keyShift: 'M', charNormal: 'उ', charShift: 'ड', finger: 'r-index', row: 4 },
    { code: 'Comma', keyNormal: ',', keyShift: '<', charNormal: 'ए', charShift: 'ढ', finger: 'r-middle', row: 4 },
    { code: 'Period', keyNormal: '.', keyShift: '>', charNormal: 'ण्', charShift: 'झ', finger: 'r-ring', row: 4 },
    { code: 'Slash', keyNormal: '/', keyShift: '?', charNormal: 'ध्', charShift: 'घ्', finger: 'r-pinky', row: 4 },
  ],
];

// Special typewriter combination replacements when user types kana 'k' (ा)
// In typewriter, half consonants without stem (danda) become full consonants when 'k' is typed:
export const HALF_TO_FULL_MAP: Record<string, string> = {
  'ख्': 'ख',
  'क्': 'क',
  'ग्': 'ग',
  'घ्': 'घ',
  'च्': 'च',
  'ज्': 'ज',
  'झ्': 'झ',
  'ण्': 'ण',
  'त्': 'त',
  'थ्': 'थ',
  'ध्': 'ध',
  'न्': 'न',
  'प्': 'प',
  'फ्': 'फ',
  'ब्': 'ब',
  'भ्': 'भ',
  'म्': 'म',
  'ल्': 'ल',
  'व्': 'व',
  'श्': 'श',
  'ष्': 'ष',
  'स्': 'स',
  'क्ष्': 'क्ष',
};

// Alt codes commonly used in Marathi typing exams
export interface AltCodeItem {
  code: string;
  char: string;
  name: string;
  description: string;
}

export const REMINGTON_ALT_CODES: AltCodeItem[] = [
  { code: 'Alt + 0161', char: 'ॉ', name: 'ऑ ची मात्रा (कॅन)', description: 'कॅन, बॉल, डॉक्टर यासाठी' },
  { code: 'Alt + 0170', char: 'ऋ', name: 'ऋषी चा ऋ', description: 'ऋषी, ऋतू यासाठी' },
  { code: 'Alt + 0179', char: 'द्ध', name: 'द + ध जोडाक्षर', description: 'बुद्ध, युद्ध यासाठी' },
  { code: 'Alt + 0180', char: 'त्र', name: 'त + र जोडाक्षर', description: 'रात्र, पत्र यासाठी' },
  { code: 'Alt + 0181', char: 'द्व', name: 'द + व जोडाक्षर', description: 'द्वार, विद्वान यासाठी' },
  { code: 'Alt + 0182', char: 'क्त', name: 'क + त जोडाक्षर', description: 'भक्त, रक्त यासाठी' },
  { code: 'Alt + 0188', char: 'श्र', name: 'श + र जोडाक्षर', description: 'श्रीमंत, आश्रम यासाठी' },
  { code: 'Alt + 0216', char: 'क्र', name: 'क + र (क्रफ)', description: 'क्रम, क्रिया यासाठी' },
  { code: 'Alt + 0228', char: 'फ्', name: 'अर्धा फ', description: 'दफ्तर, हफ्ता यासाठी' },
  { code: 'Alt + 0233', char: 'ष्ट', name: 'ष + ट जोडाक्षर', description: 'कष्ट, शिष्ट यासाठी' },
  { code: 'Alt + 0236', char: 'ह्य', name: 'ह + य जोडाक्षर', description: 'सह्य, बाह्य यासाठी' },
  { code: 'Alt + 0244', char: 'ह्म', name: 'ह + म जोडाक्षर', description: 'ब्रह्म, ब्राह्मण यासाठी' },
  { code: 'Alt + 0248', char: 'ड्र', name: 'ड + र जोडाक्षर', description: 'ड्रायव्हर, ड्रम यासाठी' },
];

/**
 * Transliteration engine state
 */
export class RemingtonTransliterationEngine {
  private pendingVelanti = false; // When 'f' is typed in traditional Remington (ि before consonant)

  public reset() {
    this.pendingVelanti = false;
  }

  /**
   * Process a single key event and update current string
   * @param currentText Current typed text in the active input
   * @param rawKey The event.key value from KeyboardEvent (e.g. 'd', 'k', 'F', 'Backspace', ' ')
   * @returns The updated string after applying Remington rules
   */
  public handleKey(currentText: string, rawKey: string): string {
    // If it's already a full Marathi Unicode string pasted or passed directly
    if (rawKey.length > 1) {
      if (rawKey === 'Backspace') {
        if (this.pendingVelanti) {
          this.pendingVelanti = false;
          return currentText;
        }
        return currentText.slice(0, -1);
      }
      return currentText;
    }

    // Space key
    if (rawKey === ' ') {
      this.pendingVelanti = false;
      return currentText + ' ';
    }

    // Traditional Remington 'f' = hrasva velanti (ि)
    if (rawKey === 'f') {
      // Check if user is typing consonant + 'f' (modern) OR 'f' before consonant (traditional)
      if (currentText.length > 0) {
        const lastChar = currentText[currentText.length - 1];
        // If last char is a consonant, attach matra i directly
        if (/[\u0915-\u0939\u0958-\u095F]/.test(lastChar)) {
          return currentText + 'ि';
        }
      }
      // Otherwise, set pending velanti for next typed consonant
      this.pendingVelanti = true;
      return currentText;
    }

    // Lookup raw character in mapping
    let mapped = REMINGTON_SHIFT_MAP[rawKey] || REMINGTON_NORMAL_MAP[rawKey];

    // If key has no remington mapping, pass through raw (e.g. English punctuation or native Marathi already)
    if (!mapped) {
      mapped = rawKey;
    }

    // Check if we had a pending velanti ('f') typed before this consonant
    if (this.pendingVelanti) {
      this.pendingVelanti = false;
      // If the mapped character is a consonant or half consonant
      if (mapped.endsWith('्')) {
        // e.g. 'ख्' -> 'खि'
        const base = mapped.slice(0, -1);
        return currentText + base + 'ि';
      } else {
        return currentText + mapped + 'ि';
      }
    }

    // Rule 1: Typewriter Half-character + 'k' (ा stem) -> Full character
    // E.g. '[' gives 'ख्', followed by 'k' -> becomes 'ख'
    if (rawKey === 'k' || rawKey === 'A') {
      if (currentText.length > 0) {
        // Check for 2-char endings with halant like 'ख्'
        if (currentText.endsWith('्')) {
          const slice2 = currentText.slice(-2);
          if (HALF_TO_FULL_MAP[slice2]) {
            return currentText.slice(0, -2) + HALF_TO_FULL_MAP[slice2];
          }
          // Special for 'क्ष्' (3 chars \u0915\u094D\u0937\u094D)
          if (currentText.endsWith('क्ष्')) {
            return currentText.slice(0, -3) + 'क्ष';
          }
        }

        // Rule for 'अ' + 'k' -> 'आ'
        if (currentText.endsWith('अ')) {
          return currentText.slice(0, -1) + 'आ';
        }

        // Rule for 'आ' + 's' -> 'ओ' or 'अ' + 'k' + 's' -> 'ओ'
        // If current ends with 'ा' and user types 'k', it keeps 'ा'
      }
    }

    // Rule 2: Vowel combinations
    if (rawKey === 's' && currentText.endsWith('आ')) {
      // 'आ' + 's' -> 'ओ'
      return currentText.slice(0, -1) + 'ओ';
    }
    if (rawKey === 'S' && currentText.endsWith('आ')) {
      // 'आ' + 'S' -> 'औ'
      return currentText.slice(0, -1) + 'औ';
    }
    if ((rawKey === 'W' || rawKey === 'A') && currentText.endsWith('आ')) {
      // 'आ' + 'ॅ' -> 'ऑ'
      return currentText.slice(0, -1) + 'ऑ';
    }
    if (rawKey === 's' && currentText.endsWith('ए')) {
      // 'ए' + 's' -> 'ऐ'
      return currentText.slice(0, -1) + 'ऐ';
    }
    if (rawKey === 'w' && currentText.endsWith('उ')) {
      // 'उ' + 'w' -> 'ऊ'
      return currentText.slice(0, -1) + 'ऊ';
    }
    if (rawKey === 'Z' && currentText.endsWith('इ')) {
      // 'इ' + 'Z' -> 'ई'
      return currentText.slice(0, -1) + 'ई';
    }

    // Rule 3: Reph ('र्') and Kraphar ('्र')
    // If 'z' (्र) is typed after a consonant, e.g. 'क' + '्र' = 'क्र'
    if (rawKey === 'z') {
      return currentText + '्र';
    }
    // If 'Z' (र्) is typed, e.g. 'प' + 'Z' -> 'र्प'
    if (rawKey === 'Z') {
      return currentText + 'र्';
    }

    return currentText + mapped;
  }
}

/**
 * Reverse mapping helper: given a target character or ligature, find corresponding Remington physical key
 */
export function findRemingtonKeyForChar(targetChar: string): { key: string; shift: boolean; label: string } | null {
  if (!targetChar) return null;

  // Exact match in normal map
  for (const [key, val] of Object.entries(REMINGTON_NORMAL_MAP)) {
    if (val === targetChar) {
      return { key, shift: false, label: val };
    }
  }

  // Exact match in shift map
  for (const [key, val] of Object.entries(REMINGTON_SHIFT_MAP)) {
    if (val === targetChar) {
      return { key, shift: true, label: val };
    }
  }

  // Decompose full consonants that require 'k' stem in typewriter:
  // e.g. 'ख' is typed as '[' + 'k'
  for (const [half, full] of Object.entries(HALF_TO_FULL_MAP)) {
    if (full === targetChar) {
      // Return the base key for the half character
      const base = findRemingtonKeyForChar(half);
      if (base) return base;
    }
  }

  // Vowels
  if (targetChar === 'आ') return { key: 'v', shift: false, label: 'अ + k (ा)' };
  if (targetChar === 'ओ') return { key: 'v', shift: false, label: 'अ + k + s (े)' };
  if (targetChar === 'औ') return { key: 'v', shift: false, label: 'अ + k + S (ै)' };
  if (targetChar === 'ऐ') return { key: ',', shift: false, label: 'ए + s (े)' };
  if (targetChar === 'ई') return { key: 'b', shift: false, label: 'इ + Z (र्)' };
  if (targetChar === 'ऊ') return { key: 'm', shift: false, label: 'उ + w (ू)' };

  return null;
}
