# Email Setup Guide

This HR system uses [Resend](https://resend.com) to send generated documents via email.

## Setup Steps

### 1. Create a Resend Account
- Go to [resend.com](https://resend.com)
- Sign up for a free account (100 emails/day free tier)

### 2. Get Your API Key
- Go to [API Keys](https://resend.com/api-keys)
- Click "Create API Key"
- Copy your API key

### 3. Add API Key to Environment
Add your Resend API key to `.env.local`:
\`\`\`
RESEND_API_KEY=re_your_actual_api_key_here
\`\`\`

### 4. Restart Your Dev Server
\`\`\`bash
npm run dev
\`\`\`

## Testing Email Delivery

### Using Test Email (Development)
For testing, Resend provides a special email address:
- Send to: `delivered@resend.dev`
- You can view sent emails in your Resend dashboard

### Using Your Own Email (Production)
To send to real email addresses:
1. Verify your domain in Resend dashboard
2. Update the `from` field in `lib/email.ts`:
   \`\`\`typescript
   from: 'HR System <noreply@yourdomain.com>'
   \`\`\`

## How It Works

When you create a task with a recipient email:
1. Enter the recipient email in the task form
2. Click "Create Task"
3. Click "Generate" to create the document
4. The system automatically sends the document via email
5. Check your inbox (or Resend dashboard for test emails)

## Troubleshooting

### Email Not Sending
- Check console logs for errors
- Verify RESEND_API_KEY is set correctly
- Check Resend dashboard for delivery status
- Make sure you've restarted the dev server

### Using Test Mode
For assessment purposes, use `delivered@resend.dev` as the recipient email to avoid sending to real addresses.
