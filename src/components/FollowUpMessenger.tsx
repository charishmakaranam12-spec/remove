import React, { useState } from 'react';
import { MissingInfoReport, MissingInfoItem } from '../types/detective';
import { 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface FollowUpMessengerProps {
  report: MissingInfoReport;
  onBatchResolve: (answers: Record<string, string>) => void;
  onResetResolutions: () => void;
}

export const FollowUpMessenger: React.FC<FollowUpMessengerProps> = ({
  report,
  onBatchResolve,
  onResetResolutions,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const unresolvedItems = report.missingItems.filter(item => !item.resolved);

  const generateFormalMessage = () => {
    const lines: string[] = [
      `Subject: Action Required: Missing Information for your ${report.caseType}`,
      ``,
      `Dear Applicant / Submitter,`,
      ``,
      `Thank you for submitting your documentation for ${report.purpose}.`,
      `Our verification system has completed an initial completeness audit. Before this application can be fully processed, ${unresolvedItems.length} important piece${unresolvedItems.length === 1 ? '' : 's'} of information must be collected:`,
      ``
    ];

    unresolvedItems.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${item.name} (${item.priority} Priority)`);
      lines.push(`   • Why it is required: ${item.whyRequired}`);
      lines.push(`   • Question to answer: ${item.suggestedQuestion}`);
      lines.push(``);
    });

    lines.push(`Please provide these details at your earliest convenience to avoid processing delays.`);
    lines.push(``);
    lines.push(`Sincerely,`);
    lines.push(`Case Underwriting & Verification Team`);

    return lines.join('\n');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateFormalMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickFill = () => {
    const quickMap: Record<string, string> = {};
    if (report.caseType.toLowerCase().includes('loan')) {
      quickMap['Employment Duration / Stability'] = '3 years and 4 months at Current Tech Corp';
      quickMap['Existing Loan & Financial Obligations (EMIs)'] = 'Zero active loans; ₹0 monthly EMI liabilities';
      quickMap['Credit History & Score (CIBIL / FICO)'] = '775 CIBIL Score (Clean repayment track record)';
      quickMap['Applicant Contact Information (Phone & Email)'] = '+91 98450 12345 · rahul.sharma@example.com';
    } else if (report.caseType.toLowerCase().includes('insurance')) {
      quickMap['Pre-Authorization Number / Notification Record'] = 'PRE-AUTH-884920-METRO';
      quickMap['Itemized Hospital Bill Breakdown'] = 'Attached official PDF split: OT $6,200, Surgeon $4,000, Room $2,800, Meds $1,200';
      quickMap['Surgeon Discharge Summary & Operative Notes'] = 'Operative notes signed by Dr. Vance attached with histopathology confirm appendectomy';
      quickMap['Diagnosis ICD-10 Clinical Coding'] = 'ICD-10 Code K35.80 (Unspecified acute appendicitis)';
    } else if (report.caseType.toLowerCase().includes('medical')) {
      quickMap['Known Drug Allergies & Anaphylaxis History'] = 'No known drug allergies (NKDA) to Penicillin or contrast media';
      quickMap['Emergency Contact Person & Phone Number'] = 'Carlos Rodriguez (Spouse) · (555) 392-8819';
      quickMap['Previous Cardiac History / Baseline ECG'] = 'No prior myocardial infarction or cardiac stents; prior stress test normal in 2024';
    } else {
      unresolvedItems.forEach(item => {
        quickMap[item.name] = `Verified official documentation provided for ${item.name}`;
      });
    }

    setAnswers(quickMap);
  };

  const handleSubmitAllAnswers = () => {
    onBatchResolve(answers);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Column 1: Formal Inquiry Dispatcher */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Targeted Customer Inquiry</h3>
            </div>
            <button
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Dispatch Text</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-3 mb-3">
            Polite, targeted inquiry ready to be transmitted via email or customer portal, citing the exact reasoning for each required gap.
          </p>

          <pre className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {generateFormalMessage()}
          </pre>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Verification Agent guarantees no redundant or unnecessary queries are included.</span>
        </div>
      </div>

      {/* Column 2: Interactive Resolution & Re-Evaluation Studio */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Resolution & Re-Evaluation Studio</h3>
            </div>
            <button
              onClick={handleQuickFill}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simulate Verified Answers</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-3 mb-4">
            Simulate receiving responses from the applicant. Watch the Detective dynamically verify the input and elevate case completeness.
          </p>

          {unresolvedItems.length === 0 ? (
            <div className="p-8 rounded-lg border border-emerald-800/60 bg-emerald-950/20 text-center space-y-2">
              <Check className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Case 100% Resolved</h4>
              <p className="text-xs text-slate-300">
                All identified missing information points have been satisfied and recorded.
              </p>
              <button
                onClick={onResetResolutions}
                className="mt-3 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white underline"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset for Fresh Test</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {unresolvedItems.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <span className={`text-[10px] font-mono ${item.priority === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <input
                    type="text"
                    value={answers[item.name] || ''}
                    onChange={(e) => setAnswers({ ...answers, [item.name]: e.target.value })}
                    placeholder={`Enter details for: ${item.name}...`}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {unresolvedItems.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {Object.keys(answers).filter(k => answers[k]?.trim()).length} of {unresolvedItems.length} fields filled
            </span>
            <button
              onClick={handleSubmitAllAnswers}
              disabled={Object.keys(answers).filter(k => answers[k]?.trim()).length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-500 disabled:opacity-40 transition-colors"
            >
              <span>Submit & Update Completeness</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
