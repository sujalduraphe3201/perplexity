import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"
import { generateChatTitle, generateResponse } from "../services/ai.service.js"

// POST /api/chats/message
// Creates a new chat (with AI-generated title) if no chatId is provided,
// then saves the user message, generates an AI reply, and returns both.
export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body
        let chat

        if (!chatId) {
            // New thread: generate a title and create the chat document
            const title = await generateChatTitle(message)
            chat = await chatModel.create({ user: req.user.id, title })
        } else {
            chat = await chatModel.findById(chatId)
        }

        // Save the user's message
        const userMessage = await messageModel.create({
            chat: chat._id,
            content: message,
            role: "user"
        })

        // Fetch full history so the AI has context, then generate a reply
        const history = await messageModel.find({ chat: chat._id })
        const result = await generateResponse(history)

        const aiMessage = await messageModel.create({
            chat: chat._id,
            content: result,
            role: "ai"
        })

        return res.json({ aiMessage, chat, userMessage })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

// GET /api/chats
// Returns all chats belonging to the authenticated user.
export async function getChats(req, res) {
    try {
        const chats = await chatModel.find({ user: req.user.id })
        return res.status(200).json({ chats })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

// GET /api/chats/:chatId/messages
// Returns all messages in a chat, verifying the chat belongs to the user.
export async function getMessages(req, res) {
    try {
        const { chatId } = req.params
        const chat = await chatModel.findOne({ _id: chatId, user: req.user.id })

        if (!chat) return res.status(404).json({ error: "Chat not found" })

        const messages = await messageModel.find({ chat: chatId })
        return res.status(200).json({ messages })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

// DELETE /api/chats/delete/:chatId
// Deletes a chat and all its messages, verifying ownership first.
export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params
        const chat = await chatModel.findOneAndDelete({ _id: chatId, user: req.user.id })

        if (!chat) return res.status(404).json({ error: "Chat not found" })

        await messageModel.deleteMany({ chat: chatId })
        return res.status(200).json({ message: "Chat deleted", chat })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}