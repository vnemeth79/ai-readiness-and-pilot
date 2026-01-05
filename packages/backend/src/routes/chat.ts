import { Router, Request, Response } from 'express';
import { openai, SYSTEM_PROMPT, MODEL, TEMPERATURE } from '../lib/openai.js';
import { getSession, addMessage, updateSession, createSession, type Message } from '../lib/sessions.js';

export const chatRouter = Router();

chatRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create session
    let session = sessionId ? getSession(sessionId) : null;
    if (!session) {
      session = createSession();
    }

    // Add user message
    const userMessage: Message = { role: 'user', content: message };
    addMessage(session.id, userMessage);

    // Build messages array for OpenAI
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...session.messages
    ];

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Session-Id', session.id);

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
      temperature: TEMPERATURE,
      stream: true
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content, sessionId: session.id })}\n\n`);
      }
    }

    // Add assistant response to session
    addMessage(session.id, { role: 'assistant', content: fullResponse });

    // Update question count based on response analysis
    const questionMatch = fullResponse.match(/Question\s+(\d+)/i);
    if (questionMatch) {
      updateSession(session.id, { 
        currentQuestion: parseInt(questionMatch[1]),
        status: 'in_progress'
      });
    }

    // Check if assessment is complete (report generated)
    if (fullResponse.includes('AI Pilot Project Readiness Report')) {
      updateSession(session.id, { 
        status: 'completed',
        completedAt: new Date(),
        reportMarkdown: fullResponse
      });
    }

    res.write(`data: ${JSON.stringify({ done: true, sessionId: session.id })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Non-streaming endpoint for simpler clients
chatRouter.post('/sync', async (req: Request, res: Response) => {
  try {
    const { sessionId, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let session = sessionId ? getSession(sessionId) : null;
    if (!session) {
      session = createSession();
    }

    const userMessage: Message = { role: 'user', content: message };
    addMessage(session.id, userMessage);

    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...session.messages
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
      temperature: TEMPERATURE
    });

    const response = completion.choices[0]?.message?.content || '';
    addMessage(session.id, { role: 'assistant', content: response });

    // Check for report completion
    if (response.includes('AI Pilot Project Readiness Report')) {
      updateSession(session.id, { 
        status: 'completed',
        completedAt: new Date(),
        reportMarkdown: response
      });
    }

    res.json({
      sessionId: session.id,
      message: response,
      status: session.status,
      currentQuestion: session.currentQuestion
    });

  } catch (error) {
    console.error('Chat sync error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

