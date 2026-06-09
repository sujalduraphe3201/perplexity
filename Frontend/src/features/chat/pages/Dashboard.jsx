import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../hooks/useChat'
import { useEffect, useState, useRef } from 'react'
import { setCurrentChatId, setMessages } from '../chat.slice'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// SVG icon components
const ChatsIcon = () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
)
const PlusIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)
const SendIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)
const TrashIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
)
const AttachIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
)

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const {
        chats = [],
        messages = [],
        isLoading = false,
        isSending = false,
        currentChatId = null
    } = useSelector(state => state.chat)

    const chat = useChat()
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)
    const textareaRef = useRef(null)

    // On mount: connect socket and load all threads
    useEffect(() => {
        chat.initializeSocketConnection()
        chat.handleGetChats()
    }, [])

    // When active thread changes, load its messages or clear them
    useEffect(() => {
        if (currentChatId) chat.handleGetMessages(currentChatId)
        else dispatch(setMessages([]))
    }, [currentChatId])

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isSending])

    // Grow the textarea as the user types (capped at 160px)
    useEffect(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 160) + 'px'
    }, [input])

    const handleSelectChat = (chatId) => dispatch(setCurrentChatId(chatId))

    const handleNewChat = () => {
        dispatch(setCurrentChatId(null))
        dispatch(setMessages([]))
    }

    const handleSend = async () => {
        const text = input.trim()
        if (!text || isSending) return
        setInput('')
        await chat.handleSendMessage({ message: text, chatId: currentChatId })
    }

    // Enter sends; Shift+Enter inserts a newline
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleDeleteChat = async (e, chatId) => {
        e.stopPropagation()
        await chat.handleDeleteChat(chatId)
        if (currentChatId === chatId) {
            dispatch(setCurrentChatId(null))
            dispatch(setMessages([]))
        }
    }

    const activeChat = chats.find(c => c._id === currentChatId)
    const isEmptyState = !currentChatId && messages.length === 0

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-bg text-ink">

            {/* Sidebar */}
            <aside className="flex flex-col h-full py-4 px-2.5 w-[248px] min-w-[248px] border-r border-edge bg-bg">

                {/* Brand */}
                <div className="flex items-center gap-2.5 px-2 pb-5 mb-1">
                    <span className="text-xl font-semibold tracking-[-0.01em] text-ink">
                        Perplexity
                    </span>
                </div>

                {/* New Thread button */}
                <button
                    onClick={handleNewChat}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg mb-2 text-[0.95rem] font-medium cursor-pointer border border-edge bg-surface text-soft transition-all duration-150 hover:bg-surface2 hover:border-edge2"
                >
                    <PlusIcon />
                    New Thread
                </button>

                {/* Navigation */}
                <nav className="flex flex-col gap-0.5 mb-3">
                    <button
                        onClick={() => navigate('/chats')}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[0.95rem] font-medium cursor-pointer text-left border-0 bg-transparent text-muted transition-all duration-150 hover:bg-surface hover:text-soft"
                    >
                        <ChatsIcon />
                        <span>Chats</span>
                    </button>
                </nav>

                <div className="mx-1 mb-3 h-px bg-surface" />

                {/* Recents section label */}
                <p className="px-2 pb-1.5 text-[0.72rem] font-bold uppercase tracking-widest text-faint">
                    Recents
                </p>

                {/* Thread list */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-0.5">
                    {isLoading && chats.length === 0 && (
                        <p className="text-sm text-center mt-3 text-faint">Loading...</p>
                    )}
                    {!isLoading && chats.length === 0 && (
                        <p className="text-sm text-center mt-3 px-2 text-faint">No threads yet</p>
                    )}
                    {chats.map(c => (
                        <button
                            key={c._id}
                            onClick={() => handleSelectChat(c._id)}
                            className={`group flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-left text-[0.9rem] border-0 cursor-pointer transition-colors duration-150 ${currentChatId === c._id
                                    ? 'bg-surface2 text-ink'
                                    : 'bg-transparent text-muted hover:bg-surface hover:text-soft'
                                }`}
                        >
                            <span className="flex-1 truncate">{c.title}</span>
                            <span
                                onClick={e => handleDeleteChat(e, c._id)}
                                title="Delete"
                                className="shrink-0 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-dim hover:text-red-500"
                            >
                                <TrashIcon />
                            </span>
                        </button>
                    ))}
                </div>

                {/* User profile footer */}
                <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mt-2 cursor-pointer transition-all duration-150 text-soft hover:bg-surface">
                    <div className="flex items-center justify-center rounded-full shrink-0 w-[30px] h-[30px] text-sm font-semibold bg-edge text-soft">
                        {user?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[0.95rem] font-medium truncate text-soft">
                            {user?.name ?? 'Guest'}
                        </p>
                        <p className="text-[0.78rem] text-faint">Free</p>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex flex-col flex-1 h-full overflow-hidden relative">

                {isEmptyState ? (
                    /* Home state: centered hero + composer */
                    <div className="flex flex-col flex-1 items-center justify-center px-6 gap-8 pt-10 pb-10">
                        <div className="text-center">
                            <h1 className="text-3xl font-semibold mb-1.5 tracking-[-0.02em] text-ink">
                                Where knowledge begins
                            </h1>
                            <p className="text-base text-dim">
                                Ask anything, get clear answers.
                            </p>
                        </div>

                        <div className="w-full max-w-[680px]">
                            <div className="composer-wrap" style={{ padding: '14px 14px 10px' }}>
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    rows={1}
                                    disabled={isSending}
                                    className="w-full bg-transparent border-none outline-none resize-none text-base leading-relaxed text-ink overflow-hidden"
                                />
                                <div className="flex items-center justify-between mt-2.5">
                                    <button
                                        title="Attach file"
                                        className="flex items-center justify-center p-1.5 rounded-md border-0 bg-transparent text-dim cursor-pointer transition-colors duration-150 hover:text-soft hover:bg-surface2"
                                    >
                                        <AttachIcon />
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isSending}
                                        className={`send-btn ${input.trim() && !isSending ? 'active' : 'inactive'}`}
                                    >
                                        <SendIcon />
                                    </button>
                                </div>
                            </div>

                            {/* Quick-start suggestion chips */}
                            <div className="flex gap-2 mt-3 flex-wrap justify-center">
                                {['What is quantum computing?', 'How does AI work?', 'Explain black holes', 'Latest in tech'].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setInput(q)}
                                        className="px-3 py-1.5 rounded-full text-sm border border-edge bg-surface text-muted cursor-pointer transition-all duration-150 hover:border-edge2 hover:text-soft"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Active thread: header + messages + sticky composer */
                    <>
                        {/* Thread title bar */}
                        <header className="flex items-center px-7 py-3.5 shrink-0 backdrop-blur-md border-b border-surface bg-bg/90">
                            <h2 className="text-sm font-medium truncate max-w-[60%] text-muted">
                                {activeChat?.title ?? 'New Thread'}
                            </h2>
                        </header>

                        {/* Message list */}
                        <div className="flex-1 overflow-y-auto py-8 flex flex-col">
                            {isLoading && messages.length === 0 && (
                                <div className="text-center pt-10">
                                    <p className="text-sm text-faint">Loading thread...</p>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div
                                    key={msg._id ?? i}
                                    className={`msg-enter px-7 py-3${msg.role === 'user' ? ' flex justify-end' : ''}`}
                                >
                                    {msg.role === 'user' ? (
                                        // User message: right-aligned pill
                                        <div className="max-w-[62%] px-4 py-2.5 text-sm leading-relaxed bg-surface2 border border-edge text-ink rounded-[18px_18px_4px_18px]">
                                            {msg.content}
                                        </div>
                                    ) : (
                                        // AI message: free-flowing markdown
                                        <div className="max-w-[700px] mx-auto w-full">
                                            <div className="md-body">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Animated thinking dots while awaiting AI */}
                            {isSending && (
                                <div className="msg-enter px-7 py-3">
                                    <div className="max-w-[700px] mx-auto w-full">
                                        <div className="flex gap-1.5 items-center">
                                            <span className="dot" /><span className="dot" /><span className="dot" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Sticky follow-up composer */}
                        <div className="px-7 pb-5 pt-3 shrink-0 bg-linear-to-t from-bg from-75% to-transparent">
                            <div className="max-w-[700px] mx-auto">
                                <div className="composer-wrap" style={{ padding: '12px 12px 8px' }}>
                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask a follow-up..."
                                        rows={1}
                                        disabled={isSending}
                                        className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-ink overflow-hidden"
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <button
                                            title="Attach file"
                                            className="flex items-center justify-center p-1.5 rounded-md border-0 bg-transparent text-dim cursor-pointer transition-colors duration-150 hover:text-soft hover:bg-surface2"
                                        >
                                            <AttachIcon />
                                        </button>
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isSending}
                                            className={`send-btn ${input.trim() && !isSending ? 'active' : 'inactive'}`}
                                        >
                                            <SendIcon />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-center text-xs mt-2 text-faint">
                                    Enter to send · Shift+Enter for new line
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}

export default Dashboard
