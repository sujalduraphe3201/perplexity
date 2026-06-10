import { tool, createAgent } from "langchain"
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"
import { ChatGoogle } from "@langchain/google"
import { ChatMistralAI } from "@langchain/mistralai"
import * as z from "zod"
import { internetSearch } from "./internet.service.js"

const geminiModel = new ChatGoogle({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
})

const mistralModel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-latest",
})

const internetSearchTool = tool(
    async ({ query }) => await internetSearch(query),
    {
        name: "internet_search",
        description: "Search the internet for up-to-date information on any topic.",
        schema: z.object({
            query: z.string().describe("The search query"),
        }),
    }
)

const agent = createAgent({
    model: mistralModel,
    tools: [internetSearchTool],
})

export async function generateResponse(messages) {
    const response = await agent.invoke({
        messages: [new SystemMessage(
            `You are a helpful and precise assistant .if you dont know the answer say no .if the question requires up-to-date 
            information use the searchInternet tool to get latest information`
        ), ...(messages.map(msg => {
            if (msg.role === "user") return new HumanMessage(msg.content)
            if (msg.role === "ai") return new AIMessage(msg.content)
        }))]
    })
    return response.messages[response.messages.length - 1].text
}

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

