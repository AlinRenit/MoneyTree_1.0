import React, { useEffect, useState } from 'react'

interface Transaction {
  id: string
  amount: number
  category: 'income' | 'expense' | 'saving'
  description: string
  date: Date
}

interface FinancialStoryPanelProps {
  balance: number
  income: number
  expenses: number
  savings: number
  transactions: Transaction[]
}

interface Story {
  title: string
  message: string
  emoji: string
  type: 'achievement' | 'warning' | 'tip' | 'milestone'
  timestamp: Date
}

const FinancialStoryPanel: React.FC<FinancialStoryPanelProps> = ({ 
  balance, 
  income, 
  expenses, 
  savings, 
  transactions 
}) => {
  const [stories, setStories] = useState<Story[]>([])

  useEffect(() => {
    generateStories()
  }, [balance, income, expenses, savings, transactions])

  const generateStories = () => {
    const newStories: Story[] = []
    const now = new Date()

    // Balance-based stories
    if (balance > 10000) {
      newStories.push({
        title: "Tree is Flourishing! 🌳",
        message: "Your financial tree is in excellent health with over $10,000 in your garden! Keep nurturing it with consistent savings.",
        emoji: "🎉",
        type: "achievement",
        timestamp: now
      })
    } else if (balance > 5000) {
      newStories.push({
        title: "Growing Strong 🌱",
        message: "Your money tree is growing steadily. Consider adding more nutrients (savings) to help it reach full bloom!",
        emoji: "📈",
        type: "tip",
        timestamp: now
      })
    } else if (balance < 0) {
      newStories.push({
        title: "Tree Needs Water! 💧",
        message: "Your financial tree is experiencing drought. Time to focus on income and reduce expenses to bring it back to health.",
        emoji: "⚠️",
        type: "warning",
        timestamp: now
      })
    }

    // Savings rate analysis
    const savingsRate = income > 0 ? (savings / income) * 100 : 0
    if (savingsRate > 20) {
      newStories.push({
        title: "Savings Superstar! ⭐",
        message: `Amazing! You're saving ${savingsRate.toFixed(1)}% of your income. Your tree is growing golden fruits of financial security!`,
        emoji: "🏆",
        type: "achievement",
        timestamp: now
      })
    } else if (savingsRate > 10) {
      newStories.push({
        title: "Good Progress 🌟",
        message: `You're saving ${savingsRate.toFixed(1)}% - that's great progress! Try to reach 20% to make your tree truly golden.`,
        emoji: "👍",
        type: "tip",
        timestamp: now
      })
    } else if (savingsRate < 5 && income > 0) {
      newStories.push({
        title: "Plant More Seeds 🌰",
        message: "Your tree could use more seeds (savings) to grow stronger. Even small amounts help!",
        emoji: "🌰",
        type: "tip",
        timestamp: now
      })
    }

    // Recent transaction insights
    const recentTransactions = transactions.slice(0, 5)
    const recentExpenses = recentTransactions.filter(t => t.category === 'expense')
    
    if (recentExpenses.length > 3) {
      newStories.push({
        title: "Leaf Alert 🍃",
        message: "You've had several expenses recently. Your tree is shedding some leaves - time to balance with some income or savings!",
        emoji: "🍂",
        type: "warning",
        timestamp: now
      })
    }

    // Milestone celebrations
    if (transactions.length === 10) {
      newStories.push({
        title: "First Branch! 🌿",
        message: "Congratulations on your 10th transaction! Your financial journey is taking root.",
        emoji: "🎊",
        type: "milestone",
        timestamp: now
      })
    }

    // AI suggestions
    if (expenses > income * 0.9 && income > 0) {
      newStories.push({
        title: "Pruning Suggestion ✂️",
        message: "Your expenses are close to your income. Consider pruning some unnecessary expenses to help your tree grow stronger.",
        emoji: "✂️",
        type: "tip",
        timestamp: now
      })
    }

    // Goal suggestions
    if (balance > 1000 && savings < 500) {
      newStories.push({
        title: "Emergency Branch 🛡️",
        message: "Great balance! Consider growing an emergency fund branch for financial resilience.",
        emoji: "🛡️",
        type: "tip",
        timestamp: now
      })
    }

    setStories(newStories.slice(0, 5)) // Keep only the 5 most recent stories
  }

  const getStoryColor = (type: Story['type']) => {
    switch (type) {
      case 'achievement': return 'bg-green-50 border-green-200 text-green-800'
      case 'warning': return 'bg-red-50 border-red-200 text-red-800'
      case 'tip': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'milestone': return 'bg-purple-50 border-purple-200 text-purple-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getStoryIcon = (type: Story['type']) => {
    switch (type) {
      case 'achievement': return '🏆'
      case 'warning': return '⚠️'
      case 'tip': return '💡'
      case 'milestone': return '🎯'
      default: return '📝'
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your Financial Story</h2>
        <div className="text-sm text-gray-600">AI insights about your money tree journey</div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg">
          <div className="text-sm text-green-700 font-medium">Tree Health Score</div>
          <div className="text-2xl font-bold text-green-800">
            {balance > 5000 ? '🌟' : balance > 1000 ? '⭐' : '🌱'} 
            {balance > 5000 ? 'Excellent' : balance > 1000 ? 'Good' : 'Growing'}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-3 rounded-lg">
          <div className="text-sm text-blue-700 font-medium">Savings Rate</div>
          <div className="text-2xl font-bold text-blue-800">
            {income > 0 ? `${((savings / income) * 100).toFixed(1)}%` : '0%'}
          </div>
        </div>
      </div>

      {/* Stories */}
      <div className="flex-1 overflow-hidden">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Insights</h3>
        <div className="space-y-3 overflow-y-auto max-h-80">
          {stories.map((story, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getStoryColor(story.type)} transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{story.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-sm">{story.title}</h4>
                    <span className="text-xs">{getStoryIcon(story.type)}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{story.message}</p>
                  <div className="text-xs opacity-70 mt-2">
                    {story.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {stories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🤖</div>
              <div className="text-sm">AI is analyzing your financial patterns...</div>
              <div className="text-xs mt-2">Add more transactions to get personalized insights!</div>
            </div>
          )}
        </div>
      </div>

      {/* Action Suggestions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-2 text-xs bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-200 text-green-800">
            💰 Add Income
          </button>
          <button className="p-2 text-xs bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200 text-blue-800">
            🌱 Save Money
          </button>
          <button className="p-2 text-xs bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors duration-200 text-yellow-800">
            🎯 Set Goal
          </button>
          <button className="p-2 text-xs bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors duration-200 text-purple-800">
            📊 View Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinancialStoryPanel
