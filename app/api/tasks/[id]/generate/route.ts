import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { generateHRDocument } from "@/lib/hr-documents"
import { sendDocumentEmail } from "@/lib/email"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Generating document for task:", params.id)

    const tasks = await sql`
      SELECT * FROM tasks WHERE id = ${params.id}
    `

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const task = tasks[0]

    // Update task status to in_progress
    await sql`
      UPDATE tasks
      SET status = 'in_progress', updated_at = NOW()
      WHERE id = ${params.id}
    `

    // Generate the HR document using AI
    const document = await generateHRDocument({
      type: task.type as any,
      description: task.description,
    })

    console.log("[v0] Document generated:", document.title)

    // Save the generated document to the database
    const savedDocuments = await sql`
      INSERT INTO documents (id, task_id, title, content, type, created_at)
      VALUES (
        gen_random_uuid()::text,
        ${task.id},
        ${document.title},
        ${document.content},
        ${task.type},
        NOW()
      )
      RETURNING *
    `

    const savedDocument = savedDocuments[0]

    // Update task status to completed
    await sql`
      UPDATE tasks
      SET status = 'completed', updated_at = NOW()
      WHERE id = ${params.id}
    `

    if (task.recipient_email) {
      console.log("[v0] Sending email to:", task.recipient_email)
      const emailSent = await sendDocumentEmail({
        to: task.recipient_email,
        subject: `HR Document Ready: ${document.title}`,
        documentTitle: document.title,
        documentContent: document.content,
        taskTitle: task.title,
      })

      if (emailSent) {
        console.log("[v0] Email sent successfully")
      } else {
        console.log("[v0] Email sending failed (non-blocking)")
      }
    }

    // Fetch updated task with documents
    const updatedTasks = await sql`
      SELECT * FROM tasks WHERE id = ${params.id}
    `

    const documents = await sql`
      SELECT * FROM documents WHERE task_id = ${params.id}
    `

    return NextResponse.json({
      task: {
        ...updatedTasks[0],
        documents,
      },
      document: savedDocument,
    })
  } catch (error) {
    console.error("[v0] Error generating document:", error)

    // Update task status back to todo on error
    await sql`
      UPDATE tasks
      SET status = 'todo', updated_at = NOW()
      WHERE id = ${params.id}
    `

    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 })
  }
}
