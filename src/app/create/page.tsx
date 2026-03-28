'use client'
import Nav from '@/components/Nav'

export default function Create() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ background: 'linear-gradient(135deg, #D946EF 0%, #EC4899 60%, #F97316 100%)', borderRadius: '0 0 28px 28px', padding: '52px 20px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(249,115,22,0.4)', filter: 'blur(35px)' }} />
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>Create ✏️</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>Make something amazing today</p>
      </div>
      <div style={{ padding: '28px 16px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { icon: '📓', label: 'Journal Entry',  desc: 'Write about your day or thoughts', bg: 'linear-gradient(135deg, #8DF7CC, #5EE8B2)', color: '#065F46' },
            { icon: '🎨', label: 'Art Project',     desc: 'Express yourself visually',        bg: 'linear-gradient(135deg, #F7D8FF, #E8B8FF)', color: '#7C3AED' },
            { icon: '📝', label: 'Research Notes',  desc: 'Capture what you are learning',    bg: 'linear-gradient(135deg, #FFE2DC, #FFBCB2)', color: '#9A3412' },
          ].map(item => (
            <button key={item.label} style={{ background: item.bg, borderRadius: 22, padding: '20px 18px', border: 'none', cursor: 'pointer', textAlign: 'left', boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ color: item.color, fontSize: 18, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.label}</div>
              <div style={{ color: item.color, fontSize: 13, opacity: 0.75, marginTop: 4 }}>{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <Nav active="create" />
    </div>
  )
}
