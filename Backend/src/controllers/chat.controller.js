import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"
import { generateChatTitle, generateResponse } from "../services/ai.service.js"

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;
        let chat = null;
        let title = null

        if (!chatId) {
            title = await generateChatTitle(message)
            chat = await chatModel.create({
                user: req.user.id,
                title: title
            })
        } else {
            chat = await chatModel.findById(chatId)
        }


        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: "user"

        })
        const messages = await messageModel.find({ chat: chat._id })
        const result = await generateResponse(messages)
        const aiMessage = await messageModel.create({
            chat: chat._id,
            content: result,
            role: "ai",

        })

        return res.json({ aiMessage, title, chat, userMessage })
    }
    catch (err) {
        console.log(err)
        return res.json({ error: "Internal Server Error", err })
    }
}

export async function getChats(req, res) {
    try {
        const userId = req.user.id
        const chats = await chatModel.find({ user: userId })
        if (!chats) {
            return res.json({ error: "No chats found" })
        }

        res.status(200).json({ message: "Chats fetched successfully", chats: chats })


    }
    catch (err) {
        console.log(err)
        return res.json({ error: "Internal Server Error", err })
    }
}

export async function getMessages(req, res) {
    try {
        const { chatId } = req.params
        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        })

        if (!chat) {
            return res.json({ error: "No chat found" })
        }

        const messages = await messageModel.find({ chat: chatId })
        if (!messages) {
            return res.json({ error: "No messages found" })
        }
        res.status(200).json({ message: "Messages fetched successfully", messages: messages })
    }
    catch (err) {
        console.log(err)
        return res.json({ error: "Internal Server Error", err })
    }
}

export async function deleteChat(req, res) {
    const { chatId } = req.params;
    try {
        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user.id
        })
        if (!chat) {
            return res.json({ error: "No chat found" })
        }
        await messageModel.deleteMany({
            chat: chatId
        })
        res.status(200).json({ message: "Chat deleted successfully", chat: chat })

    }
    catch (err) {
        console.log(err)
        return res.json({ error: "Internal Server Error", err })
    }
}