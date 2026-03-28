'use client'

import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

interface AriaChatProps {
  topic: string
  context?: string
  accentColor?: string
  initialMessage?: string
}

export default function AriaChat({ topic, context, accentColor = '#7C3AED', initialMessage }: AriaChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = initialMessage || `Hi Nayomi! 👋 I'm Aria, your learning guide for **${topic}**. What are you curious about? Or try telling me one thing you already know about this topic!`
      setMessages([{ role: 'assistant', content: greeting }])
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, topic, context }),
      })
      const data = await res.json()
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Hmm, I lost my train of thought! Try asking me again 😅" }])
    }
    setLoading(false)
  }

  // Render simple markdown: **bold** and line breaks
  function renderText(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    )
  }

  return (
    <>
      {/* Floating Aria bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 90, right: 16, zIndex: 200,
            width: 60, height: 60, borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}, #D946EF)`,
            border: 'none', cursor: 'pointer',
            boxShadow: `0 6px 24px ${accentColor}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}
        >
          🦋
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300,
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '75vh',
        }}>
          {/* Chat header */}
          <div style={{ background: `linear-gradient(135deg, ${accentColor}, #D946EF)`, borderRadius: '24px 24px 0 0', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🦋</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Aria</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Your learning guide · {topic}</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'assistant' && (
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}, #D946EF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, marginRight: 8, alignSelf: 'flex-end' }}>🦋</div>
                )}
                <div style={{
                  maxWidth: '78%',
                  background: m.role === 'user' ? `linear-gradient(135deg, ${accentColor}, #D946EF)` : '#F3F4F6',
                  color: m.role === 'user' ? '#fff' : '#1C1917',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '12px 14px',
                  fontSize: 14,
                  lineHeight: 1.55,
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}>
                  {renderText(m.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}, #D946EF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🦋</div>
                <div style={{ background: '#F3F4F6', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor, opacity: 0.4 + i * 0.3 }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask Aria anything..."
              style={{ flex: 1, borderRadius: 999, border: '1.5px solid #E5E7EB', padding: '11px 16px', fontSize: 14, outline: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", background: '#F9FAFB', color: '#1C1917' }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: input.trim() ? `linear-gradient(135deg, ${accentColor}, #D946EF)` : '#E5E7EB',
                border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                flexShrink: 0,
              }}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
