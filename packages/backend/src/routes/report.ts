import { Router, Request, Response } from 'express';
import { openai, SYSTEM_PROMPT, MODEL } from '../lib/openai.js';
import { getSession, updateSession, type Message } from '../lib/sessions.js';

export const reportRouter = Router();

const REPORT_INSTRUCTION = `Based on the conversation above, now generate the complete AI Pilot Project Readiness Report in Markdown format. 

Follow this exact structure:

### AI Pilot Project Readiness Report for [Company Name]

**Executive Summary:**
A comprehensive overview of the client's AI readiness and key opportunities identified.

**Readiness Assessment Scorecard:**

| Assessment Dimension | Score (1-5) | Key Observations |
|---------------------|-------------|------------------|
| Business Pain Points & Opportunities | [Score] | [Observations] |
| Data Readiness | [Score] | [Observations] |
| Organizational Readiness | [Score] | [Observations] |
| Process Maturity | [Score] | [Observations] |
| Strategic Priorities | [Score] | [Observations] |
| AI Strategic Intent | [Experimentation/Tool Adoption/Strategic Transformation] | [Observations] |

**Overall Readiness Score: [X.X/5]**

**Prioritized AI Pilot Project Recommendations:**

**1. Top Priority: [AI Solution Category]**
- **Recommended Pilot Project:** [Specific project description]
- **Business Impact:** [Detailed impact analysis with metrics]
- **Why it's a good fit:** [Justification based on their readiness scores and strategic intent]
- **Implementation Approach:** [High-level steps]
- **Budget Estimate:** [Range]

**2. Secondary Priority: [AI Solution Category]**
- **Recommended Pilot Project:** [Project]
- **Business Impact:** [Impact]
- **Why it's a good fit:** [Justification]
- **Implementation Approach:** [Steps]
- **Budget Estimate:** [Range]

**3. Exploratory Priority: [AI Solution Category]**
- **Recommended Pilot Project:** [Project]
- **Business Impact:** [Impact]
- **Why it's a good fit:** [Justification]
- **Implementation Approach:** [Steps]
- **Budget Estimate:** [Range]

**Next Steps:**
Detailed action items and timeline for getting started.

Generate only the report, nothing else.`;

reportRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.messages.length < 10) {
      return res.status(400).json({ error: 'Assessment not complete. Please answer all questions.' });
    }

    // Build messages with report instruction
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...session.messages,
      { role: 'user', content: REPORT_INSTRUCTION }
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
      temperature: 0.5, // Lower temperature for more consistent reports
      max_tokens: 4000
    });

    const report = completion.choices[0]?.message?.content || '';

    // Extract scores from report (basic parsing)
    const scores = extractScores(report);

    // Update session with report
    updateSession(sessionId, {
      status: 'completed',
      completedAt: new Date(),
      reportMarkdown: report,
      scores
    });

    res.json({
      sessionId,
      report,
      scores,
      status: 'completed'
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate report', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get report for a session
reportRouter.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.reportMarkdown) {
      return res.status(400).json({ error: 'Report not yet generated' });
    }

    // Filter report based on tier
    const filteredReport = session.reportTier === 'free' 
      ? filterReportForFreeTier(session.reportMarkdown)
      : session.reportMarkdown;

    res.json({
      sessionId,
      report: filteredReport,
      fullReport: session.reportTier === 'pro' ? session.reportMarkdown : undefined,
      scores: session.scores,
      tier: session.reportTier,
      canUpgrade: session.reportTier === 'free',
      clientInfo: session.clientInfo,
      completedAt: session.completedAt
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to get report' });
  }
});

function extractScores(report: string): {
  painPoints: number;
  dataReadiness: number;
  orgReadiness: number;
  processMaturity: number;
  strategicPriorities: number;
  strategicIntent: string;
  overall: number;
} {
  // Basic regex parsing - could be improved
  const scorePattern = /\|\s*([^|]+)\s*\|\s*(\d+(?:\.\d+)?)\s*\|/g;
  const scores = {
    painPoints: 3,
    dataReadiness: 3,
    orgReadiness: 3,
    processMaturity: 3,
    strategicPriorities: 3,
    strategicIntent: 'Tool Adoption',
    overall: 3
  };

  let match;
  while ((match = scorePattern.exec(report)) !== null) {
    const dimension = match[1].toLowerCase().trim();
    const score = parseFloat(match[2]);
    
    if (dimension.includes('pain') || dimension.includes('opportunity')) {
      scores.painPoints = score;
    } else if (dimension.includes('data')) {
      scores.dataReadiness = score;
    } else if (dimension.includes('organizational')) {
      scores.orgReadiness = score;
    } else if (dimension.includes('process')) {
      scores.processMaturity = score;
    } else if (dimension.includes('strategic') && dimension.includes('priorities')) {
      scores.strategicPriorities = score;
    }
  }

  // Extract strategic intent
  const intentMatch = report.match(/Strategic\s+Intent\s*\|\s*([^|]+)/i);
  if (intentMatch) {
    const intent = intentMatch[1].trim();
    if (intent.toLowerCase().includes('experimentation')) {
      scores.strategicIntent = 'Experimentation & Learning';
    } else if (intent.toLowerCase().includes('transformation')) {
      scores.strategicIntent = 'Strategic Transformation';
    } else {
      scores.strategicIntent = 'Tool Adoption';
    }
  }

  // Calculate overall
  scores.overall = (scores.painPoints + scores.dataReadiness + scores.orgReadiness + 
                   scores.processMaturity + scores.strategicPriorities) / 5;
  scores.overall = Math.round(scores.overall * 10) / 10;

  return scores;
}

function filterReportForFreeTier(fullReport: string): string {
  // For free tier, include only:
  // - Executive Summary
  // - Scorecard
  // - Top Priority title and one sentence

  const lines = fullReport.split('\n');
  const filtered: string[] = [];
  let inTopPriority = false;
  let topPriorityLineCount = 0;
  let skipSection = false;

  for (const line of lines) {
    // Include everything up to Top Priority
    if (line.includes('**1. Top Priority')) {
      inTopPriority = true;
      filtered.push(line);
      continue;
    }

    if (inTopPriority) {
      topPriorityLineCount++;
      // Include only first 3 lines of Top Priority (title, project name, first sentence)
      if (topPriorityLineCount <= 3) {
        filtered.push(line);
      } else if (topPriorityLineCount === 4) {
        filtered.push('');
        filtered.push('*🔒 Full details, implementation approach, and budget estimates are available in the Pro Report.*');
        inTopPriority = false;
        skipSection = true;
      }
      continue;
    }

    // Skip Secondary and Exploratory sections
    if (line.includes('**2. Secondary Priority') || line.includes('**3. Exploratory Priority')) {
      skipSection = true;
      continue;
    }

    // Resume at Next Steps
    if (line.includes('**Next Steps')) {
      skipSection = false;
      filtered.push('');
      filtered.push('---');
      filtered.push('');
      filtered.push('## 🚀 Unlock Your Complete Implementation Plan');
      filtered.push('');
      filtered.push('Upgrade to the **Pro Report** to unlock:');
      filtered.push('- ✅ Full details for all 3 priority projects');
      filtered.push('- ✅ Detailed business impact analysis');
      filtered.push('- ✅ Step-by-step implementation approach');
      filtered.push('- ✅ Budget estimates for each project');
      filtered.push('- ✅ PDF export for sharing with stakeholders');
      filtered.push('- ✅ Priority consultation scheduling');
      filtered.push('');
      continue;
    }

    if (!skipSection) {
      filtered.push(line);
    }
  }

  return filtered.join('\n');
}

