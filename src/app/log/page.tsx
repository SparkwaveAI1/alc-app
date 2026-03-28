'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'

export default function LogPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [duration, setDuration] = useState('')
  const [logType, setLogType] = useState('note')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      await fetch('/api/learning-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), notes, log_type: logType, duration_minutes: duration ? parseInt(duration) : null })
      })
      router.replace('/')
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif", paddingBottom: 90 }}>
      <div style={{ background: 'linear-gradient(135deg, #4CAF7C, #68D391)', padding: '48px 20px 28px', borderRadius: '0 0 28px 28px' }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 12 }}>← Back</Link>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Nunito', sans-serif" }}>Log Learning 📝</h1>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
        <select value={logType} onChange={e => setLogType(e.target.value)} style={{
          width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '10px 12px',
          fontSize: 14, marginBottom: 12, background: '#FFF7ED', color: '#2D2A26', outline: 'none',
          fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
        }}>
          <option value="note">📝 Quick note</option>
          <option value="practice">🎵 Practiced</option>
          <option value="watched">👀 Watched</option>
          <option value="created">🎨 Created</option>
          <option value="read">📖 Read</option>
        </select>

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What did you do?" style={{
          width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '10px 12px',
          fontSize: 14, marginBottom: 12, background: '#FFF7ED', color: '#2D2A26', outline: 'none',
          fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
        }} />

        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (minutes, optional)" style={{
          width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '10px 12px',
          fontSize: 14, marginBottom: 12, background: '#FFF7ED', color: '#2D2A26', outline: 'none',
          fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
        }} />

        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes? (optional)" style={{
          width: '100%', borderRadius: 12, border: '1.5px solid #E8E2D9', padding: '10px 12px',
          fontSize: 14, marginBottom: 14, background: '#FFF7ED', color: '#2D2A26', outline: 'none',
          fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box', minHeight: 80, resize: 'vertical',
        }} />

        <button onClick={handleSave} disabled={!title.trim() || saving} style={{
          width: '100%', background: title.trim() && !saving ? '#4CAF7C' : '#E5E7EB',
          color: title.trim() && !saving ? '#fff' : '#9E9792', border: 'none', borderRadius: 12,
          padding: '12px', fontWeight: 700, fontSize: 15, cursor: title.trim() && !saving ? 'pointer' : 'default',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {saving ? 'Saving...' : '✅ Log it'}
        </button>
      </div>

      <Nav active="create" />
    </div>
  )
}
