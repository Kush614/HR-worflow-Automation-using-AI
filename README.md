# HR Document Automation System

Project Demo : https://www.linkedin.com/posts/kush-ise_hr-ai-nextjs-activity-7405343194097410048-ZCgD?utm_source=share&utm_medium=member_desktop&rcm=ACoAAC3fbtQB4rrQT2lG73WgXxHRVxTzBV2xwWk

AI-powered HR document generation and workflow automation built with Next.js (App Router), TypeScript, Prisma, and the Vercel AI SDK. This project helps HR teams rapidly create job descriptions, offer letters, onboarding emails, policies, interview questions, and more — with a Trello-style task board and database persistence.

Table of contents
- Project overview
- Key features
- Architecture & code walkthrough
- Getting started (local)
- Database and Prisma
- Environment variables
- API endpoints (server)
- Frontend (app) overview
- AI integration details
- Email automation (Resend)
- Deployment
- Troubleshooting
- Contributing
- License

---

## Project overview

This repo implements a workflow for HR teams to:
- Create HR tasks (e.g., "Generate offer letter for Senior Engineer")
- Use AI to generate document content for tasks
- Move tasks through To Do → In Progress → Completed
- Persist tasks and generated documents in a Postgres database
- View, download, and email generated documents

It is built on modern web tooling to provide a quick developer experience and production-grade deployment.

---

## Key features

- AI Document Generation (GPT via Vercel AI SDK)
- Trello-style Kanban board for task management (To Do / In Progress / Completed)
- Postgres persistence via Prisma ORM
- Document library for generated HR documents
- Priority tracking (low / medium / high)
- Email delivery via Resend
- Real-time-ish UI updates on task changes
- Fully typed with TypeScript and styled with Tailwind CSS + shadcn/ui components

---

## Architecture & code walkthrough

High-level architecture:
- Frontend: Next.js App Router (React + server components + client components)
- Backend API routes: Next.js app router API route handlers under /app/api or /src/app/api
- Database: PostgreSQL (Neon or any managed Postgres) accessed through Prisma client
- AI: Vercel AI SDK (OpenAI models like GPT-4o-mini)
- Email: Resend for sending generated documents

Important files & directories (what to look for and why):
- app/ (Next.js App Router)
  - app/layout.tsx — Root layout and global providers (theme, auth, etc.)
  - app/page.tsx — Home page; usually renders the task board
  - app/(components)/ — App-specific routes and subpages
- components/
  - TaskBoard.tsx — Renders the Kanban columns and drag/drop interactions
  - TaskCard.tsx — UI for a single task (title, priority, action buttons)
  - DocumentViewer.tsx — Modal/page to view a generated document and download it
  - CreateTaskForm.tsx — Form for creating new HR tasks
- lib/
  - prisma.ts — Exports a single Prisma client instance for server-side use
  - ai.ts — Wrapper/utility to call the Vercel AI SDK or OpenAI (prompts, system messages)
  - resend.ts — Wrapper to send emails through Resend API
- prisma/
  - schema.prisma — Prisma models for Task, Document, and any other entities
  - migrations/ — Auto-generated migrations (after running `prisma migrate`)
- scripts/
  - db-init or similar — SQL or Node scripts to seed or initialize DB tables (called by `npm run db:init`)
- app/api/
  - api/tasks/route.ts (or route handlers in app/api/tasks/...) — Handlers for CRUD operations and `generate` actions
  - api/tasks/[id]/route.ts — Update/delete single task
  - api/tasks/[id]/generate/route.ts — Triggers AI generation for a task
- package.json — Scripts and dependency list
- README.md — This file

Data model summary (typical)
- Task
  - id (uuid)
  - title
  - description
  - type (e.g., job_description, offer_letter)
  - status (todo, in_progress, completed)
  - priority (low, medium, high)
  - createdAt, updatedAt
- Document
  - id
  - taskId (relation)
  - title
  - content (text or markdown)
  - createdAt

---

## How the code works (end-to-end flow)

1. User creates a Task via CreateTaskForm.
2. The frontend posts to `POST /api/tasks` to insert a Task into Postgres via Prisma.
3. User clicks "Generate" on a task. Frontend requests `POST /api/tasks/[id]/generate`.
4. Server API route (route.ts) marks the task status as `in_progress`, then calls the AI wrapper (lib/ai.ts).
5. AI returns generated content, which the route stores as a Document record (linked to Task).
6. The Task status is updated to `completed`. The frontend refreshes the task or receives updated data and shows the generated document.
7. The document can be downloaded or optionally emailed via Resend (lib/resend.ts).

