# HR Document Automation System

**Built from:** Next.js 15 App Router starter template  
**Starter Template:** https://vercel.com/templates/next.js/nextjs-boilerplate

AI-powered HR document generation with automated workflows and task management.

## Features

- **AI Document Generation**: Automatically generate job descriptions, offer letters, onboarding emails, policies, interview questions, and more
- **Trello-Style Task Board**: Visual kanban board with To Do, In Progress, and Completed columns
- **Database Persistence**: All tasks and documents saved to Postgres via Prisma
- **Real-time Updates**: Instant UI updates when tasks are created or documents generated
- **Priority Management**: Track task priority (low, medium, high)
- **Document Library**: View and download generated HR documents

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Starter**: Next.js boilerplate with TypeScript and Tailwind CSS
- **AI**: Vercel AI SDK with OpenAI GPT-4o-mini
- **Database**: Neon Postgres with Prisma ORM
- **UI**: Shadcn/ui components with Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Neon Postgres database
- A Resend account (for email functionality)
- Vercel account with billing enabled (for AI Gateway)

### Local Development Setup

1. **Clone the repository**:
   \`\`\`bash
   git clone <your-repo-url>
   cd hr-automation
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your credentials to `.env.local`:
   \`\`\`env
   DATABASE_URL="postgresql://..."      # From Neon dashboard
   RESEND_API_KEY="re_..."             # From Resend dashboard
   \`\`\`

4. **Initialize the database**:
   \`\`\`bash
   npm run db:init
   \`\`\`
   
   This runs the SQL migration scripts to create the necessary tables.

5. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open the app**: Navigate to [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, troubleshooting, and configuration options, see [LOCAL_SETUP.md](./LOCAL_SETUP.md).

## How It Works

1. **Create a Task**: Click "Create New HR Task" and select the document type
2. **AI Generation**: Click "Generate" on any To Do task
3. **Automatic Processing**: The task moves to "In Progress" while AI generates the document
4. **Completion**: Once done, the task moves to "Completed" with the generated document
5. **View Documents**: Click on any document to view the full content

## Document Types

- Job Descriptions
- Offer Letters
- Onboarding Emails
- Company Policies
- Interview Questions
- Performance Reviews
- Termination Letters

## Database Schema

**Tasks Table**:
- id, title, description, type, status, priority, timestamps

**Documents Table**:
- id, taskId, title, content, type, timestamp

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/[id]` - Update task status
- `DELETE /api/tasks/[id]` - Delete task
- `POST /api/tasks/[id]/generate` - Generate document for task

## Environment Variables

Required environment variables:

- `DATABASE_URL` - Your Neon Postgres connection string
- `RESEND_API_KEY` - Your Resend API key for sending emails

See `.env.example` for the complete list.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run db:init` - Initialize database tables
- `npm run lint` - Run ESLint

## Troubleshooting

**Database connection issues?**
- Verify your `DATABASE_URL` is correct in `.env.local`
- Run `npm run db:init` to ensure tables exist

**AI generation not working?**
- Ensure you have billing enabled on your Vercel account
- Minimum $5 credit required for AI Gateway

**Email not sending?**
- Verify your `RESEND_API_KEY` in `.env.local`
- Use `delivered@resend.dev` for testing (visible in Resend dashboard)

For more detailed troubleshooting, see [LOCAL_SETUP.md](./LOCAL_SETUP.md).

## Project Development

This project started from the [Next.js App Router starter template](https://vercel.com/templates/next.js/nextjs-boilerplate) and added:
- Neon Postgres database integration with SQL queries
- Vercel AI SDK for document generation
- Resend email service for automated delivery
- Custom HR workflow automation features
- Trello-style task board UI




