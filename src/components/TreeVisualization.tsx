import React, { useState } from 'react'

interface TreeVisualizationProps {
  balance: number
  income: number
  expenses: number
  savings: number
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ balance, income, expenses, savings }) => {
  // Simple growth calculations based on financial data
  const totalWealth = balance + savings
  const netIncome = income - expenses
  
  // Tree growth metrics (much simpler and more responsive)
  const treeHeight = Math.max(100, Math.min(400, totalWealth / 1000 + income / 500 + 100))
  const trunkWidth = Math.max(20, Math.min(80, totalWealth / 5000 + income / 2000 + 20))
  const leafCount = Math.max(5, Math.min(50, Math.floor(totalWealth / 2000) + Math.floor(income / 5000) + 5))
  const fruitCount = Math.max(0, Math.min(20, Math.floor(savings / 10000) + Math.floor(income / 20000)))
  
  // Tree health based on finances
  const getTreeHealth = () => {
    if (netIncome > 0 && totalWealth > 100000) return 'Excellent'
    if (netIncome > 0 && totalWealth > 50000) return 'Good'  
    if (netIncome >= 0) return 'Fair'
    return 'Poor'
  }
  
  // Colors based on health
  const getTreeColors = () => {
    const health = getTreeHealth()
    switch(health) {
      case 'Excellent': return { trunk: '#8B4513', leaves: '#228B22', fruits: '#FF6347' }
      case 'Good': return { trunk: '#A0522D', leaves: '#32CD32', fruits: '#FFA500' }
      case 'Fair': return { trunk: '#CD853F', leaves: '#9ACD32', fruits: '#FFD700' }
      default: return { trunk: '#D2691E', leaves: '#556B2F', fruits: '#DEB887' }
    }
  }
  
  const colors = getTreeColors()
  
  return (
    <div className="space-y-6">
      {/* Tree Display */}
      <div className="bg-gradient-to-b from-sky-200 via-green-100 to-green-200 p-8 rounded-2xl shadow-xl min-h-[600px] relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-green-800 mb-2">Your Money Tree 🌳</h2>
          <div className="text-lg text-green-700">
            <span className="font-semibold">Health: </span>
            <span className={`px-3 py-1 rounded-full text-white ${
              getTreeHealth() === 'Excellent' ? 'bg-green-600' :
              getTreeHealth() === 'Good' ? 'bg-blue-600' :
              getTreeHealth() === 'Fair' ? 'bg-yellow-600' : 'bg-red-600'
            }`}>
              {getTreeHealth()}
            </span>
          </div>
        </div>

        {/* Tree Container */}
        <div className="flex-1 flex items-end justify-center relative">
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-green-800 to-green-600 rounded-b-2xl"></div>
          
          {/* Tree SVG */}
          <svg 
            width="600" 
            height={treeHeight + 100}
            className="transition-all duration-1000 ease-out"
            style={{ marginBottom: '48px' }}
          >
            {/* Trunk */}
            <rect
              x={300 - trunkWidth/2}
              y={treeHeight - 50}
              width={trunkWidth}
              height={50}
              fill={colors.trunk}
              rx={trunkWidth/4}
            />
            
            {/* Main trunk going up */}
            <rect
              x={300 - trunkWidth/3}
              y={treeHeight - 100}
              width={trunkWidth * 2/3}
              height={100}
              fill={colors.trunk}
              rx={trunkWidth/6}
            />
            
            {/* Leaves - Multiple circles for fullness */}
            {Array.from({ length: leafCount }).map((_, i) => {
              const angle = (i * 360) / leafCount
              const radius = 80 + (i % 3) * 20
              const x = 300 + Math.cos(angle * Math.PI / 180) * (radius - i * 2)
              const y = treeHeight - 150 + Math.sin(angle * Math.PI / 180) * (radius - i * 2)
              const size = 30 + (leafCount - i) * 2
              
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={size}
                  fill={colors.leaves}
                  opacity={0.7 + (i % 3) * 0.1}
                  className="transition-all duration-1000"
                />
              )
            })}
            
            {/* Central large leaf cluster */}
            <circle
              cx={300}
              cy={treeHeight - 150}
              r={100 + leafCount * 2}
              fill={colors.leaves}
              opacity={0.9}
              className="transition-all duration-1000"
            />
            
            {/* Fruits - hanging from branches when savings are high */}
            {Array.from({ length: fruitCount }).map((_, i) => {
              // If high savings, fruits hang from branch ends
              if (savings > 20000) {
                const branchPositions = [
                  { x: 210, y: treeHeight - 125 }, // Left branch end
                  { x: 390, y: treeHeight - 125 }, // Right branch end
                  { x: 240, y: treeHeight - 125 }, // Upper left (if exists)
                  { x: 360, y: treeHeight - 125 }, // Upper right (if exists)
                ]
                
                const branchIndex = i % branchPositions.length
                const branch = branchPositions[branchIndex]
                const hangOffset = (i % 3) * 15 // Stagger hanging fruits
                
                return (
                  <g key={`fruit-${i}`}>
                    {/* Fruit stem */}
                    <line
                      x1={branch.x}
                      y1={branch.y}
                      x2={branch.x + hangOffset - 7}
                      y2={branch.y + 15 + (i % 2) * 8}
                      stroke={colors.trunk}
                      strokeWidth="1"
                    />
                    {/* Hanging fruit */}
                    <circle
                      cx={branch.x + hangOffset - 7}
                      cy={branch.y + 20 + (i % 2) * 8}
                      r={6 + (i % 2)}
                      fill={colors.fruits}
                      className="transition-all duration-1000"
                    />
                  </g>
                )
              } else {
                // Regular fruit positioning for lower savings
                const angle = (i * 360) / fruitCount + 45
                const radius = 50 + (i % 2) * 20
                const x = 300 + Math.cos(angle * Math.PI / 180) * radius
                const y = treeHeight - 120 + Math.sin(angle * Math.PI / 180) * radius
                
                return (
                  <circle
                    key={`fruit-${i}`}
                    cx={x}
                    cy={y}
                    r={6}
                    fill={colors.fruits}
                    className="transition-all duration-1000"
                  />
                )
              }
            })}

            {/* Tree branches - fewer, more natural branches */}
            {leafCount > 5 && (
              <g stroke={colors.trunk} strokeWidth="3" fill="none" id="tree-branches">
                {/* Main left branch */}
                <path d={`M ${300 - trunkWidth/4} ${treeHeight - 75} Q 250 ${treeHeight - 95} 210 ${treeHeight - 125}`} />
                {/* Main right branch */}
                <path d={`M ${300 + trunkWidth/4} ${treeHeight - 75} Q 350 ${treeHeight - 95} 390 ${treeHeight - 125}`} />
                {/* Upper branches only if high savings */}
                {savings > 30000 && (
                  <>
                    <path d={`M ${300 - trunkWidth/6} ${treeHeight - 90} Q 270 ${treeHeight - 105} 240 ${treeHeight - 125}`} />
                    <path d={`M ${300 + trunkWidth/6} ${treeHeight - 90} Q 330 ${treeHeight - 105} 360 ${treeHeight - 125}`} />
                  </>
                )}
              </g>
            )}
          </svg>
          
          {/* Growth Stats */}
          <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-3 text-sm shadow-lg">
            <div className="font-bold text-green-800 mb-2">Tree Stats</div>
            <div className="space-y-1 text-xs">
              <div>Height: <span className="font-medium">{Math.round(treeHeight)}px</span></div>
              <div>Trunk: <span className="font-medium">{Math.round(trunkWidth)}px</span></div>
              <div>Leaves: <span className="font-medium">{leafCount}</span></div>
              <div>Fruits: <span className="font-medium">{fruitCount}</span></div>
              <div>Wealth: <span className="font-medium">₹{totalWealth.toLocaleString()}</span></div>
            </div>
          </div>
          
          {/* Growth encouragement */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-white/90 rounded-full px-4 py-2 shadow-lg">
              <div className="text-sm text-green-700">
                {totalWealth < 50000 ? "💰 Add more income to grow your tree!" :
                 totalWealth < 100000 ? "🌱 Your tree is growing nicely!" :
                 totalWealth < 500000 ? "🌳 Excellent! Keep building wealth!" :
                 "🏆 Amazing! You have a mighty money tree!"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Financial Advisory */}
      <FinancialAdvisorySystem 
        balance={balance}
        income={income}
        expenses={expenses}
        savings={savings}
        treeHealth={getTreeHealth()}
      />
    </div>
  )
}

