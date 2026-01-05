import { useState, useCallback } from 'react';
import type { Message, ClientInfo, AssessmentScores } from '../types';

// Use relative URL for proxy in dev, or env variable for production
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [scores, setScores] = useState<AssessmentScores | null>(null);
  const [reportTier, setReportTier] = useState<'free' | 'pro'>('free');

  const startAssessment = useCallback(async (clientInfo: ClientInfo) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/assessment/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientInfo),
      });

      if (!response.ok) {
        throw new Error('Failed to start assessment');
      }

      const data = await response.json();
      setSessionId(data.sessionId);

      // Send initial greeting
      await sendMessage("Hello, I'm ready to start the AI readiness assessment.", data.sessionId);
      
      return data.sessionId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start assessment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string, overrideSessionId?: string) => {
    const currentSessionId = overrideSessionId || sessionId;
    
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: currentSessionId, 
          message: content 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessageId = (Date.now() + 1).toString();

      // Add placeholder assistant message
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.sessionId && !currentSessionId) {
                setSessionId(data.sessionId);
              }

              if (data.content) {
                assistantContent += data.content;
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: assistantContent }
                    : msg
                ));
              }

              if (data.done) {
                // Check if report is included
                if (assistantContent.includes('AI Pilot Project Readiness Report')) {
                  setReportMarkdown(assistantContent);
                }

                // Update question count based on content analysis
                const questionPatterns = [
                  /Question\s+(\d+)/i,
                  /(\d+)\s*of\s*14/i,
                  /Let's move to question (\d+)/i
                ];
                
                for (const pattern of questionPatterns) {
                  const match = assistantContent.match(pattern);
                  if (match) {
                    const qNum = parseInt(match[1]);
                    if (qNum > currentQuestion) {
                      setCurrentQuestion(qNum);
                    }
                    break;
                  }
                }

                // Increment based on content if no explicit number
                if (assistantContent.includes('?') && !assistantContent.includes('AI Pilot Project Readiness Report')) {
                  setCurrentQuestion(prev => Math.min(prev + 1, 14));
                }
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, currentQuestion]);

  const generateReport = useCallback(async () => {
    if (!sessionId) {
      setError('No active session');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/report/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setReportMarkdown(data.report);
      setScores(data.scores);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const getReport = useCallback(async () => {
    if (!sessionId) return null;

    try {
      const response = await fetch(`${API_BASE}/api/report/${sessionId}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      setReportMarkdown(data.report);
      setScores(data.scores);
      setReportTier(data.tier);
      
      return data;
    } catch {
      return null;
    }
  }, [sessionId]);

  const upgradeToProMock = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${API_BASE}/api/assessment/${sessionId}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to upgrade');

      setReportTier('pro');
      await getReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upgrade');
    }
  }, [sessionId, getReport]);

  const reset = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setIsLoading(false);
    setError(null);
    setCurrentQuestion(0);
    setReportMarkdown(null);
    setScores(null);
    setReportTier('free');
  }, []);

  return {
    messages,
    sessionId,
    isLoading,
    error,
    currentQuestion,
    reportMarkdown,
    scores,
    reportTier,
    startAssessment,
    sendMessage,
    generateReport,
    getReport,
    upgradeToProMock,
    reset,
  };
}
