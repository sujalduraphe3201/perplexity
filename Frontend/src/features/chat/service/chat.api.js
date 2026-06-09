import axios from "axios"

// Axios instance shared by all chat API calls
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true  // send cookies for auth
})

// POST /api/chats/message — send a message to an existing or new chat
export const sendMessage = async ({ message, chat }) => {
    const response = await api.post("/api/chats/message", { message, chat })
    return response.data
}

// GET /api/chats — fetch all chats for the current user
export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data
}

// GET /api/chats/:chatId/messages — fetch all messages in a chat
export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

// DELETE /api/chats/delete/:chatId — delete a chat and its messages
export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}