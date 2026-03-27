'use client'

export default function Create() {
  return (
    <div className="min-h-screen bg-[#FFF8F1]">
      <div className="px-6 pt-8 pb-8">
        <h1 className="text-3xl font-bold text-[#813EA0] mb-8">Create ✏️</h1>
        
        <div className="space-y-4">
          {[
            { name: 'Journal Entry', icon: '📓', color: '#8DF7CC' },
            { name: 'Art Project', icon: '🎨', color: '#F7D8FF' },
            { name: 'Research Notes', icon: '📝', color: '#FFE6D4' },
          ].map((item) => (
            <button
              key={item.name}
              className="w-full bg-white rounded-2xl p-6 shadow-sm border-l-4 text-left hover:shadow-md transition-shadow"
              style={{ borderLeftColor: item.color }}
            >
              <h3 className="text-xl font-bold text-[#1E1B17]">
                {item.icon} {item.name}
              </h3>
              <p className="text-sm text-[#4D4350] mt-1">Start creating now</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
