import { Router, Request, Response } from 'express';
import { createSession, getSession, updateSession, getAllSessions, deleteSession, type ClientInfo } from '../lib/sessions.js';

export const assessmentRouter = Router();

// Start a new assessment with client info
assessmentRouter.post('/start', async (req: Request, res: Response) => {
  try {
    const { companyName, contactName, contactEmail, contactRole, companySize } = req.body;

    if (!companyName || !contactName || !contactEmail || !contactRole) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['companyName', 'contactName', 'contactEmail', 'contactRole']
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const session = createSession();
    
    const clientInfo: ClientInfo = {
      companyName,
      contactName,
      contactEmail,
      contactRole,
      companySize
    };

    updateSession(session.id, { 
      clientInfo,
      status: 'in_progress'
    });

    res.json({
      sessionId: session.id,
      message: 'Assessment started successfully',
      clientInfo
    });

  } catch (error) {
    console.error('Start assessment error:', error);
    res.status(500).json({ error: 'Failed to start assessment' });
  }
});

// Get assessment status
assessmentRouter.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId: session.id,
      status: session.status,
      currentQuestion: session.currentQuestion,
      clientInfo: session.clientInfo,
      messageCount: session.messages.length,
      reportTier: session.reportTier,
      hasReport: !!session.reportMarkdown,
      scores: session.scores,
      createdAt: session.createdAt,
      completedAt: session.completedAt
    });

  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({ error: 'Failed to get assessment' });
  }
});

// Update client info
assessmentRouter.patch('/:sessionId/client-info', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const clientInfo: ClientInfo = {
      ...session.clientInfo,
      ...req.body
    } as ClientInfo;

    updateSession(sessionId, { clientInfo });

    res.json({ sessionId, clientInfo });

  } catch (error) {
    console.error('Update client info error:', error);
    res.status(500).json({ error: 'Failed to update client info' });
  }
});

// List all assessments (admin)
assessmentRouter.get('/', async (req: Request, res: Response) => {
  try {
    const sessions = getAllSessions();
    
    // Map to summary format
    const assessments = sessions.map(s => ({
      sessionId: s.id,
      companyName: s.clientInfo?.companyName || 'Unknown',
      contactName: s.clientInfo?.contactName || 'Unknown',
      contactEmail: s.clientInfo?.contactEmail || 'Unknown',
      status: s.status,
      reportTier: s.reportTier,
      scores: s.scores,
      createdAt: s.createdAt,
      completedAt: s.completedAt
    }));

    // Sort by creation date, newest first
    assessments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({ 
      count: assessments.length,
      assessments 
    });

  } catch (error) {
    console.error('List assessments error:', error);
    res.status(500).json({ error: 'Failed to list assessments' });
  }
});

// Delete assessment (GDPR)
assessmentRouter.delete('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const deleted = deleteSession(sessionId);

    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Assessment deleted successfully' });

  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
});

// Upgrade to pro tier
assessmentRouter.post('/:sessionId/upgrade', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.reportTier === 'pro') {
      return res.status(400).json({ error: 'Already upgraded to Pro' });
    }

    if (!session.reportMarkdown) {
      return res.status(400).json({ error: 'Report not yet generated' });
    }

    // In production, this would integrate with Stripe
    // For now, just upgrade the tier
    updateSession(sessionId, { 
      reportTier: 'pro'
    });

    res.json({ 
      sessionId,
      message: 'Upgraded to Pro successfully',
      reportTier: 'pro'
    });

  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ error: 'Failed to upgrade' });
  }
});

