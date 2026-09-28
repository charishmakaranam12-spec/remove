import React, { useState } from 'react';
import { AgentTraceLog, AgentType } from '../types/detective';
import { 
  Database, 
  Compass, 
  ShieldAlert, 
  CheckCircle, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

interface AgentPipelineViewerProps {
  traces: AgentTraceLog[];
  isLoading: boolean;
  activeAgentTab?: AgentType;
}

const AGENT_META: Record<AgentType, { name: string; icon: React.ElementType; color: string; bg: string; borderColor: string; description: string }> = {
  completeness: {
    name: 'Data Completeness Agent',
    icon: Database,
    color: 'text-sky-400',
    bg: 'bg-sky-950/40',
    borderColor: 'border-sky-800/80',
    description: 'Parses raw data, extracts available fields, and isolates empty or partial records.'
  },
  context: {
    name: 'Context Agent',
    icon: Compass,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    borderColor: 'border-emerald-800/80',
    description: 'Understands case purpose, retrieves expected domain blueprints, and maps gaps.'
  },
  risk: {
    name: 'Risk Agent',
    icon: ShieldAlert,
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    borderColor: 'border-amber-800/80',
    description: 'Assesses decision impact, failure modes, priority levels, and decision blockers.'
  },
  verification: {
    name: 'Verification Agent',
    icon: CheckCircle,
    color: 'text-purple-400',
    bg: 'bg-purple-950/40',
    borderColor: 'border-purple-800/80',
    description: 'Prunes false-positives, removes redundant queries, and detects contradictions.'
  },
  coordinator: {
    name: 'Coordinator Agent',
    icon: Cpu,
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/40',
    borderColor: 'border-indigo-800/80',
    description: 'Synthesizes agent outputs, calculates completeness, and forms follow-up queries.'
  }
};

export const AgentPipelineViewer: React.FC<AgentPipelineViewerProps> = ({ traces, isLoading }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>('completeness');

  const agentsOrder: AgentType[] = ['completeness', 'context', 'risk', 'verification', 'coordinator'];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Multi-Agent Orchestration Pipeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Sequential agent delegation trace with separation of concerns and adversarial verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>5 Specialized Agents</span>
          <span>·</span>
          <span className="font-mono text-emerald-400">Collaborative Consensus</span>
        </div>
      </div>

      {/* Agents Stepper / Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {agentsOrder.map((agentKey, index) => {
          const meta = AGENT_META[agentKey];
          const trace = traces.find(t => t.agent === agentKey);
          const Icon = meta.icon;
          const isSelected = selectedAgent === agentKey;

          return (
            <button
              key={agentKey}
              onClick={() => setSelectedAgent(isSelected ? null : agentKey)}
              className={`text-left p-3.5 rounded-lg border transition-all relative ${
                isSelected
                  ? `border-indigo-500 bg-slate-900 ring-1 ring-indigo-500/40 shadow-lg`
                  : `${meta.borderColor} ${meta.bg} hover:border-slate-700`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400">0{index + 1}</span>
                <div className={`p-1.5 rounded-md ${meta.bg} ${meta.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
                {meta.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                {meta.description}
              </p>

              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{trace?.durationMs ? `${trace.durationMs}ms` : 'Ready'}</span>
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Selected Agent Inspector Card */}
      {selectedAgent && (
        <div className="mt-4 p-4 rounded-lg border border-slate-800 bg-slate-950/80">
          {(() => {
            const meta = AGENT_META[selectedAgent];
            const trace = traces.find(t => t.agent === selectedAgent);
            const Icon = meta.icon;

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-md ${meta.bg} ${meta.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{meta.name}</span>
                        <span className="text-xs font-normal text-slate-400">({trace?.role || 'Reasoning Node'})</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {trace?.summary || meta.description}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAgent(null)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Minimize
                  </button>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Key Findings & Agent Directives:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {trace?.keyFindings && trace.keyFindings.length > 0 ? (
                      trace.keyFindings.map((finding, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{finding}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400 italic">No specific findings logged for this stage.</li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
