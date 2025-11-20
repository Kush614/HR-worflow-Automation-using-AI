"use client"

import { useState } from "react"
import { HRTaskBoard } from "@/components/hr-task-board"
import { CreateTaskForm } from "@/components/create-task-form"
import { Sparkles, Zap, Shield } from "lucide-react"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-balance">HR Document Automation</h1>
              <p className="text-muted-foreground text-pretty">Generate professional HR documents with AI in seconds</p>
            </div>

            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-muted-foreground">AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-muted-foreground">Instant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-muted-foreground">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="max-w-4xl">
            <CreateTaskForm onTaskCreated={handleTaskCreated} />
          </div>

          <div key={refreshKey}>
            <HRTaskBoard />
          </div>
        </div>
      </div>
    </div>
  )
}
