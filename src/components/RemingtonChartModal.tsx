import React, { useState } from 'react';
import { X, Search, Copy, Check, BookOpen, AlertCircle } from 'lucide-react';
import { REMINGTON_ALT_CODES, HALF_TO_FULL_MAP } from '../utils/remingtonEngine';

interface RemingtonChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RemingtonChartModal: React.FC<RemingtonChartModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const handleCopy = (char: string, code: string) => {
    navigator.clipboard.writeText(char);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCodes = REMINGTON_ALT_CODES.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.char.includes(search) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              मराठी Remington कीबोर्ड लेआउट आणि Alt कोड्स
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              महाराष्ट्र टंकलेखन परीक्षा (GCC-TBC व MPSC) अधिकृत ISM Remington Gail संदर्भ.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Guidance */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Essential Remington Typewriter Rules */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs space-y-2 text-slate-700">
            <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Remington टायपिंगचे महत्त्वाचे नियम (Key Rules):</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>
                <strong>काना नसलेली अक्षरे (अर्धे अक्षर + काना):</strong> टाईपरायटर लेआउटनुसार अर्धे अक्षर टाईप केल्यावर <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono text-amber-900 font-bold">k</code> (काना) दाबल्यास ते पूर्ण अक्षर बनते. (उदा. <code className="bg-white px-1 py-0.5 rounded border">[</code> + <code className="bg-white px-1 py-0.5 rounded border">k</code> = <span className="font-bold">ख</span>, <code className="bg-white px-1 py-0.5 rounded border">Shift+H</code> + <code className="bg-white px-1 py-0.5 rounded border">k</code> = <span className="font-bold">भ</span>, <code className="bg-white px-1 py-0.5 rounded border">/</code> + <code className="bg-white px-1 py-0.5 rounded border">k</code> = <span className="font-bold">ध</span>).
              </li>
              <li>
                <strong>ह्रस्व वेलांटी (ि):</strong> पारंपारिक Remington मध्ये अक्षराच्या अगोदर <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono text-amber-900 font-bold">f</code> की दाबली जाते, नंतर व्यंजन टाईप केले जाते (उदा. <code className="bg-white px-1 py-0.5 rounded border">f</code> + <code className="bg-white px-1 py-0.5 rounded border">d</code> = <span className="font-bold">कि</span>). आमच्या प्रणालीमध्ये दोन्ही (व्यंजनानंतर किंवा अगोदर) पद्धती चालतात!
              </li>
              <li>
                <strong>र-फार व र चे प्रकार:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono text-amber-900 font-bold">z</code> ने क्रफ लागते (उदा. <code className="bg-white px-1 py-0.5 rounded border">d</code> + <code className="bg-white px-1 py-0.5 rounded border">z</code> = <span className="font-bold">क्र</span>). आणि <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-mono text-amber-900 font-bold">Shift+Z</code> ने रफार (<span className="font-bold">र्</span>) लागतो (उदा. <span className="font-bold">सर्व, धर्म</span>).
              </li>
              <li>
                <strong>स्वर (Vowels):</strong> <code className="bg-white px-1 py-0.5 rounded border">v</code> = अ, <code className="bg-white px-1 py-0.5 rounded border">vk</code> = आ, <code className="bg-white px-1 py-0.5 rounded border">vks</code> = ओ, <code className="bg-white px-1 py-0.5 rounded border">vkS</code> = औ, <code className="bg-white px-1 py-0.5 rounded border">,</code> = ए, <code className="bg-white px-1 py-0.5 rounded border">,s</code> = ऐ, <code className="bg-white px-1 py-0.5 rounded border">b</code> = इ, <code className="bg-white px-1 py-0.5 rounded border">bZ</code> = ई, <code className="bg-white px-1 py-0.5 rounded border">m</code> = उ, <code className="bg-white px-1 py-0.5 rounded border">mw</code> = ऊ.
              </li>
            </ul>
          </div>

          {/* Alt Codes Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                नेहमी विचारले जाणारे Alt कोड्स (Alt Code Shortcuts)
              </h3>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="कोड किंवा अक्षर शोधा..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">अक्षर / चिन्ह</th>
                    <th className="py-2.5 px-4">Alt कोड</th>
                    <th className="py-2.5 px-4">वर्णन / उदाहरणे</th>
                    <th className="py-2.5 px-4 text-right">कृती</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCodes.map((item) => (
                    <tr key={item.code} className="hover:bg-amber-50/40">
                      <td className="py-2.5 px-4 font-bold text-base font-serif text-amber-900">
                        {item.char}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-800">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.code}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">
                        <div className="font-medium text-slate-800">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.description}</div>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => handleCopy(item.char, item.code)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors cursor-pointer"
                        >
                          {copiedCode === item.code ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">कॉपी झाले!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>कॉपी</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer transition-colors"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
