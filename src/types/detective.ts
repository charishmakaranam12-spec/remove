export type AgentType = 
  | 'completeness' 
  | 'context' 
  | 'risk' 
  | 'verification' 
  | 'coordinator';

export type IssueStatus = 'missing' | 'uncertain' | 'inconsistent';

export type Priority = 'High' | 'Medium' | 'Low';

export interface FieldItem {
  id: string;
  name: string;
  value: string;
  category: string;
  confidence?: number;
  isTentative?: boolean;
}

export interface MissingInfoItem {
  id: string;
  name: string;
  category: string;
  status: IssueStatus;
  priority: Priority;
  whyRequired: string;
  potentialRisk: string;
  suggestedQuestion: string;
  identifiedByAgent: string;
  verifiedByAgent: boolean;
  isDecisionBlocker: boolean;
  userAnswer?: string;
  resolved?: boolean;
}

export interface Contradiction {
  id: string;
  title: string;
  description: string;
  fields: string[];
  severity: Priority;
}

export interface AgentTraceLog {
  agent: AgentType;
  agentName: string;
  role: string;
  status: 'pending' | 'running' | 'completed' | 'flagged';
  durationMs: number;
  summary: string;
  keyFindings: string[];
  timestamp: string;
}

export interface MissingInfoReport {
  id: string;
  caseType: string;
  domain: string;
  purpose: string;
  documentSummary: string;
  completenessPercentage: number;
  availableFields: FieldItem[];
  missingItems: MissingInfoItem[];
  contradictions: Contradiction[];
  headlineSummary: string;
  agentTraces: AgentTraceLog[];
  generatedAt: string;
  totalFieldsCount: number;
  availableCount: number;
  missingCount: number;
  uncertainCount: number;
  inconsistentCount: number;
}

export interface SampleCase {
  id: string;
  title: string;
  caseType: string;
  domain: string;
  badge: string;
  description: string;
  content: string;
  expectedMissingCount: number;
}
