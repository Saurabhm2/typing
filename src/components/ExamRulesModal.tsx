import React from 'react';
import { X, Award, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExamRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamRulesModal: React.FC<ExamRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                महाराष्ट्र GCC-TBC व MPSC टायपिंग परीक्षा नियम
              </h2>
              <p className="text-xs text-slate-500">
                महाराष्ट्र राज्य परीक्षा परिषद (MSCE Pune) मार्गदर्शक तत्त्वे
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Standard Speeds */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>१. परीक्षा स्वरूप व वेळ मर्यादा (Time & Speed)</span>
            </h3>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>
                <strong>GCC-TBC ३० WPM:</strong> ३०० शब्दांचा परिच्छेद १० मिनिटांत टाईप करणे आवश्यक (किमान गती ३० शब्द प्रति मिनिट).
              </li>
              <li>
                <strong>GCC-TBC ४० WPM:</strong> ४०० शब्दांचा परिच्छेद १० मिनिटांत पूर्ण करणे अनिवार्य (किमान गती ४० शब्द प्रति मिनिट).
              </li>
              <li>
                <strong>MPSC व कोर्ट लिपिक:</strong> १० मिनिटे किंवा ५ मिनिटांची कौशल्य चाचणी (Skill Test) घेतली जाते.
              </li>
            </ul>
          </div>

          {/* Section 2: Grading Structure */}
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-slate-900 text-sm mb-2">
              २. श्रेणी व गुणदान पद्धती (GCC-TBC Grading Scheme)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-medium">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-900">
                <div className="font-bold text-sm">श्रेणी &apos;A&apos; (Grade A)</div>
                <div className="text-[11px] text-emerald-700 mt-1">७५% पेक्षा जास्त गुण / ९५%+ अचूकता. विशेष प्रावीण्य.</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-900">
                <div className="font-bold text-sm">श्रेणी &apos;B&apos; (Grade B)</div>
                <div className="text-[11px] text-blue-700 mt-1">६०% ते ७४% गुण / ९०%+ अचूकता. प्रथम श्रेणी.</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900">
                <div className="font-bold text-sm">श्रेणी &apos;C&apos; (Grade C)</div>
                <div className="text-[11px] text-amber-700 mt-1">५०% ते ५९% गुण. उत्तीर्ण श्रेणी.</div>
              </div>
            </div>
          </div>

          {/* Section 3: Evaluation Formula */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm mb-2">
              ३. गती व अचूकता मोजण्याचे सूत्र (Speed Formula)
            </h3>
            <div className="space-y-2 font-mono bg-white p-3 rounded-lg border border-slate-200 text-[11px]">
              <div>• कच्ची गती (Gross WPM) = एकूण टाईप केलेले शब्द / लागलेली वेळ (मिनिटे)</div>
              <div>• निव्वळ गती (Net WPM) = कच्ची गती - (चुका × १.०)</div>
              <div>• अचूकता टक्केवारी (Accuracy %) = (अचूक शब्द / एकूण शब्द) × १००</div>
            </div>
          </div>

          {/* Section 4: Tips for Success */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
            <h3 className="font-bold text-amber-900 text-sm mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>महत्त्वाच्या टिप्स:</span>
            </h3>
            <ul className="space-y-1 list-disc pl-5 text-slate-700">
              <li>नेहमी कीबोर्डकडे न पाहता स्क्रीनवरील परिच्छेदावर लक्ष केंद्रित करा (Touch Typing).</li>
              <li>सुरुवातीला गतीपेक्षा अचूकतेला (Accuracy) प्राधान्य द्या; अचूकता वाढल्यास गती आपोआप वाढते.</li>
              <li>जोडाक्षरे व वेलांटीसाठी Remington मधील योग्य कीस्ट्रोक क्रमाने दाबण्याचा नियमित सराव करा.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg cursor-pointer transition-colors"
          >
            समजले, सराव सुरू करा (Got it)
          </button>
        </div>
      </div>
    </div>
  );
};
