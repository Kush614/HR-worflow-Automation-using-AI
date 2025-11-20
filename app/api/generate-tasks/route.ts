import { generateTaskBreakdown } from "@/lib/ai/task-breakdown"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { goal } = await request.json()

    if (!goal || typeof goal !== "string") {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 })
    }

    const tasks = await generateTaskBreakdown(goal)

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("[v0] Error generating tasks:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate tasks" },
      { status: 500 },
    )
  }
}
