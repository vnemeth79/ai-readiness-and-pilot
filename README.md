# AI Readiness Assessment Tool

**By Minerva Consultores | Powered by Agentize.eu**

A conversational AI-powered tool that helps businesses identify and prioritize AI pilot projects through a structured 14-question assessment.

![Minerva Consultores](https://img.shields.io/badge/Minerva-Consultores-C41E3A?style=for-the-badge)
![Powered by Agentize.eu](https://img.shields.io/badge/Powered%20by-Agentize.eu-333?style=for-the-badge)

## 🚀 Features

- **Conversational Assessment**: 14 strategic questions delivered through an AI consultant
- **Multi-dimensional Analysis**: Evaluates 6 key dimensions of AI readiness
- **Personalized Recommendations**: 3 prioritized AI pilot project recommendations
- **Professional Reports**: Detailed Markdown reports with scores and insights
- **Freemium Model**: Free basic report with Pro upgrade for full details
- **Modern UI**: Beautiful, responsive interface with Minerva Consultores branding

## 📋 Assessment Dimensions

1. **Business Pain Points & Opportunities** (1-5)
2. **Data Readiness** (1-5)
3. **Organizational Readiness** (1-5)
4. **Process Maturity** (1-5)
5. **Strategic Priorities** (1-5)
6. **AI Strategic Intent** (Experimentation / Tool Adoption / Strategic Transformation)

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **AI**: OpenAI GPT-4.1-mini
- **Styling**: Custom Minerva red-black theme

## 📁 Project Structure

```
ai-readiness-survey/
├── docs/                    # Documentation and prompts
├── packages/
│   ├── backend/            # Express API server
│   │   ├── src/
│   │   │   ├── index.ts    # Main server
│   │   │   ├── lib/        # OpenAI, sessions
│   │   │   └── routes/     # API endpoints
│   │   └── package.json
│   └── frontend/           # React application
│       ├── src/
│       │   ├── components/ # UI components
│       │   ├── hooks/      # Custom hooks
│       │   └── types/      # TypeScript types
│       └── package.json
├── package.json            # Root workspace
└── pnpm-workspace.yaml
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- OpenAI API key

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd ai-readiness-survey
   pnpm install
   ```

2. **Configure environment variables**:
   
   Create `packages/backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   PORT=4000
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start development servers**:
   ```bash
   pnpm dev
   ```

   This starts:
   - Backend: http://localhost:4000
   - Frontend: http://localhost:5173

### Production Build

```bash
pnpm build
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assessment/start` | Start assessment with client info |
| POST | `/api/chat` | Send message (streaming) |
| POST | `/api/chat/sync` | Send message (non-streaming) |
| POST | `/api/report/generate` | Generate report |
| GET | `/api/report/:sessionId` | Get report |
| POST | `/api/assessment/:sessionId/upgrade` | Upgrade to Pro |
| GET | `/api/assessment/:sessionId` | Get assessment status |
| GET | `/api/assessment` | List all assessments |
| DELETE | `/api/assessment/:sessionId` | Delete assessment |

## 🎨 Branding

The application uses **Minerva Consultores** branding:
- Primary color: `#C41E3A` (Minerva Red)
- Background: Black/Charcoal gradients
- Font: Inter (sans), Playfair Display (display)

**"Powered by Agentize.eu"** appears in the footer of all pages.

## 📄 License

Proprietary - Minerva Consultores

---

**Built with ❤️ by Minerva Consultores | Powered by Agentize.eu**

