import { useDispatch } from "react-redux"
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api"
import { initializeSocketConnection } from "../service/chat.service"
import {
    setChats,
    addChat,
    setMessages,
    addMessage,
    setIsLoading,
    setIsSending,
    setCurrentChatId,
    removeChat,
    setError
} from "../chat.slice"

// Custom hook that exposes all chat-related API actions with Redux side effects
export const useChat = () => {
    const dispatch = useDispatch()

    // Fetch all chats for the logged-in user and store them in Redux
    async function handleGetChats() {
        try {
            dispatch(setIsLoading(true))
            const data = await getChats()
            if (data?.chats) dispatch(setChats(data.chats))
        } catch (err) {
            dispatch(setError(err?.message))
        } finally {
            dispatch(setIsLoading(false))
        }
    }

    // Fetch all messages for a specific chat and store them in Redux
    async function handleGetMessages(chatId) {
        try {
            dispatch(setIsLoading(true))
            const data = await getMessages(chatId)
            if (data?.messages) dispatch(setMessages(data.messages))
        } catch (err) {
            dispatch(setError(err?.message))
        } finally {
            dispatch(setIsLoading(false))
        }
    }

    // Send a message, show it optimistically, then refresh with real server data
    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setIsSending(true))
            // Show user's message immediately before the server responds
            dispatch(addMessage({ _id: Date.now(), role: "user", content: message }))

            const data = await sendMessage({ message, chat: chatId })

            if (data?.aiMessage) {
                // If this was a new thread, add it to the sidebar and activate it
                if (data.chat && !chatId) {
                    dispatch(addChat(data.chat))
                    dispatch(setCurrentChatId(data.chat._id))
                }
                // Replace the optimistic message with real DB data
                const refreshed = await getMessages(data.chat._id)
                if (refreshed?.messages) dispatch(setMessages(refreshed.messages))
            }
            return data
        } catch (err) {
            dispatch(setError(err?.message))
        } finally {
            dispatch(setIsSending(false))
        }
    }

    // Delete a chat and remove it from the sidebar
    async function handleDeleteChat(chatId) {
        try {
            const data = await deleteChat(chatId)
            if (!data?.error) dispatch(removeChat(chatId))
        } catch (err) {
            dispatch(setError(err?.message))
        }
    }

    return {
        initializeSocketConnection,
        handleGetChats,
        handleGetMessages,
        handleSendMessage,
        handleDeleteChat,
    }
}