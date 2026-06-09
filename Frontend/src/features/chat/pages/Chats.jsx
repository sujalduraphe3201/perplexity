import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCurrentChatId, setMessages } from '../chat.slice'
import { useEffect } from 'react'
import { useChat } from '../hooks/useChat'

// SVG icon components
const PlusIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const TrashIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
)
const ChatBubbleIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)
const ArrowLeftIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
)

const Chats = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const chat = useChat()

    const { user } = useSelector(state => state.auth)
    const {
        chats = [],
        isLoading = false,
        currentChatId = null
    } = useSelector(state => state.chat)

    // Fetch all chats on mount
    useEffect(() => {
        chat.handleGetChats()
    }, [])

    // Select a chat and go to the dashboard to view it
    const handleSelectChat = (chatId) => {
        dispatch(setCurrentChatId(chatId))
        navigate('/')
    }

    // Clear the active chat and navigate to the dashboard composer
    const handleNewChat = () => {
        dispatch(setCurrentChatId(null))
        dispatch(setMessages([]))
        navigate('/')
    }

    const handleDeleteChat = async (e, chatId) => {
        e.stopPropagation()
        await chat.handleDeleteChat(chatId)
    }

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg text-ink">

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-surface bg-bg">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        title="Back to home"
                        className="flex items-center justify-center p-2 rounded-lg border-0 bg-transparent text-dim cursor-pointer transition-colors duration-150 hover:bg-surface hover:text-soft"
                    >
                        <ArrowLeftIcon />
                    </button>
                    <div className="flex items-center gap-2 text-soft">
                        <ChatBubbleIcon />
                        <h1 className="text-[1.1rem] font-semibold text-ink">All Chats</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* User badge */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-full shrink-0 w-[30px] h-[30px] text-sm font-semibold bg-edge text-soft">
                            {user?.name?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <span className="text-sm font-medium text-soft">
                            {user?.name ?? 'Guest'}
                        </span>
                    </div>

                    {/* New Thread */}
                    <button
                        onClick={handleNewChat}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer border border-edge bg-surface text-soft transition-all duration-150 hover:bg-surface2 hover:border-edge2"
                    >
                        <PlusIcon />
                        New Thread
                    </button>
                </div>
            </header>

            {/* Chat list */}
            <main className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-2xl mx-auto">

                    {isLoading && chats.length === 0 && (
                        <div className="flex justify-center pt-16">
                            <p className="text-sm text-faint">Loading chats...</p>
                        </div>
                    )}

                    {!isLoading && chats.length === 0 && (
                        <div className="flex flex-col items-center justify-center pt-24 gap-4">
                            <div className="flex items-center justify-center rounded-xl w-12 h-12 bg-surface text-muted">
                                <ChatBubbleIcon />
                            </div>
                            <p className="text-base font-medium text-muted">No chats yet</p>
                            <p className="text-sm text-dim">Start a new thread to get going</p>
                            <button
                                onClick={handleNewChat}
                                className="flex items-center gap-2 px-4 py-2 mt-2 rounded-lg text-sm font-medium cursor-pointer border border-edge bg-surface text-soft transition-all duration-150 hover:bg-surface2 hover:border-edge2"
                            >
                                <PlusIcon /> New Thread
                            </button>
                        </div>
                    )}

                    {chats.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-[0.72rem] font-bold uppercase tracking-widest mb-2 text-faint">
                                {chats.length} Thread{chats.length !== 1 ? 's' : ''}
                            </p>
                            {chats.map(c => (
                                <div
                                    key={c._id}
                                    onClick={() => handleSelectChat(c._id)}
                                    className={`group flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-150 border ${currentChatId === c._id
                                            ? 'bg-surface2 border-edge2'
                                            : 'bg-surface border-edge hover:bg-surface2 hover:border-edge2'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="text-dim shrink-0">
                                            <ChatBubbleIcon />
                                        </div>
                                        <span className={`text-[0.9rem] font-medium truncate ${currentChatId === c._id ? 'text-ink' : 'text-soft'}`}>
                                            {c.title}
                                        </span>
                                    </div>

                                    <button
                                        onClick={e => handleDeleteChat(e, c._id)}
                                        title="Delete chat"
                                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-3 p-1.5 rounded-md border-0 bg-transparent text-dim cursor-pointer hover:text-red-500"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Chats