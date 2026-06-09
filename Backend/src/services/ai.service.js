import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"
import { ChatGoogle } from "@langchain/google"
import { ChatMistralAI } from "@langchain/mistralai"

// Mistral handles chat responses; Gemini handles title generation
const geminiModel = new ChatGoogle({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
})

const mistralModel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-latest",
})

// Convert stored messages to LangChain format and invoke Mistral
export async function generateResponse(messages) {
    const response = await mistralModel.invoke([
        new SystemMessage("You are an expert at giving clear, well-formatted responses."),
        ...messages.map((msg) => {
            if (msg.role === "user") return new HumanMessage(msg.content)
            if (msg.role === "ai") return new AIMessage(msg.content)
        })
    ])
    return response.text
}

// Generate a concise 2-4 word title for a new chat thread using Gemini
export async function generateChatTitle(message) {
    const response = await geminiModel.invoke([
        new SystemMessage(
            "You are an expert at generating titles that are precise and concise. " +
            "Generate a title for the following message in 2-4 words. " +
            "Return only the title words — no symbols, no punctuation."
        ),
        new HumanMessage(message)
    ])
    return response.text
}
