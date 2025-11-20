-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on tasks
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_task
    FOREIGN KEY(task_id) 
    REFERENCES tasks(id)
    ON DELETE CASCADE
);

-- Create index on documents
CREATE INDEX IF NOT EXISTS idx_documents_task_id ON documents(task_id);

-- Insert some sample data for testing
INSERT INTO tasks (id, title, description, type, status, priority, created_at, updated_at)
VALUES 
  (gen_random_uuid()::text, 'Senior Software Engineer JD', 'Create a job description for a senior software engineer position focusing on full-stack development with React and Node.js', 'job_description', 'todo', 'high', NOW(), NOW()),
  (gen_random_uuid()::text, 'New Hire Onboarding Email', 'Draft a welcome email for new engineering hires covering first day logistics', 'onboarding_email', 'todo', 'medium', NOW(), NOW())
ON CONFLICT DO NOTHING;
