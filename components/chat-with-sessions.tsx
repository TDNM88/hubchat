"use client"

import { useState, useEffect, useCallback } from "react"
import { nanoid } from "@/lib/nanoid"
import { Plus, MessageSquare } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Chat } from "@/components/chat"
import { ChatSettings } from "@/components/chat-settings"

interface ChatSession {
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
  }, [sessions.length])

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
      prevSessions.map((session) => (session.id === sessionId ? { ...session, ...updates } : session))
    )
  }, [])

  const handleSettingsChange = useCallback(
    (sessionId: string, model: string, temperature: number, maxTokens: number) => {
      updateSession(sessionId, { model, temperature, maxTokens })
    },
    [updateSession]
  )

  const activeSession = sessions.find((session) => session.id === activeSessionId)

  return (
    <div className="flex h-full">
      <div className="w-64 border-r p-4">
        <button
          onClick={createNewSession}
          className="mb-4 flex w-full items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Tạo phiên mới
        </button>
        <ScrollArea className="h-[calc(100vh-120px)]">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`mb-2 flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm ${
                session.id === activeSessionId
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              {session.name}
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1">
        {activeSession && (
          <Chat
            sessionId={activeSession.id}
            initialModel={activeSession.model}
            initialTemperature={activeSession.temperature}
            initialMaxTokens={activeSession.maxTokens}
            onSettingsChange={handleSettingsChange}
          />
        )}
      </div>
    </div>
  )
}
