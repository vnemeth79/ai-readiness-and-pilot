# Deployment Guide - AI Readiness Assessment

## Prerequisites
- GitHub account
- Supabase account
- Vercel account
- OpenAI API key

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ai-readiness-survey`
3. Set to Private (or Public)
4. Click "Create repository"
5. Push the code:

```bash
cd C:\Users\nemet\ai-readiness-survey
git remote add origin https://github.com/YOUR_USERNAME/ai-readiness-survey.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Supabase Database

1. Go to https://supabase.com and create a new project
2. Project name: `ai-readiness`
3. Choose a strong database password
4. Select your region (closest to your users)
5. Wait for the project to be created (~2 minutes)

### Run Database Migration

1. Go to **SQL Editor** in Supabase
2. Copy and paste the contents of `packages/backend/supabase/migrations/001_initial_schema.sql`
3. Click **Run** to create all tables

### Get Supabase Credentials

Go to **Settings > API** and copy:
- **Project URL** → `SUPABASE_URL`
- **service_role key** (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 3: Deploy Backend to Vercel

1. Go to https://vercel.com/new
2. Import from GitHub → Select `ai-readiness-survey`
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `packages/backend`
   - **Build Command**: `npm run build` (or leave empty)
   - **Output Directory**: Leave empty
   
4. Add Environment Variables:
   | Name | Value |
   |------|-------|
   | `OPENAI_API_KEY` | sk-your-openai-key |
   | `SUPABASE_URL` | https://xxx.supabase.co |
   | `SUPABASE_SERVICE_ROLE_KEY` | eyJ... |
   | `FRONTEND_URL` | https://ai-readiness.vercel.app |

5. Click **Deploy**
6. Note the deployment URL (e.g., `https://ai-readiness-api.vercel.app`)

---

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com/new again
2. Import from GitHub → Select `ai-readiness-survey`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `packages/frontend`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`

4. Add Environment Variables:
   | Name | Value |
   |------|-------|
   | `VITE_API_BASE_URL` | https://ai-readiness-api.vercel.app |

5. Click **Deploy**

---

## Step 5: Update Frontend vercel.json

After backend is deployed, update `packages/frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-BACKEND-URL.vercel.app/api/:path*"
    }
  ]
}
```

Commit and push:
```bash
git add .
git commit -m "Update API rewrite URL"
git push
```

---

## Step 6: Test the Deployment

1. Open your frontend URL (e.g., https://ai-readiness.vercel.app)
2. Complete the welcome screen
3. Fill in client info
4. Answer the assessment questions
5. View the generated report

---

## Environment Variables Summary

### Backend
| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (sk-...) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `FRONTEND_URL` | Frontend deployment URL (for CORS) |
| `PORT` | Server port (default: 4000, Vercel auto-sets) |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that the frontend is accessing the correct API URL

### OpenAI Errors
- Verify your API key is valid
- Check your OpenAI account has credits

### Database Errors
- Ensure the migration SQL was run successfully
- Check Supabase logs for detailed errors

---

## Custom Domain (Optional)

1. In Vercel, go to your project settings
2. Go to **Domains**
3. Add your custom domain (e.g., `ai.minerva-consultores.com`)
4. Update DNS records as instructed

---

**Built with ❤️ by Minerva Consultores | Powered by Agentize.eu**

