import React, { useEffect, useState } from 'react'

interface TreeVisualizationProps {
  balance: number
  income: number
  expenses: number
  savings: number
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ balance, income, expenses, savings }) => {
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('summer')
  const [animationKey, setAnimationKey] = useState(0)

  // Determine tree health based on financial wellness
  const getTreeHealth = () => {
    const savingsRatio = savings / (income || 1)
    const expenseRatio = expenses / (income || 1)
    
    if (savingsRatio > 0.2 && expenseRatio < 0.8) return 'excellent'
    if (savingsRatio > 0.1 && expenseRatio < 0.9) return 'good'
    if (expenseRatio < 1.1) return 'fair'
    return 'poor'
  }

  const treeHealth = getTreeHealth()

  // Determine season based on financial state
  useEffect(() => {
    if (balance > 10000) setSeason('summer') // Flourishing
    else if (balance > 5000) setSeason('spring') // Growing
    else if (balance > 0) setSeason('autumn') // Stable but declining
    else setSeason('winter') // Struggling
    
    setAnimationKey(prev => prev + 1)
  }, [balance])

  const getTreeColor = () => {
    switch (season) {
      case 'spring': return 'text-green-400'
      case 'summer': return 'text-green-500'
      case 'autumn': return 'text-yellow-600'
      case 'winter': return 'text-gray-500'
    }
  }

  const getHealthMeterColor = () => {
    switch (treeHealth) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-lime-500'
      case 'fair': return 'bg-yellow-500'
      case 'poor': return 'bg-red-500'
    }
  }

  const getHealthPercentage = () => {
    switch (treeHealth) {
      case 'excellent': return 90
      case 'good': return 70
      case 'fair': return 50
      case 'poor': return 20
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 h-full flex flex-col">
      {/* Tree Health Meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Tree Health</h3>
          <span className="text-sm font-medium text-gray-600 capitalize">{treeHealth}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${getHealthMeterColor()}`}
            style={{ width: `${getHealthPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Main Tree Visualization */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="relative" key={animationKey}>
          {/* Tree Trunk */}
          <div className="flex flex-col items-center">
            <div className="w-4 h-20 bg-amber-800 rounded-b-lg relative">
              {/* Tree rings for age/milestones */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-1 bg-amber-900 absolute top-2"></div>
                <div className="w-full h-1 bg-amber-900 absolute top-8"></div>
                <div className="w-full h-1 bg-amber-900 absolute top-14"></div>
              </div>
            </div>
            
            {/* Tree Crown */}
            <div className="relative -mt-16">
              {/* Main crown */}
              <div className={`text-8xl ${getTreeColor()} animate-pulse`}>
                {season === 'spring' && '🌱'}
                {season === 'summer' && '🌳'}
                {season === 'autumn' && '🍂'}
                {season === 'winter' && '🌿'}
              </div>
              
              {/* Floating elements based on financial state */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Income blossoms */}
                {income > 0 && (
                  <>
                    <div className="absolute -top-4 -left-4 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🌸</div>
                    <div className="absolute -top-2 -right-6 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌺</div>
                    <div className="absolute -bottom-2 -left-6 text-lg animate-bounce" style={{ animationDelay: '1s' }}>🌼</div>
                  </>
                )}
                
                {/* Savings fruits */}
                {savings > 1000 && (
                  <>
                    <div className="absolute -top-6 left-2 text-xl animate-pulse" style={{ animationDelay: '0.2s' }}>🍎</div>
                    <div className="absolute -top-2 right-2 text-lg animate-pulse" style={{ animationDelay: '0.7s' }}>🍊</div>
                  </>
                )}
                
                {/* Golden coins for high savings */}
                {savings > 5000 && (
                  <>
                    <div className="absolute -top-8 left-0 text-sm animate-spin" style={{ animationDelay: '0.3s' }}>🪙</div>
                    <div className="absolute -bottom-4 right-0 text-sm animate-spin" style={{ animationDelay: '0.8s' }}>🪙</div>
                  </>
                )}
                
                {/* Falling leaves for expenses */}
                {expenses > income * 0.8 && (
                  <>
                    <div className="absolute top-8 -left-8 text-lg animate-bounce" style={{ animationDelay: '0.4s' }}>🍃</div>
                    <div className="absolute top-12 -right-8 text-sm animate-bounce" style={{ animationDelay: '0.9s' }}>🍃</div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Goal branches */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-8">
              {/* Emergency Fund Branch */}
              <div className="flex flex-col items-center">
                <div className="w-px h-8 bg-amber-700"></div>
                <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                <div className="text-xs text-gray-600 mt-1">Emergency</div>
                <div className="text-lg">🛡️</div>
              </div>
              
              {/* Vacation Branch */}
              <div className="flex flex-col items-center">
                <div className="w-px h-6 bg-amber-700"></div>
                <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                <div className="text-xs text-gray-600 mt-1">Vacation</div>
                <div className="text-lg">✈️</div>
              </div>
              
              {/* Investment Branch */}
              <div className="flex flex-col items-center">
                <div className="w-px h-10 bg-amber-700"></div>
                <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                <div className="text-xs text-gray-600 mt-1">Invest</div>
                <div className="text-lg">📈</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seasonal decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {season === 'winter' && (
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="animate-pulse text-white text-xs absolute top-4 left-4">❄️</div>
              <div className="animate-pulse text-white text-xs absolute top-8 right-8" style={{ animationDelay: '0.5s' }}>❄️</div>
              <div className="animate-pulse text-white text-xs absolute bottom-12 left-8" style={{ animationDelay: '1s' }}>❄️</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Financial Status Summary */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-600">Balance</div>
          <div className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-600">Season</div>
          <div className="font-bold text-green-600 capitalize">{season}</div>
        </div>
      </div>
    </div>
  )
}

export default TreeVisualization
