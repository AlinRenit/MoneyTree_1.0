import React from 'react'

interface NavigationProps {
  activeSection: 'dashboard' | 'goals' | 'predictions'
  setActiveSection: (section: 'dashboard' | 'goals' | 'predictions') => void
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-green-200">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🌳</div>
            <h1 className="text-xl font-bold text-green-800">Money Tree</h1>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-1">
            {(['dashboard', 'goals', 'predictions'] as const).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === section
                    ? 'bg-green-100 text-green-800 shadow-sm'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Profile */}
          <div className="flex items-center space-x-4">
            {/* Achievement Badges */}
            <div className="flex space-x-2">
              <div className="group relative">
                <span className="text-xl cursor-pointer hover:scale-110 transition-transform duration-200">🏆</span>
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Savings Champion
                </div>
              </div>
              <div className="group relative">
                <span className="text-xl cursor-pointer hover:scale-110 transition-transform duration-200">⭐</span>
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Daily Tracker
                </div>
              </div>
              <div className="group relative">
                <span className="text-xl cursor-pointer hover:scale-110 transition-transform duration-200">💎</span>
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Investment Pro
                </div>
              </div>
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* Profile Avatar */}
            <div className="group relative">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold" style={{display: 'none'}}>
                  A
                </div>
              </div>
              
              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <div className="font-medium text-gray-800">Alin Renit</div>
                  <div className="text-sm text-gray-500">Tree Health: Excellent 🌟</div>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                    <span>⚙️</span><span>Settings</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                    <span>📊</span><span>Reports</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                    <span>🎯</span><span>Goals</span>
                  </button>
                  <hr className="my-1" />
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center space-x-2">
                    <span>🚪</span><span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
