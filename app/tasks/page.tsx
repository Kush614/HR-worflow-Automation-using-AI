"use client"

import { useState } from "react"
import { TaskBreakdownForm } from "@/components/task-breakdown-form"
import { TaskBreakdownDisplay, type TaskBreakdown } from "@/components/task-breakdown-display"

export default function TasksPage() {
  const [breakdowns, setBreakdowns] = useState<TaskBreakdown[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (goal: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate tasks")
      }

      const { tasks } = await response.json()

      const newBreakdown: TaskBreakdown = {
        id: Date.now().toString(),
        goal,
        tasks: tasks.map((task, index) => ({
          ...task,
          id: `${Date.now()}-${index}`,
          completed: false,
        })),
        createdAt: new Date(),
      }

      setBreakdowns((prev) => [newBreakdown, ...prev])
    } catch (error) {
      console.error("Failed to generate tasks:", error)
      alert("Failed to generate tasks. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = (id: string) => {
    setBreakdowns((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">AI Task Breakdown</h1>
          <p className="text-muted-foreground">Describe your goal and let AI break it down into actionable tasks</p>
        </div>

        {/* Form */}
        <TaskBreakdownForm onGenerate={handleGenerate} isGenerating={isGenerating} />

        {/* Results */}
        {breakdowns.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Your Task Breakdowns</h2>
            {breakdowns.map((breakdown) => (
              <TaskBreakdownDisplay key={breakdown.id} breakdown={breakdown} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {breakdowns.length === 0 && !isGenerating && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No task breakdowns yet. Describe a goal above to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
