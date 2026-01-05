import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { chatRouter } from '../src/routes/chat.js';
import { reportRouter } from '../src/routes/report.js';
import { assessmentRouter } from '../src/routes/assessment.js';

config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://aireadinessandpilotfrontend.vercel.app',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/report', reportRouter);
app.use('/api/assessment', assessmentRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

export default app;

