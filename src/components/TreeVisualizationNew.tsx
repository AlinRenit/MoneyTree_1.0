import React, { useState, useEffect } from 'react'

interface TreeVisualizationProps {
  balance: number
  income: number
  expenses: number
  savings: number
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ 
  balance, 
  income, 
  expenses, 
  savings 
}) => {
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring')
  const [treeHealth, setTreeHealth] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good')
  const [animationKey, setAnimationKey] = useState(0)

  // Calculate tree growth metrics
  const getTreeMetrics = () => {
    const netIncome = income - expenses
    const savingsRate = income > 0 ? (netIncome / income) * 100 : 0
    const totalWealth = balance + savings
    
    // Branch count based on income levels
    const branchCount = Math.min(Math.floor(income / 500) + 2, 12)
    
    // Tree height based on balance
    const treeHeight = Math.max(60, Math.min(120, balance / 100 + 60))
    
    // Branch depth (how far branches extend)
    const branchDepth = Math.max(2, Math.min(6, Math.floor(totalWealth / 1000)))
    
    return { netIncome, savingsRate, branchCount, treeHeight, branchDepth, totalWealth }
  }

  // Determine tree health based on financial metrics
  useEffect(() => {
    const { netIncome, savingsRate } = getTreeMetrics()
    
    if (balance >= 10000 && savingsRate >= 20) {
      setTreeHealth('excellent')
      setSeason('summer')
    } else if (balance >= 5000 && savingsRate >= 10) {
      setTreeHealth('good') 
      setSeason('spring')
    } else if (balance >= 1000 && savingsRate >= 5) {
      setTreeHealth('fair')
      setSeason('autumn')
    } else {
      setTreeHealth('poor')
      setSeason('winter')
    }
    
    // Trigger animation when financial state changes significantly
    setAnimationKey(prev => prev + 1)
  }, [balance, income, expenses])

  // Generate simple, clean branches that actually look like a tree
  const generateBranches = (branchCount: number, treeHeight: number) => {
    const branches = []
    const trunkX = 140
    const trunkBottom = 260
    const trunkTop = trunkBottom - treeHeight
    
    // Create main branches at different levels
    const mainBranches = Math.min(6, Math.max(3, branchCount))
    
    for (let i = 0; i < mainBranches; i++) {
      const level = (i + 1) / (mainBranches + 1) // 0.2 to 0.8
      const branchY = trunkTop + (treeHeight * level * 0.7) // Start from higher up
      const side = i % 2 === 0 ? 1 : -1 // Alternate sides
      const branchLength = 30 + (income / 1000) * 5 // Longer branches with more income
      const upwardAngle = Math.PI / 6 // 30 degrees upward
      
      const endX = trunkX + (branchLength * Math.cos(upwardAngle)) * side
      const endY = branchY - (branchLength * Math.sin(upwardAngle))
      
      branches.push({
        startX: trunkX,
        startY: branchY,
        endX: endX,
        endY: endY,
        thickness: Math.max(3, 8 - i),
        hasLeaves: balance > 500 * (i + 1),
        level: i
      })
    }
    
    return branches
  }

  const { branchCount, treeHeight } = getTreeMetrics()
  const branches = generateBranches(branchCount, treeHeight)

  return (
    <div className="bg-gradient-to-b from-sky-200 via-green-100 to-amber-50 p-6 rounded-lg shadow-lg h-96 relative overflow-hidden">
      <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">Your Money Tree</h2>
      
      {/* Realistic Tree Visualization */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="relative" key={animationKey}>
          
          {/* Ground with grass */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-56 h-6 bg-gradient-to-t from-green-800 via-green-600 to-green-400 rounded-full opacity-80"></div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-48 h-3 bg-green-700 rounded-full opacity-60"></div>
          
          {/* Beautiful Tree SVG */}
          <svg 
            width="300" 
            height="320" 
            viewBox="0 0 300 320" 
            className="drop-shadow-xl"
          >
            {/* Tree Trunk with natural shape */}
            <path 
              d={`M 145 300 
                  Q 142 280 140 260
                  Q 138 240 136 220
                  Q 135 200 134 180
                  Q 133 160 132 ${300 - treeHeight}
                  Q 134 ${300 - treeHeight} 136 ${300 - treeHeight}
                  Q 138 160 139 180
                  Q 141 200 143 220  
                  Q 145 240 147 260
                  Q 149 280 152 300 Z`}
              fill="#8B4513"
            />
            
            {/* Trunk texture */}
            <path 
              d={`M 143 300 
                  Q 141 280 140 260
                  Q 139 240 138 220
                  Q 137 200 136 180
                  Q 135 160 134 ${300 - treeHeight + 20}
                  Q 136 ${300 - treeHeight + 20} 138 ${300 - treeHeight + 20}
                  Q 139 160 140 180
                  Q 141 200 142 220  
                  Q 143 240 144 260
                  Q 145 280 147 300 Z`}
              fill="#A0522D"
            />

            {/* Main Crown - Large leafy area */}
            {season !== 'winter' && (
              <>
                {/* Multiple overlapping foliage clusters for natural look */}
                <ellipse cx="140" cy={120 - Math.max(0, (treeHeight - 80) / 3)} rx={50 + (balance / 800)} ry={40 + (balance / 1000)} 
                  fill={season === 'autumn' ? '#DAA520' : season === 'spring' ? '#90EE90' : '#228B22'} opacity="0.9"/>
                
                <ellipse cx="110" cy={130 - Math.max(0, (treeHeight - 80) / 3)} rx={35 + (balance / 1200)} ry={30 + (balance / 1500)} 
                  fill={season === 'autumn' ? '#CD853F' : season === 'spring' ? '#98FB98' : '#32CD32'} opacity="0.8"/>
                
                <ellipse cx="170" cy={125 - Math.max(0, (treeHeight - 80) / 3)} rx={40 + (balance / 1000)} ry={35 + (balance / 1200)} 
                  fill={season === 'autumn' ? '#B8860B' : season === 'spring' ? '#9AFF9A' : '#228B22'} opacity="0.8"/>
                
                <ellipse cx="140" cy={100 - Math.max(0, (treeHeight - 80) / 4)} rx={30 + (balance / 1500)} ry={25 + (balance / 1800)} 
                  fill={season === 'autumn' ? '#DAA520' : season === 'spring' ? '#90EE90' : '#006400'} opacity="0.9"/>
              </>
            )}

            {/* Natural Branches */}
            {branches.map((branch, index) => (
              <g key={index}>
                {/* Main branch */}
                <path 
                  d={`M ${branch.startX} ${branch.startY} 
                      Q ${branch.startX + (branch.endX - branch.startX) * 0.3} ${branch.startY - 10} 
                      ${branch.endX} ${branch.endY}`}
                  stroke="#8B4513" 
                  strokeWidth={branch.thickness} 
                  fill="none"
                  strokeLinecap="round"
                />
                
                {/* Secondary branches */}
                {branch.hasLeaves && income > 2000 && (
                  <>
                    <path 
                      d={`M ${branch.endX} ${branch.endY} 
                          Q ${branch.endX + 15} ${branch.endY - 8} 
                          ${branch.endX + 25} ${branch.endY - 15}`}
                      stroke="#654321" 
                      strokeWidth="2" 
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path 
                      d={`M ${branch.endX} ${branch.endY} 
                          Q ${branch.endX - 12} ${branch.endY - 10} 
                          ${branch.endX - 20} ${branch.endY - 18}`}
                      stroke="#654321" 
                      strokeWidth="2" 
                      fill="none"
                      strokeLinecap="round"
                    />
                  </>
                )}
                
                {/* Fruits scattered naturally */}
                {savings > 1000 && season === 'summer' && branch.level < 4 && (
                  <>
                    <circle cx={branch.endX + 8} cy={branch.endY - 12} r="4" fill="#FF6347" className="animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}/>
                    <circle cx={branch.endX - 6} cy={branch.endY - 8} r="4" fill="#FFA500" className="animate-bounce" style={{ animationDelay: `${index * 0.2 + 0.1}s` }}/>
                    {savings > 3000 && <circle cx={branch.endX + 2} cy={branch.endY - 18} r="4" fill="#FF4500" className="animate-bounce" style={{ animationDelay: `${index * 0.2 + 0.2}s` }}/>}
                  </>
                )}
                
                {/* Flowers for spring */}
                {income > 1500 && season === 'spring' && branch.level < 3 && (
                  <>
                    <circle cx={branch.endX + 5} cy={branch.endY - 5} r="3" fill="#FFB6C1"/>
                    <circle cx={branch.endX + 5} cy={branch.endY - 5} r="1.5" fill="#FF69B4"/>
                    <circle cx={branch.endX - 8} cy={branch.endY - 10} r="3" fill="#FFC0CB"/>
                    <circle cx={branch.endX - 8} cy={branch.endY - 10} r="1.5" fill="#FF1493"/>
                  </>
                )}
              </g>
            ))}

            {/* Money effects floating around tree */}
            {treeHealth === 'excellent' && (
              <g>
                <text x="80" y="100" className="animate-bounce" fontSize="16" style={{ animationDelay: '0s' }}>💰</text>
                <text x="210" y="90" className="animate-bounce" fontSize="16" style={{ animationDelay: '0.5s' }}>💸</text>
                <text x="140" y="70" className="animate-bounce" fontSize="16" style={{ animationDelay: '1s' }}>💵</text>
                <text x="60" y="140" className="animate-bounce" fontSize="14" style={{ animationDelay: '1.5s' }}>🪙</text>
                <text x="220" y="130" className="animate-bounce" fontSize="14" style={{ animationDelay: '2s' }}>�</text>
              </g>
            )}

            {/* Storm effects for poor health */}
            {treeHealth === 'poor' && (
              <>
                <ellipse cx="90" cy="60" rx="25" ry="15" fill="#696969" opacity="0.8"/>
                <ellipse cx="190" cy="50" rx="30" ry="18" fill="#555" opacity="0.8"/>
                <text x="140" y="40" textAnchor="middle" fontSize="20" className="animate-pulse">⚡</text>
                <text x="100" y="30" fontSize="16" className="animate-pulse">⛈️</text>
              </>
            )}
          </svg>
          
          {/* Falling leaves animation for autumn */}
          {season === 'autumn' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="text-orange-400 text-xs absolute top-4 left-8 animate-bounce" style={{ animationDelay: '0s' }}>🍂</div>
              <div className="text-red-400 text-xs absolute top-12 right-12 animate-bounce" style={{ animationDelay: '1s' }}>🍂</div>
              <div className="text-yellow-400 text-xs absolute top-20 left-16 animate-bounce" style={{ animationDelay: '2s' }}>🍂</div>
            </div>
          )}
          
          {/* Money rain for excellent performance */}
          {treeHealth === 'excellent' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="text-yellow-400 text-sm absolute top-2 left-4 animate-bounce">💰</div>
              <div className="text-green-400 text-sm absolute top-6 right-6 animate-bounce" style={{ animationDelay: '0.5s' }}>💵</div>
              <div className="text-yellow-400 text-sm absolute top-10 left-12 animate-bounce" style={{ animationDelay: '1s' }}>💰</div>
            </div>
          )}
          
          {/* Seasonal decorations */}
          {season === 'winter' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
