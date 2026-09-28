import React from 'react';
import { X, Layers, Cpu, ShieldAlert, Compass, Database, CheckCircle, Sparkles } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Agentic AI & Data Science Project Blueprint</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Multi-Agent Architecture for Missing Information Detection
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A specialized multi-agent workflow engineered to prevent decision failure across complex intake workflows.
          </p>
        </div>

        {/* Core Rationale: Why Multi-Agent? */}
        <div className="mt-6 space-y-6">
          <div className="p-4 rounded-xl border border-indigo-900/50 bg-indigo-950/20 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-indigo-300">The Problem with Monolithic LLM Chatbots: </span>
            Generic single-prompt models simply summarize the text that is present. They rarely identify what is <span className="text-white font-semibold italic">absent</span> because absence is invisible in the token stream. Detecting missing information requires domain counter-factual reasoning, regulatory knowledge mapping, risk underwriting, and adversarial consistency checking.
          </div>

          {/* The 5 Agents Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Specialized Agent Roles & Responsibilities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-lg border border-sky-800/60 bg-sky-950/20 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <Database className="h-4 w-4" />
                  <span>1. Data Completeness Agent</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Focuses on syntactic extraction. Parses structured rows and unstructured text, maps available keys, detects null/blank values, and catalogs raw available entities.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-emerald-800/60 bg-emerald-950/20 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Compass className="h-4 w-4" />
                  <span>2. Context Agent</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Performs semantic case identification. Retrieves the requisite domain schema (e.g. RBI credit underwriting, CMS insurance codes, I-9 employment) and highlights standard requirement gaps.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-amber-800/60 bg-amber-950/20 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldAlert className="h-4 w-4" />
                  <span>3. Risk Agent</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Underwrites decision impact. Evaluates what happens if a piece of information is ignored (e.g. over-leverage default, fraud exposure, patient drug allergy shock) and assigns High/Medium/Low priority.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-purple-800/60 bg-purple-950/20 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <CheckCircle className="h-4 w-4" />
                  <span>4. Verification Agent</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Acts as an adversarial auditor. Prunes frivolous questions, audits numerical consistency (e.g. loan-to-income ratio), and classifies statuses strictly into <span className="text-white font-mono">missing</span>, <span className="text-white font-mono">uncertain</span>, or <span className="text-white font-mono">inconsistent</span>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-indigo-800/60 bg-indigo-950/30 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Cpu className="h-4 w-4" />
                <span>5. Coordinator Agent (Final Reviewer)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Synthesizes outputs into the unified Missing Information Report. Calculates mathematically weighted completeness scores, frames courteous conversational inquiries, and attaches complete attribution to which agent flagged each item.
              </p>
            </div>
          </div>

          {/* Mathematical Completeness Formula */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Mathematical Completeness Formulation
            </h4>
            <div className="font-mono text-xs text-indigo-300 p-2.5 rounded bg-slate-950 border border-slate-800">
              Completeness Score = (Σ Available_Fields_Weight) / (Σ Available_Fields_Weight + Σ Missing_Fields_Weight) × 100%
            </div>
            <p className="text-[11px] text-slate-400">
              High Priority fields carry 3x weight, Medium Priority carries 2x weight, and Low Priority carries 1x weight to ensure critical decision blockers properly lower the overall readiness score.
            </p>
          </div>

          {/* Cross-Domain Adaptability */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider">
              Cross-Domain Reusability Matrix
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">Banking & Credit</span>
                <span className="text-[11px] text-slate-400">FOIR, credit score, tenure</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">Healthcare & Clinical</span>
                <span className="text-[11px] text-slate-400">Allergies, triage, next of kin</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">Insurance Claims</span>
                <span className="text-[11px] text-slate-400">Itemized bills, ICD-10, Pre-Auth</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">HR & Recruitment</span>
                <span className="text-[11px] text-slate-400">Work eligibility, notice period</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">Corporate Procurement</span>
                <span className="text-[11px] text-slate-400">EIN, COI insurance, bank routing</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block">Government Grants</span>
                <span className="text-[11px] text-slate-400">Tax filing, headcount, turnover</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
