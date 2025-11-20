"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Download, Trash2, PlayCircle } from "lucide-react"
import { TaskExecutionModal } from "./task-execution-modal"

export interface Task {
  id: string
  title: string
  description: string
  estimatedTime?: string
  priority?: "high" | "medium" | "low"
  completed: boolean
}

export interface TaskBreakdown {
  id: string
  goal: string
  tasks: Task[]
  createdAt: Date
}

interface TaskBreakdownDisplayProps {
  breakdown: TaskBreakdown
  onDelete?: (id: string) => void
}

export function TaskBreakdownDisplay({ breakdown, onDelete }: TaskBreakdownDisplayProps) {
  const [tasks, setTasks] = useState(breakdown.tasks)
  const [executingTask, setExecutingTask] = useState<Task | null>(null)

  const toggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleExecutionComplete = (taskId: string) => {
    toggleTask(taskId)
    setExecutingTask(null)
  }

  const exportTasks = () => {
    const text = `# ${breakdown.goal}\n\n${tasks
      .map((task, i) => `${i + 1}. [${task.completed ? "x" : " "}] ${task.title}\n   ${task.description}`)
      .join("\n\n")}`

    const blob = new Blob([text], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tasks-${breakdown.id}.md`
    a.click()
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <>
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold leading-tight">{breakdown.goal}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportTasks}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              {onDelete && (
                <Button variant="outline" size="sm" onClick={() => onDelete(breakdown.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {tasks.filter((t) => t.completed).length} of {tasks.length} completed
              </span>
              <span>{Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="flex gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="pt-0.5">
                <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} id={`task-${task.id}`} />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium cursor-pointer ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {index + 1}. {task.title}
                  </label>
                  <div className="flex items-center gap-2">
                    {!task.completed && (
                      <Button variant="ghost" size="sm" onClick={() => setExecutingTask(task)} className="h-7 px-2">
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Execute
                      </Button>
                    )}
                    {task.priority && (
                      <span className={`text-xs font-medium uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                </div>

                <p className={`text-sm ${task.completed ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                  {task.description}
                </p>

                {task.estimatedTime && (
                  <p className="text-xs text-muted-foreground">Estimated time: {task.estimatedTime}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {executingTask && (
        <TaskExecutionModal
          isOpen={!!executingTask}
          onClose={() => setExecutingTask(null)}
          taskTitle={executingTask.title}
          taskDescription={executingTask.description}
          onComplete={() => handleExecutionComplete(executingTask.id)}
        />
      )}
    </>
  )
}
