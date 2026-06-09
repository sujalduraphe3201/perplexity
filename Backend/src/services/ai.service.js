import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";


const geminiModel = new ChatGoogle({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
});

const mistralModel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-latest",
})


export async function generateResponse(messages) {
    const response = await mistralModel.invoke([
        new SystemMessage(`You are an expert at giving clear, well-formatted responses.`),
        ...messages.map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content)
            } else if (msg.role === "ai") {
                return new AIMessage(msg.content)
            }
        })
    ])
    return response.text
}

export async function generateChatTitle(message) {
    const response = await geminiModel.invoke([
        new SystemMessage(`
            You are an expert at generating titles that are precise and concise for chat messages.
            Generate a title for the following chat message in 2-4 words.When returning the title just write the Title no extra symbol just words and spaces
            `),
        new HumanMessage(message)
    ])
    return response.text
}

