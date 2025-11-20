import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { status } = body

    console.log("[v0] Updating task status:", params.id, status)

    const tasks = await sql`
      UPDATE tasks
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Fetch documents for this task
    const documents = await sql`
      SELECT * FROM documents WHERE task_id = ${params.id}
    `

    return NextResponse.json({
      ...tasks[0],
      documents,
    })
  } catch (error) {
    console.error("[v0] Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Deleting task:", params.id)

    await sql`
      DELETE FROM tasks WHERE id = ${params.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
