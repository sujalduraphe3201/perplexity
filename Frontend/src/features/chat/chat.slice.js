import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        messages: [],
        isLoading: false,
        isSending: false,
        error: null,
        currentChatId: null
    },
    reducers: {
        setChats(state, action) {
            state.chats = action.payload
        },
        addChat(state, action) {
            state.chats.unshift(action.payload)
        },
        removeChat(state, action) {
            state.chats = state.chats.filter(c => c._id !== action.payload)
        },
        setMessages(state, action) {
            state.messages = action.payload
        },
        addMessage(state, action) {
            state.messages.push(action.payload)
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload
        },
        setIsSending(state, action) {
            state.isSending = action.payload
        },
        setCurrentChatId(state, action) {
            state.currentChatId = action.payload
        },
        setError(state, action) {
            state.error = action.payload
        }
    }
})

export default chatSlice.reducer
export const {
    setChats,
    addChat,
    removeChat,
    setMessages,
    addMessage,
    setIsLoading,
    setIsSending,
    setCurrentChatId,
    setError
} = chatSlice.actions