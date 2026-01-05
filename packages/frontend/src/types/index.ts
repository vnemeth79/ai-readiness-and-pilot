export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ClientInfo {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactRole: string;
  companySize?: string;
}

export interface AssessmentScores {
  painPoints: number;
  dataReadiness: number;
  orgReadiness: number;
  processMaturity: number;
  strategicPriorities: number;
  strategicIntent: string;
  overall: number;
}

export interface Assessment {
  sessionId: string;
  status: 'collecting_info' | 'in_progress' | 'completed' | 'abandoned';
  clientInfo?: ClientInfo;
  currentQuestion: number;
  reportTier: 'free' | 'pro';
  reportMarkdown?: string;
  scores?: AssessmentScores;
  createdAt: Date;
  completedAt?: Date;
}

export type AppPhase = 
  | 'welcome'
  | 'client_info'
  | 'assessment'
  | 'generating'
  | 'report';

export interface ChatResponse {
  content?: string;
  done?: boolean;
  sessionId: string;
}

