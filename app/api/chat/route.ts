import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { StreamingTextResponse } from "ai"

const groqClient = groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  try {
    const { messages, model, temperature, maxTokens } = await req.json()

    // Debug log
    console.log("Request data:", {
      model,
      temperature,
      maxTokens,
      messagesCount: messages.length
    })

    const prompt = messages
      .map((message: any) => {
        if (message.role === "user") {
          return `Người dùng: ${message.content}`
        } else {
          return `Trợ lý: ${message.content}`
        }
      })
      .join("\n\n")

    const system =
      "Bạn là một trợ lý AI hữu ích và thân thiện được cung cấp bởi Groq. Cung cấp câu trả lời chính xác, ngắn gọn và hữu ích. Trả lời bằng tiếng Việt."

    const result = await streamText({
      model: groqClient(model),
      prompt,
      system,
      temperature,
      maxTokens,
    })

    return new StreamingTextResponse(result.textStream)
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    })
    return new Response(JSON.stringify({ 
      error: "Không thể tạo phản hồi",
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
