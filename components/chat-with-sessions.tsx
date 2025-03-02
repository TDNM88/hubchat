"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, MessageSquare } from "lucide-react"
import { nanoid } from "nanoid"

import { Button } from "@/components/ui/button"
import { Chat } from "@/components/chat"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export type ChatSession = {
  id: string
  name: string
  model: string
  temperature: number
  maxTokens: number
  createdAt: Date
}

export function ChatWithSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (sessions.length === 0) {
      const defaultSession: ChatSession = {
        id: nanoid(),
        name: "Cuộc trò chuyện mới",
        model: "llama3-70b-8192",
        temperature: 0.7,
        maxTokens: 4096,
        createdAt: new Date(),
      }
      setSessions([defaultSession])
      setActiveSessionId(defaultSession.id)
    }
  }, [sessions.length]) // Added sessions.length as a dependency

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: nanoid(),
      name: `Cuộc trò chuyện mới ${sessions.length + 1}`,
      model: "llama3-70b-8192",
      temperature: 0.7,
      maxTokens: 4096,
      createdAt: new Date(),
    }
    setSessions((prevSessions) => [...prevSessions, newSession])
    setActiveSessionId(newSession.id)
  }, [sessions.length])

  const updateSession = useCallback((sessionId: string, updates: Partial<ChatSession>) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => (session.id === sessionId ? { ...session, ...updates } : session)),
    )
  }, [])

  const handleSettingsChange = useCallback(
    (sessionId: string, model: string, temperature: number, maxTokens: number) => {
      updateSession(sessionId, { model, temperature, maxTokens })
    },
    [updateSession],
  )

  const activeSession = sessions.find((session) => session.id === activeSessionId)

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/40">
          <div className="flex h-14 items-center justify-between px-4 border-b">
            <h2 className="text-sm font-semibold">Cuộc trò chuyện</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={createNewSession}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Thêm cuộc trò chuyện mới</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Thêm cuộc trò chuyện mới</TooltipContent>
            </Tooltip>
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-2 space-y-2">
              {sessions.map((session) => (
                <Button
                  key={session.id}
                  variant={session.id === activeSessionId ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => setActiveSessionId(session.id)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="truncate">{session.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          {activeSession && (
            <Chat
              key={activeSession.id}
              sessionId={activeSession.id}
              initialModel={activeSession.model}
              initialTemperature={activeSession.temperature}
              initialMaxTokens={activeSession.maxTokens}
              onSettingsChange={handleSettingsChange}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