// Simple Financial Advisory System
const FinancialAdvisorySystem: React.FC<{ 
  balance: number, 
  income: number, 
  expenses: number, 
  savings: number,
  treeHealth: string 
}> = ({ balance, income, expenses, savings, treeHealth }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'tips' | 'chat'>('analysis')
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<{message: string, response: string}[]>([])
  
  const netIncome = income - expenses
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
  
  const getAdvice = () => {
    const advice = []
    
    if (netIncome <= 0) {
      advice.push({
        icon: '🚨',
        title: 'Urgent: Expenses exceed income!',
        message: `You're spending ₹${Math.abs(netIncome).toLocaleString()} more than you earn`,
        action: 'Cut unnecessary expenses immediately and find additional income sources'
      })
    }
    
    if (savingsRate < 10) {
      advice.push({
        icon: '💰',
        title: 'Low savings rate',
        message: `You're only saving ${savingsRate.toFixed(1)}% of income`,
        action: 'Aim to save at least 20% of your income for better tree growth'
      })
    }
    
    if (balance < 0) {
      advice.push({
        icon: '⚠️',
        title: 'Negative balance detected',
        message: `You have ₹${Math.abs(balance).toLocaleString()} in debt`,
        action: 'Focus on debt repayment before investing'
      })
    }
    
    if (advice.length === 0) {
      advice.push({
        icon: '✅',
        title: 'Great financial health!',
        message: `Your tree is ${treeHealth.toLowerCase()} with ₹${(balance + savings).toLocaleString()} wealth`,
        action: 'Consider diversifying investments or increasing income for faster growth'
      })
    }
    
    return advice
  }
  
  const handleChatSubmit = () => {
    if (!chatMessage.trim()) return
    
    let response = ''
    const msg = chatMessage.toLowerCase()
    
    if (msg.includes('grow') || msg.includes('bigger')) {
      response = `To grow your tree faster: 1) Increase income, 2) Save more money, 3) Reduce expenses. Your current wealth is ₹${(balance + savings).toLocaleString()}`
    } else if (msg.includes('save')) {
      response = `You're currently saving ${savingsRate.toFixed(1)}% of income. Try to reach 20% for excellent tree growth!`
    } else if (msg.includes('income')) {
      response = `Your income is ₹${income.toLocaleString()}. Consider side hustles, skill upgrades, or job changes to increase it.`
    } else {
      response = `Your tree health is ${treeHealth}! Keep adding income and savings to watch it grow. Current wealth: ₹${(balance + savings).toLocaleString()}`
    }
    
    setChatHistory(prev => [...prev, { message: chatMessage, response }])
    setChatMessage('')
  }

  return (
    <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'analysis', label: 'AI Analysis', icon: '🤖' },
          { id: 'tips', label: 'Quick Tips', icon: '💡' },
          { id: 'chat', label: 'Ask AI', icon: '💬' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="mr-2">🤖</span>
            Financial Analysis
          </h3>
          
          <div className="space-y-3">
            {getAdvice().map((advice, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{advice.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800">{advice.title}</h4>
                    <p className="text-sm text-blue-700 mt-1">{advice.message}</p>
                    <div className="mt-2 bg-blue-100 rounded-md p-2">
                      <p className="text-sm font-medium text-blue-800">Action: {advice.action}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === 'tips' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="mr-2">💡</span>
            Quick Growth Tips
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">🌱 Grow Faster</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Increase monthly income</li>
                <li>• Save 20%+ of earnings</li>
                <li>• Reduce unnecessary expenses</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">🍎 Bear Fruit</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Build emergency fund</li>
                <li>• Invest in mutual funds</li>
                <li>• Track all expenses</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="mr-2">💬</span>
            Ask Your Financial AI
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto space-y-3">
            {chatHistory.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <div className="text-2xl mb-2">🤖</div>
                <p className="text-sm">Ask me how to grow your money tree!</p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} className="space-y-2">
                  <div className="bg-blue-100 rounded-lg p-3 ml-8">
                    <p className="text-sm text-blue-800">{chat.message}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 mr-8 border">
                    <p className="text-sm text-gray-800">{chat.response}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask: How can I grow my tree faster?"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleChatSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TreeVisualization