import { useState, useRef, useEffect } from 'react'
import { aiApi } from '../services/api'

const SUGGESTIONS = [
  'Show me wireless headphones under $100',
  'What books do you have in stock?',
  'I need fitness equipment for a home gym',
  'Compare your keyboards and mice',
]

let messageIdCounter = 0
const newMessage = (role, content, extra = {}) => ({
  id: ++messageIdCounter,
  role,
  content,
  ...extra,
})

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    newMessage('assistant', "Hi! I'm your AI shopping assistant powered by Spring AI with function calling. I can search your product catalog in real time. What are you looking for?"),
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const message = (text || input).trim()
    if (!message || loading) return

    setInput('')
    setMessages(prev => [...prev, newMessage('user', message)])
    setLoading(true)

    try {
      const res = await aiApi.chat(message, sessionId)
      setSessionId(res.sessionId)
      setMessages(prev => [...prev, newMessage('assistant', res.message)])
    } catch (err) {
      setMessages(prev => [...prev, newMessage('assistant', `Sorry, I ran into an error: ${err.message}`, { error: true })])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      <div className="card flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm" aria-hidden="true">🤖</div>
          <div>
            <p className="text-sm font-semibold">AI Product Assistant</p>
            <p className="text-xs text-gray-400">Spring AI · OpenAI GPT-4o-mini · Function Calling</p>
          </div>
          <span className="ml-auto badge-green">Live</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-sm'
                    : msg.error
                    ? 'bg-red-50 text-red-700 border border-red-100 rounded-bl-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start" aria-label="Assistant is typing">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="text-xs bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100">
          <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex gap-2">
            <label htmlFor="chat-input" className="sr-only">Message</label>
            <input
              id="chat-input"
              className="input flex-1"
              placeholder="Ask about products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
