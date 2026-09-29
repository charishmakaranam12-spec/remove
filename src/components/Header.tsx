import React from 'react';
import { Search, Sparkles, BookOpen, Layers, Bot } from 'lucide-react';

interface HeaderProps {
  onOpenArchitecture: () => void;
  onSelectQuickBenchmark: () => void;
  onToggleN8nChat: () => void;
  isN8nChatOpen: boolean;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenArchitecture,
  onSelectQuickBenchmark,
  onToggleN8nChat,
  isN8nChatOpen,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Search className="h-5 w-5" />
          </div>
          <button 
            onClick={() => onNavigate('input')}
            className="text-left group"
          >
            <span className="text-base font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              AI Missing Information Detective
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('input')}
            className={`transition-colors hover:text-white ${activeSection === 'input' ? 'text-indigo-400' : ''}`}
          >
            Case Intake
          </button>
          <button
            onClick={() => onNavigate('pipeline')}
            className={`transition-colors hover:text-white ${activeSection === 'pipeline' ? 'text-indigo-400' : ''}`}
          >
            Multi-Agent Pipeline
          </button>
          <button
            onClick={() => onNavigate('report')}
            className={`transition-colors hover:text-white ${activeSection === 'report' ? 'text-indigo-400' : ''}`}
          >
            Detective Report
          </button>
          <button
            onClick={() => onNavigate('resolve')}
            className={`transition-colors hover:text-white ${activeSection === 'resolve' ? 'text-indigo-400' : ''}`}
          >
            Resolution Studio
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleN8nChat}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all whitespace-nowrap ${
              isN8nChatOpen
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/30'
                : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/80 hover:bg-emerald-900/50'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>n8n Chatbot</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={onSelectQuickBenchmark}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Rahul's Case</span>
          </button>
          <button
            onClick={onOpenArchitecture}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 shadow-sm transition-colors whitespace-nowrap"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Blueprint</span>
          </button>
        </div>
      </div>
    </header>
  );
};
