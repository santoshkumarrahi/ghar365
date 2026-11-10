import React, { useEffect } from 'react';
import { X, CheckCircle2, XCircle, Play, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AcceptanceTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcceptanceTestModal: React.FC<AcceptanceTestModalProps> = ({ isOpen, onClose }) => {
  const { testResults, runAcceptanceTestSuite, isTesting } = useApp();

  useEffect(() => {
    if (isOpen && testResults.length === 0) {
      runAcceptanceTestSuite();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const passedCount = testResults.filter((t) => t.passed).length;
  const totalCount = testResults.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#126B45] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F2B84B]" />
            <div>
              <h3 className="font-bold text-lg">Section 27 Acceptance Test Suite</h3>
              <p className="text-xs text-emerald-100">
                Automated verification of core business rules, weight boundaries & local isolation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Summary Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-4 gap-3">
            <div>
              <div className="text-sm font-bold text-emerald-950">
                Test Suite Status: {passedCount} / {totalCount} Tests Passing
              </div>
              <div className="text-xs text-emerald-700 mt-0.5">
                Every test maps directly to Section 27 acceptance criteria in the Master PRD.
              </div>
            </div>
            <button
              type="button"
              onClick={() => runAcceptanceTestSuite()}
              disabled={isTesting}
              className="px-4 py-2 bg-[#126B45] hover:bg-[#0e5235] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              Re-run All Tests
            </button>
          </div>

          {/* Test List */}
          <div className="space-y-3">
            {testResults.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-xl border transition ${
                  t.passed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {t.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{t.name}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">{t.description}</p>
                      <div className="mt-2 text-xs font-mono bg-white/80 p-2 rounded-lg border border-gray-200 text-gray-700">
                        {t.details}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      t.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {t.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#126B45] text-white text-xs font-semibold rounded-xl hover:bg-[#0e5235] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
