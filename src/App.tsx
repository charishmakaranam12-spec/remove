import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { AgentPipelineViewer } from './components/AgentPipelineViewer';
import { ReportDashboard } from './components/ReportDashboard';
import { FollowUpMessenger } from './components/FollowUpMessenger';
import { ArchitectureModal } from './components/ArchitectureModal';
import { N8nChatbot } from './components/N8nChatbot';
import { MissingInfoReport } from './types/detective';
import { SAMPLE_CASES } from './data/sampleCases';
import { runClientHeuristicMultiAgent } from './services/clientFallback';
import bannerImage from './assets/images/detective_system_banner_1790611594521.jpg';
import { 
  Sparkles, 
  Search, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  FileText,
  RotateCcw,
  ArrowRight,
  Bot
} from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<MissingInfoReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('input');
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isN8nChatOpen, setIsN8nChatOpen] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [currentDocumentText, setCurrentDocumentText] = useState<string>(SAMPLE_CASES[0].content);
  const [currentFileName, setCurrentFileName] = useState<string>('rahul_personal_loan_form.txt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize with Rahul's benchmark on first load for an immediate populated demonstration
  useEffect(() => {
    executeAnalysis(SAMPLE_CASES[0].content, 'rahul_personal_loan_form.txt');
  }, []);

  const executeAnalysis = async (
    text: string, 
    fileName?: string, 
    answersOverride?: Record<string, string>
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentDocumentText(text);
    if (fileName) setCurrentFileName(fileName);

    const answersToUse = answersOverride !== undefined ? answersOverride : userAnswers;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: text,
          fileName: fileName || currentFileName,
          userAnswers: answersToUse
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: MissingInfoReport = await response.json();
      setReport(data);
    } catch (err: any) {
      console.warn('API call encountered issue, switching to high-fidelity multi-agent client fallback:', err);
      // Seamlessly execute client-side multi-agent engine
      const fallbackReport = runClientHeuristicMultiAgent(text, fileName || currentFileName, answersToUse);
      setReport(fallbackReport);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveSingleItem = (itemName: string, answer: string) => {
    const updatedAnswers = { ...userAnswers, [itemName]: answer };
    setUserAnswers(updatedAnswers);
    executeAnalysis(currentDocumentText, currentFileName, updatedAnswers);
  };

  const handleBatchResolve = (answers: Record<string, string>) => {
    const merged = { ...userAnswers, ...answers };
    setUserAnswers(merged);
    executeAnalysis(currentDocumentText, currentFileName, merged);
  };

  const handleResetResolutions = () => {
    setUserAnswers({});
    executeAnalysis(currentDocumentText, currentFileName, {});
  };

  const handleSelectQuickBenchmark = () => {
    setUserAnswers({});
    executeAnalysis(SAMPLE_CASES[0].content, 'rahul_personal_loan_form.txt', {});
    setActiveSection('report');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Navigation */}
      <Header
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onSelectQuickBenchmark={handleSelectQuickBenchmark}
        onToggleN8nChat={() => setIsN8nChatOpen(!isN8nChatOpen)}
        isN8nChatOpen={isN8nChatOpen}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Hero & Conceptual Banner */}
      <div className="relative border-b border-slate-800/80 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <span>Agentic AI & Multi-Agent Architecture</span>
                <span aria-hidden="true">·</span>
                <span>Case Intake Diagnostic Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                AI Missing Information Detective
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Monolithic LLMs summarize what is present. The Detective discovers what is <span className="text-indigo-400 font-semibold">missing</span>, determines why each field is required, underwrites decision risks, and drafts targeted inquiries across loan applications, clinical intakes, insurance claims, and enterprise contracts.
              </p>

              {/* Action Buttons with n8n Bot CTA */}
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsN8nChatOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950/40 transition-colors"
                >
                  <Bot className="h-4 w-4" />
                  <span>Open Live n8n Chatbot</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
                </button>
                <button
                  onClick={() => setIsArchitectureOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Architecture Blueprint</span>
                </button>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Data Completeness Agent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span>Context Agent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>Risk Agent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  <span>Verification Agent</span>
                </div>
              </div>
            </div>

            {/* Visual System Asset Slot */}
            <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-2xl">
              <img
                src={bannerImage}
                alt="Multi-agent reasoning visualization"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-3 text-[11px] font-mono text-slate-300">
                Collaborative 5-Agent Directed Reasoning Graph
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {errorMessage && (
          <div className="p-4 rounded-xl border border-rose-800/80 bg-rose-950/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-xs underline hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section 1: Case Intake & Document Staging */}
        <div id="section-input">
          <InputPanel
            onAnalyze={(text, name) => executeAnalysis(text, name)}
            isLoading={isLoading}
          />
        </div>

        {/* Section 2: Multi-Agent Orchestration Pipeline */}
        {report && (
          <div id="section-pipeline">
            <AgentPipelineViewer
              traces={report.agentTraces}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Section 3: Detective Report Dashboard */}
        {report && (
          <div id="section-report">
            <ReportDashboard
              report={report}
              onResolveItem={handleResolveSingleItem}
              onResetResolutions={handleResetResolutions}
              onOpenN8nChat={() => setIsN8nChatOpen(true)}
            />
          </div>
        )}

        {/* Section 4: Resolution & Customer Inquiry Studio */}
        {report && (
          <div id="section-resolve">
            <FollowUpMessenger
              report={report}
              onBatchResolve={handleBatchResolve}
              onResetResolutions={handleResetResolutions}
            />
          </div>
        )}
      </main>

      {/* Educational & Academic Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-slate-200">AI Missing Information Detective</span>
            <span className="mx-2">·</span>
            <span>Agentic AI & Data Science Project</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="hover:text-white transition-colors underline"
            >
              Multi-Agent Architecture Blueprint
            </button>
            <span>·</span>
            <span>Gemini 3.8 Flash Powered</span>
          </div>
        </div>
      </footer>

      {/* Architectural Deep-Dive Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Floating n8n Chat FAB */}
      {!isN8nChatOpen && (
        <button
          onClick={() => setIsN8nChatOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xl shadow-emerald-950/60 hover:shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 border border-emerald-400/40 group"
          title="Chat with your live n8n AI Detective"
        >
          <div className="relative">
            <Bot className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white animate-ping" />
          </div>
          <span>Chat with n8n Detective</span>
        </button>
      )}

      {/* Live n8n AI Detective Chatbot Widget */}
      <N8nChatbot
        isOpen={isN8nChatOpen}
        onClose={() => setIsN8nChatOpen(false)}
        stagedDocumentText={currentDocumentText}
        stagedCaseName={currentFileName}
      />
    </div>
  );
}
