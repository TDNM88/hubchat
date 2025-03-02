import { ChatWithSessions } from "@/components/chat-with-sessions"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold">Groq Chat</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <ChatWithSessions />
      </main>
    </div>
  )
}

