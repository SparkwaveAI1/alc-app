'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF8F1]">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-gradient-to-b from-[#F9F3EB] to-[#FFF8F1]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#813EA0]">Hi, Zoe! 👋</h1>
          <button className="text-2xl">⚙️</button>
        </div>

        {/* Streak Badge */}
        <div className="inline-block bg-[#FD7D69] text-white px-4 py-2 rounded-full text-sm font-semibold">
          🔥 7 Day Streak!
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-8 pb-12">
        {/* Today's Learning Section */}
        <div>
          <h2 className="text-xl font-bold text-[#1E1B17] mb-4">Today's Learning</h2>
          <div className="space-y-3">
            {/* Activity Card 1: Ancient Egypt */}
            <div className="bg-white rounded-2xl p-5 shadow-sm vs-card-accent-coral border-l-4 border-[#FD7D69]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#1E1B17]">Ancient Egypt 🏛️</h3>
                  <p className="text-sm text-[#4D4350]">Pyramids & Pharaohs · 20 min</p>
                </div>
              </div>
              <div className="w-full bg-[#E8D5C4] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#FD7D69] to-[#FF9283] h-2 rounded-full"
                  style={{ width: '35%' }}
                />
              </div>
            </div>

            {/* Activity Card 2: Creative Writing */}
            <div className="bg-white rounded-2xl p-5 shadow-sm vs-card-accent-lavender border-l-4 border-[#813EA0]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#1E1B17]">Creative Writing ✍️</h3>
                  <p className="text-sm text-[#4D4350]">Story Starter · 15 min</p>
                </div>
              </div>
              <div className="w-full bg-[#E8D5C4] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#813EA0] to-[#9C58BB] h-2 rounded-full"
                  style={{ width: '60%' }}
                />
              </div>
            </div>

            {/* Activity Card 3: Math Patterns */}
            <div className="bg-white rounded-2xl p-5 shadow-sm vs-card-accent-mint border-l-4 border-[#00694D]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#1E1B17]">Math Patterns 🔢</h3>
                  <p className="text-sm text-[#4D4350]">Number Sequences · 10 min</p>
                </div>
              </div>
              <div className="w-full bg-[#E8D5C4] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#00694D] to-[#00A478] h-2 rounded-full"
                  style={{ width: '25%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Create & Save Section */}
        <div>
          <h2 className="text-xl font-bold text-[#1E1B17] mb-4">Create & Save</h2>
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-[#8DF7CC] hover:bg-[#7BE3B8] text-[#00694D] font-semibold py-3 px-2 rounded-full text-sm transition-colors">
              📓 Journal
            </button>
            <button className="bg-[#F7D8FF] hover:bg-[#ECB8FF] text-[#813EA0] font-semibold py-3 px-2 rounded-full text-sm transition-colors">
              🎨 Art
            </button>
            <button className="bg-[#FFE6D4] hover:bg-[#FFCCA0] text-[#A43B2D] font-semibold py-3 px-2 rounded-full text-sm transition-colors">
              📝 Notes
            </button>
          </div>
        </div>

        {/* AI Companion Bubble */}
        <div className="bg-[#F7D8FF] rounded-3xl rounded-br-lg p-5 mt-8">
          <p className="text-sm text-[#813EA0] font-medium mb-3">
            What would you like to explore today, Zoe? 🌟
          </p>
          <button className="bg-[#FD7D69] hover:bg-[#FF9283] text-white font-semibold py-2 px-4 rounded-full text-sm transition-colors">
            Let's go →
          </button>
        </div>
      </div>
    </div>
  )
}
