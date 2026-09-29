import React, { useState } from 'react';
import { MissingInfoReport, MissingInfoItem, Priority, IssueStatus } from '../types/detective';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  FileCheck, 
  ShieldAlert, 
  Send, 
  ChevronRight,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
  Bot
} from 'lucide-react';

interface ReportDashboardProps {
  report: MissingInfoReport;
  onResolveItem: (itemName: string, answer: string) => void;
  onResetResolutions: () => void;
  onOpenN8nChat?: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report,
  onResolveItem,
  onResetResolutions,
  onOpenN8nChat
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [answeringItemId, setAnsweringItemId] = useState<string | null>(null);
  const [answerInputText, setAnswerInputText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'missing' | 'contradictions' | 'available'>('missing');

  const filteredItems = report.missingItems.filter(item => {
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const resolvedCount = report.missingItems.filter(i => i.resolved).length;
  const unresolvedItems = report.missingItems.filter(i => !i.resolved);

  const handleStartAnswering = (item: MissingInfoItem) => {
    setAnsweringItemId(item.id);
    setAnswerInputText(item.userAnswer || '');
  };

  const handleSaveAnswer = (item: MissingInfoItem) => {
    if (!answerInputText.trim()) return;
    onResolveItem(item.name, answerInputText.trim());
    setAnsweringItemId(null);
    setAnswerInputText('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Executive Summary & Completeness Gauge */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-indigo-400">{report.caseType}</span>
              <span aria-hidden="true">·</span>
              <span>{report.domain}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Generated {new Date(report.generatedAt).toLocaleTimeString()}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {report.headlineSummary}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {report.documentSummary}
            </p>
          </div>

          {/* Completeness Gauge Display */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800/90 bg-slate-950/70 shrink-0">
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  className="text-slate-800"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  className={report.completenessPercentage >= 80 ? 'text-emerald-500' : report.completenessPercentage >= 50 ? 'text-amber-500' : 'text-rose-500'}
                  strokeWidth="6"
                  strokeDasharray={201}
                  strokeDashoffset={201 - (201 * report.completenessPercentage) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-xl font-bold text-white tabular-nums">
                  {report.completenessPercentage}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Complete</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-slate-400">
                <span className="text-white font-semibold font-mono tabular-nums">{report.availableCount}</span> Available
              </div>
              <div className="text-amber-400">
                <span className="font-semibold font-mono tabular-nums">{unresolvedItems.length}</span> Required Gaps
              </div>
              {resolvedCount > 0 && (
                <div className="text-emerald-400">
                  <span className="font-semibold font-mono tabular-nums">{resolvedCount}</span> Resolved
                </div>
              )}
              {onOpenN8nChat && (
                <button
                  onClick={onOpenN8nChat}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-2 py-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded hover:bg-emerald-900/60 transition-colors"
                >
                  <Bot className="h-3 w-3" />
                  <span>Discuss with n8n</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Metric Bar with Zero-Pill Unboxed Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
          <div className="text-xs">
            <div className="text-slate-400 mb-1">Missing Fields</div>
            <div className="text-lg font-bold text-rose-400 font-mono tabular-nums">
              {report.missingCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Completely absent items</p>
          </div>

          <div className="text-xs">
            <div className="text-slate-400 mb-1">Uncertain / Vague</div>
            <div className="text-lg font-bold text-amber-400 font-mono tabular-nums">
              {report.uncertainCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Requires clarification</p>
          </div>

          <div className="text-xs">
            <div className="text-slate-400 mb-1">Inconsistent / Discrepancies</div>
            <div className="text-lg font-bold text-orange-400 font-mono tabular-nums">
              {report.inconsistentCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Contradictory values</p>
          </div>

          <div className="text-xs">
            <div className="text-slate-400 mb-1">Audit Contradictions</div>
            <div className="text-lg font-bold text-purple-400 font-mono tabular-nums">
              {report.contradictions.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Cross-field ratio checks</p>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Sub-Tabs & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('missing')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'missing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Missing Information ({report.missingItems.length})
          </button>
          <button
            onClick={() => setActiveTab('contradictions')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'contradictions'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Contradictions ({report.contradictions.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'available'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Present Fields ({report.availableFields.length})
          </button>
        </div>

        {/* Filter Controls (shown on Missing tab) */}
        {activeTab === 'missing' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Priority:</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-md">
              {['all', 'High', 'Medium', 'Low'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    filterPriority === p 
                      ? 'bg-slate-800 text-white font-semibold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p === 'all' ? 'All Priorities' : p}
                </button>
              ))}
            </div>

            {resolvedCount > 0 && (
              <button
                onClick={onResetResolutions}
                className="text-xs text-slate-400 hover:text-slate-200 underline flex items-center gap-1 ml-2"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Answers</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Tab Content: Missing Information Cards */}
      {activeTab === 'missing' && (
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-xs">
              No missing information items match the selected filter.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isResolved = item.resolved;
              const isAnswering = answeringItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all p-5 ${
                    isResolved
                      ? 'border-emerald-800/60 bg-emerald-950/10'
                      : item.priority === 'High'
                      ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 max-w-3xl">
                      {/* Zero-Pill Unboxed Metadata Bar */}
                      <div className="flex items-center gap-2 text-xs">
                        {/* Priority indicator */}
                        <span className={`font-semibold ${
                          item.priority === 'High' ? 'text-rose-400' : item.priority === 'Medium' ? 'text-amber-400' : 'text-sky-400'
                        }`}>
                          {item.priority} Priority
                        </span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        {/* Status (Missing / Uncertain / Inconsistent) */}
                        <span className={`capitalize ${
                          item.status === 'missing' ? 'text-slate-300' : item.status === 'uncertain' ? 'text-amber-300' : 'text-orange-300'
                        }`}>
                          {item.status} Information
                        </span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-slate-400">Category: {item.category}</span>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-indigo-400 font-medium">Discovered by: {item.identifiedByAgent}</span>
                      </div>

                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.isDecisionBlocker && (
                          <span className="text-[11px] font-semibold text-rose-400 font-mono">
                            [Decision Blocker]
                          </span>
                        )}
                      </h3>

                      {/* Why Required Explanation */}
                      <div className="text-xs text-slate-300 leading-relaxed pt-1">
                        <span className="font-semibold text-slate-200">Why Required: </span>
                        <span>{item.whyRequired}</span>
                      </div>

                      {/* Potential Risk & Impact */}
                      <div className="text-xs text-slate-400 leading-relaxed">
                        <span className="font-semibold text-amber-400/90">Impact / Risk if Omitted: </span>
                        <span>{item.potentialRisk}</span>
                      </div>

                      {/* Formulated Follow-up Question */}
                      <div className="mt-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-indigo-300 flex items-start gap-2">
                        <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-indigo-200">Suggested Follow-Up Question: </span>
                          <span>"{item.suggestedQuestion}"</span>
                        </div>
                      </div>

                      {/* Resolved Answer Feedback */}
                      {isResolved && (
                        <div className="mt-2 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-semibold">Resolved with response: </span>
                            <span>"{item.userAnswer}"</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button: Answer / Resolve */}
                    <div className="shrink-0 self-end sm:self-start">
                      {!isResolved ? (
                        <button
                          onClick={() => handleStartAnswering(item)}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          Provide Answer
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartAnswering(item)}
                          className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200 underline"
                        >
                          Edit Answer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Answer Input Box */}
                  {isAnswering && (
                    <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={answerInputText}
                        onChange={(e) => setAnswerInputText(e.target.value)}
                        placeholder={`Enter missing details (e.g. for ${item.name})...`}
                        className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveAnswer(item);
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveAnswer(item)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
                        >
                          Submit Answer
                        </button>
                        <button
                          onClick={() => setAnsweringItemId(null)}
                          className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. Tab Content: Contradictions & Inconsistencies */}
      {activeTab === 'contradictions' && (
        <div className="space-y-3">
          {report.contradictions.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <span>No internal contradictions or discrepancies detected in submitted parameters.</span>
            </div>
          ) : (
            report.contradictions.map((contra) => (
              <div
                key={contra.id}
                className="rounded-xl border border-amber-800/60 bg-amber-950/20 p-5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{contra.title}</span>
                  </span>
                  <span className="text-slate-400 font-mono">{contra.severity} Severity</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {contra.description}
                </p>
                {contra.fields && contra.fields.length > 0 && (
                  <div className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                    <span className="font-medium text-slate-300">Conflicting Fields:</span>
                    {contra.fields.map((f, idx) => (
                      <span key={idx} className="font-mono text-amber-300">
                        {f}{idx < contra.fields.length - 1 ? ' vs ' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. Tab Content: Available & Extracted Fields */}
      {activeTab === 'available' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="font-semibold text-slate-300">Extracted Available Entity Attributes</span>
            <span className="font-mono">{report.availableFields.length} Attributes verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Field Attribute</th>
                  <th className="py-2.5 px-4">Captured Value</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Completeness Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {report.availableFields.map((field) => (
                  <tr key={field.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-white">{field.name}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-200">{field.value}</td>
                    <td className="py-2.5 px-4 text-slate-400">{field.category}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-400">
                      {Math.round((field.confidence || 0.95) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
