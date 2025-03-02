"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Bot, Send, Settings, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChatSettings } from "@/components/chat-settings"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatProps {
  sessionId: string
  initialModel: string
  initialTemperature: number
  initialMaxTokens: number
  onSettingsChange: (sessionId: string, model: string, temperature: number, maxTokens: number) => void
}

export function Chat({ sessionId, initialModel, initialTemperature, initialMaxTokens, onSettingsChange }: ChatProps) {
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState(initialModel)
  const [temperature, setTemperature] = useState(initialTemperature)
  const [maxTokens, setMaxTokens] = useState(initialMaxTokens)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    id: sessionId,
    body: {
      model,
      temperature,
      maxTokens,
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  const handleSettingsChange = useCallback(
    (newModel: string, newTemperature: number, newMaxTokens: number) => {
      setModel(newModel)
      setTemperature(newTemperature)
      setMaxTokens(newMaxTokens)
      onSettingsChange(sessionId, newModel, newTemperature, newMaxTokens)
    },
    [sessionId, onSettingsChange],
  )

  return (
    <div className="flex flex-1 flex-col">
      <TooltipProvider>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 md:p-8">
            <div className="flex flex-1 flex-col space-y-4">
              {messages.length === 0 && (
                <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-center text-2xl font-bold">Trò chuyện với Groq</h1>
                  <p className="text-center text-muted-foreground">
                    Bắt đầu cuộc trò chuyện với các mô hình ngôn ngữ mạnh mẽ của Groq.
                  </p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-full items-start gap-4 rounded-lg p-4",
                    message.role === "user" ? "bg-muted/50" : "bg-primary/10",
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
                    {message.role === "user" ? <span className="text-sm">Bạn</span> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex w-full items-start gap-4 rounded-lg bg-primary/10 p-4">
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                      <div className="flex items-center">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                        <div
                          className="ml-1 h-2 w-2 animate-pulse rounded-full bg-primary"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="ml-1 h-2 w-2 animate-pulse rounded-full bg-primary"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex w-full items-start gap-4 rounded-lg bg-destructive/10 p-4 text-destructive">
                  <p>Lỗi: {error.message}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <div className="border-t bg-background p-4">
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0" onClick={() => setOpen(true)}>
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Cài đặt</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Điều chỉnh cài đặt mô hình</TooltipContent>
            </Tooltip>
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
              <Textarea
                placeholder="Gửi tin nhắn..."
                className="min-h-10 flex-1 resize-none"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={isLoading || input.trim() === ""}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Gửi</span>
              </Button>
            </form>
          </div>
        </div>
        <ChatSettings
          open={open}
          onOpenChange={setOpen}
          model={model}
          onModelChange={(newModel) => handleSettingsChange(newModel, temperature, maxTokens)}
          temperature={temperature}
          onTemperatureChange={(newTemperature) => handleSettingsChange(model, newTemperature, maxTokens)}
          maxTokens={maxTokens}
          onMaxTokensChange={(newMaxTokens) => handleSettingsChange(model, temperature, newMaxTokens)}
        />
      </TooltipProvider>
    </div>
  )
}

