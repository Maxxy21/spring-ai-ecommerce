import { useState, useRef, useEffect } from 'react'
import { aiApi } from '../services/api'

const SUGGESTIONS = [
  'Show me wireless headphones under $100',
  'What books do you have in stock?',
  'I need fitness equipment for a home gym',
  'Compare your keyboards and mice',
]

let msgId = 0
const newMessage = (role, content, extra = {}) => ({ id: ++msgId, role, content, ...extra })

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    newMessage('assistant', "Hi! I'm your AI shopping assistant powered by Spring AI. I can search your product catalog in real time — ask me anything."),
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message || loading) return
    setInput('')
    setMessages(prev => [...prev, newMessage('user', message)])
    setLoading(true)
    try {
      const res = await aiApi.chat(message, sessionId)
      setSessionId(res.sessionId)
      setMessages(prev => [...prev, newMessage('assistant', res.message)])
    } catch (err) {
      setMessages(prev => [...prev, newMessage('assistant', `Error: ${err.message}`, { error: true })])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div
      className="flex flex-col max-w-2xl mx-auto overflow-hidden"
      style={{
        height: 'calc(100vh - 10rem)',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #ff4d2e, #ff8c35)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-void-100">AI Product Assistant</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
            Spring AI · GPT-4o-mini · Function calling
          </p>
        </div>
        <span
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-wider"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
          >
            {msg.role === 'assistant' && (
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5"
                style={{
                  background: 'rgba(255,77,46,0.1)',
                  border: '1px solid rgba(255,77,46,0.2)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,77,46,0.8)" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </div>
            )}
            <div
              className="max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
              style={
                msg.role === 'user'
                  ? {
                      background: 'linear-gradient(135deg, #ff4d2e, #ff8c35)',
                      color: 'white',
                      borderBottomRightRadius: '0.375rem',
                      boxShadow: '0 0 20px rgba(255,77,46,0.2)',
                    }
                  : msg.error
                  ? {
                      background: 'rgba(239,68,68,0.08)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderBottomLeftRadius: '0.375rem',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      color: '#c8c8db',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderBottomLeftRadius: '0.375rem',
                    }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start" aria-label="Assistant is thinking">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center mr-2.5 flex-shrink-0"
              style={{ background: 'rgba(255,77,46,0.1)', border: '1px solid rgba(255,77,46,0.2)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,77,46,0.8)" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
            <div
              className="rounded-2xl rounded-bl-sm px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex gap-1.5 items-center">
                {[0, 150, 300].map(delay => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: '#ff6b4e',
                      animation: `pulseDot 1.4s ease-in-out ${delay}ms infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div
          className="px-5 pb-3 flex flex-wrap gap-2 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.75rem' }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.35)',
                border: '1px solid rgba(255,255,255,0.07)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,77,46,0.1)'
                e.currentTarget.style.color = '#ff8c7e'
                e.currentTarget.style.borderColor = 'rgba(255,77,46,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="px-5 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex gap-2.5">
          <label htmlFor="chat-input" className="sr-only">Message</label>
          <input
            id="chat-input"
            ref={inputRef}
            className="input flex-1 text-sm"
            placeholder="Ask about products…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary px-4 flex-shrink-0"
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
