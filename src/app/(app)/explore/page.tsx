'use client'

export default function Explore() {
  return (
    <div className="min-h-screen bg-[#FFF8F1]">
      <div className="px-6 pt-8 pb-8">
        <h1 className="text-3xl font-bold text-[#813EA0] mb-8">Explore 🔭</h1>
        
        <div className="space-y-4">
          {[
            { name: 'Geography', icon: '🌍', color: '#FD7D69' },
            { name: 'Science', icon: '🔬', color: '#00694D' },
            { name: 'History', icon: '📚', color: '#813EA0' },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-2xl p-6 shadow-sm border-l-4"
              style={{ borderLeftColor: item.color }}
            >
              <h3 className="text-xl font-bold text-[#1E1B17] mb-2">
                {item.icon} {item.name}
              </h3>
              <p className="text-sm text-[#4D4350]">Discover amazing topics</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
