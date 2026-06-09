import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { useEffect, useState, useRef } from 'react'
import { setCurrentChatId, setMessages } from '../chat.slice'
import ReactMarkdown from 'react-markdown'

/* ── Perplexity SVG Logo Mark ── */
const PerplexityMark = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 7v5l8 5 8-5V7L12 2z" fill="currentColor" opacity="0.9" />
        <path d="M4 12v5l8 5 8-5v-5L12 17 4 12z" fill="currentColor" opacity="0.5" />
    </svg>
)

/* ── Icons ── */
const HomeIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
)
const DiscoverIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
)
const LibraryIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
)
const PlusIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
)
const SearchIcon = () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const Dashboard = () => {
    const dispatch = useDispatch()
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

    useEffect(() => {
        chat.initializeSocketConnection()
        chat.handleGetChats()
    }, [])

    useEffect(() => {
        if (currentChatId) {
            chat.handleGetMessages(currentChatId)
        } else {
            dispatch(setMessages([]))
        }
    }, [currentChatId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isSending])

    // Auto-grow textarea
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
        <div id="perplexity-root" style={{
            display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden',
            background: '#171615', color: '#E8E4DC',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #2E2B28; border-radius: 99px; }
                ::placeholder { color: #5C5650 !important; }
                textarea { font-family: inherit; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 0.2; transform: scale(0.8); }
                    50%       { opacity: 1;   transform: scale(1); }
                }
                .msg-enter { animation: fadeUp 0.22s ease both; }
                .dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #76716A; }
                .dot:nth-child(1) { animation: blink 1.2s ease-in-out 0s   infinite; }
                .dot:nth-child(2) { animation: blink 1.2s ease-in-out 0.2s infinite; }
                .dot:nth-child(3) { animation: blink 1.2s ease-in-out 0.4s infinite; }

                /* ── Markdown styles ── */
                .md-body { color: #C8C2BA; font-size: 14.5px; line-height: 1.75; }
                .md-body h1,.md-body h2,.md-body h3,.md-body h4 { color: #E8E4DC; font-weight: 600; margin: 18px 0 8px; letter-spacing: -0.01em; }
                .md-body h1 { font-size: 20px; }
                .md-body h2 { font-size: 17px; }
                .md-body h3 { font-size: 15px; }
                .md-body p { margin: 6px 0; }
                .md-body strong { color: #E8E4DC; font-weight: 600; }
                .md-body em { color: #A89E94; font-style: italic; }
                .md-body ul,.md-body ol { padding-left: 20px; margin: 8px 0; }
                .md-body li { margin: 4px 0; }
                .md-body code { background: #252220; border: 1px solid #2E2B28; border-radius: 5px; padding: 1px 6px; font-size: 13px; color: #20B2A8; font-family: 'JetBrains Mono', 'Fira Code', monospace; }
                .md-body pre { background: #1A1917; border: 1px solid #2E2B28; border-radius: 10px; padding: 14px 16px; overflow-x: auto; margin: 12px 0; }
                .md-body pre code { background: none; border: none; padding: 0; color: #C8C2BA; font-size: 13px; }
                .md-body table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 13.5px; }
                .md-body th { background: #1F1D1B; color: #E8E4DC; font-weight: 600; padding: 8px 12px; border: 1px solid #2E2B28; text-align: left; }
                .md-body td { padding: 7px 12px; border: 1px solid #2E2B28; color: #A89E94; }
                .md-body tr:hover td { background: #1A1917; }
                .md-body blockquote { border-left: 3px solid #20B2A8; padding: 4px 12px; margin: 10px 0; color: #76716A; background: #1A1917; border-radius: 0 6px 6px 0; }
                .md-body hr { border: none; border-top: 1px solid #2E2B28; margin: 16px 0; }
                .md-body a { color: #20B2A8; text-decoration: none; }
                .md-body a:hover { text-decoration: underline; }

                .nav-item {
                    display: flex; align-items: center; gap: 10px;
                    padding: 8px 10px; border-radius: 8px; cursor: pointer;
                    color: #76716A; font-size: 13.5px; font-weight: 500;
                    transition: background 0.15s, color 0.15s; border: none; background: none; width: 100%; text-align: left;
                }
                .nav-item:hover { background: #1F1D1B; color: #C8C2BA; }

                .thread-item {
                    display: flex; align-items: center; gap: 8px;
                    width: 100%; padding: 6px 8px; border-radius: 7px;
                    cursor: pointer; background: none; border: none; text-align: left;
                    color: #76716A; font-size: 12.5px; transition: background 0.12s, color 0.12s;
                }
                .thread-item:hover { background: #1F1D1B; color: #C8C2BA; }
                .thread-item.active { background: #252220; color: #E8E4DC; }
                .thread-del { opacity: 0; }
                .thread-item:hover .thread-del { opacity: 1; }
                .thread-del:hover { color: #EF4444 !important; }

                .composer-wrap {
                    background: #1F1D1B;
                    border: 1px solid #2E2B28;
                    border-radius: 14px;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .composer-wrap:focus-within {
                    border-color: #3D3A36;
                    box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
                }
                .composer-btn {
                    display: flex; align-items: center; justify-content: center;
                    border: none; background: none; cursor: pointer;
                    border-radius: 6px; padding: 5px; color: #5C5650;
                    transition: color 0.12s, background 0.12s;
                }
                .composer-btn:hover { color: #C8C2BA; background: #2A2724; }
                .send-btn {
                    width: 30px; height: 30px; border-radius: 8px; border: none;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: all 0.15s; flex-shrink: 0;
                }
                .send-btn.active { background: #E8E4DC; color: #171615; }
                .send-btn.active:hover { background: #fff; transform: scale(1.05); }
                .send-btn.inactive { background: #252220; color: #3D3A36; cursor: not-allowed; }
            `}</style>

            {/* ══ SIDEBAR ══ */}
            <aside style={{
                width: 240, minWidth: 240, display: 'flex', flexDirection: 'column',
                height: '100%', padding: '16px 10px',
                borderRight: '1px solid #1F1D1B', background: '#171615'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 8px 16px' }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8, background: '#20B2A8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0
                    }}>
                        <PerplexityMark size={16} />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#E8E4DC', letterSpacing: '-0.01em' }}>
                        Perplexity
                    </span>
                </div>

                {/* New Thread button */}
                <button
                    onClick={handleNewChat}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        width: '100%', padding: '8px 10px', marginBottom: 8,
                        borderRadius: 8, border: '1px solid #2E2B28', background: '#1F1D1B',
                        color: '#C8C2BA', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        transition: 'background 0.15s, border-color 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#252220'; e.currentTarget.style.borderColor = '#3D3A36' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1F1D1B'; e.currentTarget.style.borderColor = '#2E2B28' }}
                >
                    <PlusIcon />
                    New Thread
                </button>

                {/* Nav items */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
                    <button className="nav-item"><HomeIcon /> Home</button>
                    <button className="nav-item"><DiscoverIcon /> Discover</button>
                    <button className="nav-item"><LibraryIcon /> Library</button>
                </nav>

                {/* Divider */}
                <div style={{ height: 1, background: '#1F1D1B', margin: '4px 4px 12px' }} />

                {/* Threads label */}
                <p style={{ fontSize: 11, fontWeight: 600, color: '#3D3A36', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px 6px' }}>
                    Recents
                </p>

                {/* Thread list */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {isLoading && chats.length === 0 && (
                        <p style={{ fontSize: 12, color: '#3D3A36', textAlign: 'center', marginTop: 12 }}>Loading...</p>
                    )}
                    {!isLoading && chats.length === 0 && (
                        <p style={{ fontSize: 12, color: '#3D3A36', textAlign: 'center', marginTop: 12, padding: '0 8px' }}>No threads yet</p>
                    )}
                    {chats.map(c => (
                        <button
                            key={c._id}
                            className={`thread-item${currentChatId === c._id ? ' active' : ''}`}
                            onClick={() => handleSelectChat(c._id)}
                        >
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {c.title}
                            </span>
                            <span
                                className="thread-del composer-btn"
                                style={{ padding: 3, color: '#5C5650' }}
                                onClick={(e) => handleDeleteChat(e, c._id)}
                                title="Delete"
                            >
                                <TrashIcon />
                            </span>
                        </button>
                    ))}
                </div>

                {/* User footer */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '8px 10px', borderRadius: 8, marginTop: 8, cursor: 'pointer',
                    transition: 'background 0.15s'
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1F1D1B'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <div style={{
                        width: 28, height: 28, borderRadius: '50%', background: '#2E2B28',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 600, color: '#C8C2BA', flexShrink: 0
                    }}>
                        {user?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: 12.5, fontWeight: 500, color: '#C8C2BA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name ?? 'Guest'}
                        </p>
                        <p style={{ fontSize: 11, color: '#3D3A36' }}>Free</p>
                    </div>
                </div>
            </aside>

            {/* ══ MAIN ══ */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>

                {isEmptyState ? (
                    /* ── EMPTY / HOME STATE ── */
                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '40px 24px', gap: 32
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: 28, fontWeight: 600, color: '#E8E4DC', letterSpacing: '-0.02em', marginBottom: 6 }}>
                                Where knowledge begins
                            </h1>
                            <p style={{ fontSize: 14, color: '#5C5650' }}>Ask anything, get clear answers with sources.</p>
                        </div>

                        {/* Centered composer */}
                        <div style={{ width: '100%', maxWidth: 680 }}>
                            <div className="composer-wrap" style={{ padding: '14px 14px 10px' }}>
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    rows={1}
                                    disabled={isSending}
                                    style={{
                                        width: '100%', background: 'none', border: 'none', outline: 'none',
                                        resize: 'none', color: '#E8E4DC', fontSize: 14.5, lineHeight: 1.6,
                                        overflowY: 'hidden'
                                    }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="composer-btn" title="Search"><SearchIcon /></button>
                                        <button className="composer-btn" title="Attach"><AttachIcon /></button>
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isSending}
                                        className={`send-btn ${input.trim() && !isSending ? 'active' : 'inactive'}`}
                                    >
                                        <SendIcon />
                                    </button>
                                </div>
                            </div>

                            {/* Suggestion chips */}
                            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {['What is quantum computing?', 'How does AI work?', 'Explain black holes', 'Latest in tech'].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setInput(q)}
                                        style={{
                                            padding: '6px 12px', borderRadius: 99, border: '1px solid #2E2B28',
                                            background: '#1F1D1B', color: '#76716A', fontSize: 12.5, cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#3D3A36'; e.currentTarget.style.color = '#C8C2BA' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2E2B28'; e.currentTarget.style.color = '#76716A' }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── THREAD / CHAT STATE ── */
                    <>
                        {/* Thread header */}
                        <header style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 28px', borderBottom: '1px solid #1F1D1B', flexShrink: 0,
                            backdropFilter: 'blur(12px)', background: 'rgba(23,22,21,0.9)'
                        }}>
                            <h2 style={{ fontSize: 13.5, fontWeight: 500, color: '#76716A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                                {activeChat?.title ?? 'New Thread'}
                            </h2>
                            <div style={{ display: 'flex', gap: 6, color: '#3D3A36', fontSize: 12 }}>
                                <button className="composer-btn" style={{ fontSize: 12, gap: 4, padding: '4px 8px' }}>
                                    <SearchIcon /> Focus
                                </button>
                            </div>
                        </header>

                        {/* Messages */}
                        <div style={{
                            flex: 1, overflowY: 'auto', padding: '32px 0',
                            display: 'flex', flexDirection: 'column', gap: 0
                        }}>
                            {isLoading && messages.length === 0 && (
                                <div style={{ textAlign: 'center', paddingTop: 40 }}>
                                    <p style={{ fontSize: 13, color: '#3D3A36' }}>Loading thread...</p>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div key={msg._id ?? i} className="msg-enter" style={{
                                    padding: '12px 28px',
                                    ...(msg.role === 'user' ? { display: 'flex', justifyContent: 'flex-end' } : {})
                                }}>
                                    {msg.role === 'user' ? (
                                        /* User message — pill bubble */
                                        <div style={{
                                            background: '#252220',
                                            border: '1px solid #2E2B28',
                                            borderRadius: '18px 18px 4px 18px',
                                            padding: '10px 16px',
                                            maxWidth: '62%',
                                            fontSize: 14,
                                            color: '#E8E4DC',
                                            lineHeight: 1.6
                                        }}>
                                            {msg.content}
                                        </div>
                                    ) : (
                                        /* AI message — no bubble, just text with icon */
                                        <div style={{ maxWidth: 700, margin: '0 auto', width: '100%', padding: '0 0' }}>
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                                {/* Perplexity icon */}
                                                <div style={{
                                                    width: 26, height: 26, borderRadius: 7, background: '#20B2A8',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0, marginTop: 2, color: '#fff'
                                                }}>
                                                    <PerplexityMark size={14} />
                                                </div>
                                                {/* Response text — rendered markdown */}
                                                <div className="md-body" style={{ flex: 1 }}>
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Thinking state */}
                            {isSending && (
                                <div className="msg-enter" style={{ padding: '12px 28px' }}>
                                    <div style={{ maxWidth: 700, margin: '0 auto', width: '100%' }}>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <div style={{
                                                width: 26, height: 26, borderRadius: 7, background: '#20B2A8',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0, color: '#fff'
                                            }}>
                                                <PerplexityMark size={14} />
                                            </div>
                                            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                                                <span className="dot" /><span className="dot" /><span className="dot" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ── Sticky bottom composer ── */}
                        <div style={{
                            padding: '12px 28px 20px', flexShrink: 0,
                            background: 'linear-gradient(to top, #171615 75%, transparent)',
                        }}>
                            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                                <div className="composer-wrap" style={{ padding: '12px 12px 8px' }}>
                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask a follow-up..."
                                        rows={1}
                                        disabled={isSending}
                                        style={{
                                            width: '100%', background: 'none', border: 'none', outline: 'none',
                                            resize: 'none', color: '#E8E4DC', fontSize: 14, lineHeight: 1.6,
                                            overflowY: 'hidden'
                                        }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="composer-btn" title="Search"><SearchIcon /></button>
                                            <button className="composer-btn" title="Attach"><AttachIcon /></button>
                                        </div>
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isSending}
                                            className={`send-btn ${input.trim() && !isSending ? 'active' : 'inactive'}`}
                                        >
                                            <SendIcon />
                                        </button>
                                    </div>
                                </div>
                                <p style={{ textAlign: 'center', fontSize: 11, color: '#3D3A36', marginTop: 8 }}>
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
