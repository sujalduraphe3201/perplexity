import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],           // list of chat threads shown in the sidebar
        messages: [],        // messages of the currently active chat
        isLoading: false,    // true while fetching chats or messages
        isSending: false,    // true while waiting for the AI response
        error: null,
        currentChatId: null  // _id of the open thread, null = new thread
    },
    reducers: {
        setChats(state, action) {
            state.chats = action.payload
        },
        addChat(state, action) {
            // Prepend so the newest thread appears at the top
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