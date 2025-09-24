import React, { useState, useEffect } from 'react'

interface TreeVisualizationProps {
  balance: number
  income: number
  expenses: number
  savings: number
}

interface FinancialAdvisorySystemProps {
  balance: number
  income: number
  expenses: number
  savings: number
  treeHealth: 'excellent' | 'good' | 'fair' | 'poor'
  season: 'spring' | 'summer' | 'autumn' | 'winter'
}

const FinancialAdvisorySystem: React.FC<FinancialAdvisorySystemProps> = ({
  balance, income, expenses, savings, treeHealth, season
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'warnings' | 'chat' | 'stats'>('analysis')
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<{message: string, response: string, timestamp: Date}[]>([])

  // Financial Analysis Logic
  const getFinancialAnalysis = () => {
    const netIncome = income - expenses
    const savingsRate = income > 0 ? (netIncome / income) * 100 : 0
    const expenseRatio = income > 0 ? (expenses / income) * 100 : 0
    const burnRate = expenses / 30 // Daily burn rate
    const emergencyFundMonths = savings / expenses

    return {
      netIncome,
      savingsRate,
      expenseRatio,
      burnRate,
      emergencyFundMonths,
      debtToIncomeRatio: balance < 0 ? Math.abs(balance) / income * 100 : 0
    }
  }

  const analysis = getFinancialAnalysis()

  const getAdviceAndSuggestions = () => {
    const advice = []
    
    // Income-based advice
    if (income < 50000) {
      advice.push({
        type: 'income',
        icon: '💰',
        title: 'Boost Your Income',
        message: 'Your income is below ₹50K. Consider upskilling, freelancing, or exploring higher-paying opportunities.',
        action: 'Apply for 2-3 new jobs this month or start a side hustle'
      })
    }

    // Savings rate advice
    if (analysis.savingsRate < 20) {
      advice.push({
        type: 'savings',
        icon: '🏦',
        title: 'Improve Savings Rate',
        message: `Your savings rate is ${analysis.savingsRate.toFixed(1)}%. Aim for at least 20% for healthy financial growth.`,
        action: 'Automate ₹10,000 monthly transfer to savings account'
      })
    }

    // Emergency fund advice
    if (analysis.emergencyFundMonths < 3) {
      advice.push({
        type: 'emergency',
        icon: '🆘',
        title: 'Build Emergency Fund',
        message: `You have only ${analysis.emergencyFundMonths.toFixed(1)} months of emergency funds. Build 6-12 months of expenses.`,
        action: 'Save ₹15,000 monthly until you reach ₹3L emergency fund'
      })
    }

    // Expense management
    if (analysis.expenseRatio > 70) {
      advice.push({
        type: 'expenses',
        icon: '✂️',
        title: 'Cut Unnecessary Expenses',
        message: `${analysis.expenseRatio.toFixed(1)}% of income goes to expenses. Reduce to under 70% for better savings.`,
        action: 'Track expenses for 30 days and cut 15% from discretionary spending'
      })
    }

    return advice
  }

  const getWarningsAndConsequences = () => {
    const warnings = []

    // Critical financial warnings
    if (balance < 0) {
      warnings.push({
        severity: 'critical',
        icon: '🚨',
        title: 'Negative Balance Alert!',
        consequence: 'Debt accumulation, damaged credit score, stress, limited financial options',
        timeframe: 'Immediate action required',
        impact: 'Your tree is dying! 🥀'
      })
    }

    if (analysis.savingsRate < 10) {
      warnings.push({
        severity: 'high',
        icon: '⚠️',
        title: 'Poor Savings Habit',
        consequence: 'No retirement fund, unable to handle emergencies, missed investment opportunities',
        timeframe: '5-10 years: Severe financial stress',
        impact: 'Tree growth will stagnate 📉'
      })
    }

    if (expenses > income) {
      warnings.push({
        severity: 'critical',
        icon: '💸',
        title: 'Spending More Than Earning',
        consequence: 'Increasing debt, potential bankruptcy, lifestyle downgrade required',
        timeframe: '6-12 months: Financial crisis',
        impact: 'Tree will wither and die! ☠️'
      })
    }

    if (analysis.emergencyFundMonths < 1) {
      warnings.push({
        severity: 'high',
        icon: '🆘',
        title: 'No Emergency Buffer',
        consequence: 'One unexpected expense could lead to debt or financial hardship',
        timeframe: 'Any moment: Vulnerable to crisis',
        impact: 'Tree susceptible to storms ⛈️'
      })
    }

    return warnings
  }

  const handleChatSubmit = () => {
    if (!chatMessage.trim()) return

    // AI Response Logic based on financial data
    let response = ''
    const msg = chatMessage.toLowerCase()

    if (msg.includes('save') || msg.includes('savings')) {
      response = `Based on your current savings rate of ${analysis.savingsRate.toFixed(1)}%, I recommend increasing your monthly savings by ₹${Math.max(5000, income * 0.1).toLocaleString()}. This will help your tree grow ${analysis.savingsRate < 10 ? '3x faster!' : 'steadily.'}`
    } else if (msg.includes('income') || msg.includes('earn')) {
      response = `Your current income is ₹${income.toLocaleString()}. To reach the next tree level, consider increasing income by 20%. Focus on skills like digital marketing, coding, or consulting.`
    } else if (msg.includes('expense') || msg.includes('spend')) {
      response = `Your expenses are ${analysis.expenseRatio.toFixed(1)}% of income. Cut ₹${Math.max(2000, expenses * 0.1).toLocaleString()} monthly from discretionary spending to improve tree health.`
    } else if (msg.includes('invest') || msg.includes('investment')) {
      response = `With ₹${savings.toLocaleString()} in savings, consider investing 60% in equity mutual funds and 40% in debt funds for balanced growth. Your tree will thank you! 🌳`
    } else if (msg.includes('debt') || msg.includes('loan')) {
      if (balance < 0) {
        response = `You have ₹${Math.abs(balance).toLocaleString()} in debt. Focus on clearing high-interest debt first. Pay extra ₹5,000 monthly to clear debt 2x faster.`
      } else {
        response = 'Great! You\'re debt-free. Maintain this by avoiding unnecessary loans and building emergency funds.'
      }
    } else {
      response = `Based on your tree health (${treeHealth}), focus on: ${treeHealth === 'poor' ? 'reducing expenses and increasing income' : treeHealth === 'fair' ? 'building emergency fund and investing' : 'diversifying investments and tax planning'}. Your tree is in ${season} season! 🌱`
    }

    setChatHistory(prev => [...prev, {
      message: chatMessage,
      response,
      timestamp: new Date()
    }])
    setChatMessage('')
  }

  return (
    <div className="mt-4 bg-white/90 rounded-2xl p-4 backdrop-blur-sm border border-white/50 shadow-lg">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'analysis', label: 'AI Analysis', icon: '🤖' },
          { id: 'warnings', label: 'Warnings', icon: '⚠️' },
          { id: 'chat', label: 'Ask AI', icon: '💬' },
          { id: 'stats', label: 'Statistics', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
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

      {/* AI Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="mr-2">🤖</span>
            AI Financial Advisor
          </h3>
          
          <div className="space-y-3">
            {getAdviceAndSuggestions().map((advice, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{advice.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800 text-sm">{advice.title}</h4>
                    <p className="text-xs text-blue-700 mt-1">{advice.message}</p>
                    <div className="mt-2 bg-blue-100 rounded-md p-2">
                      <p className="text-xs font-medium text-blue-800">Action Plan:</p>
                      <p className="text-xs text-blue-700">{advice.action}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings Tab */}
      {activeTab === 'warnings' && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="mr-2">⚠️</span>
            Financial Warnings & Consequences
          </h3>
          
          <div className="space-y-3">
            {getWarningsAndConsequences().map((warning, index) => (
              <div key={index} className={`border rounded-lg p-3 ${
                warning.severity === 'critical' ? 'bg-red-50 border-red-300' : 'bg-orange-50 border-orange-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{warning.icon}</span>
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${
                      warning.severity === 'critical' ? 'text-red-800' : 'text-orange-800'
                    }`}>{warning.title}</h4>
                    <div className="mt-2 space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Consequences:</p>
                        <p className={`text-xs ${warning.severity === 'critical' ? 'text-red-700' : 'text-orange-700'}`}>
                          {warning.consequence}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Timeline:</p>
                        <p className={`text-xs ${warning.severity === 'critical' ? 'text-red-700' : 'text-orange-700'}`}>
                          {warning.timeframe}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Tree Impact:</p>
                        <p className={`text-xs ${warning.severity === 'critical' ? 'text-red-700' : 'text-orange-700'}`}>
                          {warning.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {getWarningsAndConsequences().length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <span className="text-4xl block mb-2">✅</span>
                <p className="text-green-800 font-medium text-sm">No Critical Warnings!</p>
                <p className="text-green-700 text-xs">Your financial tree is healthy and growing well.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Chat Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="mr-2">💬</span>
            Ask Your Financial AI
          </h3>
          
          {/* Chat History */}
          <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto space-y-3">
            {chatHistory.length === 0 ? (
              <div className="text-center py-4">
                <span className="text-4xl block mb-2">🤖</span>
                <p className="text-gray-600 text-sm">Ask me anything about your finances!</p>
                <p className="text-gray-500 text-xs">Try: "How can I save more?" or "Should I invest?"</p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div key={index} className="space-y-2">
                  <div className="bg-blue-100 rounded-lg p-2 ml-8">
                    <p className="text-sm text-blue-800">{chat.message}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 mr-8 border">
                    <p className="text-sm text-gray-800">{chat.response}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {chat.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask about savings, investments, debt..."
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

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="mr-2">📊</span>
            Financial Statistics
          </h3>
          
          {/* Key Ratios */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analysis.savingsRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Savings Rate</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, analysis.savingsRate)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {analysis.expenseRatio.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Expense Ratio</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, analysis.expenseRatio)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Health Meter */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Financial Health Meter</h4>
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
              <div className="w-full bg-gradient-to-r from-red-300 via-yellow-300 via-green-300 to-blue-300 rounded-full h-4 relative">
                <div 
                  className="absolute top-0 h-4 w-4 bg-white border-2 border-gray-600 rounded-full transform -translate-x-1/2 transition-all duration-500"
                  style={{ 
                    left: `${
                      treeHealth === 'poor' ? '12.5%' :
                      treeHealth === 'fair' ? '37.5%' :
                      treeHealth === 'good' ? '62.5%' : '87.5%'
                    }` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">Monthly Breakdown</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Income</span>
                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <span className="text-sm font-medium">₹{income.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expenses</span>
                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${income > 0 ? (expenses / income) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">₹{expenses.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Savings</span>
                <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${income > 0 ? (savings / income) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">₹{savings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ 
  balance, 
  income, 
  expenses, 
  savings 
}) => {
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring')
  const [treeHealth, setTreeHealth] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good')

  // Determine tree health and season
  useEffect(() => {
    const netIncome = income - expenses
    const savingsRate = income > 0 ? (netIncome / income) * 100 : 0
    
    if (balance >= 800000 && savingsRate >= 20) {
      setTreeHealth('excellent')
      setSeason('summer')
    } else if (balance >= 400000 && savingsRate >= 10) {
      setTreeHealth('good') 
      setSeason('spring')
    } else if (balance >= 80000 && savingsRate >= 5) {
      setTreeHealth('fair')
      setSeason('autumn')
    } else {
      setTreeHealth('poor')
      setSeason('winter')
    }
  }, [balance, income, expenses])

  // Calculate dynamic tree growth metrics (adjusted for Indian Rupees)
  const treeHeight = Math.max(80, Math.min(180, balance / 2500 + 80))
  const branchCount = Math.max(3, Math.min(8, Math.floor(income / 50000) + 3))
  const foliageSize = Math.max(0.6, Math.min(1.5, (balance + savings) / 500000 + 0.6))
  const trunkThickness = Math.max(8, Math.min(20, balance / 80000 + 8))
  const fruitCount = Math.max(0, Math.min(40, Math.floor(savings / 15000)))

  return (
    <div className="bg-gradient-to-b from-sky-200 via-green-100 to-amber-50 p-6 rounded-lg shadow-lg h-96 relative overflow-hidden">
      <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">Your Money Tree</h2>
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="relative">
          
          {/* EXACT REPLICA OF REFERENCE IMAGE */}
          <svg 
            width="300" 
            height="300" 
            viewBox="0 0 300 300" 
            className="drop-shadow-2xl transition-all duration-1000 ease-out"
            style={{ transform: `scale(${0.8 + foliageSize * 0.2})` }}
          >
            {/* DYNAMIC GROWING TRUNK - gets taller and thicker with more money */}
            <path 
              d={`M ${140 - trunkThickness/4} 290 
                 Q ${135 - trunkThickness/6} 270 ${138 - trunkThickness/8} 250
                 Q ${134 - trunkThickness/8} 230 ${136 - trunkThickness/10} 210
                 Q ${132 - trunkThickness/10} 190 ${134 - trunkThickness/12} 170
                 Q ${130 - trunkThickness/12} 150 ${132 - trunkThickness/14} 130
                 Q ${128 - trunkThickness/14} 110 ${130 - trunkThickness/16} 90
                 Q ${126 - trunkThickness/16} 70 ${128 - trunkThickness/18} ${290 - treeHeight}
                 L ${142 + trunkThickness/18} ${290 - treeHeight}
                 Q ${144 + trunkThickness/16} 70 ${140 + trunkThickness/16} 90
                 Q ${146 + trunkThickness/14} 110 ${142 + trunkThickness/14} 130
                 Q ${148 + trunkThickness/12} 150 ${144 + trunkThickness/12} 170
                 Q ${150 + trunkThickness/10} 190 ${146 + trunkThickness/10} 210
                 Q ${152 + trunkThickness/8} 230 ${148 + trunkThickness/8} 250
                 Q ${154 + trunkThickness/6} 270 ${149 + trunkThickness/4} 290 Z`}
              fill="#8B4513"
            />
            
            {/* Bark texture lines */}
            <line x1="135" y1="290" x2="137" y2="70" stroke="#A0522D" strokeWidth="2"/>
            <line x1="152" y1="290" x2="150" y2="70" stroke="#A0522D" strokeWidth="2"/>
            <ellipse cx="140" cy="200" rx="3" ry="8" fill="#654321"/>
            <ellipse cx="145" cy="150" rx="2" ry="6" fill="#654321"/>

            {/* DYNAMIC GROWING BRANCHES - grow with income and wealth */}
            <g stroke="#8B4513" fill="none" strokeLinecap="round">
              {/* Main lower branches - get longer with more income */}
              <path d={`M 135 ${200 - (treeHeight - 80)/8} Q ${115 - income/500} ${190 - (treeHeight - 80)/8} ${90 - income/300} ${180 - (treeHeight - 80)/8} Q ${70 - income/400} ${175 - (treeHeight - 80)/8} ${50 - income/600} ${170 - (treeHeight - 80)/8}`} strokeWidth={Math.max(6, 8 + balance/2000)}/>
              <path d={`M 150 ${195 - (treeHeight - 80)/8} Q ${170 + income/500} ${185 - (treeHeight - 80)/8} ${200 + income/300} ${175 - (treeHeight - 80)/8} Q ${220 + income/400} ${170 - (treeHeight - 80)/8} ${240 + income/600} ${165 - (treeHeight - 80)/8}`} strokeWidth={Math.max(6, 8 + balance/2000)}/>
              
              {/* Middle branches - appear with good income */}
              {income > 80000 && (
                <>
                  <path d={`M 132 ${160 - (treeHeight - 80)/6} Q ${112 - income/600} ${150 - (treeHeight - 80)/6} ${85 - income/400} ${140 - (treeHeight - 80)/6} Q ${65 - income/500} ${135 - (treeHeight - 80)/6} ${45 - income/700} ${130 - (treeHeight - 80)/6}`} strokeWidth={Math.max(4, 6 + balance/3000)}/>
                  <path d={`M 148 ${155 - (treeHeight - 80)/6} Q ${168 + income/600} ${145 - (treeHeight - 80)/6} ${200 + income/400} ${135 - (treeHeight - 80)/6} Q ${220 + income/500} ${130 - (treeHeight - 80)/6} ${245 + income/700} ${125 - (treeHeight - 80)/6}`} strokeWidth={Math.max(4, 6 + balance/3000)}/>
                </>
              )}
              
              {/* Upper branches - appear with higher income */}
              {income > 160000 && (
                <>
                  <path d={`M 134 ${120 - (treeHeight - 80)/4} Q ${119 - income/800} ${110 - (treeHeight - 80)/4} ${100 - income/500} ${105 - (treeHeight - 80)/4} Q ${85 - income/600} ${102 - (treeHeight - 80)/4} ${70 - income/800} ${100 - (treeHeight - 80)/4}`} strokeWidth={Math.max(3, 5 + balance/4000)}/>
                  <path d={`M 146 ${115 - (treeHeight - 80)/4} Q ${161 + income/800} ${105 - (treeHeight - 80)/4} ${185 + income/500} ${100 - (treeHeight - 80)/4} Q ${200 + income/600} ${97 - (treeHeight - 80)/4} ${220 + income/800} ${95 - (treeHeight - 80)/4}`} strokeWidth={Math.max(3, 5 + balance/4000)}/>
                </>
              )}
              
              {/* Top branches - appear with excellent income */}
              {income > 4000 && (
                <>
                  <path d={`M 138 ${90 - (treeHeight - 80)/3} Q ${128 - income/1000} ${80 - (treeHeight - 80)/3} ${115 - income/600} ${75 - (treeHeight - 80)/3}`} strokeWidth={Math.max(2, 4 + balance/5000)}/>
                  <path d={`M 142 ${85 - (treeHeight - 80)/3} Q ${152 + income/1000} ${75 - (treeHeight - 80)/3} ${170 + income/600} ${70 - (treeHeight - 80)/3}`} strokeWidth={Math.max(2, 4 + balance/5000)}/>
                </>
              )}
            </g>

            {/* DYNAMIC Secondary branch details - grow with savings */}
            <g stroke="#654321" fill="none" strokeLinecap="round" strokeWidth={Math.max(2, 3 + savings/2000)}>
              {savings > 500 && (
                <>
                  <path d={`M ${90 - income/300} ${180 - (treeHeight - 80)/8} Q ${80 - income/400} ${175 - (treeHeight - 80)/8} ${70 - income/500} ${172 - (treeHeight - 80)/8}`}/>
                  <path d={`M ${90 - income/300} ${180 - (treeHeight - 80)/8} Q ${85 - income/400} ${170 - (treeHeight - 80)/8} ${80 - income/500} ${165 - (treeHeight - 80)/8}`}/>
                  <path d={`M ${200 + income/300} ${175 - (treeHeight - 80)/8} Q ${210 + income/400} ${170 - (treeHeight - 80)/8} ${220 + income/500} ${167 - (treeHeight - 80)/8}`}/>
                  <path d={`M ${200 + income/300} ${175 - (treeHeight - 80)/8} Q ${205 + income/400} ${165 - (treeHeight - 80)/8} ${210 + income/500} ${160 - (treeHeight - 80)/8}`}/>
                </>
              )}
              
              {savings > 1500 && income > 1000 && (
                <>
                  <path d={`M ${85 - income/400} ${140 - (treeHeight - 80)/6} Q ${75 - income/500} ${135 - (treeHeight - 80)/6} ${65 - income/600} ${132 - (treeHeight - 80)/6}`}/>
                  <path d={`M ${200 + income/400} ${135 - (treeHeight - 80)/6} Q ${210 + income/500} ${130 - (treeHeight - 80)/6} ${220 + income/600} ${127 - (treeHeight - 80)/6}`}/>
                </>
              )}
            </g>

            {/* DYNAMIC GROWING FOLIAGE - grows with your wealth! */}
            <g>
              {/* Bottom massive foliage cluster - grows with balance */}
              <ellipse cx="150" cy={140 - (treeHeight - 80)/4} rx={95 * foliageSize} ry={80 * foliageSize} fill="#1B5E20" opacity="0.95"/>
              
              {/* Large left foliage mass - grows with savings */}
              <ellipse cx="95" cy={125 - (treeHeight - 80)/5} rx={70 * foliageSize} ry={65 * foliageSize} fill="#2E7D32" opacity="0.9"/>
              
              {/* Large right foliage mass - grows with income */}
              <ellipse cx="205" cy={130 - (treeHeight - 80)/5} rx={75 * foliageSize} ry={70 * foliageSize} fill="#1B5E20" opacity="0.9"/>
              
              {/* Top center huge cluster - grows with total wealth */}
              <ellipse cx="150" cy={90 - (treeHeight - 80)/3} rx={60 * foliageSize} ry={55 * foliageSize} fill="#388E3C" opacity="0.95"/>
              
              {/* Upper left dense cluster */}
              <ellipse cx="105" cy={100 - (treeHeight - 80)/4} rx={45 * foliageSize} ry={42 * foliageSize} fill="#2E7D32" opacity="0.9"/>
              
              {/* Upper right dense cluster */}
              <ellipse cx="195" cy={95 - (treeHeight - 80)/4} rx={50 * foliageSize} ry={47 * foliageSize} fill="#1B5E20" opacity="0.9"/>
              
              {/* Small top clusters - appear with good income */}
              {income > 2000 && (
                <>
                  <ellipse cx="130" cy={75 - (treeHeight - 80)/3} rx={30 * foliageSize} ry={28 * foliageSize} fill="#4CAF50" opacity="0.9"/>
                  <ellipse cx="170" cy={70 - (treeHeight - 80)/3} rx={35 * foliageSize} ry={32 * foliageSize} fill="#388E3C" opacity="0.9"/>
                </>
              )}
              
              {/* Middle overlapping layers for ultra-fullness */}
              <ellipse cx="150" cy={125 - (treeHeight - 80)/5} rx={80 * foliageSize} ry={65 * foliageSize} fill="#2E7D32" opacity="0.8"/>
              <ellipse cx="120" cy={110 - (treeHeight - 80)/4} rx={50 * foliageSize} ry={45 * foliageSize} fill="#388E3C" opacity="0.85"/>
              <ellipse cx="180" cy={115 - (treeHeight - 80)/4} rx={55 * foliageSize} ry={50 * foliageSize} fill="#2E7D32" opacity="0.85"/>
              
              {/* Bright highlights for natural depth - appear with high balance */}
              {balance > 5000 && (
                <>
                  <ellipse cx="140" cy={105 - (treeHeight - 80)/4} rx={35 * foliageSize} ry={30 * foliageSize} fill="#66BB6A" opacity="0.7"/>
                  <ellipse cx="165" cy={100 - (treeHeight - 80)/4} rx={30 * foliageSize} ry={25 * foliageSize} fill="#81C784" opacity="0.6"/>
                  <ellipse cx="150" cy={115 - (treeHeight - 80)/4} rx={25 * foliageSize} ry={20 * foliageSize} fill="#A5D6A7" opacity="0.5"/>
                </>
              )}
              
              {/* Extra density clusters - appear with excellent finances */}
              {balance > 10000 && (
                <>
                  <ellipse cx="110" cy={135 - (treeHeight - 80)/5} rx={40 * foliageSize} ry={35 * foliageSize} fill="#2E7D32" opacity="0.8"/>
                  <ellipse cx="190" cy={140 - (treeHeight - 80)/5} rx={45 * foliageSize} ry={40 * foliageSize} fill="#1B5E20" opacity="0.8"/>
                </>
              )}
            </g>

            {/* DYNAMIC GROWING FRUITS - more fruits = more savings! */}
            <g>
              {/* Basic fruits appear with any savings */}
              {savings > 100 && (
                <>
                  <circle cx="125" cy={115 - (treeHeight - 80)/4} r={4 + foliageSize} fill="#FF6347"/>
                  <circle cx="140" cy={130 - (treeHeight - 80)/5} r={3 + foliageSize} fill="#FF4500"/>
                  <circle cx="165" cy={120 - (treeHeight - 80)/4} r={4 + foliageSize} fill="#FFA500"/>
                  <circle cx="150" cy={100 - (treeHeight - 80)/4} r={4 + foliageSize} fill="#FF4500"/>
                </>
              )}
              
              {/* More fruits with moderate savings */}
              {savings > 500 && (
                <>
                  <circle cx="185" cy={140 - (treeHeight - 80)/5} r={3 + foliageSize} fill="#FF6347"/>
                  <circle cx="160" cy={125 - (treeHeight - 80)/4} r={3 + foliageSize} fill="#FFA500"/>
                  <circle cx="105" cy={130 - (treeHeight - 80)/5} r={3 + foliageSize} fill="#FF6347"/>
                  <circle cx="195" cy={115 - (treeHeight - 80)/4} r={4 + foliageSize} fill="#FF4500"/>
                  <circle cx="135" cy={90 - (treeHeight - 80)/3} r={3 + foliageSize} fill="#FFA500"/>
                  <circle cx="175" cy={105 - (treeHeight - 80)/4} r={4 + foliageSize} fill="#FF6347"/>
                </>
              )}
              
              {/* Abundant fruits with good savings */}
              {savings > 1500 && (
                <>
                  <circle cx="115" cy={110 - (treeHeight - 80)/4} r={3 + foliageSize} fill="#FF4500"/>
                  <circle cx="200" cy={130 - (treeHeight - 80)/5} r={4 + foliageSize} fill="#FFA500"/>
                  <circle cx="145" cy={110 - (treeHeight - 80)/4} r={3 + foliageSize} fill="#FF6347"/>
                  <circle cx="170" cy={135 - (treeHeight - 80)/5} r={4 + foliageSize} fill="#FF4500"/>
                  <circle cx="120" cy={125 - (treeHeight - 80)/4} r={3 + foliageSize} fill="#FFA500"/>
                  <circle cx="180" cy={110 - (treeHeight - 80)/4} r={3 + foliageSize} fill="#FF6347"/>
                  <circle cx="155" cy={115 - (treeHeight - 80)/4} r={4 + foliageSize} fill="#FF4500"/>
                  <circle cx="130" cy={105 - (treeHeight - 80)/4} r={3 + foliageSize} fill="#FFA500"/>
                </>
              )}
              
              {/* Premium fruit abundance with high savings */}
              {savings > 3000 && (
                <>
                  <circle cx="110" cy={120 - (treeHeight - 80)/4} r={2 + foliageSize} fill="#FF6347"/>
                  <circle cx="190" cy={125 - (treeHeight - 80)/4} r={3 + foliageSize} fill="#FF4500"/>
                  <circle cx="165" cy={95 - (treeHeight - 80)/3} r={2 + foliageSize} fill="#FFA500"/>
                  <circle cx="135" cy={135 - (treeHeight - 80)/5} r={3 + foliageSize} fill="#FF6347"/>
                  <circle cx="175" cy={120 - (treeHeight - 80)/4} r={2 + foliageSize} fill="#FF4500"/>
                  <circle cx="145" cy={95 - (treeHeight - 80)/3} r={3 + foliageSize} fill="#FFA500"/>
                </>
              )}
              
              {/* Ultra abundance for wealthy tree */}
              {savings > 5000 && (
                <>
                  <circle cx="205" cy={120 - (treeHeight - 80)/4} r={2 + foliageSize} fill="#FF6347"/>
                  <circle cx="125" cy={100 - (treeHeight - 80)/4} r={3 + foliageSize} fill="#FF4500"/>
                  <circle cx="185" cy={100 - (treeHeight - 80)/4} r={2 + foliageSize} fill="#FFA500"/>
                  <circle cx="155" cy={140 - (treeHeight - 80)/5} r={3 + foliageSize} fill="#FF6347"/>
                  <circle cx="112" cy={98 - (treeHeight - 80)/4} r={2 + foliageSize} fill="#FF4500"/>
                  <circle cx="188" cy={108 - (treeHeight - 80)/4} r={3 + foliageSize} fill="#FFA500"/>
                </>
              )}
            </g>

            {/* Perfect green grass ground like reference */}
            <ellipse cx="150" cy="285" rx="120" ry="20" fill="#1B5E20"/>
            <ellipse cx="150" cy="282" rx="100" ry="16" fill="#2E7D32"/>
            <ellipse cx="150" cy="280" rx="80" ry="12" fill="#388E3C"/>
            <ellipse cx="150" cy="278" rx="60" ry="8" fill="#4CAF50"/>
          </svg>
          
          {/* Falling leaves for autumn */}
          {season === 'autumn' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="text-orange-400 text-sm absolute top-4 left-8 animate-bounce">🍂</div>
              <div className="text-red-400 text-sm absolute top-12 right-12 animate-bounce">🍂</div>
              <div className="text-yellow-400 text-sm absolute top-20 left-16 animate-bounce">🍂</div>
            </div>
          )}
          
          {/* Snow for winter */}
          {season === 'winter' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="text-white text-sm absolute top-4 left-4 animate-pulse">❄️</div>
              <div className="text-white text-sm absolute top-8 right-8 animate-pulse">❄️</div>
              <div className="text-white text-sm absolute top-16 left-12 animate-pulse">❄️</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Financial Health Progress Bar */}
      <div className="mt-4 bg-white/80 rounded-xl p-4 backdrop-blur-sm border border-white/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Financial Health</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Tree Level:</span>
            <span className="text-sm font-bold text-green-600">{Math.floor(balance / 100000) + 1}</span>
          </div>
        </div>
        
        {/* Health Progress Bar */}
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              treeHealth === 'excellent' ? 'bg-gradient-to-r from-green-400 to-green-600' :
              treeHealth === 'good' ? 'bg-gradient-to-r from-blue-400 to-green-500' :
              treeHealth === 'fair' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
              'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            style={{ 
              width: `${Math.min(100, Math.max(10, (balance / 1000000) * 100))}%` 
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white drop-shadow">
              ₹{balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-2xl mb-1">
              {treeHealth === 'excellent' ? '🌟' : 
               treeHealth === 'good' ? '🌱' : 
               treeHealth === 'fair' ? '🍂' : '❄️'}
            </div>
            <div className="text-xs text-gray-600">Status</div>
            <div className="text-xs font-semibold capitalize text-green-600">{treeHealth}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📏</div>
            <div className="text-xs text-gray-600">Height</div>
            <div className="text-xs font-semibold text-blue-600">{Math.round(treeHeight)}px</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🍎</div>
            <div className="text-xs text-gray-600">Fruits</div>
            <div className="text-xs font-semibold text-orange-600">{Math.max(0, Math.floor(savings / 15000))}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🌿</div>
            <div className="text-xs text-gray-600">Size</div>
            <div className="text-xs font-semibold text-purple-600">{foliageSize.toFixed(1)}x</div>
          </div>
        </div>
      </div>

      {/* Growth Milestones & Achievements */}
      <div className="mt-3 bg-white/80 rounded-xl p-4 backdrop-blur-sm border border-white/50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">🏆</span>
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Achievement badges */}
          <div className={`flex items-center p-2 rounded-lg text-xs ${balance >= 100000 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            <span className="mr-2">{balance >= 100000 ? '✅' : '⏳'}</span>
            <span>₹1L Balance</span>
          </div>
          <div className={`flex items-center p-2 rounded-lg text-xs ${savings >= 50000 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
            <span className="mr-2">{savings >= 50000 ? '✅' : '⏳'}</span>
            <span>₹50K Saved</span>
          </div>
          <div className={`flex items-center p-2 rounded-lg text-xs ${income >= 100000 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
            <span className="mr-2">{income >= 100000 ? '✅' : '⏳'}</span>
            <span>₹1L Income</span>
          </div>
          <div className={`flex items-center p-2 rounded-lg text-xs ${treeHealth === 'excellent' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
            <span className="mr-2">{treeHealth === 'excellent' ? '✅' : '⏳'}</span>
            <span>Tree Master</span>
          </div>
        </div>
      </div>

      {/* Financial Tips & Tree Care */}
      <div className="mt-3 bg-white/80 rounded-xl p-4 backdrop-blur-sm border border-white/50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Tree Care Tips
        </h3>
        <div className="text-xs text-gray-600 leading-relaxed">
          {treeHealth === 'excellent' && (
            <div className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">🌟</span>
              <span>Excellent! Your tree is thriving! Consider diversifying your investments for even better growth.</span>
            </div>
          )}
          {treeHealth === 'good' && (
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-0.5">🌱</span>
              <span>Great progress! Try increasing your savings rate to reach the next growth milestone.</span>
            </div>
          )}
          {treeHealth === 'fair' && (
            <div className="flex items-start space-x-2">
              <span className="text-orange-500 mt-0.5">🍂</span>
              <span>Your tree needs attention. Focus on reducing expenses and increasing income to improve health.</span>
            </div>
          )}
          {treeHealth === 'poor' && (
            <div className="flex items-start space-x-2">
              <span className="text-red-500 mt-0.5">❄️</span>
              <span>Time for urgent care! Create a budget, track expenses, and look for additional income sources.</span>
            </div>
          )}
        </div>
        
        {/* Next Milestone */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Next Milestone:</div>
          <div className="text-xs font-medium text-gray-700">
            {balance < 100000 ? `₹${(100000 - balance).toLocaleString()} to reach ₹1L balance` :
             balance < 500000 ? `₹${(500000 - balance).toLocaleString()} to reach ₹5L balance` :
             balance < 1000000 ? `₹${(1000000 - balance).toLocaleString()} to reach ₹10L balance` :
             'You\'ve achieved financial excellence! 🎉'}
          </div>
        </div>
      </div>

      {/* AI Financial Analysis & Advisory System */}
      <FinancialAdvisorySystem 
        balance={balance}
        income={income}
        expenses={expenses}
        savings={savings}
        treeHealth={treeHealth}
        season={season}
      />
      
      {/* Growth Animation Indicator */}
      {(balance > 0 || income > 0 || savings > 0) && (
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">Growing</span>
        </div>
      )}
    </div>
  )
}

export default TreeVisualization