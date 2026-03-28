'use client'
import Nav from '@/components/Nav'

export default function Progress() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 60%, #EA580C 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(249,115,22,0.4)', filter: 'blur(35px)' }} />
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>My Progress ⭐</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>Look how far you&apos;ve come!</p>
      </div>
      <div style={{ padding: '28px 16px 100px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Subjects</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { subject: 'History',   pct: 45, color: '#EA580C', sessions: '12 sessions' },
            { subject: 'Writing',   pct: 70, color: '#7C3AED', sessions: '18 sessions' },
            { subject: 'Geography', pct: 30, color: '#4338CA', sessions: '8 sessions'  },
            { subject: 'Science',   pct: 20, color: '#065F46', sessions: '5 sessions'  },
          ].map(item => (
            <div key={item.subject} style={{ background: '#fff', borderRadius: 22, padding: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)', borderLeft: `5px solid ${item.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.subject}</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{item.sessions}</span>
              </div>
              <div style={{ height: 10, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 999 }} />
              </div>
              <p style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>{item.pct}% explored</p>
            </div>
          ))}
        </div>
      </div>
      <Nav active="progress" />
    </div>
  )
}
