import ChatWindow from '../components/ChatWindow'

export default function AiChatPage() {
  return (
    <div className="page-container">
      <div className="mb-6 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4"
             style={{ background: 'rgba(255,77,46,0.08)', border: '1px solid rgba(255,77,46,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-pulse" />
          <span className="eyebrow" style={{ fontSize: '9px', letterSpacing: '0.22em' }}>Spring AI · GPT-4o-mini</span>
        </div>
        <h1
          className="mb-2"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 300,
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            color: '#f2f2f7',
            letterSpacing: '-0.02em',
          }}
        >
          AI Product Assistant
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
          Ask about products, prices, availability — powered by real-time function calling.
        </p>
      </div>
      <ChatWindow />
    </div>
  )
}
