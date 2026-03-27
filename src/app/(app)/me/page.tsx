'use client'

export default function Me() {
  return (
    <div className="min-h-screen bg-[#FFF8F1]">
      <div className="px-6 pt-8 pb-8">
        <h1 className="text-3xl font-bold text-[#813EA0] mb-8">Hi, Zoe! 👤</h1>
        
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#813EA0]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F7D8FF] to-[#E6C9F3] rounded-full flex items-center justify-center text-3xl">
                👧
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1E1B17]">Zoe</h3>
                <p className="text-sm text-[#4D4350]">10 years old • Adventure seeker</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h2 className="text-sm font-bold text-[#4D4350] uppercase tracking-wide mb-3">Settings</h2>
            <div className="space-y-2">
              <button className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:bg-[#F9F3EB] transition-colors">
                <p className="font-semibold text-[#1E1B17]">⚙️ Preferences</p>
              </button>
              <button className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:bg-[#F9F3EB] transition-colors">
                <p className="font-semibold text-[#1E1B17]">🔔 Notifications</p>
              </button>
              <button className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:bg-[#F9F3EB] transition-colors">
                <p className="font-semibold text-[#1E1B17]">❓ Help & Support</p>
              </button>
              <button className="w-full bg-white rounded-2xl p-4 shadow-sm text-left hover:bg-[#F9F3EB] transition-colors">
                <p className="font-semibold text-[#1E1B17]">🚪 Logout</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
