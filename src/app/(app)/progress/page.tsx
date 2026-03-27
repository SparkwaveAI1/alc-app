'use client'

export default function Progress() {
  return (
    <div className="min-h-screen bg-[#FFF8F1]">
      <div className="px-6 pt-8 pb-8">
        <h1 className="text-3xl font-bold text-[#813EA0] mb-8">My Progress ⭐</h1>
        
        <div className="space-y-6">
          {[
            { subject: 'History', progress: 45, color: '#FD7D69', sessions: '12 sessions' },
            { subject: 'Writing', progress: 70, color: '#813EA0', sessions: '18 sessions' },
            { subject: 'Math', progress: 30, color: '#00694D', sessions: '8 sessions' },
          ].map((item) => (
            <div key={item.subject} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[#1E1B17]">{item.subject}</h3>
                <span className="text-xs text-[#4D4350]">{item.sessions}</span>
              </div>
              <div className="w-full bg-[#E8D5C4] rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${item.progress}%`,
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                  }}
                />
              </div>
              <p className="text-xs text-[#4D4350] mt-2">{item.progress}% explored</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
