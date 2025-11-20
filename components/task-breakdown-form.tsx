"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface TaskBreakdownFormProps {
  onGenerate: (goal: string) => Promise<void>
  isGenerating: boolean
}

export function TaskBreakdownForm({ onGenerate, isGenerating }: TaskBreakdownFormProps) {
  const [goal, setGoal] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal.trim() || isGenerating) return

    await onGenerate(goal)
    setGoal("")
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium mb-2">
            Describe your goal or project
          </label>
          <Textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Example: Launch a new employee onboarding program for our startup"
            className="min-h-[120px] resize-none"
            disabled={isGenerating}
          />
        </div>
        <Button type="submit" disabled={!goal.trim() || isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Tasks...
            </>
          ) : (
            "Break Down Into Tasks"
          )}
        </Button>
      </form>
    </Card>
  )
}
