# Local Development Setup Guide

Complete guide for setting up the HR Document Automation System on your local machine.

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Neon Account** - [Sign up](https://neon.tech) (Free tier available)
- **Resend Account** - [Sign up](https://resend.com) (100 emails/day free)
- **Vercel Account** - [Sign up](https://vercel.com) (Free, but needs billing for AI)

## Step-by-Step Setup

### 1. Get the Code

**Option A: Clone from GitHub**
\`\`\`bash
git clone <your-repo-url>
cd hr-automation
\`\`\`



### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

This installs all required packages including Next.js, AI SDK, database drivers, and UI components.

### 3. Set Up Neon Database

1. Go to [console.neon.tech](https://console.neon.tech)
2. Click "Create Project"
3. Choose a name (e.g., "hr-automation")
4. Select a region close to you
5. Click "Create Project"
6. Copy the connection string (looks like `postgresql://user:pass@...`)

### 4. Set Up Resend Email

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Sign up or log in
3. Click "Create API Key"
4. Name it "HR Automation"
5. Copy the API key (starts with `re_`)

### 5. Configure Environment Variables

Create a `.env.local` file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` and add your credentials:
\`\`\`env
# Neon Database
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Resend Email
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
\`\`\`

**Important:** 
- Never commit `.env.local` to git
- The `.env.example` file shows what variables are needed without exposing secrets

### 6. Initialize Database

Run the database initialization script:
\`\`\`bash
npm run db:init
\`\`\`

This creates:
- `tasks` table (stores all HR tasks)
- `documents` table (stores AI-generated documents)
- Sample data for testing

You should see:
\`\`\`
✓ Running migration: 01-init-hr-database.sql
✓ Running migration: 02-add-email-field.sql
✓ Database initialized successfully
\`\`\`

### 7. Verify Vercel AI Gateway

The AI Gateway requires Vercel billing to be enabled:

1. Go to [vercel.com/account/billing](https://vercel.com/account/billing)
2. Add a payment method
3. Add at least $5 credit
4. That's it! The AI Gateway will work automatically

**Note:** This project uses very little AI quota. $5 will last for hundreds of document generations.

### 8. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

You should see:
\`\`\`
▲ Next.js 15.0.0
- Local:        http://localhost:3000
- Ready in 2.1s
\`\`\`

### 9. Test the Application

Open http://localhost:3000 in your browser.

**Test Flow:**
1. Click "Create New HR Task"
2. Select "Job Description" 
3. Title: "Senior React Developer"
4. Description: "Need experienced developer for fintech startup"
5. Email: Use `delivered@resend.dev` (for testing)
6. Click "Create Task"
7. Click "Generate" button
8. Watch it progress: To Do → In Progress → Completed
9. Click the completed task to view the AI-generated document
10. Check Resend dashboard to see the email

## Troubleshooting

### Database Issues

**Error: `database "..." does not exist`**
- Your DATABASE_URL might be incorrect
- Double-check the connection string from Neon dashboard

**Error: `relation "tasks" does not exist`**
- Run `npm run db:init` to create tables
- Verify the SQL scripts ran successfully

**Test database connection:**
\`\`\`bash
node -e "const { neon } = require('@neondatabase/serverless'); const sql = neon(process.env.DATABASE_URL); sql\`SELECT NOW()\`.then(r => console.log('✓ Connected:', r[0].now)).catch(e => console.error('✗ Error:', e.message));"
\`\`\`

### AI Generation Issues

**Error: "Verification Required - Add credit card"**
- You need to add billing to your Vercel account
- Go to vercel.com/account/billing
- Add at least $5

**Error: "Model not found"**
- The code uses `openai/gpt-4o-mini`
- This should work by default with AI Gateway
- If issues persist, check Vercel dashboard for AI Gateway status

**Test AI locally:**
\`\`\`bash
node -e "const { generateText } = require('ai'); generateText({ model: 'openai/gpt-4o-mini', prompt: 'Say hello' }).then(r => console.log('✓ AI works:', r.text)).catch(e => console.error('✗ Error:', e.message));"
\`\`\`

### Email Issues

**Emails not arriving:**
- Check your Resend dashboard logs
- Use `delivered@resend.dev` for testing (won't actually send)
- Verify your RESEND_API_KEY is correct
- Free tier: 100 emails/day, 1 email/second

**Error: "API key invalid"**
- Your RESEND_API_KEY might be wrong
- Generate a new key in Resend dashboard
- Make sure there are no spaces or quotes in `.env.local`

### Port Already in Use

**Error: `Port 3000 is already in use`**

Kill the existing process:
\`\`\`bash
npx kill-port 3000
\`\`\`

Or use a different port:
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Module Not Found Errors

**Error: `Cannot find module ...`**
\`\`\`bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

## Project Structure

\`\`\`
hr-automation/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts              # GET/POST tasks
│   │       └── [id]/
│   │           ├── route.ts          # PATCH/DELETE task
│   │           └── generate/
│   │               └── route.ts      # AI generation endpoint
│   ├── page.tsx                      # Main dashboard
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Design system
├── components/
│   ├── hr-task-board.tsx             # Trello-style board
│   ├── create-task-form.tsx          # Task creation modal
│   └── ui/                           # shadcn components
├── lib/
│   ├── db.ts                         # Database client (Neon)
│   ├── hr-documents.ts               # AI document generation logic
│   └── email.ts                      # Resend email service
├── scripts/
│   ├── 01-init-hr-database.sql       # Initial schema
│   ├── 02-add-email-field.sql        # Email field migration
│   └── run-sql.js                    # Database init script
├── .env.local                        # Your secrets (not in git)
├── .env.example                      # Template for env vars
└── package.json                      # Dependencies
\`\`\`

## Development Workflow

### Making Changes

1. **Edit code** in your editor
2. **See changes live** - Next.js auto-reloads
3. **Check console** - Look for `[v0]` debug logs
4. **Test in browser** - Verify functionality

### Adding New Features

1. Create new component in `components/`
2. Add API route in `app/api/` if needed
3. Update database schema in `scripts/` if needed
4. Commit with clear message

### Database Changes

If you modify the database schema:

1. Create new SQL file: `scripts/03-your-change.sql`
2. Run: `npm run db:init`
3. Commit both code and SQL file

## Tips for Demo Video

### Recording Setup
- Use QuickTime (Mac) or OBS Studio (Windows/Mac/Linux)
- Record in 1080p for clarity
- Show both browser and code side-by-side

### Demo Script
1. **Show the empty board** (0:00-0:10)
2. **Create a task** (0:10-0:30)
   - Click "Create New HR Task"
   - Select "Offer Letter"
   - Fill in realistic details
3. **Generate document** (0:30-1:00)
   - Click "Generate"
   - Point out the status changes
   - Watch AI work in real-time
4. **Show result** (1:00-1:30)
   - Click completed task
   - Display the professional document
   - Check email inbox
5. **Show code** (1:30-2:30)
   - Open `lib/hr-documents.ts` - AI logic
   - Open `components/hr-task-board.tsx` - UI
   - Open `app/api/tasks/[id]/generate/route.ts` - API

### Key Points to Mention
- "Built with AI SDK for structured output"
- "Uses Neon Postgres for persistence"
- "Automatic email delivery via Resend"
- "Trello-style workflow matches Robosource's product"

## Deployment to Vercel

Ready to deploy?

\`\`\`bash
npm run build          # Test production build
vercel                 # Deploy to Vercel
\`\`\`

Vercel will automatically:
- Detect Next.js
- Set up environment variables (you'll need to add them)
- Deploy with AI Gateway pre-configured

## Getting Help

**Resources:**
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel AI SDK Docs](https://sdk.vercel.ai)
- [Neon Docs](https://neon.tech/docs)
- [Resend Docs](https://resend.com/docs)

**Common Issues:**
- Check the Troubleshooting section above
- Review the main README.md
- Look at code comments for implementation details

---

**Ready to impress Robosource!** 🚀
