import React from 'react'

interface NavigationProps {
  activeSection: 'dashboard' | 'goals' | 'predictions'
  setActiveSection: (section: 'dashboard' | 'goals' | 'predictions') => void
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-green-200">
      <div className="container mx-auto px-4">
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
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <span className="text-lg" title="Savings Goal Achievement">🏆</span>
              <span className="text-lg" title="Consistent Tracker">⭐</span>
              <span className="text-lg" title="Budget Master">💎</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
