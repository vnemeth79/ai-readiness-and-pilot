import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export const isSupabaseConfigured = () => !!supabase;

// Database types
export interface DbClient {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_role: string | null;
  company_size: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbAssessment {
  id: string;
  session_id: string;
  client_id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  tier: 'free' | 'pro';
  current_question: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  assessment_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface DbScores {
  id: string;
  assessment_id: string;
  pain_points: number;
  data_readiness: number;
  org_readiness: number;
  process_maturity: number;
  strategic_priorities: number;
  overall: number;
  strategic_intent: string;
  created_at: string;
}

// Database operations
export async function createClient(clientInfo: {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactRole?: string;
  companySize?: string;
}): Promise<DbClient | null> {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('clients')
    .insert({
      company_name: clientInfo.companyName,
      contact_name: clientInfo.contactName,
      contact_email: clientInfo.contactEmail,
      contact_role: clientInfo.contactRole || null,
      company_size: clientInfo.companySize || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    return null;
  }
  
  return data;
}

export async function createAssessment(sessionId: string, clientId: string): Promise<DbAssessment | null> {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      session_id: sessionId,
      client_id: clientId,
      status: 'in_progress',
      tier: 'free',
      current_question: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating assessment:', error);
    return null;
  }
  
  return data;
}

export async function getAssessmentBySessionId(sessionId: string): Promise<DbAssessment | null> {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) {
    console.error('Error getting assessment:', error);
    return null;
  }
  
  return data;
}

export async function saveMessage(assessmentId: string, role: string, content: string): Promise<DbMessage | null> {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      assessment_id: assessmentId,
      role,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving message:', error);
    return null;
  }
  
  return data;
}

export async function getMessagesByAssessmentId(assessmentId: string): Promise<DbMessage[]> {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('assessment_id', assessmentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error getting messages:', error);
    return [];
  }
  
  return data || [];
}

export async function updateAssessmentStatus(
  sessionId: string, 
  updates: Partial<DbAssessment>
): Promise<boolean> {
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('assessments')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error updating assessment:', error);
    return false;
  }
  
  return true;
}

export async function saveScores(assessmentId: string, scores: {
  painPoints: number;
  dataReadiness: number;
  orgReadiness: number;
  processMaturity: number;
  strategicPriorities: number;
  overall: number;
  strategicIntent: string;
}): Promise<boolean> {
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('scores')
    .upsert({
      assessment_id: assessmentId,
      pain_points: scores.painPoints,
      data_readiness: scores.dataReadiness,
      org_readiness: scores.orgReadiness,
      process_maturity: scores.processMaturity,
      strategic_priorities: scores.strategicPriorities,
      overall: scores.overall,
      strategic_intent: scores.strategicIntent,
    });

  if (error) {
    console.error('Error saving scores:', error);
    return false;
  }
  
  return true;
}

export async function saveReport(assessmentId: string, markdownContent: string): Promise<boolean> {
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('reports')
    .upsert({
      assessment_id: assessmentId,
      markdown_content: markdownContent,
    });

  if (error) {
    console.error('Error saving report:', error);
    return false;
  }
  
  return true;
}

export async function upgradeToProTier(sessionId: string): Promise<boolean> {
  if (!supabase) return false;
  
  const { error } = await supabase
    .from('assessments')
    .update({ tier: 'pro', updated_at: new Date().toISOString() })
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error upgrading to pro:', error);
    return false;
  }
  
  return true;
}

