import { initializeSocketConnection } from "../service/chat.service"
import { useDispatch } from "react-redux"
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api"
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

export const useChat = () => {
    const dispatch = useDispatch()

    async function handleGetChats() {
        try {
            dispatch(setIsLoading(true))
            const data = await getChats()
            if (data?.chats) {
                dispatch(setChats(data.chats))
            }
        } catch (err) {
            dispatch(setError(err?.message))
        } finally {
            dispatch(setIsLoading(false))
        }
    }

    async function handleGetMessages(chatId) {
        try {
            dispatch(setIsLoading(true))
            const data = await getMessages(chatId)
            if (data?.messages) {
                dispatch(setMessages(data.messages))
            }
        } catch (err) {
            dispatch(setError(err?.message))
        } finally {
            dispatch(setIsLoading(false))
        }
    }

    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setIsSending(true))
            // Optimistically add user message
            dispatch(addMessage({ _id: Date.now(), role: "user", content: message }))
            const data = await sendMessage({ message, chat: chatId })
            if (data?.aiMessage) {
                // If a new chat was created, add it to sidebar and set as active
                if (data.chat && !chatId) {
                    dispatch(addChat(data.chat))
                    dispatch(setCurrentChatId(data.chat._id))
                }
                // Refresh messages from server to get real IDs
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

    async function handleDeleteChat(chatId) {
        try {
            const data = await deleteChat(chatId)
            if (!data?.error) {
                dispatch(removeChat(chatId))
            }
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