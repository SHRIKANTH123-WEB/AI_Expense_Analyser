import React, { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Sparkles, Brain, AlertTriangle, PiggyBank, Target, History, Clock } from 'lucide-react';

const AISpan = () => {
  const {
    currentReport,
    aiReports,
    aiLoading,
    analyzeSpending,
    fetchAIReports,
    setCurrentReport,
  } = useExpenses();

  const [loadingTip, setLoadingTip] = useState(0);

  const loadingTips = [
    "COMPILING TRANSACTION HISTORY...",
    "CORRELATING EXPENSE CATEGORIES...",
    "IDENTIFYING RECUPERATING TRENDS...",
    "CONSULTING FINANCIAL KNOWLEDGE BASES...",
    "GEMINI GENERATING RECOMMENDATIONS...",
  ];

  useEffect(() => {
    fetchAIReports();
  }, []);

  useEffect(() => {
    let interval;
    if (aiLoading) {
      interval = setInterval(() => {
        setLoadingTip((prev) => (prev + 1) % loadingTips.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [aiLoading]);

  const handleAnalyze = async () => {
    await analyzeSpending();
  };

  const handleSelectReport = (e) => {
    const reportId = e.target.value;
    const report = aiReports.find((r) => r._id === reportId);
    if (report) {
      setCurrentReport(report);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-xl flex flex-col gap-5 relative overflow-hidden">
      {/* Accent Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-green/10 border border-brand-green/20 p-2 rounded-xl text-brand-green">
            <Brain className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Expense Audit
            </h3>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              Gemini command center analysis
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {aiReports.length > 0 && !aiLoading && (
            <div className="relative flex items-center">
              <History className="absolute left-2.5 h-3.5 w-3.5 text-slate-500" />
              <select
                onChange={handleSelectReport}
                value={currentReport?._id || ''}
                className="bg-slate-900 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-[10px] text-slate-300 font-bold outline-none cursor-pointer appearance-none"
              >
                {aiReports.map((rep) => (
                  <option key={rep._id} value={rep._id}>
                    {new Date(rep.analysisDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-xl bg-brand-green hover:bg-brand-green/90 shadow-md shadow-brand-green/10 transition-all duration-200 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {aiLoading ? 'Auditing...' : 'Audit'}
          </button>
        </div>
      </div>

      {/* Main Terminal Frame */}
      {aiLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 bg-brand-green/10 rounded-full animate-ping"></div>
            <div className="absolute inset-1.5 bg-brand-green rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-green/20 animate-pulse">
              <Brain className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-350 tracking-wider">RUNNING SPENDING PROBE</h4>
            <p className="text-[10px] text-slate-500 font-mono animate-pulse">
              {loadingTips[loadingTip]}
            </p>
          </div>
        </div>
      ) : currentReport ? (
        <div className="space-y-4 animate-slide-in">
          {/* Assessment patterns */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60 border-l-2 border-l-brand-green">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Audit Assessment</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
              {currentReport.spendingPatterns}
            </p>
          </div>

          {/* Red Flags / Outliers */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60">
            <div className="flex items-center gap-1.5 mb-2 text-brand-orange">
              <AlertTriangle className="h-4 w-4" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">High Risks / Red Flags</h4>
            </div>
            {currentReport.unnecessaryExpenses && currentReport.unnecessaryExpenses.length > 0 ? (
              <ul className="space-y-1.5">
                {currentReport.unnecessaryExpenses.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-brand-orange mt-0.5">•</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-650 italic">No outliers identified in this log.</p>
            )}
          </div>

          {/* Savings Actions */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60">
            <div className="flex items-center gap-1.5 mb-2 text-brand-green">
              <PiggyBank className="h-4 w-4" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">Savings Recommendations</h4>
            </div>
            {currentReport.savingsOpportunities && currentReport.savingsOpportunities.length > 0 ? (
              <ul className="space-y-1.5">
                {currentReport.savingsOpportunities.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <span className="text-brand-green mt-0.5">•</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-650 italic">No instructions logged.</p>
            )}
          </div>

          {/* Targets Limits */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900/60">
            <div className="flex items-center gap-1.5 mb-2 text-slate-200">
              <Target className="h-4 w-4 text-brand-green" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">Target Limits</h4>
            </div>
            {currentReport.budgetRecommendations && currentReport.budgetRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {currentReport.budgetRecommendations.map((item, idx) => {
                  const parts = item.split(':');
                  return (
                    <div key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-900/60 text-[10px]">
                      {parts.length > 1 ? (
                        <>
                          <strong className="text-slate-300 block mb-0.5">{parts[0]}</strong>
                          <span className="text-brand-green font-bold">{parts.slice(1).join(':')}</span>
                        </>
                      ) : (
                        <span className="text-slate-350">{item}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-650 italic">No targets defined.</p>
            )}
          </div>

          {/* Strategic Note */}
          <div className="text-[10px] text-slate-550 flex items-center justify-between mt-2 pt-2 border-t border-slate-900/60">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {new Date(currentReport.analysisDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </span>
            <span className="font-mono text-slate-600">ID: {currentReport._id.toString().slice(-6).toUpperCase()}</span>
          </div>
        </div>
      ) : (
        <div className="py-12 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center px-4">
          <Sparkles className="h-8 w-8 text-brand-green/30 mb-2 animate-pulse" />
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Run Financial Audit</h4>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs font-medium">
            Generate Gemini insights, budget metrics, and recommendations based on transaction logs.
          </p>
          <button
            onClick={handleAnalyze}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl bg-brand-green hover:bg-brand-green/90 shadow-md shadow-brand-green/10 transition-all cursor-pointer"
          >
            Audit Logs
          </button>
        </div>
      )}
    </div>
  );
};

export default AISpan;
