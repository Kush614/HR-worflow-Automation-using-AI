"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, CheckCircle2, Play } from "lucide-react"

interface TaskExecutionModalProps {
  isOpen: boolean
  onClose: () => void
  taskTitle: string
  taskDescription: string
  onComplete?: () => void
}

export function TaskExecutionModal({
  isOpen,
  onClose,
  taskTitle,
  taskDescription,
  onComplete,
}: TaskExecutionModalProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionComplete, setExecutionComplete] = useState(false)
  const [executionSteps, setExecutionSteps] = useState<string>("")

  const startExecution = async () => {
    console.log("[v0] Starting task execution:", { taskTitle, taskDescription })
    setIsExecuting(true)
    setExecutionComplete(false)
    setExecutionSteps("")

    try {
      console.log("[v0] Fetching /api/execute-task")
      const response = await fetch("/api/execute-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskTitle,
          taskDescription,
        }),
      })

      console.log("[v0] Response status:", response.status, response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Error response:", errorText)
        throw new Error("Failed to execute task")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      console.log("[v0] Starting to read stream, reader exists:", !!reader)

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          console.log("[v0] Stream chunk received, done:", done, "value length:", value?.length)

          if (done) {
            console.log("[v0] Stream complete")
            break
          }

          const chunk = decoder.decode(value)
          console.log("[v0] Decoded chunk:", chunk.substring(0, 100))
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              const text = line.slice(2).replace(/^"(.*)"$/, "$1")
              console.log("[v0] Adding text to steps:", text.substring(0, 50))
              setExecutionSteps((prev) => prev + text)
            }
          }
        }
      }

      console.log("[v0] Execution complete")
      setExecutionComplete(true)
    } catch (error) {
      console.error("[v0] Execution error:", error)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleClose = () => {
    if (executionComplete && onComplete) {
      onComplete()
    }
    onClose()
    setExecutionSteps("")
    setIsExecuting(false)
    setExecutionComplete(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isExecuting && <Loader2 className="h-5 w-5 animate-spin" />}
            {executionComplete && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            Task Execution
          </DialogTitle>
          <DialogDescription>AI-powered task automation in progress</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Info */}
          <div className="p-4 rounded-lg bg-muted">
            <h4 className="font-medium mb-1">{taskTitle}</h4>
            <p className="text-sm text-muted-foreground">{taskDescription}</p>
          </div>

          {/* Execution Steps */}
          <ScrollArea className="h-[300px] w-full rounded-lg border p-4">
            {!isExecuting && !executionComplete && !executionSteps && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Play className="h-12 w-12 mb-4 opacity-50" />
                <p>Ready to execute task</p>
                <p className="text-sm">Click "Start Execution" to begin</p>
              </div>
            )}

            {executionSteps && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm">{executionSteps}</div>
              </div>
            )}

            {isExecuting && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Executing task steps...</span>
              </div>
            )}
          </ScrollArea>

          {/* Status */}
          {executionComplete && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Task execution completed successfully</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            {!isExecuting && !executionComplete && (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={startExecution}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Execution
                </Button>
              </>
            )}

            {executionComplete && (
              <Button onClick={handleClose} className="w-full">
                Complete & Mark Task Done
              </Button>
            )}

            {isExecuting && (
              <Button variant="outline" disabled>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Executing...
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
