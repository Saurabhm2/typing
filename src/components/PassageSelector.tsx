import React, { useState } from 'react';
import { Search, Plus, BookOpen, Clock, FileText, CheckCircle2, Star } from 'lucide-react';
import { Passage } from '../types/typing';

interface PassageSelectorProps {
  passages: Passage[];
  selectedPassage: Passage;
  onSelectPassage: (p: Passage) => void;
  onOpenCustomModal: () => void;
}

export const PassageSelector: React.FC<PassageSelectorProps> = ({
  passages,
  selectedPassage,
  onSelectPassage,
  onOpenCustomModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'सर्व परिच्छेद (All)' },
    { id: 'GCC-TBC 30', label: 'GCC-TBC ३० WPM' },
    { id: 'GCC-TBC 40', label: 'GCC-TBC ४० WPM' },
    { id: 'MPSC', label: 'MPSC / कोर्ट लिपिक' },
    { id: 'इतिहास', label: 'इतिहास (History)' },
    { id: 'साहित्य', label: 'साहित्य (Literature)' },
    { id: 'सराव', label: 'सोपा सराव (Warmup)' },
    { id: 'कस्टम (Custom)', label: 'माझे कस्टम पॅसेज' },
  ];

  const filteredPassages = passages.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Custom Passage CTA */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-amber-200 text-xs font-semibold tracking-wider uppercase block mb-1">
            महाराष्ट्र शासन परीक्षा पॅटर्न
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">
            मराठी Remington टायपिंग टेस्ट व परिच्छेद संग्रह
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
            GCC-TBC ३० व ४० WPM, MPSC क्लर्क टायपिस्ट, आणि जिल्हा न्यायालय भरतीसाठी आदर्श परिच्छेद. तुम्ही स्वतःचा कस्टम परिच्छेद जोडूनही सराव करू शकता.
          </p>
        </div>
        <button
          onClick={onOpenCustomModal}
          className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-amber-950 bg-white hover:bg-amber-50 active:scale-95 rounded-xl shadow transition-all whitespace-nowrap cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 text-amber-800" />
          <span>कस्टम पॅसेज जोडा (Custom Passage)</span>
        </button>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Categories segmented controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="पॅसेज शोधा (Search)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          />
        </div>
      </div>

      {/* Passages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPassages.map((p) => {
          const isSelected = selectedPassage.id === p.id;
          return (
            <div
              key={p.id}
              className={`bg-white rounded-xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-amber-800">{p.category}</span>
                  <div className="flex items-center gap-2">
                    <span>{p.wordCount} शब्द</span>
                    <span aria-hidden="true">·</span>
                    <span>~{Math.ceil(p.wordCount / 30)} मिनिटे</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                  {p.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-serif mb-4">
                  {p.text}
                </p>
              </div>

              {/* Card Footer Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {p.isCustom ? 'कस्टम परिच्छेद' : 'अधिकृत परीक्षा नमुना'}
                </span>
                <button
                  onClick={() => onSelectPassage(p)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>सध्या निवडलेला</span>
                    </>
                  ) : (
                    <span>हा पॅसेज निवडा</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPassages.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">कोणताही पॅसेज सापडला नाही.</p>
          <p className="text-xs text-slate-500 mt-1">वेगळा शोध शब्द वापरा किंवा नवीन कस्टम पॅसेज तयार करा.</p>
          <button
            onClick={onOpenCustomModal}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg cursor-pointer"
          >
            नवीन कस्टम पॅसेज जोडा
          </button>
        </div>
      )}
    </div>
  );
};
