import { StreamingTextResponse } from "ai"
import { experimental_groq as groq } from "@ai-sdk/groq"
import { streamText } from "ai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages, model, temperature, maxTokens } = await req.json()

    // Create the prompt from the messages
    const prompt = messages
      .map((message: any) => {
        if (message.role === "user") {
          return `Người dùng: ${message.content}`
        } else {
          return `Trợ lý: ${message.content}`
        }
      })
      .join("\n\n")

    // Create the system message in Vietnamese
    const system =
      "Bạn là một trợ lý AI hữu ích và thân thiện được cung cấp bởi Groq. Cung cấp câu trả lời chính xác, ngắn gọn và hữu ích. Trả lời bằng tiếng Việt."

    // Stream the response
    const result = await streamText({
      model: groq(model),
      prompt,
      system,
      temperature,
      maxTokens,
    })

    // Return the streaming response
    return new StreamingTextResponse(result.textStream)
  } catch (error) {
    console.error("Error in chat route:", error)
    return new Response(JSON.stringify({ error: "Không thể tạo phản hồi" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

