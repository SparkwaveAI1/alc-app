'use client'

export default function Explore() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF7ED', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)',
        borderRadius: '0 0 28px 28px',
        padding: '52px 20px 32px',
        position: 'relative', overflow: 'hidden', minHeight: 150,
      }}>
        <div style={{ position: 'absolute', top: -10, right: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(168,85,247,0.4)', filter: 'blur(35px)' }} />
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', zIndex: 1 }}>
          Explore 🔭
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, margin: '6px 0 0', position: 'relative', zIndex: 1 }}>
          Discover new worlds and ideas
        </p>
      </div>

      <div style={{ padding: '28px 16px 120px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Featured Topics</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { name: 'World Geography', icon: '🌍', subject: 'GEOGRAPHY', bg: 'linear-gradient(135deg, #1E1B4B, #4338CA)', shadow: 'rgba(30,27,75,0.35)' },
            { name: 'Ancient History', icon: '🏛️', subject: 'HISTORY',   bg: 'linear-gradient(135deg, #78350F, #EA580C)', shadow: 'rgba(120,53,15,0.35)' },
            { name: 'Life Science',    icon: '🌱', subject: 'SCIENCE',   bg: 'linear-gradient(135deg, #065F46, #10B981)', shadow: 'rgba(6,95,70,0.35)' },
          ].map(item => (
            <div key={item.name} style={{ borderRadius: 22, background: item.bg, padding: '18px 18px 16px', boxShadow: `0 6px 22px ${item.shadow}` }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '4px 12px', marginBottom: 10 }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px' }}>{item.subject}</span>
              </div>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
