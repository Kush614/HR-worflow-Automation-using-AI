import { generateObject } from "ai"
import { z } from "zod"

const taskSchema = z.object({
  title: z.string().describe("Clear, actionable task title"),
  description: z.string().describe("Detailed description of what needs to be done"),
  estimatedTime: z.string().describe('Estimated time to complete (e.g., "2 hours", "1 day")'),
  priority: z.enum(["high", "medium", "low"]).describe("Task priority level"),
})

const taskBreakdownSchema = z.object({
  tasks: z.array(taskSchema).describe("List of 5-8 actionable tasks broken down from the goal"),
})

export async function generateTaskBreakdown(goal: string) {
  const { object } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: taskBreakdownSchema,
    prompt: `You are a business process expert. Break down the following goal into 5-8 clear, actionable tasks.

Goal: ${goal}

Requirements:
- Create specific, actionable tasks (not vague)
- Order tasks logically (dependencies first)
- Include realistic time estimates
- Assign appropriate priorities
- Focus on what would actually need to be done to achieve this goal

Be practical and business-focused.`,
  })

  return object.tasks
}
