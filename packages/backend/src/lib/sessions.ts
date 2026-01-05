import { v4 as uuidv4 } from 'uuid';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ClientInfo {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactRole: string;
  companySize?: string;
}

export interface Session {
  id: string;
  clientInfo?: ClientInfo;
  messages: Message[];
  currentQuestion: number;
  status: 'collecting_info' | 'in_progress' | 'completed' | 'abandoned';
  reportTier: 'free' | 'pro';
  reportMarkdown?: string;
  scores?: {
    painPoints: number;
    dataReadiness: number;
    orgReadiness: number;
    processMaturity: number;
    strategicPriorities: number;
    strategicIntent: string;
    overall: number;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// In-memory session store (replace with database in production)
const sessions = new Map<string, Session>();

export function createSession(): Session {
  const session: Session = {
    id: uuidv4(),
    messages: [],
    currentQuestion: 0,
    status: 'collecting_info',
    reportTier: 'free',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, updates: Partial<Session>): Session | undefined {
  const session = sessions.get(id);
  if (!session) return undefined;
  
  const updated = {
    ...session,
    ...updates,
    updatedAt: new Date()
  };
  sessions.set(id, updated);
  return updated;
}

export function addMessage(sessionId: string, message: Message): Session | undefined {
  const session = sessions.get(sessionId);
  if (!session) return undefined;
  
  session.messages.push(message);
  session.updatedAt = new Date();
  sessions.set(sessionId, session);
  return session;
}

export function getAllSessions(): Session[] {
  return Array.from(sessions.values());
}

export function deleteSession(id: string): boolean {
  return sessions.delete(id);
}

