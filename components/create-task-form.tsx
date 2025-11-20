"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HR_TASK_LABELS } from "@/lib/hr-documents"
import { Plus, Sparkles } from "lucide-react"

interface CreateTaskFormProps {
  onTaskCreated: () => void
}

export function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    priority: "medium",
    recipient_email: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create task")

      setFormData({ title: "", description: "", type: "", priority: "medium", recipient_email: "" })
      setOpen(false)
      onTaskCreated()
    } catch (error) {
      console.error("[v0] Error creating task:", error)
      alert("Failed to create task. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="lg" className="w-full md:w-auto shadow-lg">
        <Plus className="w-5 h-5 mr-2" />
        Create New Task
      </Button>
    )
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">Create New Task</CardTitle>
            <CardDescription className="text-base">
              AI will automatically generate professional HR documents
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Document Type *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger id="type" className="h-11">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(HR_TASK_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="priority" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Senior Software Engineer Job Description"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Provide context and details for the AI to generate an accurate document..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">Be specific to get better AI-generated results</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Recipient Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., hiring@company.com"
              value={formData.recipient_email}
              onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Document will be automatically emailed after generation
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 h-11 shadow-sm">
              {loading ? "Creating Task..." : "Create Task"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="h-11">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
