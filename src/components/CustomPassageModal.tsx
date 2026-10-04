import React, { useState } from 'react';
import { X, Upload, Save, Play, Trash2, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Passage } from '../types/typing';
import { analyzeMarathiText, saveCustomPassage, getStoredCustomPassages, deleteCustomPassage } from '../data/passages';

interface CustomPassageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage: (passage: Passage) => void;
}

export const CustomPassageModal: React.FC<CustomPassageModalProps> = ({
  isOpen,
  onClose,
  onSelectPassage,
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [savedPassages, setSavedPassages] = useState<Passage[]>(getStoredCustomPassages());
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const analysis = analyzeMarathiText(text);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setText(content.trim());
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSaveOnly = () => {
    if (!text.trim()) return;
    const newPassage = saveCustomPassage({
      title: title.trim() || 'कस्टम परिच्छेद ' + (savedPassages.length + 1),
      category: 'कस्टम (Custom)',
      difficulty: analysis.wordCount > 350 ? 'exam40' : 'exam30',
      wordCount: analysis.wordCount,
      charCount: analysis.charCount,
      description: description.trim() || 'वापरकर्त्याने जोडलेला कस्टम परिच्छेद',
      text: text.trim(),
    });
    setSavedPassages(getStoredCustomPassages());
    setSuccessMessage('परिच्छेद सुरक्षितपणे सेव्ह झाला!');
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  const handleStartTest = () => {
    if (!text.trim()) return;
    const newPassage = saveCustomPassage({
      title: title.trim() || 'कस्टम परिच्छेद ' + (savedPassages.length + 1),
      category: 'कस्टम (Custom)',
      difficulty: analysis.wordCount > 350 ? 'exam40' : 'exam30',
      wordCount: analysis.wordCount,
      charCount: analysis.charCount,
      description: description.trim() || 'वापरकर्त्याने जोडलेला सराव परिच्छेद',
      text: text.trim(),
    });
    onSelectPassage(newPassage);
    onClose();
  };

  const handleDelete = (id: string) => {
    deleteCustomPassage(id);
    setSavedPassages(getStoredCustomPassages());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              कस्टम पॅसेज पर्याय (Custom Passage Option)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              तुमचा स्वतःचा मराठी मजकूर पेस्ट करा किंवा फाइल्स अपलोड करून लगेच सराव सुरू करा.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors mr-6 ${
              activeTab === 'create'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            नवीन पॅसेज जोडा (Create New)
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>माझे सेव्ह केलेले पॅसेज (Saved)</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
              {savedPassages.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'create' ? (
            <>
              {/* Title input & file upload */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    पॅसेजचे नाव / शीर्षक (Title)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="उदा. GCC-TBC सराव परिच्छेद ३ किंवा कार्यालयीन मसुदा"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    टेक्स्ट फाइल अपलोड (.txt)
                  </label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 border-dashed rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Upload .txt</span>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    मराठी मजकूर येथे पेस्ट करा (Paste Marathi Passage)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    देवनागरी युनिकोड मराठी मजकूर
                  </span>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="येथे तुमचा मराठी परिच्छेद पेस्ट करा... (उदा. वृत्तपत्रातील बातमी, पुस्तकातील पान, किंवा शासकीय परिपत्रक)"
                  rows={8}
                  className="w-full p-3 text-sm font-serif bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 resize-none leading-relaxed"
                />
              </div>

              {/* Live Passage Analytics */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-amber-800">एकूण शब्द: </span>
                    <span className="font-bold font-mono text-sm">{analysis.wordCount}</span>
                  </div>
                  <div>
                    <span className="text-amber-800">एकूण अक्षरे: </span>
                    <span className="font-bold font-mono text-sm">{analysis.charCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>३० WPM साठी वेळ: ~{analysis.est30WpmMin} मिनिटे</span>
                  <span>·</span>
                  <span>४० WPM साठी वेळ: ~{analysis.est40WpmMin} मिनिटे</span>
                </div>
              </div>

              {successMessage && (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}
            </>
          ) : (
            /* Saved Passages List */
            <div className="space-y-3">
              {savedPassages.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">अद्याप कोणताही कस्टम पॅसेज सेव्ह केलेला नाही.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    &apos;नवीन पॅसेज जोडा&apos; टॅबमधून स्वतःचा मजकूर जोडून सेव्ह करा.
                  </p>
                </div>
              ) : (
                savedPassages.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-amber-400 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {p.title}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {p.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-0.5 font-serif">
                        {p.text}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                        <span>{p.wordCount} शब्द</span>
                        <span>·</span>
                        <span>{p.charCount} अक्षरे</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectPassage(p);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg cursor-pointer transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>सराव करा</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="काढून टाका"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {activeTab === 'create' && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleSaveOnly}
              disabled={!text.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg disabled:opacity-50 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>फक्त सेव्ह करा (Save)</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                रद्द करा
              </button>
              <button
                onClick={handleStartTest}
                disabled={!text.trim()}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-50 rounded-lg shadow-sm cursor-pointer transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>हा पॅसेज निवडून टेस्ट सुरू करा</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
