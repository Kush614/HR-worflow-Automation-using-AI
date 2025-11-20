import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export interface Task {
  id: string
  title: string
  description: string
  type: string
  status: string
  priority: string
  recipient_email: string | null
  created_at: Date
  updated_at: Date
}

export interface Document {
  id: string
  task_id: string
  title: string
  content: string
  type: string
  created_at: Date
}