Key code responsibilities:
- lib/prisma.ts: ensure a single Prisma client instance (avoid client duplication in dev/hot reload).
- lib/ai.ts: formats prompts and calls the Vercel AI SDK / OpenAI and returns structured text.
- app/api/...: implement business logic (status transitions, saving documents, validating input).
- components/*: UI and UX (drag/drop, forms, modals). Client components that call API routes.

---

## Getting started (local)

Prerequisites
- Node.js 18+ (as required by Next.js)
- pnpm or npm/yarn
- A PostgreSQL database (Neon, Supabase, or local Postgres)
- Resend account (optional — only for email)
- Vercel account & billing enabled for AI Gateway if using Vercel AI SDK

Clone and install
```bash
git clone https://github.com/Kush614/HR-worflow-Automation-using-AI.git
cd HR-worflow-Automation-using-AI
npm install
```

Environment
```bash
cp .env.example .env.local
# Edit .env.local and add credentials
```

Recommended .env variables (example)
- DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
- RESEND_API_KEY="re_..."
- NEXTAUTH_SECRET="a-random-secret" (if using auth)
- VERCEL_AI_KEY="..." or OPENAI_API_KEY depending on your integration
- NEXT_PUBLIC_APP_URL="http://localhost:3000"

Initialize DB & Prisma
```bash
# If the repo defines a script
npm run db:init

# Or use Prisma directly:
npx prisma migrate dev --name init
npx prisma db seed    # if a seed script exists
```

Run dev server
```bash
npm run dev
# Open http://localhost:3000
```

---

## Database & Prisma notes

- The primary schema is in prisma/schema.prisma. Look for Task and Document models.
- To update models:
  1. Edit prisma/schema.prisma
  2. Run `npx prisma migrate dev --name your-change`
  3. Update TypeScript types with `npx prisma generate` (usually automatic via migrate)
- Use a single Prisma client instance: lib/prisma.ts should export `prisma` and reuse it.

Common prisma.ts pattern:
```ts
import { PrismaClient } from '@prisma/client'
const globalAny: any = global

export const prisma =
  globalAny.prisma ||
  new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalAny.prisma = prisma
```

---

## API endpoints (typical)

- GET /api/tasks — fetch tasks (query params: status, priority, type)
- POST /api/tasks — create a new task (body: title, description, type, priority)
- PATCH /api/tasks/[id] — update basic fields or status
- DELETE /api/tasks/[id] — delete a task and optionally cleanup documents
- POST /api/tasks/[id]/generate — trigger AI to generate a document for this task
- POST /api/documents/[id]/email — send document via email (uses Resend wrapper)

Example POST /api/tasks (request body):
```json
{
  "title": "Offer letter for Senior Engineer",
  "description": "Offer letter for full-time Senior Backend Engineer, 100k/yr",
  "type": "offer_letter",
  "priority": "high"
}
```

Server handlers should:
- Validate permissions (if auth exists)
- Validate input shapes
- Safely update DB using Prisma transactions where multiple writes are involved (e.g., creating document and updating task status)

---

## AI integration details

Where to look:
- lib/ai.ts — responsible for constructing prompts (system + user) and calling the AI model
- API route that calls lib/ai.ts — marks task `in_progress`, calls AI, persists output, updates status

Prompt design suggestions:
- Provide structured system messages: role, tone, examples
- Provide explicit instructions to return outputs in markdown or JSON when you want structured parts (e.g., sections, bullet lists)
- Limit response length if needed

Handling long responses:
- Store document content in a `text` or `mediumtext` column (DB). If very long, consider storing in object storage and saving a URL in DB.

Security and billing:
- Ensure your AI key is kept in server environment variables (never expose to browser).
- If using the Vercel AI Gateway, ensure Vercel billing is active and quota is managed.

---

## Email automation (Resend)

- lib/resend.ts wraps Resend API calls to send generated documents as email attachments or inline content.
- Typical flow: POST /api/documents/[id]/email with recipient and optional subject/body, the route fetches the document content and calls Resend.

Resend notes:
- Use `RESEND_API_KEY` server-side
- Test using a test address (Resend allows test emails)
- Consider storing email logs in DB for auditing

---

## Deployment

Deploy to Vercel (recommended)
- Set required environment variables in the Vercel project settings (DATABASE_URL, RESEND_API_KEY, NEXTAUTH_SECRET, VERCEL_AI_KEY or OPENAI key)
- Ensure Prisma migrations are run (Vercel can run `npx prisma migrate deploy` during build or via a one-off job)
- If using Vercel AI Gateway, enable billing & AI integration in Vercel
- Set the production branch (main) and push

Alternate deployments:
- Any provider supporting Node.js and Postgres. Make sure to run `prisma migrate deploy` on deploy and set env vars.

---

## Troubleshooting

Database connection issues
- Verify `DATABASE_URL` format and credentials
- Check that migrations were applied: `npx prisma migrate status`

AI generation failing
- Ensure server-side AI key is set and valid
- Check logs for rate-limiting or billing issues on Vercel/OpenAI

Email not sending
- Verify `RESEND_API_KEY` and check Resend logs for rejections

Prisma client errors in development
- Ensure `lib/prisma.ts` uses a global cached Prisma client for HMR

---

## Contributing

it took around 2 to 3 hours for the project

---

## Tests & Quality

- Lint: `npm run lint` (ESLint / TypeScript)
- Add unit tests for business logic (AI prompt builders, DB helpers) using your preferred test framework
- Consider integration tests for API routes using a test DB (SQLite or test Postgres instance)

---

## FAQ

Q: Can I use another AI provider?
A: Yes. Replace lib/ai.ts implementation with a client for your provider and keep the same function signatures used by API routes.

Q: How to add new document types?
A: Add the type to front-end UI dropdown, update the prompt builder in lib/ai.ts to handle the new type, and update any validation in server routes.

Q: Is there authentication?
A: If your repo includes auth (NextAuth or similar), configure `NEXTAUTH_SECRET` and identity providers. If not, consider adding access control for production usage.

---

## Appendix — Example prompt (in lib/ai.ts)

System message:
"You are an HR assistant. Produce a professional offer letter for the provided role. Include sections: greeting, role summary, compensation, start date, at-will statement, next steps. Return the response in markdown."

User message:
"Role: Senior Backend Engineer
Salary: $100,000/year
Location: Remote
Start Date: 2026-01-15
Notes: Include relocation assistance clause if remote is not possible."

---

## License

Specify your license here (e.g., MIT). If you want to apply a license, add a LICENSE file.
