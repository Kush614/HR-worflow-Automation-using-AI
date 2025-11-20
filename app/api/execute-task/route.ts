import { executeTask } from "@/lib/ai/task-execution"

export async function POST(req: Request) {
  try {
    console.log("[v0] API route: execute-task called")
    const { taskTitle, taskDescription } = await req.json()

    console.log("[v0] API route: Received data:", { taskTitle, taskDescription })

    if (!taskTitle || !taskDescription) {
      console.error("[v0] API route: Missing required fields")
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("[v0] API route: Calling executeTask")
    const result = await executeTask(taskTitle, taskDescription)

    console.log("[v0] API route: Got result, returning stream")
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] API route: Task execution error:", error)
    return new Response(JSON.stringify({ error: "Failed to execute task" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
