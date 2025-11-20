-- Add email column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS recipient_email TEXT;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_tasks_email ON tasks(recipient_email);
