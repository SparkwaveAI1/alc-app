'use client'

import { useState, useEffect } from 'react'

type Challenge = { id: string; question: string; hint: string; completed: boolean; answer_submitted: string | null }

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ariaReply, setAriaReply] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)

  useEffect(() => { loadChallenge() }, [])

  async function loadChallenge() {
    const res = await fetch('/api/daily-challenge')
    const data = await res.json()
    setChallenge(data)
    if (data?.completed) {
      setSubmitted(true)
      setAnswer(data.answer_submitted || '')
    }
    setLoading(false)
  }

  async function submit() {
    if (!answer.trim() || !challenge) return
    setReplyLoading(true)

    // Save answer
    await fetch('/api/daily-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: challenge.id, answer }),
    })

    // Get Aria's response
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Daily Challenge',
        messages: [
          { role: 'user', content: `Daily challenge question: "${challenge.question}"\n\nMy answer: "${answer}"` }
        ],
        context: 'The learner just answered a daily thinking challenge. Respond with genuine curiosity about their answer — celebrate the effort, ask one follow-up question to extend their thinking, and share one related interesting fact. Keep it to 3-4 sentences max.',
      }),
    })
    const data = await res.json()
    setAriaReply(data.message || '')
    setSubmitted(true)
    setReplyLoading(false)
  }

  if (loading) return null
  if (!challenge) return null

  return (
    <div style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', borderRadius: 22, padding: '18px 18px 16px', marginBottom: 20, boxShadow: '0 4px 16px rgba(245,158,11,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ background: 'linear-gradient(135deg, #B45309, #F59E0B)', borderRadius: 10, padding: '4px 12px', display: 'flex', gap: 5, alignItems: 'center' }}>
          <span style={{ fontSize: 14 }}>⚡</span>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }}>TODAY&apos;S CHALLENGE</span>
        </div>
        {challenge.completed && <span style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>✅ Done!</span>}
      </div>

      <div style={{ fontSize: 16, fontWeight: 700, color: '#78350F', lineHeight: 1.5, marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {challenge.question}
      </div>

      {!submitted ? (
        <>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="What do you think? There's no wrong answer here..."
            rows={3}
            style={{ width: '100%', borderRadius: 14, border: '1.5px solid #FCD34D', padding: '12px 14px', fontSize: 14, background: 'rgba(255,255,255,0.7)', color: '#1C1917', outline: 'none', resize: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", marginBottom: 10 }}
          />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={submit} disabled={!answer.trim() || replyLoading} style={{ flex: 1, background: answer.trim() ? 'linear-gradient(135deg, #B45309, #F59E0B)' : '#E5E7EB', color: answer.trim() ? '#fff' : '#9CA3AF', fontWeight: 700, fontSize: 14, padding: '11px', borderRadius: 999, border: 'none', cursor: answer.trim() ? 'pointer' : 'not-allowed' }}>
              {replyLoading ? '🦋 Aria is thinking...' : '✓ Submit my answer'}
            </button>
            <button onClick={() => setShowHint(!showHint)} style={{ background: 'rgba(255,255,255,0.6)', border: '1.5px solid #FCD34D', borderRadius: 999, padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#B45309', cursor: 'pointer' }}>
              💡 Hint
            </button>
          </div>
          {showHint && challenge.hint && (
            <div style={{ marginTop: 10, background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
              💡 {challenge.hint}
            </div>
          )}
        </>
      ) : (
        <div>
          <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 14, padding: '12px 14px', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#B45309', marginBottom: 5 }}>YOUR ANSWER</div>
            <div style={{ fontSize: 14, color: '#1C1917', lineHeight: 1.5 }}>{answer}</div>
          </div>
          {ariaReply && (
            <div style={{ background: 'linear-gradient(135deg, #7C3AED22, #D946EF15)', borderRadius: 14, padding: '12px 14px', border: '1px solid #E9D5FF', display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🦋</span>
              <div style={{ fontSize: 13, color: '#4C1D95', lineHeight: 1.6 }}>{ariaReply}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
