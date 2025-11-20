import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Fetching tasks from database")

    // Fetch all tasks with their documents
    const tasks = await sql`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', d.id,
              'taskId', d.task_id,
              'title', d.title,
              'content', d.content,
              'type', d.type,
              'createdAt', d.created_at
            )
          ) FILTER (WHERE d.id IS NOT NULL),
          '[]'
        ) as documents
      FROM tasks t
      LEFT JOIN documents d ON d.task_id = t.id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `

    console.log("[v0] Fetched tasks:", tasks.length)
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("[v0] Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, type, priority = "medium", recipient_email } = body

    console.log("[v0] Creating task:", { title, type, priority, recipient_email })

    if (!title || !description || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const tasks = await sql`
      INSERT INTO tasks (id, title, description, type, status, priority, recipient_email, created_at, updated_at)
      VALUES (
        gen_random_uuid()::text,
        ${title},
        ${description},
        ${type},
        'todo',
        ${priority},
        ${recipient_email || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    const task = tasks[0]
    console.log("[v0] Task created:", task.id)

    // Return task with empty documents array
    return NextResponse.json({
      ...task,
      documents: [],
    })
  } catch (error) {
    console.error("[v0] Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
