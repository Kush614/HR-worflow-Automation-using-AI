"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, Trash2, Play, CheckCircle2, Clock, AlertCircle, X } from "lucide-react"
import { HR_TASK_LABELS } from "@/lib/hr-documents"

interface Document {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
}

interface Task {
  id: string
  title: string
  description: string
  type: string
  status: string
  priority: string
  createdAt: string
  documents: Document[]
}

const STATUS_COLUMNS = [
  {
    id: "todo",
    label: "To Do",
    icon: AlertCircle,
    color: "bg-slate-50 border-slate-200",
    badgeColor: "bg-slate-100 text-slate-700",
  },
  {
    id: "in_progress",
    label: "In Progress",
    icon: Clock,
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle2,
    color: "bg-emerald-50 border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
]

const PRIORITY_COLORS = {
  low: "bg-gray-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
}

export function HRTaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingTaskId, setGeneratingTaskId] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("[v0] Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleGenerateDocument = async (taskId: string) => {
    setGeneratingTaskId(taskId)
    try {
      const response = await fetch(`/api/tasks/${taskId}/generate`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to generate document")

      await fetchTasks()
    } catch (error) {
      console.error("[v0] Error generating document:", error)
      alert("Failed to generate document. Please try again.")
    } finally {
      setGeneratingTaskId(null)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })
      await fetchTasks()
    } catch (error) {
      console.error("[v0] Error deleting task:", error)
    }
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUS_COLUMNS.map((column) => {
          const Icon = column.icon
          const columnTasks = getTasksByStatus(column.id)

          return (
            <div key={column.id} className="space-y-4">
              <Card className={`${column.color} border-2`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold text-lg leading-none">{column.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {columnTasks.length} {columnTasks.length === 1 ? "task" : "tasks"}
                        </p>
                      </div>
                    </div>
                    <Badge className={column.badgeColor} variant="secondary">
                      {columnTasks.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base leading-tight line-clamp-2">{task.title}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-2 text-sm">{task.description}</CardDescription>
                        </div>
                        <Badge
                          className={`${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]} text-white shrink-0 text-xs`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {HR_TASK_LABELS[task.type as keyof typeof HR_TASK_LABELS]}
                        </Badge>
                        {task.documents.length > 0 && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <FileText className="w-3 h-3" />
                            {task.documents.length} doc{task.documents.length !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>

                      {task.documents.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t">
                          {task.documents.map((doc) => (
                            <Button
                              key={doc.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left h-auto py-2 hover:bg-blue-50"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <FileText className="w-4 h-4 mr-2 shrink-0 text-blue-600" />
                              <span className="truncate text-sm">{doc.title}</span>
                            </Button>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {task.status === "todo" && (
                          <Button
                            size="sm"
                            className="flex-1 shadow-sm"
                            onClick={() => handleGenerateDocument(task.id)}
                            disabled={generatingTaskId === task.id}
                          >
                            {generatingTaskId === task.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Generate
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnTasks.length === 0 && (
                  <Card className="border-2 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                      <Icon className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-sm">No tasks yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedDocument && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedDocument(null)}
        >
          <Card
            className="w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b bg-slate-50 sticky top-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl leading-tight">{selectedDocument.title}</CardTitle>
                  <CardDescription>
                    Generated on {new Date(selectedDocument.createdAt).toLocaleDateString()} at{" "}
                    {new Date(selectedDocument.createdAt).toLocaleTimeString()}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDocument(null)}
                  className="shrink-0 hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[calc(85vh-120px)] p-8">
              <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed">
                {selectedDocument.content}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
