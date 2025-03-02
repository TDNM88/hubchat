export async function POST(req: Request) {
  try {
    const { messages, model, temperature, maxTokens } = await req.json()

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: model || "llama3-70b-8192",
        messages,
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 1024,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`)
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    })

  } catch (error) {
    console.error("Error:", error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ 
      error: "Không thể tạo phản hồi",
      details: message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
