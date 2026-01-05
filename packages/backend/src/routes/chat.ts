import { Router, Request, Response } from 'express';
import { openai, SYSTEM_PROMPT, MODEL, TEMPERATURE, isOpenAIConfigured } from '../lib/openai.js';
import { getSession, addMessage, updateSession, createSession, type Message } from '../lib/sessions.js';
import { getMockResponse, MOCK_REPORT } from '../lib/mockResponses.js';

export const chatRouter = Router();

// Helper to simulate streaming for mock mode
async function* mockStreamResponse(text: string) {
  const words = text.split(' ');
  for (const word of words) {
    yield word + ' ';
    await new Promise(resolve => setTimeout(resolve, 20)); // Simulate typing
  }
}

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

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Session-Id', session.id);

    let fullResponse = '';

    // Check if OpenAI is configured
    if (isOpenAIConfigured()) {
      // Use real OpenAI
      const messages: Message[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...session.messages
      ];

      const stream = await openai.chat.completions.create({
        model: MODEL,
        messages: messages,
        temperature: TEMPERATURE,
        stream: true
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content, sessionId: session.id })}\n\n`);
        }
      }
    } else {
      // Use mock responses (demo mode)
      const mockResponse = getMockResponse(session.currentQuestion);
      
      for await (const chunk of mockStreamResponse(mockResponse)) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ content: chunk, sessionId: session.id })}\n\n`);
      }
    }

    // Add assistant response to session
    addMessage(session.id, { role: 'assistant', content: fullResponse });

    // Update question count
    const newQuestionNumber = session.currentQuestion + 1;
    updateSession(session.id, { 
      currentQuestion: newQuestionNumber,
      status: 'in_progress'
    });

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

    let response = '';

    if (isOpenAIConfigured()) {
      const messages: Message[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...session.messages
      ];

      const completion = await openai.chat.completions.create({
        model: MODEL,
        messages: messages,
        temperature: TEMPERATURE
      });

      response = completion.choices[0]?.message?.content || '';
    } else {
      // Mock mode
      response = getMockResponse(session.currentQuestion);
    }

    addMessage(session.id, { role: 'assistant', content: response });

    // Update question count
    const newQuestionNumber = session.currentQuestion + 1;
    updateSession(session.id, { 
      currentQuestion: newQuestionNumber,
      status: 'in_progress'
    });

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
