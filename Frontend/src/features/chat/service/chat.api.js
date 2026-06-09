import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})


export const sendMessage = async ({ message, chat }) => {
    try {
        const response = await api.post("/api/chats/message", { message, chat })
        return response.data
    }
    catch (error) {
        console.log("Error sending message", error)
        throw error
    }
}

export const getChats = async () => {
    try {
        const response = await api.get("/api/chats")
        return response.data
    }
    catch (error) {
        console.log("Error fetching chats", error)
    }
}

export const getMessages = async (chatId) => {
    try {
        const response = await api.get(`/api/chats/${chatId}/messages`)
        return response.data
    }
    catch (error) {
        console.log("Error fetching messages", error)
    }
}

export const deleteChat = async (chatId) => {
    try {
        const response = await api.delete(`/api/chats/delete/${chatId}`)
        return response.data
    }
    catch (error) {
        console.log("Error deleting chat", error)
    }
}